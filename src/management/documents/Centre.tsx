import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { displayStatus, DOC_TYPES, DocRecord, DocType, longDate, money, totals } from '../../../shared/documents/model'
import { api, Row, toRecord, useTable } from '../shared/nw/api'
import { Badge, Btn, Card, DataTable, LoadError, useToast } from '../shared/nw/ui'
import { INPUT } from './common'

export default function Centre({ go }: { go: (page: string) => void }) {
  const toast = useToast()
  const docs = useTable('docs', toRecord)
  const clients = useTable('clients', toRecord)
  const [type, setType] = useState<DocType>('quote')
  const [client, setClient] = useState('')
  const [filter, setFilter] = useState({ type: '', status: '', client: '', from: '', to: '' })
  const [busy, setBusy] = useState(false)

  const rows = useMemo(() => docs.rows.map((d: Row) => {
    const doc = d as unknown as DocRecord
    return {
      id: doc.id, reference: doc.reference, type: DOC_TYPES[doc.type].label, kind: doc.type, status: displayStatus(doc), stored: doc.status,
      client: doc.data.client.company || doc.data.client.name || '—', project: doc.data.projectName, issued: doc.data.issueDate, totals: totals(doc.data),
    }
  }), [docs.rows])
  const shown = rows.filter((r) => (!filter.type || r.kind === filter.type) && (!filter.status || r.status === filter.status) && (!filter.client || r.client === filter.client) && (!filter.from || r.issued >= filter.from) && (!filter.to || r.issued <= filter.to))
  const add = (list: typeof rows, pick: (r: (typeof rows)[number]) => number) => list.reduce((s, r) => s + pick(r), 0)
  const quotes = shown.filter((r) => r.kind === 'quote' && r.status !== 'Declined')
  const invoices = shown.filter((r) => r.kind === 'invoice' && r.stored !== 'Draft')
  const options = (key: 'status' | 'client') => [...new Set(rows.map((r) => r[key]))].sort()

  const create = async () => {
    setBusy(true)
    const response = await api('/api/docs', 'POST', { type, clientId: client || undefined })
    const data = await response?.json().catch(() => null)
    setBusy(false)
    if (!response?.ok) { toast(data?.error ?? 'Could not create the document'); return }
    go(`doc-center:${data.id}`)
  }
  const select = (label: string, value: string, set: (v: string) => void, entries: [string, string][], all: string) => (
    <label className="text-sm font-semibold text-fg">{label}<select value={value} onChange={(e) => set(e.target.value)} className={INPUT}><option value="">{all}</option>{entries.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
  )

  return (
    <div className="space-y-5">
      <LoadError message={docs.error} />
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-0 flex-1 basis-52 text-sm font-semibold text-fg">New document<select value={type} onChange={(e) => setType(e.target.value as DocType)} className={INPUT}>{Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
        <div className="min-w-0 flex-1 basis-52">{select('Client', client, setClient, clients.rows.map((c) => [c.id, c.company || c.name]), 'No client yet')}</div>
        <Btn kind="primary" disabled={busy} onClick={create}><Plus className="h-4 w-4" />Create</Btn>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {([['Total quoted', add(quotes, (r) => r.totals.total)], ['Invoiced', add(invoices, (r) => r.totals.total)], ['Paid', add(invoices, (r) => r.totals.paid)], ['Outstanding', add(invoices, (r) => r.totals.balance)]] as const).map(([l, v]) => (
          <Card key={l} className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p><p className="font-display mt-1 text-xl font-bold text-fg tabular">{money(v)}</p></Card>
        ))}
      </div>

      <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        {select('Type', filter.type, (v) => setFilter({ ...filter, type: v }), Object.entries(DOC_TYPES).map(([k, v]) => [k, v.label]), 'All types')}
        {select('Status', filter.status, (v) => setFilter({ ...filter, status: v }), options('status').map((v) => [v, v]), 'All statuses')}
        {select('Client', filter.client, (v) => setFilter({ ...filter, client: v }), options('client').map((v) => [v, v]), 'All clients')}
        <label className="text-sm font-semibold text-fg">From<input type="date" value={filter.from} onChange={(e) => setFilter({ ...filter, from: e.target.value })} className={INPUT} /></label>
        <label className="text-sm font-semibold text-fg">To<input type="date" value={filter.to} onChange={(e) => setFilter({ ...filter, to: e.target.value })} className={INPUT} /></label>
      </Card>

      <DataTable name="Documents" rows={shown} onRow={(r) => go(`doc-center:${r.id}`)} cols={[
        { key: 'reference', label: 'Reference', render: (r) => <b>{r.reference}</b> },
        { key: 'type', label: 'Type' },
        { key: 'client', label: 'Client', render: (r) => <div><p className="font-semibold">{r.client}</p><p className="text-xs text-muted">{r.project}</p></div> },
        { key: 'issued', label: 'Date', hideSm: true, render: (r) => <span className="whitespace-nowrap">{longDate(r.issued)}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
        { key: 'totals', label: 'Total', align: 'right', render: (r) => (r.totals.total ? money(r.totals.total) : '—') },
      ]} />
    </div>
  )
}
