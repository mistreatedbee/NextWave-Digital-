import React from 'react'
import { AlertTriangle, ArrowUpRight, Check, X } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Avatar, Badge, Btn, Card, PageHeader, useToast } from '../shared/nw/ui'
import { approvals, leads, overdueLogs, partners, revenueSeries } from '../shared/nw/data'
import { rand, Role } from '../shared/nw/lib'

type Props = Partial<typeof args> & { onRole?: (r: Role) => void; onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function AdminDashboard(props: Props) {
  const { dark, period, onRole, onNavigate, onToggleDark } = { ...args, ...props }
  return (
    <Shell role="admin" page="dash-admin" dark={dark} onRole={onRole} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Good morning, Kabelo" sub={`Tuesday, 25 Nov 2026 · ${period}`}>
        <Btn onClick={() => onNavigate?.('approvals')}>Approvals inbox <Badge>4 pending</Badge></Btn>
      </PageHeader>

      {/* KPI band: revenue wins, the rest support it */}
      <Card className="mb-5 grid gap-px overflow-hidden bg-line md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="bg-ink p-5 text-white">
          <p className="text-sm text-white/60">Fees received · November</p>
          <p className="font-display mt-1 text-4xl font-extrabold tabular">{rand(70350)}</p>
          <p className="mt-2 flex items-center gap-1 text-sm text-lime"><ArrowUpRight className="h-4 w-4" />11% vs October</p>
        </div>
        {[
          ['Company share (net)', rand(31200), '44% of net fees'],
          ['Partner commission owed', rand(17850), 'Friday batch · 27 Nov 2026'],
          ['Pipeline (open leads)', rand(158100), '8 open · 3 quotes out'],
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
          <RevenueChart />
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">Approvals</h2><button onClick={() => onNavigate?.('approvals')} className="text-sm font-semibold text-accent">All</button></div>
          <ApprovalList />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-fg">Sales funnel</h2>
          <Funnel />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-fg">Leads by source</h2>
          <Sources />
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 flex items-center gap-2 font-semibold text-fg"><AlertTriangle className="h-4 w-4 text-bad" />Overdue to log</h2>
          <p className="mb-3 text-xs text-muted">Partners must log everything within 24 hours.</p>
          <ul className="space-y-2">
            {overdueLogs.map((o) => (
              <li key={o.item} className="rounded-lg bg-bad-soft px-3 py-2.5">
                <p className="text-sm font-semibold text-fg">{o.item}</p>
                <p className="text-xs text-bad">{o.partner} · {o.hours}h since activity</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">Partner leaderboard · November</h2><button onClick={() => onNavigate?.('partners')} className="text-sm font-semibold text-accent">Partners</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted"><th className="py-2 pr-3">#</th><th className="pr-3">Partner</th><th className="pr-3">Status</th><th className="pr-3 text-right">Leads</th><th className="pr-3 text-right">Jobs</th><th className="text-right">Earnings to date</th></tr></thead>
              <tbody>
                {[...partners].sort((a, b) => b.earnings - a.earnings).map((p, i) => (
                  <tr key={p.name} className="border-t border-line">
                    <td className="py-3 pr-3 font-bold text-muted">{i + 1}</td>
                    <td className="pr-3"><span className="flex items-center gap-2"><Avatar name={p.name} size={7} /><span className="whitespace-nowrap font-semibold text-fg">{p.name}</span></span></td>
                    <td className="pr-3"><Badge>{p.status === 'Trial' ? `Trial · day ${p.trialDay}` : p.status}</Badge></td>
                    <td className="pr-3 text-right tabular">{p.leads}</td>
                    <td className="pr-3 text-right tabular">{p.jobs}</td>
                    <td className="text-right font-semibold tabular">{rand(p.earnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  )
}

export const args = {
  dark: false,
  period: 'November 2026',
}

export const argTypes = {
  dark: { control: 'boolean' },
  period: { control: 'select', options: ['November 2026', 'Q4 2026', 'Year to date'] },
}

function RevenueChart() {
  const max = Math.max(...revenueSeries.map((s) => s.rev))
  return (
    <div className="flex h-56 items-end gap-3 sm:gap-6">
      {revenueSeries.map((s) => (
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

function Funnel() {
  const stages = ['New', 'Contacted', 'Quote sent', 'Won'] as const
  const counts = { New: 31, Contacted: 22, 'Quote sent': 14, Won: 9 }
  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s}>
          <div className="mb-1 flex justify-between text-sm"><span className="text-fg">{s}</span><span className="font-semibold tabular text-fg">{counts[s]}</span></div>
          <div className="h-6 rounded-md bg-soft"><div className="h-full rounded-md bg-lime" style={{ width: `${(counts[s] / 31) * 100}%` }} /></div>
        </div>
      ))}
      <p className="pt-1 text-xs text-muted">29% lead-to-won conversion · 4 lost this month</p>
    </div>
  )
}

function Sources() {
  const map: Record<string, number> = {}
  leads.forEach((l) => (map[l.source] = (map[l.source] ?? 0) + 1))
  const rows = Object.entries(map).sort((a, b) => b[1] - a[1])
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

function ApprovalList() {
  const toast = useToast()
  return (
    <ul className="divide-y divide-line">
      {approvals.map((a) => (
        <li key={a.id} className="flex items-start gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg">{a.kind}{a.amount ? ` · ${rand(a.amount)}` : ''}</p>
            <p className="truncate text-xs text-muted">{a.detail} · {a.by}</p>
          </div>
          <button onClick={() => toast(`${a.id} approved`)} aria-label="Approve" className="rounded-md bg-lime p-1.5 text-ink hover:bg-lime-hover"><Check className="h-4 w-4" /></button>
          <button onClick={() => toast(`${a.id} declined`)} aria-label="Decline" className="rounded-md border border-line p-1.5 text-muted hover:bg-soft"><X className="h-4 w-4" /></button>
        </li>
      ))}
    </ul>
  )
}
