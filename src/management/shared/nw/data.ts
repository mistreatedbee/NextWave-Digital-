import type { JobType } from './lib'

export const partners = [
  { name: 'Thandi Mokoena', email: 'thandi@nextwave.co.za', status: 'Trial', trialDay: 18, joined: '2026-11-07', earnings: 18450, jobs: 7, leads: 14, docs: '4/6' },
  { name: 'Sipho Ndlovu', email: 'sipho@nextwave.co.za', status: 'Active', trialDay: 30, joined: '2026-08-12', earnings: 46200, jobs: 15, leads: 29, docs: '6/6' },
  { name: 'Lerato Khumalo', email: 'lerato@nextwave.co.za', status: 'Active', trialDay: 30, joined: '2026-06-03', earnings: 61850, jobs: 19, leads: 33, docs: '6/6' },
  { name: 'Ayesha Patel', email: 'ayesha@nextwave.co.za', status: 'Active', trialDay: 30, joined: '2026-09-21', earnings: 27900, jobs: 9, leads: 18, docs: '5/6' },
  { name: 'Johan van Wyk', email: 'johan@nextwave.co.za', status: 'Trial', trialDay: 6, joined: '2026-11-19', earnings: 1200, jobs: 1, leads: 4, docs: '2/6' },
]

export type Lead = { id: string; name: string; company: string; service: string; source: string; value: number; partner: string; stage: 'New' | 'Contacted' | 'Quote sent' | 'Won' | 'Lost'; created: string; loggedHrs: number }
export const leads: Lead[] = [
  { id: 'L-1042', name: 'Nomvula Dlamini', company: 'Soweto Bakes', service: 'Website', source: 'Referral', value: 8500, partner: 'Thandi Mokoena', stage: 'New', created: '2026-11-24', loggedHrs: 3 },
  { id: 'L-1041', name: 'Pieter Botha', company: 'Botha Plumbing', service: 'Automation', source: 'Facebook', value: 14500, partner: 'Sipho Ndlovu', stage: 'Contacted', created: '2026-11-23', loggedHrs: 30 },
  { id: 'L-1040', name: 'Zanele Mthembu', company: 'Mthembu Tutors', service: 'Tutoring', source: 'Instagram', value: 3200, partner: 'Thandi Mokoena', stage: 'Quote sent', created: '2026-11-21', loggedHrs: 6 },
  { id: 'L-1039', name: 'Kagiso Molefe', company: 'Molefe Logistics', service: 'App', source: 'LinkedIn', value: 68000, partner: 'Lerato Khumalo', stage: 'Quote sent', created: '2026-11-19', loggedHrs: 2 },
  { id: 'L-1038', name: 'Fatima Essop', company: 'Essop & Co Attorneys', service: 'Website', source: 'Website form', value: 22000, partner: 'Ayesha Patel', stage: 'Won', created: '2026-11-15', loggedHrs: 4 },
  { id: 'L-1037', name: 'Bongani Zulu', company: 'Zulu Fitness', service: 'Marketing', source: 'TikTok', value: 6500, partner: 'Thandi Mokoena', stage: 'Contacted', created: '2026-11-14', loggedHrs: 41 },
  { id: 'L-1036', name: 'Riana Steyn', company: 'Steyn Guesthouse', service: 'Website', source: 'Referral', value: 450, partner: 'Thandi Mokoena', stage: 'Won', created: '2026-11-12', loggedHrs: 1 },
  { id: 'L-1035', name: 'Tshepo Mahlangu', company: 'Mahlangu Motors', service: 'Marketing', source: 'Facebook', value: 9800, partner: 'Sipho Ndlovu', stage: 'Lost', created: '2026-11-08', loggedHrs: 5 },
  { id: 'L-1034', name: 'Ilse Venter', company: 'Venter Accounting', service: 'Automation', source: 'LinkedIn', value: 18500, partner: 'Lerato Khumalo', stage: 'Won', created: '2026-11-05', loggedHrs: 2 },
  { id: 'L-1033', name: 'Musa Khoza', company: 'Khoza Events', service: 'App', source: 'Referral', value: 36000, partner: 'Johan van Wyk', stage: 'New', created: '2026-11-25', loggedHrs: 0 },
  { id: 'L-1032', name: 'Priya Naidoo', company: 'Naidoo Pharmacy', service: 'Website', source: 'Website form', value: 12000, partner: 'Ayesha Patel', stage: 'Contacted', created: '2026-11-02', loggedHrs: 8 },
  { id: 'L-1031', name: 'Sarah Jacobs', company: 'Parent — Gr 10 Maths', service: 'Tutoring', source: 'Instagram', value: 2400, partner: 'Thandi Mokoena', stage: 'Won', created: '2026-10-29', loggedHrs: 3 },
]

export type Job = { id: string; title: string; client: string; type: JobType; partner: string; value: number; received: number; status: 'Not started' | 'In progress' | 'Review' | 'Done' | 'On hold'; due: string; deposit: boolean; milestones: { name: string; done: boolean }[]; helpRequested?: boolean; contributors?: { name: string; pct: number }[]; majorShare?: number }
export const jobs: Job[] = [
  { id: 'J-318', title: 'Logo touch-up & favicon', client: 'Steyn Guesthouse', type: 'Standard Job', partner: 'Thandi Mokoena', value: 450, received: 450, status: 'Done', due: '2026-11-20', deposit: true, milestones: [{ name: 'Brief', done: true }, { name: 'Delivery', done: true }] },
  { id: 'J-317', title: 'Essop & Co website rebuild', client: 'Essop & Co Attorneys', type: 'Independent Work', partner: 'Ayesha Patel', value: 22000, received: 11000, status: 'In progress', due: '2026-12-12', deposit: true, milestones: [{ name: 'Deposit 50%', done: true }, { name: 'Design sign-off', done: true }, { name: 'Build', done: false }, { name: 'Launch & balance', done: false }] },
  { id: 'J-316', title: 'Invoice automation (Xero → WhatsApp)', client: 'Venter Accounting', type: 'Assisted Work', partner: 'Lerato Khumalo', value: 18500, received: 18500, status: 'Review', due: '2026-11-28', deposit: true, milestones: [{ name: 'Deposit', done: true }, { name: 'Workflow build', done: true }, { name: 'UAT', done: false }], helpRequested: true },
  { id: 'J-315', title: 'Fleet tracking app — Phase 1', client: 'Molefe Logistics', type: 'Major Project', partner: 'Lerato Khumalo', value: 68000, received: 34000, status: 'In progress', due: '2027-02-27', deposit: true, majorShare: 45, contributors: [{ name: 'Sipho Ndlovu', pct: 15 }, { name: 'Dev contractor (K. Pillay)', pct: 10 }], milestones: [{ name: 'Discovery', done: true }, { name: 'UX prototype', done: true }, { name: 'MVP build', done: false }, { name: 'Pilot', done: false }, { name: 'Handover', done: false }] },
  { id: 'J-314', title: 'Gr 10 Maths tutoring — Term 4', client: 'Sarah Jacobs', type: 'Independent Work', partner: 'Thandi Mokoena', value: 2400, received: 2400, status: 'In progress', due: '2026-12-05', deposit: true, milestones: [{ name: '8 sessions', done: false }] },
  { id: 'J-313', title: 'Social media starter pack', client: 'Zulu Fitness', type: 'Assisted Work', partner: 'Thandi Mokoena', value: 6500, received: 3250, status: 'In progress', due: '2026-12-03', deposit: true, helpRequested: true, milestones: [{ name: 'Deposit', done: true }, { name: '12 posts', done: false }, { name: 'Ad setup', done: false }] },
  { id: 'J-312', title: 'Booking page for bakery', client: 'Soweto Bakes', type: 'Independent Work', partner: 'Thandi Mokoena', value: 8500, received: 0, status: 'Not started', due: '2026-12-15', deposit: false, milestones: [{ name: 'Deposit 50%', done: false }, { name: 'Build', done: false }] },
  { id: 'J-311', title: 'Pharmacy landing page', client: 'Naidoo Pharmacy', type: 'Independent Work', partner: 'Ayesha Patel', value: 12000, received: 6000, status: 'On hold', due: '2026-12-20', deposit: true, milestones: [{ name: 'Deposit', done: true }, { name: 'Content from client', done: false }] },
  { id: 'J-310', title: 'Google Business profile setup', client: 'Mahlangu Motors', type: 'Standard Job', partner: 'Sipho Ndlovu', value: 500, received: 500, status: 'Done', due: '2026-11-10', deposit: true, milestones: [{ name: 'Setup', done: true }] },
]

export const payments = [
  { id: 'PAY-2291', date: '2026-11-24', client: 'Molefe Logistics', invoice: 'INV-0418', job: 'J-315', amount: 34000, method: 'EFT', bankCharges: 0, status: 'Cleared', partner: 'Lerato Khumalo' },
  { id: 'PAY-2290', date: '2026-11-22', client: 'Venter Accounting', invoice: 'INV-0416', job: 'J-316', amount: 9250, method: 'EFT', bankCharges: 0, status: 'Cleared', partner: 'Lerato Khumalo' },
  { id: 'PAY-2289', date: '2026-11-21', client: 'Zulu Fitness', invoice: 'INV-0415', job: 'J-313', amount: 3250, method: 'Card (Yoco)', bankCharges: 94, status: 'Pending', partner: 'Thandi Mokoena' },
  { id: 'PAY-2288', date: '2026-11-20', client: 'Steyn Guesthouse', invoice: 'INV-0414', job: 'J-318', amount: 450, method: 'SnapScan', bankCharges: 13, status: 'Cleared', partner: 'Thandi Mokoena' },
  { id: 'PAY-2287', date: '2026-11-18', client: 'Sarah Jacobs', invoice: 'INV-0412', job: 'J-314', amount: 2400, method: 'EFT', bankCharges: 0, status: 'Cleared', partner: 'Thandi Mokoena' },
  { id: 'PAY-2286', date: '2026-11-15', client: 'Essop & Co Attorneys', invoice: 'INV-0410', job: 'J-317', amount: 11000, method: 'EFT', bankCharges: 0, status: 'Cleared', partner: 'Ayesha Patel' },
  { id: 'PAY-2285', date: '2026-11-12', client: 'Venter Accounting', invoice: 'INV-0409', job: 'J-316', amount: 9250, method: 'EFT', bankCharges: 0, status: 'Cleared', partner: 'Lerato Khumalo' },
  { id: 'PAY-2284', date: '2026-11-10', client: 'Mahlangu Motors', invoice: 'INV-0407', job: 'J-310', amount: 500, method: 'Card (Yoco)', bankCharges: 15, status: 'Refunded', partner: 'Sipho Ndlovu' },
]

export const payouts = [
  { id: 'PO-0147', partner: 'Lerato Khumalo', batch: '2026-11-27', cleared: '2026-11-24', dueBy: '2026-12-03', jobs: 'J-315, J-316', gross: 43250, amount: 15820, status: 'Scheduled' },
  { id: 'PO-0146', partner: 'Thandi Mokoena', batch: '2026-11-27', cleared: '2026-11-20', dueBy: '2026-11-27', jobs: 'J-318, J-314', gross: 2850, amount: 2030, status: 'Scheduled' },
  { id: 'PO-0145', partner: 'Ayesha Patel', batch: '2026-11-20', cleared: '2026-11-15', dueBy: '2026-11-24', jobs: 'J-317', gross: 11000, amount: 7650, status: 'Paid' },
  { id: 'PO-0144', partner: 'Lerato Khumalo', batch: '2026-11-13', cleared: '2026-11-12', dueBy: '2026-11-21', jobs: 'J-316', gross: 9250, amount: 4020, status: 'Paid' },
  { id: 'PO-0143', partner: 'Sipho Ndlovu', batch: '2026-11-13', cleared: '2026-11-10', dueBy: '2026-11-19', jobs: 'J-310', gross: 500, amount: 0, status: 'Reversed (refund)' },
]

export const approvals = [
  { id: 'AP-88', kind: 'Quote discount', detail: 'Q-2071 · 15% discount for Molefe Logistics', by: 'Lerato Khumalo', amount: 10200, age: '2h' },
  { id: 'AP-87', kind: 'Ad spend', detail: 'Zulu Fitness December boost · Meta', by: 'Thandi Mokoena', amount: 1500, age: '5h' },
  { id: 'AP-86', kind: 'Third-party cost', detail: 'Apple developer licence for J-315', by: 'Lerato Khumalo', amount: 1850, age: '1d' },
  { id: 'AP-85', kind: 'Help request', detail: 'J-313 needs a video editor — convert to Assisted Work', by: 'Thandi Mokoena', amount: 0, age: '1d' },
]

export const overdueLogs = [
  { partner: 'Thandi Mokoena', item: 'Call notes — Zulu Fitness (L-1037)', hours: 41 },
  { partner: 'Sipho Ndlovu', item: 'Follow-up — Botha Plumbing (L-1041)', hours: 30 },
  { partner: 'Johan van Wyk', item: 'Timesheet — 21 Nov', hours: 26 },
]

export const revenueSeries = [
  { m: 'Jun', rev: 38000, com: 17400 },
  { m: 'Jul', rev: 44500, com: 21100 },
  { m: 'Aug', rev: 51200, com: 23900 },
  { m: 'Sep', rev: 47800, com: 22300 },
  { m: 'Oct', rev: 63400, com: 28600 },
  { m: 'Nov', rev: 70350, com: 31200 },
]

export const activity = [
  { who: 'Lerato Khumalo', what: 'marked milestone "UX prototype" done on J-315', when: '25 Nov 2026, 09:12' },
  { who: 'System', what: 'payment PAY-2291 cleared — R34 000', when: '24 Nov 2026, 16:40' },
  { who: 'Thandi Mokoena', what: 'requested help on J-313', when: '24 Nov 2026, 11:05' },
  { who: 'Admin', what: 'approved quote Q-2068', when: '23 Nov 2026, 14:22' },
]
