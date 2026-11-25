import { useState } from 'react'
import { Copy } from 'lucide-react'
import { api, Row, send, toRecord, useTable } from '../shared/nw/api'
import { d, Role } from '../shared/nw/lib'
import { useUser } from '../shared/nw/user'
import { Badge, Btn, Card, DataTable, Drawer, Field, LoadError, useToast } from '../shared/nw/ui'
import { day } from '../shared/nw/api'

const INPUT = 'mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal text-fg outline-none focus:border-fg/40'
const inviteState = (i: Row) => (i.accepted_at ? 'Accepted' : new Date(i.expires_at) < new Date() ? 'Expired' : 'Pending')

/** Admin screen for invitations and account access. */
export function AccessControl() {
  const toast = useToast()
  const me = useUser()
  const accounts = useTable('auth/accounts', toRecord)
  const invites = useTable('auth/invites', toRecord)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('partner')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState('')
  const [password, setPassword] = useState('')
  const open = accounts.rows.find((a) => a.id === openId)

  const invite = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(''); setLink('')
    const response = await api('/api/auth/invites', 'POST', { email, role })
    const data = await response?.json().catch(() => null)
    if (!response?.ok) { setError(data?.error ?? 'Could not create the invite'); return }
    setLink(new URL(data.inviteUrl, window.location.origin).href)
    setEmail('')
    invites.reload()
  }
  const copy = () => navigator.clipboard.writeText(link).then(() => toast('Link copied'), () => toast('Select the link and copy it'))
  const update = async (body: Row, done: string) => {
    const problem = await send(`/api/auth/accounts/${openId}`, 'PUT', body)
    toast(problem || done)
    if (!problem) { setPassword(''); accounts.reload() }
  }
  const revoke = async (row: Row) => {
    if (row.accepted_at || !window.confirm(`Revoke the invite for ${row.email}?`)) return
    const problem = await send(`/api/auth/invites/${row.id}`, 'DELETE')
    toast(problem || 'Invite revoked')
    if (!problem) invites.reload()
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="font-semibold text-fg">Invite someone</h2>
        <p className="mt-1 text-sm text-muted">Creates a one-time link that expires in 7 days. Send it to the person yourself; no email is sent.</p>
        <form onSubmit={invite} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 basis-64 text-sm font-semibold text-fg">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} /></label>
          <label className="text-sm font-semibold text-fg">Role<select value={role} onChange={(e) => setRole(e.target.value as Role)} className={INPUT}><option value="partner">Partner</option><option value="finance">Finance</option></select></label>
          <Btn type="submit" kind="primary">Create invite</Btn>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-bad">{error}</p>}
        {link && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-soft p-3">
            <input readOnly value={link} aria-label="Invite link" onFocus={(e) => e.target.select()} className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none" />
            <Btn onClick={copy}><Copy className="h-4 w-4" />Copy</Btn>
            <p className="w-full text-xs text-muted">This link is shown only once.</p>
          </div>
        )}
      </Card>

      <LoadError message={accounts.error || invites.error} />
      <DataTable name="Accounts" rows={accounts.rows} onRow={(a) => { setOpenId(a.id); setPassword('') }} cols={[
        { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' }, { key: 'active', label: 'Access', render: (a) => <Badge>{a.active ? 'Active' : 'Revoked'}</Badge> },
      ]} />
      <DataTable name="Invites" rows={invites.rows.map((i): Row => ({ ...i, state: inviteState(i) }))} onRow={revoke} cols={[
        { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' },
        { key: 'expires_at', label: 'Expires', render: (i) => d(day(i.expires_at)) },
        { key: 'state', label: 'Status', render: (i) => <Badge>{i.state}</Badge> },
        { key: 'id', label: '', render: (i) => (i.accepted_at ? null : <span className="text-sm font-semibold text-bad">Revoke</span>) },
      ]} />

      <Drawer open={!!open} title={open?.name ?? ''} sub={open?.email} onClose={() => setOpenId('')}>
        {open && (open.id === me?.id ? <p className="text-sm text-muted">This is your account. Change your password from My profile.</p> : (
          <div className="space-y-5">
            <Field label="Access" value={<Badge>{open.active ? 'Active' : 'Revoked'}</Badge>} />
            <label className="block text-sm font-semibold text-fg">Role<select value={open.role} onChange={(e) => { if (window.confirm(`Change ${open.name} to ${e.target.value}?`)) update({ role: e.target.value }, 'Role changed') }} className={INPUT}><option value="admin">Admin</option><option value="partner">Partner</option><option value="finance">Finance</option></select></label>
            <form onSubmit={(e) => { e.preventDefault(); update({ password }, 'Password reset') }}>
              <label className="block text-sm font-semibold text-fg">Set a temporary password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT} /></label>
              <Btn type="submit" className="mt-2">Reset password</Btn>
            </form>
            <Btn kind={open.active ? 'danger' : 'primary'} className="w-full" onClick={() => update({ active: !open.active }, open.active ? 'Access revoked' : 'Access restored')}>{open.active ? 'Revoke access' : 'Restore access'}</Btn>
          </div>
        ))}
      </Drawer>
    </div>
  )
}

export function Profile() {
  const user = useUser()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [message, setMessage] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (next !== again) { setMessage('The new passwords don’t match'); return }
    const problem = await send('/api/auth/password', 'POST', { currentPassword: current, newPassword: next })
    setMessage(problem || 'Password changed')
    if (!problem) { setCurrent(''); setNext(''); setAgain('') }
  }
  const input = (label: string, value: string, set: (v: string) => void, autoComplete: string) => <label className="block text-sm font-semibold text-fg">{label}<input type="password" required minLength={autoComplete === 'new-password' ? 8 : undefined} autoComplete={autoComplete} value={value} onChange={(e) => set(e.target.value)} className={INPUT} /></label>
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="self-start p-5"><Field label="Name" value={user?.name ?? '—'} /><Field label="Email" value={user?.email ?? '—'} /><Field label="Role" value={user?.role ?? '—'} /></Card>
      <Card className="p-5">
        <h2 className="mb-3 font-semibold text-fg">Change password</h2>
        <form onSubmit={submit} className="space-y-3">
          {input('Current password', current, setCurrent, 'current-password')}
          {input('New password', next, setNext, 'new-password')}
          {input('Repeat new password', again, setAgain, 'new-password')}
          {message && <p role="status" className="rounded-lg bg-soft px-3 py-2 text-sm text-fg">{message}</p>}
          <Btn type="submit" kind="primary">Change password</Btn>
        </form>
      </Card>
    </div>
  )
}
