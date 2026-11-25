import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Download, Link2, Mail, Plus, Save, Trash2 } from 'lucide-react'
import { CONVERSIONS } from '../../../shared/documents/create'
import { Brand, displayStatus, DOC_TYPES, DocData, DocType, longDate, money, Party, STATUSES, todaySA, totals } from '../../../shared/documents/model'
import { renderDocument } from '../../../shared/documents/render'
import { api, Row, send, toRecord, useTable } from '../shared/nw/api'
import { Badge, Btn, Card, Drawer, LoadError, Tabs, useToast } from '../shared/nw/ui'
import { downloadPdf, INPUT, MoneyField, SectionsEditor, TextField } from './common'
import { Preview } from './Preview'

type Loaded = { id: string; type: DocType; reference: string; status: string; data: DocData; version: number; signedAt: string | null; linkActiveUntil: string | null; events: Row[]; linked: Row[] }
type Tab = 'Details' | 'Items' | 'Wording' | 'Activity'
const PARTY: [keyof Party, string][] = [['name', 'Contact person / full name'], ['company', 'Company'], ['idNumber', 'ID / registration number'], ['address', 'Address'], ['email', 'Email'], ['phone', 'Phone'], ['vatNumber', 'VAT number (optional)']]
const EXTRA: Partial<Record<DocType, [string, string, string?][]>> = {
  quote: [['timeline', 'Timeline', 'area']],
  agreement: [['scope', 'Scope of work', 'area'], ['deliverables', 'Deliverables (start a line with "- "; add headings such as **Version 1** to split into phases)', 'area'], ['timeline', 'Timeline'], ['start_date', 'Start date', 'date'], ['total_fee_cents', 'Total fee', 'money'], ['deposit_cents', 'Deposit', 'money'], ['payment_schedule', 'Payment schedule and milestones', 'area']],
  nda: [['mode', 'Agreement type', 'mode'], ['term_years', 'Term after the relationship ends (years)'], ['purpose', 'Purpose']],
  debt: [['invoice_reference', 'Invoice number'], ['invoice_date', 'Invoice date', 'date'], ['amount_owed_cents', 'Amount owed', 'money'], ['standard_value_cents', 'Standard value', 'money'], ['unpaid_period', 'Unpaid period'], ['pay_by_time', 'Pay-by time'], ['sign_by', 'Signing deadline', 'date'], ['background', 'Background (work done)', 'area']],
}

export default function Editor({ id, go }: { id: string; go: (page: string) => void }) {
  const toast = useToast()
  const [doc, setDoc] = useState<Loaded | null>(null)
  const [dirty, setDirty] = useState(false)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [emailReady, setEmailReady] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('Details')
  const [busy, setBusy] = useState(false)
  const [link, setLink] = useState('')
  const [email, setEmail] = useState<{ to: string; message: string } | null>(null)
  const [payment, setPayment] = useState({ date: todaySA(), amountCents: 0, method: 'EFT', bankCharges: 0 })
  const clients = useTable('clients', toRecord)
  const prices = useTable('prices', toRecord)
  const jobs = useTable('jobs', toRecord)

  const load = useCallback(async () => {
    const [d, s] = await Promise.all([api(`/api/docs/${id}`), api('/api/docs-settings')])
    if (!d?.ok || !s?.ok) { setError('Could not load this document.'); return }
    const settings = await s.json()
    setBrand(settings.brand); setEmailReady(settings.emailConfigured); setDoc(await d.json()); setDirty(false); setError('')
  }, [id])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const html = useMemo(() => (doc && brand ? renderDocument(doc, doc.data.brandSnapshot ?? brand, { preview: true }) : ''), [doc, brand])
  if (!doc || !brand) return <><LoadError message={error} /><p className="text-sm text-muted">Loading document…</p></>

  const meta = DOC_TYPES[doc.type]
  const locked = !!doc.signedAt
  const t = totals(doc.data)
  const data = doc.data
  const edit = (change: Partial<DocData>) => { setDoc({ ...doc, data: { ...data, ...change } }); setDirty(true) }
  const field = (key: string, value: string) => edit({ fields: { ...data.fields, [key]: value } })

  /** Saves pending edits. Returns false if they could not be saved. */
  const save = async () => {
    if (!dirty) return true
    const response = await api(`/api/docs/${id}`, 'PUT', { version: doc.version, reference: doc.reference, status: doc.status, data: doc.data })
    const result = await response?.json().catch(() => null)
    if (!response?.ok) { toast(result?.error ?? 'Could not save'); return false }
    if (result.linkCancelled) toast('Saved. The earlier signing link was cancelled.')
    else toast('Saved')
    await load()
    return true
  }
  const run = async (action: () => Promise<unknown>) => { setBusy(true); try { if (await save()) await action() } finally { setBusy(false) } }
  const post = async (path: string, body: unknown, method = 'POST') => {
    const response = await api(`/api/docs/${id}${path}`, method, body)
    const result = response?.status === 204 ? {} : await response?.json().catch(() => null)
    if (!response?.ok) { toast(result?.error ?? 'Something went wrong'); return null }
    return result
  }
  const consent = () => !meta.signable || ['info_form', 'quote'].includes(doc.type) || locked || data.companySignedOn || window.confirm(`Sending this ${meta.label.toLowerCase()} adds your electronic signature (${brand.signatoryName}, ${brand.signatoryTitle}) dated today. Continue?`)

  const makeLink = () => { if (consent()) run(async () => { const r = await post('/link', {}); if (r) { setLink(new URL(r.path, window.location.origin).href); await load() } }) }
  const sendEmail = () => { if (email && consent()) run(async () => { if (await post('/email', email)) { toast('Email sent'); setEmail(null); await load() } }) }
  const convert = (to: DocType) => run(async () => { const r = await post('/convert', { to }); if (r) go(`doc-center:${r.id}`) })
  const duplicate = () => run(async () => { const r = await post('/duplicate', {}); if (r) go(`doc-center:${r.id}`) })
  const remove = async () => { if (!window.confirm(`Delete draft ${doc.reference}? Its number will not be reused.`)) return; const problem = await send(`/api/docs/${id}`, 'DELETE'); if (problem) toast(problem); else go('doc-center') }
  const record = () => run(async () => { if (await post('/payments', payment)) { toast('Payment recorded'); setPayment({ ...payment, amountCents: 0, bankCharges: 0 }); await load() } })

  const pickClient = (clientId: string) => {
    const c = clients.rows.find((x) => x.id === clientId)
    if (c) edit({ client: { name: c.name ?? '', company: c.company ?? '', idNumber: c.id_number ?? '', address: c.address ?? '', email: c.email ?? '', phone: c.phone ?? '', vatNumber: c.vat_number ?? '' } })
  }
  const addPreset = (p: Row) => {
    if (p.category === 'Recurring') edit({ recurring: [...data.recurring, { description: p.name, terms: p.notes || `${money(p.price * 100)} per month` }] })
    else edit({ items: [...data.items, { description: p.name, qty: 1, unitCents: p.price * 100 }] })
  }
  const setItem = (i: number, change: Record<string, unknown>) => edit({ items: data.items.map((x, n) => (n === i ? { ...x, ...change } : x)) })
  const hasItems = ['quote', 'invoice', 'debt', 'agreement'].includes(doc.type)
  const tabs: Tab[] = hasItems ? ['Details', 'Items', 'Wording', 'Activity'] : ['Details', 'Wording', 'Activity']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => { if (!dirty || window.confirm('Leave without saving your changes?')) go('doc-center') }}><ArrowLeft className="h-4 w-4" />All documents</Btn>
        <b className="text-fg">{doc.reference}</b><Badge>{displayStatus(doc)}</Badge>{locked && <span className="text-xs text-muted">Signed and locked</span>}
        <div className="ml-auto flex flex-wrap gap-2">
          {!locked && <Btn kind="primary" disabled={!dirty || busy} onClick={() => run(async () => {})}><Save className="h-4 w-4" />{dirty ? 'Save' : 'Saved'}</Btn>}
          <Btn disabled={busy} onClick={() => run(async () => { const problem = await downloadPdf(`/api/docs/${id}/pdf`); if (problem) toast(problem) })}><Download className="h-4 w-4" />PDF</Btn>
          <Btn disabled={busy} onClick={makeLink}><Link2 className="h-4 w-4" />{meta.signable && !locked ? 'Signing link' : 'Client link'}</Btn>
          <Btn disabled={busy} onClick={() => setEmail({ to: data.client.email, message: '' })}><Mail className="h-4 w-4" />Email</Btn>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={busy} onClick={duplicate}>Duplicate</Btn>
        {CONVERSIONS[doc.type]?.map((to) => <Btn key={to} disabled={busy} onClick={() => convert(to)}>{doc.type === 'quote' && to === 'invoice' ? 'Convert to Invoice' : `Create ${DOC_TYPES[to].label}`}</Btn>)}
        {doc.linkActiveUntil && <Btn onClick={async () => { if (await post('/link', undefined, 'DELETE')) { setLink(''); toast('Client link cancelled'); load() } }}>Cancel client link</Btn>}
        {!locked && doc.status === 'Draft' && <Btn kind="danger" onClick={remove}><Trash2 className="h-4 w-4" />Delete draft</Btn>}
      </div>
      {link && (
        <Card className="flex flex-wrap items-center gap-2 p-3">
          <input readOnly value={link} aria-label="Client link" onFocus={(e) => e.target.select()} className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none" />
          <Btn onClick={() => navigator.clipboard.writeText(link).then(() => toast('Link copied'), () => toast('Select the link and copy it'))}>Copy</Btn>
          <p className="w-full text-xs text-muted">Valid for 30 days and shown only once. Anyone with this link can open the document.</p>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Tabs value={tab} options={tabs} onChange={setTab} />
          {tab === 'Details' && (
            <Card className="space-y-3 p-4">
              <TextField label="Reference number (change only to import an old number)" value={doc.reference} disabled={locked} onChange={(reference) => { setDoc({ ...doc, reference }); setDirty(true) }} />
              {!locked && <label className="block text-sm font-semibold text-fg">Status<select value={doc.status} onChange={(e) => { setDoc({ ...doc, status: e.target.value }); setDirty(true) }} className={INPUT}>{STATUSES[doc.type].map((s) => <option key={s}>{s}</option>)}</select></label>}
              {!locked && <label className="block text-sm font-semibold text-fg">Fill from client<select value="" onChange={(e) => pickClient(e.target.value)} className={INPUT}><option value="">Choose a client…</option>{clients.rows.map((c) => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}</select></label>}
              {PARTY.map(([key, label]) => <TextField key={key} label={label} value={data.client[key]} disabled={locked} onChange={(v) => edit({ client: { ...data.client, [key]: v } })} />)}
              {hasItems && <label className="block text-sm font-semibold text-fg">Linked job<select disabled={locked} value={data.fields.job_id ?? ''} className={INPUT} onChange={(e) => {
                const job = jobs.rows.find((j) => j.id === e.target.value)
                edit({ fields: { ...data.fields, job_id: e.target.value }, projectName: data.projectName || job?.title || '' })
              }}><option value="">None</option>{jobs.rows.map((j) => <option key={j.id} value={j.id}>{j.title} · {j.client}</option>)}</select></label>}
              <TextField label="Project name" value={data.projectName} disabled={locked} onChange={(projectName) => edit({ projectName })} />
              {(doc.type === 'quote' || doc.type === 'invoice') && <TextField label="Project summary" rows={3} value={data.summary} disabled={locked} onChange={(summary) => edit({ summary })} />}
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Date" type="date" value={data.issueDate} disabled={locked} onChange={(issueDate) => edit({ issueDate })} />
                {['quote', 'invoice', 'debt'].includes(doc.type) && <TextField label={doc.type === 'quote' ? 'Valid until' : doc.type === 'debt' ? 'Pay-by date' : 'Due date'} type="date" value={data.dueDate} disabled={locked} onChange={(dueDate) => edit({ dueDate })} />}
              </div>
              {EXTRA[doc.type]?.map(([key, label, kind]) =>
                kind === 'money' ? <MoneyField key={key} label={label} disabled={locked} cents={Number(data.fields[key]) || 0} onChange={(c) => field(key, c ? String(c) : '')} />
                  : kind === 'mode' ? <label key={key} className="block text-sm font-semibold text-fg">{label}<select disabled={locked} value={data.fields[key]} onChange={(e) => field(key, e.target.value)} className={INPUT}><option value="mutual">Mutual</option><option value="one-way">One-way (NextWave discloses)</option></select></label>
                    : <TextField key={key} label={label} type={kind === 'date' ? 'date' : 'text'} rows={kind === 'area' ? 4 : undefined} disabled={locked} value={data.fields[key] ?? ''} onChange={(v) => field(key, v)} />)}
              {!meta.cover && <label className="flex items-center gap-2 text-sm text-fg"><input type="checkbox" disabled={locked} checked={data.cover} onChange={(e) => edit({ cover: e.target.checked })} />Add a cover page</label>}
              {meta.signable && !['quote', 'info_form'].includes(doc.type) && <label className="flex items-center gap-2 text-sm text-fg"><input type="checkbox" disabled={locked} checked={data.witnesses} onChange={(e) => edit({ witnesses: e.target.checked })} />Include optional witness boxes</label>}
              {(doc.type === 'quote' || doc.type === 'invoice') && <label className="flex items-center gap-2 text-sm text-fg"><input type="checkbox" disabled={locked || !brand.vatRegistered} checked={data.vatOn} onChange={(e) => edit({ vatOn: e.target.checked })} />Charge 15% VAT {!brand.vatRegistered && <span className="text-muted">(turn on VAT registration in Document settings)</span>}</label>}
            </Card>
          )}
          {tab === 'Items' && (
            <Card className="space-y-4 p-4">
              {!locked && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-fg">Add from the price list</p>
                  <div className="flex flex-wrap gap-2">{prices.rows.filter((p) => p.status === 'Active').map((p) => <button key={p.id} type="button" onClick={() => addPreset(p)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-fg hover:bg-soft">{p.name} · {money(p.price * 100)}</button>)}</div>
                  {!prices.rows.length && <p className="text-xs text-muted">The price list is empty.</p>}
                </div>
              )}
              {data.items.map((item, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-line p-3">
                  <TextField label="Description" value={item.description} disabled={locked} onChange={(description) => setItem(i, { description })} />
                  <div className="grid grid-cols-3 gap-2">
                    <TextField label="Qty" type="number" value={String(item.qty)} disabled={locked} onChange={(v) => setItem(i, { qty: Math.max(0, Number(v) || 0) })} />
                    <MoneyField label="Unit price" cents={item.unitCents} disabled={locked} onChange={(unitCents) => setItem(i, { unitCents })} />
                    {doc.type !== 'quote' && <MoneyField label="Standard value" cents={item.standardCents ?? 0} disabled={locked} onChange={(c) => setItem(i, { standardCents: c || undefined })} />}
                  </div>
                  {!locked && <button type="button" onClick={() => edit({ items: data.items.filter((_, n) => n !== i) })} className="text-xs font-semibold text-bad">Remove line</button>}
                </div>
              ))}
              {!locked && <Btn onClick={() => edit({ items: [...data.items, { description: '', qty: 1, unitCents: 0 }] })}><Plus className="h-4 w-4" />Add line</Btn>}
              <MoneyField label="Discount" cents={data.discountCents} disabled={locked} onChange={(discountCents) => edit({ discountCents })} />
              <p className="text-sm text-fg">Subtotal {money(t.subtotal)} · Total <b>{money(t.total)}</b></p>
              {doc.type === 'quote' && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-fg">Recurring costs</p>
                  {data.recurring.map((r, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] items-end gap-2">
                      <TextField label="Service" value={r.description} disabled={locked} onChange={(description) => edit({ recurring: data.recurring.map((x, n) => (n === i ? { ...x, description } : x)) })} />
                      <TextField label="Terms" value={r.terms} disabled={locked} onChange={(terms) => edit({ recurring: data.recurring.map((x, n) => (n === i ? { ...x, terms } : x)) })} />
                      {!locked && <button type="button" aria-label="Remove recurring cost" onClick={() => edit({ recurring: data.recurring.filter((_, n) => n !== i) })} className="rounded p-2 text-muted hover:bg-soft"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  ))}
                  {!locked && <Btn onClick={() => edit({ recurring: [...data.recurring, { description: '', terms: '' }] })}><Plus className="h-4 w-4" />Add recurring cost</Btn>}
                </div>
              )}
              {doc.type === 'invoice' && (
                <div className="space-y-3 border-t border-line pt-4">
                  <p className="text-sm font-semibold text-fg">Payments · balance {money(t.balance)}</p>
                  {data.payments.map((p, i) => <div key={i} className="flex items-center justify-between text-sm text-fg"><span>{longDate(p.date)} · {p.method} · {money(p.amountCents)}</span><button type="button" onClick={async () => { if (window.confirm('Remove this payment?') && await post(`/payments/${i}`, undefined, 'DELETE')) load() }} className="text-xs font-semibold text-bad">Remove</button></div>)}
                  {t.balance > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      <TextField label="Date paid" type="date" value={payment.date} onChange={(date) => setPayment({ ...payment, date })} />
                      <MoneyField label="Amount" cents={payment.amountCents} onChange={(amountCents) => setPayment({ ...payment, amountCents })} />
                      <label className="text-sm font-semibold text-fg">Method<select value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })} className={INPUT}>{['EFT', 'Card', 'Cash', 'SnapScan', 'Other'].map((m) => <option key={m}>{m}</option>)}</select></label>
                      <MoneyField label="Bank charges" cents={payment.bankCharges} onChange={(bankCharges) => setPayment({ ...payment, bankCharges })} />
                      <Btn kind="primary" className="col-span-3" disabled={busy || !payment.amountCents} onClick={record}>Record payment</Btn>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
          {tab === 'Wording' && <Card className="p-4"><SectionsEditor sections={data.sections} disabled={locked} onChange={(sections) => edit({ sections })} /></Card>}
          {tab === 'Activity' && (
            <Card className="space-y-4 p-4">
              {doc.linked.length > 0 && <div><p className="mb-1 text-sm font-semibold text-fg">Linked documents</p>{doc.linked.map((l) => <button key={l.id} onClick={() => go(`doc-center:${l.id}`)} className="block text-sm font-semibold text-accent">{l.id === (doc as Row).parentId ? 'From' : 'Created'}: {DOC_TYPES[l.type as DocType].label} {l.reference}</button>)}</div>}
              <ul className="space-y-2">{doc.events.map((e, i) => <li key={i} className="text-sm text-fg"><b>{e.action}</b>{e.detail ? ` · ${e.detail}` : ''}<span className="block text-xs text-muted">{new Date(e.created_at).toLocaleString('en-ZA')}</span></li>)}</ul>
            </Card>
          )}
        </div>
        <div className="xl:sticky xl:top-0 xl:h-[calc(100vh-7rem)]"><Preview html={html} title={`Preview of ${doc.reference}`} /></div>
      </div>

      <Drawer open={!!email} title="Email to client" sub={doc.reference} onClose={() => setEmail(null)}>
        {email && (
          <form onSubmit={(e) => { e.preventDefault(); sendEmail() }} className="space-y-3">
            {!emailReady && <p className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-fg">Email isn’t set up yet. Add RESEND_API_KEY and EMAIL_FROM to the server settings.</p>}
            <TextField label="To" type="email" required value={email.to} onChange={(to) => setEmail({ ...email, to })} />
            <TextField label="Message (optional)" rows={5} value={email.message} onChange={(message) => setEmail({ ...email, message })} />
            <p className="text-xs text-muted">The PDF is attached with a button to {meta.signable ? 'review and sign' : 'view it online'}.</p>
            <Btn type="submit" kind="primary" disabled={!emailReady || busy}>{busy ? 'Sending…' : 'Send email'}</Btn>
          </form>
        )}
      </Drawer>
    </div>
  )
}
