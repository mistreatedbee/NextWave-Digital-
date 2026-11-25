export type Role = 'admin' | 'partner' | 'finance'
export type JobType = 'Standard Job' | 'Independent Work' | 'Assisted Work' | 'Major Project'

export const ME_PARTNER = 'Thandi Mokoena'

export function rand(n: number) {
  const neg = n < 0
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${neg ? '−' : ''}R${s}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** '2026-11-25' -> '25 Nov 2026' */
export function d(iso: string) {
  const [y, m, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[m - 1]} ${y}`
}

export type CommissionInput = {
  type: JobType
  fees: number // fees received incl VAT
  vatIncluded: boolean
  bankCharges: number
  thirdParty: number
  majorShare?: number // partner % for major project
  contributors?: { name: string; pct: number }[] // % of net, major only
}

export function commission(i: CommissionInput) {
  const vat = i.vatIncluded ? Math.round((i.fees * 15) / 115) : 0
  const net = Math.max(0, i.fees - vat - i.bankCharges - i.thirdParty)
  let partnerPct = 0
  if (i.type === 'Standard Job') partnerPct = 100
  if (i.type === 'Independent Work') partnerPct = 80
  if (i.type === 'Assisted Work') partnerPct = 50
  if (i.type === 'Major Project') partnerPct = i.majorShare ?? 25
  const contribPct = i.type === 'Major Project' ? (i.contributors ?? []).reduce((s, c) => s + c.pct, 0) : 0
  const companyPct = Math.max(0, 100 - partnerPct - contribPct)
  return {
    vat,
    net,
    partnerPct,
    companyPct,
    partner: Math.round((net * partnerPct) / 100),
    company: Math.round((net * companyPct) / 100),
    contributors: (i.type === 'Major Project' ? i.contributors ?? [] : []).map((c) => ({ ...c, amount: Math.round((net * c.pct) / 100) })),
    over100: partnerPct + contribPct > 100,
  }
}

export function exportCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `${name}.csv`
  a.click()
}
