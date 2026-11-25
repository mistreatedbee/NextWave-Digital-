// What needs attention, worked out the same way on screen and in the daily reminder email.
import { addDays, longDate, money } from './documents/model.js'

export type Alert = { id: string; title: string; body: string; page: string; urgent: boolean }
type Row = Record<string, any>
export type AlertSource = Partial<Record<'leads' | 'approvals' | 'help_requests' | 'invoices' | 'documents' | 'tasks' | 'work_log' | 'domains' | 'jobs', Row[]>>

const day = (v: unknown) => (!v ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10))
const rand = (n: number) => money(n * 100)

export function buildAlerts(source: AlertSource, today: string, now = Date.now()): Alert[] {
  const out: Alert[] = []
  const add = (rows: Row[] | undefined, page: string, test: (r: Row) => { title: string; body: string; urgent?: boolean } | false) => {
    for (const row of rows ?? []) { const hit = test(row); if (hit) out.push({ id: `${page}-${row.id}`, page, urgent: !!hit.urgent, title: hit.title, body: hit.body }) }
  }
  const soon = addDays(today, 7)
  add(source.invoices, 'invoices', (i) => {
    const owing = Number(i.amount) - Number(i.paid || 0)
    const due = day(i.due)
    if (!['Issued', 'Partial'].includes(i.status) || owing <= 0 || !due || due > soon) return false
    return due < today ? { title: 'Payment overdue', body: `${i.client} owes ${rand(owing)}, due ${longDate(due)}`, urgent: true } : { title: 'Payment due soon', body: `${i.client}: ${rand(owing)} due ${longDate(due)}` }
  })
  // Jobs with an invoice are covered above.
  const invoiced = new Set((source.invoices ?? []).filter((i) => i.status !== 'Cancelled').map((i) => i.job).filter(Boolean))
  add(source.jobs, 'jobs', (j) => {
    const owing = Number(j.value) - Number(j.received || 0)
    const due = day(j.payment_due)
    if (invoiced.has(j.id) || owing <= 0 || !due || due > soon) return false
    return { title: due < today ? 'Job balance overdue' : 'Job balance due soon', body: `${j.client} owes ${rand(owing)} for ${j.title}, due ${longDate(due)}`, urgent: due < today }
  })
  add(source.work_log, 'work-log', (w) => w.status === 'Open' && !!w.follow_up && day(w.follow_up) <= today && { title: 'Follow up', body: `${w.client}: ${w.summary}`, urgent: day(w.follow_up) < today })
  add(source.tasks, 'tasks', (t) => t.status !== 'Done' && !!t.due && day(t.due) <= today && { title: day(t.due) < today ? 'Overdue task' : 'Task due today', body: `${t.title}${t.client ? ` (${t.client})` : ''}`, urgent: day(t.due) < today })
  add(source.domains, 'domains', (x) => x.status !== 'Cancelled' && !!x.expires && day(x.expires) <= addDays(today, 30) && { title: day(x.expires) < today ? 'Domain or hosting expired' : 'Renewal coming up', body: `${x.domain} (${x.client}), ${longDate(day(x.expires))}`, urgent: day(x.expires) <= addDays(today, 7) })
  add(source.leads, 'leads', (l) => !['Won', 'Lost'].includes(l.stage) && now - new Date(l.last_activity_at ?? l.created_at).getTime() > 25 * 3600000 && { title: 'Overdue log', body: `${l.company} has had no activity logged in 24 hours` })
  add(source.approvals, 'approvals', (a) => a.status === 'Pending' && { title: 'Approval pending', body: `${a.kind}: ${a.summary}` })
  add(source.help_requests, 'help', (h) => h.status === 'Open' && { title: 'Help requested', body: String(h.summary) })
  add(source.documents, 'documents', (x) => !!x.expires && day(x.expires) < today && { title: 'File expired', body: `${x.title}, ${longDate(day(x.expires))}` })
  return out.sort((a, b) => Number(b.urgent) - Number(a.urgent))
}
