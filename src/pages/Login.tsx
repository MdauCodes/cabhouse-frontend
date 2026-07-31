import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminAuth, patronAuth, staffAuth } from '../lib/api'

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

interface TokenResponse {
  accessToken: string
  refreshToken: string | null
  userId: string
  username: string
  role: 'SUPERADMIN' | 'ADMIN' | 'STAFF' | 'PATRON'
}

type Step = 'identity' | 'password'

// ── Eye icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// ── Brand panel (right side) ──────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between p-12"
      style={{ background: 'linear-gradient(145deg, #0a1a09 0%, #0d2410 40%, #091508 100%)' }}
    >
      {/* Mesh glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,195,70,0.10) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,135,58,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Top: brand wordmark */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C8873A 0%, #a06020 100%)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">CabHouse Agencies</p>
            <p className="text-white/40 text-[10px] mt-0.5 font-body tracking-wide">Kisii, Kenya</p>
          </div>
        </div>
      </div>

      {/* Middle: headline */}
      <div className="relative space-y-5">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Member Portal</p>
        <h2
          className="font-display font-black text-white leading-[0.95]"
          style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', letterSpacing: '-0.04em' }}
        >
          Play.<br />
          <span style={{ color: '#C8873A' }}>Stay.</span><br />
          Celebrate.
        </h2>
        <p className="font-body text-white/45 text-sm leading-relaxed max-w-[32ch]">
          Log in to access your CabHouse membership — earn coupons, track your visits, and get exclusive offers.
        </p>
      </div>

      {/* Bottom: floating feature cards */}
      <div className="relative space-y-3">
        {[
          { icon: '🎯', label: 'Earn coupons on every visit' },
          { icon: '🎪', label: 'Exclusive member promotions' },
          { icon: '📅', label: 'View & manage bookings' },
        ].map(f => (
          <div
            key={f.label}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-base">{f.icon}</span>
            <span className="text-white/60 text-sm font-body">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Login ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') ?? null

  const [step, setStep] = useState<Step>('identity')
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [checking, setChecking] = useState(false)
  const [identityError, setIdentityError] = useState('')
  const [pwError, setPwError] = useState('')
  const [loading, setLoading] = useState(false)
  const identityRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const adminToken = adminAuth.getToken()
    const patronToken = patronAuth.getToken()
    if (adminToken) { navigate(next ?? '/ch/admin', { replace: true }); return }
    if (patronToken) { navigate(next ?? '/patrons', { replace: true }); return }
  }, [])

  useEffect(() => {
    if (step === 'identity') identityRef.current?.focus()
    if (step === 'password') pwRef.current?.focus()
  }, [step])

  async function checkIdentity() {
    const id = identity.trim()
    if (!id) return
    setChecking(true)
    setIdentityError('')
    try {
      const res = await fetch(`${API}/auth/exists?identity=${encodeURIComponent(id)}`)
      const json = await res.json()
      if (json.data?.found) {
        setStep('password')
      } else {
        setIdentityError('No account found. Try a different identifier or ask CabHouse staff to enroll you.')
      }
    } catch {
      setIdentityError('Unable to reach server. Check your connection and try again.')
    } finally {
      setChecking(false)
    }
  }

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setPwError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identity.trim(), password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setPwError(json.message ?? 'Incorrect password. Please try again.')
        setLoading(false)
        return
      }
      const data: TokenResponse = json.data
      if (data.role === 'PATRON') {
        patronAuth.setToken(data.accessToken)
        navigate(next ?? '/patrons', { replace: true })
      } else if (data.role === 'STAFF') {
        staffAuth.setToken(data.accessToken)
        navigate(next ?? '/ch/pos', { replace: true })
      } else {
        adminAuth.setSession(data.accessToken, data.username, data.role)
        navigate(next ?? '/ch/admin', { replace: true })
      }
    } catch {
      setPwError('Unable to reach server. Check your connection and try again.')
      setLoading(false)
    }
  }

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 14,
    color: '#fff',
    width: '100%',
    padding: '14px 16px',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
  const inputError: React.CSSProperties = { borderColor: 'rgba(248,113,113,0.6)' }
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(200,135,58,0.5)'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,135,58,0.12)'
  }
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#060a06' }}>

      {/* ── Left: Form panel ── */}
      <div
        className="flex flex-col justify-between w-full lg:w-[420px] lg:max-w-[480px] shrink-0 px-8 py-10 lg:py-12 relative"
        style={{ background: '#080c08', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,135,58,0.06) 0%, transparent 100%)' }} />

        {/* Top: logo */}
        <div className="relative">
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity group-hover:opacity-80"
              style={{ background: 'linear-gradient(135deg, #C8873A 0%, #a06020 100%)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-white/80 text-sm">CabHouse</span>
          </a>
        </div>

        {/* Middle: form */}
        <div className="relative space-y-8 my-8 lg:my-0">
          <div>
            <h1
              className="font-display font-black text-white mb-1.5"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', letterSpacing: '-0.035em' }}
            >
              Sign in
            </h1>
            <p className="text-white/35 font-body text-sm">
              {step === 'identity' ? 'Enter your email or phone to continue.' : 'Enter your password to access your account.'}
            </p>
          </div>

          <div className="space-y-4">
            {step === 'identity' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-white/45 text-[11px] font-body uppercase tracking-[0.18em]">
                    Email or phone number
                  </label>
                  <input
                    ref={identityRef}
                    type="text"
                    value={identity}
                    onChange={e => { setIdentity(e.target.value); setIdentityError('') }}
                    onKeyDown={e => e.key === 'Enter' && checkIdentity()}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    placeholder="you@example.com or +254 700 000 000"
                    autoComplete="username"
                    style={{ ...inputBase, ...(identityError ? inputError : {}) }}
                  />
                  {identityError && (
                    <p className="text-red-400 text-xs font-body leading-relaxed">{identityError}</p>
                  )}
                </div>

                <button
                  onClick={checkIdentity}
                  disabled={!identity.trim() || checking}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-35 hover:brightness-110"
                  style={{ backgroundColor: '#C8873A', color: '#fff', boxShadow: '0 4px 20px rgba(200,135,58,0.25)' }}
                >
                  {checking ? 'Checking…' : 'Continue'}
                </button>
              </>
            ) : (
              <>
                {/* Identity chip / back */}
                <button
                  onClick={() => { setStep('identity'); setPassword(''); setPwError('') }}
                  className="flex items-center gap-2 group mb-1"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white/60 transition-colors">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span className="text-white/40 group-hover:text-white/65 text-xs font-body truncate max-w-[200px] transition-colors">{identity.trim()}</span>
                </button>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-white/45 text-[11px] font-body uppercase tracking-[0.18em]">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      ref={pwRef}
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setPwError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      placeholder="Your password"
                      autoComplete="current-password"
                      style={{ ...inputBase, paddingRight: 48, ...(pwError ? inputError : {}) }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {pwError && (
                    <p className="text-red-400 text-xs font-body">{pwError}</p>
                  )}
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!password || loading}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-35 hover:brightness-110"
                  style={{ backgroundColor: '#C8873A', color: '#fff', boxShadow: '0 4px 20px rgba(200,135,58,0.25)' }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <p className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-white/30 hover:text-white/55 text-xs font-body transition-colors"
                  >
                    Forgot password?
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom: enroll hint */}
        <p className="relative text-white/18 text-[11px] text-center font-body leading-relaxed">
          Not a member yet? Visit CabHouse and ask staff to enroll you — it's free.
        </p>
      </div>

      {/* ── Right: Brand panel ── */}
      <BrandPanel />
    </div>
  )
}
