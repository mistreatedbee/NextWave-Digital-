import crypto from 'node:crypto'

export const COOKIE = 'nw_session'
export const MAX_AGE = 60 * 60 * 12 // 12 hours

export function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be set to at least 32 characters')
  return value
}

const hmac = (data: string) => crypto.createHmac('sha256', secret()).update(data).digest('base64url')
const same = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))

/** Changes whenever the password does, which ends that account's existing sessions. */
const fingerprint = (passwordHash: string) => hmac(`password:${passwordHash}`)

export function createToken(accountId: string, passwordHash: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ id: accountId, pw: fingerprint(passwordHash), exp: now + MAX_AGE * 1000 })).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function readToken(token: string, now = Date.now()): { id: string; matches: (passwordHash: string) => boolean } | null {
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined || !same(signature, hmac(payload))) return null
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
  if (typeof data.id !== 'string' || !(data.exp > now)) return null
  return { id: data.id, matches: (passwordHash) => same(String(data.pw), fingerprint(passwordHash)) }
}

export function cookieValue(header: string | undefined, name: string) {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return ''
}

export function sessionCookie(token: string) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${token ? MAX_AGE : 0}${secure}`
}
