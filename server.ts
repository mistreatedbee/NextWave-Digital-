import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import cors from 'cors'
import express from 'express'
import pg from 'pg'

const app = express()
app.use(cors())
app.use(express.json())

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
})

const allowedTables = new Set(['partners', 'leads', 'jobs', 'payments', 'payouts'])

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('select current_database() as database, now() as time')
    res.json({ ok: true, ...result.rows[0] })
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : 'Database unavailable' })
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

const port = Number(process.env.API_PORT || 8787)
app.listen(port, () => console.log(`NextWave API listening on http://localhost:${port}`))
