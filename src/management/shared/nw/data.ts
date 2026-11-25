import type { JobType } from './lib'

type Raw = Record<string, any>
export type Partner = { name: string; email: string; status: string; created: string }
export type Lead = { id: string; name: string; company: string; service: string; source: string; value: number; partner: string; stage: 'New' | 'Contacted' | 'Quote sent' | 'Won' | 'Lost'; created: string; loggedHrs: number; notes: string; raw: Raw }
export type Job = { id: string; title: string; client: string; type: JobType; partner: string; value: number; received: number; status: 'Not started' | 'In progress' | 'Review' | 'Done' | 'On hold'; due: string; majorShare?: number; bankCharges: number; thirdParty: number; contributorPct: number; raw: Raw }
export type Payment = { id: string; date: string; client: string; invoice: string; job: string; amount: number; method: string; bankCharges: number; status: string; partner: string; raw: Raw }
export type Payout = { id: string; partner: string; job: string; clearedDate: string; batch: string; gross: number; amount: number; status: string; raw: Raw }

export const isOpenLead = (l: Lead) => !['Won', 'Lost'].includes(l.stage)
export const isOverdueLead = (l: Lead) => l.loggedHrs > 24 && isOpenLead(l)
