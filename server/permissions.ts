export type Role = 'admin' | 'partner' | 'finance'
export type Account = { id: string; email: string; name: string; role: Role }
export type Table = 'partners' | 'leads' | 'jobs' | 'payments' | 'payouts' | 'clients'
type Body = Record<string, unknown>

export const COLUMNS: Record<Table, string[]> = {
  partners: ['name', 'email', 'status', 'earnings', 'jobs', 'leads'],
  clients: ['id', 'name', 'company', 'email', 'phone', 'service', 'status', 'value'],
  leads: ['id', 'name', 'company', 'service', 'source', 'value', 'partner', 'stage', 'logged_hours'],
  jobs: ['id', 'title', 'client', 'job_type', 'partner', 'value', 'received', 'status', 'due'],
  payments: ['id', 'payment_date', 'client', 'invoice', 'job', 'amount', 'method', 'bank_charges', 'status', 'partner'],
  payouts: ['id', 'partner', 'batch', 'gross', 'amount', 'status'],
}

export const isTable = (name: string): name is Table => Object.prototype.hasOwnProperty.call(COLUMNS, name)

/** A restriction to the rows a user may see: `column` must equal `value`. */
export type Scope = { column: string; value: string } | null

/** Returns null when the role may not read the table at all. */
export function readAccess(user: Account, table: Table): { scope: Scope } | null {
  if (user.role === 'admin') return { scope: null }
  if (user.role === 'finance') return table === 'payments' || table === 'payouts' ? { scope: null } : null
  if (table === 'leads' || table === 'jobs' || table === 'payouts') return { scope: { column: 'partner', value: user.name } }
  if (table === 'partners') return { scope: { column: 'email', value: user.email } }
  // The clients table has no owner column, so partners share one client list.
  if (table === 'clients') return { scope: null }
  return null
}

const PARTNER_LEAD_FIELDS = ['name', 'company', 'service', 'source', 'value', 'stage']

/** Returns the values that may be inserted, or null when the role may not create here. */
export function createValues(user: Account, table: Table, body: Body): Body | null {
  if (table === 'partners') return null
  if (user.role === 'admin') return body
  if (user.role !== 'partner') return null
  if (table === 'clients') return body
  // A partner can only create their own leads.
  if (table === 'leads') return { ...pick(body, ['id', ...PARTNER_LEAD_FIELDS]), partner: user.name }
  return null
}

/** Returns the change to apply (and any extra row conditions), or null when it is not allowed. */
export function updateRule(user: Account, table: Table, body: Body): { values: Body; where: { column: string; in: string[] }[] } | null {
  if (table === 'partners') return null
  if (user.role === 'admin') return { values: body, where: [] }
  if (user.role !== 'partner') return null
  const keys = Object.keys(body)
  const own = { column: 'partner', in: [user.name] }
  if (table === 'leads' && keys.length && keys.every((k) => PARTNER_LEAD_FIELDS.includes(k))) return { values: body, where: [own] }
  // The only job change a partner may make is asking for help.
  if (table === 'jobs' && keys.length === 1 && body.job_type === 'Assisted Work') {
    return { values: body, where: [own, { column: 'job_type', in: ['Standard Job', 'Independent Work'] }, { column: 'status', in: ['Not started', 'In progress', 'Review', 'On hold'] }] }
  }
  return null
}

export const canDelete = (user: Account, table: Table) => user.role === 'admin' && table !== 'partners'

const NUMERIC = ['value', 'received', 'amount', 'bank_charges', 'gross', 'logged_hours']
const CHOICES: Partial<Record<Table, Record<string, string[]>>> = {
  leads: { stage: ['New', 'Contacted', 'Quote sent', 'Won', 'Lost'] },
  jobs: { job_type: ['Standard Job', 'Independent Work', 'Assisted Work', 'Major Project'], status: ['Not started', 'In progress', 'Review', 'Done', 'On hold'] },
}

/** Returns a message describing the first invalid value, or null when all are acceptable. */
export function invalid(table: Table, values: Body) {
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && !['string', 'number'].includes(typeof value)) return `Invalid ${key}`
    if (NUMERIC.includes(key) && !(Number.isInteger(value) && (value as number) >= 0)) return `${key} must be a whole number of 0 or more`
    const allowed = CHOICES[table]?.[key]
    if (allowed && !allowed.includes(String(value))) return `Invalid ${key}`
  }
  return null
}

export function pick(body: Body, keys: string[]): Body {
  return Object.fromEntries(Object.entries(body ?? {}).filter(([k]) => keys.includes(k)))
}
