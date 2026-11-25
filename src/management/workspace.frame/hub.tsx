import { useState } from 'react'
import { Plus } from 'lucide-react'
import { buildPrompt, Change, parseChanges } from '../../../shared/assistant'
import { todaySA } from '../../../shared/documents/model'
import { editableFields, resource, Table } from '../../../shared/resources'
import { api, day, Row, send, toRecord, useTable } from '../shared/nw/api'
import { d, rand } from '../shared/nw/lib'
import { RecordForm } from '../shared/nw/records'
import { Badge, Btn, Card, DataTable, Drawer, LoadError, useToast } from '../shared/nw/ui'
import { INPUT } from '../documents/common'

const sum = (rows: Row[], pick: (r: Row) => number) => rows.reduce((s, r) => s + pick(r), 0)
const owingOn = (i: Row) => (['Issued', 'Partial'].includes(i.status) ? Math.max(0, i.amount - i.paid) : 0)

/** Everything about one client: money owed and when, work history, what is next. */
export function ClientHub({ go, initial }: { go: (page: string) => void; initial?: string }) {
  const toast = useToast()
  const clients = useTable('clients', toRecord), jobs = useTable('jobs', toRecord), invoices = useTable('invoices', toRecord), payments = useTable('payments', toRecord)
  const logs = useTable('work_log', toRecord), tasks = useTable('tasks', toRecord), domains = useTable('domains', toRecord)
  const [chosen, setChosen] = useState(initial ?? '')
  const [form, setForm] = useState<{ table: Table; row?: Row; defaults?: Row } | null>(null)
  const [reminder, setReminder] = useState<(Row & { id: string }) | null>(null)
  const key = (v: unknown) => String(v ?? '').trim().toLowerCase()
  const client = clients.rows.find((c) => (c.company || c.name) === chosen)
  const mine = (rows: Row[]) => rows.filter((r) => key(r.client) === key(chosen))
  const reload = () => [clients, jobs, invoices, payments, logs, tasks, domains].forEach((t) => t.reload())

  // Money owed comes from invoices; a job without one is owed whatever its value has not yet received.
  const owed = (list: Row[], jobList: Row[]) => {
    const billed = new Set(list.filter((i) => i.status !== 'Cancelled').map((i) => i.job).filter(Boolean))
    return [
      ...list.filter((i) => owingOn(i) > 0).map((i) => ({ id: String(i.id), kind: 'Invoice', client: i.client, what: String(i.id).startsWith('DOC-') ? 'Document centre invoice' : i.id, job: i.job, owing: owingOn(i), due: day(i.due) })),
      ...jobList.filter((j) => !billed.has(j.id) && j.value > j.received).map((j) => ({ id: String(j.id), kind: 'Job', client: j.client, what: j.title, job: j.id, owing: j.value - j.received, due: day(j.payment_due) })),
    ].sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
  }
  const outstanding = chosen ? owed(mine(invoices.rows), mine(jobs.rows)) : owed(invoices.rows, jobs.rows)
  const today = todaySA()
  const late = outstanding.filter((o) => o.due && o.due < today)

  const pay = (o: (typeof outstanding)[number]) => {
    if (o.id.startsWith('DOC-')) go(`doc-center:${o.id}`)
    else setForm({ table: 'payments', defaults: { client: o.client, amount: o.owing, status: 'Cleared', ...(o.kind === 'Invoice' ? { invoice: o.id, job: o.job } : { job: o.id }) } })
  }
  const openReminder = async (id: string) => {
    const response = await api(`/api/reminders/${id}`)
    const data = await response?.json().catch(() => null)
    if (!response?.ok) { toast(data?.error ?? 'Could not prepare the reminder'); return }
    setReminder({ id, ...data })
  }
  const whatsapp = (r: Row) => `https://wa.me/${String(r.phone).replace(/\D/g, '').replace(/^0/, '27')}?text=${encodeURIComponent(r.message)}`
  const add = (table: Table, label: string, defaults: Row = {}) => <Btn onClick={() => setForm({ table, defaults: { client: chosen, ...defaults } })}><Plus className="h-4 w-4" />{label}</Btn>
  const history = mine(logs.rows).sort((a, b) => day(b.log_date).localeCompare(day(a.log_date)))

  return (
    <div className="space-y-5">
      <LoadError message={clients.error || jobs.error || invoices.error || logs.error} />
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-0 flex-1 basis-64 text-sm font-semibold text-fg">Client<select value={chosen} onChange={(e) => setChosen(e.target.value)} className={INPUT}><option value="">All clients</option>{clients.rows.map((c) => <option key={c.id} value={c.company || c.name}>{c.company || c.name}</option>)}</select></label>
        {add('work_log', 'Log work or a call', { kind: 'Work done' })}{add('tasks', 'Add task')}{add('domains', 'Add domain')}{add('payments', 'Record payment', { status: 'Cleared' })}
      </Card>
      {client && <p className="text-sm text-muted">{[client.name, client.phone, client.email].filter(Boolean).join(' · ')}</p>}

      <div className="grid gap-3 sm:grid-cols-3">
        {([['Still owed', rand(sum(outstanding, (o) => o.owing))], ['Overdue', rand(sum(late, (o) => o.owing))], ['Received', rand(sum((chosen ? mine(payments.rows) : payments.rows).filter((p) => p.status === 'Cleared'), (p) => p.amount))]] as const).map(([l, v]) => (
          <Card key={l} className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p><p className="font-display mt-1 text-2xl font-bold text-fg tabular">{v}</p></Card>
        ))}
      </div>

      <Card className="p-4">
        <h2 className="mb-2 font-semibold text-fg">What is owed and when</h2>
        {!outstanding.length && <p className="text-sm text-muted">Nothing outstanding.</p>}
        <ul className="divide-y divide-line">
          {outstanding.map((o) => (
            <li key={`${o.kind}-${o.id}`} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <div className="min-w-0 flex-1 basis-56"><p className="font-semibold text-fg">{chosen ? o.what : `${o.client} · ${o.what}`}</p><p className="text-xs text-muted">{o.kind} · {o.due ? `due ${d(o.due)}` : 'no due date set'}</p></div>
              {o.due && o.due < today && <Badge>Overdue</Badge>}
              <b className="tabular text-fg">{rand(o.owing)}</b>
              <Btn kind="primary" onClick={() => pay(o)}>Record payment</Btn>
              {o.kind === 'Invoice' ? <Btn onClick={() => openReminder(o.id)}>Remind</Btn> : <Btn onClick={() => setForm({ table: 'jobs', row: jobs.rows.find((j) => j.id === o.id) })}>Set due date</Btn>}
            </li>
          ))}
        </ul>
      </Card>

      {chosen ? (
        <>
          <Card className="p-4">
            <h2 className="mb-2 font-semibold text-fg">History</h2>
            {!history.length && <p className="text-sm text-muted">Nothing logged yet for this client.</p>}
            <ul className="divide-y divide-line">
              {history.map((w) => (
                <li key={w.id}><button onClick={() => setForm({ table: 'work_log', row: w })} className="w-full py-2.5 text-left">
                  <span className="flex flex-wrap items-center gap-2 text-sm"><b className="text-fg">{w.summary}</b><Badge>{w.status}</Badge></span>
                  <span className="block text-xs text-muted">{d(day(w.log_date))} · {w.kind}{w.follow_up ? ` · follow up ${d(day(w.follow_up))}` : ''}</span>
                  {w.details && <span className="block whitespace-pre-wrap text-sm text-fg">{w.details}</span>}
                </button></li>
              ))}
            </ul>
          </Card>
          <DataTable name="Open tasks" rows={mine(tasks.rows).filter((t) => t.status !== 'Done')} onRow={(row) => setForm({ table: 'tasks', row })} cols={[{ key: 'title', label: 'Task' }, { key: 'due', label: 'Due', render: (t) => d(day(t.due)) }, { key: 'status', label: 'Status', render: (t) => <Badge>{t.status}</Badge> }]} />
          <DataTable name="Projects" rows={mine(jobs.rows)} onRow={(row) => setForm({ table: 'jobs', row })} cols={[{ key: 'title', label: 'Project' }, { key: 'status', label: 'Status', render: (j) => <Badge>{j.status}</Badge> }, { key: 'value', label: 'Received', align: 'right', render: (j) => `${rand(j.received)} / ${rand(j.value)}` }]} />
          <DataTable name="Domains" rows={mine(domains.rows)} onRow={(row) => setForm({ table: 'domains', row })} cols={[{ key: 'domain', label: 'Domain or service' }, { key: 'expires', label: 'Renews', render: (x) => d(day(x.expires)) }, { key: 'status', label: 'Status', render: (x) => <Badge>{x.status}</Badge> }]} />
        </>
      ) : <p className="text-sm text-muted">Choose a client to see their history, tasks, projects and domains.</p>}

      <Drawer open={!!form} title={form ? `${form.row ? 'Edit' : 'New'} ${resource(form.table).singular}` : ''} onClose={() => setForm(null)}>
        {form && <RecordForm key={`${form.table}-${form.row?.id ?? 'new'}`} table={form.table} role="admin" row={form.row} defaults={form.defaults} onCancel={() => setForm(null)} onSaved={() => { setForm(null); reload() }} />}
      </Drawer>
      <Drawer open={!!reminder} title="Payment reminder" onClose={() => setReminder(null)}>
        {reminder && (
          <div className="space-y-3">
            <textarea readOnly rows={14} aria-label="Reminder message" value={reminder.message} className={INPUT} />
            <div className="flex flex-wrap gap-2">
              <Btn kind="primary" disabled={!reminder.emailConfigured || !reminder.email} onClick={async () => { const problem = await send(`/api/reminders/${reminder.id}`, 'POST', {}); toast(problem || 'Reminder emailed'); if (!problem) { setReminder(null); reload() } }}>Email reminder</Btn>
              {reminder.phone && <a href={whatsapp(reminder)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg border border-line px-3 py-2 text-sm font-semibold text-fg hover:bg-soft">Open in WhatsApp</a>}
              <Btn onClick={() => navigator.clipboard.writeText(reminder.message).then(() => toast('Copied'), () => toast('Select the text and copy it'))}>Copy</Btn>
            </div>
            {!reminder.emailConfigured && <p className="text-xs text-muted">Email isn’t set up yet; use WhatsApp or copy the message.</p>}
            {!reminder.phone && <p className="text-xs text-muted">Add a phone number to the client to use WhatsApp.</p>}
          </div>
        )}
      </Drawer>
    </div>
  )
}

/** Copy a prompt to Claude, paste the reply back, review it, then apply it. */
export function ClaudeUpdates() {
  const toast = useToast()
  const clients = useTable('clients', toRecord), jobs = useTable('jobs', toRecord), invoices = useTable('invoices', toRecord), tasks = useTable('tasks', toRecord)
  const [pasted, setPasted] = useState('')
  const [review, setReview] = useState<{ changes: Change[]; problems: string[] } | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const prompt = buildPrompt(todaySA(), { clients: clients.rows, jobs: jobs.rows, invoices: invoices.rows, tasks: tasks.rows })

  const apply = async () => {
    if (!review) return
    setBusy(true)
    const done: string[] = []
    for (const [n, c] of review.changes.entries()) {
      const problem = await send(c.action === 'create' ? `/api/${c.table}` : `/api/${c.table}/${encodeURIComponent(c.id!)}`, c.action === 'create' ? 'POST' : 'PUT', c.values)
      done.push(`${n + 1}. ${resource(c.table).singular}: ${problem || 'saved'}`)
    }
    setResults(done); setReview(null); setBusy(false); setPasted('')
    ;[clients, jobs, invoices, tasks].forEach((t) => t.reload())
    toast('Finished applying changes')
  }
  const label = (c: Change, key: string) => editableFields('admin', c.table, c.action).find((f) => f.key === key)?.label ?? key

  return (
    <div className="space-y-4">
      <LoadError message={clients.error || jobs.error || invoices.error || tasks.error} />
      <Card className="space-y-2 p-4">
        <h2 className="font-semibold text-fg">1. Copy this prompt into Claude, then describe what happened</h2>
        <p className="text-sm text-muted">It includes your client names, job titles and amounts owed, but no contact, ID or banking details.</p>
        <textarea readOnly rows={8} aria-label="Prompt for Claude" value={prompt} className={INPUT} />
        <Btn kind="primary" onClick={() => navigator.clipboard.writeText(prompt).then(() => toast('Prompt copied'), () => toast('Select the text and copy it'))}>Copy prompt</Btn>
      </Card>
      <Card className="space-y-2 p-4">
        <h2 className="font-semibold text-fg">2. Paste Claude’s reply</h2>
        <textarea rows={8} aria-label="Reply from Claude" value={pasted} onChange={(e) => { setPasted(e.target.value); setReview(null) }} className={INPUT} />
        <Btn disabled={!pasted.trim()} onClick={() => { setResults([]); setReview(parseChanges(pasted)) }}>Review changes</Btn>
      </Card>
      {review && (
        <Card className="space-y-3 p-4">
          <h2 className="font-semibold text-fg">3. Check, then apply</h2>
          {review.problems.map((p) => <p key={p} role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-fg">{p}</p>)}
          {review.changes.map((c, i) => (
            <div key={i} className="rounded-lg border border-line p-3 text-sm">
              <p className="font-semibold text-fg">{c.action === 'create' ? 'Add' : 'Change'} {resource(c.table).singular}{c.id ? ` ${c.id}` : ''}</p>
              {Object.entries(c.values).map(([k, v]) => <p key={k} className="whitespace-pre-wrap text-muted">{label(c, k)}: <span className="text-fg">{String(v)}</span></p>)}
            </div>
          ))}
          {review.changes.length > 0 && <Btn kind="primary" disabled={busy} onClick={apply}>{busy ? 'Applying…' : `Apply ${review.changes.length} change${review.changes.length > 1 ? 's' : ''}`}</Btn>}
        </Card>
      )}
      {results.length > 0 && <Card className="p-4">{results.map((r) => <p key={r} className="text-sm text-fg">{r}</p>)}</Card>}
    </div>
  )
}
