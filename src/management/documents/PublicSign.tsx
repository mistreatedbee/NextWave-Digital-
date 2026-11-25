import { useCallback, useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { FORM_QUESTIONS } from '../../../shared/documents/templates'
import { api } from '../shared/nw/api'
import { Btn, Card, Tabs } from '../shared/nw/ui'
import { downloadPdf, TextField } from './common'
import { Preview } from './Preview'

type View = { type: string; reference: string; label: string; version: number; signed: boolean; canSign: boolean; name: string; html: string }

function SignaturePad({ onChange }: { onChange: (png: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const point = (e: React.PointerEvent) => { const c = ref.current!; const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height] as const }
  const context = () => { const c = ref.current!.getContext('2d')!; c.lineWidth = 2.5; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#0A0A0A'; return c }
  const stop = () => { if (!drawing.current) return; drawing.current = false; onChange(ref.current!.toDataURL('image/png')) }
  return (
    <div>
      <canvas ref={ref} width={600} height={180} aria-label="Draw your signature here" className="w-full touch-none rounded-lg border border-line bg-white"
        onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); const c = context(); c.beginPath(); c.moveTo(...point(e)) }}
        onPointerMove={(e) => { if (!drawing.current) return; const c = context(); c.lineTo(...point(e)); c.stroke() }}
        onPointerUp={stop} onPointerCancel={stop} />
      <button type="button" onClick={() => { context().clearRect(0, 0, 600, 180); onChange('') }} className="mt-1 text-xs font-semibold text-accent">Clear</button>
    </div>
  )
}

/** The page a client opens from their secure link. No account is needed. */
export default function PublicSign() {
  const [token] = useState(() => window.location.hash.slice(1))
  const [view, setView] = useState<View | null>(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', idNumber: '', place: '', typed: '', drawn: '' })
  const [mode, setMode] = useState<'Type' | 'Draw'>('Type')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [consents, setConsents] = useState({ consent: false, popiaConsent: false, childConsent: false })
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const response = await api('/api/sign/view', 'POST', { token })
    const data = await response?.json().catch(() => null)
    if (!response?.ok) { setMessage(data?.error ?? 'Could not open the document. Check your connection and try again.'); return }
    setView(data); setForm((f) => ({ ...f, name: f.name || data.name }))
  }, [token])
  useEffect(() => { load() }, [load])

  if (!view) return <div className="grid min-h-full place-items-center p-6"><p role="status" className="max-w-md text-center text-fg">{message || 'Opening your document…'}</p></div>
  const isForm = view.type === 'info_form'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true); setMessage('')
    const full = isForm ? answers.full_name ?? '' : form.name
    const body = { token, version: view.version, ...form, name: full, idNumber: isForm ? answers.id_number : form.idNumber, typed: mode === 'Type' ? form.typed : '', drawn: mode === 'Draw' ? form.drawn : '', answers: isForm ? answers : undefined, ...consents }
    const response = await api('/api/sign/submit', 'POST', body)
    const data = await response?.json().catch(() => null)
    setBusy(false)
    if (!response?.ok) { setMessage(data?.error ?? 'Could not sign. Check your connection and try again.'); return }
    await load()
  }
  const check = (key: keyof typeof consents, label: string, required: boolean) => <label className="flex gap-2 text-sm text-fg"><input type="checkbox" required={required} checked={consents[key]} onChange={(e) => setConsents({ ...consents, [key]: e.target.checked })} className="mt-0.5 h-4 w-4" />{label}</label>

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-white">
        <div><p className="font-display font-extrabold">NextWave <span className="text-lime">Digital Solutions</span></p><p className="text-sm text-white/70">{view.label} {view.reference}</p></div>
        <Btn onClick={async () => setMessage(await downloadPdf('/api/sign/pdf', { token }))}><Download className="h-4 w-4" />Download PDF</Btn>
      </header>
      {view.signed && <p role="status" className="rounded-xl bg-ok-soft px-4 py-3 text-sm font-semibold text-ok">Signed. Download your copy and keep it for your records.</p>}
      <div className="h-[75vh]"><Preview html={view.html} title={`${view.label} ${view.reference}`} /></div>
      {view.canSign && (
        <Card className="p-4">
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-semibold text-fg">{isForm ? 'Complete and sign the form' : view.type === 'quote' ? 'Accept this quotation' : 'Sign this document'}</h2>
            {isForm ? FORM_QUESTIONS.map(([key, label, required]) => <TextField key={key} label={`${label}${required ? '' : ' (optional)'}`} required={required} value={answers[key] ?? ''} onChange={(v) => setAnswers({ ...answers, [key]: v })} />)
              : <><TextField label="Full name" required value={form.name} onChange={(name) => setForm({ ...form, name })} /><TextField label="ID or registration number" value={form.idNumber} onChange={(idNumber) => setForm({ ...form, idNumber })} /></>}
            <TextField label="Place of signing" required value={form.place} onChange={(place) => setForm({ ...form, place })} />
            <div><p className="mb-2 text-sm font-semibold text-fg">Signature</p><Tabs value={mode} options={['Type', 'Draw']} onChange={setMode} /></div>
            {mode === 'Type' ? <TextField label="Type your signature" required value={form.typed} onChange={(typed) => setForm({ ...form, typed })} /> : <SignaturePad onChange={(drawn) => setForm((f) => ({ ...f, drawn }))} />}
            {isForm && check('childConsent', 'If I work with learners under 18, I agree to provide a police clearance certificate and consent to a National Register for Sex Offenders check.', false)}
            {isForm && check('popiaConsent', 'I confirm the information is true and consent to NextWave processing it for the partnership agreement, payments and system access (POPIA).', true)}
            {check('consent', 'I have read this document and agree to sign it electronically. My name, the date and time, and my IP address will be recorded.', true)}
            {message && <p role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-fg">{message}</p>}
            <Btn type="submit" kind="primary" disabled={busy}>{busy ? 'Signing…' : 'Sign and submit'}</Btn>
          </form>
        </Card>
      )}
      {!view.canSign && message && <p role="alert" className="text-sm text-bad">{message}</p>}
    </div>
  )
}
