import React, { useState } from 'react'
import { Check, HandHelping, Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, Card, DataTable, Drawer, Field, PageHeader, Progress, useToast } from '../shared/nw/ui'
import { Job, jobs as seed } from '../shared/nw/data'
import { commission, d, ME_PARTNER, rand, Role } from '../shared/nw/lib'

type Props = Partial<typeof args> & { onRole?: (r: Role) => void; onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function Jobs(props: Props) {
  const { dark, role, onRole, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const [rows, setRows] = useState(() => seed.filter((j) => role !== 'partner' || j.partner === ME_PARTNER))
  const [openId, setOpenId] = useState<string | null>(null)
  const open = rows.find((j) => j.id === openId) ?? null
  const update = (j: Job) => setRows((r) => r.map((x) => (x.id === j.id ? j : x)))
  const byType = (t: Job['type']) => rows.filter((j) => j.type === t).length

  return (
    <Shell role={role as Role} page="jobs" dark={dark} onRole={onRole} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Jobs & projects" sub="Commission is set by job type and recalculated as payments clear.">
        <Btn onClick={() => onNavigate?.('schedule')}>Project schedule</Btn>
        <Btn kind="primary" onClick={() => toast('New job draft created')}><Plus className="h-4 w-4" />New job</Btn>
      </PageHeader>

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
          { key: 'type', label: 'Type', render: (j) => <span className="whitespace-nowrap">{j.type}{j.helpRequested ? ' ·' : ''}{j.helpRequested && <HandHelping className="ml-1 inline h-3.5 w-3.5 text-warn" />}</span> },
          ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner', hideSm: true }]),
          { key: 'status', label: 'Status', render: (j) => <Badge>{j.status}</Badge> },
          { key: 'due', label: 'Due', hideSm: true, render: (j) => d(j.due) },
          { key: 'received', label: 'Received', align: 'right', hideSm: true, render: (j) => `${rand(j.received)} / ${rand(j.value)}` },
          { key: 'value', label: 'Partner share', align: 'right', render: (j) => rand(calc(j).partner) },
        ]}
      />

      <Drawer open={!!open} title={open?.title ?? ''} sub={open ? `${open.id} · ${open.client}` : ''} onClose={() => setOpenId(null)}>
        {open && <JobDetail job={open} role={role as Role} onChange={update} />}
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

const calc = (j: Job) => commission({ type: j.type, fees: j.received, vatIncluded: true, bankCharges: 0, thirdParty: j.id === 'J-315' ? 1850 : 0, majorShare: j.majorShare, contributors: j.contributors })

function JobDetail({ job, role, onChange }: { job: Job; role: Role; onChange: (j: Job) => void }) {
  const toast = useToast()
  const c = calc(job)
  const done = job.milestones.filter((m) => m.done).length
  return (
    <div className="space-y-6">
      <div>
        <Field label="Type" value={job.type} />
        <Field label="Status" value={<Badge>{job.status}</Badge>} />
        <Field label="Partner" value={job.partner} />
        <Field label="Due" value={d(job.due)} />
        <Field label="Deposit" value={job.deposit ? <Badge>Paid</Badge> : <Badge>Awaiting deposit</Badge>} />
        <Field label="Balance outstanding" value={rand(job.value - job.received)} />
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-fg">Milestones</span><span className="text-muted">{done}/{job.milestones.length}</span></div>
        <Progress value={(done / job.milestones.length) * 100} />
        <ul className="mt-3 space-y-1.5">
          {job.milestones.map((m, i) => (
            <li key={m.name}>
              <button disabled={role === 'finance'} onClick={() => { const ms = job.milestones.map((x, k) => (k === i ? { ...x, done: !x.done } : x)); onChange({ ...job, milestones: ms }); toast(`Milestone "${m.name}" updated`) }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-soft">
                <span className={`grid h-5 w-5 place-items-center rounded-md ${m.done ? 'bg-lime text-ink' : 'border border-line'}`}>{m.done && <Check className="h-3.5 w-3.5" />}</span>
                <span className={m.done ? 'text-muted' : 'text-fg'}>{m.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-soft p-4">
        <p className="mb-2 text-sm font-semibold text-fg">Commission on {rand(job.received)} received</p>
        <Field label="Less VAT (15%)" value={`− ${rand(c.vat)}`} />
        {job.id === 'J-315' && <Field label="Less approved 3rd-party cost" value={`− ${rand(1850)}`} />}
        <Field label="Net fees" value={rand(c.net)} />
        <Field label={`${job.partner} · ${c.partnerPct}%`} value={rand(c.partner)} />
        {c.contributors.map((x) => <Field key={x.name} label={`${x.name} · ${x.pct}%`} value={rand(x.amount)} />)}
        <Field label={`NextWave · ${c.companyPct}%`} value={rand(c.company)} />
      </div>

      {role !== 'finance' && job.type !== 'Assisted Work' && job.type !== 'Major Project' && (
        <Btn kind="dark" className="w-full" onClick={() => { onChange({ ...job, type: 'Assisted Work', helpRequested: true }); toast(`${job.id} is now Assisted Work · 50/50`) }}>
          <HandHelping className="h-4 w-4" />Request help (converts to Assisted Work)
        </Btn>
      )}
    </div>
  )
}
