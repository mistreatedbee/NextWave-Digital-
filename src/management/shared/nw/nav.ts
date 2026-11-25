import { BarChart3, Briefcase, Calculator, Calendar, CalendarRange, CheckSquare, ClipboardCheck, Contact, CreditCard, FileCheck2, FileSpreadsheet, FileText, GraduationCap, HandHelping, HelpCircle, Inbox, KeyRound, LayoutDashboard, LifeBuoy, ListChecks, Megaphone, MessageSquareText, PieChart, Receipt, ScrollText, Settings, Share2, ShieldAlert, ShieldCheck, Tag, Target, UserCheck, Users, UsersRound, Wallet, Bell, Banknote, CalendarDays, FileBarChart } from 'lucide-react'
import type { Role } from './lib'

type Item = { id: string; label: string; icon: any; roles?: Role[]; badge?: string }
const A: Role[] = ['admin']
const AP: Role[] = ['admin', 'partner']
const AF: Role[] = ['admin', 'finance']

export const NAV: { group: string; items: Item[] }[] = [
  { group: 'Dashboards', items: [
    { id: 'dash-admin', label: 'Admin overview', icon: LayoutDashboard, roles: A },
    { id: 'dash-partner', label: 'My dashboard', icon: LayoutDashboard, roles: ['partner'] },
    { id: 'dash-finance', label: 'Finance', icon: PieChart, roles: ['finance'] },
    { id: 'dash-marketing', label: 'Marketing', icon: Megaphone, roles: A },
    { id: 'dash-tutoring', label: 'Tutoring', icon: GraduationCap, roles: AP },
  ] },
  { group: 'Sales', items: [
    { id: 'leads', label: 'Leads', icon: Target, roles: AP },
    { id: 'clients', label: 'Clients', icon: Contact, roles: AP },
    { id: 'quotes', label: 'Quotes', icon: FileText, roles: AP },
    { id: 'invoices', label: 'Invoices', icon: Receipt, roles: AF },
    { id: 'price-list', label: 'Price list', icon: Tag, roles: AP },
  ] },
  { group: 'Delivery', items: [
    { id: 'jobs', label: 'Jobs & projects', icon: Briefcase, roles: AP },
    { id: 'schedule', label: 'Project schedule', icon: CalendarRange, roles: AP },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, roles: AP },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: AP },
    { id: 'help', label: 'Help requests', icon: HandHelping, roles: AP },
  ] },
  { group: 'Money', items: [
    { id: 'commission', label: 'Commission calculator', icon: Calculator, roles: AP },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: AF },
    { id: 'payouts', label: 'Partner payouts', icon: Banknote, roles: AF },
    { id: 'expenses', label: 'Expenses & 3rd-party', icon: Wallet, roles: AF },
    { id: 'fin-reports', label: 'Financial reports', icon: FileSpreadsheet, roles: AF },
  ] },
  { group: 'People', items: [
    { id: 'partners', label: 'Partners', icon: Users, roles: A },
    { id: 'onboarding', label: 'Onboarding checklist', icon: ListChecks, roles: AP },
    { id: 'access', label: 'Access control', icon: KeyRound, roles: A },
    { id: 'contributors', label: 'Contributors', icon: UsersRound, roles: A },
  ] },
  { group: 'Marketing', items: [
    { id: 'accounts', label: 'Company accounts', icon: Share2, roles: A },
    { id: 'content', label: 'Content calendar', icon: CalendarDays, roles: AP },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, roles: AP },
    { id: 'templates', label: 'Message templates', icon: MessageSquareText, roles: AP },
  ] },
  { group: 'Tutoring', items: [
    { id: 'students', label: 'Students & parents', icon: GraduationCap, roles: AP },
    { id: 'sessions', label: 'Sessions', icon: ClipboardCheck, roles: AP },
    { id: 'safety', label: 'Child safety', icon: ShieldAlert, roles: A },
  ] },
  { group: 'Compliance', items: [
    { id: 'documents', label: 'Documents', icon: FileCheck2, roles: AP },
    { id: 'popia', label: 'POPIA centre', icon: ShieldCheck, roles: A },
    { id: 'audit', label: 'Audit log', icon: ScrollText, roles: AF },
  ] },
  { group: 'Reports & admin', items: [
    { id: 'weekly-report', label: 'Weekly partner report', icon: FileBarChart, roles: AP },
    { id: 'reports', label: 'Reports hub', icon: BarChart3, roles: AF },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'approvals', label: 'Approvals inbox', icon: Inbox, roles: A },
    { id: 'settings', label: 'Settings', icon: Settings, roles: A },
    { id: 'kb', label: 'Help & knowledge base', icon: LifeBuoy },
  ] },
]

export function canAccess(role: Role, page: string) {
  const item = NAV.flatMap((g) => g.items).find((i) => i.id === page)
  return !item?.roles || item.roles.includes(role)
}

export const PAGE_LABEL: Record<string, string> = Object.fromEntries(NAV.flatMap((g) => g.items.map((i) => [i.id, i.label])))
export const MONEY_PAGES = ['commission', 'payments', 'payouts', 'expenses', 'fin-reports', 'invoices', 'quotes', 'dash-finance']
// unused icon imports kept tree-shaken
void [HelpCircle, UserCheck]
