import crypto from 'node:crypto'
import type { Express, Request, RequestHandler, Response, NextFunction } from 'express'
import { convertData, CONVERSIONS, newData } from '../../shared/documents/create.js'
import { Brand, DEFAULT_BRAND, DOC_TYPES, DocData, DocRecord, DocType, displayStatus, emptyParty, fileName, formatReference, isDocType, money, parseReference, STATUSES, todaySA, totals } from '../../shared/documents/model.js'
import { renderDocument } from '../../shared/documents/render.js'
import { DEFAULT_SECTIONS, FORM_QUESTIONS } from '../../shared/documents/templates.js'
import { cleanBrand, cleanData, cleanSections, InvalidDocument } from '../../shared/documents/validate.js'
import type { Account } from '../permissions.js'
import type { Db } from '../app.js'
import { clientIp } from '../rate-limit.js'
import { emailConfigured, emailHtml, sendEmail } from './email.js'

type Handler = (req: Request, res: Response) => Promise<unknown>
type Guard = (handler: (user: Account, req: Request, res: Response) => Promise<unknown>, roles?: Account['role'][]) => RequestHandler
export type PdfMaker = (html: string) => Promise<Buffer>

const LINK_DAYS = 30
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => { handler(req, res).catch(next) }
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
const fail = (res: Response, status: number, error: string) => res.status(status).json({ error })
/** Compares content regardless of key order, which the database does not preserve. */
const canonical = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x))

type Row = Record<string, any>
const record = (row: Row): DocRecord => ({ id: row.id, type: row.type, reference: row.reference, status: row.status, data: row.data })
const summary = (row: Row) => ({
  ...record(row), data: { ...row.data, sections: [], clientSignature: row.data.clientSignature ? { ...row.data.clientSignature, drawn: undefined } : undefined, brandSnapshot: undefined },
  clientId: row.client_id, parentId: row.parent_id, signedAt: row.signed_at, createdAt: row.created_at,
})

export type Links = {
  recalculateJob: (id: unknown) => Promise<void>
  ensureClient: (name: unknown, details?: { contact?: unknown; value?: unknown }) => Promise<void>
}

export function documentRoutes(app: Express, db: Db, signedIn: Guard, makePdf: PdfMaker, links: Links) {
  const admin = (handler: (req: Request, res: Response) => Promise<unknown>) => signedIn((_user, req, res) => handler(req, res), ['admin'])

  const log = (id: string, action: string, detail = '') => db.query('insert into public.document_events (document_id, action, detail) values ($1, $2, $3)', [id, action, detail])

  /**
   * Mirrors quotes, invoices and their payments into the finance records, so the dashboards,
   * job commission and reports include them. Those records hold whole rand.
   */
  async function sync(id: string) {
    const row = (await db.query('select * from public.business_documents where id = $1', [id])).rows[0]
    const before = await db.query('select distinct job from public.payments where id like $1', [`${id}-%`])
    await db.query('delete from public.payments where id like $1', [`${id}-%`])
    const data: DocData | undefined = row?.data
    const client = data ? data.client.company || data.client.name : ''
    const rand = (cents: number) => Math.round(cents / 100)
    const job = data?.fields.job_id ?? ''
    const invoiceLive = row?.type === 'invoice' && (row.status !== 'Draft' || data!.payments.length > 0)
    if (!invoiceLive) await db.query('delete from public.invoices where id = $1', [id])
    if (row?.type !== 'quote') await db.query('delete from public.quotes where id = $1', [id])
    if (data && client) {
      if (row.status !== 'Draft') await links.ensureClient(client, { contact: data.client.name })
      const t = totals(data)
      if (row.type === 'quote') {
        const pct = t.subtotal ? Math.round((t.discount / t.subtotal) * 100) : 0
        await db.query(
          `insert into public.quotes (id, client, title, amount, discount_pct, status, valid_until) values ($1, $2, $3, $4, $5, $6, $7)
           on conflict (id) do update set client = excluded.client, title = excluded.title, amount = excluded.amount, discount_pct = excluded.discount_pct, status = excluded.status, valid_until = excluded.valid_until`,
          [id, client, `${row.reference} ${data.projectName}`.trim(), rand(t.total), pct, row.status, data.dueDate || null])
      }
      if (invoiceLive) {
        const status = t.total > 0 && t.balance === 0 ? 'Paid' : t.paid > 0 ? 'Partial' : 'Issued'
        await db.query(
          `insert into public.invoices (id, client, job, amount, paid, issued, due, status) values ($1, $2, $3, $4, $5, $6, $7, $8)
           on conflict (id) do update set client = excluded.client, job = excluded.job, amount = excluded.amount, paid = excluded.paid, issued = excluded.issued, due = excluded.due, status = excluded.status`,
          [id, client, job, rand(t.total), rand(t.paid), data.issueDate || null, data.dueDate || null, status])
        const partner = job ? (await db.query('select partner from public.jobs where id = $1', [job])).rows[0]?.partner ?? '' : ''
        for (const [i, p] of data.payments.entries()) {
          await db.query('insert into public.payments (id, payment_date, client, invoice, job, amount, method, bank_charges, status, partner) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [`${id}-${i}`, p.date, client, id, job, rand(p.amountCents), p.method === 'Card' ? 'Card (Yoco)' : p.method, rand((p as { bankCharges?: number }).bankCharges ?? 0), 'Cleared', partner])
        }
      }
    }
    for (const touched of new Set([...before.rows.map((x) => x.job), job])) await links.recalculateJob(touched)
  }

  async function getBrand(): Promise<Brand> {
    const found = await db.query("select value from public.document_settings where key = 'brand'")
    return { ...DEFAULT_BRAND, ...found.rows[0]?.value }
  }
  async function sectionsFor(type: DocType) {
    const found = await db.query('select value from public.document_settings where key = $1', [`template:${type}`])
    return found.rows[0]?.value?.sections ?? DEFAULT_SECTIONS[type]
  }
  const saveSetting = (key: string, value: unknown) => db.query(
    'insert into public.document_settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value, updated_at = now()', [key, JSON.stringify(value)])

  /** The counter only ever moves forward, so a number is never issued twice. */
  async function nextReference(type: DocType) {
    const year = Number(todaySA().slice(0, 4))
    for (;;) {
      const result = await db.query(
        'insert into public.document_counters (key, last) values ($1, 1) on conflict (key) do update set last = document_counters.last + 1 returning last', [`${type}:${year}`])
      const reference = formatReference(type, year, Number(result.rows[0].last))
      // Skip numbers that were already imported by hand.
      const taken = await db.query('select id from public.business_documents where lower(reference) = lower($1)', [reference])
      if (!taken.rows.length) return reference
    }
  }

  async function insert(type: DocType, data: DocData, parentId: string | null, clientId: string | null) {
    const id = `DOC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`
    const reference = await nextReference(type)
    await db.query('insert into public.business_documents (id, type, reference, client_id, data, total_cents, parent_id) values ($1, $2, $3, $4, $5, $6, $7)',
      [id, type, reference, clientId, JSON.stringify(data), totals(data).total, parentId])
    await log(id, 'Created', reference)
    await sync(id)
    return id
  }

  const find = async (id: string): Promise<Row | undefined> => (await db.query('select * from public.business_documents where id = $1', [id])).rows[0]
  const withDocument = (handler: (row: Row, req: Request, res: Response) => Promise<unknown>) => admin(async (req, res) => {
    const row = await find(String(req.params.id))
    if (!row) return fail(res, 404, 'Document not found')
    return handler(row, req, res)
  })

  /** Saves a change only if nobody else changed or signed the document in the meantime. */
  async function save(row: Row, changes: { data: DocData; reference?: string; status?: string; revokeLink?: boolean }) {
    const result = await db.query(
      `update public.business_documents set data = $1, reference = $2, status = $3, total_cents = $4, version = version + 1, updated_at = now()
       ${changes.revokeLink ? ', share_token_hash = null, share_expires_at = null' : ''}
       where id = $5 and version = $6 and signed_at is null returning *`,
      [JSON.stringify(changes.data), changes.reference ?? row.reference, changes.status ?? row.status, totals(changes.data).total, row.id, row.version])
    if (result.rows[0]) await sync(row.id)
    return result.rows[0] as Row | undefined
  }
  const CHANGED = 'This document changed in the meantime. Reload it and try again.'

  async function pdfFor(row: Row) {
    if (row.signed_pdf) return Buffer.from(row.signed_pdf, 'base64')
    return makePdf(renderDocument(record(row), await getBrand()))
  }
  const sendPdf = (res: Response, row: Row, pdf: Buffer) => {
    res.set('Content-Type', 'application/pdf')
    res.set('Content-Disposition', `attachment; filename="${fileName(record(row))}"`)
    res.send(pdf)
  }

  /** Issues a fresh client link. Any earlier link stops working. Only a hash of it is stored. */
  async function createLink(row: Row) {
    const token = crypto.randomBytes(32).toString('base64url')
    const data: DocData = { ...row.data }
    const meta = DOC_TYPES[row.type as DocType]
    // Sending a document for signature applies the company's electronic signature.
    if (!row.signed_at && meta.signable && !['info_form', 'quote'].includes(row.type)) data.companySignedOn ??= todaySA()
    const status = row.status === 'Draft' ? 'Sent' : row.status
    await db.query('update public.business_documents set share_token_hash = $1, share_expires_at = $2, status = $3, data = $4, version = version + 1, updated_at = now() where id = $5',
      [hashToken(token), new Date(Date.now() + LINK_DAYS * 86400000).toISOString(), status, JSON.stringify(data), row.id])
    await sync(row.id)
    // The token follows "#", so it is never sent to or logged by the web server.
    return `/management/sign#${token}`
  }

  app.get('/api/docs', admin(async (_req, res) => {
    const result = await db.query('select * from public.business_documents order by created_at desc limit 1000')
    res.json(result.rows.map(summary))
  }))

  app.post('/api/docs', admin(async (req, res) => {
    const type = String(req.body?.type ?? '')
    if (!isDocType(type)) return fail(res, 400, 'Unknown document type')
    const clientId = req.body?.clientId ? String(req.body.clientId) : null
    const party = emptyParty()
    if (clientId) {
      const found = await db.query('select * from public.clients where id = $1', [clientId])
      const c = found.rows[0]
      if (!c) return fail(res, 400, 'Client not found')
      Object.assign(party, { name: c.name ?? '', company: c.company ?? '', email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '', idNumber: c.id_number ?? '', vatNumber: c.vat_number ?? '' })
    }
    const data = newData(type, await sectionsFor(type), party)
    data.vatOn = (await getBrand()).vatRegistered && (type === 'quote' || type === 'invoice')
    res.status(201).json({ id: await insert(type, data, null, clientId) })
  }))

  app.get('/api/docs/:id', withDocument(async (row, _req, res) => {
    const events = await db.query('select action, detail, created_at from public.document_events where document_id = $1 order by id desc limit 200', [row.id])
    const linked = await db.query('select id, type, reference, status, parent_id from public.business_documents where parent_id = $1 or id = $2', [row.id, row.parent_id ?? ''])
    res.json({ ...record(row), version: row.version, clientId: row.client_id, parentId: row.parent_id, signedAt: row.signed_at,
      linkActiveUntil: row.share_token_hash ? row.share_expires_at : null, events: events.rows, linked: linked.rows })
  }))

  app.put('/api/docs/:id', withDocument(async (row, req, res) => {
    if (row.signed_at) return fail(res, 409, 'A signed document is locked. Duplicate it to make changes.')
    if (req.body?.version !== row.version) return fail(res, 409, CHANGED)
    const reference = req.body.reference === undefined ? row.reference : String(req.body.reference).trim()
    if (!/^[A-Za-z0-9][A-Za-z0-9 ._/-]{0,39}$/.test(reference)) return fail(res, 400, 'A reference may use letters, numbers, spaces, dots, dashes and slashes')
    const status = req.body.status === undefined ? row.status : String(req.body.status)
    if (status !== row.status && !STATUSES[row.type as DocType].includes(status)) return fail(res, 400, 'Invalid status')
    const data = req.body.data === undefined ? row.data : cleanData(req.body.data, row.data)
    const contentChanged = reference !== row.reference || (req.body.data !== undefined && canonical(data) !== canonical(cleanData(row.data, row.data)))
    // Changed wording must be sent (and signed by the company) again.
    const revoke = contentChanged && DOC_TYPES[row.type as DocType].signable
    if (revoke) delete data.companySignedOn
    if (reference.toLowerCase() !== String(row.reference).toLowerCase()) {
      const taken = await db.query('select id from public.business_documents where lower(reference) = lower($1) and id <> $2', [reference, row.id])
      if (taken.rows.length) return fail(res, 409, 'That reference number is already in use')
    }
    const saved = await save(row, { data, reference, status, revokeLink: revoke })
    if (!saved) return fail(res, 409, CHANGED)
    const imported = parseReference(row.type, reference)
    if (imported && reference !== row.reference) {
      await db.query('insert into public.document_counters (key, last) values ($1, $2) on conflict (key) do update set last = greatest(document_counters.last, excluded.last)', [`${row.type}:${imported.year}`, imported.n])
    }
    if (status !== row.status) await log(row.id, status === 'Sent' ? 'Sent' : `Marked ${status.toLowerCase()}`)
    if (contentChanged) await log(row.id, 'Edited', revoke && row.share_token_hash ? 'The earlier signing link was cancelled' : '')
    res.json({ version: saved.version, linkCancelled: revoke && !!row.share_token_hash })
  }))

  app.delete('/api/docs/:id', withDocument(async (row, _req, res) => {
    if (row.signed_at || row.status !== 'Draft' || row.data.payments.length) return fail(res, 409, 'Only unsent drafts without payments can be deleted')
    await db.query('delete from public.business_documents where id = $1', [row.id])
    await db.query('delete from public.document_events where document_id = $1', [row.id])
    await sync(row.id)
    res.status(204).end()
  }))

  app.post('/api/docs/:id/duplicate', withDocument(async (row, _req, res) => {
    const data: DocData = { ...row.data, payments: [], issueDate: todaySA() }
    delete data.companySignedOn; delete data.clientSignature; delete data.brandSnapshot
    const days = Math.max(1, Math.round((Date.parse(row.data.dueDate) - Date.parse(row.data.issueDate)) / 86400000) || 7)
    data.dueDate = new Date(Date.parse(data.issueDate) + days * 86400000).toISOString().slice(0, 10)
    res.status(201).json({ id: await insert(row.type, data, row.parent_id, row.client_id) })
  }))

  app.post('/api/docs/:id/convert', withDocument(async (row, req, res) => {
    const to = String(req.body?.to ?? '') as DocType
    if (!CONVERSIONS[row.type as DocType]?.includes(to)) return fail(res, 400, 'That conversion is not available')
    if (row.type === 'quote' && to === 'agreement' && row.status !== 'Accepted') return fail(res, 409, 'Mark the quote as accepted before creating an agreement from it')
    if (row.type === 'info_form' && !row.signed_at) return fail(res, 409, 'The form must be completed and signed first')
    if (to === 'debt' && totals(row.data).balance === 0) return fail(res, 409, 'This invoice has nothing outstanding')
    res.status(201).json({ id: await insert(to, convertData(record(row), to, await sectionsFor(to)), row.id, row.client_id) })
  }))

  app.post('/api/docs/:id/payments', withDocument(async (row, req, res) => {
    if (row.type !== 'invoice') return fail(res, 400, 'Payments are recorded against invoices')
    const { date, amountCents, method, bankCharges = 0 } = req.body ?? {}
    if (!Number.isInteger(bankCharges) || bankCharges < 0) return fail(res, 400, 'Bank charges must be zero or more')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || Number.isNaN(Date.parse(date))) return fail(res, 400, 'Enter the payment date')
    if (!['EFT', 'Card', 'Cash', 'SnapScan', 'Other'].includes(method)) return fail(res, 400, 'Choose a payment method')
    const balance = totals(row.data).balance
    if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > balance) return fail(res, 400, `Enter an amount up to the balance of ${money(balance)}`)
    const data: DocData = { ...row.data, payments: [...row.data.payments, { date, amountCents, method, bankCharges }] }
    if (!(await save(row, { data, status: 'Sent' }))) return fail(res, 409, CHANGED)
    await log(row.id, totals(data).balance === 0 ? 'Paid in full' : 'Payment recorded', `${money(amountCents)} by ${method}`)
    res.status(201).json({ balanceCents: totals(data).balance })
  }))

  app.delete('/api/docs/:id/payments/:index', withDocument(async (row, req, res) => {
    const index = Number(req.params.index)
    const payment = row.data.payments[index]
    if (!payment) return fail(res, 404, 'Payment not found')
    const data: DocData = { ...row.data, payments: row.data.payments.filter((_: unknown, i: number) => i !== index) }
    if (!(await save(row, { data }))) return fail(res, 409, CHANGED)
    await log(row.id, 'Payment removed', money(payment.amountCents))
    res.status(204).end()
  }))

  app.get('/api/docs/:id/pdf', withDocument(async (row, _req, res) => sendPdf(res, row, await pdfFor(row))))

  app.post('/api/docs/:id/link', withDocument(async (row, _req, res) => {
    const path = await createLink(row)
    await log(row.id, 'Sent', 'Client link created')
    res.status(201).json({ path, days: LINK_DAYS })
  }))

  app.delete('/api/docs/:id/link', withDocument(async (row, _req, res) => {
    await db.query('update public.business_documents set share_token_hash = null, share_expires_at = null where id = $1', [row.id])
    await log(row.id, 'Client link cancelled')
    res.status(204).end()
  }))

  app.post('/api/docs/:id/email', withDocument(async (row, req, res) => {
    if (!emailConfigured()) return fail(res, 503, 'Email isn’t set up yet. Add RESEND_API_KEY and EMAIL_FROM to the server settings.')
    const to = String(req.body?.to ?? row.data.client.email).trim()
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to)) return fail(res, 400, 'Enter one valid email address')
    const message = String(req.body?.message ?? '').slice(0, 3000)
    const brand = await getBrand()
    const path = await createLink(row)
    const fresh = (await find(row.id))!
    const meta = DOC_TYPES[row.type as DocType]
    const signing = meta.signable && !fresh.signed_at
    const base = (process.env.APP_URL || `https://${brand.website}`).replace(/\/$/, '')
    const label = meta.label.toLowerCase()
    await sendEmail({
      to, subject: `${meta.label} ${fresh.reference} from NextWave Digital Solutions`,
      html: emailHtml(brand, { greeting: `Hello ${row.data.client.name || 'there'},`, message: message || `Please find your ${label} (${fresh.reference}) attached.`, button: { label: signing ? (row.type === 'info_form' ? 'Complete the form' : 'Review and sign') : 'View online', url: base + path } }),
      attachment: { filename: fileName(record(fresh)), content: await pdfFor(fresh) },
    })
    await log(row.id, 'Emailed', to)
    res.json({ ok: true })
  }))

  app.get('/api/docs-settings', admin(async (_req, res) => res.json({ brand: await getBrand(), emailConfigured: emailConfigured() })))
  app.put('/api/docs-settings', admin(async (req, res) => {
    await saveSetting('brand', cleanBrand(req.body?.brand, await getBrand()))
    res.json({ ok: true })
  }))
  app.get('/api/docs-templates', admin(async (_req, res) => {
    const out: Record<string, unknown> = {}
    for (const type of Object.keys(DOC_TYPES) as DocType[]) {
      const found = await db.query('select value from public.document_settings where key = $1', [`template:${type}`])
      out[type] = { sections: found.rows[0]?.value?.sections ?? DEFAULT_SECTIONS[type], customised: !!found.rows[0] }
    }
    res.json(out)
  }))
  app.put('/api/docs-templates/:type', admin(async (req, res) => {
    const type = String(req.params.type)
    if (!isDocType(type)) return fail(res, 404, 'Unknown document type')
    await saveSetting(`template:${type}`, { sections: cleanSections(req.body?.sections) })
    res.json({ ok: true })
  }))
  app.delete('/api/docs-templates/:type', admin(async (req, res) => {
    await db.query('delete from public.document_settings where key = $1', [`template:${String(req.params.type)}`])
    res.status(204).end()
  }))

  // ---- Public client links. The token is the only credential, and it travels in the request body. ----
  const withLink = (handler: (row: Row, req: Request, res: Response) => Promise<unknown>) => route(async (req, res) => {
    const token = String(req.body?.token ?? '')
    const found = token.length >= 32 ? await db.query('select * from public.business_documents where share_token_hash = $1 and share_expires_at > $2', [hashToken(token), new Date().toISOString()]) : { rows: [] }
    if (!found.rows[0]) return fail(res, 404, 'This link has expired or is no longer valid. Ask NextWave for a new one.')
    return handler(found.rows[0], req, res)
  })

  app.post('/api/sign/view', withLink(async (row, _req, res) => {
    const recent = await db.query("select id from public.document_events where document_id = $1 and action = 'Viewed' and created_at > $2", [row.id, new Date(Date.now() - 3600000).toISOString()])
    if (!recent.rows.length) await log(row.id, 'Viewed', 'Opened through the client link')
    const doc = record(row)
    const brand = row.data.brandSnapshot ?? (await getBrand())
    const meta = DOC_TYPES[doc.type]
    res.json({
      type: doc.type, reference: doc.reference, label: meta.label, version: row.version, signed: !!row.signed_at,
      canSign: meta.signable && !row.signed_at && !['Declined', 'Expired'].includes(displayStatus(doc)),
      name: doc.data.client.name, html: renderDocument(doc, brand, { preview: true }),
    })
  }))

  app.post('/api/sign/pdf', withLink(async (row, _req, res) => sendPdf(res, row, await pdfFor(row))))

  app.post('/api/sign/submit', withLink(async (row, req, res) => {
    const type = row.type as DocType
    const doc = record(row)
    if (!DOC_TYPES[type].signable) return fail(res, 400, 'This document does not need a signature')
    if (row.signed_at) return fail(res, 409, 'This document has already been signed')
    if (['Declined', 'Expired'].includes(displayStatus(doc))) return fail(res, 409, 'This document can no longer be signed')
    const body = req.body ?? {}
    if (body.version !== row.version) return fail(res, 409, 'The document was updated. Reload the page and read it again before signing.')
    const name = String(body.name ?? '').trim().slice(0, 120)
    const idNumber = String(body.idNumber ?? '').trim().slice(0, 60)
    const place = String(body.place ?? '').trim().slice(0, 120)
    const typed = String(body.typed ?? '').trim().slice(0, 120)
    const drawn = String(body.drawn ?? '')
    if (!name || !place) return fail(res, 400, 'Enter your full name and the place of signing')
    if (drawn && !(drawn.length < 400_000 && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(drawn))) return fail(res, 400, 'The drawn signature could not be read')
    if (!typed && !drawn) return fail(res, 400, 'Type or draw your signature')
    if (body.consent !== true) return fail(res, 400, 'Confirm that you have read the document and agree to sign electronically')
    const data: DocData = { ...row.data, fields: { ...row.data.fields } }
    if (type === 'info_form') {
      for (const [key, label, required] of FORM_QUESTIONS) {
        const value = String(body.answers?.[key] ?? '').trim().slice(0, 1000)
        if (required && !value) return fail(res, 400, `Please answer: ${label}`)
        data.fields[`form_${key}`] = value
      }
      if (body.popiaConsent !== true) return fail(res, 400, 'POPIA consent is required to submit the form')
      data.fields.popia_consent = 'yes'
      data.fields.child_consent = body.childConsent === true ? 'yes' : 'no'
      data.client = { ...data.client, name: data.fields.form_full_name, idNumber: data.fields.form_id_number, address: data.fields.form_address, email: data.fields.form_email, phone: data.fields.form_phone }
    }
    const brand = await getBrand()
    data.clientSignature = { name, idNumber, place, ...(drawn ? { drawn } : { typed }), at: new Date().toISOString(), ip: clientIp(req) }
    data.brandSnapshot = brand
    const status = type === 'quote' ? 'Accepted' : 'Signed'
    // The PDF is produced first, so a document is never marked signed without its signed copy.
    const pdf = await makePdf(renderDocument({ ...doc, status, data }, brand))
    const result = await db.query(
      'update public.business_documents set data = $1, status = $2, signed_at = now(), signed_pdf = $3, version = version + 1, updated_at = now() where id = $4 and version = $5 and signed_at is null returning id',
      [JSON.stringify(data), status, pdf.toString('base64'), row.id, row.version])
    if (!result.rows.length) return fail(res, 409, 'The document changed while you were signing. Reload and try again.')
    await sync(row.id)
    await log(row.id, 'Signed', `By ${name}`)
    res.json({ ok: true })
  }))

  app.use(['/api/docs', '/api/sign'], (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof InvalidDocument) return fail(res, 400, error.message)
    next(error)
  })
}
