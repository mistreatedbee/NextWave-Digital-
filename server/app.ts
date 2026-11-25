import express, { type NextFunction, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { isTable, ONBOARDING_ITEMS, resource, rights } from '../shared/resources.js'
import { Account, Body, prepare, readAccess, Role, rule, Table } from './permissions.js'
import { loginAttempt, WINDOW_MINUTES } from './rate-limit.js'
import { reminderRoutes } from './reminders.js'
import { documentRoutes, PdfMaker } from './documents/routes.js'
import { htmlToPdf } from './documents/pdf.js'
import { COOKIE, cookieValue, createToken, readToken, secret, sessionCookie } from './session.js'

type Query = (text: string, values?: unknown[]) => Promise<{ rows: any[] }>
export type Db = { query: Query; connect: () => Promise<{ query: Query; release: () => void }> }

// Compared against when no account matches, so that response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('no-such-account', 12)

type Handler = (req: Request, res: Response) => Promise<unknown>
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => { handler(req, res).catch(next) }
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const publicAccount = (a: Account): Account => ({ id: a.id, email: a.email, name: a.name, role: a.role })

export function createApp(db: Db, makePdf: PdfMaker = htmlToPdf, sendReminder?: Parameters<typeof reminderRoutes>[3]) {
  const app = express()
  const newId = (prefix: string) => `${prefix}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`

  /** Records who did what. Only field names are kept, never their values. */
  const audit = (actor: Account, action: string, entity: string, entityId: string, summary = '') =>
    db.query('insert into public.audit_log (actor, action, entity, entity_id, summary) values ($1, $2, $3, $4, $5)', [actor.name, action, entity, entityId, summary])

  /** Gives a partner account its profile and onboarding checklist. */
  async function ensurePartner(query: Db['query'], name: string, email: string) {
    const found = await query('select id from public.partners where lower(email) = $1', [email])
    if (!found.rows.length) await query('insert into public.partners (name, email) values ($1, $2)', [name, email])
    const items = await query('select id from public.onboarding where partner = $1', [name])
    if (!items.rows.length) {
      for (const item of ONBOARDING_ITEMS) await query('insert into public.onboarding (id, partner, item) values ($1, $2, $3)', [newId('OB'), name, item])
    }
  }

  /** Job totals are derived from payments, expenses and contributors, so they can't drift. */
  async function recalculateJob(id: unknown) {
    if (!id) return
    const sum = async (sql: string) => Number((await db.query(sql, [id])).rows[0].n)
    const received = await sum("select coalesce(sum(amount), 0)::int as n from public.payments where job = $1 and status = 'Cleared'")
    const bank = await sum("select coalesce(sum(bank_charges), 0)::int as n from public.payments where job = $1 and status = 'Cleared'")
    const thirdParty = await sum("select coalesce(sum(amount), 0)::int as n from public.expenses where job = $1 and status = 'Approved' and category = 'Third-party'")
    const contributors = await sum('select coalesce(sum(pct), 0)::int as n from public.contributors where job = $1')
    await db.query('update public.jobs set received = $1, bank_charges = $2, third_party = $3, contributor_pct = $4 where id = $5', [received, bank, thirdParty, contributors, id])
  }

  /** A client named on any record is added to the client list, so everything stays linked. */
  async function ensureClient(name: unknown, details: { contact?: unknown; partner?: unknown; service?: unknown; value?: unknown } = {}) {
    const label = String(name ?? '').trim()
    if (!label) return
    const found = await db.query('select id from public.clients where lower(company) = $1 or lower(name) = $1 limit 1', [label.toLowerCase()])
    if (found.rows.length) return
    await db.query('insert into public.clients (id, name, company, partner, service, value, status) values ($1, $2, $3, $4, $5, $6, $7)',
      [newId('C'), String(details.contact || label), label, String(details.partner ?? ''), String(details.service ?? ''), Number(details.value) || 0, 'Active'])
  }

  /** An invoice's paid amount and status follow the cleared payments made against it. */
  async function recalculateInvoice(id: unknown) {
    if (!id) return
    const invoice = (await db.query('select amount, status from public.invoices where id = $1', [id])).rows[0]
    if (!invoice || String(id).startsWith('DOC-')) return
    const paid = Number((await db.query("select coalesce(sum(amount), 0)::int as n from public.payments where invoice = $1 and status = 'Cleared'", [id])).rows[0].n)
    const status = invoice.status === 'Cancelled' ? 'Cancelled' : paid >= Number(invoice.amount) && paid > 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Issued'
    await db.query('update public.invoices set paid = $1, status = $2 where id = $3', [paid, status, id])
  }

  /** Runs everything that depends on a record that was just written or removed. */
  async function followUp(table: Table, rows: Body[]) {
    for (const row of rows) {
      if (['payments', 'expenses', 'contributors'].includes(table)) await recalculateJob(row.job)
      if (table === 'payments') await recalculateInvoice(row.invoice)
      if (table === 'invoices') await recalculateInvoice(row.id)
    }
    const latest = rows[rows.length - 1]
    if (latest && resource(table).fields.some((x) => x.type === 'client')) await ensureClient(latest.client, { partner: latest.partner })
    if (table === 'leads' && latest?.stage === 'Won') await ensureClient(latest.company, { contact: latest.name, partner: latest.partner, service: latest.service, value: latest.value })
  }

  /** A log entry can create its follow-up tasks and move the job along, in one step. */
  async function applyLog(user: Account, entry: Body) {
    const steps = String(entry.next_steps ?? '').split('\n').map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim()).filter(Boolean).slice(0, 30)
    for (const step of steps) {
      await db.query('insert into public.tasks (id, title, client, job, partner, priority, due, status) values ($1, $2, $3, $4, $5, $6, $7, $8)',
        [newId('T'), step.slice(0, 500), entry.client ?? '', entry.job ?? '', entry.partner ?? '', 'Normal', entry.follow_up || null, 'To do'])
    }
    if (user.role === 'admin' && entry.job && entry.job_status) await db.query('update public.jobs set status = $1 where id = $2', [entry.job_status, entry.job])
  }

  /** Records created by the Document centre are changed there, so the two can't disagree. */
  const fromDocument = (table: Table, id: string) => ['quotes', 'invoices', 'payments'].includes(table) && id.startsWith('DOC-')
  const MANAGED = 'This record comes from the Document centre. Change it there.'

  /** Checks that referenced partners, jobs and invoices exist and are visible to this user. */
  async function checkReferences(user: Account, table: Table, values: Body, existing: Body | null) {
    for (const field of resource(table).fields) {
      const value = values[field.key]
      if (!value || value === existing?.[field.key]) continue
      if (field.type === 'partner') {
        const found = await db.query("select id from public.accounts where role = 'partner' and name = $1", [value])
        if (!found.rows.length) return `${value} is not a partner account`
      }
      if (field.type === 'invoice') {
        const found = await db.query('select id from public.invoices where id = $1', [value])
        if (!found.rows.length) return 'That invoice was not found'
        if (String(value).startsWith('DOC-')) return 'Record this payment on the invoice in the Document centre'
      }
      if (field.type === 'job') {
        const found = await db.query('select partner from public.jobs where id = $1', [value])
        if (!found.rows.length || (user.role === 'partner' && found.rows[0].partner !== user.name)) return 'That job was not found'
      }
    }
    const merged = { ...existing, ...values }
    if (table === 'contributors' || (table === 'jobs' && existing)) {
      const jobId = table === 'jobs' ? existing!.id : merged.job
      const job = table === 'jobs' ? merged : (await db.query('select job_type, major_share from public.jobs where id = $1', [jobId])).rows[0]
      if (job?.job_type === 'Major Project') {
        const others = await db.query('select coalesce(sum(pct), 0)::int as n from public.contributors where job = $1 and id <> $2', [jobId, table === 'contributors' ? String(existing?.id ?? '') : ''])
        const total = Number(others.rows[0].n) + (table === 'contributors' ? Number(merged.pct) : 0) + Number(job.major_share ?? 20)
        if (total > 100) return 'The partner and contributor shares would exceed 100%'
      } else if (table === 'contributors') return 'Contributors can only be added to a Major Project'
    }
    return null
  }

  app.disable('x-powered-by')
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    // Another website can't send JSON here without a CORS preflight, which is never granted.
    if (!['GET', 'HEAD'].includes(req.method) && !req.is('application/json') && req.method !== 'DELETE') {
      return res.status(415).json({ error: 'Requests must be sent as JSON' })
    }
    next()
  })
  // Documents and drawn signatures are larger than ordinary records.
  app.use(['/api/docs', '/api/docs-templates', '/api/sign'], express.json({ limit: '1mb' }))
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
    const attempt = await loginAttempt(db, req, email)
    if (!attempt.allowed) {
      res.set('Retry-After', String(WINDOW_MINUTES * 60))
      return res.status(429).json({ error: `Too many sign-in attempts. Try again in ${WINDOW_MINUTES} minutes.` })
    }
    const result = await db.query('select id, email, name, password_hash, role, active from public.accounts where email = $1 limit 1', [email])
    const account = result.rows[0]
    const matches = await bcrypt.compare(password, account?.password_hash ?? DUMMY_HASH)
    if (!account?.active || !matches) return res.status(401).json({ error: 'Invalid email or password' })
    await attempt.succeeded()
    await audit(publicAccount(account), 'Signed in', 'accounts', account.id)
    res.set('Set-Cookie', sessionCookie(createToken(account.id, account.password_hash)))
    res.json(publicAccount(account))
  }))

  app.post('/api/auth/logout', (_req, res) => {
    res.set('Set-Cookie', sessionCookie(''))
    res.json({ ok: true })
  })

  app.get('/api/auth/me', signedIn(async (user, _req, res) => res.json(user)))

  app.post('/api/auth/password', signedIn(async (user, req, res) => {
    const current = String(req.body?.currentPassword ?? '')
    const next = String(req.body?.newPassword ?? '')
    if (next.length < 8) return res.status(400).json({ error: 'The new password needs at least 8 characters' })
    const attempt = await loginAttempt(db, req, user.email)
    if (!attempt.allowed) return res.status(429).json({ error: `Too many attempts. Try again in ${WINDOW_MINUTES} minutes.` })
    const found = await db.query('select password_hash from public.accounts where id = $1', [user.id])
    if (!(await bcrypt.compare(current, found.rows[0].password_hash))) return res.status(400).json({ error: 'Your current password is not correct' })
    await attempt.succeeded()
    const hash = await bcrypt.hash(next, 12)
    await db.query('update public.accounts set password_hash = $1 where id = $2', [hash, user.id])
    await audit(user, 'Changed password', 'accounts', user.id)
    // Other sessions end; this one is reissued.
    res.set('Set-Cookie', sessionCookie(createToken(user.id, hash)))
    res.json({ ok: true })
  }))

  app.get('/api/auth/accounts', signedIn(async (_user, _req, res) => {
    const result = await db.query('select id, email, name, role, active, created_at from public.accounts order by created_at desc')
    res.json(result.rows)
  }, ['admin']))

  app.put('/api/auth/accounts/:id', signedIn(async (user, req, res) => {
    const id = String(req.params.id)
    const found = await db.query('select id, email, name, role, active from public.accounts where id = $1', [id])
    const account = found.rows[0]
    if (!account) return res.status(404).json({ error: 'Account not found' })
    const { active, role, password, ...rest } = req.body ?? {}
    if (Object.keys(rest).length) return res.status(400).json({ error: 'Unknown field' })
    // This also guarantees that at least one active administrator always remains.
    if (id === user.id) return res.status(400).json({ error: 'You can’t change your own access here. Use your profile to change your password.' })
    if (active !== undefined && typeof active !== 'boolean') return res.status(400).json({ error: 'Invalid status' })
    if (role !== undefined && !['admin', 'partner', 'finance'].includes(role)) return res.status(400).json({ error: 'Invalid role' })
    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) return res.status(400).json({ error: 'A password needs at least 8 characters' })
    if (active === undefined && role === undefined && password === undefined) return res.status(400).json({ error: 'No changes supplied' })
    if (active !== undefined) await db.query('update public.accounts set active = $1 where id = $2', [active, id])
    if (role !== undefined) await db.query('update public.accounts set role = $1 where id = $2', [role, id])
    if (password !== undefined) await db.query('update public.accounts set password_hash = $1 where id = $2', [await bcrypt.hash(password, 12), id])
    if (role === 'partner') await ensurePartner(db.query, account.name, account.email)
    await audit(user, 'Updated access', 'accounts', id, Object.keys(req.body).join(', '))
    res.json({ ok: true })
  }, ['admin']))

  app.delete('/api/auth/invites/:id', signedIn(async (user, req, res) => {
    const result = await db.query('delete from public.invites where id = $1 and accepted_at is null returning id', [String(req.params.id)])
    if (!result.rows.length) return res.status(404).json({ error: 'Pending invite not found' })
    await audit(user, 'Revoked invite', 'invites', result.rows[0].id)
    res.status(204).end()
  }, ['admin']))

  app.get('/api/auth/invites', signedIn(async (_user, _req, res) => {
    const result = await db.query('select id, email, role, expires_at, accepted_at, created_at from public.invites order by created_at desc limit 500')
    res.json(result.rows)
  }, ['admin']))

  app.post('/api/auth/invites', signedIn(async (user, req, res) => {
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
    await audit(user, 'Created invite', 'invites', result.rows[0].id, role)
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
      if (invite.role === 'partner') await ensurePartner(client.query.bind(client), name, invite.email)
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

  documentRoutes(app, db, signedIn, makePdf, { recalculateJob, ensureClient })
  reminderRoutes(app, db, signedIn, sendReminder)

  // Table and column names below only ever come from the fixed definitions in shared/resources.ts.
  const forbidden = (res: Response) => res.status(403).json({ error: 'You do not have access to this' })
  const withTable = (handler: (user: Account, table: Table, req: Request, res: Response) => Promise<unknown>) =>
    signedIn(async (user, req, res) => {
      const table = String(req.params.table)
      if (!isTable(table)) return res.status(404).json({ error: 'Not found' })
      return handler(user, table, req, res)
    })

  /** Names of partner accounts, for assigning records. */
  app.get('/api/auth/partner-names', signedIn(async (_user, _req, res) => {
    const result = await db.query("select name from public.accounts where role = 'partner' and active order by name")
    res.json(result.rows.map((r) => r.name))
  }, ['admin']))

  app.get('/api/:table', withTable(async (user, table, _req, res) => {
    const access = readAccess(user, table)
    if (!access) return forbidden(res)
    const { scope } = access
    const where = scope ? `where ${scope.column === 'email' ? 'lower(email)' : scope.column} = $1` : ''
    const result = await db.query(`select * from public.${table} ${where} order by created_at desc nulls last limit 1000`, scope ? [scope.value] : [])
    res.json(result.rows)
  }))

  app.post('/api/:table', withTable(async (user, table, req, res) => {
    const prepared = prepare(user, table, 'create', req.body)
    if ('error' in prepared) return res.status(prepared.status).json({ error: prepared.error })
    const values = prepared.values
    const refused = rule(user, table, values, null)
    if (refused) return res.status(refused.status).json({ error: refused.error })
    const problem = await checkReferences(user, table, values, null)
    if (problem) return res.status(400).json({ error: problem })
    // A payment against a job belongs to that job's partner unless stated otherwise.
    if (table === 'payments' && values.job && !values.partner) values.partner = (await db.query('select partner from public.jobs where id = $1', [values.job])).rows[0]?.partner
    values.id = newId(resource(table).prefix)
    const keys = Object.keys(values)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const result = await db.query(`insert into public.${table} (${keys.join(', ')}) values (${placeholders}) returning *`, Object.values(values))
    await followUp(table, [result.rows[0]])
    if (table === 'work_log') await applyLog(user, result.rows[0])
    await audit(user, 'Created', table, String(values.id))
    res.status(201).json(result.rows[0])
  }))

  /** Loads a record only if it is within the user's scope. */
  async function findOwn(user: Account, table: Table, id: string) {
    const found = await db.query(`select * from public.${table} where id = $1`, [id])
    const row = found.rows[0]
    const scope = readAccess(user, table)?.scope
    if (!row || (scope && String(row[scope.column]).toLowerCase() !== scope.value.toLowerCase())) return null
    return row
  }
  // Ids are numbers in the partners table and text everywhere else.
  const validId = (table: Table, id: string) => table !== 'partners' || /^\d{1,15}$/.test(id)

  app.put('/api/:table/:id', withTable(async (user, table, req, res) => {
    const prepared = prepare(user, table, 'update', req.body)
    if ('error' in prepared) return res.status(prepared.status).json({ error: prepared.error })
    const id = String(req.params.id)
    const existing = validId(table, id) ? await findOwn(user, table, id) : null
    if (!existing) return res.status(404).json({ error: 'Record not found' })
    if (fromDocument(table, id)) return res.status(409).json({ error: MANAGED })
    const values = prepared.values
    const refused = rule(user, table, values, existing)
    if (refused) return res.status(refused.status).json({ error: refused.error })
    const problem = await checkReferences(user, table, values, existing)
    if (problem) return res.status(400).json({ error: problem })
    const changed = Object.keys(values)
    // Any change to a lead counts as logging activity on it.
    if (table === 'leads') values.last_activity_at = new Date().toISOString()
    const set = Object.keys(values).map((key, i) => `${key} = $${i + 1}`).join(', ')
    const result = await db.query(`update public.${table} set ${set} where id = $${Object.keys(values).length + 1} returning *`, [...Object.values(values), id])
    // The old row is included so totals it used to count towards are corrected too.
    await followUp(table, [existing, result.rows[0]])
    await audit(user, 'Updated', table, id, changed.join(', '))
    res.json(result.rows[0])
  }))

  app.delete('/api/:table/:id', withTable(async (user, table, req, res) => {
    if (!rights(user.role, table)?.remove) return forbidden(res)
    const id = String(req.params.id)
    const existing = await findOwn(user, table, id)
    if (!existing) return res.status(404).json({ error: 'Record not found' })
    if (fromDocument(table, id)) return res.status(409).json({ error: MANAGED })
    if (table === 'invoices') {
      const linked = await db.query('select id from public.payments where invoice = $1', [id])
      if (linked.rows.length) return res.status(409).json({ error: 'This invoice has payments. Mark it cancelled instead of deleting it.' })
    }
    if (table === 'jobs') {
      const linked = await db.query('select id from public.payments where job = $1 union all select id from public.payouts where job = $1', [id])
      if (linked.rows.length) return res.status(409).json({ error: 'This job has payments or payouts. Put it on hold instead of deleting it.' })
    }
    await db.query(`delete from public.${table} where id = $1`, [id])
    if (['payments', 'expenses', 'contributors'].includes(table)) await recalculateJob(existing.job)
    if (table === 'payments') await recalculateInvoice(existing.invoice)
    await audit(user, 'Deleted', table, id)
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
