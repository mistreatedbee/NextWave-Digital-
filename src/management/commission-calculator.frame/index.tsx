import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Btn, Card, PageHeader } from '../shared/nw/ui'
import { commission, JobType, rand, Role } from '../shared/nw/lib'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }
const TYPES: JobType[] = ['Standard Job', 'Independent Work', 'Assisted Work', 'Major Project']

export default function CommissionCalculator(props: Props) {
  const { dark, role, jobType, fees, onNavigate, onToggleDark } = { ...args, ...props }
  const [type, setType] = useState<JobType>(jobType as JobType)
  const [amount, setAmount] = useState(fees)
  const [vatIncl, setVatIncl] = useState(true)
  const [bank, setBank] = useState(0)
  const [third, setThird] = useState(0)
  const [delivers, setDelivers] = useState(true)
  const [share, setShare] = useState(45)
  const [contribs, setContribs] = useState<{ name: string; pct: number }[]>([])
  const [refund, setRefund] = useState(0)

  const range = delivers ? [40, 50] : [20, 30]
  const shareClamped = Math.min(range[1], Math.max(range[0], share))
  const c = commission({ type, fees: amount, vatIncluded: vatIncl, bankCharges: bank, thirdParty: third, majorShare: shareClamped, contributors: contribs })
  // A refund can never claw back more than was received.
  const refundRatio = amount ? Math.min(1, refund / amount) : 0
  const warn = type === 'Standard Job' && amount > 500 ? 'Standard Jobs are R500 or less — choose another type.' : type === 'Major Project' && amount <= 10000 ? 'Major Projects are above R10 000.' : null

  return (
    <Shell role={role as Role} page="commission" dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title="Commission calculator" sub="Net fees = fees received − VAT − bank charges − approved third-party costs.">
        <Btn onClick={() => window.print()}>Print / save PDF</Btn>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card className="p-5 sm:p-6">
          <p className="mb-2 text-sm font-semibold text-fg">Job type</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors duration-150 ${type === t ? 'border-ink bg-ink text-white dark:border-lime dark:bg-lime dark:text-ink' : 'border-line text-fg hover:bg-soft'}`}>
                <span className="block font-semibold">{t}</span>
                <span className={`block text-xs ${type === t ? 'opacity-70' : 'text-muted'}`}>{{ 'Standard Job': '100 / 0', 'Independent Work': '80 / 20', 'Assisted Work': '50 / 50', 'Major Project': '20–50%' }[t]}</span>
              </button>
            ))}
          </div>
          {warn && <p className="mt-2 text-xs font-semibold text-bad">{warn}</p>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Num label="Fees received (R)" value={amount} onChange={setAmount} />
            <label className="flex items-end gap-2 pb-2 text-sm text-fg"><input type="checkbox" checked={vatIncl} onChange={(e) => setVatIncl(e.target.checked)} className="h-4 w-4 accent-[#B5D300]" />Amount includes 15% VAT</label>
            <Num label="Bank charges (R)" value={bank} onChange={setBank} />
            <Num label="Approved third-party costs (R)" value={third} onChange={setThird} />
          </div>

          {type === 'Major Project' && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-semibold text-fg">Lead partner role</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Btn kind={!delivers ? 'primary' : 'ghost'} onClick={() => { setDelivers(false); setShare(25) }}>Found the client only · 20–30%</Btn>
                <Btn kind={delivers ? 'primary' : 'ghost'} onClick={() => { setDelivers(true); setShare(45) }}>Also delivers · 40–50%</Btn>
              </div>
              <label className="mt-4 block text-sm text-fg">Partner share: <b className="tabular">{shareClamped}%</b>
                <input type="range" min={range[0]} max={range[1]} value={shareClamped} onChange={(e) => setShare(+e.target.value)} className="mt-2 w-full accent-[#B5D300]" />
              </label>
              <p className="mt-4 mb-2 text-sm font-semibold text-fg">Extra contributors</p>
              {contribs.map((x, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input value={x.name} onChange={(e) => setContribs(contribs.map((y, k) => (k === i ? { ...y, name: e.target.value } : y)))} className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg" />
                  <input type="number" value={x.pct} onChange={(e) => setContribs(contribs.map((y, k) => (k === i ? { ...y, pct: Math.max(0, +e.target.value) } : y)))} className="w-20 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg" />
                  <button onClick={() => setContribs(contribs.filter((_, k) => k !== i))} aria-label="Remove" className="rounded-lg p-2 text-muted hover:bg-soft"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <Btn onClick={() => setContribs([...contribs, { name: 'New contributor', pct: 5 }])}><Plus className="h-4 w-4" />Add contributor</Btn>
              {c.over100 && <p className="mt-2 text-xs font-semibold text-bad">Shares exceed 100% of net fees.</p>}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <Num label="Refund issued (R) — shared in the same proportion" value={refund} onChange={setRefund} />
          </div>
        </Card>

        {/* Breakdown */}
        <Card className="self-start overflow-hidden">
          <div className="bg-ink p-6 text-white">
            <p className="text-sm text-white/60">Partner receives</p>
            <p className="font-display mt-1 text-4xl font-extrabold tabular">{rand(c.partner - c.partner * refundRatio)}</p>
            <p className="mt-1 text-sm text-lime">{c.partnerPct}% of net fees</p>
          </div>
          <div className="p-5">
            <Row label="Fees received" value={rand(amount)} />
            <Row label="VAT (15%)" value={`− ${rand(c.vat)}`} muted />
            <Row label="Bank charges" value={`− ${rand(bank)}`} muted />
            <Row label="Third-party costs" value={`− ${rand(third)}`} muted />
            <Row label="Net fees" value={rand(c.net)} strong />
            <div className="my-3 flex h-3 overflow-hidden rounded-full bg-soft">
              <div className="bg-lime" style={{ width: `${c.partnerPct}%` }} />
              {c.contributors.map((x, i) => <div key={i} className="border-l border-card bg-ink/60 dark:bg-fg/50" style={{ width: `${x.pct}%` }} />)}
              <div className="flex-1 bg-ink dark:bg-fg" />
            </div>
            <Row label={`Partner · ${c.partnerPct}%`} value={rand(c.partner)} />
            {c.contributors.map((x) => <Row key={x.name} label={`${x.name} · ${x.pct}%`} value={rand(x.amount)} />)}
            <Row label={`NextWave · ${c.companyPct}%`} value={rand(c.company)} />
            {refund > 0 && (
              <div className="mt-3 rounded-lg bg-warn-soft p-3 text-xs text-fg">
                Refund of {rand(Math.min(refund, amount))} reduces partner by {rand(c.partner * refundRatio)}, company by {rand(c.company * refundRatio)}{c.contributors.map((x) => `, ${x.name} by ${rand(x.amount * refundRatio)}`).join('')}.
              </div>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  )
}

export const args = {
  dark: false,
  role: 'admin',
  jobType: 'Independent Work',
  fees: 0,
}

export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
  jobType: { control: 'select', options: ['Standard Job', 'Independent Work', 'Assisted Work', 'Major Project'] },
  fees: { control: 'number' },
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm text-muted">{label}
      <input type="number" min="0" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-base font-semibold text-fg tabular outline-none focus:border-fg/40" />
    </label>
  )
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return <div className={`flex justify-between py-1.5 text-sm ${strong ? 'mt-1 border-t border-line pt-2.5 font-bold text-fg' : muted ? 'text-muted' : 'text-fg'}`}><span>{label}</span><span className="tabular">{value}</span></div>
}
