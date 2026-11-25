import { useState } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, DataTable, Drawer, Field, LoadError, PageHeader, Tabs, useToast } from '../shared/nw/ui'
import { isOverdueLead, Lead } from '../shared/nw/data'
import { api, toLead, useTable } from '../shared/nw/api'
import { d, rand, Role } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }
const STAGES: Lead['stage'][] = ['New', 'Contacted', 'Quote sent', 'Won', 'Lost']

export default function Leads(props: Props) {
  const { dark, role, view, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const [mode, setMode] = useState(view as 'Table' | 'Kanban')
  const me = useUser()?.name
  const { rows: all, setRows, error } = useTable('leads', toLead)
  const rows = role === 'partner' ? all.filter((l) => l.partner === me) : all
  const [open, setOpen] = useState<Lead | null>(null)
  const [drag, setDrag] = useState<string | null>(null)
  const move = async (id: string, stage: Lead['stage']) => {
    const response = await api(`/api/leads/${id}`, 'PUT', { stage })
    if (!response?.ok) { toast('Lead could not be updated'); return }
    setRows((r) => r.map((l) => (l.id === id ? { ...l, stage } : l)))
    setOpen((o) => (o?.id === id ? { ...o, stage } : o))
    toast(`${id} moved to ${stage}`)
  }
  const overdue = rows.filter(isOverdueLead)

  return (
    <Shell role={role as Role} page="leads" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Leads" sub={role === 'partner' ? 'Your leads only' : `${rows.length} leads · ${rand(rows.filter((l) => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.value, 0))} open pipeline`}>
        <Tabs value={mode} options={['Table', 'Kanban']} onChange={setMode} />
        <Btn kind="primary" onClick={() => toast('Creating leads isn’t available yet')}><Plus className="h-4 w-4" />New lead</Btn>
      </PageHeader>

      <LoadError message={error} />

      {overdue.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-bad-soft px-4 py-3 text-sm text-fg">
          <AlertTriangle className="h-4 w-4 shrink-0 text-bad" />
          <span><b>{overdue.length} lead{overdue.length > 1 ? 's' : ''} not logged in 24h:</b> {overdue.map((o) => o.id).join(', ')}</span>
        </div>
      )}

      {mode === 'Table' ? (
        <DataTable
          name="Leads"
          rows={rows}
          onRow={setOpen}
          filters={[{ key: 'stage', label: 'Stages' }, { key: 'source', label: 'Sources' }, ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partners' }])]}
          emptyAction={<Btn kind="primary" onClick={() => toast('Creating leads isn’t available yet')}><Plus className="h-4 w-4" />Add your first lead</Btn>}
          cols={[
            { key: 'id', label: 'Lead', render: (l) => <span className="font-semibold">{l.id}</span> },
            { key: 'company', label: 'Company', render: (l) => <div><p className="font-semibold">{l.company}</p><p className="text-xs text-muted">{l.name}</p></div> },
            { key: 'service', label: 'Service', hideSm: true },
            { key: 'source', label: 'Source', hideSm: true },
            ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner', hideSm: true }]),
            { key: 'stage', label: 'Stage', render: (l) => <Badge>{l.stage}</Badge> },
            { key: 'loggedHrs', label: 'Last log', render: (l) => (l.loggedHrs > 24 && !['Won', 'Lost'].includes(l.stage) ? <Badge>{`Overdue · ${l.loggedHrs}h`}</Badge> : <span className="text-muted">{l.loggedHrs}h ago</span>) },
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
                    <button key={l.id} draggable onDragStart={() => setDrag(l.id)} onClick={() => setOpen(l)} className="rounded-lg border border-line bg-card p-3 text-left hover:border-fg/20">
                      <p className="text-sm font-semibold text-fg">{l.company}</p>
                      <p className="text-xs text-muted">{l.service} · {l.source}</p>
                      <div className="mt-2 flex items-center justify-between"><span className="text-sm font-semibold tabular text-fg">{rand(l.value)}</span>{l.loggedHrs > 24 && !['Won', 'Lost'].includes(l.stage) && <AlertTriangle className="h-4 w-4 text-bad" />}</div>
                    </button>
                  ))}
                  {col.length === 0 && <p className="px-2 py-4 text-center text-xs text-muted">Drop a lead here</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Drawer open={!!open} title={open?.company ?? ''} sub={open ? `${open.id} · ${open.name}` : ''} onClose={() => setOpen(null)}>
        {open && (
          <div>
            <Field label="Stage" value={<Badge>{open.stage}</Badge>} />
            <Field label="Service" value={open.service} />
            <Field label="Source" value={open.source} />
            <Field label="Partner" value={open.partner} />
            <Field label="Estimated value" value={rand(open.value)} />
            <Field label="Created" value={d(open.created)} />
            <p className="mt-5 mb-2 text-sm font-semibold text-fg">Move to</p>
            <div className="flex flex-wrap gap-2">{STAGES.map((s) => <Btn key={s} kind={s === open.stage ? 'primary' : 'ghost'} disabled={s === open.stage} onClick={() => move(open.id, s)}>{s}</Btn>)}</div>
            <Btn kind="dark" className="mt-4 w-full" onClick={() => toast('Creating quotes isn’t available yet')}>Create quote</Btn>
          </div>
        )}
      </Drawer>
    </Shell>
  )
}

export const args = {
  dark: false,
  role: 'admin',
  view: 'Table',
  state: 'default',
}

export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
  view: { control: 'radio', options: ['Table', 'Kanban'] },
  state: { control: 'radio', options: ['default', 'empty'] },
}
