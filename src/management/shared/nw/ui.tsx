import React, { createContext, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpDown, Download, FileText, Inbox, MessageSquare, Paperclip, Search, X, History, Upload, CheckCircle2 } from 'lucide-react'
import { exportCsv } from './lib'
import { activity } from './data'

const EASE = [0.23, 1, 0.32, 1] as const

/* ---------- Toasts ---------- */
let emit: (msg: string) => void = () => {}
const ToastCtx = createContext<(msg: string) => void>((m) => emit(m))
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([])
  const push = (msg: string) => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, msg }])
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2800)
  }
  emit = push
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2, ease: EASE }} className="pointer-events-auto flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-lime" /> {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Primitives ---------- */
export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-xl border border-line bg-card ${className}`}>{children}</section>
}

export function Btn({ kind = 'ghost', className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'ghost' | 'dark' | 'danger' }) {
  const k = {
    primary: 'bg-lime text-ink hover:bg-lime-hover',
    ghost: 'border border-line bg-card text-fg hover:bg-soft',
    dark: 'bg-ink text-white hover:bg-ink-3 dark:bg-soft dark:hover:bg-line',
    danger: 'border border-line bg-card text-bad hover:bg-bad-soft',
  }[kind]
  return <button {...p} className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 ${k} ${className}`} />
}

const tone = (s: string) => {
  const v = s.toLowerCase()
  if (/(won|paid|cleared|done|active|signed|verified|approved|on|complete|given|clear|enabled|sent ✓|resolved)/.test(v)) return 'bg-ok-soft text-ok'
  if (/(lost|overdue|refund|reversed|revoked|failed|missing|expired|breach|declined|off|withdrawn|open incident)/.test(v)) return 'bg-bad-soft text-bad'
  if (/(pending|review|trial|scheduled|quote sent|awaiting|hold|draft|due|partial|needs|in progress|requested)/.test(v)) return 'bg-warn-soft text-warn'
  if (/(new|contacted|not started|invited|planned|info)/.test(v)) return 'bg-info-soft text-info'
  return 'bg-soft text-muted'
}
export function Badge({ children }: { children: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${tone(children)}`}>{children}</span>
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-fg">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-soft ${className}`}>
      <div className="h-full rounded-full bg-lime" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-soft"><Inbox className="h-5 w-5 text-muted" /></div>
      <p className="font-display font-semibold text-fg">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Tabs<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg bg-soft p-1">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${value === o ? 'bg-card text-fg shadow-sm' : 'text-muted hover:text-fg'}`}>{o}</button>
      ))}
    </div>
  )
}

/* ---------- Data table ---------- */
export type Col<R> = { key: keyof R & string; label: string; render?: (r: R) => React.ReactNode; align?: 'right'; hideSm?: boolean }

export function DataTable<R extends Record<string, any>>({ name, rows, cols, filters, onRow, emptyAction, toolbar }: { name: string; rows: R[]; cols: Col<R>[]; filters?: { key: keyof R & string; label: string }[]; onRow?: (r: R) => void; emptyAction?: React.ReactNode; toolbar?: React.ReactNode }) {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null)
  const [f, setF] = useState<Record<string, string>>({})
  const shown = useMemo(() => {
    let r = rows.filter((row) => (q ? JSON.stringify(row).toLowerCase().includes(q.toLowerCase()) : true))
    for (const [k, v] of Object.entries(f)) if (v) r = r.filter((row) => String(row[k]) === v)
    if (sort) r = [...r].sort((a, b) => (a[sort.k] > b[sort.k] ? sort.dir : a[sort.k] < b[sort.k] ? -sort.dir : 0))
    return r
  }, [rows, q, f, sort])
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <label className="flex min-w-0 flex-1 basis-48 items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Filter ${name.toLowerCase()}…`} className="w-full min-w-0 bg-transparent text-sm text-fg outline-none placeholder:text-muted" />
        </label>
        {filters?.map((fl) => (
          <select key={fl.key} value={f[fl.key] ?? ''} onChange={(e) => setF({ ...f, [fl.key]: e.target.value })} className="rounded-lg border border-line bg-card px-2 py-2 text-sm text-fg">
            <option value="">All {fl.label.toLowerCase()}</option>
            {[...new Set(rows.map((r) => String(r[fl.key])))].map((v) => <option key={v}>{v}</option>)}
          </select>
        ))}
        {toolbar}
        <Btn onClick={() => { exportCsv(name, shown); toast(`${name} exported to CSV`) }}><Download className="h-4 w-4" />CSV</Btn>
        <Btn onClick={() => toast(`${name} PDF is being prepared`)}><FileText className="h-4 w-4" />PDF</Btn>
      </div>
      {shown.length === 0 ? (
        <Empty title={rows.length ? 'No matches' : `No ${name.toLowerCase()} yet`} body={rows.length ? 'Try a different search or clear the filters.' : 'Records you add will appear here.'} action={emptyAction} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                {cols.map((c) => (
                  <th key={c.key} className={`whitespace-nowrap px-4 py-2.5 font-semibold ${c.align === 'right' ? 'text-right' : ''} ${c.hideSm ? 'hidden md:table-cell' : ''}`}>
                    <button onClick={() => setSort((s) => ({ k: c.key, dir: s?.k === c.key ? (-s.dir as 1 | -1) : 1 }))} className="inline-flex items-center gap-1 hover:text-fg">
                      {c.label}
                      {sort?.k === c.key ? sort.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={i} onClick={() => onRow?.(r)} className={`border-b border-line last:border-0 ${onRow ? 'cursor-pointer hover:bg-soft' : ''}`}>
                  {cols.map((c) => (
                    <td key={c.key} className={`px-4 py-3 text-fg ${c.align === 'right' ? 'text-right tabular' : ''} ${c.hideSm ? 'hidden md:table-cell' : ''}`}>{c.render ? c.render(r) : String(r[c.key] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t border-line px-4 py-2.5 text-xs text-muted">{shown.length} of {rows.length} records</div>
    </Card>
  )
}

/* ---------- Record drawer: details, comments, files, activity ---------- */
export function Drawer({ open, title, sub, onClose, children }: { open: boolean; title: string; sub?: string; onClose: () => void; children?: React.ReactNode }) {
  const [tab, setTab] = useState<'Details' | 'Comments' | 'Files' | 'Activity'>('Details')
  const [comments, setComments] = useState([{ who: 'Lerato Khumalo', text: 'Client confirmed via WhatsApp, deposit coming Friday.', when: '24 Nov 2026' }])
  const [draft, setDraft] = useState('')
  const toast = useToast()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} className="fixed inset-0 z-[60] bg-ink/40" />
          <motion.aside initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col bg-card shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line p-5">
              <div className="min-w-0"><h2 className="text-lg font-bold text-fg">{title}</h2>{sub && <p className="text-sm text-muted">{sub}</p>}</div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-soft"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-5 pt-4"><Tabs value={tab} options={['Details', 'Comments', 'Files', 'Activity']} onChange={setTab} /></div>
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'Details' && (children ?? <p className="text-sm text-muted">No additional details.</p>)}
              {tab === 'Comments' && (
                <div className="space-y-4">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-3"><Avatar name={c.who} /><div><p className="text-sm"><b className="text-fg">{c.who}</b> <span className="text-muted">· {c.when}</span></p><p className="text-sm text-fg">{c.text}</p></div></div>
                  ))}
                  <div className="flex gap-2">
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment… use @ to mention" className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none" />
                    <Btn kind="primary" onClick={() => { if (!draft) return; setComments([...comments, { who: 'You', text: draft, when: '25 Nov 2026' }]); setDraft(''); toast('Comment added') }}><MessageSquare className="h-4 w-4" />Post</Btn>
                  </div>
                </div>
              )}
              {tab === 'Files' && (
                <div className="space-y-2">
                  {['Signed-quote.pdf · 212 KB', 'Proof-of-payment.png · 88 KB'].map((f) => <div key={f} className="flex items-center gap-2 rounded-lg bg-soft px-3 py-2.5 text-sm text-fg"><Paperclip className="h-4 w-4 text-muted" />{f}</div>)}
                  <button onClick={() => toast('File attached')} className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-line py-6 text-sm text-muted hover:bg-soft"><Upload className="h-5 w-5" />Drop files or click to attach</button>
                </div>
              )}
              {tab === 'Activity' && <Timeline />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function Timeline({ items = activity }: { items?: { who: string; what: string; when: string }[] }) {
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {items.map((a, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-lime" />
          <p className="text-sm text-fg"><b>{a.who}</b> {a.what}</p>
          <p className="flex items-center gap-1 text-xs text-muted"><History className="h-3 w-3" />{a.when}</p>
        </li>
      ))}
    </ol>
  )
}

export function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return <span className={`grid shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-lime dark:bg-soft`} style={{ width: size * 4, height: size * 4 }}>{initials}</span>
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0"><span className="text-muted">{label}</span><span className="text-right font-semibold text-fg">{value}</span></div>
}
