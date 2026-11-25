// Builds new documents and copies information between linked ones.
import { addDays, DocData, DocType, DOC_TYPES, emptyParty, money, Party, totals, todaySA } from './model.js'
import { DEFAULT_SECTIONS } from './templates.js'
import type { Section } from './model.js'

export function newData(type: DocType, sections: Section[] = DEFAULT_SECTIONS[type], client: Party = emptyParty()): DocData {
  const issueDate = todaySA()
  const fields: Record<string, string> = {}
  if (type === 'agreement') Object.assign(fields, { scope: '', deliverables: '', timeline: '3–4 weeks', payment_schedule: '50% deposit to start and 50% before launch.', start_date: issueDate })
  if (type === 'quote') Object.assign(fields, { timeline: '3–4 weeks from receipt of the deposit and all content.' })
  if (type === 'nda') Object.assign(fields, { mode: 'mutual', term_years: '3', purpose: 'a partnership or services relationship' })
  if (type === 'debt') Object.assign(fields, { pay_by_time: '17:00', sign_by: addDays(issueDate, 1), unpaid_period: '', invoice_reference: '', background: '' })
  return {
    client: { ...client }, projectName: '', summary: '', items: [], recurring: [], discountCents: 0, vatOn: false, issueDate,
    dueDate: addDays(issueDate, type === 'quote' ? 30 : type === 'debt' ? 2 : 7), cover: DOC_TYPES[type].cover,
    witnesses: type !== 'quote' && type !== 'invoice' && type !== 'info_form', sections: sections.map((s) => ({ ...s })), fields, payments: [],
  }
}

export const CONVERSIONS: Partial<Record<DocType, DocType[]>> = {
  quote: ['invoice', 'agreement'], agreement: ['invoice'], invoice: ['debt'], info_form: ['nda', 'partnership'], nda: ['partnership'],
}

/** A new document of another type, carrying across everything that applies. */
export function convertData(from: { type: DocType; reference: string; data: DocData }, to: DocType, sections: Section[]): DocData {
  const source = from.data
  const data = newData(to, sections, source.client)
  Object.assign(data, { projectName: source.projectName, summary: source.summary })
  if (from.type !== 'info_form' && from.type !== 'nda') {
    Object.assign(data, { items: source.items.map((i) => ({ ...i })), recurring: source.recurring.map((r) => ({ ...r })), discountCents: source.discountCents, vatOn: source.vatOn })
  }
  const t = totals(source)
  if (to === 'agreement') {
    const lines = source.items.map((i) => `- ${i.qty > 1 ? `${i.qty} × ` : ''}${i.description}`).join('\n')
    Object.assign(data.fields, {
      scope: [source.summary, lines].filter(Boolean).join('\n\n'), deliverables: lines, timeline: source.fields.timeline || data.fields.timeline,
      total_fee_cents: String(t.total), deposit_cents: String(Math.round(t.total / 2)),
    })
  }
  if (to === 'debt') {
    data.payments = source.payments.map((p) => ({ ...p }))
    Object.assign(data.fields, {
      invoice_reference: from.reference, invoice_date: source.issueDate, amount_owed_cents: String(t.balance), standard_value_cents: String(t.standard),
      unpaid_period: `since ${source.dueDate}`,
      background: `We completed work for you on ${source.projectName || 'your project'}. Invoice ${from.reference} was due for payment and ${t.paid ? `${money(t.paid)} has been received` : 'no payment has been received'}.`,
    })
  }
  if (to === 'nda' || to === 'partnership') {
    const f = source.fields
    data.client = { ...source.client, name: f.form_full_name || source.client.name, idNumber: f.form_id_number || source.client.idNumber, address: f.form_address || source.client.address, email: f.form_email || source.client.email, phone: f.form_phone || source.client.phone }
    if (to === 'nda') data.fields.purpose = 'a partnership and commission agreement'
  }
  return data
}
