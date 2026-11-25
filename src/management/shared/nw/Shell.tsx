import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, Menu, Moon, Plus, Search, Sun, X, LogOut } from 'lucide-react'
import { Role } from './lib'
import { ToastProvider, useToast } from './ui'
import { NAV } from './nav'

const EASE = [0.23, 1, 0.32, 1] as const

type Props = {
  role: Role
  page: string
  dark?: boolean
  onRole?: (r: Role) => void
  onNavigate?: (page: string) => void
  onToggleDark?: () => void
  children: React.ReactNode
}

export function Shell(p: Props) {
  return (
    <div className={p.dark ? 'dark' : ''}>
      <ToastProvider>
        <Inner {...p} />
      </ToastProvider>
    </div>
  )
}

function Inner({ role, page, dark, onRole, onNavigate, onToggleDark, children }: Props) {
  const [mobile, setMobile] = useState(false)
  const go = (id: string) => { onNavigate?.(id); setMobile(false) }
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg font-sans text-fg">
      <aside className="hidden w-64 shrink-0 lg:block"><Sidebar role={role} page={page} go={go} /></aside>
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setMobile(false)} />
            <motion.aside initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22, ease: EASE }} className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"><Sidebar role={role} page={page} go={go} onClose={() => setMobile(false)} /></motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar role={role} dark={dark} onRole={onRole} onToggleDark={onToggleDark} openMenu={() => setMobile(true)} go={go} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <a href="https://www.nextwavedigitalsolutions.co.za" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 leading-tight">
      <img src="/nextwave-logo.jpeg" alt="NextWave Digital Solutions" className="h-11 w-11 shrink-0 rounded-full object-cover" />
      <div>
        <span className="text-lg font-extrabold text-white">NextWave</span>{' '}
        <span className="text-lg font-extrabold text-lime">Digital Solutions</span>
        <p className="text-[11px] font-medium tracking-wide text-white/50">Management System</p>
      </div>
    </a>
  )
}

function Sidebar({ role, page, go, onClose }: { role: Role; page: string; go: (id: string) => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex items-start justify-between gap-2 px-5 pb-4 pt-5">
        <Logo />
        {onClose && <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-1 text-white/60 hover:bg-white/10"><X className="h-5 w-5" /></button>}
      </div>
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((g) => {
          const items = g.items.filter((i) => !i.roles || i.roles.includes(role))
          if (!items.length) return null
          return (
            <div key={g.group} className="mt-4">
              <p className="px-3 pb-1 text-[11px] font-semibold text-white/40">{g.group}</p>
              {items.map((i) => {
                const active = i.id === page
                return (
                  <button key={i.id} onClick={() => go(i.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? 'bg-lime font-semibold text-ink' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}>
                    <i.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{i.label}</span>
                    {i.badge && <span className={`ml-auto rounded-full px-1.5 text-[11px] font-bold ${active ? 'bg-ink text-lime' : 'bg-white/10 text-white'}`}>{i.badge}</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>
      <button onClick={() => go('login')} className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-sm text-white/60 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button>
    </div>
  )
}

const NEW_ITEMS = ['Lead', 'Client', 'Quote', 'Invoice', 'Job', 'Task', 'Payment', 'Expense']
const ROLES: { id: Role; label: string; who: string }[] = [
  { id: 'admin', label: 'Admin', who: 'Kabelo Sithole · Owner' },
  { id: 'partner', label: 'Partner', who: 'Thandi Mokoena' },
  { id: 'finance', label: 'Finance', who: 'Marelize du Toit' },
]

function TopBar({ role, dark, onRole, onToggleDark, openMenu, go }: { role: Role; dark?: boolean; onRole?: (r: Role) => void; onToggleDark?: () => void; openMenu: () => void; go: (id: string) => void }) {
  const [menu, setMenu] = useState<null | 'new' | 'bell' | 'role'>(null)
  const toast = useToast()
  const me = ROLES.find((r) => r.id === role)!
  const toggle = (m: 'new' | 'bell' | 'role') => setMenu((c) => (c === m ? null : m))
  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-card px-3 sm:gap-3 sm:px-6">
      <button onClick={openMenu} aria-label="Open menu" className="rounded-lg p-2 text-fg hover:bg-soft lg:hidden"><Menu className="h-5 w-5" /></button>
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 md:max-w-md">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input placeholder="Search leads, clients, jobs, invoices…" className="w-full min-w-0 bg-transparent text-sm text-fg outline-none placeholder:!text-black" />
        <kbd className="hidden rounded border border-line px-1.5 text-[11px] text-muted sm:block">⌘K</kbd>
      </label>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {role !== 'finance' && (
          <div className="relative">
            <button onClick={() => toggle('new')} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-lime px-3 py-2 text-sm font-semibold text-ink hover:bg-lime-hover"><Plus className="h-4 w-4" /><span className="hidden sm:inline">New</span></button>
            <Pop open={menu === 'new'} className="w-48">
              {NEW_ITEMS.map((n) => <button key={n} onClick={() => { setMenu(null); const routes: Record<string,string> = { Lead:'leads', Client:'clients', Quote:'quotes', Invoice:'invoices', Job:'jobs', Task:'tasks', Payment:'payments', Expense:'expenses' }; go(routes[n]) }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-fg hover:bg-soft">{n}</button>)}
            </Pop>
          </div>
        )}
        <button onClick={onToggleDark} aria-label="Toggle theme" className="rounded-lg p-2 text-muted hover:bg-soft hover:text-fg">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
        <div className="relative">
          <button onClick={() => toggle('bell')} aria-label="Notifications" className="relative rounded-lg p-2 text-muted hover:bg-soft hover:text-fg"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bad" /></button>
          <Pop open={menu === 'bell'} className="w-80">
            {[
              ['Overdue log', 'Call notes for L-1037 are 41h old — log within 24h'],
              ['Approval needed', '15% discount on Q-2071 for Molefe Logistics'],
              ['Payment cleared', 'R34 000 from Molefe Logistics (PAY-2291)'],
            ].map(([t, b]) => <div key={t} className="rounded-md px-3 py-2 hover:bg-soft"><p className="text-sm font-semibold text-fg">{t}</p><p className="text-xs text-muted">{b}</p></div>)}
            <button onClick={() => { setMenu(null); go('notifications') }} className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-accent hover:bg-soft">View all notifications</button>
          </Pop>
        </div>
        <div className="relative">
          <button onClick={() => toggle('role')} className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5 hover:bg-soft">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-bold text-lime">{me.who[0]}</span>
            <span className="hidden text-left sm:block"><span className="block text-xs text-muted">Viewing as</span><span className="block text-sm font-semibold leading-tight text-fg">{me.label}</span></span>
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>
          <Pop open={menu === 'role'} className="w-64">
            <p className="px-3 py-1.5 text-xs text-muted">Switch role</p>
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => { onRole?.(r.id); setMenu(null); toast(`Now viewing as ${r.label}`) }} className={`block w-full rounded-md px-3 py-2 text-left hover:bg-soft ${r.id === role ? 'bg-soft' : ''}`}>
                <span className="block text-sm font-semibold text-fg">{r.label}</span><span className="block text-xs text-muted">{r.who}</span>
              </button>
            ))}
            <button onClick={() => { setMenu(null); go('profile') }} className="mt-1 block w-full border-t border-line px-3 pt-2.5 pb-1.5 text-left text-sm text-fg hover:bg-soft">My profile</button>
          </Pop>
        </div>
      </div>
    </header>
  )
}

function Pop({ open, className = '', children }: { open: boolean; className?: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16, ease: EASE }} className={`absolute right-0 top-full mt-2 origin-top-right rounded-xl border border-line bg-card p-1.5 shadow-xl ${className}`}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
