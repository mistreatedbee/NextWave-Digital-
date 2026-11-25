import React from 'react'
import { AlertTriangle, Check, HandHelping } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, Card, PageHeader, Progress, useToast } from '../shared/nw/ui'
import { jobs, leads, payouts } from '../shared/nw/data'
import { d, ME_PARTNER, rand, Role } from '../shared/nw/lib'

type Props = Partial<typeof args> & { onRole?: (r: Role) => void; onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function PartnerDashboard(props: Props) {
  const { dark, trialDay, overdue, onRole, onNavigate, onToggleDark } = { ...args, ...props }
  const myLeads = leads.filter((l) => l.partner === ME_PARTNER)
  const myJobs = jobs.filter((j) => j.partner === ME_PARTNER)
  const payout = payouts.find((p) => p.partner === ME_PARTNER && p.status === 'Scheduled')
  return (
    <Shell role="partner" page="dash-partner" dark={dark} onRole={onRole} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Hi Thandi" sub="Here’s what needs you today.">
        <Btn kind="primary" onClick={() => onNavigate?.('leads')}>Log activity</Btn>
      </PageHeader>

      {overdue && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-bad/30 bg-bad-soft px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-bad" />
          <p className="min-w-0 flex-1 text-sm text-fg"><b>Call notes for Zulu Fitness are 41 hours old.</b> Everything must be logged within 24 hours or it may not count toward commission.</p>
          <Btn kind="dark" onClick={() => onNavigate?.('leads')}>Log now</Btn>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Payout due wins */}
        <Card className="overflow-hidden lg:col-span-2">
          <div className="grid gap-px bg-line sm:grid-cols-[1.3fr_1fr]">
            <div className="bg-ink p-6 text-white">
              <p className="text-sm text-white/60">Next payout</p>
              <p className="font-display mt-1 text-4xl font-extrabold tabular">{rand(payout?.amount ?? 0)}</p>
              <p className="mt-2 text-sm text-lime">Friday batch · {d(payout?.batch ?? '2026-11-27')}</p>
              <p className="mt-4 text-xs text-white/50">Paid within 7 business days of cleared funds · {payout?.jobs}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-line">
              {[
                ['Earned this month', rand(5130)],
                ['Earned to date', rand(18450)],
                ['Open leads', String(myLeads.filter((l) => !['Won', 'Lost'].includes(l.stage)).length)],
                ['Active jobs', String(myJobs.filter((j) => j.status !== 'Done').length)],
              ].map(([l, v]) => (
                <div key={l} className="bg-card p-4"><p className="text-xs text-muted">{l}</p><p className="font-display mt-1 text-xl font-bold text-fg tabular">{v}</p></div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-baseline justify-between"><h2 className="font-semibold text-fg">30-day trial</h2><span className="text-sm font-semibold text-fg tabular">Day {trialDay} of 30</span></div>
          <Progress value={(trialDay / 30) * 100} className="mt-3" />
          <p className="mt-2 text-xs text-muted">Review on {d('2026-12-07')}. Goals: 3 won jobs (2 ✓), all logs on time, onboarding complete.</p>
          <h3 className="mt-5 mb-2 text-sm font-semibold text-fg">Onboarding checklist</h3>
          <Checklist />
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">My jobs</h2><button onClick={() => onNavigate?.('jobs')} className="text-sm font-semibold text-accent">All jobs</button></div>
          <ul className="divide-y divide-line">
            {myJobs.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <div className="min-w-0 flex-1 basis-56"><p className="text-sm font-semibold text-fg">{j.title}</p><p className="text-xs text-muted">{j.id} · {j.client} · {j.type} · due {d(j.due)}</p></div>
                {j.helpRequested && <span className="flex items-center gap-1 text-xs text-warn"><HandHelping className="h-3.5 w-3.5" />Help requested</span>}
                <Badge>{j.status}</Badge>
                <span className="w-20 text-right text-sm font-semibold tabular text-fg">{rand(j.value)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-fg">My leads</h2><button onClick={() => onNavigate?.('leads')} className="text-sm font-semibold text-accent">Pipeline</button></div>
          <ul className="space-y-2">
            {myLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-fg">{l.company}</span>
                {l.loggedHrs > 24 && <AlertTriangle className="h-3.5 w-3.5 text-bad" aria-label="Overdue log" />}
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
  trialDay: 18,
  overdue: true,
}

export const argTypes = {
  dark: { control: 'boolean' },
  trialDay: { control: 'range', min: 1, max: 30 },
  overdue: { control: 'boolean' },
}

function Checklist() {
  const toast = useToast()
  const items = [
    ['Information form', true], ['NDA signed', true], ['Partnership & Commission Agreement', true],
    ['Police clearance', false], ['System access', true], ['Training: commission & POPIA', false],
  ] as const
  return (
    <ul className="space-y-1.5">
      {items.map(([t, done]) => (
        <li key={t} className="flex items-center gap-2 text-sm">
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${done ? 'bg-lime text-ink' : 'border border-line'}`}>{done && <Check className="h-3.5 w-3.5" />}</span>
          <span className={done ? 'text-muted line-through' : 'text-fg'}>{t}</span>
          {!done && <button onClick={() => toast(`${t}: upload started`)} className="ml-auto text-xs font-semibold text-accent">Upload</button>}
        </li>
      ))}
    </ul>
  )
}
