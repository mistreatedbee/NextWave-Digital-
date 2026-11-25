import crypto from 'node:crypto'
import type { Express, NextFunction, Request, RequestHandler, Response } from 'express'
import { buildAlerts } from '../shared/alerts.js'
import { Brand, DEFAULT_BRAND, longDate, money, todaySA } from '../shared/documents/model.js'
import { esc } from '../shared/documents/render.js'
import { emailConfigured, emailHtml, sendEmail } from './documents/email.js'
import type { Account } from './permissions.js'
import type { Db } from './app.js'

type Guard = (handler: (user: Account, req: Request, res: Response) => Promise<unknown>, roles?: Account['role'][]) => RequestHandler
const REPEAT_DAYS = 7

export function reminderRoutes(app: Express, db: Db, signedIn: Guard, send = sendEmail) {
  const brandNow = async (): Promise<Brand & { autoRemind?: boolean }> => ({ ...DEFAULT_BRAND, ...(await db.query("select value from public.document_settings where key = 'brand'")).rows[0]?.value })

  /** The wording of a payment reminder, used for both email and WhatsApp. */
  async function reminderFor(id: string) {
    const invoice = (await db.query('select * from public.invoices where id = $1', [id])).rows[0]
    if (!invoice) return null
    const owing = Number(invoice.amount) - Number(invoice.paid || 0)
    if (!['Issued', 'Partial'].includes(invoice.status) || owing <= 0) return null
    const brand = await brandNow()
    const client = (await db.query('select * from public.clients where lower(company) = $1 or lower(name) = $1 limit 1', [String(invoice.client).toLowerCase()])).rows[0]
    const doc = (await db.query('select reference, data from public.business_documents where id = $1', [id])).rows[0]
    const reference = doc?.reference ?? invoice.id
    const due = invoice.due ? String(invoice.due instanceof Date ? invoice.due.toISOString() : invoice.due).slice(0, 10) : ''
    const late = due && due < todaySA()
    const bank = brand.accountNumber ? `\n\nBank: ${brand.bank}\nAccount holder: ${brand.accountHolder}\nAccount number: ${brand.accountNumber}\nBranch code: ${brand.branchCode}\nReference: ${reference}` : ''
    const message = `This is a friendly reminder that ${money(owing * 100)} on invoice ${reference} ${due ? `${late ? 'was' : 'is'} due on ${longDate(due)}` : 'is outstanding'}.${bank}\n\n${brand.proofLine}\n\nIf you have already paid, thank you, and please ignore this message.`
    return {
      invoice, brand, reference, message, name: String(doc?.data?.client?.name || client?.name || invoice.client),
      email: String(doc?.data?.client?.email || client?.email || ''), phone: String(doc?.data?.client?.phone || client?.phone || ''),
      subject: `${late ? 'Overdue payment' : 'Payment reminder'}: invoice ${reference}`,
    }
  }
  type Reminder = NonNullable<Awaited<ReturnType<typeof reminderFor>>>
  async function deliver(r: Reminder, actor: string) {
    await send({ to: r.email, subject: r.subject, html: emailHtml(r.brand, { greeting: `Hello ${r.name},`, message: r.message }) })
    await db.query('update public.invoices set last_reminder = $1 where id = $2', [todaySA(), r.invoice.id])
    await db.query('insert into public.audit_log (actor, action, entity, entity_id, summary) values ($1, $2, $3, $4, $5)', [actor, 'Sent payment reminder', 'invoices', r.invoice.id, ''])
  }

  app.get('/api/reminders/:id', signedIn(async (_user, req, res) => {
    const r = await reminderFor(String(req.params.id))
    if (!r) return res.status(404).json({ error: 'Nothing is outstanding on that invoice' })
    res.json({ message: `Hello ${r.name},\n\n${r.message}\n\n${r.brand.signatoryName}\n${r.brand.company}`, email: r.email, phone: r.phone, emailConfigured: emailConfigured() })
  }, ['admin']))

  app.post('/api/reminders/:id', signedIn(async (user, req, res) => {
    if (!emailConfigured()) return res.status(503).json({ error: 'Email isn’t set up yet. Use WhatsApp or copy the message instead.' })
    const r = await reminderFor(String(req.params.id))
    if (!r) return res.status(404).json({ error: 'Nothing is outstanding on that invoice' })
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(r.email)) return res.status(400).json({ error: 'Add an email address to this client first' })
    await deliver(r, user.name)
    res.json({ ok: true })
  }, ['admin']))

  /** Runs once a day (see vercel.json). Emails you a summary and, if enabled, reminds late payers weekly. */
  app.get('/api/cron/reminders', (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.CRON_SECRET
    const given = Buffer.from(String(req.headers.authorization ?? ''))
    const expected = Buffer.from(`Bearer ${secret}`)
    if (!secret || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return res.status(401).json({ error: 'Not allowed' })
    ;(async () => {
      if (!emailConfigured()) return res.json({ sent: 0, reason: 'Email is not configured' })
      const rows = async (table: string) => (await db.query(`select * from public.${table}`)).rows
      const source = Object.fromEntries(await Promise.all(['invoices', 'jobs', 'work_log', 'tasks', 'domains', 'approvals', 'help_requests'].map(async (t) => [t, await rows(t)])))
      const alerts = buildAlerts(source, todaySA())
      const brand = await brandNow()
      let clientsReminded = 0
      if (brand.autoRemind) {
        const cutoff = new Date(Date.parse(todaySA()) - REPEAT_DAYS * 86400000).toISOString().slice(0, 10)
        const late = await db.query("select id from public.invoices where status in ('Issued', 'Partial') and due < $1 and (last_reminder is null or last_reminder <= $2) limit 40", [todaySA(), cutoff])
        for (const { id } of late.rows) {
          const r = await reminderFor(id)
          if (r?.email) { try { await deliver(r, 'Automatic reminder'); clientsReminded++ } catch (error) { console.error(error) } }
        }
      }
      if (alerts.length) {
        const list = alerts.slice(0, 40).map((a) => `• ${a.title}: ${a.body}`).join('\n')
        await send({ to: brand.email, subject: `NextWave: ${alerts.length} item(s) need attention`, html: emailHtml(brand, { greeting: 'Good morning,', message: `${list}${clientsReminded ? `\n\n${clientsReminded} client(s) were sent a payment reminder.` : ''}` }) })
      }
      res.json({ alerts: alerts.length, clientsReminded })
    })().catch(next)
  })
}
