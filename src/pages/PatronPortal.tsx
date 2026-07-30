import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, patronAuth } from '../lib/api'
import { SITE } from '../config/site'

interface PatronData {
  id: string
  name: string
  email: string | null
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

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ patron, onLogout }: { patron: PatronData; onLogout: () => void }) {
  const [tab, setTab] = useState<'overview' | 'history'>('overview')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loaded, setLoaded] = useState(false)
  const [historyTab, setHistoryTab] = useState<'spends' | 'redemptions'>('spends')

  const token = patronAuth.getToken()

  async function loadHistory() {
    if (loaded) return
    try {
      const [tx, rd] = await Promise.all([
        api.get<{ content: Transaction[] }>('/coupons/me/transactions?size=50', token),
        api.get<{ content: Redemption[] }>('/coupons/me/redemptions?size=50', token),
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
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ background: '#C8873A', color: '#fff' }}>{i + 1}</span>
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
  const navigate = useNavigate()
  const [patron, setPatron] = useState<PatronData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = patronAuth.getToken()
    if (!token) {
      navigate('/login?next=/patrons', { replace: true })
      return
    }
    api.get<PatronData>('/patrons/me', token)
      .then(data => setPatron(data))
      .catch(() => {
        // Token invalid or expired
        patronAuth.clear()
        navigate('/login?next=/patrons', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    patronAuth.clear()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f0a' }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-amber-500 animate-spin" />
      </div>
    )
  }

  return patron ? <Dashboard patron={patron} onLogout={handleLogout} /> : null
}
