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

  // Redirect if already logged in
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
        setIdentityError(
          'No account found with that email or phone number. Try a different identifier, or contact CabHouse to be enrolled as a member.'
        )
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
      const role = data.role

      if (role === 'PATRON') {
        patronAuth.setToken(data.accessToken)
        navigate(next ?? '/patrons', { replace: true })
      } else if (role === 'STAFF') {
        staffAuth.setToken(data.accessToken)
        navigate(next ?? '/ch/pos', { replace: true })
      } else {
        // ADMIN or SUPERADMIN
        adminAuth.setSession(data.accessToken, data.username, data.role)
        navigate(next ?? '/ch/admin', { replace: true })
      }
    } catch {
      setPwError('Unable to reach server. Check your connection and try again.')
      setLoading(false)
    }
  }

  function handleIdentityKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') checkIdentity()
  }

  function handlePasswordKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#080c08' }}>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(200,135,58,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-10 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #C8873A 0%, #a06020 100%)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.35em] mb-1" style={{ color: '#C8873A' }}>
            CabHouse Agencies
          </p>
          <h1 className="font-display font-black text-white text-2xl" style={{ letterSpacing: '-0.03em' }}>
            Sign in
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {step === 'identity' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">
                  Email or phone number
                </label>
                <input
                  ref={identityRef}
                  type="text"
                  value={identity}
                  onChange={e => { setIdentity(e.target.value); setIdentityError('') }}
                  onKeyDown={handleIdentityKey}
                  placeholder="you@example.com or +254 700 000 000"
                  className="w-full px-4 py-3.5 rounded-2xl font-body text-white text-sm focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: identityError ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  autoComplete="username"
                />
                {identityError && (
                  <p className="text-red-400 text-xs font-body mt-2 leading-relaxed">{identityError}</p>
                )}
              </div>

              <button
                onClick={checkIdentity}
                disabled={!identity.trim() || checking}
                className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-40"
                style={{ backgroundColor: '#C8873A', color: '#fff' }}
              >
                {checking ? 'Checking…' : 'Continue'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Identity chip with back */}
              <button
                onClick={() => { setStep('identity'); setPassword(''); setPwError('') }}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-xs font-body mb-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="truncate max-w-[220px]">{identity.trim()}</span>
              </button>

              <div>
                <label className="block text-white/50 text-xs font-body uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={pwRef}
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPwError('') }}
                    onKeyDown={handlePasswordKey}
                    placeholder="Your password"
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl font-body text-white text-sm focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: pwError ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    autoComplete="current-password"
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
                {pwError && (
                  <p className="text-red-400 text-xs font-body mt-2">{pwError}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={!password || loading}
                className="w-full py-3.5 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-40"
                style={{ backgroundColor: '#C8873A', color: '#fff' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-white/35 hover:text-white/60 text-xs font-body transition-colors"
                >
                  Forgot password?
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Member self-registration hint */}
        <p className="text-white/20 text-xs text-center font-body mt-6 px-2 leading-relaxed">
          Not a member yet? Ask staff at CabHouse to enroll you — it's free. Members earn coupons on every visit.
        </p>
      </div>
    </div>
  )
}
