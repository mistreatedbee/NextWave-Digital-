import crypto from 'node:crypto'
import type { Request } from 'express'
import type { Db } from './app.js'

export const WINDOW_MINUTES = 15
const LIMITS = { pair: 5, email: 20, ip: 30 }

const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex')
// Proxy headers are only trustworthy on Vercel, which overwrites them.
const clientIp = (req: Request) => (process.env.VERCEL && String(req.headers['x-real-ip'] ?? '')) || req.socket.remoteAddress || 'unknown'

/**
 * Counts sign-in attempts in the database, so the limit holds across serverless instances.
 * An attempt is recorded before the password is checked, so parallel guesses can't slip through.
 */
export async function loginAttempt(db: Db, req: Request, email: string) {
  const ip = clientIp(req)
  const keys = { pair: hash(`pair:${email}:${ip}`), email: hash(`email:${email}`), ip: hash(`ip:${ip}`) }
  const since = new Date(Date.now() - WINDOW_MINUTES * 60000).toISOString()
  const id = crypto.randomUUID()
  await db.query('delete from public.login_attempts where attempted_at < $1', [since])
  const names = Object.keys(keys) as (keyof typeof keys)[]
  const count = async (key: string) => Number((await db.query('select count(*)::int as n from public.login_attempts where key = $1 and attempted_at >= $2', [key, since])).rows[0].n)
  // Blocked requests aren't recorded, so a block always expires.
  for (const name of names) if ((await count(keys[name])) >= LIMITS[name]) return { allowed: false as const }
  for (const name of names) await db.query('insert into public.login_attempts (id, key, attempted_at) values ($1, $2, $3)', [`${id}:${name}`, keys[name], new Date().toISOString()])
  for (const name of names) {
    if ((await count(keys[name])) > LIMITS[name]) return { allowed: false as const }
  }
  return {
    allowed: true as const,
    /** A correct password clears this person's failures and doesn't count against the address. */
    async succeeded() {
      await db.query('delete from public.login_attempts where key = $1 or key = $2 or id = $3', [keys.pair, keys.email, `${id}:ip`])
    },
  }
}
