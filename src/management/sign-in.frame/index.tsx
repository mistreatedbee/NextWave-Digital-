import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

type Props = Partial<typeof args> & { onSignedIn?: () => void }

export default function SignIn(props: Props) {
  const { state: initial, email, onSignedIn } = { ...args, ...props }
  const [state, setState] = useState(initial)
  const [sent, setSent] = useState(false)
  return (
    <div className="flex min-h-screen w-full bg-bg font-sans text-fg">
      <aside className="hidden w-[44%] flex-col justify-between bg-ink p-12 text-white lg:flex">
        <div className="font-display text-2xl font-extrabold">NextWave <span className="text-lime">Digital Solutions</span></div>
        <div>
          <p className="font-display text-4xl font-bold leading-tight">Every lead, job and rand —<br />logged, split and paid on time.</p>
          <p className="mt-4 max-w-md text-white/60">Websites, apps, automation, marketing and tutoring, run from one place for the team and our partners.</p>
        </div>
        <p className="text-xs text-white/40">NextWave Digital Solutions (Pty) Ltd · Reg No. 2026/184607/07 · Johannesburg</p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="font-display mb-8 text-xl font-extrabold lg:hidden"><span className="rounded-md bg-ink px-2 py-1 text-white">NextWave</span> <span className="text-accent">Digital Solutions</span></div>

          {state === 'login' && (
            <form onSubmit={(e) => { e.preventDefault(); setState('2fa') }}>
              <h1 className="text-2xl font-bold">Sign in</h1>
              <p className="mt-1 text-sm text-muted">Management System for staff and partners.</p>
              <Input label="Email" defaultValue={email} type="email" />
              <Input label="Password" defaultValue="••••••••••" type="password" />
              <div className="mt-3 flex justify-end"><button type="button" onClick={() => setState('forgot')} className="text-sm font-semibold text-accent">Forgot password?</button></div>
              <Submit>Continue</Submit>
              <p className="mt-6 text-center text-sm text-muted">Got an invite? <button type="button" onClick={() => setState('invite')} className="font-semibold text-accent">Accept it here</button></p>
            </form>
          )}

          {state === 'forgot' && (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="mt-1 text-sm text-muted">We’ll email a reset link that expires in 30 minutes.</p>
              <Input label="Email" defaultValue={email} type="email" />
              {sent && <p role="status" className="mt-4 rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">Reset link sent to {email}.</p>}
              <Submit>Send reset link</Submit>
              <button type="button" onClick={() => setState('login')} className="mt-4 w-full text-sm font-semibold text-muted hover:text-fg">Back to sign in</button>
            </form>
          )}

          {state === '2fa' && (
            <form onSubmit={(e) => { e.preventDefault(); onSignedIn?.() }}>
              <ShieldCheck className="mb-3 h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold">Two-factor check</h1>
              <p className="mt-1 text-sm text-muted">Enter the 6-digit code from your authenticator app.</p>
              <div className="mt-6 grid grid-cols-6 gap-2">
                {['4', '8', '1', '9', '0', '3'].map((n, i) => <input key={i} defaultValue={n} maxLength={1} className="h-12 rounded-lg border border-line bg-card text-center text-lg font-bold outline-none focus:border-fg/40" />)}
              </div>
              <Submit>Verify & sign in</Submit>
              <button type="button" onClick={() => setState('login')} className="mt-4 w-full text-sm font-semibold text-muted hover:text-fg">Use a different account</button>
            </form>
          )}

          {state === 'invite' && (
            <form onSubmit={(e) => { e.preventDefault(); setState('2fa') }}>
              <h1 className="text-2xl font-bold">Join NextWave</h1>
              <p className="mt-1 text-sm text-muted">Kabelo Sithole invited you as a <b className="text-fg">Partner</b> (30-day trial).</p>
              <Input label="Full name" defaultValue="Johan van Wyk" />
              <Input label="Email" defaultValue="johan@nextwave.co.za" type="email" />
              <Input label="Create password" defaultValue="" type="password" />
              <label className="mt-4 flex gap-2 text-sm text-muted"><input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-[#B5D300]" />I consent to NextWave processing my personal information under POPIA.</label>
              <Submit>Accept invite</Submit>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export const args = {
  state: 'login',
  email: 'kabelo@nextwave.co.za',
}

export const argTypes = {
  state: { control: 'select', options: ['login', 'forgot', '2fa', 'invite'] },
  email: { control: 'text' },
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="mt-4 block text-sm font-semibold text-fg">{label}<input {...p} className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-base font-normal text-fg outline-none focus:border-fg/40" /></label>
}

function Submit({ children }: { children: React.ReactNode }) {
  return <button type="submit" className="mt-6 w-full rounded-lg bg-lime py-2.5 text-sm font-bold text-ink transition-colors duration-150 hover:bg-lime-hover">{children}</button>
}
