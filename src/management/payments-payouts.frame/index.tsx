import { useEffect, useState } from 'react'
import { Lock, Plus, Send } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, Card, DataTable, Drawer, Field, LoadError, PageHeader, Tabs, useToast } from '../shared/nw/ui'
import type { Payment as P, Payout as O } from '../shared/nw/data'
import { toPayment, toPayout, useTable } from '../shared/nw/api'
import { d, monthKey, monthName, nextFriday, rand, Role } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'

type Props = Partial<typeof args> & { onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function PaymentsPayouts(props: Props) {
  const { dark, role, tab: initial, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const [tab, setTab] = useState(initial as 'Payments' | 'Partner payouts')
  useEffect(() => setTab(initial as 'Payments' | 'Partner payouts'), [initial])
  const [pay, setPay] = useState<P | null>(null)
  const [po, setPo] = useState<O | null>(null)
  const readOnly = role === 'finance'
  const me = useUser()?.name
  const payments = useTable('payments', toPayment)
  const payouts = useTable('payouts', toPayout)
  const mine = <T extends { partner: string }>(r: T[]) => (role === 'partner' ? r.filter((x) => x.partner === me) : r)
  const pays = mine(payments.rows)
  const outs = mine(payouts.rows)
  const batch = nextFriday()
  // Scheduled payouts dated up to this Friday, including any that were missed earlier.
  const nextBatch = outs.filter((o) => o.status === 'Scheduled' && o.batch <= batch)
  const partnerCount = new Set(nextBatch.map((o) => o.partner)).size

  return (
    <Shell role={role as Role} page={tab === 'Payments' ? 'payments' : 'payouts'} dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={tab === 'Payments' ? 'Payments' : 'Partner payouts'} sub={tab === 'Payments' ? 'Client money in. Commission is only released on cleared funds.' : 'Paid within 7 business days of cleared funds, in a weekly Friday batch.'}>
        <Tabs value={tab} options={['Payments', 'Partner payouts']} onChange={(t) => { setTab(t); onNavigate?.(t === 'Payments' ? 'payments' : 'payouts') }} />
        {readOnly ? <span className="inline-flex items-center gap-1.5 rounded-lg bg-soft px-3 py-2 text-sm font-semibold text-muted"><Lock className="h-4 w-4" />Read-only</span>
          : role === 'admin' && (tab === 'Payments' ? <Btn kind="primary" onClick={() => toast('Recording payments isn’t available yet')}><Plus className="h-4 w-4" />Record payment</Btn> : <Btn kind="primary" onClick={() => toast('Batch approval isn’t available yet')}><Send className="h-4 w-4" />Approve Friday batch</Btn>)}
      </PageHeader>

      <LoadError message={payments.error || payouts.error} />

      {tab === 'Payments' ? (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <Stat label={`Cleared · ${monthName()}`} value={rand(pays.filter((p) => p.status === 'Cleared' && p.date.startsWith(monthKey())).reduce((s, p) => s + p.amount, 0))} primary />
            <Stat label="Pending clearance" value={rand(pays.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0))} />
            <Stat label="Refunded" value={rand(pays.filter((p) => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0))} />
          </div>
          <DataTable name="Payments" rows={pays} onRow={setPay} filters={[{ key: 'status', label: 'Statuses' }, { key: 'method', label: 'Methods' }]}
            cols={[
              { key: 'id', label: 'Payment', render: (p) => <span className="font-semibold">{p.id}</span> },
              { key: 'date', label: 'Date', render: (p) => <span className="whitespace-nowrap">{d(p.date)}</span> },
              { key: 'client', label: 'Client' },
              { key: 'invoice', label: 'Invoice', hideSm: true },
              { key: 'method', label: 'Method', hideSm: true },
              { key: 'bankCharges', label: 'Bank fee', align: 'right', hideSm: true, render: (p) => rand(p.bankCharges) },
              { key: 'status', label: 'Status', render: (p) => <Badge>{p.status}</Badge> },
              { key: 'amount', label: 'Amount', align: 'right', render: (p) => <b>{rand(p.amount)}</b> },
            ]} />
        </>
      ) : (
        <>
          <Card className="mb-5 flex flex-wrap items-center gap-6 p-5">
            <div className="min-w-0">
              <p className="text-sm text-muted">Next batch · Friday {d(batch)}</p>
              <p className="font-display text-3xl font-extrabold text-fg tabular">{rand(nextBatch.reduce((s, o) => s + o.amount, 0))}</p>
            </div>
            <div className="text-sm text-muted">{partnerCount} partner{partnerCount === 1 ? '' : 's'}</div>
            <Btn className="ml-auto" onClick={() => toast('Statement generation isn’t available yet')}>Generate statements</Btn>
          </Card>
          <DataTable name="Payouts" rows={outs} onRow={setPo} filters={[{ key: 'status', label: 'Statuses' }]}
            cols={[
              { key: 'id', label: 'Payout', render: (o) => <span className="font-semibold">{o.id}</span> },
              ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner' }]),
              { key: 'batch', label: 'Batch (Fri)', render: (o) => <span className="whitespace-nowrap">{d(o.batch)}</span> },
              { key: 'status', label: 'Status', render: (o) => <Badge>{o.status}</Badge> },
              { key: 'amount', label: 'Amount', align: 'right', render: (o) => <b>{rand(o.amount)}</b> },
            ]} />
        </>
      )}

      <Drawer open={!!pay} title={pay?.id ?? ''} sub={pay ? `${pay.client} · ${pay.invoice}` : ''} onClose={() => setPay(null)}>
        {pay && <div><Field label="Amount" value={rand(pay.amount)} /><Field label="Date" value={d(pay.date)} /><Field label="Method" value={pay.method} /><Field label="Bank charges" value={rand(pay.bankCharges)} /><Field label="Job" value={pay.job} /><Field label="Partner" value={pay.partner} /><Field label="Status" value={<Badge>{pay.status}</Badge>} /></div>}
      </Drawer>
      <Drawer open={!!po} title={`Statement · ${po?.id ?? ''}`} sub={po?.partner} onClose={() => setPo(null)}>
        {po && <div><Field label="Gross fees on jobs" value={rand(po.gross)} /><Field label="Friday batch" value={d(po.batch)} /><Field label="Payout" value={rand(po.amount)} /><Field label="Status" value={<Badge>{po.status}</Badge>} /><Btn className="mt-4 w-full" onClick={() => toast('Statement download isn’t available yet')}>Download statement PDF</Btn></div>}
      </Drawer>
    </Shell>
  )
}

export const args = {
  dark: false,
  role: 'admin',
  tab: 'Payments',
}

export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
  tab: { control: 'radio', options: ['Payments', 'Partner payouts'] },
}

function Stat({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return <div className={`rounded-xl p-4 ${primary ? 'bg-ink text-white' : 'bg-soft'}`}><p className={`text-sm ${primary ? 'text-white/60' : 'text-muted'}`}>{label}</p><p className={`font-display text-2xl font-bold tabular ${primary ? 'text-lime' : 'text-fg'}`}>{value}</p></div>
}
