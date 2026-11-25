import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import cors from 'cors'
import express from 'express'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

const app = express()
app.use(cors())
app.use(express.json())

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
})

const allowedTables = new Set(['partners', 'leads', 'jobs', 'payments', 'payouts', 'clients'])



app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase()
  const password = String(req.body.password ?? '')
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  try {
    const result = await pool.query('select id, email, name, password_hash, role, active from public.accounts where email = $1 limit 1', [email])
    const account = result.rows[0]
    if (!account || !account.active || !(await bcrypt.compare(password, account.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    res.json({ id: account.id, email: account.email, name: account.name, role: account.role })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Login failed' })
  }
})

app.post('/api/auth/invites', async (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase()
  const role = String(req.body.role ?? '')
  if (!email || !['partner', 'finance'].includes(role)) return res.status(400).json({ error: 'A valid email and role are required' })
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  try {
    const result = await pool.query(
      `insert into public.invites (id, email, role, token_hash, expires_at)
       values ($1, $2, $3, $4, now() + interval '7 days') returning id, email, role, expires_at`,
      [`INV-${Date.now()}`, email, role, tokenHash]
    )
    res.status(201).json({ ...result.rows[0], inviteUrl: `/management/accept-invite?token=${token}` })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Invite failed' })
  }
})

app.post('/api/auth/accept-invite', async (req, res) => {
  const token = String(req.body.token ?? '')
  const name = String(req.body.name ?? '').trim()
  const password = String(req.body.password ?? '')
  if (!token || !name || password.length < 8) return res.status(400).json({ error: 'Name and an 8-character password are required' })
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  try {
    const inviteResult = await pool.query('select * from public.invites where token_hash = $1 and accepted_at is null and expires_at > now() limit 1', [tokenHash])
    const invite = inviteResult.rows[0]
    if (!invite) return res.status(400).json({ error: 'Invite is invalid or expired' })
    const passwordHash = await bcrypt.hash(password, 12)
    const accountId = `USR-${Date.now()}`
    await pool.query('insert into public.accounts (id, email, name, password_hash, role) values ($1, $2, $3, $4, $5)', [accountId, invite.email, name, passwordHash, invite.role])
    await pool.query('update public.invites set accepted_at = now() where id = $1', [invite.id])
    res.status(201).json({ id: accountId, email: invite.email, name, role: invite.role })
  } catch (error) {
    res.status(409).json({ error: error instanceof Error ? error.message : 'Could not accept invite' })
  }
})

app.get('/api/auth/invites', async (_req, res) => {
  try {
    const result = await pool.query('select id, email, role, expires_at, accepted_at, created_at from public.invites order by created_at desc limit 500')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Could not load invites' })
  }
})

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('select current_database() as database, now() as time')
    res.json({ ok: true, ...result.rows[0] })
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : 'Database unavailable' })
  }
})

app.post('/api/:table', async (req, res) => {
  const table = req.params.table
  if (!allowedTables.has(table)) return res.status(404).json({ error: 'Unknown table' })
  const columns: Record<string, string[]> = {
    clients: ['id', 'name', 'company', 'email', 'phone', 'service', 'status', 'value'],
    leads: ['id', 'name', 'company', 'service', 'source', 'value', 'partner', 'stage', 'logged_hours'],
    jobs: ['id', 'title', 'client', 'job_type', 'partner', 'value', 'received', 'status', 'due'],
    payments: ['id', 'payment_date', 'client', 'invoice', 'job', 'amount', 'method', 'bank_charges', 'status', 'partner'],
    payouts: ['id', 'partner', 'batch', 'gross', 'amount', 'status'],
  }
  const allowed = columns[table] ?? []
  const keys = Object.keys(req.body).filter((key) => allowed.includes(key))
  if (!keys.length) return res.status(400).json({ error: 'No valid fields supplied' })
  const values = keys.map((key) => req.body[key])
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
  try {
    const result = await pool.query(`insert into public.${table} (${keys.join(', ')}) values (${placeholders}) returning *`, values)
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Create failed' })
  }
})

app.get('/api/:table', async (req, res) => {
  const table = req.params.table
  if (!allowedTables.has(table)) return res.status(404).json({ error: 'Unknown table' })
  try {
    const result = await pool.query(`select * from public.${table} order by created_at desc nulls last limit 500`)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Query failed' })
  }
})

app.put('/api/:table/:id', async (req, res) => {
  const table = req.params.table
  const id = req.params.id
  if (!allowedTables.has(table)) return res.status(404).json({ error: 'Unknown table' })
  const columns: Record<string, string[]> = {
    clients: ['name', 'company', 'email', 'phone', 'service', 'status', 'value'],
    leads: ['name', 'company', 'service', 'source', 'value', 'partner', 'stage', 'logged_hours'],
    jobs: ['title', 'client', 'job_type', 'partner', 'value', 'received', 'status', 'due'],
    payments: ['payment_date', 'client', 'invoice', 'job', 'amount', 'method', 'bank_charges', 'status', 'partner'],
    payouts: ['partner', 'batch', 'gross', 'amount', 'status'],
  }
  const allowed = columns[table] ?? []
  const entries = Object.entries(req.body).filter(([key]) => allowed.includes(key))
  if (!entries.length) return res.status(400).json({ error: 'No valid fields supplied' })
  const keys = entries.map(([key]) => key)
  const values = entries.map(([, value]) => value)
  try {
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    const result = await pool.query(`update public.${table} set ${setClause} where id = $${keys.length + 1} returning *`, [...values, id])
    if (!result.rows.length) return res.status(404).json({ error: 'Record not found' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Update failed' })
  }
})

app.delete('/api/:table/:id', async (req, res) => {
  const table = req.params.table
  const id = req.params.id
  if (!allowedTables.has(table)) return res.status(404).json({ error: 'Unknown table' })
  try {
    const result = await pool.query(`delete from public.${table} where id = $1 returning id`, [id])
    if (!result.rows.length) return res.status(404).json({ error: 'Record not found' })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Delete failed' })
  }
})

const port = Number(process.env.API_PORT || 8787)
app.listen(port, () => console.log(`NextWave API listening on http://localhost:${port}`))
