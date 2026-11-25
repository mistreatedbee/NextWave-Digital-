// Lets updates written by Claude (or typed by hand) be pasted in, checked and applied.
import { editableFields, isTable, resource, Table } from './resources.js'

export const IMPORT_TABLES: Table[] = ['work_log', 'tasks', 'payments', 'invoices', 'jobs', 'clients', 'domains', 'events', 'leads']
export type Change = { table: Table; action: 'create' | 'update'; id?: string; values: Record<string, string | number> }

type Row = Record<string, any>
export function buildPrompt(today: string, context: { clients: Row[]; jobs: Row[]; invoices: Row[]; tasks: Row[] }) {
  const fields = IMPORT_TABLES.map((t) => `- ${t}: ${editableFields('admin', t, 'create').map((f) => `${f.key}${f.required ? '*' : ''}${f.type === 'select' ? ` (${f.options!.join(' | ')})` : f.type === 'date' ? ' (YYYY-MM-DD)' : f.money ? ' (whole rand)' : ''}`).join(', ')}`).join('\n')
  // Only names, titles and amounts are shared: no phone numbers, emails, ID or banking details.
  const list = (label: string, rows: string[]) => `${label}:\n${rows.join('\n') || '(none)'}`
  return `You are helping me update my business management system. Today is ${today}.
I will tell you what happened (work I did, a client call, a payment, a new request). Reply with ONLY a JSON block in this form:

{"changes":[{"table":"work_log","action":"create","values":{...}},{"table":"jobs","action":"update","id":"J-...","values":{...}}]}

Rules:
- action is "create" or "update"; update needs the id of an existing record and only the fields that change. Nothing can be deleted.
- Fields marked * are required when creating. Use only the fields and choices listed. Money is in whole rand.
- Use the exact client names and job ids below. Do not invent facts, amounts or dates; ask me if something needed is missing.
- Record what happened as a work_log entry. Put follow-up actions in next_steps (one per line); they become tasks automatically, so don't also create those tasks.
- To record money received, create a payments record (status "Cleared"). For invoices whose id starts with DOC-, tell me to record it in the Document centre instead.

Tables and fields:
${fields}

${list('Clients', context.clients.map((c) => `- ${c.company || c.name}`))}

${list('Jobs', context.jobs.map((j) => `- ${j.id}: ${j.title} (client: ${j.client}; ${j.status}; value R${j.value}, received R${j.received})`))}

${list('Unpaid invoices', context.invoices.filter((i) => ['Issued', 'Partial'].includes(i.status)).map((i) => `- ${i.id}: ${i.client}, owing R${i.amount - i.paid}`))}

${list('Open tasks', context.tasks.filter((t) => t.status !== 'Done').slice(0, 100).map((t) => `- ${t.id}: ${t.title}${t.client ? ` (${t.client})` : ''}`))}

What happened:
`
}

/** Reads the pasted reply. Anything not understood is reported rather than skipped silently. */
export function parseChanges(pasted: string): { changes: Change[]; problems: string[] } {
  const start = pasted.indexOf('{'), end = pasted.lastIndexOf('}')
  let parsed: any
  try { parsed = JSON.parse(pasted.slice(start, end + 1)) } catch { return { changes: [], problems: ['No readable JSON was found. Paste the whole reply, including the { } block.'] } }
  if (!Array.isArray(parsed?.changes) || !parsed.changes.length) return { changes: [], problems: ['The reply has no "changes" list.'] }
  const changes: Change[] = [], problems: string[] = []
  parsed.changes.slice(0, 100).forEach((c: any, n: number) => {
    const where = `Change ${n + 1}`
    const table = String(c?.table ?? '')
    if (!isTable(table) || !IMPORT_TABLES.includes(table)) return problems.push(`${where}: "${table}" can’t be updated this way`)
    if (c.action !== 'create' && c.action !== 'update') return problems.push(`${where}: only create and update are allowed`)
    if (c.action === 'update' && !c.id) return problems.push(`${where}: an update needs the record id`)
    const allowed = editableFields('admin', table, c.action).map((f) => f.key)
    const values = c.values && typeof c.values === 'object' ? c.values : {}
    const unknown = Object.keys(values).filter((k) => !allowed.includes(k))
    if (unknown.length || !Object.keys(values).length) return problems.push(`${where} (${resource(table).singular}): ${unknown.length ? `unknown field ${unknown.join(', ')}` : 'no values'}`)
    changes.push({ table, action: c.action, id: c.id ? String(c.id) : undefined, values })
  })
  return { changes, problems }
}
