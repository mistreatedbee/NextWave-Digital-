import { AlertTriangle } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, Card, LoadError, PageHeader, useToast } from '../shared/nw/ui'
import { isOpenLead, isOverdueLead } from '../shared/nw/data'
import { send, toJob, toLead, toPartner, toPayout, toRecord, useTable } from '../shared/nw/api'
import { d, monthKey, rand } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function PartnerDashboard(props: Props) {
  const { dark, onNavigate, onToggleDark } = { ...args, ...props }
  const user = useUser()
  const me = user?.name ?? ''
  const leads = useTable('leads', toLead)
  const jobs = useTable('jobs', toJob)
  const payouts = useTable('payouts', toPayout)
  const partners = useTable('partners', toPartner)
  const error = leads.error || jobs.error || payouts.error || partners.error

  const myLeads = leads.rows.filter((l) => l.partner === me)
  const myJobs = jobs.rows.filter((j) => j.partner === me)
  const myPayouts = payouts.rows.filter((p) => p.partner === me)
  const overdue = myLeads.filter(isOverdueLead)
  const next = myPayouts.filter((p) => p.status === 'Scheduled').sort((a, b) => a.batch.localeCompare(b.batch))[0]
  const paid = myPayouts.filter((p) => p.status === 'Paid')
  const record = partners.rows.find((p) => p.email.toLowerCase() === user?.email.toLowerCase())
  const trialDay = record?.status === 'Trial' && record.created ? Math.floor((Date.now() - new Date(`${record.created}T00:00:00`).getTime()) / 86400000) + 1 : null

  return (
    <Shell role="partner" page="dash-partner" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={me ? `Hi ${me.split(' ')[0]}` : 'My dashboard'} sub="Here’s what needs you today.">
        <Btn kind="primary" onClick={() => onNavigate?.('leads')}>Log activity</Btn>
      </PageHeader>
      <LoadError message={error} />

      {overdue.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-bad/30 bg-bad-soft px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-bad" />
          <p className="min-w-0 flex-1 text-sm text-fg"><b>{overdue.length} lead{overdue.length > 1 ? 's' : ''} not logged in 24 hours: {overdue.map((l) => l.company).join(', ')}.</b> Everything must be logged within 24 hours or it may not count toward commission.</p>
          <Btn kind="dark" onClick={() => onNavigate?.('leads')}>Log now</Btn>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Payout due wins */}
        <Card className="overflow-hidden lg:col-span-2">
          <div className="grid gap-px bg-line sm:grid-cols-[1.3fr_1fr]">
            <div className="bg-ink p-6 text-white">
              <p className="text-sm text-white/60">Next payout</p>
              <p className="font-display mt-1 text-4xl font-extrabold tabular">{rand(next?.amount ?? 0)}</p>
              <p className="mt-2 text-sm text-lime">{next ? `Friday batch · ${d(next.batch)}` : 'No payout scheduled'}</p>
              <p className="mt-4 text-xs text-white/50">Paid within 7 business days of cleared funds</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-line">
              {[
                ['Paid this month', rand(paid.filter((p) => p.batch.startsWith(monthKey())).reduce((s, p) => s + p.amount, 0))],
                ['Paid to date', rand(paid.reduce((s, p) => s + p.amount, 0))],
                ['Open leads', String(myLeads.filter(isOpenLead).length)],
                ['Active jobs', String(myJobs.filter((j) => j.status !== 'Done').length)],
              ].map(([l, v]) => (
                <div key={l} className="bg-card p-4"><p className="text-xs text-muted">{l}</p><p className="font-display mt-1 text-xl font-bold text-fg tabular">{v}</p></div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          {trialDay !== null && (
            <div className="mb-5 flex items-baseline justify-between"><h2 className="font-semibold text-fg">30-day trial</h2><span className="text-sm font-semibold text-fg tabular">{trialDay > 30 ? 'Review due' : `Day ${trialDay} of 30`}</span></div>
          )}
          <h3 className="mb-2 text-sm font-semibold text-fg">Onboarding checklist</h3>
          <Checklist />
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">My jobs</h2><button onClick={() => onNavigate?.('jobs')} className="text-sm font-semibold text-accent">All jobs</button></div>
          {myJobs.length === 0 && <p className="text-sm text-muted">No jobs assigned to you yet.</p>}
          <ul className="divide-y divide-line">
            {myJobs.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <div className="min-w-0 flex-1 basis-56"><p className="text-sm font-semibold text-fg">{j.title}</p><p className="text-xs text-muted">{j.id} · {j.client} · {j.type} · due {d(j.due)}</p></div>
                <Badge>{j.status}</Badge>
                <span className="w-20 text-right text-sm font-semibold tabular text-fg">{rand(j.value)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">My leads</h2><button onClick={() => onNavigate?.('leads')} className="text-sm font-semibold text-accent">Pipeline</button></div>
          {myLeads.length === 0 && <p className="text-sm text-muted">No leads assigned to you yet.</p>}
          <ul className="space-y-2">
            {myLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-fg">{l.company}</span>
                {isOverdueLead(l) && <AlertTriangle className="h-3.5 w-3.5 text-bad" aria-label="Overdue log" />}
                <Badge>{l.stage}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Shell>
  )
}

export const args = {
  dark: false,
}

export const argTypes = {
  dark: { control: 'boolean' },
}

function Checklist() {
  const toast = useToast()
  const { rows, error, reload } = useTable('onboarding', toRecord)
  const submit = async (id: string) => {
    const problem = await send(`/api/onboarding/${id}`, 'PUT', { status: 'Submitted' })
    toast(problem || 'Marked as submitted')
    if (!problem) reload()
  }
  if (error) return <LoadError message={error} />
  if (!rows.length) return <p className="text-sm text-muted">No requirements assigned yet.</p>
  return (
    <ul className="space-y-2">
      {[...rows].sort((a, b) => String(a.id).localeCompare(String(b.id))).map((r) => (
        <li key={r.id} className="flex items-center gap-2 text-sm">
          <span className="min-w-0 flex-1 text-fg">{r.item}</span>
          {r.status === 'Missing' ? <button onClick={() => submit(r.id)} className="text-xs font-semibold text-accent">Mark submitted</button> : <Badge>{r.status}</Badge>}
        </li>
      ))}
    </ul>
  )
}
