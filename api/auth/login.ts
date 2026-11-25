import type { VercelRequest, VercelResponse } from '@vercel/node'
import pg from 'pg'
import bcrypt from 'bcryptjs'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const password = String(req.body?.password ?? '')
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return res.status(500).json({ error: 'Database is not configured' })

  const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 2 })
  try {
    const result = await pool.query(
      'select id, email, name, password_hash, role, active from public.accounts where email = $1 limit 1',
      [email]
    )
    const account = result.rows[0]
    if (!account || !account.active || !(await bcrypt.compare(password, account.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    return res.status(200).json({ id: account.id, email: account.email, name: account.name, role: account.role })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Login failed' })
  } finally {
    await pool.end()
  }
}
