// Turns a document into self-contained HTML. The on-screen preview and the PDF export both
// use this output, including the script that splits it into A4 pages, so they cannot differ.
import { FONT_CSS, LOGO } from './assets.generated.js'
import { Brand, displayStatus, DOC_TYPES, DocRecord, longDate, money, Party, randInWords, Signature, totals } from './model.js'
import { FORM_QUESTIONS } from './templates.js'

export const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const nl = (v: unknown) => esc(v).replace(/\n/g, '<br>')
const inline = (v: string) => esc(v).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
const block = (html: string, cls = '') => `<div class="blk ${cls}">${html}</div>`

function placeholders(doc: DocRecord, brand: Brand) {
  const { data } = doc
  const f = data.fields
  const t = totals(data)
  const amount = Number(f.amount_owed_cents) || t.balance
  const cents = (key: string) => (f[key] ? money(Number(f[key])) : '')
  const direction = f.mode === 'one-way'
    ? 'This Agreement is **one-way**: the Company is the Discloser and the Partner is the Recipient.'
    : 'This Agreement is **mutual**: the duties below apply to each Party whenever it receives information from the other.'
  const values: Record<string, string> = {
    company_name: brand.company, company_reg: brand.regNo, company_address: brand.address, signatory: brand.signatoryName,
    client_name: data.client.name, client_company: data.client.company, client_id_or_reg: data.client.idNumber, client_address: data.client.address,
    client_email: data.client.email, client_phone: data.client.phone, project_name: data.projectName,
    issue_date: longDate(data.issueDate), due_date: longDate(data.dueDate), start_date: longDate(f.start_date), sign_by: longDate(f.sign_by),
    total_fee: cents('total_fee_cents') || money(t.total), deposit: cents('deposit_cents') || money(Math.round(t.total / 2)),
    amount_owed: money(amount), amount_words: randInWords(amount), standard_value: cents('standard_value_cents') || money(t.standard), direction,
  }
  return { ...f, ...values }
}

type Context = { doc: DocRecord; brand: Brand; vars: Record<string, string> }
/** Missing values are highlighted so an unfinished document can't be mistaken for a finished one. */
const fill = (html: string, ctx: Context, depth = 0): string => html.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/g, (_m, key: string) => {
  const value = ctx.vars[key]
  if (!value) return `<span class="todo">[${esc(key.replace(/_/g, ' ').toUpperCase())}]</span>`
  if (depth) return esc(value)
  return fill(inline(value).replace(/\n/g, '<br>'), ctx, depth + 1)
})

function table(head: string[], rows: string[][], cls = '', widths: number[] = []) {
  const cols = widths.length ? `<colgroup>${widths.map((w) => `<col style="width:${w}%">`).join('')}</colgroup>` : ''
  return `<table class="blk split ${cls}">${cols}<thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr${r[0]?.startsWith('<!--') ? ` class="${r[0].slice(4, -3)}"` : ''}>${(r[0]?.startsWith('<!--') ? r.slice(1) : r).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`
}

function partiesTable({ doc, brand }: Context) {
  const c = doc.data.client
  const todo = '<span class="todo">To be completed</span>'
  const v = (x: string) => (x ? esc(x) : todo)
  return table(['Details', 'Service provider', 'Client'], [
    ['<b>Name</b>', esc(brand.company), v(c.name)], ['<b>Company</b>', '—', esc(c.company || '—')], ['<b>Reg. / ID number</b>', esc(brand.regNo), v(c.idNumber)],
    ['<b>Address</b>', esc(brand.address), v(c.address)], ['<b>Email</b>', esc(brand.email), v(c.email)], ['<b>Phone</b>', esc(brand.phone), v(c.phone)],
    ['<b>Represented by</b>', `${esc(brand.signatoryName)}, ${esc(brand.signatoryTitle)}`, v(c.name)],
  ], 'grid', [22, 39, 39])
}

function bankingCard({ doc, brand }: Context, big = true) {
  const t = totals(doc.data)
  const f = doc.data.fields
  const isDebt = doc.type === 'debt'
  const reference = f.payment_reference || (doc.type === 'invoice' ? doc.reference : doc.data.client.company || doc.data.client.name.split(' ').pop() || doc.reference)
  const amount = isDebt ? Number(f.amount_owed_cents) || t.balance : doc.type === 'quote' ? t.total : t.balance
  const payBy = [isDebt ? f.pay_by_time : '', longDate(doc.data.dueDate)].filter(Boolean).join(', ')
  const cell = (l: string, v: string) => `<div><small>${l}</small><b>${v ? esc(v) : '<span class="todo">[SET IN SETTINGS]</span>'}</b></div>`
  return block(`<div class="bank"><div class="bankhead"><span>Banking details</span><em>EFT payment</em></div>
    ${big ? `<small>Account number</small><div class="acct">${brand.accountNumber ? esc(brand.accountNumber) : '<span class="todo">[SET IN SETTINGS]</span>'}</div>` : ''}
    <div class="bankgrid">${big ? '' : cell('Account number', brand.accountNumber)}${cell('Account holder', brand.accountHolder)}${cell('Bank', brand.bank)}${cell('Account type', brand.accountType)}${cell('Branch code', brand.branchCode)}${cell('Reference', reference)}${doc.type === 'invoice' || isDebt ? cell('Amount', money(amount)) + cell('Pay by', payBy) : ''}</div>
    <p>${esc(brand.proofLine)}</p></div>`)
}

function itemsTable(ctx: Context) {
  const { data } = ctx.doc
  const t = totals(data)
  const showStandard = ctx.doc.type === 'invoice' || data.items.some((i) => i.standardCents && i.standardCents !== i.unitCents)
  const head = ['Description', 'Qty', ...(showStandard ? ['Standard value'] : []), 'Unit price', 'Amount']
  const rows = data.items.map((i) => [nl(i.description), String(i.qty), ...(showStandard ? [money(Math.round(i.qty * (i.standardCents || i.unitCents)))] : []), money(i.unitCents), money(t.line(i))])
  return table(head, rows.length ? rows : [head.map((_h, n) => (n ? '' : '<span class="todo">[ADD LINE ITEMS]</span>'))], 'items', showStandard ? [38, 8, 18, 18, 18] : [52, 10, 19, 19])
}

function totalsBlock(ctx: Context, finalLabel: string, finalValue: number, once = false) {
  const { data } = ctx.doc
  const t = totals(data)
  const row = (l: string, v: string, cls = '') => `<div class="trow ${cls}"><span>${l}</span><b>${v}</b></div>`
  return `<div class="totals">${t.standard !== t.subtotal ? row('Standard value', money(t.standard)) : ''}${row('Subtotal', money(t.subtotal))}${t.discount ? row('Discount', `−${money(t.discount).replace('−', '')}`, 'save') : ''}${data.vatOn ? row('VAT (15%)', money(t.vat)) : ''}${ctx.doc.type === 'invoice' || ctx.doc.type === 'debt' ? row('Total', money(t.total)) + row('Paid to date', money(t.paid)) : ''}${row(finalLabel + (once ? ' <i>once-off</i>' : ''), money(finalValue), 'grand')}</div>`
}
const savings = (ctx: Context) => {
  const t = totals(ctx.doc.data)
  return t.saved ? block(`<div class="lime"><p>Standard value ${money(t.standard)} → Discount −${money(t.saved)} → Total ${money(t.standard - t.saved)}</p><p class="big">You save ${money(t.saved)} (${t.savedPct}% off the standard value)</p></div>`) : ''
}

function signatureBox(title: string, rows: [string, string][], note = '') {
  return `<div class="sig"><div class="sighead">${esc(title)}</div><div class="sigbody">${rows.map(([l, v]) => `<div class="sline ${l === 'Signature' ? 'tall' : ''}"><small>${l}</small><span>${v}</span></div>`).join('')}${note ? `<p class="note">${note}</p>` : ''}</div></div>`
}
function signatureValue(sig: Signature | undefined) {
  if (!sig) return ''
  if (sig.drawn && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(sig.drawn)) return `<img class="drawn" src="${sig.drawn}" alt="Signature">`
  return `<span class="typed">${esc(sig.typed ?? sig.name)}</span>`
}
function signatures(ctx: Context) {
  const { doc, brand } = ctx
  const { data } = doc
  const c = data.client
  const party = DOC_TYPES[doc.type].party
  const signed = data.companySignedOn
  const company = signatureBox('Service provider', [
    ['Name', esc(brand.signatoryName)], ['Capacity', `${esc(brand.signatoryTitle)}, duly authorised`], ['ID / Reg. no.', esc(brand.regNo)],
    ['Signature', signed ? `<span class="typed">${esc(brand.signatoryName)}</span>` : ''], ['Date', longDate(signed ?? '')], ['Place', signed ? 'Signed electronically' : ''],
  ], signed ? `Signed electronically by ${esc(brand.signatoryName)}, ${esc(brand.signatoryTitle)}, on ${longDate(signed)}` : '')
  const s = data.clientSignature
  const signedAt = s ? new Date(new Date(s.at).getTime() + 2 * 3600000).toISOString() : ''
  const client = signatureBox(party, [
    ['Name', esc(s?.name ?? c.name)], ['Capacity', esc(c.company ? `For ${c.company}` : 'In personal capacity')], ['ID / Reg. no.', esc(s?.idNumber || c.idNumber)],
    ['Signature', signatureValue(s)], ['Date', longDate(signedAt)], ['Place', esc(s?.place ?? '')],
  ], s ? `Signed electronically by ${esc(s.name)} on ${longDate(signedAt)} at ${signedAt.slice(11, 16)} (SAST)${s.ip ? `, IP address ${esc(s.ip)}` : ''}` : '')
  const witness = (who: string) => signatureBox(`Witness – ${who} (optional)`, [['Name', ''], ['Signature', ''], ['Date', '']])
  if (doc.type === 'info_form') return block(`<div class="sigs one compact">${signatureBox(party, [['Signature', signatureValue(s)], ['Date', longDate(signedAt)]], s ? `Signed electronically by ${esc(s.name)} on ${longDate(signedAt)}${s.ip ? `, IP address ${esc(s.ip)}` : ''}` : '')}</div>`)
  return block(`<div class="sigs">${company}${client}</div>`) + (data.witnesses ? block(`<div class="sigs">${witness('service provider')}${witness(party.toLowerCase())}</div>`) : '')
}

function formTable({ doc }: Context) {
  const f = doc.data.fields
  return table(['Details', 'Your answer'], FORM_QUESTIONS.map(([key, label]) => [`<b>${esc(label)}</b>`, nl(f[`form_${key}`] ?? '')]), 'form', [44, 56])
}

function commissionTable() {
  return table(['Work type', 'Partner', 'NextWave'], [
    ['Standard Job (R500 or less)', '100%', '0%'], ['Independent Work', '80%', '20%'], ['Assisted Work', '50%', '50%'],
    ['Major Project (above R10,000): partner finds the client only', '20% to 30%', '70% to 80%'], ['Major Project: partner also delivers part of the work', '40% to 50%', '50% to 60%'],
  ], 'grid', [60, 20, 20])
}

function invoiceSection(ctx: Context) {
  const { data } = ctx.doc
  const t = totals(data)
  const f = ctx.vars
  const meta = table(['Details', 'Invoice', 'Project'], [[
    '<b>Number</b><br><b>Invoice date</b><br><b>Billed to</b>',
    `${esc(f.invoice_reference || '—')}<br>${longDate(f.invoice_date) || '—'}<br>${esc(data.client.name)}`,
    `<b>${esc(data.projectName)}</b><br>${esc([data.client.company, data.client.email, data.client.phone].filter(Boolean).join(' | '))}`,
  ]], 'grid', [20, 30, 50])
  return meta + itemsTable(ctx) + block(totalsBlock(ctx, 'Total due', Number(data.fields.amount_owed_cents) || t.balance)) + savings(ctx) + bankingCard(ctx)
}

function special(token: string, ctx: Context) {
  const [name, arg] = token.split(':')
  if (name === 'parties') return partiesTable(ctx)
  if (name === 'banking') return bankingCard(ctx, false)
  if (name === 'signatures') return signatures(ctx)
  if (name === 'commission') return commissionTable()
  if (name === 'form') return formTable(ctx)
  if (name === 'invoice') return invoiceSection(ctx)
  if (name === 'strip') {
    const f = ctx.doc.data.fields
    return block(`<div class="strip"><div><small>Amount owed</small><b>${ctx.vars.amount_owed}</b></div><div><small>Pay-by deadline</small><b>${esc(f.pay_by_time ?? '')} ${longDate(ctx.doc.data.dueDate)}</b></div><div><small>Signing deadline</small><b>${longDate(f.sign_by) || '—'}</b></div></div>`)
  }
  if (name === 'tick') return block(`<p class="tick">${ctx.doc.data.fields[arg] === 'yes' ? '☒' : '☐'} Yes, I agree</p>`)
  return ''
}

/** Converts section markup into page blocks. */
function markup(body: string, ctx: Context, numbered: string) {
  let out = ''
  let clause = 0
  for (const chunk of body.replace(/\r/g, '').split(/\n{2,}/)) {
    let text = chunk.trim()
    if (!text) continue
    const tokens: string[] = []
    text = text.replace(/\[\[([a-z_]+(?::[a-z_]+)?)\]\]/g, (_m, t: string) => { tokens.push(t); return '' }).trim()
    if (text.startsWith('!! ')) out += block(`<div class="dark"><small>Important</small><p>${fill(inline(text.slice(3)), ctx).replace(/\n/g, '<br>')}</p></div>`)
    else if (text.startsWith('++ ')) out += block(`<div class="lime"><p>${fill(inline(text.slice(3)), ctx).replace(/\n/g, '<br>')}</p></div>`)
    else if (text) {
      // A chunk that is a single placeholder may expand into several paragraphs or bullets.
      const only = /^\{\{\s*([a-z0-9_]+)\s*\}\}$/.exec(text)
      if (only && /\n/.test(ctx.vars[only[1]] ?? '')) { out += markup(ctx.vars[only[1]], ctx, ''); }
      else {
        let para: string[] = []
        const flush = () => {
          if (!para.length) return
          const number = numbered && !numbered.startsWith('0') ? `<span class="num">${numbered}.${++clause}</span>` : ''
          out += block(`${number}<p>${fill(inline(para.join('\n')), ctx).replace(/\n/g, '<br>')}</p>`, number ? 'clause' : '')
          para = []
        }
        for (const line of text.split('\n')) {
          const bullet = /^(-|\d+\.)\s+(.*)$/.exec(line.trim())
          if (bullet) { flush(); out += block(`<span class="mark">${bullet[1] === '-' ? '' : esc(bullet[1])}</span><p>${fill(inline(bullet[2]), ctx)}</p>`, `li ${bullet[1] === '-' ? 'bullet' : 'ordered'}`) }
          else para.push(line)
        }
        flush()
      }
    }
    for (const token of tokens) {
      // A signature box must not be separated from the sentence that introduces it.
      if (token === 'signatures') out = out.replace(/<div class="blk (?!keep)([^"]*)">((?:(?!<div class="blk)[\s\S])*)$/, '<div class="blk keep $1">$2')
      out += special(token, ctx)
    }
  }
  return out
}

const heading = (n: number, title: string, ctx: Context) => `<div class="blk keep h">${n ? `<span class="badge">${n}</span>` : ''}<h2>${fill(esc(title), ctx)}</h2></div>`

function cover(ctx: Context) {
  const { doc, brand, vars } = ctx
  const meta = DOC_TYPES[doc.type]
  const c = doc.data.client
  const amount = doc.type === 'debt' ? `${vars.amount_owed} by ${esc(doc.data.fields.pay_by_time ?? '')} ${longDate(doc.data.dueDate)}`
    : doc.type === 'agreement' ? vars.total_fee : doc.type === 'quote' || doc.type === 'invoice' ? money(totals(doc.data).total) : ''
  const ref = (l: string, v: string) => `<div class="cref"><small>${l}</small><span>${v}</span></div>`
  const who = c.name ? esc(c.name) : `<span class="todo">[${meta.party.toUpperCase()} NAME]</span>`
  return `<div class="page cover"><div class="bar top"></div><img class="logo" src="${LOGO}" alt="NextWave">
    <div class="label">${meta.legal ? 'Confidential' : 'Proposal'}</div>
    <h1><span>${esc(meta.title[0])}</span><span class="l">${esc(meta.title[1])}</span></h1><div class="short"></div>
    <p class="sub">${esc(doc.data.fields.cover_subtitle || meta.subtitle)}</p>
    <p class="for">Prepared for ${who}${c.company ? ` | ${esc(c.company)}` : ''}</p>
    <div class="card"><b>${esc(brand.company)}</b><em>${esc(brand.tagline.replace(/\.\s*/g, ' • ').replace(/ • $/, ''))}</em><p>${esc(brand.address)}<br>Registration No.: ${esc(brand.regNo)}<br>${esc(brand.phone)} | ${esc(brand.email)} | ${esc(brand.website)}</p></div>
    <div class="refs">${ref('Reference', esc(doc.reference))}${ref('Company', esc(brand.company))}${ref(meta.party, who + (c.company ? ` | ${esc(c.company)}` : ''))}${amount ? ref('Amount', amount) : ''}${ref('Date', longDate(doc.data.issueDate))}</div>
    ${meta.legal ? '<p class="notice">This document contains legally binding obligations. Please read it carefully before signing.</p>' : ''}<div class="bar bottom"></div></div>`
}

function clientBlock(c: Party) {
  const lines = [c.company, c.company ? `Attention: ${c.name}` : '', c.address, c.email, c.phone, c.idNumber ? `ID / Reg. No.: ${c.idNumber}` : '', c.vatNumber ? `VAT No.: ${c.vatNumber}` : ''].filter(Boolean)
  return `<div class="who"><small>Prepared for</small><b>${esc(c.company ? c.company : c.name) || '<span class="todo">[CLIENT]</span>'}</b>${lines.slice(c.company ? 1 : 0).map((l) => `<span>${esc(l)}</span>`).join('')}</div>`
}

function quoteBody(ctx: Context) {
  const { doc } = ctx
  const { data } = doc
  const t = totals(data)
  const sec = (id: string) => data.sections.find((x) => x.id === id)
  const part = (id: string) => { const x = sec(id); return x ? heading(0, x.title, ctx) + markup(x.body, ctx, '') : '' }
  const rest = data.sections.filter((x) => !['timeline', 'included', 'terms', 'validity'].includes(x.id)).map((x) => heading(0, x.title, ctx) + markup(x.body, ctx, '')).join('')
  return block(`<div class="dochead"><div><h1>Quotation</h1><p>${esc(doc.reference)}</p></div><div class="dates"><span>Date <b>${longDate(data.issueDate)}</b></span><span>Valid until <b>${longDate(data.dueDate)}</b></span></div></div>`)
    + block(clientBlock(data.client))
    + (data.projectName || data.summary ? heading(0, data.projectName || 'Project summary', ctx) + (data.summary ? markup(data.summary, ctx, '') : '') : '')
    + itemsTable(ctx) + block(totalsBlock(ctx, 'Total (ZAR)', t.total, true)) + savings(ctx)
    + (data.recurring.length ? heading(0, 'Recurring costs', ctx) + table(['Service', 'Terms'], data.recurring.map((r) => [esc(r.description), esc(r.terms)]), 'grid', [40, 60]) : '')
    + '<div class="break"></div>' + part('timeline') + part('included') + part('terms') + part('validity') + rest
    + block(`<div class="pay"><div class="payleft"><small>Total (ZAR), once-off</small><b>${money(t.total)}</b><span>Deposit to start: ${money(Math.round(t.total / 2))}</span></div>${bankingCard(ctx, true)}</div>`)
    + (data.clientSignature || data.companySignedOn ? heading(0, 'Acceptance', ctx) + signatures(ctx) : '')
}

function invoiceBody(ctx: Context) {
  const { doc, brand } = ctx
  const { data } = doc
  const t = totals(data)
  const status = displayStatus(doc)
  return block(`<div class="dochead"><div><h1>${data.vatOn ? 'Tax invoice' : 'Invoice'}</h1>${data.vatOn && brand.vatNumber ? `<p>VAT No. ${esc(brand.vatNumber)}</p>` : ''}<p>${esc(doc.reference)}</p></div><div class="dates"><span>Issued <b>${longDate(data.issueDate)}</b></span><span>Due <b>${longDate(data.dueDate)}</b></span><span>Status <b>${esc(status)}</b></span></div></div>`)
    + block(`<div class="two">${clientBlock(data.client).replace('Prepared for', 'Bill to')}<div class="who"><small>Project</small><b>${esc(data.projectName) || '<span class="todo">[PROJECT NAME]</span>'}</b><span>${nl(data.summary)}</span></div></div>`)
    + itemsTable(ctx)
    + block(`<div class="withstamp">${t.total > 0 && t.balance === 0 ? '<div class="stamp">PAID</div>' : ''}${totalsBlock(ctx, 'Balance due', t.balance)}</div>`)
    + savings(ctx)
    + (data.payments.length ? heading(0, 'Payments received', ctx) + table(['Date', 'Method', 'Amount'], data.payments.map((p) => [longDate(p.date), esc(p.method), money(p.amountCents)]), 'grid', [35, 40, 25]) : '')
    + bankingCard(ctx)
    + data.sections.map((x) => heading(0, x.title, ctx) + markup(x.body, ctx, '')).join('')
}

function sectionedBody(ctx: Context) {
  const { doc, brand } = ctx
  const intro = block(`<div class="title"><h1>${esc(DOC_TYPES[doc.type].title.join(' '))}</h1><p><b>${esc(brand.company.toUpperCase())}</b> | Registration No.: ${esc(brand.regNo)} | Ref: ${esc(doc.reference)} | ${longDate(doc.data.issueDate)}</p></div>`)
  let n = 0
  // The information form is a questionnaire, so its sections aren't numbered.
  if (doc.type === 'info_form') return intro + doc.data.sections.map((x) => markup(x.body, ctx, '')).join('')
  return intro + doc.data.sections.map((x) => { n++; return heading(n, x.title, ctx) + markup(x.body, ctx, String(n)) }).join('')
}

const CSS = `
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'NW Lato',sans-serif;font-size:9.6pt;line-height:1.5;color:#161616;background:#fff;font-kerning:normal}
h1,h2,b.i,.badge,th,.label,.sighead,small,.bankhead,.acct,.strip b,.trow.grand,.stamp{font-family:'NW Inter',sans-serif}
strong,b{font-weight:700}
.page{width:210mm;height:296.8mm;position:relative;overflow:hidden;background:#fff;break-after:page}
.page:last-child{break-after:auto}
.hdr{position:absolute;left:18mm;right:18mm;top:9mm;display:flex;justify-content:space-between;gap:8mm;font-family:'NW Inter';font-size:7pt;color:#444;border-bottom:.35mm solid #B5D300;padding-bottom:2mm}
.ftr{position:absolute;left:18mm;right:18mm;bottom:7mm;font-size:6.6pt;color:#555}
.ftr .line{display:flex;justify-content:space-between;gap:3mm;border-top:.35mm solid #B5D300;padding-top:2mm;white-space:nowrap}
.ftr .initials{text-align:right;font-size:7pt;margin:0 0 1.5mm}
.body{position:absolute;left:18mm;right:18mm;top:20mm;height:255mm;overflow:hidden}
.blk{margin-bottom:3mm;position:relative;display:flow-root}table.blk{display:table}
p{text-align:left}
.todo{background:#eef6b8;color:#4c5a00;padding:0 .8mm;font-weight:700}
.title h1,.dochead h1{font-size:19pt;font-weight:800;line-height:1.2}
.title{border-bottom:.6mm solid #B5D300;padding-bottom:3mm}
.title p{font-size:8.4pt;margin-top:1.5mm}
.dochead{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.6mm solid #B5D300;padding-bottom:3mm}
.dochead h1{text-transform:uppercase;letter-spacing:.04em;font-size:24pt}
.dates{display:flex;flex-direction:column;align-items:flex-end;font-size:8.6pt;color:#555}.dates b{color:#0A0A0A;margin-left:2mm}
.h{display:flex;align-items:center;gap:3mm;margin-top:4.5mm}
.h h2{font-size:11.5pt;font-weight:800;line-height:1.3}
.h:after{content:'';flex:1;height:.25mm;background:#dfeaa0}
.badge{background:#B5D300;color:#0A0A0A;font-weight:800;font-size:9pt;min-width:6.6mm;height:6.6mm;display:grid;place-items:center;padding:0 1mm}
.clause{display:flex;gap:3mm}.num{font-family:'NW Inter';font-weight:700;font-size:8.8pt;min-width:9mm;padding-top:.3mm}
.li{display:flex;gap:2.5mm;margin-bottom:1.4mm;padding-left:2mm}.li .mark{min-width:4mm}.li.bullet .mark:before{content:'';display:block;width:1.6mm;height:1.6mm;background:#B5D300;margin-top:2mm}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8.8pt;margin-bottom:3mm}
th{background:#0A0A0A;color:#fff;text-align:left;font-size:7.4pt;letter-spacing:.08em;text-transform:uppercase;padding:2.6mm 2.8mm;border-bottom:.6mm solid #B5D300;font-weight:700}
td{padding:2.1mm 2.8mm;border:.2mm solid #ddd;vertical-align:top;overflow-wrap:anywhere}
tbody tr:nth-child(even) td{background:#F4F4F4}
table.items td:not(:first-child),table.items th:not(:first-child){text-align:right;white-space:nowrap}
table.form{font-size:8.2pt;line-height:1.3}table.form td{padding-top:.9mm;padding-bottom:.9mm;height:6.2mm}.formdoc .title{padding-bottom:2mm}.formdoc .blk{margin-bottom:2mm}.formdoc .lime{padding:2.2mm 4mm;font-size:8.6pt}.formdoc .tick{font-size:9pt}.compact .sline.tall{min-height:11mm}.compact .sigbody{display:grid;grid-template-columns:1fr 1fr;gap:0 6mm}.compact .note{grid-column:1/-1}
.who{display:flex;flex-direction:column;background:#F4F4F4;padding:3.5mm 4mm;border-left:1mm solid #B5D300}.who b{font-size:11pt}.who span{font-size:8.8pt}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
small{display:block;font-size:6.6pt;letter-spacing:.18em;text-transform:uppercase;color:#6d6d6d;font-weight:700}
.totals{margin-left:auto;width:92mm}
.trow{display:flex;justify-content:space-between;padding:1.2mm 3mm;border-bottom:.2mm solid #e4e4e4}
.trow.save{color:#4f6b00;font-weight:700}
.trow.grand{background:#0A0A0A;color:#fff;font-weight:800;font-size:11pt;padding:3mm;border:0;margin-top:1mm}.trow.grand b{color:#B5D300}.trow.grand i{font-size:7pt;font-weight:600;font-style:normal;color:#bbb;text-transform:uppercase;letter-spacing:.1em;margin-left:2mm}
.withstamp{position:relative}.stamp{position:absolute;left:12mm;top:5mm;transform:rotate(-12deg);border:1.4mm solid #B5D300;color:#7e9400;font-size:30pt;font-weight:800;letter-spacing:.12em;padding:2mm 8mm;border-radius:2mm}
.lime{background:#f3f7dc;border-left:1.2mm solid #B5D300;padding:3.5mm 4.5mm}.lime .big{font-family:'NW Inter';font-weight:800;font-size:11pt;margin-top:1mm}
.dark{background:#0A0A0A;color:#fff;border-left:1.2mm solid #B5D300;padding:4mm 5mm}.dark small{color:#B5D300;margin-bottom:1.5mm}.dark strong{color:#B5D300}
.bank{background:#0A0A0A;color:#fff;border-left:1.2mm solid #B5D300;padding:4.5mm 5mm}
.bankhead{display:flex;justify-content:space-between;align-items:center;color:#B5D300;font-weight:800;font-size:8pt;letter-spacing:.2em;text-transform:uppercase;margin-bottom:3mm}
.bankhead em{font-style:normal;border:.25mm solid #B5D300;padding:.6mm 2mm;font-size:6.4pt;letter-spacing:.14em}
.acct{color:#B5D300;font-size:21pt;font-weight:800;letter-spacing:.08em;line-height:1.35;margin-bottom:2mm}
.bank small{color:#9a9a9a}.bankgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm 4mm}.bankgrid b{font-family:'NW Inter';font-size:8.8pt;overflow-wrap:anywhere}
.bank p{border-top:.2mm solid #333;margin-top:3.5mm;padding-top:2.5mm;font-size:7.8pt;color:#ccc}
.pay{display:grid;grid-template-columns:52mm 1fr;gap:4mm;align-items:stretch}.pay .blk{margin:0}.pay .bank{height:100%}.pay .bankgrid{grid-template-columns:1fr 1fr}
.payleft{background:#F4F4F4;border-top:1mm solid #B5D300;padding:4.5mm;display:flex;flex-direction:column;justify-content:center}.payleft b{font-family:'NW Inter';font-size:18pt;font-weight:800;margin:1mm 0}.payleft span{font-size:8.4pt}
.strip{display:grid;grid-template-columns:repeat(3,1fr);background:#0A0A0A;color:#fff}.strip div{padding:4mm}.strip small{color:#B5D300}.strip b{font-size:11pt;font-weight:800}
.sigs{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.sigs.one{grid-template-columns:1fr}
.sig{border:.25mm solid #d6d6d6}.sighead{background:#0A0A0A;color:#fff;font-weight:800;font-size:7.2pt;letter-spacing:.14em;text-transform:uppercase;padding:2.6mm 3.5mm;border-bottom:.6mm solid #B5D300}
.sigbody{padding:1.5mm 3.5mm 3.5mm}.sline{display:grid;grid-template-columns:23mm 1fr;align-items:end;gap:2mm;min-height:8mm}.sline span{border-bottom:.25mm solid #999;min-height:5.2mm;font-size:8.6pt;overflow-wrap:anywhere}.sline.tall{min-height:15mm}
.typed{font-family:'NW Inter';font-style:italic;font-weight:700;font-size:11pt}.drawn{max-height:13mm;max-width:100%;display:block}
.note{font-style:italic;font-size:7.2pt;color:#555;margin-top:2mm}
.tick{font-size:10pt}
.cover{background:#0A0A0A;color:#fff}.bar{position:absolute;left:0;right:0;height:6mm;background:#B5D300}.bar.top{top:0}.bar.bottom{bottom:0}
.cover .logo{position:absolute;left:19mm;top:24mm;width:44mm;height:44mm;border-radius:50%;object-fit:cover}
.cover>*:not(.bar):not(.logo){position:absolute;left:19mm;right:19mm}
.label{top:84mm;color:#B5D300;font-size:7.6pt;letter-spacing:.42em;text-transform:uppercase}
.cover h1{position:absolute;bottom:162mm;font-size:30pt;font-weight:800;line-height:1.13;display:flex;flex-direction:column}.cover h1 .l{color:#B5D300}
.short{top:141mm;height:1.8mm;background:#B5D300;right:auto!important;width:40mm}
.sub{top:150mm;max-width:135mm;color:#cfcfcf;font-size:10.5pt}
.for{top:168mm;font-size:10pt;font-weight:700}
.card{top:180mm}.card b{display:block;font-family:'NW Inter';font-size:12pt}.card em{display:block;font-style:normal;color:#B5D300;font-size:6.8pt;letter-spacing:.34em;text-transform:uppercase;margin:1mm 0 3mm}.card p{color:#9a9a9a;font-size:8.2pt}
.refs{bottom:30mm;border-top:.3mm solid #5f6f00;padding-top:4mm}.cref{display:grid;grid-template-columns:48mm 1fr;margin-bottom:1.6mm;align-items:baseline}.cref small{color:#808080}.cref span{font-size:8.8pt}
.notice{bottom:19mm;font-size:6.2pt;letter-spacing:.14em;text-transform:uppercase;color:#7d7d7d}
.cover .todo,.bank .todo{background:none;color:#B5D300;padding:0}
#pages{margin:0 auto;width:210mm}
@media screen{html.preview{background:#55575c;overflow-x:hidden}html.preview #pages{margin:0}html.preview .page{margin-bottom:6mm;box-shadow:0 2px 14px rgba(0,0,0,.35)}}
`

// Runs inside the preview frame and inside the PDF browser. Blocks flow into fixed-height pages;
// tables may split between rows, headings stay with what follows.
const PAGINATE = `(async function(){
  await Promise.all(['400','600','700','800'].map(function(w){return document.fonts.load(w+' 10px "NW Inter"')}).concat(['400','700','italic 400'].map(function(w){return document.fonts.load(w+' 10px "NW Lato"')})));
  await Promise.all(Array.from(document.images).map(function(i){return i.decode().catch(function(){})}));
  // A frame that hasn't been drawn yet measures everything as zero, so wait until it has a size.
  while(!document.documentElement.getBoundingClientRect().height){await new Promise(function(r){setTimeout(r,60)})}
  var src=document.getElementById('source'),out=document.getElementById('pages'),tpl=document.getElementById('chrome'),body;
  function page(){var p=tpl.content.firstElementChild.cloneNode(true);out.appendChild(p);body=p.querySelector('.body')}
  function over(){var last=body.lastElementChild;if(!last)return false;var mb=parseFloat(getComputedStyle(last).marginBottom)||0;return last.getBoundingClientRect().bottom-body.getBoundingClientRect().top-0.5>body.getBoundingClientRect().height+0*mb}
  function carry(){var moved=[];while(body.lastElementChild&&body.lastElementChild.classList.contains('keep')){moved.unshift(body.removeChild(body.lastElementChild))}page();moved.forEach(function(m){body.appendChild(m)})}
  page();
  Array.from(src.children).forEach(function(el){
    if(el.classList.contains('break')){if(body.children.length)page();return}
    body.appendChild(el);
    if(!over())return;
    body.removeChild(el);
    if(el.tagName==='TABLE'){
      var rows=Array.from(el.tBodies[0].rows),part;
      function shell(){var t=el.cloneNode(true);t.tBodies[0].innerHTML='';body.appendChild(t);return t}
      part=shell();
      rows.forEach(function(r){part.tBodies[0].appendChild(r);if(over()){part.tBodies[0].removeChild(r);if(!part.tBodies[0].rows.length){body.removeChild(part);carry()}else{page()}part=shell();part.tBodies[0].appendChild(r)}});
      return
    }
    if(body.children.length)carry();
    body.appendChild(el)
  });
  src.remove();
  var all=out.querySelectorAll('.page');all.forEach(function(p,i){var n=p.querySelector('.pn');if(n)n.textContent='Page '+(i+1)+' of '+all.length});
  // Zoom scales the finished pages for the screen without changing where they break.
  function fit(){if(!document.documentElement.classList.contains('preview'))return;var w=document.documentElement.clientWidth;if(w>0)out.style.zoom=Math.min(w/(210*96/25.4),1.4)}
  fit();addEventListener('resize',fit);
  window.__paginated=all.length;
})();`

export function renderDocument(doc: DocRecord, brand: Brand, options: { preview?: boolean } = {}) {
  const ctx: Context = { doc, brand, vars: {} }
  ctx.vars = placeholders(doc, brand)
  const meta = DOC_TYPES[doc.type]
  // Only a VAT vendor may call an invoice a tax invoice.
  const title = doc.type === 'invoice' && doc.data.vatOn ? 'Tax Invoice' : meta.title.join(' ').trim()
  const showCover = meta.cover || doc.data.cover
  const body = doc.type === 'quote' ? quoteBody(ctx) : doc.type === 'invoice' ? invoiceBody(ctx) : sectionedBody(ctx)
  const footer = `<div class="ftr">${meta.legal ? '<div class="initials">Initials: Client ______&nbsp;&nbsp; Service provider ______</div>' : ''}<div class="line"><span>NextWave Digital Solutions | ${esc(brand.email)} | ${esc(brand.phone)} | ${esc(brand.website)}</span><span class="pn"></span></div></div>`
  return `<!doctype html><html lang="en"${options.preview ? ' class="preview"' : ''}><head><meta charset="utf-8"><title>${esc(doc.reference)}</title><style>${FONT_CSS}${CSS}</style></head><body>
<div id="pages">${showCover ? cover(ctx) : ''}</div>
<template id="chrome"><div class="page${doc.type === 'info_form' ? ' formdoc' : ''}"><div class="hdr"><span>${esc(brand.company.toUpperCase())}</span><span>${esc(title)}</span></div><div class="body"></div>${footer}</div></template>
<div id="source" class="${doc.type === 'info_form' ? 'formdoc' : ''}" style="width:174mm">${body}</div>
<script>${PAGINATE}</script></body></html>`
}
