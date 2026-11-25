import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Shell } from '../shared/nw/Shell'
import { PAGE_LABEL } from '../shared/nw/nav'
import { Badge, Btn, Card, DataTable, Empty, LoadError, PageHeader, useToast } from '../shared/nw/ui'
import { api, toRecord, useTable } from '../shared/nw/api'
import { rand, Role } from '../shared/nw/lib'

export const args = { dark: false, role: 'admin', page: 'quotes' }
export const argTypes = {
  dark: { control: 'boolean' },
  role: { control: 'radio', options: ['admin', 'partner', 'finance'] },
}

type Props = Partial<typeof args> & {
  onNavigate?: (p: string) => void
  onToggleDark?: () => void
}

const descriptions: Record<string, string> = {
  'dash-finance': 'Cash flow, receivables and partner commissions.',
  'dash-marketing': 'Campaign performance, accounts and content activity.',
  'dash-tutoring': 'Students, sessions and child-safety operations.',
  'clients': 'Active customer and client relationships.',
  'quotes': 'Create, review and follow up customer quotes.',
  'invoices': 'Issued invoices, balances and settlement status.',
  'price-list': 'Products and services with current pricing.',
  'schedule': 'Delivery dates and project milestones.',
  'tasks': 'Team assignments, priorities and completion.',
  'calendar': 'Meetings, sessions and delivery deadlines.',
  'help': 'Partner and project assistance requests.',
  'expenses': 'Operational and approved third-party costs.',
  'fin-reports': 'Financial reporting and business performance.',
  'partners': 'Partner status, performance and earnings.',
  'onboarding': 'Partner setup and compliance checklist.',
  'access': 'Users, roles and workspace permissions.',
  'contributors': 'Contractors and contributors on projects.',
  'accounts': 'Social and company marketing accounts.',
  'content': 'Upcoming and published marketing content.',
  'campaigns': 'Marketing campaigns and paid promotions.',
  'templates': 'Reusable email, WhatsApp and social templates.',
  'students': 'Tutoring students and parent relationships.',
  'sessions': 'Tutoring timetable and session outcomes.',
  'safety': 'Child safeguarding policies and incidents.',
  'documents': 'Contracts, records and company documents.',
  'popia': 'Privacy requests and POPIA compliance.',
  'audit': 'System activity and change history.',
  'weekly-report': 'Weekly partner activity and performance summary.',
  'reports': 'Operational and management reports.',
  'notifications': 'Recent alerts and unread workspace notifications.',
  'approvals': 'Discounts, spending and operational approvals.',
  'settings': 'Workspace configuration and system preferences.',
  'kb': 'Internal guides and frequently asked questions.',
  'profile': 'Personal account details and preferences.',
}

export default function Workspace(props: Props) {
  const { dark, role, page, onNavigate, onToggleDark } = { ...args, ...props }
  const toast = useToast()
  const [showClientForm, setShowClientForm] = useState(false)
  const [clientDraft, setClientDraft] = useState({ name: '', company: '', email: '', phone: '', service: '', value: '' })

  const title = PAGE_LABEL[page] ?? 'Workspace'
  const clients = useTable('clients', toRecord)
  const createClient = async () => {
    if (!clientDraft.name.trim() || !clientDraft.company.trim()) {
      toast('Name and company are required')
      return
    }
    const id = `C-${Date.now().toString().slice(-6)}`
    const response = await api('/api/clients', 'POST', {
      id,
      name: clientDraft.name.trim(),
      company: clientDraft.company.trim(),
      email: clientDraft.email.trim(),
      phone: clientDraft.phone.trim(),
      service: clientDraft.service.trim(),
      status: 'Active',
      value: Math.max(0, Math.round(Number(clientDraft.value) || 0)),
    })
    if (!response?.ok) {
      toast('Client could not be saved')
      return
    }
    const created = await response.json()
    clients.setRows((current) => [created, ...current])
    setClientDraft({ name: '', company: '', email: '', phone: '', service: '', value: '' })
    setShowClientForm(false)
    toast('Client saved')
  }

  return (
    <Shell role={role as Role} page={page} dark={dark} onNavigate={onNavigate} onToggleDark={onToggleDark}>
      <PageHeader title={title} sub={descriptions[page] ?? 'Manage this area of the NextWave workspace.'}>
        {page === 'clients' && <Btn kind="primary" onClick={() => setShowClientForm(true)}><Plus className="h-4 w-4" />New client</Btn>}
      </PageHeader>

      {page === 'clients' ? (
        <>
          <LoadError message={clients.error} />
          <DataTable
            name="Clients"
            rows={clients.rows}
            cols={[
              { key: 'id', label: 'Client ID' },
              { key: 'company', label: 'Company', render: (row) => <div><p className="font-semibold">{row.company}</p><p className="text-xs text-muted">{row.name}</p></div> },
              { key: 'email', label: 'Email', hideSm: true },
              { key: 'phone', label: 'Phone', hideSm: true },
              { key: 'service', label: 'Service', hideSm: true },
              { key: 'status', label: 'Status', render: (row) => <Badge>{String(row.status)}</Badge> },
              { key: 'value', label: 'Value', align: 'right', render: (row) => rand(Number(row.value || 0)) },
            ]}
          />
        </>
      ) : (
        <Card><Empty title={`${title} isn’t connected yet`} body="This area has no data source yet, so there is nothing to show." /></Card>
      )}

      {page === 'clients' && showClientForm && (
        <Card className="mb-5 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-fg">Contact name<input value={clientDraft.name} onChange={(e) => setClientDraft({ ...clientDraft, name: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
            <label className="text-sm font-semibold text-fg">Company<input value={clientDraft.company} onChange={(e) => setClientDraft({ ...clientDraft, company: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
            <label className="text-sm font-semibold text-fg">Email<input type="email" value={clientDraft.email} onChange={(e) => setClientDraft({ ...clientDraft, email: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
            <label className="text-sm font-semibold text-fg">Phone<input value={clientDraft.phone} onChange={(e) => setClientDraft({ ...clientDraft, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
            <label className="text-sm font-semibold text-fg">Service<input value={clientDraft.service} onChange={(e) => setClientDraft({ ...clientDraft, service: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
            <label className="text-sm font-semibold text-fg">Estimated value<input type="number" min="0" value={clientDraft.value} onChange={(e) => setClientDraft({ ...clientDraft, value: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 font-normal outline-none" /></label>
          </div>
          <div className="mt-4 flex justify-end gap-2"><Btn onClick={() => setShowClientForm(false)}>Cancel</Btn><Btn kind="primary" onClick={createClient}>Save client</Btn></div>
        </Card>
      )}
    </Shell>
  )
}
