// Applies the additive migrations in one transaction. Destructive scripts are deliberately not listed.
import fs from 'node:fs'
import dotenv from 'dotenv'
import pg from 'pg'

const FILES = ['20261125_auth_invites.sql', '20261125_nextwave_core.sql', '20261126_management_features.sql']

dotenv.config({ path: '.env.local' })
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
try {
  await client.query('begin')
  for (const file of FILES) await client.query(fs.readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'))
  await client.query('commit')
  console.log('Migrations applied')
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  await client.end()
}
