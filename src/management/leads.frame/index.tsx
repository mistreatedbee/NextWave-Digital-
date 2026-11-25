import { useState } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, DataTable, Drawer, Field, LoadError, PageHeader, Tabs, useToast } from '../shared/nw/ui'
import { isOpenLead, isOverdueLead, Lead } from '../shared/nw/data'
import { send, toLead, useTable } from '../shared/nw/api'
import { RecordForm } from '../shared/nw/records'
import { d, isoDate, rand, Role } from '../shared/nw/lib'
import { LEAD_STAGES, rights } from '../../../shared/resources'

type Props = Partial<typeof args> & { openNew?: boolean; onNavigate?: (p: string) => void; onToggleDark?: () => void }
const STAGES = LEAD_STAGES as Lead['stage'][]

export default function Leads(props: Props) {
  const { dark, role: roleName, view, openNew, onNavigate, onToggleDark } = { ...args, ...props }
  const role = roleName as Role
  return (
    <Shell role={role} page="leads" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <LeadBoard role={role} view={view as 'Table' | 'Kanban'} openNew={openNew} />
    </Shell>
  )
}

function LeadBoard({ role, view, openNew }: { role: Role; view: 'Table' | 'Kanban'; openNew?: boolean }) {
  const toast = useToast()
  const [mode, setMode] = useState(view)
  const { rows, error, reload } = useTable('leads', toLead)
  const [panel, setPanel] = useState<{ id?: string; edit: boolean } | null>(openNew ? { edit: true } : null)
  const [note, setNote] = useState('')
  const [drag, setDrag] = useState<string | null>(null)
  const open = rows.find((l) => l.id === panel?.id)
  const creating = !!panel && panel.id === undefined
  const close = () => { setPanel(null); setNote('') }
  const show = (l: Lead) => { setNote(''); setPanel({ id: l.id, edit: false }) }

  const update = async (id: string, body: Record<string, unknown>, done: string) => {
    const problem = await send(`/api/leads/${id}`, 'PUT', body)
    toast(problem || done)
    if (!problem) reload()
    return !problem
  }
  const move = (id: string, stage: Lead['stage']) => { if (rows.find((l) => l.id === id)?.stage !== stage) update(id, { stage }, `Moved to ${stage}`) }
  const logActivity = async (lead: Lead) => {
    const entry = `${d(isoDate(new Date()))}: ${note.trim()}`
    if (await update(lead.id, { notes: lead.notes ? `${entry}\n${lead.notes}` : entry }, 'Activity logged')) setNote('')
  }
  const quote = async (lead: Lead) => {
    const body = { client: lead.company, title: `${lead.service} for ${lead.company}`, amount: lead.value, status: 'Draft', ...(role === 'admin' ? { partner: lead.partner } : {}) }
    const problem = await send('/api/quotes', 'POST', body)
    toast(problem || 'Draft quote created. Find it under Quotes.')
  }

  const overdue = rows.filter(isOverdueLead)
  const canCreate = !!rights(role, 'leads')?.create
  const newButton = canCreate && <Btn kind="primary" onClick={() => setPanel({ edit: true })}><Plus className="h-4 w-4" />New lead</Btn>

  return (
    <>
      <PageHeader title="Leads" sub={`${role === 'partner' ? 'Your leads' : `${rows.length} leads`} · ${rand(rows.filter(isOpenLead).reduce((s, l) => s + l.value, 0))} open pipeline`}>
        <Tabs value={mode} options={['Table', 'Kanban']} onChange={setMode} />
        {newButton}
      </PageHeader>
      <LoadError message={error} />

      {overdue.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-bad-soft px-4 py-3 text-sm text-fg">
          <AlertTriangle className="h-4 w-4 shrink-0 text-bad" />
          <span><b>{overdue.length} lead{overdue.length > 1 ? 's' : ''} not logged in 24h:</b> {overdue.map((o) => o.company).join(', ')}</span>
        </div>
      )}

      {mode === 'Table' ? (
        <DataTable
          name="Leads"
          rows={rows}
          onRow={show}
          filters={[{ key: 'stage', label: 'Stages' }, { key: 'source', label: 'Sources' }, ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partners' }])]}
          emptyAction={newButton || undefined}
          cols={[
            { key: 'company', label: 'Company', render: (l) => <div><p className="font-semibold">{l.company}</p><p className="text-xs text-muted">{l.name} · {l.id}</p></div> },
            { key: 'service', label: 'Service', hideSm: true },
            { key: 'source', label: 'Source', hideSm: true },
            ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner', hideSm: true }]),
            { key: 'stage', label: 'Stage', render: (l) => <Badge>{l.stage}</Badge> },
            { key: 'loggedHrs', label: 'Last log', render: (l) => (isOverdueLead(l) ? <Badge>{`Overdue · ${l.loggedHrs}h`}</Badge> : <span className="text-muted">{l.loggedHrs}h ago</span>) },
            { key: 'value', label: 'Value', align: 'right', render: (l) => rand(l.value) },
          ]}
        />
      ) : (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {STAGES.map((s) => {
            const col = rows.filter((l) => l.stage === s)
            return (
              <div key={s} onDragOver={(e) => e.preventDefault()} onDrop={() => drag && move(drag, s)} className="flex w-72 shrink-0 flex-col rounded-xl bg-soft p-2 lg:w-auto lg:flex-1">
                <div className="flex items-center justify-between px-2 py-2"><span className="text-sm font-semibold text-fg">{s}</span><span className="text-xs text-muted tabular">{col.length} · {rand(col.reduce((a, l) => a + l.value, 0))}</span></div>
                <div className="flex min-h-24 flex-col gap-2">
                  {col.map((l) => (
                    <button key={l.id} draggable onDragStart={() => setDrag(l.id)} onClick={() => show(l)} className="rounded-lg border border-line bg-card p-3 text-left hover:border-fg/20">
                      <p className="text-sm font-semibold text-fg">{l.company}</p>
                      <p className="text-xs text-muted">{l.service} · {l.source}</p>
                      <div className="mt-2 flex items-center justify-between"><span className="text-sm font-semibold tabular text-fg">{rand(l.value)}</span>{isOverdueLead(l) && <AlertTriangle className="h-4 w-4 text-bad" />}</div>
                    </button>
                  ))}
                  {col.length === 0 && <p className="px-2 py-4 text-center text-xs text-muted">Drop a lead here</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Drawer open={creating || !!open} title={creating ? 'New lead' : open?.company ?? ''} sub={open ? `${open.id} · ${open.name}` : ''} onClose={close}>
        {panel?.edit ? (
          <RecordForm key={panel.id ?? 'new'} table="leads" role={role} row={open?.raw} onCancel={close} onSaved={() => { close(); reload() }} />
        ) : open && (
          <div>
            <Field label="Stage" value={<Badge>{open.stage}</Badge>} />
            <Field label="Service" value={open.service} />
            <Field label="Source" value={open.source || '—'} />
            <Field label="Partner" value={open.partner || 'Unassigned'} />
            <Field label="Estimated value" value={rand(open.value)} />
            <Field label="Created" value={d(open.created)} />
            <p className="mb-2 mt-5 text-sm font-semibold text-fg">Move to</p>
            <div className="flex flex-wrap gap-2">{STAGES.map((s) => <Btn key={s} kind={s === open.stage ? 'primary' : 'ghost'} disabled={s === open.stage} onClick={() => move(open.id, s)}>{s}</Btn>)}</div>
            <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) logActivity(open) }} className="mt-5">
              <label className="block text-sm font-semibold text-fg">Log activity<textarea required rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal text-fg outline-none" /></label>
              <Btn type="submit" kind="primary" className="mt-2">Save log</Btn>
            </form>
            {open.notes && <p className="mt-4 whitespace-pre-wrap rounded-lg bg-soft p-3 text-sm text-fg">{open.notes}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <Btn kind="dark" onClick={() => quote(open)}>Create draft quote</Btn>
              <Btn onClick={() => setPanel({ id: open.id, edit: true })}>Edit</Btn>
              {rights(role, 'leads')?.remove && <Btn kind="danger" onClick={async () => { if (!window.confirm(`Delete the lead for ${open.company}?`)) return; const problem = await send(`/api/leads/${open.id}`, 'DELETE'); toast(problem || 'Lead deleted'); if (!problem) { close(); reload() } }}>Delete</Btn>}
            </div>
          </div>
        )}
      </Drawer>
    </>
  )
}

export const args = {
  dark: false,
  role: 'admin',
  view: 'Table',
}

export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
  view: { control: 'radio', options: ['Table', 'Kanban'] },
}
