import { useCallback, useEffect, useState } from 'react'
import type { Table } from '../../../../shared/resources'
import type { Job, Lead, Partner, Payment, Payout } from './data'
import { isoDate } from './lib'

export const SIGNED_OUT = 'nw:signed-out'

/** fetch for the signed-in API: announces an expired session, and returns null if unreachable. */
export async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(path, { method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) }).catch(() => null)
  if (response?.status === 401) window.dispatchEvent(new Event(SIGNED_OUT))
  return response
}

export type Row = Record<string, any>
const text = (v: unknown) => String(v ?? '')
const num = (v: unknown) => Number(v) || 0
/** SQL dates arrive as YYYY-MM-DD; timestamps are converted to the local calendar day. */
export const day = (v: unknown) => (!v ? '' : /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : isoDate(new Date(String(v))))
const hoursSince = (v: unknown) => (v ? Math.max(0, Math.floor((Date.now() - new Date(String(v)).getTime()) / 3600000)) : 0)

export const toLead = (r: Row): Lead => ({ id: text(r.id), name: text(r.name), company: text(r.company), service: text(r.service), source: text(r.source), value: num(r.value), partner: text(r.partner), stage: r.stage, created: day(r.created_at), loggedHrs: hoursSince(r.last_activity_at ?? r.created_at), notes: text(r.notes), raw: r })
export const toJob = (r: Row): Job => ({ id: text(r.id), title: text(r.title), client: text(r.client), type: r.job_type, partner: text(r.partner), value: num(r.value), received: num(r.received), status: r.status, due: day(r.due), majorShare: r.major_share == null ? undefined : num(r.major_share), bankCharges: num(r.bank_charges), thirdParty: num(r.third_party), contributorPct: num(r.contributor_pct), raw: r })
export const toPayment = (r: Row): Payment => ({ id: text(r.id), date: day(r.payment_date), client: text(r.client), invoice: text(r.invoice), job: text(r.job), amount: num(r.amount), method: text(r.method), bankCharges: num(r.bank_charges), status: text(r.status), partner: text(r.partner), raw: r })
export const toPayout = (r: Row): Payout => ({ id: text(r.id), partner: text(r.partner), job: text(r.job), clearedDate: day(r.cleared_date), batch: day(r.batch), gross: num(r.gross), amount: num(r.amount), status: text(r.status), raw: r })
export const toPartner = (r: Row): Partner => ({ name: text(r.name), email: text(r.email), status: text(r.status), created: day(r.created_at) })
export const toRecord = (r: Row): Row => r

/** Sends a change and returns the server's error message, or '' on success. */
export async function send(path: string, method: string, body?: unknown) {
  const response = await api(path, method, body)
  if (response?.ok) return ''
  const data = await response?.json().catch(() => null)
  return String(data?.error ?? 'Could not reach the server')
}

/** Loads a list from the API. `map` must be a stable (module-level) function. */
export function useTable<T>(table: Table | 'auth/accounts' | 'auth/invites' | 'auth/partner-names', map: (r: any) => T, enabled = true) {
  const [rows, setRows] = useState<T[]>([])
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  useEffect(() => {
    if (!enabled) { setRows([]); setError(''); return }
    let active = true
    api(`/api/${table}`)
      .then(async (r) => {
        const data = await r?.json()
        if (!r?.ok || !Array.isArray(data)) throw new Error()
        if (active) { setRows(data.map(map)); setError('') }
      })
      .catch(() => { if (active) { setRows([]); setError(`Could not load ${table.replace(/[_/-]/g, ' ')}. Try again, or check that the API and database are available.`) } })
    return () => { active = false }
  }, [table, map, enabled, version])
  const reload = useCallback(() => setVersion((v) => v + 1), [])
  return { rows, setRows, error, reload }
}
