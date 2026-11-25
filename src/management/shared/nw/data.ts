import type { JobType } from './lib'

export type Partner = { name: string; email: string; status: string; earnings: number; jobs: number; leads: number; created: string }
export type Lead = { id: string; name: string; company: string; service: string; source: string; value: number; partner: string; stage: 'New' | 'Contacted' | 'Quote sent' | 'Won' | 'Lost'; created: string; loggedHrs: number }
export type Job = { id: string; title: string; client: string; type: JobType; partner: string; value: number; received: number; status: 'Not started' | 'In progress' | 'Review' | 'Done' | 'On hold'; due: string; majorShare?: number; contributors?: { name: string; pct: number }[] }
export type Payment = { id: string; date: string; client: string; invoice: string; job: string; amount: number; method: string; bankCharges: number; status: string; partner: string }
export type Payout = { id: string; partner: string; batch: string; gross: number; amount: number; status: string }

export const isOpenLead = (l: Lead) => !['Won', 'Lost'].includes(l.stage)
export const isOverdueLead = (l: Lead) => l.loggedHrs > 24 && isOpenLead(l)
