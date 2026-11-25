import dotenv from 'dotenv'
import pg from 'pg'
import { connectionString } from '../server/db.js'

export async function connect() {
  dotenv.config({ path: '.env.local' })
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
  const client = new pg.Client({ connectionString: connectionString(), ssl: { rejectUnauthorized: false } })
  await client.connect()
  return client
}
