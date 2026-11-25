import { AlertTriangle } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Avatar, Badge, Btn, Card, Empty, LoadError, PageHeader } from '../shared/nw/ui'
import { isOpenLead, isOverdueLead, Lead, Payment, Payout } from '../shared/nw/data'
import { toLead, toPartner, toPayment, toPayout, useTable } from '../shared/nw/api'
import { monthKey, monthName, rand } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }

const total = <T,>(rows: T[], value: (r: T) => number) => rows.reduce((s, r) => s + value(r), 0)

export default function AdminDashboard(props: Props) {
  const { dark, onNavigate, onToggleDark } = { ...args, ...props }
  const user = useUser()
  const leads = useTable('leads', toLead)
  const payments = useTable('payments', toPayment)
  const payouts = useTable('payouts', toPayout)
  const partners = useTable('partners', toPartner)
  const error = leads.error || payments.error || payouts.error || partners.error

  const month = monthKey()
  const cleared = payments.rows.filter((p) => p.status === 'Cleared' && p.date.startsWith(month))
  const pending = payments.rows.filter((p) => p.status === 'Pending')
  const owed = payouts.rows.filter((p) => p.status === 'Scheduled')
  const open = leads.rows.filter(isOpenLead)
  const overdue = leads.rows.filter(isOverdueLead)
  const first = user?.name.split(' ')[0]

  return (
    <Shell role="admin" page="dash-admin" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={first ? `Welcome, ${first}` : 'Admin overview'} sub={new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
        <Btn onClick={() => onNavigate?.('approvals')}>Approvals inbox</Btn>
      </PageHeader>
      <LoadError message={error} />

      {/* KPI band: revenue wins, the rest support it */}
      <Card className="mb-5 grid gap-px overflow-hidden bg-line md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="bg-ink p-5 text-white">
          <p className="text-sm text-white/60">Fees received · {monthName()}</p>
          <p className="font-display mt-1 text-4xl font-extrabold tabular">{rand(total(cleared, (p) => p.amount))}</p>
          <p className="mt-2 text-sm text-lime">{cleared.length} cleared payment{cleared.length === 1 ? '' : 's'}</p>
        </div>
        {[
          ['Pending clearance', rand(total(pending, (p) => p.amount)), `${pending.length} pending`],
          ['Partner commission owed', rand(total(owed, (p) => p.amount)), `${owed.length} scheduled payout${owed.length === 1 ? '' : 's'}`],
          ['Pipeline (open leads)', rand(total(open, (l) => l.value)), `${open.length} open · ${open.filter((l) => l.stage === 'Quote sent').length} quotes out`],
        ].map(([l, v, s]) => (
          <div key={l} className="bg-card p-5">
            <p className="text-sm text-muted">{l}</p>
            <p className="font-display mt-1 text-2xl font-bold text-fg tabular">{v}</p>
            <p className="mt-1 text-xs text-muted">{s}</p>
          </div>
        ))}
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-fg">Revenue vs commission</h2>
            <div className="flex gap-4 text-xs text-muted"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-ink dark:bg-fg" />Fees received</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-lime" />Partner commission</span></div>
          </div>
          <RevenueChart payments={payments.rows} payouts={payouts.rows} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-semibold text-fg">Approvals</h2>
          <Empty title="No approvals" body="Approval requests aren’t connected to the database yet." />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-fg">Leads by stage</h2>
          <Stages leads={leads.rows} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-fg">Leads by source</h2>
          <Sources leads={leads.rows} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 flex items-center gap-2 font-semibold text-fg"><AlertTriangle className="h-4 w-4 text-bad" />Overdue to log</h2>
          <p className="mb-3 text-xs text-muted">Partners must log everything within 24 hours.</p>
          {overdue.length === 0 && <p className="text-sm text-muted">Nothing overdue.</p>}
          <ul className="space-y-2">
            {overdue.map((l) => (
              <li key={l.id} className="rounded-lg bg-bad-soft px-3 py-2.5">
                <p className="text-sm font-semibold text-fg">{l.company} ({l.id})</p>
                <p className="text-xs text-bad">{l.partner || 'Unassigned'} · {l.loggedHrs}h since activity</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">Partner leaderboard</h2><button onClick={() => onNavigate?.('partners')} className="text-sm font-semibold text-accent">Partners</button></div>
          {partners.rows.length === 0 ? <Empty title="No partners yet" body="Partners you add will appear here." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-muted"><th className="py-2 pr-3">#</th><th className="pr-3">Partner</th><th className="pr-3">Status</th><th className="pr-3 text-right">Leads</th><th className="pr-3 text-right">Jobs</th><th className="text-right">Earnings to date</th></tr></thead>
                <tbody>
                  {[...partners.rows].sort((a, b) => b.earnings - a.earnings).map((p, i) => (
                    <tr key={p.email} className="border-t border-line">
                      <td className="py-3 pr-3 font-bold text-muted">{i + 1}</td>
                      <td className="pr-3"><span className="flex items-center gap-2"><Avatar name={p.name} size={7} /><span className="whitespace-nowrap font-semibold text-fg">{p.name}</span></span></td>
                      <td className="pr-3"><Badge>{p.status}</Badge></td>
                      <td className="pr-3 text-right tabular">{p.leads}</td>
                      <td className="pr-3 text-right tabular">{p.jobs}</td>
                      <td className="text-right font-semibold tabular">{rand(p.earnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

function RevenueChart({ payments, payouts }: { payments: Payment[]; payouts: Payout[] }) {
  const now = new Date()
  const series = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = monthKey(date)
    return {
      m: date.toLocaleDateString('en-ZA', { month: 'short' }),
      rev: total(payments.filter((p) => p.status === 'Cleared' && p.date.startsWith(key)), (p) => p.amount),
      com: total(payouts.filter((p) => ['Scheduled', 'Paid'].includes(p.status) && p.batch.startsWith(key)), (p) => p.amount),
    }
  })
  const max = Math.max(...series.flatMap((s) => [s.rev, s.com]))
  if (max <= 0) return <Empty title="No revenue yet" body="Cleared payments and payouts will chart here." />
  return (
    <div className="flex h-56 items-end gap-3 sm:gap-6">
      {series.map((s) => (
        <div key={s.m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="flex h-full w-full items-end justify-center gap-1">
            <div title={rand(s.rev)} className="w-1/2 max-w-7 rounded-t-md bg-ink dark:bg-fg" style={{ height: `${(s.rev / max) * 100}%` }} />
            <div title={rand(s.com)} className="w-1/2 max-w-7 rounded-t-md bg-lime" style={{ height: `${(s.com / max) * 100}%` }} />
          </div>
          <span className="text-xs text-muted">{s.m}</span>
        </div>
      ))}
    </div>
  )
}

function Stages({ leads }: { leads: Lead[] }) {
  const stages: Lead['stage'][] = ['New', 'Contacted', 'Quote sent', 'Won', 'Lost']
  const counts = stages.map((s) => ({ s, n: leads.filter((l) => l.stage === s).length }))
  const max = Math.max(1, ...counts.map((c) => c.n))
  const won = leads.filter((l) => l.stage === 'Won').length
  return (
    <div className="space-y-2">
      {counts.map(({ s, n }) => (
        <div key={s}>
          <div className="mb-1 flex justify-between text-sm"><span className="text-fg">{s}</span><span className="font-semibold tabular text-fg">{n}</span></div>
          <div className="h-6 rounded-md bg-soft"><div className="h-full rounded-md bg-lime" style={{ width: `${(n / max) * 100}%` }} /></div>
        </div>
      ))}
      {leads.length > 0 && <p className="pt-1 text-xs text-muted">{Math.round((won / leads.length) * 100)}% of all leads won</p>}
    </div>
  )
}

function Sources({ leads }: { leads: Lead[] }) {
  const map: Record<string, number> = {}
  leads.forEach((l) => { const s = l.source || 'Unknown'; map[s] = (map[s] ?? 0) + 1 })
  const rows = Object.entries(map).sort((a, b) => b[1] - a[1])
  if (!rows.length) return <p className="text-sm text-muted">No leads yet.</p>
  return (
    <ul className="space-y-3">
      {rows.map(([s, n]) => (
        <li key={s} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 text-fg">{s}</span>
          <span className="h-2 flex-1 rounded-full bg-soft"><span className="block h-full rounded-full bg-ink dark:bg-lime" style={{ width: `${(n / rows[0][1]) * 100}%` }} /></span>
          <span className="w-5 text-right font-semibold tabular">{n}</span>
        </li>
      ))}
    </ul>
  )
}
