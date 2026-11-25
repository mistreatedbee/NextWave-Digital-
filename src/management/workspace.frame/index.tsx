import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { PAGE_LABEL } from '../shared/nw/nav'
import { Badge, Btn, Card, DataTable, PageHeader, useToast } from '../shared/nw/ui'
import type { Role } from '../shared/nw/lib'

export const args = { dark: false, role: 'admin', page: 'quotes' }
export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
}

type Props = Partial<typeof args> & {
  onRole?: (r: Role) => void
  onNavigate?: (p: string) => void
  onToggleDark?: () => void
}

const summaries: Record<string, { sub: string; metrics: [string, string][] }> = {
  'dash-finance': { sub: 'Cash flow, receivables and partner commissions.', metrics: [['Receivables', 'R184 500'], ['Cleared this month', 'R70 350'], ['Partner payouts', 'R17 850']] },
  'dash-marketing': { sub: 'Campaign performance, accounts and content activity.', metrics: [['Active campaigns', '6'], ['Reach this month', '48.2K'], ['Leads generated', '127']] },
  'dash-tutoring': { sub: 'Students, sessions and child-safety operations.', metrics: [['Active students', '18'], ['Sessions this week', '34'], ['Attendance', '96%']] },
  clients: { sub: 'Active customer and client relationships.', metrics: [['Active clients', '42'], ['Retained', '89%'], ['This month', '8']] },
  quotes: { sub: 'Create, review and follow up customer quotes.', metrics: [['Open quotes', '9'], ['Quote value', 'R268 400'], ['Won this month', 'R102 200']] },
  invoices: { sub: 'Issued invoices, balances and settlement status.', metrics: [['Overdue', 'R18 700'], ['Issued', 'R184 500'], ['Paid', 'R142 300']] },
  'price-list': { sub: 'Products and services with current pricing.', metrics: [['Services', '18'], ['Packages', '7'], ['Last updated', 'Today']] },
  schedule: { sub: 'Delivery dates and project milestones.', metrics: [['Projects scheduled', '12'], ['Due this week', '4'], ['Overdue', '1']] },
  tasks: { sub: 'Team assignments, priorities and completion.', metrics: [['Open tasks', '24'], ['Due today', '6'], ['Completed', '71']] },
  calendar: { sub: 'Meetings, sessions and delivery deadlines.', metrics: [['Today', '5'], ['This week', '18'], ['Availability', '82%']] },
  help: { sub: 'Partner and project assistance requests.', metrics: [['Open requests', '2'], ['Avg. response', '1.8h'], ['Resolved', '31']] },
  expenses: { sub: 'Operational and approved third-party costs.', metrics: [['This month', 'R24 600'], ['Pending approval', 'R3 350'], ['Approved', 'R21 250']] },
  'fin-reports': { sub: 'Financial reporting and business performance.', metrics: [['Gross revenue', 'R703 500'], ['Net fees', 'R521 300'], ['Profit margin', '34%']] },
  partners: { sub: 'Partner status, performance and earnings.', metrics: [['Active partners', '5'], ['In trial', '2'], ['This month', 'R31 200']] },
  onboarding: { sub: 'Partner setup and compliance checklist.', metrics: [['In onboarding', '2'], ['Complete', '68%'], ['Overdue steps', '3']] },
  access: { sub: 'Users, roles and workspace permissions.', metrics: [['Users', '24'], ['Admins', '3'], ['Roles', '6']] },
  contributors: { sub: 'Contractors and contributors on projects.', metrics: [['Active', '8'], ['Pending', '2'], ['This month', 'R12 400']] },
  accounts: { sub: 'Social and company marketing accounts.', metrics: [['Accounts', '11'], ['Connected', '9'], ['Needs review', '2']] },
  content: { sub: 'Upcoming and published marketing content.', metrics: [['This week', '14'], ['Published', '38'], ['Scheduled', '9']] },
  campaigns: { sub: 'Marketing campaigns and paid promotions.', metrics: [['Running', '6'], ['Budget', 'R18 500'], ['Conversions', '214']] },
  templates: { sub: 'Reusable email, WhatsApp and social templates.', metrics: [['Templates', '28'], ['Most used', 'Follow-up'], ['Shared', '12']] },
  students: { sub: 'Tutoring students and parent relationships.', metrics: [['Students', '18'], ['Parents', '15'], ['Attendance', '96%']] },
  sessions: { sub: 'Tutoring timetable and session outcomes.', metrics: [['Today', '5'], ['This week', '34'], ['Completed', '128']] },
  safety: { sub: 'Child safeguarding policies and incidents.', metrics: [['Policy status', 'Compliant'], ['Open incidents', '0'], ['Checks due', '3']] },
  documents: { sub: 'Contracts, records and company documents.', metrics: [['Documents', '86'], ['Expiring', '3'], ['Pending signature', '5']] },
  popia: { sub: 'Privacy requests and POPIA compliance.', metrics: [['Compliance', 'Active'], ['Requests', '2'], ['Retentions due', '4']] },
  audit: { sub: 'System activity and change history.', metrics: [['Events today', '47'], ['Logins', '12'], ['Changes', '18']] },
  'weekly-report': { sub: 'Weekly partner activity and performance summary.', metrics: [['Partners reporting', '5'], ['Leads logged', '29'], ['Jobs updated', '16']] },
  reports: { sub: 'Operational and management reports.', metrics: [['Available reports', '12'], ['Scheduled', '4'], ['Exports', '38']] },
  notifications: { sub: 'Recent alerts and unread workspace notifications.', metrics: [['Unread', '7'], ['High priority', '2'], ['Today', '11']] },
  approvals: { sub: 'Discounts, spending and operational approvals.', metrics: [['Pending', '4'], ['Value', 'R13 550'], ['Older than 24h', '2']] },
  settings: { sub: 'Workspace configuration and system preferences.', metrics: [['Sections', '9'], ['Integrations', '4'], ['Users', '24']] },
  kb: { sub: 'Internal guides and frequently asked questions.', metrics: [['Articles', '32'], ['Recently updated', '6'], ['Views', '1.2K']] },
  profile: { sub: 'Personal account details and preferences.', metrics: [['Account', 'Active'], ['Role', 'Workspace member'], ['Last sign-in', 'Today']] },
}

const recordSets: Record<string, Record<string, string>[]> = {
  quotes: [{ id: 'Q-2071', name: 'Molefe Logistics', detail: 'Fleet tracking — Phase 1', status: 'Awaiting approval', value: 'R68 000' }, { id: 'Q-2070', name: 'Zulu Fitness', detail: 'Social media starter pack', status: 'Sent', value: 'R6 500' }, { id: 'Q-2068', name: 'Essop & Co', detail: 'Website rebuild', status: 'Approved', value: 'R22 000' }],
  invoices: [{ id: 'INV-0418', name: 'Molefe Logistics', detail: 'Phase 1 milestone', status: 'Paid', value: 'R34 000' }, { id: 'INV-0416', name: 'Venter Accounting', detail: 'Automation invoice', status: 'Partial', value: 'R18 500' }, { id: 'INV-0415', name: 'Zulu Fitness', detail: 'Starter pack deposit', status: 'Pending', value: 'R3 250' }],
  approvals: [{ id: 'AP-88', name: 'Quote discount', detail: 'Q-2071 · 15% discount', status: 'Pending', value: 'R10 200' }, { id: 'AP-87', name: 'Ad spend', detail: 'December Meta campaign', status: 'Pending', value: 'R1 500' }, { id: 'AP-86', name: 'Third-party cost', detail: 'Apple developer licence', status: 'Pending', value: 'R1 850' }],
  notifications: [{ id: 'NT-104', name: 'Overdue log', detail: 'Call notes for L-1037', status: 'Unread', value: '41h' }, { id: 'NT-103', name: 'Approval needed', detail: 'Quote discount for Molefe Logistics', status: 'Unread', value: '4 pending' }, { id: 'NT-102', name: 'Payment cleared', detail: 'PAY-2291 · Molefe Logistics', status: 'Read', value: 'R34 000' }],
}

export default function Workspace(props: Props) {
  const { dark, role, page, onRole, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const [q, setQ] = useState('')
  const title = PAGE_LABEL[page] ?? 'Workspace'
  const summary = summaries[page] ?? { sub: 'Manage this area of the NextWave workspace.', metrics: [['Status', 'Active'], ['Updated', 'Today'], ['Records', 'Live']] }
  const rows = useMemo(() => (recordSets[page] ?? []).filter((row) => JSON.stringify(row).toLowerCase().includes(q.toLowerCase())), [page, q])

  return (
    <Shell role={role as Role} page={page} dark={dark} onRole={onRole} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={title} sub={summary.sub}>
        <Btn kind="primary" onClick={() => toast(`New ${title.toLowerCase()} item created`)}><Plus className="h-4 w-4" />New</Btn>
      </PageHeader>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.metrics.map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 font-display text-xl font-bold text-fg">{value}</p>
          </Card>
        ))}
      </div>

      {recordSets[page] ? (
        <>
          <Card className="mb-3 p-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none" />
          </Card>
          <DataTable
            name={title}
            rows={rows}
            cols={[
              { key: 'id', label: 'Reference' },
              { key: 'name', label: 'Name', render: (row) => <div><p className="font-semibold">{row.name}</p><p className="text-xs text-muted">{row.detail}</p></div> },
              { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
              { key: 'value', label: 'Value', align: 'right' },
            ]}
          />
        </>
      ) : (
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-soft p-5">
              <p className="font-display font-bold text-fg">{title} overview</p>
              <p className="mt-2 text-sm text-muted">Current records, responsibilities and performance for {title.toLowerCase()}.</p>
            </div>
            <div className="rounded-xl border border-line p-5">
              <p className="text-sm font-semibold text-fg">Recent activity</p>
              <ul className="mt-3 space-y-3 text-sm text-muted">
                <li>Workspace records updated today</li>
                <li>New activity is visible to {role} users</li>
                <li>Use the New button to add a record</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </Shell>
  )
}
