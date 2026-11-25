import { useEffect, useState } from 'react'
import { Brand, DOC_TYPES, DocType, Section } from '../../../shared/documents/model'
import { api, send } from '../shared/nw/api'
import { Btn, Card, LoadError, useToast } from '../shared/nw/ui'
import { INPUT, SectionsEditor, TextField } from './common'

const GROUPS: [string, [keyof Brand, string][]][] = [
  ['Company', [['company', 'Company name'], ['regNo', 'Registration number'], ['address', 'Address'], ['email', 'Email'], ['phone', 'Phone'], ['website', 'Website'], ['tagline', 'Tagline']]],
  ['Signatory', [['signatoryName', 'Name'], ['signatoryTitle', 'Title']]],
  ['Banking (EFT)', [['bank', 'Bank'], ['accountHolder', 'Account holder'], ['accountType', 'Account type'], ['accountNumber', 'Account number'], ['branchCode', 'Branch code'], ['proofLine', 'Proof of payment line']]],
]

export function DocumentSettings({ go }: { go: (page: string) => void }) {
  const toast = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [emailReady, setEmailReady] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { api('/api/docs-settings').then(async (r) => { if (!r?.ok) { setError('Could not load the settings.'); return } const d = await r.json(); setBrand(d.brand); setEmailReady(d.emailConfigured) }) }, [])
  if (!brand) return <><LoadError message={error} /><p className="text-sm text-muted">Loading…</p></>
  const set = (key: keyof Brand, value: string | boolean) => setBrand({ ...brand, [key]: value })
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const problem = await send('/api/docs-settings', 'PUT', { brand }); toast(problem || 'Settings saved') }} className="space-y-4">
      {!emailReady && <p className="rounded-xl bg-warn-soft px-4 py-3 text-sm text-fg">Emailing documents is off until RESEND_API_KEY and EMAIL_FROM are added to the server settings.</p>}
      {GROUPS.map(([title, fields]) => (
        <Card key={title} className="p-4"><h2 className="mb-3 font-semibold text-fg">{title}</h2><div className="grid gap-3 md:grid-cols-2">{fields.map(([key, label]) => <TextField key={key} label={label} value={String(brand[key])} onChange={(v) => set(key, v)} />)}</div></Card>
      ))}
      <Card className="space-y-3 p-4">
        <h2 className="font-semibold text-fg">VAT</h2>
        <label className="flex items-center gap-2 text-sm text-fg"><input type="checkbox" checked={brand.vatRegistered} onChange={(e) => set('vatRegistered', e.target.checked)} />The company is VAT registered (enables 15% VAT on quotes and invoices)</label>
        {brand.vatRegistered && <TextField label="VAT number" value={brand.vatNumber} onChange={(v) => set('vatNumber', v)} />}
      </Card>
      <Card className="space-y-2 p-4">
        <h2 className="font-semibold text-fg">Payment reminders</h2>
        <label className="flex items-center gap-2 text-sm text-fg"><input type="checkbox" checked={brand.autoRemind} onChange={(e) => set('autoRemind', e.target.checked)} />Automatically email clients about overdue invoices, once a week</label>
        <p className="text-xs text-muted">Needs email to be set up. A daily summary of everything needing attention is sent to {brand.email}.</p>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4"><div><h2 className="font-semibold text-fg">Package presets</h2><p className="text-sm text-muted">Quote presets come from the price list. Use the category “Recurring” for monthly charges.</p></div><Btn type="button" onClick={() => go('price-list')}>Edit price list</Btn></Card>
      <Btn type="submit" kind="primary">Save settings</Btn>
    </form>
  )
}

export function TemplateManager() {
  const toast = useToast()
  const [all, setAll] = useState<Record<string, { sections: Section[]; customised: boolean }> | null>(null)
  const [type, setType] = useState<DocType>('agreement')
  const [error, setError] = useState('')
  const load = () => api('/api/docs-templates').then(async (r) => { if (r?.ok) setAll(await r.json()); else setError('Could not load the templates.') })
  useEffect(() => { load() }, [])
  if (!all) return <><LoadError message={error} /><p className="text-sm text-muted">Loading…</p></>
  const current = all[type]
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-0 flex-1 text-sm font-semibold text-fg">Template<select value={type} onChange={(e) => setType(e.target.value as DocType)} className={INPUT}>{Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}{all[k].customised ? ' (edited)' : ''}</option>)}</select></label>
        <Btn kind="primary" onClick={async () => { const problem = await send(`/api/docs-templates/${type}`, 'PUT', { sections: current.sections }); toast(problem || 'Template saved. New documents will use it.'); if (!problem) load() }}>Save template</Btn>
        {current.customised && <Btn onClick={async () => { if (!window.confirm('Restore the original wording?')) return; const problem = await send(`/api/docs-templates/${type}`, 'DELETE'); toast(problem || 'Original wording restored'); load() }}>Restore original</Btn>}
      </Card>
      <p className="text-sm text-muted">Changes apply to documents created afterwards. Existing documents keep their own wording. Have legal wording reviewed by an attorney.</p>
      <Card className="p-4"><SectionsEditor key={type} sections={current.sections} onChange={(sections) => setAll({ ...all, [type]: { ...current, sections } })} /></Card>
    </div>
  )
}
