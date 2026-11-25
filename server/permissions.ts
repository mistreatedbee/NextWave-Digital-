import { editableFields, Field, resource, rights, Role, Table } from '../shared/resources.js'

export type { Role, Table }
export type Account = { id: string; email: string; name: string; role: Role }
export type Body = Record<string, unknown>
export type Result = { values: Body } | { status: number; error: string }

const deny: Result = { status: 403, error: 'You do not have access to this' }
const bad = (error: string): Result => ({ status: 400, error })

/** A restriction to the rows a user may see: `column` must equal `value`. */
export type Scope = { column: 'partner' | 'email'; value: string } | null

/** Returns null when the role may not read the table at all. */
export function readAccess(user: Account, table: Table): { scope: Scope } | null {
  const access = rights(user.role, table)
  if (!access) return null
  if (access.read === 'all') return { scope: null }
  return { scope: table === 'partners' ? { column: 'email', value: user.email } : { column: 'partner', value: user.name } }
}

function clean(field: Field, raw: unknown): { value: unknown } | { error: string } {
  if (raw !== null && raw !== undefined && !['string', 'number'].includes(typeof raw)) return { error: `Invalid ${field.label}` }
  const textValue = raw === null || raw === undefined ? '' : String(raw).trim()
  if (!textValue) {
    if (field.required) return { error: `${field.label} is required` }
    if (field.type === 'date' || (field.type === 'number' && field.min !== 0)) return { value: null }
    return { value: field.type === 'number' ? 0 : '' }
  }
  if (field.type === 'number') {
    const n = Number(textValue)
    const min = field.min ?? 0
    const max = field.max ?? 2_000_000_000
    if (!Number.isInteger(n) || n < min || n > max) return { error: `${field.label} must be a whole number from ${min} to ${max}` }
    return { value: n }
  }
  if (textValue.length > (field.type === 'textarea' ? 20000 : 500)) return { error: `${field.label} is too long` }
  if (field.type === 'date') {
    const parsed = new Date(`${textValue}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(textValue) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== textValue) return { error: `${field.label} must be a date` }
  }
  if (field.type === 'select' && !field.options?.includes(textValue)) return { error: `Invalid ${field.label}` }
  // Links are rendered as anchors, so only web addresses are accepted.
  if (field.type === 'url' && !/^https?:\/\/[^\s]+$/i.test(textValue)) return { error: `${field.label} must start with http:// or https://` }
  if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(textValue)) return { error: `${field.label} is not a valid email address` }
  return { value: textValue }
}

/** Checks permission and validates the supplied values. Unknown or forbidden fields are refused. */
export function prepare(user: Account, table: Table, mode: 'create' | 'update', body: Body): Result {
  const fields = editableFields(user.role, table, mode)
  if (!fields.length) return deny
  const supplied = Object.keys(body ?? {})
  if (supplied.some((key) => !fields.some((x) => x.key === key))) return deny
  const values: Body = {}
  for (const field of fields) {
    if (mode === 'update' && !supplied.includes(field.key)) continue
    // On create, an omitted optional field takes the database default.
    if (mode === 'create' && !supplied.includes(field.key) && !field.required) continue
    const result = clean(field, body[field.key])
    if ('error' in result) return bad(result.error)
    values[field.key] = result.value
  }
  if (!Object.keys(values).length) return bad('No changes supplied')
  if (mode === 'create' && user.role === 'partner') {
    // A partner's records are always their own.
    if (resource(table).fields.some((x) => x.key === 'partner')) values.partner = user.name
    Object.assign(values, resource(table).partnerDefaults)
  }
  return { values }
}

const APPROVED = ['Approved', 'Sent', 'Accepted']

/** Business rules that depend on the record's current state. Returns a refusal, or null if allowed. */
export function rule(user: Account, table: Table, values: Body, existing: Body | null): { status: number; error: string } | null {
  if (user.role !== 'partner') return null
  const no = (error: string) => ({ status: 403, error })
  const merged = { ...existing, ...values }
  if (table === 'jobs') {
    const ok = values.job_type === 'Assisted Work' && ['Standard Job', 'Independent Work'].includes(String(existing?.job_type)) && existing?.status !== 'Done'
    return ok ? null : no('Only an unfinished Standard or Independent job can be converted to Assisted Work')
  }
  if (table === 'onboarding') {
    return values.status === 'Submitted' && existing?.status !== 'Verified' ? null : no('You can only mark an unverified requirement as submitted')
  }
  if (table === 'quotes') {
    const wasApproved = APPROVED.includes(String(existing?.status))
    const repriced = !!existing && (Number(merged.amount) !== Number(existing.amount) || Number(merged.discount_pct || 0) !== Number(existing.discount_pct || 0))
    if (values.status === 'Approved' && existing?.status !== 'Approved') return no('Only an administrator can approve a quote')
    if (wasApproved && repriced && !['Draft', 'Awaiting approval'].includes(String(merged.status))) return no('A re-priced quote must go back to Draft or Awaiting approval')
    if (Number(merged.discount_pct || 0) > 0 && ['Approved', 'Sent', 'Accepted'].includes(String(merged.status)) && !(wasApproved && !repriced)) return no('A discounted quote needs approval before it can be sent')
  }
  return null
}
