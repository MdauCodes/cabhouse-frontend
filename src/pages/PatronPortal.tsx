import { useState } from 'react'
import { api, patronSession } from '../lib/api'
import { SITE } from '../config/site'

interface PatronData {
  id: string
  name: string
  phone: string
  couponBalance: number
  createdAt: string
}

interface Transaction {
  id: string
  amount: number
  couponsAwarded: number
  note: string | null
  createdAt: string
}

interface Redemption {
  id: string
  couponsRedeemed: number
  valueRedeemed: number
  note: string | null
  createdAt: string
}

// ── PIN pad ──────────────────────────────────────────────────────────────────
function PinPad({ pin, onChange }: { pin: string; onChange: (p: string) => void }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']
  return (
    <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mt-4">
      {keys.map((k, i) => {
        if (k === '') return <div key={i} />
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (k === '⌫') onChange(pin.slice(0, -1))
              else if (pin.length < 4) onChange(pin + k)
            }}
            className="h-14 rounded-2xl font-display font-bold text-xl transition-all duration-100 active:scale-95"
            style={{
              background: k === '⌫' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
              color: k === '⌫' ? 'rgba(255,255,255,0.5)' : '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {k}
          </button>
        )
      })}
    </div>
  )
}

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (data: PatronData) => void }) {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (pin.length !== 4) return
    setError('')
    setLoading(true)
    try {
      const data = await api.post<PatronData>('/patrons/login', { phone, pin })
      patronSession.set(data)
      onLogin(data)
    } catch (e: any) {
      setError(e.message ?? 'Login failed')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0f0a' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-6 text-center">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#C8873A' }}>
          CabHouse Agencies
        </p>
        <h1 className="font-display font-black text-white text-2xl mb-1" style={{ letterSpacing: '-0.03em' }}>
          Patron Portal
        </h1>
        <p className="text-white/40 text-sm font-body">Your coupons and rewards</p>
      </div>

      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        {step === 'phone' ? (
          <>
            <label className="text-white/60 text-xs font-body uppercase tracking-widest mb-2">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+254 700 000 000"
              className="w-full px-4 py-4 rounded-2xl font-body text-white text-lg bg-white/8 border border-white/10 focus:outline-none focus:border-white/30 placeholder:text-white/20 mb-4"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <button
              onClick={() => { if (phone.trim()) { setError(''); setStep('pin') } }}
              disabled={!phone.trim()}
              className="w-full py-4 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all"
              style={{ backgroundColor: phone.trim() ? '#C8873A' : 'rgba(200,135,58,0.3)', color: '#fff' }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setStep('phone'); setPin(''); setError('') }}
                className="text-white/40 hover:text-white transition-colors text-sm font-body flex items-center gap-1">
                ← Back
              </button>
              <p className="text-white/60 text-sm font-body">{phone}</p>
            </div>

            <p className="text-white/60 text-xs font-body uppercase tracking-widest mb-2 text-center">Enter your 4-digit PIN</p>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 my-4">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-4 h-4 rounded-full transition-all duration-150"
                  style={{ background: i < pin.length ? '#C8873A' : 'rgba(255,255,255,0.15)' }} />
              ))}
            </div>

            <PinPad pin={pin} onChange={p => { setPin(p); setError('') }} />

            {error && (
              <p className="text-red-400 text-sm font-body text-center mt-4">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={pin.length !== 4 || loading}
              className="w-full py-4 rounded-2xl font-body font-bold text-sm uppercase tracking-wide transition-all mt-6"
              style={{ backgroundColor: pin.length === 4 ? '#C8873A' : 'rgba(200,135,58,0.3)', color: '#fff' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </>
        )}

        {error && step === 'phone' && (
          <p className="text-red-400 text-sm font-body text-center mt-3">{error}</p>
        )}

        <p className="text-white/20 text-xs text-center font-body mt-8">
          Not a patron yet? Ask staff at CabHouse to enroll you — it's free.
        </p>
      </div>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ patron, onLogout }: { patron: PatronData; onLogout: () => void }) {
  const [tab, setTab] = useState<'overview' | 'history'>('overview')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loaded, setLoaded] = useState(false)
  const [historyTab, setHistoryTab] = useState<'spends' | 'redemptions'>('spends')

  async function loadHistory() {
    if (loaded) return
    try {
      const [tx, rd] = await Promise.all([
        api.get<{ content: Transaction[] }>(`/coupons/patrons/${patron.id}/transactions?size=50`),
        api.get<{ content: Redemption[] }>(`/coupons/patrons/${patron.id}/redemptions?size=50`),
      ])
      setTransactions(tx.content)
      setRedemptions(rd.content)
      setLoaded(true)
    } catch {}
  }

  function handleTabChange(t: 'overview' | 'history') {
    setTab(t)
    if (t === 'history') loadHistory()
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0f0a' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: '#C8873A' }}>
              CabHouse Patron
            </p>
            <h2 className="font-display font-black text-white text-2xl" style={{ letterSpacing: '-0.02em' }}>
              {patron.name}
            </h2>
            <p className="text-white/40 text-xs font-body mt-0.5">{patron.phone}</p>
          </div>
          <button onClick={onLogout} className="text-white/30 hover:text-white text-xs font-body transition-colors mt-1">
            Sign out
          </button>
        </div>
      </div>

      {/* Coupon balance card */}
      <div className="px-6 mb-6">
        <div className="rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #1a2e1f 0%, #0d1f11 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Coupon Balance
          </p>
          <p className="font-display font-black text-white mb-1" style={{ fontSize: '3.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>
            {patron.couponBalance}
          </p>
          <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {patron.couponBalance === 1 ? 'coupon' : 'coupons'} available to redeem
          </p>
          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Present your phone number at checkout to earn or redeem coupons.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-1 mb-6">
        {(['overview', 'history'] as const).map(t => (
          <button key={t} onClick={() => handleTabChange(t)}
            className="flex-1 py-2.5 rounded-xl font-body font-semibold text-sm capitalize transition-all"
            style={{
              background: tab === t ? '#C8873A' : 'rgba(255,255,255,0.06)',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 flex-1">
        {tab === 'overview' && (
          <div className="space-y-3">
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-xs font-body uppercase tracking-widest mb-1">Member since</p>
              <p className="text-white font-body font-semibold">{new Date(patron.createdAt).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-xs font-body uppercase tracking-widest mb-1">How it works</p>
              <ul className="space-y-2 mt-2">
                {[
                  'Pay for any CabHouse service',
                  'Give your phone number to earn coupons',
                  'Redeem coupons for discounts on future visits',
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ background: '#C8873A', color: '#fff' }}>{i+1}</span>
                    <span className="text-white/60 text-sm font-body">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
              className="block w-full py-4 rounded-2xl text-center font-body font-bold text-sm transition-all"
              style={{ background: '#1a2e1f', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
              Contact us on WhatsApp
            </a>
          </div>
        )}

        {tab === 'history' && (
          <div>
            <div className="flex gap-1 mb-4">
              {(['spends', 'redemptions'] as const).map(t => (
                <button key={t} onClick={() => setHistoryTab(t)}
                  className="flex-1 py-2 rounded-xl font-body text-sm capitalize transition-all"
                  style={{
                    background: historyTab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: historyTab === t ? '#fff' : 'rgba(255,255,255,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {t}
                </button>
              ))}
            </div>

            {!loaded && (
              <div className="text-center py-10">
                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-amber-500 animate-spin mx-auto" />
              </div>
            )}

            {loaded && historyTab === 'spends' && (
              transactions.length === 0
                ? <p className="text-white/30 text-sm font-body text-center py-10">No spend history yet</p>
                : <div className="space-y-2">
                    {transactions.map(tx => (
                      <div key={tx.id} className="rounded-2xl p-4 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div>
                          <p className="text-white font-body font-semibold text-sm">KES {Number(tx.amount).toLocaleString()}</p>
                          <p className="text-white/30 text-xs font-body mt-0.5">{fmt(tx.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body font-bold text-sm" style={{ color: '#C8873A' }}>+{tx.couponsAwarded}</p>
                          <p className="text-white/30 text-xs font-body">coupons</p>
                        </div>
                      </div>
                    ))}
                  </div>
            )}

            {loaded && historyTab === 'redemptions' && (
              redemptions.length === 0
                ? <p className="text-white/30 text-sm font-body text-center py-10">No redemptions yet</p>
                : <div className="space-y-2">
                    {redemptions.map(r => (
                      <div key={r.id} className="rounded-2xl p-4 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div>
                          <p className="text-white font-body font-semibold text-sm">KES {Number(r.valueRedeemed).toLocaleString()} redeemed</p>
                          <p className="text-white/30 text-xs font-body mt-0.5">{fmt(r.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body font-bold text-sm text-red-400">-{r.couponsRedeemed}</p>
                          <p className="text-white/30 text-xs font-body">coupons</p>
                        </div>
                      </div>
                    ))}
                  </div>
            )}
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  )
}

// ── Page entry ───────────────────────────────────────────────────────────────
export default function PatronPortal() {
  const saved = patronSession.get() as PatronData | null
  const [patron, setPatron] = useState<PatronData | null>(saved)

  function handleLogout() {
    patronSession.clear()
    setPatron(null)
  }

  return patron
    ? <Dashboard patron={patron} onLogout={handleLogout} />
    : <LoginScreen onLogin={setPatron} />
}
