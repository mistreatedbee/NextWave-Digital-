// Types, money, dates, numbering and status rules shared by the screens and the API.

export type DocType = 'quote' | 'invoice' | 'agreement' | 'nda' | 'partnership' | 'info_form' | 'debt'

export const DOC_TYPES: Record<DocType, { label: string; code: string; file: string; title: [string, string]; legal: boolean; cover: boolean; signable: boolean; subtitle: string; party: string }> = {
  quote: { label: 'Quotation', code: 'Q', file: 'Quote', title: ['Project', 'Quotation'], legal: false, cover: false, signable: true, party: 'Client', subtitle: 'Our proposal, pricing and payment terms for your project.' },
  invoice: { label: 'Invoice', code: 'INV', file: 'Invoice', title: ['Invoice', ''], legal: false, cover: false, signable: false, party: 'Client', subtitle: 'Services delivered and the amount due.' },
  agreement: { label: 'Service Agreement', code: 'SA', file: 'Service_Agreement', title: ['Service', 'Agreement'], legal: true, cover: true, signable: true, party: 'Client', subtitle: 'The scope, fees and terms under which NextWave Digital Solutions will deliver your project.' },
  nda: { label: 'Mutual NDA', code: 'NDA', file: 'Mutual_NDA', title: ['Mutual', 'Non-Disclosure Agreement'], legal: true, cover: true, signable: true, party: 'Partner', subtitle: 'A confidentiality agreement that protects the information and clients of both NextWave Digital Solutions and you.' },
  partnership: { label: 'Partnership & Commission Agreement', code: 'PCA', file: 'Partnership_Agreement', title: ['Partnership & Commission', 'Agreement'], legal: true, cover: true, signable: true, party: 'Partner', subtitle: 'An agreement for marketing the company, finding clients and delivering services, with earnings shared on a commission basis.' },
  info_form: { label: 'Partnership Information Form', code: 'PRT', file: 'Partnership_Information_Form', title: ['Partnership', 'Information Form'], legal: true, cover: true, signable: true, party: 'Partner', subtitle: 'The personal details we need to set up your partnership, payments and system access with NextWave Digital Solutions.' },
  debt: { label: 'Acknowledgement of Debt', code: 'AOD', file: 'Acknowledgement_of_Debt', title: ['Acknowledgement of Debt', 'and Payment Agreement'], legal: true, cover: true, signable: true, party: 'Client', subtitle: 'The amount owed, the payment deadline, and what happens if payment is not made. Please read, sign and return it to NextWave Digital Solutions.' },
}
export const isDocType = (t: string): t is DocType => Object.prototype.hasOwnProperty.call(DOC_TYPES, t)

export type Brand = {
  company: string; regNo: string; address: string; email: string; phone: string; website: string; tagline: string
  signatoryName: string; signatoryTitle: string
  vatRegistered: boolean; vatNumber: string
  bank: string; accountHolder: string; accountType: string; accountNumber: string; branchCode: string
  proofLine: string
  /** Email clients weekly about overdue invoices. */
  autoRemind: boolean
}

// Banking details are deliberately blank: they are entered in Settings and kept in the database.
export const DEFAULT_BRAND: Brand = {
  company: 'NextWave Digital Solutions (Pty) Ltd', regNo: '2026/184607/07', address: '270 Marshall Street, Johannesburg, 2094, South Africa',
  email: 'info@nextwavedigitalsolutions.co.za', phone: '+27 73 153 1188', website: 'www.nextwavedigitalsolutions.co.za', tagline: 'Build. Grow. Succeed Online.',
  signatoryName: 'Ashley Mashigo', signatoryTitle: 'Managing Director', vatRegistered: false, vatNumber: '',
  bank: '', accountHolder: '', accountType: '', accountNumber: '', branchCode: '',
  autoRemind: false,
  proofLine: 'Please email proof of payment to info@nextwavedigitalsolutions.co.za or WhatsApp +27 73 153 1188 on the day you pay.',
}

export type Party = { name: string; company: string; idNumber: string; address: string; email: string; phone: string; vatNumber: string }
export type Item = { description: string; qty: number; unitCents: number; standardCents?: number }
export type Section = { id: string; title: string; body: string }
export type Signature = { name: string; idNumber: string; place: string; typed?: string; drawn?: string; at: string; ip?: string }

export type DocData = {
  client: Party
  projectName: string
  summary: string
  items: Item[]
  recurring: { description: string; terms: string }[]
  discountCents: number
  vatOn: boolean
  issueDate: string
  /** Valid-until for quotes, due date for invoices, pay-by date for debts. */
  dueDate: string
  cover: boolean
  witnesses: boolean
  sections: Section[]
  /** Values for {{placeholders}} and type-specific settings. */
  fields: Record<string, string>
  /** Invoice payments, copied in for display. */
  payments: { date: string; amountCents: number; method: string; bankCharges?: number }[]
  companySignedOn?: string
  clientSignature?: Signature
  /** Company details as they were at the moment of signing. */
  brandSnapshot?: Brand
}

export type DocRecord = { id: string; type: DocType; reference: string; status: string; data: DocData }

export const STATUSES: Record<DocType, string[]> = {
  quote: ['Draft', 'Sent', 'Accepted', 'Declined'], invoice: ['Draft', 'Sent'], agreement: ['Draft', 'Sent'], nda: ['Draft', 'Sent'],
  partnership: ['Draft', 'Sent'], info_form: ['Draft', 'Sent'], debt: ['Draft', 'Sent'],
}

export const emptyParty = (): Party => ({ name: '', company: '', idNumber: '', address: '', email: '', phone: '', vatNumber: '' })

export function totals(data: DocData) {
  const line = (i: Item) => Math.round(i.qty * i.unitCents)
  const subtotal = data.items.reduce((s, i) => s + line(i), 0)
  const standard = data.items.reduce((s, i) => s + (i.standardCents ? Math.round(i.qty * i.standardCents) : line(i)), 0)
  const discount = Math.min(Math.max(0, data.discountCents), subtotal)
  const vat = data.vatOn ? Math.round(((subtotal - discount) * 15) / 100) : 0
  const total = subtotal - discount + vat
  const paid = data.payments.reduce((s, p) => s + p.amountCents, 0)
  // Savings compare what the work is worth with what is charged for it, before VAT.
  const saved = Math.max(0, standard - (subtotal - discount))
  return { line, subtotal, standard, discount, vat, total, paid, balance: Math.max(0, total - paid), saved, savedPct: standard ? Math.round((saved / standard) * 100) : 0 }
}

/** R 4,550.00 */
export function money(cents: number) {
  const [whole, part] = (Math.abs(cents) / 100).toFixed(2).split('.')
  return `${cents < 0 ? '−' : ''}R ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${part}`
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
/** 18 November 2026 */
export function longDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '')
  return match ? `${Number(match[3])} ${MONTHS[Number(match[2]) - 1]} ${match[1]}` : ''
}
export const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10)
/** Today in South Africa, regardless of where the code runs. */
export const todaySA = (now = new Date()) => new Date(now.getTime() + 2 * 3600000).toISOString().slice(0, 10)

export const formatReference = (type: DocType, year: number, n: number) => `NW-${DOC_TYPES[type].code}-${year}-${String(n).padStart(3, '0')}`
export function parseReference(type: DocType, reference: string) {
  const match = new RegExp(`^NW-${DOC_TYPES[type].code}-(\\d{4})-(\\d{3,})$`).exec(reference)
  return match ? { year: Number(match[1]), n: Number(match[2]) } : null
}

/** Stored statuses are Draft, Sent, Accepted, Declined and Signed; the rest follow from dates and payments. */
export function displayStatus(doc: DocRecord, today = todaySA()) {
  if (doc.type === 'invoice') {
    const t = totals(doc.data)
    if (t.total > 0 && t.balance === 0) return 'Paid'
    if (doc.status !== 'Draft' && doc.data.dueDate && doc.data.dueDate < today) return 'Overdue'
    if (t.paid > 0) return 'Partially Paid'
  }
  if (doc.type === 'quote' && ['Draft', 'Sent'].includes(doc.status) && doc.data.dueDate && doc.data.dueDate < today) return 'Expired'
  return doc.status
}

export function fileName(doc: DocRecord) {
  const who = (doc.data.client.company || doc.data.client.name || 'Client').normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Client'
  return `NextWave_${DOC_TYPES[doc.type].file}_${who}.pdf`
}

/** 4550 -> "four thousand five hundred and fifty rand" */
export function randInWords(cents: number) {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const words = (n: number): string => {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? `-${ones[n % 10]}` : '')
    if (n < 1000) return `${ones[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${words(n % 100)}` : ''}`
    for (const [size, name] of [[1_000_000, 'million'], [1000, 'thousand']] as const) {
      if (n >= size) {
        const rest = n % size
        return `${words(Math.floor(n / size))} ${name}${rest ? `${rest < 100 ? ' and' : ''} ${words(rest)}` : ''}`
      }
    }
    return String(n)
  }
  const rand = Math.floor(cents / 100)
  const c = cents % 100
  return `${words(rand)} rand${c ? ` and ${words(c)} cents` : ''}`
}
