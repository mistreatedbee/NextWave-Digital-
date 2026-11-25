import React, { useEffect, useState } from 'react'
import type { Account } from '../shared/nw/user'

type Props = Partial<typeof args> & { onSignedIn?: (account: Account) => void }

export default function SignIn(props: Props) {
  const { state: initial, email, onSignedIn } = { ...args, ...props }
  const [state, setState] = useState(initial)
  const [loginEmail, setLoginEmail] = useState(email)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [invitePassword, setInvitePassword] = useState('')
  const [error, setError] = useState('')
  const [inviteToken, setInviteToken] = useState('')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (token) {
      setInviteToken(token)
      setState('invite')
    }
  }, [])

  const login = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    let response: Response
    try {
      response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password }),
      })
    } catch {
      setError('Cannot reach the login server')
      return
    }
    if (!response.ok) {
      setError((await response.json().catch(() => ({}))).error || 'Login failed')
      return
    }
    const account = await response.json()
    onSignedIn?.(account)
  }

  const acceptInvite = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const response = await fetch('/api/auth/accept-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: inviteToken, name, password: invitePassword }),
    }).catch(() => null)
    if (!response?.ok) {
      setError((await response?.json().catch(() => ({})))?.error || 'Invite could not be accepted')
      return
    }
    const account = await response.json()
    setLoginEmail(account.email)
    window.history.replaceState(null, '', '/management')
    setState('login')
    setError('Invite accepted. Sign in with your new password.')
  }

  return (
    <div className="flex min-h-screen w-full bg-bg font-sans text-fg">
      <aside className="hidden w-[44%] flex-col justify-between bg-ink p-12 text-white lg:flex">
        <div className="font-display text-2xl font-extrabold">NextWave <span className="text-lime">Digital Solutions</span></div>
        <div><p className="font-display text-4xl font-bold leading-tight">Every lead, job and rand —<br />logged, split and paid on time.</p><p className="mt-4 max-w-md text-white/60">Websites, apps, automation, marketing and tutoring, run from one place for the team and our partners.</p></div>
        <p className="text-xs text-white/40">NextWave Digital Solutions (Pty) Ltd · Reg No. 2026/184607/07 · Johannesburg</p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="font-display mb-8 text-xl font-extrabold lg:hidden"><span className="rounded-md bg-ink px-2 py-1 text-white">NextWave</span> <span className="text-accent">Digital Solutions</span></div>

          {state === 'login' && (
            <form onSubmit={login}>
              <h1 className="text-2xl font-bold">Sign in</h1>
              <p className="mt-1 text-sm text-muted">Management System for staff and partners.</p>
              {error && <p className="mt-4 rounded-lg bg-soft px-3 py-2 text-sm text-fg">{error}</p>}
              <Input label="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" required />
              <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
              <div className="mt-3 flex justify-end"><button type="button" onClick={() => setState('forgot')} className="text-sm font-semibold text-accent">Forgot password?</button></div>
              <Submit>Continue</Submit>
              <p className="mt-6 text-center text-sm text-muted">Invited partner or finance user? <button type="button" onClick={() => setState('invite')} className="font-semibold text-accent">Accept invite</button></p>
            </form>
          )}

          {state === 'forgot' && (
            <div>
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="mt-1 text-sm text-muted">Self-service reset isn’t available yet. Contact your administrator to reset your password.</p>
              <button type="button" onClick={() => setState('login')} className="mt-6 w-full text-sm font-semibold text-muted hover:text-fg">Back to sign in</button>
            </div>
          )}

          {state === 'invite' && (
            <form onSubmit={acceptInvite}>
              <h1 className="text-2xl font-bold">Accept your invitation</h1>
              <p className="mt-1 text-sm text-muted">Only invited Partner or Finance users can create an account.</p>
              {error && <p className="mt-4 rounded-lg bg-soft px-3 py-2 text-sm text-fg">{error}</p>}
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Invite token" value={inviteToken} onChange={(e) => setInviteToken(e.target.value)} required />
              <Input label="Create password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} type="password" required minLength={8} />
              <label className="mt-4 flex gap-2 text-sm text-muted"><input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#B5D300]" />I consent to NextWave processing my personal information under POPIA.</label>
              <Submit>Accept invite</Submit>
              <button type="button" onClick={() => setState('login')} className="mt-4 w-full text-sm font-semibold text-muted hover:text-fg">Back to sign in</button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export const args = { state: 'login', email: '' }
export const argTypes = { state: { control: 'select', options: ['login', 'forgot', 'invite'] }, email: { control: 'text' } }

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="mt-4 block text-sm font-semibold text-fg">{label}<input {...p} style={{ color: "#050507", opacity: 1, WebkitTextFillColor: "#050507" }} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base font-normal text-black outline-none placeholder:!text-black placeholder:!opacity-100 focus:border-fg/40" /></label>
}
function Submit({ children }: { children: React.ReactNode }) { return <button type="submit" className="mt-6 w-full rounded-lg bg-lime py-2.5 text-sm !text-black font-bold transition-colors hover:bg-lime-hover">{children}</button> }
