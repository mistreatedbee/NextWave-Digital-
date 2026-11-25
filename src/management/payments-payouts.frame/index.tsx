import { useState } from 'react'
import { Lock, Plus, Send } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { Badge, Btn, Card, DataTable, Drawer, Field, LoadError, PageHeader, Tabs, useToast } from '../shared/nw/ui'
import type { Payment as P, Payout as O } from '../shared/nw/data'
import { send, toPayment, toPayout, useTable } from '../shared/nw/api'
import { RecordForm } from '../shared/nw/records'
import { addBusinessDays, d, isoDate, monthKey, monthName, nextFriday, rand, Role } from '../shared/nw/lib'

type Tab = 'Payments' | 'Partner payouts'
type Props = Partial<typeof args> & { openNew?: boolean; onNavigate?: (p: string) => void; onToggleDark?: () => void }

export default function PaymentsPayouts(props: Props) {
  const { dark, role, tab, onNavigate, onToggleDark } = { ...args, ...props }
  return (
    <Shell role={role as Role} page={tab === 'Payments' ? 'payments' : 'payouts'} dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <Money role={role as Role} tab={tab as Tab} openNew={props.openNew} onNavigate={onNavigate} />
    </Shell>
  )
}

function Money({ role, tab, openNew, onNavigate }: { role: Role; tab: Tab; openNew?: boolean; onNavigate?: (p: string) => void }) {
  const toast = useToast()
  const admin = role === 'admin'
  const [form, setForm] = useState<{ row?: Record<string, any> } | null>(openNew && admin ? {} : null)
  const [busy, setBusy] = useState(false)
  const [pay, setPay] = useState<P | null>(null)
  const [po, setPo] = useState<O | null>(null)
  const readOnly = !admin
  const payments = useTable('payments', toPayment)
  const payouts = useTable('payouts', toPayout)
  const pays = payments.rows
  const outs = payouts.rows
  const batch = nextFriday()
  // Scheduled payouts dated up to this Friday, including any that were missed earlier.
  const nextBatch = outs.filter((o) => o.status === 'Scheduled' && o.batch <= batch)
  const partnerCount = new Set(nextBatch.map((o) => o.partner)).size
  const lateBy = (o: O) => o.status === 'Scheduled' && !!o.clearedDate && addBusinessDays(o.clearedDate, 7) < isoDate(new Date())
  const table = tab === 'Payments' ? 'payments' as const : 'payouts' as const
  const closeAll = () => { setForm(null); setPay(null); setPo(null) }
  const saved = () => { closeAll(); payments.reload(); payouts.reload() }

  const payBatch = async () => {
    if (!window.confirm(`Mark ${nextBatch.length} payout(s) totalling ${rand(nextBatch.reduce((s, o) => s + o.amount, 0))} as paid? Do this only after the money has been sent.`)) return
    setBusy(true)
    let failed = 0
    for (const o of nextBatch) if (await send(`/api/payouts/${o.id}`, 'PUT', { status: 'Paid' })) failed++
    setBusy(false)
    toast(failed ? `${failed} payout(s) could not be updated` : 'Batch marked as paid')
    payouts.reload()
  }
  const remove = async (id: string) => {
    if (!window.confirm(`Delete ${id}? This cannot be undone.`)) return
    const problem = await send(`/api/${table}/${id}`, 'DELETE')
    toast(problem || 'Deleted')
    if (!problem) saved()
  }
  const actions = (row: { id: string; raw: Record<string, any> }) => row.id.startsWith('DOC-') ? <Btn className="mt-4 w-full" onClick={() => onNavigate?.(`doc-center:${row.id.replace(/-\d+$/, '')}`)}>Open the invoice in the Document centre</Btn> : admin && <div className="mt-4 flex gap-2"><Btn onClick={() => { setPay(null); setPo(null); setForm({ row: row.raw }) }}>Edit</Btn><Btn kind="danger" onClick={() => remove(row.id)}>Delete</Btn></div>

  return (
    <>
      <PageHeader title={tab === 'Payments' ? 'Payments' : 'Partner payouts'} sub={tab === 'Payments' ? 'Client money in. Commission is only released on cleared funds.' : 'Paid within 7 business days of cleared funds, in a weekly Friday batch.'}>
        <Tabs value={tab} options={['Payments', 'Partner payouts']} onChange={(t) => onNavigate?.(t === 'Payments' ? 'payments' : 'payouts')} />
        {readOnly ? <span className="inline-flex items-center gap-1.5 rounded-lg bg-soft px-3 py-2 text-sm font-semibold text-muted"><Lock className="h-4 w-4" />Read-only</span>
          : <Btn kind="primary" onClick={() => setForm({})}><Plus className="h-4 w-4" />{tab === 'Payments' ? 'Record payment' : 'New payout'}</Btn>}
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
            {admin && <Btn kind="primary" className="ml-auto" disabled={busy || !nextBatch.length} onClick={payBatch}><Send className="h-4 w-4" />Mark batch as paid</Btn>}
          </Card>
          <DataTable name="Payouts" rows={outs} onRow={setPo} filters={[{ key: 'status', label: 'Statuses' }]}
            cols={[
              { key: 'id', label: 'Payout', render: (o) => <span className="font-semibold">{o.id}</span> },
              ...(role === 'partner' ? [] : [{ key: 'partner' as const, label: 'Partner' }]),
              { key: 'batch', label: 'Batch (Fri)', render: (o) => <span className="whitespace-nowrap">{d(o.batch)}</span> },
              { key: 'job', label: 'Job', hideSm: true },
              { key: 'clearedDate', label: 'Pay by', hideSm: true, render: (o) => d(addBusinessDays(o.clearedDate, 7)) },
              { key: 'status', label: 'Status', render: (o) => <Badge>{lateBy(o) ? 'Overdue' : o.status}</Badge> },
              { key: 'amount', label: 'Amount', align: 'right', render: (o) => <b>{rand(o.amount)}</b> },
            ]} />
        </>
      )}

      <Drawer open={!!pay} title={pay?.id ?? ''} sub={pay ? `${pay.client} · ${pay.invoice}` : ''} onClose={() => setPay(null)}>
        {pay && <div><Field label="Amount" value={rand(pay.amount)} /><Field label="Date" value={d(pay.date)} /><Field label="Method" value={pay.method} /><Field label="Bank charges" value={rand(pay.bankCharges)} /><Field label="Job" value={pay.job} /><Field label="Partner" value={pay.partner} /><Field label="Status" value={<Badge>{pay.status}</Badge>} />{actions(pay)}</div>}
      </Drawer>
      <Drawer open={!!po} title={`Statement · ${po?.id ?? ''}`} sub={po?.partner} onClose={() => setPo(null)}>
        {po && <div><Field label="Partner" value={po.partner} /><Field label="Job" value={po.job || '—'} /><Field label="Gross fees on job" value={rand(po.gross)} /><Field label="Funds cleared" value={d(po.clearedDate)} /><Field label="Must be paid by" value={d(addBusinessDays(po.clearedDate, 7))} /><Field label="Friday batch" value={d(po.batch)} /><Field label="Payout" value={rand(po.amount)} /><Field label="Status" value={<Badge>{po.status}</Badge>} /><Btn className="mt-4 w-full" onClick={() => window.print()}>Print / save PDF</Btn>{actions(po)}</div>}
      </Drawer>
      <Drawer open={!!form} title={`${form?.row ? 'Edit' : 'New'} ${table === 'payments' ? 'payment' : 'payout'}`} onClose={() => setForm(null)}>
        {form && <RecordForm key={form.row?.id ?? 'new'} table={table} role={role} row={form.row} defaults={table === 'payouts' && !form.row ? { batch } : undefined} onCancel={() => setForm(null)} onSaved={saved} />}
      </Drawer>
    </>
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
