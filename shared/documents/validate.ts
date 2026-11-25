import { Brand, DocData, emptyParty, Item, Section } from './model.js'

export class InvalidDocument extends Error {}

const text = (v: unknown, max = 500) => {
  if (v === undefined || v === null) return ''
  if (typeof v !== 'string' && typeof v !== 'number') throw new InvalidDocument('Invalid text value')
  const s = String(v)
  if (s.length > max) throw new InvalidDocument('A value is too long')
  return s
}
const cents = (v: unknown) => {
  const n = Number(v ?? 0)
  if (!Number.isInteger(n) || n < 0 || n > 100_000_000_000) throw new InvalidDocument('Amounts must be zero or more')
  return n
}
const date = (v: unknown) => {
  const s = text(v, 10)
  if (s && !(/^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().startsWith(s))) throw new InvalidDocument('Invalid date')
  return s
}
const list = <T>(v: unknown, max: number, map: (x: any) => T): T[] => {
  if (v === undefined) return []
  if (!Array.isArray(v) || v.length > max) throw new InvalidDocument('Invalid list')
  return v.map((x) => map(x ?? {}))
}

export const cleanSections = (v: unknown): Section[] => list(v, 60, (s) => ({ id: text(s.id, 60) || `s${Math.random().toString(36).slice(2, 8)}`, title: text(s.title, 200), body: text(s.body, 20000) }))

/**
 * Accepts only the editable parts of a document. Signatures, payments and the signing
 * snapshot are controlled by the server and are carried over from the stored record.
 */
export function cleanData(input: any, stored: DocData): DocData {
  if (!input || typeof input !== 'object') throw new InvalidDocument('Missing document data')
  const client = emptyParty()
  for (const key of Object.keys(client) as (keyof typeof client)[]) client[key] = text(input.client?.[key])
  const fields: Record<string, string> = {}
  const entries = Object.entries(input.fields ?? {})
  if (entries.length > 80) throw new InvalidDocument('Too many fields')
  for (const [key, value] of entries) {
    if (!/^[a-z0-9_]{1,60}$/.test(key)) throw new InvalidDocument('Invalid field name')
    fields[key] = text(value, 10000)
  }
  const items: Item[] = list(input.items, 200, (i) => {
    const qty = Number(i.qty ?? 1)
    if (!Number.isFinite(qty) || qty < 0 || qty > 100000) throw new InvalidDocument('Invalid quantity')
    return { description: text(i.description, 1000), qty, unitCents: cents(i.unitCents), ...(i.standardCents ? { standardCents: cents(i.standardCents) } : {}) }
  })
  return {
    client, items, fields,
    projectName: text(input.projectName, 200), summary: text(input.summary, 5000),
    recurring: list(input.recurring, 30, (x) => ({ description: text(x.description), terms: text(x.terms) })),
    discountCents: cents(input.discountCents), vatOn: !!input.vatOn, issueDate: date(input.issueDate), dueDate: date(input.dueDate),
    cover: !!input.cover, witnesses: !!input.witnesses, sections: cleanSections(input.sections),
    payments: stored.payments, companySignedOn: stored.companySignedOn, clientSignature: stored.clientSignature, brandSnapshot: stored.brandSnapshot,
  }
}

export function cleanBrand(input: any, current: Brand): Brand {
  const out: any = { ...current }
  for (const key of Object.keys(current) as (keyof Brand)[]) {
    if (input?.[key] === undefined) continue
    out[key] = key === 'vatRegistered' || key === 'autoRemind' ? !!input[key] : text(input[key])
  }
  return out
}
