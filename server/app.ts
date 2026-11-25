import express, { type NextFunction, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { Account, canDelete, COLUMNS, createValues, invalid, isTable, pick, readAccess, Role, Table, updateRule } from './permissions.js'
import { COOKIE, cookieValue, createToken, readToken, secret, sessionCookie } from './session.js'

type Query = (text: string, values?: unknown[]) => Promise<{ rows: any[] }>
export type Db = { query: Query; connect: () => Promise<{ query: Query; release: () => void }> }

// Compared against when no account matches, so that response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('no-such-account', 12)

type Handler = (req: Request, res: Response) => Promise<unknown>
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => { handler(req, res).catch(next) }
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const publicAccount = (a: Account): Account => ({ id: a.id, email: a.email, name: a.name, role: a.role })

export function createApp(db: Db) {
  const app = express()
  app.disable('x-powered-by')
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    // Another website can't send JSON here without a CORS preflight, which is never granted.
    if (!['GET', 'HEAD'].includes(req.method) && !req.is('application/json') && req.method !== 'DELETE') {
      return res.status(415).json({ error: 'Requests must be sent as JSON' })
    }
    next()
  })
  app.use(express.json({ limit: '100kb' }))

  /** Loads the signed-in account on every request, so deactivation and role changes apply immediately. */
  async function currentUser(req: Request): Promise<Account | null> {
    const token = cookieValue(req.headers.cookie, COOKIE)
    const session = token ? readToken(token) : null
    if (!session) return null
    const result = await db.query('select id, email, name, password_hash, role, active from public.accounts where id = $1', [session.id])
    const account = result.rows[0]
    return account?.active && session.matches(account.password_hash) ? publicAccount(account) : null
  }

  const signedIn = (handler: (user: Account, req: Request, res: Response) => Promise<unknown>, roles?: Role[]) =>
    route(async (req, res) => {
      const user = await currentUser(req)
      if (!user) return res.status(401).json({ error: 'Please sign in' })
      if (roles && !roles.includes(user.role)) return res.status(403).json({ error: 'You do not have access to this' })
      return handler(user, req, res)
    })

  app.get('/api/health', route(async (_req, res) => {
    await db.query('select 1')
    res.json({ ok: true })
  }))

  app.post('/api/auth/login', route(async (req, res) => {
    const email = text(req.body?.email).toLowerCase()
    const password = String(req.body?.password ?? '')
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
    secret() // fail before checking credentials if sessions can't be issued
    const result = await db.query('select id, email, name, password_hash, role, active from public.accounts where email = $1 limit 1', [email])
    const account = result.rows[0]
    const matches = await bcrypt.compare(password, account?.password_hash ?? DUMMY_HASH)
    if (!account?.active || !matches) return res.status(401).json({ error: 'Invalid email or password' })
    res.set('Set-Cookie', sessionCookie(createToken(account.id, account.password_hash)))
    res.json(publicAccount(account))
  }))

  app.post('/api/auth/logout', (_req, res) => {
    res.set('Set-Cookie', sessionCookie(''))
    res.json({ ok: true })
  })

  app.get('/api/auth/me', signedIn(async (user, _req, res) => res.json(user)))

  app.get('/api/auth/invites', signedIn(async (_user, _req, res) => {
    const result = await db.query('select id, email, role, expires_at, accepted_at, created_at from public.invites order by created_at desc limit 500')
    res.json(result.rows)
  }, ['admin']))

  app.post('/api/auth/invites', signedIn(async (_user, req, res) => {
    const email = text(req.body?.email).toLowerCase()
    const role = text(req.body?.role)
    if (!/^\S+@\S+\.\S+$/.test(email) || !['partner', 'finance'].includes(role)) return res.status(400).json({ error: 'A valid email and role are required' })
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const result = await db.query(
      `insert into public.invites (id, email, role, token_hash, expires_at)
       values ($1, $2, $3, $4, $5) returning id, email, role, expires_at`,
      [`INV-${crypto.randomUUID()}`, email, role, tokenHash, new Date(Date.now() + 7 * 86400000).toISOString()]
    )
    res.status(201).json({ ...result.rows[0], inviteUrl: `/management/accept-invite?token=${token}` })
  }, ['admin']))

  app.post('/api/auth/accept-invite', route(async (req, res) => {
    const token = text(req.body?.token)
    let name = text(req.body?.name).replace(/\s+/g, ' ')
    const password = String(req.body?.password ?? '')
    if (!token || !name || password.length < 8) return res.status(400).json({ error: 'Name and an 8-character password are required' })
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const passwordHash = await bcrypt.hash(password, 12)
    const client = await db.connect()
    const fail = async (status: number, error: string) => { await client.query('rollback'); return res.status(status).json({ error }) }
    try {
      await client.query('begin')
      const found = await client.query('select id, email, role from public.invites where token_hash = $1 and accepted_at is null and expires_at > $2 for update', [tokenHash, new Date().toISOString()])
      const invite = found.rows[0]
      if (!invite) return await fail(400, 'Invite is invalid or expired')
      const existing = await client.query('select id from public.accounts where email = $1', [invite.email])
      if (existing.rows.length) return await fail(409, 'An account with this email already exists')
      // Records are matched to partners by name, so a name must belong to one person only.
      if (invite.role === 'partner') {
        const own = await client.query('select name from public.partners where lower(email) = $1', [invite.email])
        if (own.rows[0]) name = own.rows[0].name
      }
      const takenAccount = await client.query('select id from public.accounts where lower(name) = $1', [name.toLowerCase()])
      const takenPartner = await client.query('select email from public.partners where lower(name) = $1', [name.toLowerCase()])
      if (takenAccount.rows.length || takenPartner.rows.some((p) => p.email.toLowerCase() !== invite.email)) {
        return await fail(409, 'That name is already in use. Ask your administrator for help.')
      }
      const accountId = `USR-${crypto.randomUUID()}`
      await client.query('insert into public.accounts (id, email, name, password_hash, role) values ($1, $2, $3, $4, $5)', [accountId, invite.email, name, passwordHash, invite.role])
      await client.query('update public.invites set accepted_at = $1 where id = $2', [new Date().toISOString(), invite.id])
      await client.query('commit')
      res.status(201).json({ id: accountId, email: invite.email, name, role: invite.role })
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }))

  // Table and column names below only ever come from the fixed lists in permissions.ts.
  const forbidden = (res: Response) => res.status(403).json({ error: 'You do not have access to this' })
  const withTable = (handler: (user: Account, table: Table, req: Request, res: Response) => Promise<unknown>) =>
    signedIn(async (user, req, res) => {
      const table = String(req.params.table)
      if (!isTable(table)) return res.status(404).json({ error: 'Not found' })
      return handler(user, table, req, res)
    })

  app.get('/api/:table', withTable(async (user, table, _req, res) => {
    const access = readAccess(user, table)
    if (!access) return forbidden(res)
    const { scope } = access
    const where = scope ? `where ${scope.column === 'email' ? 'lower(email)' : scope.column} = $1` : ''
    const result = await db.query(`select * from public.${table} ${where} order by created_at desc nulls last limit 500`, scope ? [scope.value] : [])
    res.json(result.rows)
  }))

  app.post('/api/:table', withTable(async (user, table, req, res) => {
    const allowed = createValues(user, table, pick(req.body, COLUMNS[table]))
    if (!allowed) return forbidden(res)
    const keys = Object.keys(allowed)
    if (!keys.length) return res.status(400).json({ error: 'No valid fields supplied' })
    const problem = invalid(table, allowed)
    if (problem) return res.status(400).json({ error: problem })
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const result = await db.query(`insert into public.${table} (${keys.join(', ')}) values (${placeholders}) returning *`, Object.values(allowed))
    res.status(201).json(result.rows[0])
  }))

  app.put('/api/:table/:id', withTable(async (user, table, req, res) => {
    const body = pick(req.body, COLUMNS[table].filter((c) => c !== 'id'))
    // Reject rather than silently drop fields, so a partner can't half-apply a forbidden change.
    const rule = updateRule(user, table, user.role === 'admin' ? body : req.body ?? {})
    if (!rule) return forbidden(res)
    const keys = Object.keys(rule.values)
    if (!keys.length) return res.status(400).json({ error: 'No valid fields supplied' })
    const problem = invalid(table, rule.values)
    if (problem) return res.status(400).json({ error: problem })
    const values: unknown[] = Object.values(rule.values)
    const set = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    values.push(String(req.params.id))
    const conditions = [`id = $${values.length}`]
    for (const condition of rule.where) {
      const marks = condition.in.map((v) => { values.push(v); return `$${values.length}` })
      conditions.push(`${condition.column} in (${marks.join(', ')})`)
    }
    const result = await db.query(`update public.${table} set ${set} where ${conditions.join(' and ')} returning *`, values)
    if (!result.rows.length) return res.status(404).json({ error: 'Record not found' })
    res.json(result.rows[0])
  }))

  app.delete('/api/:table/:id', withTable(async (user, table, req, res) => {
    if (!canDelete(user, table)) return forbidden(res)
    const result = await db.query(`delete from public.${table} where id = $1 returning id`, [String(req.params.id)])
    if (!result.rows.length) return res.status(404).json({ error: 'Record not found' })
    res.status(204).end()
  }))

  app.use('/api', (_req, res) => { res.status(404).json({ error: 'Not found' }) })

  // Details go to the server log only; database errors can reveal the schema.
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    if (error?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' })
    if (error?.code === '23505') return res.status(409).json({ error: 'That record already exists' })
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  })

  return app
}
