import { useEffect, useState, type ReactNode } from 'react'

import SignIn from '../sign-in.frame'
import AdminDashboard from '../admin-dashboard.frame'
import PartnerDashboard from '../partner-dashboard.frame'
import Leads from '../leads.frame'
import Jobs from '../jobs.frame'
import CommissionCalculator from '../commission-calculator.frame'
import PaymentsPayouts from '../payments-payouts.frame'
import Workspace from '../workspace.frame'
import { canAccess } from '../shared/nw/nav'
import { Account, UserContext } from '../shared/nw/user'
import { api, SIGNED_OUT } from '../shared/nw/api'
import '../shared/nw/theme.css'

const SIGN_IN = 'sign-in'
const ADMIN_DASH = 'admin-dashboard'
const PARTNER_DASH = 'partner-dashboard'
const LEADS = 'leads'
const JOBS = 'jobs'
const COMMISSION = 'commission-calculator'
const MONEY = 'payments-payouts'
const WORKSPACE = 'workspace'

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const args = {
  role: 'admin',
  dark: false,
}

export const argTypes = {
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
  dark: { control: 'boolean' },
}

type Role = 'admin' | 'partner' | 'finance'
type Props = Partial<typeof args> & { start?: string }

const HOME: Record<Role, string> = { admin: 'dash-admin', partner: 'dash-partner', finance: 'payments' }
const FRAME_PAGE: Record<string, string> = {
  [SIGN_IN]: 'login', [ADMIN_DASH]: 'dash-admin', [PARTNER_DASH]: 'dash-partner', [LEADS]: 'leads',
  [JOBS]: 'jobs', [COMMISSION]: 'commission', [MONEY]: 'payments', [WORKSPACE]: 'quotes',
}

export default function NextWave(props: Props) {
  const p = { ...args, ...props }
  const [role, setRole] = useState<Role>(p.role as Role)
  // Start in whichever theme the website is using.
  const [dark, setDark] = useState(() => p.dark || document.documentElement.classList.contains('dark'))
  const [page, setPage] = useState(() => (p.start ? FRAME_PAGE[p.start] ?? 'login' : 'login'))
  useEffect(() => setRole(p.role as Role), [p.role])
  useEffect(() => { if (props.dark !== undefined) setDark(props.dark) }, [props.dark])
  // Tailwind's dark: styles look at the page root, so keep it in step and restore it on leaving.
  const [siteWasDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    return () => { document.documentElement.classList.toggle('dark', siteWasDark) }
  }, [dark, siteWasDark])
  const [account, setAccount] = useState<Account | null>(null)

  const signIn = (signedIn: Account) => { setAccount(signedIn); setRole(signedIn.role); setPage(HOME[signedIn.role]) }
  // The app (unlike a single preview frame) resumes an existing session, except when opening an invite link.
  const [restoring, setRestoring] = useState(() => !props.start && !new URLSearchParams(window.location.search).has('token'))
  useEffect(() => {
    if (!restoring) return
    let active = true
    fetch('/api/auth/me')
      .then(async (r) => { if (r.ok) { const found = await r.json(); if (active) signIn(found) } })
      .catch(() => {})
      .finally(() => { if (active) setRestoring(false) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    const expired = () => { setAccount(null); setPage('login') }
    window.addEventListener(SIGNED_OUT, expired)
    return () => window.removeEventListener(SIGNED_OUT, expired)
  }, [])

  const navigate = async (next: string) => {
    if (next === 'login') {
      const response = await api('/api/auth/logout', 'POST', {})
      // Staying put is safer than showing a signed-out screen while the session is still live.
      if (!response?.ok) { window.alert('Could not sign out. Check your connection and try again.'); return }
      setAccount(null)
    }
    setPage(next)
  }
  const shell = {
    dark,
    onToggleDark: () => setDark((v) => !v),
    onNavigate: navigate,
  }

  const themed = (children: ReactNode) => <div className={`nw-app h-full overflow-y-auto font-sans ${dark ? 'dark' : ''}`}>{children}</div>
  if (restoring) return themed(<div role="status" className="grid h-full place-items-center text-sm text-muted">Loading…</div>)
  if (page === 'login') return themed(<SignIn state="login" onSignedIn={signIn} />)

  // A page id may carry an argument, e.g. "tasks:new" or "search:acme".
  const [requested, ...rest] = page.split(':')
  const arg = rest.join(':')
  const current = canAccess(role, requested) ? requested : HOME[role]
  const openNew = arg === 'new'
  const view = () => {
    if (current === 'dash-admin') return <AdminDashboard {...shell} />
    if (current === 'dash-partner') return <PartnerDashboard {...shell} />
    if (current === 'leads') return <Leads key={page} {...shell} role={role} openNew={openNew} />
    if (current === 'jobs') return <Jobs key={page} {...shell} role={role} openNew={openNew} />
    if (current === 'commission') return <CommissionCalculator {...shell} role={role} />
    if (current === 'payments' || current === 'payouts') return <PaymentsPayouts key={page} {...shell} role={role} openNew={openNew} tab={current === 'payouts' ? 'Partner payouts' : 'Payments'} />
    return <Workspace key={page} {...shell} role={role} page={current} openNew={openNew} query={current === 'search' ? arg : ''} />
  }
  return <UserContext.Provider value={account}>{themed(view())}</UserContext.Provider>
}
