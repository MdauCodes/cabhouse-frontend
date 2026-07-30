import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const emailFromUrl = params.get('email') ?? ''

  const [email, setEmail] = useState(emailFromUrl)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    setError('')
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      inputRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const otpValue = otp.join('')
  const canSubmit = email.trim() && otpValue.length === 6 && password.length >= 8 && password === confirm

  async function handleSubmit() {
    if (!canSubmit) return
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otpValue, newPassword: password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Reset failed. Please try again.')
        return
      }
      setDone(true)
    } catch {
      setError('Unable to reach server. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#080c08' }}>
        <div className="relative w-full max-w-sm text-center">
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display font-black text-white text-2xl mb-3" style={{ letterSpacing: '-0.03em' }}>Password updated</h1>
          <p className="text-white/50 text-sm font-body mb-8">Your password has been changed. You can now sign in with your new password.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide"
            style={{ backgroundColor: '#C8873A', color: '#fff' }}
          >
            Go to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#080c08' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(200,135,58,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: '#C8873A' }}>
            CabHouse Agencies
          </p>
          <h1 className="font-display font-black text-white text-2xl" style={{ letterSpacing: '-0.03em' }}>
            Enter reset code
          </h1>
        </div>

        <div
          className="rounded-3xl p-7 space-y-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Email field — pre-filled but editable */}
          {!emailFromUrl && (
            <div>
              <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl font-body text-white text-sm focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          )}

          {/* OTP input */}
          <div>
            <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-3">
              6-digit code from email
            </label>
            <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-white font-display font-black text-xl rounded-xl focus:outline-none transition-all"
                  style={{
                    background: digit ? 'rgba(200,135,58,0.15)' : 'rgba(255,255,255,0.06)',
                    border: digit ? '1px solid rgba(200,135,58,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">New password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3.5 pr-12 rounded-2xl font-body text-white text-sm focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">Confirm password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Repeat your new password"
              className="w-full px-4 py-3.5 rounded-2xl font-body text-white text-sm focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: confirm && confirm !== password
                  ? '1px solid rgba(248,113,113,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
              }}
            />
            {confirm && confirm !== password && (
              <p className="text-red-400 text-xs font-body mt-1">Passwords do not match</p>
            )}
          </div>

          {error && <p className="text-red-400 text-xs font-body">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-40"
            style={{ backgroundColor: '#C8873A', color: '#fff' }}
          >
            {loading ? 'Updating…' : 'Set new password'}
          </button>
        </div>

        <div className="text-center mt-6 space-y-2">
          <button
            onClick={() => navigate('/forgot-password')}
            className="block w-full text-white/30 hover:text-white/50 text-xs font-body transition-colors"
          >
            Didn't get a code? Send again
          </button>
          <button
            onClick={() => navigate('/login')}
            className="block w-full text-white/20 hover:text-white/40 text-xs font-body transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}
