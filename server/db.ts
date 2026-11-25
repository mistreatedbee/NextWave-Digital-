import pg from 'pg'
import type { Db } from './app.js'

// Return SQL dates as 'YYYY-MM-DD' text so that time zones can't shift them by a day.
pg.types.setTypeParser(1082, (value) => value)

/**
 * Supabase's pooler allows only about 15 clients in session mode (port 5432), which a busy
 * serverless site exceeds. Transaction mode (port 6543) shares connections between requests.
 */
export function connectionString() {
  const raw = process.env.DATABASE_URL
  if (!raw) throw new Error('DATABASE_URL is not configured')
  const url = new URL(raw)
  if (url.hostname.endsWith('.pooler.supabase.com') && url.port === '5432') url.port = '6543'
  return url.toString()
}

let pool: pg.Pool | undefined
function get() {
  if (!pool) {
    pool = new pg.Pool({ connectionString: connectionString(), ssl: { rejectUnauthorized: false }, max: process.env.VERCEL ? 3 : 8, idleTimeoutMillis: 5000, connectionTimeoutMillis: 10000 })
    // An idle connection closed by the server must not crash the process.
    pool.on('error', (error) => console.error('Database connection lost', error.message))
  }
  return pool
}

/** Connects on first use and is reused between requests. */
export const db: Db = {
  query: async (text, values) => get().query(text, values),
  connect: async () => get().connect(),
}
