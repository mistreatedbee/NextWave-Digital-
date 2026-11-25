import pg from 'pg'
import type { Db } from './app.js'

// Return SQL dates as 'YYYY-MM-DD' text so that time zones can't shift them by a day.
pg.types.setTypeParser(1082, (value) => value)

let pool: pg.Pool | undefined
function get() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
  pool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: process.env.VERCEL ? 3 : 10 })
  return pool
}

/** Connects on first use and is reused between requests. */
export const db: Db = {
  query: async (text, values) => get().query(text, values),
  connect: async () => get().connect(),
}
