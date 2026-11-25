// Fictional demonstration documents. No real client information belongs here.
import fs from 'node:fs'
import { convertData, newData } from '../shared/documents/create.js'
import { Brand, DEFAULT_BRAND, DocData, DocRecord, DocType, formatReference, Party } from '../shared/documents/model.js'
import { DEFAULT_SECTIONS } from '../shared/documents/templates.js'

/** Company details, with private banking details from the untracked brand.local file if present. */
export function loadBrand(): Brand {
  const file = new URL('../brand.local', import.meta.url)
  return fs.existsSync(file) ? { ...DEFAULT_BRAND, ...JSON.parse(fs.readFileSync(file, 'utf8')) } : DEFAULT_BRAND
}

const client: Party = { name: 'Demo Contact', company: 'Example Trading (Demo)', idNumber: '2020/000000/07', address: '1 Sample Street, Johannesburg, 2001', email: 'demo@example.com', phone: '+27 00 000 0000', vatNumber: '' }

export function demoDocuments(): DocRecord[] {
  const year = new Date().getFullYear()
  const doc = (type: DocType, data: DocData, status = 'Draft'): DocRecord => ({ id: `DEMO-${type}`, type, reference: formatReference(type, year, 901), status, data })

  const quote = newData('quote', DEFAULT_SECTIONS.quote, client)
  Object.assign(quote, {
    projectName: 'Business website and online bookings', summary: 'A five-page responsive website with online bookings, so customers can find you and book from their phones.',
    items: [{ description: 'Professional Website', qty: 1, unitCents: 500000 }, { description: 'Online Booking & Payments', qty: 1, unitCents: 150000 }, { description: 'Domain & Email', qty: 1, unitCents: 25000 }],
    recurring: [{ description: 'Hosting', terms: 'First month free, then R50/month' }],
  })
  const invoice = convertData({ type: 'quote', reference: formatReference('quote', year, 901), data: quote }, 'invoice', DEFAULT_SECTIONS.invoice)
  invoice.items = [
    { description: 'Mobile app', qty: 1, unitCents: 200000, standardCents: 200000 }, { description: 'Project management and setup', qty: 1, unitCents: 20000, standardCents: 20000 },
    { description: 'Landing page', qty: 1, unitCents: 250000, standardCents: 250000 }, { description: 'Admin dashboard', qty: 1, unitCents: 450000, standardCents: 450000 }, { description: 'Driver dashboard', qty: 1, unitCents: 300000, standardCents: 300000 },
  ]
  invoice.discountCents = 765000
  const agreement = convertData({ type: 'quote', reference: formatReference('quote', year, 901), data: quote }, 'agreement', DEFAULT_SECTIONS.agreement)
  const nda = newData('nda', DEFAULT_SECTIONS.nda, { ...client, company: '', name: 'Demo Partner', idNumber: '0000000000000' })
  const partnership = newData('partnership', DEFAULT_SECTIONS.partnership, nda.client)
  const form = newData('info_form', DEFAULT_SECTIONS.info_form, nda.client)
  const debt = convertData({ type: 'invoice', reference: formatReference('invoice', year, 901), data: invoice }, 'debt', DEFAULT_SECTIONS.debt)
  const signed = (d: DocData) => ({ ...d, companySignedOn: d.issueDate })
  return [doc('quote', quote), doc('invoice', invoice, 'Sent'), doc('agreement', signed(agreement)), doc('nda', signed(nda)), doc('partnership', signed(partnership)), doc('info_form', form), doc('debt', signed(debt))]
}
