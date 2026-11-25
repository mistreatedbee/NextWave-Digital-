import { useState } from 'react'
import { Plus } from 'lucide-react'
import { editableFields, Field as FieldDef, resource, rights, Table } from '../../../../shared/resources'
import { day, Row, send, toRecord, useTable } from './api'
import { d, isoDate, rand, Role } from './lib'
import { Badge, Btn, Col, DataTable, Drawer, Field, LoadError, useToast } from './ui'

const INPUT = 'mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal text-fg outline-none focus:border-fg/40'
const STATE_KEYS = ['status', 'stage', 'consent']
const asName = (v: unknown) => String(v)
const initialValue = (field: FieldDef, row: Row | undefined) => {
  if (row) return field.type === 'date' ? day(row[field.key]) : String(row[field.key] ?? '')
  if (field.type === 'date') return field.required ? isoDate(new Date()) : ''
  return field.type === 'select' ? field.options![0] : ''
}

/** Create or edit form generated from a record definition. */
export function RecordForm({ table, role, row, defaults, onSaved, onCancel }: { table: Table; role: Role; row?: Row; defaults?: Row; onSaved: () => void; onCancel: () => void }) {
  const toast = useToast()
  const mode = row ? 'update' : 'create'
  const fields = editableFields(role, table, mode)
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((x) => [x.key, String(defaults?.[x.key] ?? initialValue(x, row))])))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const partners = useTable('auth/partner-names', asName, role === 'admin' && fields.some((x) => x.type === 'partner'))
  const jobs = useTable('jobs', toRecord, !!rights(role, 'jobs') && fields.some((x) => x.type === 'job'))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Edits send only what changed; new records send only what was filled in.
    const body = Object.fromEntries(Object.entries(values).filter(([key, v]) => {
      const field = fields.find((x) => x.key === key)!
      return row ? v !== initialValue(field, row) : v !== '' || field.required
    }))
    if (row && !Object.keys(body).length) { onCancel(); return }
    setBusy(true)
    const problem = await send(row ? `/api/${table}/${row.id}` : `/api/${table}`, row ? 'PUT' : 'POST', body)
    setBusy(false)
    if (problem) { setError(problem); return }
    toast(`${resource(table).singular[0].toUpperCase()}${resource(table).singular.slice(1)} saved`)
    onSaved()
  }

  const control = (field: FieldDef) => {
    const props = { value: values[field.key] ?? '', required: field.required, className: INPUT, onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [field.key]: e.target.value })) }
    if (field.type === 'textarea') return <textarea {...props} rows={5} />
    if (field.type === 'select' || field.type === 'partner' || field.type === 'job') {
      const options: [string, string][] = field.type === 'select' ? field.options!.map((o) => [o, o])
        : field.type === 'partner' ? partners.rows.map((n) => [n, n])
        : jobs.rows.map((j) => [j.id, `${j.id} · ${j.title}`])
      // Keep the current value selectable even if it is no longer in the list.
      if (props.value && !options.some(([v]) => v === props.value)) options.unshift([props.value, props.value])
      return <select {...props}>{field.type !== 'select' && <option value="">None</option>}{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    }
    const type = field.type === 'number' ? 'number' : field.type
    return <input {...props} type={type} min={field.type === 'number' ? field.min ?? 0 : undefined} max={field.max} step={field.type === 'number' ? 1 : undefined} />
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <LoadError message={error || partners.error || jobs.error} />
      {fields.map((field) => <label key={field.key} className="block text-sm font-semibold text-fg">{field.label}{field.money ? ' (R)' : ''}{control(field)}</label>)}
      <div className="flex justify-end gap-2 pt-2"><Btn type="button" onClick={onCancel}>Cancel</Btn><Btn type="submit" kind="primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Btn></div>
    </form>
  )
}

function show(field: FieldDef, row: Row) {
  const value = row[field.key]
  if (field.type === 'date') return <span className="whitespace-nowrap">{d(day(value))}</span>
  if (value === null || value === undefined || value === '') return '—'
  if (field.money) return rand(Number(value))
  if (STATE_KEYS.includes(field.key)) return <Badge>{String(value)}</Badge>
  if (field.type === 'url' && /^https?:\/\//i.test(String(value))) return <a href={String(value)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-semibold text-accent">Open link</a>
  if (field.type === 'textarea') return <span className="whitespace-pre-wrap">{String(value)}</span>
  return String(value)
}

/** One-click status changes offered in a record's detail panel. */
function quickActions(table: Table, role: Role, row: Row): { label: string; status: string }[] {
  const to = (status: string, label = status) => ({ status, label })
  if (role === 'partner') {
    if (table === 'onboarding' && row.status === 'Missing') return [to('Submitted', 'Mark as submitted')]
    if (table === 'help_requests' && row.status !== 'Resolved') return [to('Resolved', 'Mark resolved')]
  }
  if (role !== 'admin') return []
  if (table === 'approvals' && row.status === 'Pending') return [to('Approved', 'Approve'), to('Declined', 'Decline')]
  if (table === 'quotes' && row.status === 'Awaiting approval') return [to('Approved', 'Approve'), to('Declined', 'Decline')]
  if (table === 'expenses' && row.status === 'Pending') return [to('Approved', 'Approve'), to('Rejected', 'Reject')]
  if (table === 'documents' && row.status === 'Pending review') return [to('Verified', 'Verify')]
  if (table === 'onboarding' && row.status !== 'Verified') return [to('Verified', 'Verify')]
  if (table === 'help_requests' && row.status !== 'Resolved') return [to('Resolved', 'Mark resolved')]
  return []
}

/** A complete list, detail, create, edit and delete screen for one record type. */
export function ResourceView({ table, role, openNew }: { table: Table; role: Role; openNew?: boolean }) {
  const toast = useToast()
  const def = resource(table)
  const access = rights(role, table)
  const { rows, error, reload } = useTable(table, toRecord, !!access)
  const canCreate = editableFields(role, table, 'create').length > 0
  const [panel, setPanel] = useState<{ id?: string; edit: boolean } | null>(openNew && canCreate ? { edit: true } : null)
  const open = panel?.id !== undefined ? rows.find((r) => String(r.id) === panel.id) : undefined
  const close = () => setPanel(null)
  const creating = !!panel && panel.id === undefined

  const columns: Col<Row>[] = def.fields.filter((x) => !x.detail).map((x) => ({ key: x.key, label: x.label, align: x.money ? 'right' : undefined, render: (row) => show(x, row) }))
  const filters = def.fields.filter((x) => STATE_KEYS.includes(x.key)).map((x) => ({ key: x.key, label: x.label }))

  const change = async (row: Row, status: string) => {
    const problem = await send(`/api/${table}/${row.id}`, 'PUT', { status })
    toast(problem || `Marked ${status.toLowerCase()}`)
    if (!problem) reload()
  }
  const remove = async (row: Row) => {
    if (!window.confirm(`Delete this ${def.singular}? This cannot be undone.`)) return
    const problem = await send(`/api/${table}/${row.id}`, 'DELETE')
    toast(problem || 'Deleted')
    if (!problem) { close(); reload() }
  }
  const newButton = canCreate && <Btn kind="primary" onClick={() => setPanel({ edit: true })}><Plus className="h-4 w-4" />New {def.singular}</Btn>

  return (
    <>
      {newButton && <div className="mb-3 flex justify-end">{newButton}</div>}
      <LoadError message={error} />
      <DataTable name={def.title} rows={rows} cols={columns} filters={filters} onRow={(row) => setPanel({ id: String(row.id), edit: false })} />
      <Drawer open={creating || !!open} title={creating ? `New ${def.singular}` : String(open?.[def.fields[0].key] ?? def.title)} sub={open ? String(open.id) : undefined} onClose={close}>
        {panel?.edit ? (
          <RecordForm key={panel.id ?? 'new'} table={table} role={role} row={open} onCancel={close} onSaved={() => { close(); reload() }} />
        ) : open && (
          <>
            {def.fields.map((x) => <Field key={x.key} label={x.label} value={show(x, open)} />)}
            <div className="mt-5 flex flex-wrap gap-2">
              {quickActions(table, role, open).map((a) => <Btn key={a.status} kind="primary" onClick={() => change(open, a.status)}>{a.label}</Btn>)}
              {editableFields(role, table, 'update').length > 0 && !(role === 'partner' && ['onboarding'].includes(table)) && <Btn onClick={() => setPanel({ id: panel!.id, edit: true })}>Edit</Btn>}
              {access?.remove && <Btn kind="danger" onClick={() => remove(open)}>Delete</Btn>}
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
