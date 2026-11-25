import { rights, Table } from '../../../../shared/resources'
import { day, Row, toRecord, useTable } from './api'
import { d, isoDate, Role } from './lib'
import { canAccess } from './nav'

export type Alert = { id: string; title: string; body: string; page: string }

/** Things needing attention, worked out from the records this role can read. */
export function useNotifications(role: Role): Alert[] {
  const load = (table: Table) => ({ table, on: !!rights(role, table) })
  const leads = useTable(load('leads').table, toRecord, load('leads').on).rows
  const approvals = useTable(load('approvals').table, toRecord, load('approvals').on).rows
  const help = useTable(load('help_requests').table, toRecord, load('help_requests').on).rows
  const invoices = useTable(load('invoices').table, toRecord, load('invoices').on).rows
  const documents = useTable(load('documents').table, toRecord, load('documents').on).rows
  const tasks = useTable(load('tasks').table, toRecord, load('tasks').on).rows
  const today = isoDate(new Date())
  const past = (v: unknown) => !!v && day(v) < today
  const alerts: Alert[] = []
  const add = (rows: Row[], page: string, title: string, body: (r: Row) => string) => {
    if (canAccess(role, page)) rows.forEach((r) => alerts.push({ id: `${page}-${r.id}`, page, title, body: body(r) }))
  }
  add(leads.filter((l) => !['Won', 'Lost'].includes(l.stage) && Date.now() - new Date(l.last_activity_at ?? l.created_at).getTime() > 25 * 3600000), 'leads', 'Overdue log', (l) => `${l.company} has had no activity logged in 24 hours`)
  add(approvals.filter((a) => a.status === 'Pending'), 'approvals', 'Approval pending', (a) => `${a.kind}: ${a.summary}`)
  add(help.filter((h) => h.status === 'Open'), 'help', 'Help requested', (h) => h.summary)
  add(invoices.filter((i) => ['Issued', 'Partial'].includes(i.status) && past(i.due)), 'invoices', 'Overdue invoice', (i) => `${i.client}, due ${d(day(i.due))}`)
  add(documents.filter((x) => past(x.expires)), 'documents', 'Document expired', (x) => `${x.title}, ${d(day(x.expires))}`)
  add(tasks.filter((t) => t.status !== 'Done' && past(t.due)), 'tasks', 'Overdue task', (t) => `${t.title}, due ${d(day(t.due))}`)
  return alerts
}
