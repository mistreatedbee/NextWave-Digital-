import { useState } from 'react'
import { HandHelping, Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, DataTable, Drawer, Field, LoadError, PageHeader, useToast } from '../shared/nw/ui'
import type { Job } from '../shared/nw/data'
import { api, toJob, useTable } from '../shared/nw/api'
import { commission, d, rand, Role } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function Jobs(props: Props) {
  const { dark, role, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const me = useUser()?.name
  const { rows: all, setRows, error } = useTable('jobs', toJob)
  const rows = role === 'partner' ? all.filter((j) => j.partner === me) : all
  const [openId, setOpenId] = useState<string | null>(null)
  const open = rows.find((j) => j.id === openId) ?? null
  const requestHelp = async (j: Job) => {
    const response = await api(`/api/jobs/${j.id}`, 'PUT', { job_type: 'Assisted Work' })
    if (!response?.ok) { toast('Job could not be updated'); return }
    setRows((r) => r.map((x) => (x.id === j.id ? { ...x, type: 'Assisted Work' } : x)))
    toast(`${j.id} is now Assisted Work · 50/50`)
  }
  const byType = (t: Job['type']) => rows.filter((j) => j.type === t).length

  return (
    <Shell role={role as Role} page="jobs" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Jobs & projects" sub="Commission is set by job type and recalculated as payments clear.">
        <Btn onClick={() => onNavigate?.('schedule')}>Project schedule</Btn>
        <Btn kind="primary" onClick={() => toast('Creating jobs isn’t available yet')}><Plus className="h-4 w-4" />New job</Btn>
      </PageHeader>

      <LoadError message={error} />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          ['Standard Job', '≤ R500 · Partner 100%'],
          ['Independent Work', 'Partner 80 / Company 20'],
          ['Assisted Work', 'Partner 50 / Company 50'],
          ['Major Project', '> R10 000 · Partner 20–50%'],
        ] as const).map(([t, rule]) => (
          <div key={t} className="rounded-xl bg-soft p-4">
            <p className="font-display text-2xl font-bold text-fg tabular">{byType(t)}</p>
            <p className="text-sm font-semibold text-fg">{t}</p>
            <p className="text-xs text-muted">{rule}</p>
          </div>
        ))}
      </div>

      <DataTable
        name="Jobs"
        rows={rows}
        onRow={(j) => setOpenId(j.id)}
        filters={[{ key: 'type', label: 'Types' }, { key: 'status', label: 'Statuses' }]}
        cols={[
          { key: 'id', label: 'Job', render: (j) => <div><p className="font-semibold">{j.title}</p><p className="text-xs text-muted">{j.id} · {j.client}</p></div> },
          { key: 'type', label: 'Type', render: (j) => <span className="whitespace-nowrap">{j.type}</span> },
          ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner', hideSm: true }]),
          { key: 'status', label: 'Status', render: (j) => <Badge>{j.status}</Badge> },
          { key: 'due', label: 'Due', hideSm: true, render: (j) => d(j.due) },
          { key: 'received', label: 'Received', align: 'right', hideSm: true, render: (j) => `${rand(j.received)} / ${rand(j.value)}` },
          { key: 'value', label: 'Partner share', align: 'right', render: (j) => (shareUnknown(j) ? 'Not set' : rand(calc(j).partner)) },
        ]}
      />

      <Drawer open={!!open} title={open?.title ?? ''} sub={open ? `${open.id} · ${open.client}` : ''} onClose={() => setOpenId(null)}>
        {open && <JobDetail job={open} role={role as Role} onRequestHelp={requestHelp} />}
      </Drawer>
    </Shell>
  )
}

export const args = {
  dark: false,
  role: 'admin',
}

export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
}

// Bank charges and third-party costs aren't stored per job yet, so only VAT is deducted here.
const calc = (j: Job) => commission({ type: j.type, fees: j.received, vatIncluded: true, bankCharges: 0, thirdParty: 0, majorShare: j.majorShare, contributors: j.contributors })
/** A Major Project share is negotiated (20–50%), so never assume one. */
const shareUnknown = (j: Job) => j.type === 'Major Project' && j.majorShare === undefined

function JobDetail({ job, role, onRequestHelp }: { job: Job; role: Role; onRequestHelp: (j: Job) => void }) {
  const c = calc(job)
  return (
    <div className="space-y-6">
      <div>
        <Field label="Type" value={job.type} />
        <Field label="Status" value={<Badge>{job.status}</Badge>} />
        <Field label="Partner" value={job.partner || 'Unassigned'} />
        <Field label="Due" value={d(job.due)} />
        <Field label="Balance outstanding" value={rand(Math.max(0, job.value - job.received))} />
      </div>

      <div className="rounded-xl bg-soft p-4">
        <p className="mb-2 text-sm font-semibold text-fg">Estimated commission on {rand(job.received)} received</p>
        <Field label="Less VAT (15%)" value={`− ${rand(c.vat)}`} />
        <Field label="Net fees" value={rand(c.net)} />
        {shareUnknown(job) ? <p className="pt-2 text-xs text-muted">The partner share for this Major Project hasn’t been recorded.</p> : (
          <>
            <Field label={`${job.partner || 'Partner'} · ${c.partnerPct}%`} value={rand(c.partner)} />
            <Field label={`NextWave · ${c.companyPct}%`} value={rand(c.company)} />
          </>
        )}
        <p className="pt-2 text-xs text-muted">Excludes bank charges and third-party costs.</p>
      </div>

      {role !== 'finance' && job.status !== 'Done' && (job.type === 'Standard Job' || job.type === 'Independent Work') && (
        <Btn kind="dark" className="w-full" onClick={() => onRequestHelp(job)}>
          <HandHelping className="h-4 w-4" />Request help (converts to Assisted Work)
        </Btn>
      )}
    </div>
  )
}
