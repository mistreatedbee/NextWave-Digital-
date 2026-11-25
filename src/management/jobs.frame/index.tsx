import { useState } from 'react'
import { HandHelping, Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, DataTable, Drawer, Field, LoadError, PageHeader, useToast } from '../shared/nw/ui'
import type { Job, Payment, Payout } from '../shared/nw/data'
import { send, toJob, toPayment, toPayout, useTable } from '../shared/nw/api'
import { RecordForm } from '../shared/nw/records'
import { d, nextFriday, rand, Role } from '../shared/nw/lib'
import { jobShares, shareUnknown } from '../shared/nw/shares'

type Props = Partial<typeof args> & { openNew?: boolean; onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function Jobs(props: Props) {
  const { dark, role: roleName, openNew, onNavigate, onToggleDark } = { ...args, ...props }
  const role = roleName as Role
  return (
    <Shell role={role} page="jobs" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <JobList role={role} openNew={openNew} onNavigate={onNavigate} />
    </Shell>
  )
}

function JobList({ role, openNew, onNavigate }: { role: Role; openNew?: boolean; onNavigate?: (p: string) => void }) {
  const toast = useToast()
  const admin = role === 'admin'
  const { rows, error, reload } = useTable('jobs', toJob)
  const payments = useTable('payments', toPayment, admin)
  const payouts = useTable('payouts', toPayout, admin)
  const [panel, setPanel] = useState<{ id?: string; edit: boolean } | null>(openNew && admin ? { edit: true } : null)
  const open = rows.find((j) => j.id === panel?.id)
  const creating = !!panel && panel.id === undefined
  const close = () => setPanel(null)
  const byType = (t: Job['type']) => rows.filter((j) => j.type === t).length

  const requestHelp = async (job: Job) => {
    const problem = await send(`/api/jobs/${job.id}`, 'PUT', { job_type: 'Assisted Work' })
    if (problem) { toast(problem); return }
    const logged = await send('/api/help_requests', 'POST', { job: job.id, summary: `Help needed on ${job.title}`, status: 'Open', ...(admin ? { partner: job.partner } : {}) })
    toast(logged ? `Converted to Assisted Work, but the help request failed: ${logged}` : 'Converted to Assisted Work and help requested')
    reload()
  }
  const remove = async (job: Job) => {
    if (!window.confirm(`Delete job ${job.id}?`)) return
    const problem = await send(`/api/jobs/${job.id}`, 'DELETE')
    toast(problem || 'Job deleted')
    if (!problem) { close(); reload() }
  }

  return (
    <>
      <PageHeader title="Jobs & projects" sub="Commission is set by job type and recalculated as payments clear.">
        <Btn onClick={() => onNavigate?.('schedule')}>Project schedule</Btn>
        {admin && <Btn kind="primary" onClick={() => setPanel({ edit: true })}><Plus className="h-4 w-4" />New job</Btn>}
      </PageHeader>
      <LoadError message={error || payments.error || payouts.error} />

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
        onRow={(j) => setPanel({ id: j.id, edit: false })}
        filters={[{ key: 'type', label: 'Types' }, { key: 'status', label: 'Statuses' }]}
        cols={[
          { key: 'title', label: 'Job', render: (j) => <div><p className="font-semibold">{j.title}</p><p className="text-xs text-muted">{j.id} · {j.client}</p></div> },
          { key: 'type', label: 'Type', render: (j) => <span className="whitespace-nowrap">{j.type}</span> },
          ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner', hideSm: true }]),
          { key: 'status', label: 'Status', render: (j) => <Badge>{j.status}</Badge> },
          { key: 'due', label: 'Due', hideSm: true, render: (j) => d(j.due) },
          { key: 'received', label: 'Received', align: 'right', hideSm: true, render: (j) => `${rand(j.received)} / ${rand(j.value)}` },
          { key: 'value', label: 'Partner share', align: 'right', render: (j) => (shareUnknown(j) ? 'Not set' : rand(jobShares(j).partner)) },
        ]}
      />

      <Drawer open={creating || !!open} title={creating ? 'New job' : open?.title ?? ''} sub={open ? `${open.id} · ${open.client}` : ''} onClose={close}>
        {panel?.edit ? (
          <RecordForm key={panel.id ?? 'new'} table="jobs" role={role} row={open?.raw} onCancel={close} onSaved={() => { close(); reload() }} />
        ) : open && (
          <>
            <JobDetail job={open} />
            {admin && <PayoutAction job={open} payments={payments.rows} payouts={payouts.rows} ready={!payments.error && !payouts.error} onDone={payouts.reload} />}
            {open.status !== 'Done' && (open.type === 'Standard Job' || open.type === 'Independent Work') && (
              <Btn kind="dark" className="mt-4 w-full" onClick={() => requestHelp(open)}><HandHelping className="h-4 w-4" />Request help (converts to Assisted Work)</Btn>
            )}
            {admin && <div className="mt-4 flex gap-2"><Btn onClick={() => setPanel({ id: open.id, edit: true })}>Edit</Btn><Btn kind="danger" onClick={() => remove(open)}>Delete</Btn></div>}
          </>
        )}
      </Drawer>
    </>
  )
}

function JobDetail({ job }: { job: Job }) {
  const c = jobShares(job)
  return (
    <div className="space-y-6">
      <div>
        <Field label="Type" value={job.type} />
        <Field label="Status" value={<Badge>{job.status}</Badge>} />
        <Field label="Partner" value={job.partner || 'Unassigned'} />
        <Field label="Due" value={d(job.due)} />
        <Field label="Job value" value={rand(job.value)} />
        <Field label="Balance outstanding" value={rand(Math.max(0, job.value - job.received))} />
      </div>
      <div className="rounded-xl bg-soft p-4">
        <p className="mb-2 text-sm font-semibold text-fg">Commission on {rand(job.received)} received</p>
        <Field label="Less VAT (15%)" value={`− ${rand(c.vat)}`} />
        <Field label="Less bank charges" value={`− ${rand(job.bankCharges)}`} />
        <Field label="Less approved third-party costs" value={`− ${rand(job.thirdParty)}`} />
        <Field label="Net fees" value={rand(c.net)} />
        {shareUnknown(job) ? <p className="pt-2 text-xs text-muted">The partner share for this Major Project hasn’t been set.</p> : (
          <>
            <Field label={`${job.partner || 'Partner'} · ${c.partnerPct}%`} value={rand(c.partner)} />
            {c.contributors.map((x) => <Field key={x.name} label={`${x.name} · ${x.pct}%`} value={rand(x.amount)} />)}
            <Field label={`NextWave · ${c.companyPct}%`} value={rand(c.company)} />
          </>
        )}
        {c.over100 && <p className="pt-2 text-xs font-semibold text-bad">Shares exceed 100% of net fees. Correct the job or its contributors.</p>}
      </div>
    </div>
  )
}

/** Schedules whatever commission is earned on cleared funds and not yet in a payout. */
function PayoutAction({ job, payments, payouts, ready, onDone }: { job: Job; payments: Payment[]; payouts: Payout[]; ready: boolean; onDone: () => void }) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  if (shareUnknown(job) || !job.partner || jobShares(job).over100) return null
  const already = payouts.filter((p) => p.job === job.id && !p.status.startsWith('Reversed')).reduce((s, p) => s + p.amount, 0)
  const due = jobShares(job).partner - already
  const cleared = payments.filter((p) => p.job === job.id && p.status === 'Cleared').map((p) => p.date).sort().pop()
  const schedule = async () => {
    setBusy(true)
    const problem = await send('/api/payouts', 'POST', { partner: job.partner, job: job.id, cleared_date: cleared ?? '', batch: nextFriday(), gross: job.received, amount: due, status: 'Scheduled' })
    setBusy(false)
    toast(problem || `Payout of ${rand(due)} scheduled`)
    if (!problem) onDone()
  }
  return (
    <div className="mt-4 rounded-xl border border-line p-4">
      <Field label="Already in payouts" value={rand(already)} />
      <Field label={due < 0 ? 'Overpaid' : 'Not yet scheduled'} value={rand(Math.abs(due))} />
      {due < 0 && <p className="mt-2 text-xs font-semibold text-bad">More is scheduled or paid than is earned, for example after a refund. Review this job’s payouts.</p>}
      {due > 0 && <Btn kind="primary" className="mt-3 w-full" disabled={!ready || busy} onClick={schedule}>Schedule payout of {rand(due)}</Btn>}
    </div>
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
