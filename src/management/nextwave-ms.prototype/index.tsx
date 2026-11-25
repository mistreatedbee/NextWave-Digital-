import React, { useEffect, useState } from 'react'

import SignIn from '../sign-in.frame'
import AdminDashboard from '../admin-dashboard.frame'
import PartnerDashboard from '../partner-dashboard.frame'
import Leads from '../leads.frame'
import Jobs from '../jobs.frame'
import CommissionCalculator from '../commission-calculator.frame'
import PaymentsPayouts from '../payments-payouts.frame'
import Workspace from '../workspace.frame'

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

const HOME: Record<Role, string> = { admin: 'dash-admin', partner: 'dash-partner', finance: 'dash-finance' }
const FRAME_PAGE: Record<string, string> = {
  [SIGN_IN]: 'login', [ADMIN_DASH]: 'dash-admin', [PARTNER_DASH]: 'dash-partner', [LEADS]: 'leads',
  [JOBS]: 'jobs', [COMMISSION]: 'commission', [MONEY]: 'payments', [WORKSPACE]: 'quotes',
}

export default function NextWave(props: Props) {
  const p = { ...args, ...props }
  const [role, setRole] = useState<Role>(p.role as Role)
  const [dark, setDark] = useState(p.dark)
  const [page, setPage] = useState(() => (p.start ? FRAME_PAGE[p.start] ?? 'login' : 'login'))
  useEffect(() => setRole(p.role as Role), [p.role])
  useEffect(() => setDark(p.dark), [p.dark])

  const shell = {
    dark,
    onToggleDark: () => setDark((v) => !v),
    onNavigate: setPage,
    onRole: (r: Role) => { setRole(r); setPage(HOME[r]) },
  }

  if (page === 'login') return <SignIn state="login" onSignedIn={(signedRole) => { setRole(signedRole); setPage(HOME[signedRole]) }} />
  if (page === 'dash-admin') return <AdminDashboard {...shell} />
  if (page === 'dash-partner') return <PartnerDashboard {...shell} />
  if (page === 'leads') return <Leads {...shell} role={role} />
  if (page === 'jobs') return <Jobs {...shell} role={role} />
  if (page === 'commission') return <CommissionCalculator {...shell} role={role} />
  if (page === 'payments' || page === 'payouts') return <PaymentsPayouts {...shell} role={role} tab={page === 'payouts' ? 'Partner payouts' : 'Payments'} />
  return <Workspace {...shell} role={role} page={page} />
}
