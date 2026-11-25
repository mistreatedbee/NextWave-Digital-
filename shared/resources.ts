// The single definition of every record type: its fields and what each role may do with it.
// The API enforces it and the screens are generated from it.

export type Role = 'admin' | 'partner' | 'finance'
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'partner' | 'job' | 'client' | 'invoice' | 'student' | 'email' | 'url'
export type Field = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  /** Calculated by the server, never typed in. */
  computed?: boolean
  /** Shown in the record, not as a table column. */
  detail?: boolean
  money?: boolean
  min?: number
  max?: number
}
export type Rights = {
  /** 'own' limits the role to records carrying its own name (or email, for partner profiles). */
  read: 'all' | 'own'
  create?: string[] | '*'
  update?: string[] | '*'
  remove?: boolean
}
export type Resource = {
  title: string
  singular: string
  prefix: string
  fields: Field[]
  access: Partial<Record<Role, Rights>>
  /** Values the server sets on every record a partner creates. */
  partnerDefaults?: Record<string, string>
}

type Extra = Partial<Field>
const f = (type: FieldType) => (key: string, label: string, extra: Extra = {}): Field => ({ key, label, type, ...extra })
const text = f('text'), area = f('textarea'), num = f('number'), date = f('date'), email = f('email'), url = f('url'), job = f('job'), partner = f('partner'), client = f('client'), invoiceRef = f('invoice'), student = f('student')
const select = (key: string, label: string, options: string[], extra: Extra = {}) => f('select')(key, label, { options, required: true, ...extra })
const money = (key: string, label: string, extra: Extra = {}) => num(key, label, { money: true, min: 0, ...extra })
const req: Extra = { required: true }

const full: Rights = { read: 'all', create: '*', update: '*', remove: true }
const view: Rights = { read: 'all' }
/** A partner manages their own records. */
const mine = (fields: string[], remove = false): Rights => ({ read: 'own', create: fields, update: fields, remove })
const keys = (fields: Field[]) => fields.filter((x) => !x.computed && x.type !== 'partner').map((x) => x.key)

function define(title: string, singular: string, prefix: string, fields: Field[], access: (editable: string[]) => Resource['access'], partnerDefaults?: Record<string, string>): Resource {
  return { title, singular, prefix, fields, access: access(keys(fields)), partnerDefaults }
}

// The services NextWave sells, matching the website and the quote presets.
export const SERVICES = [
  'Starter Website', 'Professional Website', 'Premium Website', 'Landing Page', 'E-Commerce Store', 'AI Automation Suite',
  'Online Booking & Payments', 'Domain & Email', 'Hosting', 'Mobile App', 'Custom Software', 'Marketing', 'Tutoring', 'Other',
]
export const LOG_KINDS = ['Work done', 'Client call', 'Change request', 'New feature', 'Domain & hosting', 'Document', 'Meeting', 'Note']
export const LEAD_STAGES = ['New', 'Contacted', 'Quote sent', 'Won', 'Lost']
export const JOB_TYPES = ['Standard Job', 'Independent Work', 'Assisted Work', 'Major Project']
export const JOB_STATUSES = ['Not started', 'In progress', 'Review', 'Done', 'On hold']

export const RESOURCES = {
  leads: define('Leads', 'lead', 'L', [
    text('company', 'Company', req), text('name', 'Contact name', req), select('service', 'Service', SERVICES), text('source', 'Source'),
    money('value', 'Estimated value'), partner('partner', 'Partner'), select('stage', 'Stage', LEAD_STAGES), area('notes', 'Activity notes', { detail: true }),
  ], (e) => ({ admin: full, partner: mine(e) })),

  clients: define('Clients', 'client', 'C', [
    text('company', 'Company', req), text('name', 'Contact name', req), email('email', 'Email'), text('phone', 'Phone'), select('service', 'Service', SERVICES, { required: false }),
    partner('partner', 'Owner'), select('status', 'Status', ['Active', 'Inactive']), money('value', 'Value'),
    area('address', 'Address', { detail: true }), text('id_number', 'ID / registration number', { detail: true }), text('vat_number', 'VAT number', { detail: true }),
  ], (e) => ({ admin: full, partner: mine(e) })),

  jobs: define('Jobs', 'job', 'J', [
    text('title', 'Title', req), client('client', 'Client', req), select('job_type', 'Job type', JOB_TYPES), partner('partner', 'Partner'),
    money('value', 'Job value'), select('status', 'Status', JOB_STATUSES), date('due', 'Due date'), date('payment_due', 'Balance payment due', { detail: true }),
    num('major_share', 'Partner share % (Major Project, 20–50)', { min: 20, max: 50, detail: true }),
    money('received', 'Received', { computed: true }), money('bank_charges', 'Bank charges', { computed: true, detail: true }),
    money('third_party', 'Third-party costs', { computed: true, detail: true }), num('contributor_pct', 'Contributor share %', { computed: true, detail: true }),
  ], () => ({ admin: full, partner: { read: 'own', update: ['job_type'] } })),

  payments: define('Payments', 'payment', 'PAY', [
    date('payment_date', 'Date', req), invoiceRef('invoice', 'Invoice'), client('client', 'Client', req), job('job', 'Job'),
    money('amount', 'Amount', req), select('method', 'Method', ['EFT', 'Card (Yoco)', 'SnapScan', 'Cash', 'Other']), money('bank_charges', 'Bank charges'),
    select('status', 'Status', ['Pending', 'Cleared', 'Refunded']), partner('partner', 'Partner'),
  ], () => ({ admin: full, finance: view })),

  payouts: define('Payouts', 'payout', 'PO', [
    partner('partner', 'Partner', req), job('job', 'Job'), date('cleared_date', 'Funds cleared'), date('batch', 'Friday batch', req),
    money('gross', 'Gross fees', { detail: true }), money('amount', 'Payout amount', req), select('status', 'Status', ['Scheduled', 'Paid', 'Reversed (refund)']),
  ], () => ({ admin: full, finance: view, partner: { read: 'own' } })),

  quotes: define('Quotes', 'quote', 'Q', [
    client('client', 'Client', req), text('title', 'Description', req), money('amount', 'Amount', req), num('discount_pct', 'Discount %', { min: 0, max: 100 }),
    partner('partner', 'Partner'), select('status', 'Status', ['Draft', 'Awaiting approval', 'Approved', 'Sent', 'Accepted', 'Declined']), date('valid_until', 'Valid until'),
  ], (e) => ({ admin: full, partner: mine(e) })),

  invoices: define('Invoices', 'invoice', 'INV', [
    client('client', 'Client', req), job('job', 'Job'), money('amount', 'Amount', req), money('paid', 'Paid', { computed: true }),
    date('issued', 'Issued', req), date('due', 'Due'), select('status', 'Status', ['Issued', 'Partial', 'Paid', 'Cancelled']),
    date('last_reminder', 'Last reminder', { computed: true, detail: true }),
  ], () => ({ admin: full, finance: view })),

  prices: define('Price list', 'price', 'PR', [
    text('name', 'Service or package', req), text('category', 'Category'), money('price', 'Price', req), select('status', 'Status', ['Active', 'Retired']), area('notes', 'Notes', { detail: true }),
  ], () => ({ admin: full, partner: view })),

  tasks: define('Tasks', 'task', 'T', [
    text('title', 'Task', req), client('client', 'Client'), job('job', 'Job'), partner('partner', 'Assigned to'), select('priority', 'Priority', ['Low', 'Normal', 'High']),
    date('due', 'Due date'), select('status', 'Status', ['To do', 'In progress', 'Done']),
  ], (e) => ({ admin: full, partner: mine(e, true) })),

  work_log: define('Work log', 'log entry', 'WL', [
    date('log_date', 'Date', req), select('kind', 'Type', LOG_KINDS), client('client', 'Client', req), job('job', 'Job'),
    text('summary', 'Summary', req), area('details', 'What was done or requested', { detail: true }),
    area('next_steps', 'What needs to be done (each line becomes a task)', { detail: true }), date('follow_up', 'Follow up by'),
    url('link', 'Link (document, domain or site)', { detail: true }), select('job_status', 'Change the job status to', JOB_STATUSES, { required: false, detail: true }),
    partner('partner', 'Partner'), select('status', 'Status', ['Open', 'Done']),
  ], (e) => ({ admin: full, partner: mine(e.filter((k) => k !== 'job_status')) })),

  domains: define('Domains & hosting', 'domain', 'DM', [
    text('domain', 'Domain or service', req), client('client', 'Client', req), job('job', 'Job'), text('provider', 'Registrar or host'),
    date('expires', 'Renews on'), money('cost', 'Renewal cost'), select('status', 'Status', ['Active', 'To register', 'Expired', 'Cancelled']), area('notes', 'Notes (never store passwords here)', { detail: true }),
  ], () => ({ admin: full })),

  events: define('Calendar events', 'event', 'EV', [
    text('title', 'Event', req), date('event_date', 'Date', req), text('event_time', 'Time'), select('kind', 'Type', ['Meeting', 'Deadline', 'Reminder', 'Other']),
    partner('partner', 'Partner'), area('notes', 'Notes', { detail: true }),
  ], (e) => ({ admin: full, partner: mine(e, true) })),

  help_requests: define('Help requests', 'help request', 'H', [
    job('job', 'Job'), text('summary', 'What help is needed', req), partner('partner', 'Partner'), select('status', 'Status', ['Open', 'In progress', 'Resolved']),
  ], (e) => ({ admin: full, partner: mine(e) })),

  approvals: define('Approvals', 'approval request', 'AP', [
    select('kind', 'Type', ['Quote discount', 'Ad spend', 'Third-party cost', 'Help request', 'Other']), area('summary', 'Details', req), money('amount', 'Amount'),
    partner('partner', 'Requested by'), select('status', 'Decision', ['Pending', 'Approved', 'Declined']),
  ], () => ({ admin: full, partner: { read: 'own', create: ['kind', 'summary', 'amount'] } }), { status: 'Pending' }),

  expenses: define('Expenses', 'expense', 'EX', [
    date('expense_date', 'Date', req), text('summary', 'Description', req), select('category', 'Category', ['Third-party', 'Software', 'Advertising', 'Travel', 'Operations', 'Other']),
    job('job', 'Job'), money('amount', 'Amount', req), select('status', 'Status', ['Pending', 'Approved', 'Rejected']),
  ], () => ({ admin: full, finance: view })),

  contributors: define('Contributors', 'contributor', 'CT', [
    text('name', 'Name', req), job('job', 'Job', req), text('contribution', 'Contribution'), num('pct', 'Share of net fees %', { required: true, min: 0, max: 100 }),
    select('status', 'Status', ['Active', 'Pending', 'Complete']),
  ], () => ({ admin: full })),

  social_accounts: define('Company accounts', 'account', 'SA', [
    select('platform', 'Platform', ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'WhatsApp', 'Google', 'Website', 'Other']), text('handle', 'Handle', req),
    url('link', 'Link'), text('manager', 'Managed by'), select('status', 'Status', ['Active', 'Needs review', 'Disabled']),
  ], () => ({ admin: full })),

  content: define('Content calendar', 'content item', 'CN', [
    text('title', 'Title', req), text('channel', 'Channel', req), date('publish_date', 'Publish date', req), partner('partner', 'Owner'),
    select('status', 'Status', ['Draft', 'Scheduled', 'Published']), area('notes', 'Notes', { detail: true }),
  ], (e) => ({ admin: full, partner: mine(e, true) })),

  campaigns: define('Campaigns', 'campaign', 'CM', [
    text('name', 'Campaign', req), text('channel', 'Channel', req), money('budget', 'Budget'), num('leads_generated', 'Leads generated', { min: 0 }),
    date('starts', 'Starts'), date('ends', 'Ends'), partner('partner', 'Owner'), select('status', 'Status', ['Planned', 'Active', 'Complete']),
  ], (e) => ({ admin: full, partner: mine(e) })),

  templates: define('Message templates', 'template', 'TP', [
    text('name', 'Name', req), select('channel', 'Channel', ['Email', 'WhatsApp', 'Social']), area('body', 'Message', { required: true, detail: true }),
  ], () => ({ admin: full, partner: view })),

  students: define('Students & parents', 'student', 'ST', [
    text('student_name', 'Student', req), text('grade', 'Grade'), text('subject', 'Subject'), text('parent_name', 'Parent or guardian', req),
    text('parent_phone', 'Parent phone', req), select('consent', 'Parental consent', ['Pending', 'Given', 'Withdrawn']), partner('partner', 'Tutor'),
  ], (e) => ({ admin: full, partner: mine(e) })),

  sessions: define('Sessions', 'session', 'SE', [
    student('student', 'Student', req), text('subject', 'Subject'), date('session_date', 'Date', req), text('session_time', 'Time'), partner('partner', 'Tutor'),
    select('status', 'Status', ['Scheduled', 'Attended', 'Missed', 'Cancelled']), area('notes', 'Notes', { detail: true }),
  ], (e) => ({ admin: full, partner: mine(e) })),

  safety_incidents: define('Child safety', 'incident', 'SI', [
    date('incident_date', 'Date', req), text('summary', 'Summary', req), select('severity', 'Severity', ['Low', 'Medium', 'High']),
    select('status', 'Status', ['Open incident', 'Under review', 'Resolved']), area('action_taken', 'Action taken', { detail: true }),
  ], () => ({ admin: full })),

  documents: define('Compliance files', 'file', 'D', [
    text('title', 'Title', req), select('kind', 'Type', ['Contract', 'NDA', 'Agreement', 'Police clearance', 'Policy', 'Other']), url('link', 'Link to file', req),
    partner('partner', 'Partner'), date('expires', 'Expires'), select('status', 'Status', ['Pending review', 'Verified', 'Expired']),
  ], () => ({ admin: full, partner: { read: 'own', create: ['title', 'kind', 'link', 'expires'] } }), { status: 'Pending review' }),

  popia_requests: define('POPIA requests', 'request', 'PP', [
    text('requester', 'Requester', req), select('kind', 'Type', ['Access', 'Correction', 'Deletion', 'Objection']), date('received_on', 'Received', req), date('due', 'Respond by'),
    select('status', 'Status', ['Open', 'In progress', 'Resolved']), area('notes', 'Notes', { detail: true }),
  ], () => ({ admin: full })),

  onboarding: define('Onboarding checklist', 'checklist item', 'OB', [
    partner('partner', 'Partner', req), text('item', 'Requirement', req), select('status', 'Status', ['Missing', 'Submitted', 'Verified']),
  ], () => ({ admin: full, partner: { read: 'own', update: ['status'] } })),

  partners: define('Partners', 'partner', 'PT', [
    text('name', 'Name', { computed: true }), email('email', 'Email', { computed: true }), select('status', 'Status', ['Trial', 'Active', 'Suspended']),
  ], () => ({ admin: { read: 'all', update: ['status'] }, partner: { read: 'own' } })),

  kb_articles: define('Help & knowledge base', 'article', 'KB', [
    text('title', 'Title', req), text('category', 'Category'), area('body', 'Article', { required: true, detail: true }),
  ], () => ({ admin: full, partner: view, finance: view })),

  settings: define('Settings', 'setting', 'SET', [text('name', 'Setting', req), area('setting_value', 'Value', req)], () => ({ admin: full })),

  audit_log: define('Audit log', 'event', 'AU', [
    text('actor', 'Who', { computed: true }), text('action', 'Action', { computed: true }), text('entity', 'Record type', { computed: true }),
    text('entity_id', 'Record', { computed: true }), text('summary', 'Fields', { computed: true }), date('created_at', 'When', { computed: true }),
  ], () => ({ admin: view, finance: view })),
} satisfies Record<string, Resource>

export type Table = keyof typeof RESOURCES

export const isTable = (name: string): name is Table => Object.prototype.hasOwnProperty.call(RESOURCES, name)
export const resource = (table: Table): Resource => RESOURCES[table]
export const rights = (role: Role, table: Table): Rights | undefined => resource(table).access[role]

/** The fields a role may type into when creating or editing a record. */
export function editableFields(role: Role, table: Table, mode: 'create' | 'update'): Field[] {
  const allowed = rights(role, table)?.[mode]
  if (!allowed) return []
  return resource(table).fields.filter((x) => !x.computed && (allowed === '*' || allowed.includes(x.key)))
}

export const ONBOARDING_ITEMS = ['Information form', 'NDA signed', 'Partnership & Commission Agreement', 'Police clearance', 'System access', 'Training: commission & POPIA']
