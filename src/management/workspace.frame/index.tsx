import { isTable, Table } from '../../../shared/resources'
import { Shell } from '../shared/nw/Shell'
import { PAGE_LABEL } from '../shared/nw/nav'
import { ResourceView } from '../shared/nw/records'
import { Card, Empty, PageHeader } from '../shared/nw/ui'
import type { Role } from '../shared/nw/lib'
import { AccessControl, Profile } from './account'
import { CalendarFeed, FinanceDashboard, FinancialReports, MarketingDashboard, Notifications, ReportsHub, Schedule, SearchResults, TutoringDashboard, WeeklyReport } from './views'

export const args = { dark: false, role: 'admin', page: 'quotes' }
export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
}

type Props = Partial<typeof args> & {
  openNew?: boolean
  query?: string
  onNavigate?: (p: string) => void
  onToggleDark?: () => void
}

/** Pages whose name differs from the record type they show. */
const TABLES: Record<string, Table> = { 'price-list': 'prices', help: 'help_requests', accounts: 'social_accounts', safety: 'safety_incidents', popia: 'popia_requests', kb: 'kb_articles', audit: 'audit_log' }

const DESCRIPTIONS: Record<string, string> = {
  'dash-finance': 'Cash flow, receivables and partner payouts.',
  'dash-marketing': 'Campaigns, accounts and content activity.',
  'dash-tutoring': 'Students and sessions.',
  clients: 'Customer relationships. Partners see only the clients they own.',
  quotes: 'Discounted quotes need administrator approval before they are sent.',
  invoices: 'Issued invoices, balances and settlement status.',
  'price-list': 'Services and packages with current pricing.',
  schedule: 'Job and task due dates.',
  tasks: 'Assignments, priorities and completion.',
  calendar: 'Events, sessions and delivery deadlines.',
  help: 'Partner and project assistance requests.',
  expenses: 'Operating costs. Approved third-party costs on a job reduce its commission.',
  'fin-reports': 'Money received and paid out, by month.',
  partners: 'Partner profiles and status. Invite new partners from Access control.',
  onboarding: 'Partner setup and compliance requirements.',
  access: 'Invitations, accounts and roles.',
  contributors: 'People sharing in Major Projects.',
  accounts: 'Company social and marketing accounts. Never store passwords here.',
  content: 'Planned and published marketing content.',
  campaigns: 'Marketing campaigns and paid promotions.',
  templates: 'Reusable email, WhatsApp and social messages.',
  students: 'Tutoring students and parent contacts. Handle in line with POPIA.',
  sessions: 'Tutoring timetable and attendance.',
  safety: 'Child safeguarding incidents.',
  documents: 'Links to contracts and records kept in your file storage.',
  popia: 'Privacy requests and deadlines.',
  audit: 'Who changed what. The most recent 1,000 events.',
  'weekly-report': 'Partner activity summary.',
  reports: 'Download your records as CSV files.',
  notifications: 'Items that need attention.',
  approvals: 'Discounts, spending and other requests needing a decision.',
  settings: 'Reference values shared by administrators.',
  kb: 'Internal guides and answers.',
  profile: 'Your account and password.',
}

export default function Workspace(props: Props) {
  const { dark, role: roleName, page, openNew, query = '', onNavigate, onToggleDark } = { ...args, ...props }
  const role = roleName as Role
  const go = (p: string) => onNavigate?.(p)
  const title = page === 'search' ? `Search: ${query}` : page === 'profile' ? 'My profile' : PAGE_LABEL[page] ?? 'Workspace'
  const table = TABLES[page] ?? (isTable(page) ? page : null)

  // Rendered as elements so that data hooks run inside the Shell's providers.
  const body = () => {
    if (page === 'access') return <AccessControl />
    if (page === 'profile') return <Profile />
    if (page === 'dash-finance') return <FinanceDashboard role={role} />
    if (page === 'dash-marketing') return <MarketingDashboard role={role} />
    if (page === 'dash-tutoring') return <TutoringDashboard role={role} />
    if (page === 'fin-reports') return <FinancialReports role={role} />
    if (page === 'schedule') return <Schedule role={role} go={go} />
    // The calendar shows everything with a date, followed by the editable events.
    if (page === 'calendar') return <><CalendarFeed role={role} go={go} /><h2 className="mb-2 mt-6 font-semibold text-fg">Events</h2><ResourceView table="events" role={role} openNew={openNew} /></>
    if (page === 'weekly-report') return <WeeklyReport role={role} />
    if (page === 'reports') return <ReportsHub role={role} />
    if (page === 'notifications') return <Notifications role={role} go={go} />
    if (page === 'search') return <SearchResults role={role} query={query} go={go} />
    // "accounts" is the marketing page; sign-in accounts live under Access control.
    if (table) return <ResourceView table={table} role={role} openNew={openNew} />
    return <Card><Empty title="Page not found" body="Choose a page from the menu." /></Card>
  }

  return (
    <Shell role={role} page={page} dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={title} sub={DESCRIPTIONS[page]} />
      {body()}
    </Shell>
  )
}
