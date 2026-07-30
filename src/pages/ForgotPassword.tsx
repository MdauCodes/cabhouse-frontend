import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

type Step = 'email' | 'sent'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    const e = email.trim()
    if (!e) return
    setLoading(true)
    setError('')
    try {
      await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e }),
      })
      // Always show "sent" — backend silently succeeds for unknown emails
      setStep('sent')
    } catch {
      setError('Unable to reach server. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#080c08' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(200,135,58,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #C8873A 0%, #a06020 100%)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.35em] mb-1" style={{ color: '#C8873A' }}>
            CabHouse Agencies
          </p>
          <h1 className="font-display font-black text-white text-2xl" style={{ letterSpacing: '-0.03em' }}>
            {step === 'email' ? 'Reset password' : 'Check your email'}
          </h1>
        </div>

        <div
          className="rounded-3xl p-7"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {step === 'email' ? (
            <div className="space-y-4">
              <p className="text-white/50 text-sm font-body leading-relaxed">
                Enter your account email address and we'll send you a 6-digit code to reset your password.
              </p>
              <div>
                <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl font-body text-white text-sm focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: error ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                {error && <p className="text-red-400 text-xs font-body mt-2">{error}</p>}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!email.trim() || loading}
                className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-40"
                style={{ backgroundColor: '#C8873A', color: '#fff' }}
              >
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              <div
                className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-body font-semibold mb-2">Code sent to</p>
                <p className="text-white/60 text-sm font-body">{email}</p>
              </div>
              <p className="text-white/40 text-xs font-body leading-relaxed">
                Check your inbox for a 6-digit code. It expires in 10 minutes. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all"
                style={{ backgroundColor: '#C8873A', color: '#fff' }}
              >
                Enter reset code
              </button>
              <button
                onClick={() => setStep('email')}
                className="text-white/30 hover:text-white/60 text-xs font-body transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-white/30 hover:text-white/50 text-xs font-body transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}
