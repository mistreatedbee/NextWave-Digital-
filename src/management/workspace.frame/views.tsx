import { resource, rights, RESOURCES, Table } from '../../../shared/resources'
import { day, Row, toRecord, useTable } from '../shared/nw/api'
import { d, exportCsv, isoDate, monthKey, rand, Role } from '../shared/nw/lib'
import { canAccess } from '../shared/nw/nav'
import { useNotifications } from '../shared/nw/notifications'
import { Badge, Btn, Card, DataTable, Empty, LoadError } from '../shared/nw/ui'

type Go = (page: string) => void
const sum = (rows: Row[], key: string) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0)
const today = () => isoDate(new Date())
const useRows = (role: Role, table: Table) => useTable(table, toRecord, !!rights(role, table))

function Metrics({ items }: { items: [string, string][] }) {
  return <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(([l, v]) => <Card key={l} className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p><p className="font-display mt-1 text-xl font-bold text-fg tabular">{v}</p></Card>)}</div>
}

export function FinanceDashboard({ role }: { role: Role }) {
  const payments = useRows(role, 'payments'), invoices = useRows(role, 'invoices'), payouts = useRows(role, 'payouts'), expenses = useRows(role, 'expenses')
  const open = invoices.rows.filter((i) => ['Issued', 'Partial'].includes(i.status))
  const overdue = open.filter((i) => i.due && day(i.due) < today())
  const owing = (rows: Row[]) => rows.reduce((s, i) => s + Math.max(0, i.amount - i.paid), 0)
  const month = monthKey()
  return (
    <>
      <LoadError message={payments.error || invoices.error || payouts.error || expenses.error} />
      <Metrics items={[
        ['Cleared this month', rand(sum(payments.rows.filter((p) => p.status === 'Cleared' && day(p.payment_date).startsWith(month)), 'amount'))],
        ['Receivables', rand(owing(open))],
        ['Overdue invoices', `${overdue.length} · ${rand(owing(overdue))}`],
        ['Payouts scheduled', rand(sum(payouts.rows.filter((p) => p.status === 'Scheduled'), 'amount'))],
        ['Pending clearance', rand(sum(payments.rows.filter((p) => p.status === 'Pending'), 'amount'))],
        ['Expenses this month', rand(sum(expenses.rows.filter((e) => e.status === 'Approved' && day(e.expense_date).startsWith(month)), 'amount'))],
      ]} />
    </>
  )
}

export function FinancialReports({ role }: { role: Role }) {
  const payments = useRows(role, 'payments'), payouts = useRows(role, 'payouts'), expenses = useRows(role, 'expenses')
  const now = new Date()
  const rows = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = monthKey(date)
    const cleared = payments.rows.filter((p) => p.status === 'Cleared' && day(p.payment_date).startsWith(key))
    const received = sum(cleared, 'amount')
    const vat = Math.round((received * 15) / 115)
    const bank = sum(cleared, 'bank_charges')
    const spent = sum(expenses.rows.filter((e) => e.status === 'Approved' && day(e.expense_date).startsWith(key)), 'amount')
    const paid = sum(payouts.rows.filter((p) => p.status === 'Paid' && day(p.batch).startsWith(key)), 'amount')
    return { month: date.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), received, vat, bank, spent, paid, net: received - vat - bank - spent - paid }
  })
  const money = (key: 'received' | 'vat' | 'bank' | 'spent' | 'paid' | 'net', label: string) => ({ key, label, align: 'right' as const, render: (r: (typeof rows)[number]) => rand(r[key]) })
  return (
    <>
      <LoadError message={payments.error || payouts.error || expenses.error} />
      <DataTable name="Monthly summary" rows={rows} cols={[{ key: 'month', label: 'Month' }, money('received', 'Fees received'), money('vat', 'VAT (15%)'), money('bank', 'Bank charges'), money('spent', 'Expenses'), money('paid', 'Partner payouts'), money('net', 'Net')]} />
      <p className="mt-3 text-xs text-muted">A cash view of the last 12 months. VAT assumes all fees include 15%.</p>
    </>
  )
}

export function MarketingDashboard({ role }: { role: Role }) {
  const campaigns = useRows(role, 'campaigns'), content = useRows(role, 'content'), accounts = useRows(role, 'social_accounts')
  const active = campaigns.rows.filter((c) => c.status === 'Active')
  return (
    <>
      <LoadError message={campaigns.error || content.error || accounts.error} />
      <Metrics items={[['Active campaigns', String(active.length)], ['Active budget', rand(sum(active, 'budget'))], ['Leads from campaigns', String(sum(campaigns.rows, 'leads_generated'))], ['Scheduled content', String(content.rows.filter((c) => c.status === 'Scheduled').length)], ['Published content', String(content.rows.filter((c) => c.status === 'Published').length)], ['Accounts to review', String(accounts.rows.filter((a) => a.status === 'Needs review').length)]]} />
    </>
  )
}

export function TutoringDashboard({ role }: { role: Role }) {
  const students = useRows(role, 'students'), sessions = useRows(role, 'sessions')
  const held = sessions.rows.filter((s) => ['Attended', 'Missed'].includes(s.status))
  const upcoming = sessions.rows.filter((s) => s.status === 'Scheduled' && day(s.session_date) >= today())
  return (
    <>
      <LoadError message={students.error || sessions.error} />
      <Metrics items={[['Students', String(students.rows.length)], ['Consent outstanding', String(students.rows.filter((s) => s.consent !== 'Given').length)], ['Upcoming sessions', String(upcoming.length)], ['Attendance', held.length ? `${Math.round((held.filter((s) => s.status === 'Attended').length / held.length) * 100)}%` : '—']]} />
    </>
  )
}

type Entry = { date: string; kind: string; title: string; who: string; status: string; page: string }
function Agenda({ name, entries, go }: { name: string; entries: Entry[]; go: Go }) {
  const sorted = [...entries].filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date))
  return <DataTable name={name} rows={sorted} onRow={(e) => go(e.page)} filters={[{ key: 'kind', label: 'Types' }]} cols={[
    { key: 'date', label: 'Date', render: (e) => <span className="whitespace-nowrap">{d(e.date)}</span> }, { key: 'kind', label: 'Type' }, { key: 'title', label: 'Item' }, { key: 'who', label: 'Partner' },
    { key: 'status', label: 'Status', render: (e) => <Badge>{e.status}</Badge> },
  ]} />
}
const entry = (date: unknown, kind: string, title: string, who: unknown, status: string, page: string): Entry => ({ date: day(date), kind, title, who: String(who ?? ''), status, page })
const dueState = (date: unknown, status: string) => (status !== 'Done' && date && day(date) < today() ? 'Overdue' : status)

export function Schedule({ role, go }: { role: Role; go: Go }) {
  const jobs = useRows(role, 'jobs'), tasks = useRows(role, 'tasks')
  return (
    <>
      <LoadError message={jobs.error || tasks.error} />
      <Agenda name="Schedule" go={go} entries={[
        ...jobs.rows.map((j) => entry(j.due, 'Job due', `${j.id} · ${j.title}`, j.partner, dueState(j.due, j.status), 'jobs')),
        ...tasks.rows.map((t) => entry(t.due, 'Task due', t.title, t.partner, dueState(t.due, t.status), 'tasks')),
      ]} />
    </>
  )
}

export function CalendarFeed({ role, go }: { role: Role; go: Go }) {
  const jobs = useRows(role, 'jobs'), tasks = useRows(role, 'tasks'), sessions = useRows(role, 'sessions'), events = useRows(role, 'events')
  const entries = [
    ...events.rows.map((e) => entry(e.event_date, e.kind, `${e.event_time ? `${e.event_time} · ` : ''}${e.title}`, e.partner, 'Planned', 'calendar')),
    ...sessions.rows.map((s) => entry(s.session_date, 'Session', `${s.session_time ? `${s.session_time} · ` : ''}${s.student}`, s.partner, s.status, 'sessions')),
    ...jobs.rows.filter((j) => j.status !== 'Done').map((j) => entry(j.due, 'Job due', j.title, j.partner, dueState(j.due, j.status), 'jobs')),
    ...tasks.rows.filter((t) => t.status !== 'Done').map((t) => entry(t.due, 'Task due', t.title, t.partner, dueState(t.due, t.status), 'tasks')),
  ].filter((e) => e.date >= today() || e.status === 'Overdue')
  return (
    <>
      <LoadError message={jobs.error || tasks.error || sessions.error || events.error} />
      <h2 className="mb-2 font-semibold text-fg">Coming up</h2>
      <Agenda name="Agenda" go={go} entries={entries} />
    </>
  )
}

export function WeeklyReport({ role }: { role: Role }) {
  const leads = useRows(role, 'leads'), jobs = useRows(role, 'jobs'), tasks = useRows(role, 'tasks'), sessions = useRows(role, 'sessions')
  const since = Date.now() - 7 * 86400000
  const recent = (v: unknown) => !!v && new Date(String(v)).getTime() >= since
  const names = [...new Set([...leads.rows, ...jobs.rows, ...tasks.rows, ...sessions.rows].map((r) => String(r.partner ?? '')).filter(Boolean))].sort()
  const rows = names.map((partner) => {
    const own = (list: Row[]) => list.filter((r) => r.partner === partner)
    return {
      partner,
      newLeads: own(leads.rows).filter((l) => recent(l.created_at)).length,
      logged: own(leads.rows).filter((l) => recent(l.last_activity_at)).length,
      won: own(leads.rows).filter((l) => l.stage === 'Won' && recent(l.last_activity_at)).length,
      jobs: own(jobs.rows).filter((j) => j.status !== 'Done').length,
      sessions: own(sessions.rows).filter((s) => s.status === 'Attended' && recent(`${day(s.session_date)}T12:00:00`)).length,
      overdue: own(tasks.rows).filter((t) => t.status !== 'Done' && t.due && day(t.due) < today()).length,
    }
  })
  return (
    <>
      <LoadError message={leads.error || jobs.error || tasks.error || sessions.error} />
      <DataTable name="Weekly report" rows={rows} cols={[{ key: 'partner', label: 'Partner' }, { key: 'newLeads', label: 'New leads' }, { key: 'logged', label: 'Leads logged' }, { key: 'won', label: 'Won leads updated' }, { key: 'jobs', label: 'Open jobs' }, { key: 'sessions', label: 'Sessions attended' }, { key: 'overdue', label: 'Overdue tasks' }]} />
      <p className="mt-3 text-xs text-muted">Activity over the last 7 days.</p>
    </>
  )
}

function Export({ table, role }: { table: Table; role: Role }) {
  const { rows, error } = useRows(role, table)
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div><p className="font-semibold text-fg">{resource(table).title}</p><p className="text-xs text-muted">{error ? 'Could not load' : `${rows.length} records`}</p></div>
      <Btn disabled={!rows.length} onClick={() => exportCsv(resource(table).title, rows)}>Download CSV</Btn>
    </Card>
  )
}
export function ReportsHub({ role }: { role: Role }) {
  const tables = (Object.keys(RESOURCES) as Table[]).filter((t) => rights(role, t))
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{tables.map((t) => <Export key={t} table={t} role={role} />)}</div>
}

export function Notifications({ role, go }: { role: Role; go: Go }) {
  const alerts = useNotifications(role)
  if (!alerts.length) return <Card><Empty title="Nothing needs attention" body="Overdue items and pending requests will appear here." /></Card>
  return <Card className="divide-y divide-line">{alerts.map((a) => <button key={a.id} onClick={() => go(a.page)} className="block w-full px-4 py-3 text-left hover:bg-soft"><p className="text-sm font-semibold text-fg">{a.title}</p><p className="text-xs text-muted">{a.body}</p></button>)}</Card>
}

const SEARCHABLE: [Table, string][] = [['leads', 'leads'], ['clients', 'clients'], ['jobs', 'jobs'], ['quotes', 'quotes'], ['invoices', 'invoices'], ['payments', 'payments'], ['tasks', 'tasks'], ['documents', 'documents'], ['kb_articles', 'kb']]
function Matches({ table, page, role, query, go }: { table: Table; page: string; role: Role; query: string; go: Go }) {
  const { rows, error } = useRows(role, table)
  const fields = resource(table).fields
  const found = rows.filter((r) => [r.id, ...fields.map((f) => r[f.key])].join(' ').toLowerCase().includes(query.toLowerCase()))
  if (error) return <LoadError message={error} />
  if (!found.length) return null
  return (
    <Card className="p-4">
      <h2 className="mb-2 font-semibold text-fg">{resource(table).title} · {found.length}</h2>
      {found.slice(0, 8).map((r) => <button key={r.id} onClick={() => go(page)} className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-fg hover:bg-soft"><b>{String(r[fields[0].key] ?? r.id)}</b> <span className="text-muted">· {r.id}</span></button>)}
    </Card>
  )
}
export function SearchResults({ role, query, go }: { role: Role; query: string; go: Go }) {
  return (
    <div className="space-y-3">
      {SEARCHABLE.filter(([t, page]) => rights(role, t) && canAccess(role, page)).map(([t, page]) => <Matches key={t} table={t} page={page} role={role} query={query} go={go} />)}
      <p className="text-xs text-muted">Only record types with matches are shown.</p>
    </div>
  )
}
