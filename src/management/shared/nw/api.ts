import { useEffect, useState } from 'react'
import type { Job, Lead, Partner, Payment, Payout } from './data'
import { isoDate } from './lib'

export const SIGNED_OUT = 'nw:signed-out'

/** fetch for the signed-in API: announces an expired session, and returns null if unreachable. */
export async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(path, { method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) }).catch(() => null)
  if (response?.status === 401) window.dispatchEvent(new Event(SIGNED_OUT))
  return response
}

type Row = Record<string, any>
const text = (v: unknown) => String(v ?? '')
const num = (v: unknown) => Number(v) || 0
/** The API serialises SQL dates as timestamps, so convert back to the local calendar day. */
const day = (v: unknown) => (v ? isoDate(new Date(String(v))) : '')

export const toLead = (r: Row): Lead => ({ id: text(r.id), name: text(r.name), company: text(r.company), service: text(r.service), source: text(r.source), value: num(r.value), partner: text(r.partner), stage: r.stage, created: day(r.created_at), loggedHrs: num(r.logged_hours) })
export const toJob = (r: Row): Job => ({ id: text(r.id), title: text(r.title), client: text(r.client), type: r.job_type, partner: text(r.partner), value: num(r.value), received: num(r.received), status: r.status, due: day(r.due) })
export const toPayment = (r: Row): Payment => ({ id: text(r.id), date: day(r.payment_date), client: text(r.client), invoice: text(r.invoice), job: text(r.job), amount: num(r.amount), method: text(r.method), bankCharges: num(r.bank_charges), status: text(r.status), partner: text(r.partner) })
export const toPayout = (r: Row): Payout => ({ id: text(r.id), partner: text(r.partner), batch: day(r.batch), gross: num(r.gross), amount: num(r.amount), status: text(r.status) })
export const toPartner = (r: Row): Partner => ({ name: text(r.name), email: text(r.email), status: text(r.status), earnings: num(r.earnings), jobs: num(r.jobs), leads: num(r.leads), created: day(r.created_at) })
export const toRecord = (r: Row): Row => r

/** Loads a table from the API. `map` must be a stable (module-level) function. */
export function useTable<T>(table: 'leads' | 'jobs' | 'payments' | 'payouts' | 'partners' | 'clients', map: (r: Row) => T) {
  const [rows, setRows] = useState<T[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api(`/api/${table}`)
      .then(async (r) => {
        const data = await r?.json()
        if (!r?.ok || !Array.isArray(data)) throw new Error()
        if (active) { setRows(data.map(map)); setError('') }
      })
      .catch(() => { if (active) { setRows([]); setError(`Could not load ${table}. Check that the API server and database are available.`) } })
    return () => { active = false }
  }, [table, map])
  return { rows, setRows, error }
}
