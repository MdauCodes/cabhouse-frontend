import { useState, useEffect } from 'react'
import { api, staffAuth } from '../lib/api'

interface StaffSession {
  accessToken: string
  username: string
  role: string
}

interface Patron {
  id: string
  name: string
  phone: string
  couponBalance: number
}

interface CouponSettings {
  baseAmount: number
  couponValue: number
}

// ── Staff login ──────────────────────────────────────────────────────────────
function StaffLogin({ onLogin }: { onLogin: (s: StaffSession) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.post<{ accessToken: string; username: string; role: string }>(
        '/auth/login', { username, password }
      )
      if (data.role !== 'STAFF' && data.role !== 'ADMIN' && data.role !== 'SUPERADMIN') {
        throw new Error('Access denied')
      }
      staffAuth.setToken(data.accessToken)
      onLogin(data)
    } catch (e: any) {
      setError(e.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0c0c10' }}>
      <div className="w-full max-w-sm">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] mb-2 text-center" style={{ color: '#C8873A' }}>
          CabHouse Staff
        </p>
        <h1 className="font-display font-black text-white text-2xl text-center mb-8" style={{ letterSpacing: '-0.03em' }}>
          POS Terminal
        </h1>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-4 py-4 rounded-2xl font-body text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-4 rounded-2xl font-body text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
          {error && <p className="text-red-400 text-sm font-body text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all"
            style={{ backgroundColor: '#C8873A', color: '#fff' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-white/20 text-xs text-center font-body mt-6">
          Staff credentials only — contact admin if locked out
        </p>
      </div>
    </div>
  )
}

// ── Enroll form modal ────────────────────────────────────────────────────────
function EnrollModal({
  phone,
  token,
  onDone,
  onClose,
}: {
  phone: string
  token: string
  onDone: (p: Patron) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (pin !== confirm) { setError('PINs do not match'); return }
    if (pin.length !== 4) { setError('PIN must be 4 digits'); return }
    setError('')
    setLoading(true)
    try {
      const patron = await api.post<Patron>('/patrons', { phone, name, pin }, token)
      onDone(patron)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6"
        style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>
        <h3 className="font-display font-bold text-white text-lg mb-1">Enroll New Member</h3>
        <p className="text-white/40 text-sm font-body mb-5">{phone}</p>
        <form onSubmit={handleEnroll} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="4-digit PIN"
            required
            className="w-full px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirm}
            onChange={e => setConfirm(e.target.value.replace(/\D/g, ''))}
            placeholder="Confirm PIN"
            required
            className="w-full px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
          {error && <p className="text-red-400 text-sm font-body">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-body text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl font-body text-sm font-bold"
              style={{ background: '#C8873A', color: '#fff' }}>
              {loading ? 'Enrolling…' : 'Enroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Redeem modal ─────────────────────────────────────────────────────────────
function RedeemModal({
  patron,
  settings,
  token,
  onDone,
  onClose,
}: {
  patron: Patron
  settings: CouponSettings | null
  token: string
  onDone: (newBalance: number) => void
  onClose: () => void
}) {
  const [coupons, setCoupons] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const n = parseInt(coupons) || 0
  const value = settings ? n * Number(settings.couponValue) : 0

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    if (n < 1 || n > patron.couponBalance) { setError('Invalid coupon count'); return }
    setLoading(true)
    try {
      await api.post('/coupons/redeem', { patronId: patron.id, coupons: n }, token)
      onDone(patron.couponBalance - n)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6"
        style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>
        <h3 className="font-display font-bold text-white text-lg mb-1">Redeem Coupons</h3>
        <p className="text-white/40 text-sm font-body mb-1">{patron.name}</p>
        <p className="font-body text-sm mb-5" style={{ color: '#C8873A' }}>
          Balance: {patron.couponBalance} coupon{patron.couponBalance !== 1 ? 's' : ''}
        </p>
        <form onSubmit={handleRedeem} className="space-y-3">
          <div>
            <input
              type="number"
              min={1}
              max={patron.couponBalance}
              value={coupons}
              onChange={e => { setCoupons(e.target.value); setError('') }}
              placeholder="How many coupons?"
              className="w-full px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/25 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
            />
            {n > 0 && settings && (
              <p className="text-white/50 text-xs font-body mt-2 pl-1">
                = KES {value.toLocaleString()} discount
              </p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm font-body">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-body text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || n < 1}
              className="flex-1 py-3 rounded-xl font-body text-sm font-bold transition-all"
              style={{ background: n >= 1 ? '#16a34a' : 'rgba(22,163,74,0.3)', color: '#fff' }}>
              {loading ? 'Processing…' : 'Redeem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── POS main screen ──────────────────────────────────────────────────────────
function POSScreen({ session, onLogout }: { session: StaffSession; onLogout: () => void }) {
  const token = session.accessToken
  const [phone, setPhone] = useState('')
  const [patron, setPatron] = useState<Patron | null>(null)
  const [settings, setSettings] = useState<CouponSettings | null>(null)
  const [lookupError, setLookupError] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [showEnroll, setShowEnroll] = useState(false)
  const [showRedeem, setShowRedeem] = useState(false)

  const [amount, setAmount] = useState('')
  const [spendNote, setSpendNote] = useState('')
  const [spendLoading, setSpendLoading] = useState(false)
  const [spendResult, setSpendResult] = useState<{ coupons: number } | null>(null)
  const [spendError, setSpendError] = useState('')

  const couponsPreview = settings && amount
    ? Math.floor(parseFloat(amount) / Number(settings.baseAmount))
    : 0

  async function loadSettings() {
    try {
      const s = await api.get<CouponSettings>('/coupons/settings', token)
      setSettings(s)
    } catch {}
  }

  async function lookup() {
    if (!phone.trim()) return
    setLookupError('')
    setLookupLoading(true)
    setPatron(null)
    setSpendResult(null)
    try {
      const p = await api.get<Patron>(`/patrons/lookup?phone=${encodeURIComponent(phone)}`, token)
      setPatron(p)
      loadSettings()
    } catch (e: any) {
      if (e.message?.toLowerCase().includes('not found')) {
        setLookupError('not_found')
      } else {
        setLookupError(e.message)
      }
    } finally {
      setLookupLoading(false)
    }
  }

  async function recordSpend(e: React.FormEvent) {
    e.preventDefault()
    if (!patron || !amount) return
    setSpendError('')
    setSpendLoading(true)
    setSpendResult(null)
    try {
      const tx = await api.post<{ couponsAwarded: number }>('/coupons/spend', {
        patronId: patron.id,
        amount: parseFloat(amount),
        note: spendNote || null,
      }, token)
      setSpendResult({ coupons: tx.couponsAwarded })
      setPatron(p => p ? { ...p, couponBalance: p.couponBalance + tx.couponsAwarded } : p)
      setAmount('')
      setSpendNote('')
    } catch (e: any) {
      setSpendError(e.message)
    } finally {
      setSpendLoading(false)
    }
  }

  function reset() {
    setPhone('')
    setPatron(null)
    setLookupError('')
    setSpendResult(null)
    setAmount('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0c0c10' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest font-bold" style={{ color: '#C8873A' }}>CabHouse POS</p>
          <p className="text-white/40 text-xs font-body mt-0.5">{session.username} · {session.role}</p>
        </div>
        <button onClick={onLogout}
          className="text-white/30 hover:text-white text-xs font-body transition-colors">
          Sign out
        </button>
      </div>

      <div className="px-5 flex-1">
        {/* Phone lookup */}
        <div className="mb-5">
          <label className="text-white/50 text-xs uppercase tracking-widest font-body mb-2 block">Member phone</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setLookupError(''); setPatron(null); setSpendResult(null) }}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              placeholder="+254 700 000 000"
              className="flex-1 px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/20 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
            />
            <button onClick={lookup} disabled={lookupLoading || !phone.trim()}
              className="px-5 py-3.5 rounded-xl font-body font-bold text-sm transition-all"
              style={{ background: phone.trim() ? '#C8873A' : 'rgba(200,135,58,0.25)', color: '#fff' }}>
              {lookupLoading ? '…' : 'Look up'}
            </button>
          </div>
        </div>

        {/* Not found prompt */}
        {lookupError === 'not_found' && (
          <div className="rounded-2xl p-4 mb-5 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-white font-body font-semibold text-sm">No member found</p>
              <p className="text-white/40 text-xs font-body mt-0.5">Would you like to enroll {phone}?</p>
            </div>
            <button onClick={() => setShowEnroll(true)}
              className="px-4 py-2 rounded-xl font-body font-bold text-xs transition-all"
              style={{ background: '#C8873A', color: '#fff' }}>
              Enroll
            </button>
          </div>
        )}

        {lookupError && lookupError !== 'not_found' && (
          <p className="text-red-400 text-sm font-body mb-4">{lookupError}</p>
        )}

        {/* Patron card */}
        {patron && (
          <>
            <div className="rounded-2xl p-4 mb-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg,#1a2e1f,#0d1f11)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-white font-body font-bold">{patron.name}</p>
                <p className="text-white/40 text-xs font-body mt-0.5">{patron.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-white text-2xl" style={{ letterSpacing: '-0.03em' }}>
                  {patron.couponBalance}
                </p>
                <p className="text-white/40 text-xs font-body">coupons</p>
              </div>
            </div>

            {/* Coupon rate hint */}
            {settings && (
              <p className="text-white/30 text-xs font-body mb-4 pl-1">
                Rate: KES {Number(settings.baseAmount).toLocaleString()} = 1 coupon · 1 coupon = KES {Number(settings.couponValue).toLocaleString()} value
              </p>
            )}

            {/* Record spend form */}
            <form onSubmit={recordSpend} className="space-y-3 mb-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest font-body mb-2 block">Amount spent (KES)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setSpendResult(null); setSpendError('') }}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-3.5 rounded-xl font-body text-white placeholder:text-white/20 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                />
                {amount && parseFloat(amount) > 0 && settings && (
                  <p className="text-white/50 text-xs font-body mt-1.5 pl-1">
                    Earns <span style={{ color: '#C8873A' }}>{couponsPreview} coupon{couponsPreview !== 1 ? 's' : ''}</span>
                  </p>
                )}
              </div>
              <input
                type="text"
                value={spendNote}
                onChange={e => setSpendNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-full px-4 py-3 rounded-xl font-body text-white placeholder:text-white/20 focus:outline-none text-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              />
              {spendError && <p className="text-red-400 text-sm font-body">{spendError}</p>}

              {spendResult && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <span className="text-green-400 text-lg">✓</span>
                  <p className="text-green-400 font-body text-sm font-semibold">
                    {spendResult.coupons > 0
                      ? `Recorded! +${spendResult.coupons} coupon${spendResult.coupons !== 1 ? 's' : ''} awarded`
                      : 'Spend recorded (no coupons earned at this amount)'}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit" disabled={spendLoading || !amount || parseFloat(amount) <= 0}
                  className="flex-1 py-3.5 rounded-xl font-body font-bold text-sm transition-all"
                  style={{
                    background: amount && parseFloat(amount) > 0 ? '#C8873A' : 'rgba(200,135,58,0.25)',
                    color: '#fff',
                  }}>
                  {spendLoading ? 'Recording…' : 'Record Spend'}
                </button>

                {patron.couponBalance > 0 && (
                  <button type="button" onClick={() => setShowRedeem(true)}
                    className="px-4 py-3.5 rounded-xl font-body font-bold text-sm transition-all"
                    style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.2)' }}>
                    Redeem
                  </button>
                )}
              </div>
            </form>

            <button onClick={reset}
              className="w-full py-3 rounded-xl font-body text-sm text-white/30 hover:text-white/60 transition-colors">
              Clear · look up another member
            </button>
          </>
        )}
      </div>

      {showEnroll && (
        <EnrollModal
          phone={phone}
          token={token}
          onDone={p => { setPatron(p); setShowEnroll(false); setLookupError(''); loadSettings() }}
          onClose={() => setShowEnroll(false)}
        />
      )}

      {showRedeem && patron && (
        <RedeemModal
          patron={patron}
          settings={settings}
          token={token}
          onDone={newBalance => {
            setPatron(p => p ? { ...p, couponBalance: newBalance } : p)
            setShowRedeem(false)
          }}
          onClose={() => setShowRedeem(false)}
        />
      )}

      <div className="h-8" />
    </div>
  )
}

// ── Page entry ───────────────────────────────────────────────────────────────
export default function StaffPOS() {
  const [session, setSession] = useState<StaffSession | null>(null)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    const token = staffAuth.getToken()
    if (!token) { setValidating(false); return }
    api.get<{ username: string; role: string }>('/auth/me', token)
      .then(data => {
        if (data.role === 'STAFF' || data.role === 'ADMIN' || data.role === 'SUPERADMIN') {
          setSession({ accessToken: token, username: data.username, role: data.role })
        } else {
          staffAuth.clear()
        }
      })
      .catch(() => staffAuth.clear())
      .finally(() => setValidating(false))
  }, [])

  function handleLogout() {
    staffAuth.clear()
    setSession(null)
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c10' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-white/30 text-xs font-body">Verifying session…</p>
        </div>
      </div>
    )
  }

  return session
    ? <POSScreen session={session} onLogout={handleLogout} />
    : <StaffLogin onLogin={s => { staffAuth.setToken(s.accessToken); setSession(s) }} />
}
