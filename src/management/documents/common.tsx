import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { Section } from '../../../shared/documents/model'
import { api } from '../shared/nw/api'
import { Btn } from '../shared/nw/ui'

export const INPUT = 'mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal text-fg outline-none focus:border-fg/40'

export function TextField({ label, value, onChange, type = 'text', rows, disabled, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number; disabled?: boolean; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-fg">{label}
      {rows ? <textarea rows={rows} value={value} disabled={disabled} required={required} onChange={(e) => onChange(e.target.value)} className={INPUT} />
        : <input type={type} value={value} disabled={disabled} required={required} onChange={(e) => onChange(e.target.value)} className={INPUT} />}
    </label>
  )
}

/** Edits an amount in rand while storing whole cents. */
export function MoneyField({ label, cents, onChange, disabled }: { label: string; cents: number; onChange: (c: number) => void; disabled?: boolean }) {
  const shown = (c: number) => (c ? (c / 100).toFixed(2) : '')
  const [draft, setDraft] = useState<{ text: string; cents: number }>({ text: shown(cents), cents })
  const text = draft.cents === cents ? draft.text : shown(cents)
  return (
    <label className="block text-sm font-semibold text-fg">{label}
      <input inputMode="decimal" value={text} disabled={disabled} placeholder="0.00" className={INPUT} onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '')
        const next = Math.round((Number(raw) || 0) * 100)
        setDraft({ text: raw, cents: next }); onChange(next)
      }} />
    </label>
  )
}

export async function downloadPdf(path: string, body?: unknown) {
  const response = await api(path, body === undefined ? 'GET' : 'POST', body)
  if (!response?.ok) return (await response?.json().catch(() => null))?.error ?? 'Could not create the PDF'
  const name = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') ?? '')?.[1] ?? 'NextWave_Document.pdf'
  const url = URL.createObjectURL(await response.blob())
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
  return ''
}

const TOOLS: [string, (selected: string) => string][] = [
  ['Bold', (s) => `**${s || 'bold text'}**`],
  ['Italic', (s) => `*${s || 'italic text'}*`],
  ['Bullets', (s) => `\n\n${(s || 'List item').split('\n').map((l) => `- ${l}`).join('\n')}\n\n`],
  ['Warning box', (s) => `\n\n!! ${s || 'Important warning'}\n\n`],
  ['Info box', (s) => `\n\n++ ${s || 'Important information'}\n\n`],
]

function ClauseEditor({ section, disabled, onChange }: { section: Section; disabled?: boolean; onChange: (s: Section) => void }) {
  const [area, setArea] = useState<HTMLTextAreaElement | null>(null)
  const apply = (format: (s: string) => string) => {
    if (!area) return
    const { selectionStart: a, selectionEnd: b, value } = area
    onChange({ ...section, body: value.slice(0, a) + format(value.slice(a, b)) + value.slice(b) })
    area.focus()
  }
  return (
    <div className="space-y-2 pt-3">
      <TextField label="Heading" value={section.title} disabled={disabled} onChange={(title) => onChange({ ...section, title })} />
      {!disabled && <div className="flex flex-wrap gap-1">{TOOLS.map(([label, format]) => <button key={label} type="button" onClick={() => apply(format)} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-fg hover:bg-soft">{label}</button>)}</div>}
      <textarea ref={setArea} aria-label={`Wording of ${section.title}`} rows={10} value={section.body} disabled={disabled} onChange={(e) => onChange({ ...section, body: e.target.value })} className={INPUT} />
    </div>
  )
}

export function SectionsEditor({ sections, onChange, disabled }: { sections: Section[]; onChange: (s: Section[]) => void; disabled?: boolean }) {
  const [open, setOpen] = useState('')
  const move = (i: number, by: number) => { const next = [...sections]; const [item] = next.splice(i, 1); next.splice(i + by, 0, item); onChange(next) }
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">Leave a blank line between paragraphs. Text in {'{{double braces}}'} is filled in from the document; [[square brackets]] insert tables, banking details and signature boxes.</p>
      {sections.map((s, i) => (
        <div key={s.id} className="rounded-lg border border-line p-3">
          <div className="flex items-center gap-1">
            <button type="button" aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? '' : s.id)} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-fg">{s.title || 'Untitled section'}</button>
            {!disabled && <>
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-muted hover:bg-soft disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Move down" disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-muted hover:bg-soft disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Remove section" onClick={() => { if (window.confirm(`Remove "${s.title}"?`)) onChange(sections.filter((x) => x.id !== s.id)) }} className="rounded p-1 text-muted hover:bg-soft"><Trash2 className="h-4 w-4" /></button>
            </>}
          </div>
          {open === s.id && <ClauseEditor section={s} disabled={disabled} onChange={(next) => onChange(sections.map((x) => (x.id === s.id ? next : x)))} />}
        </div>
      ))}
      {!disabled && <Btn type="button" onClick={() => { const id = `custom-${Date.now()}`; onChange([...sections, { id, title: 'New section', body: '' }]); setOpen(id) }}><Plus className="h-4 w-4" />Add section</Btn>}
    </div>
  )
}
