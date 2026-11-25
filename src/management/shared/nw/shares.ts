import type { Job } from './data'
import { commission } from './lib'

/** A Major Project share is negotiated (20–50%), so it is never assumed. */
export const shareUnknown = (j: Job) => j.type === 'Major Project' && j.majorShare === undefined

export const jobShares = (j: Job) => commission({
  type: j.type, fees: j.received, vatIncluded: true, bankCharges: j.bankCharges, thirdParty: j.thirdParty, majorShare: j.majorShare,
  contributors: j.contributorPct ? [{ name: 'Contributors', pct: j.contributorPct }] : [],
})
