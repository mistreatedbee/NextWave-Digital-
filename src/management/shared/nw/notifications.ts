import { useMemo } from 'react'
import { buildAlerts } from '../../../../shared/alerts'
import { todaySA } from '../../../../shared/documents/model'
import { rights, Table } from '../../../../shared/resources'
import { toRecord, useTable } from './api'
import type { Role } from './lib'
import { canAccess } from './nav'

/** Things needing attention, from the records this role can read. */
export function useNotifications(role: Role) {
  const load = (table: Table) => useTable(table, toRecord, !!rights(role, table)).rows
  const leads = load('leads'), approvals = load('approvals'), help_requests = load('help_requests'), invoices = load('invoices'), documents = load('documents')
  const tasks = load('tasks'), work_log = load('work_log'), domains = load('domains'), jobs = load('jobs')
  return useMemo(() => buildAlerts({ leads, approvals, help_requests, invoices, documents, tasks, work_log, domains, jobs }, todaySA()).filter((a) => canAccess(role, a.page)),
    [role, leads, approvals, help_requests, invoices, documents, tasks, work_log, domains, jobs])
}
