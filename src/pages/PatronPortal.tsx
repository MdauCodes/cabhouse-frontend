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

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
}

// Short member ID from UUID
function memberId(id: string) {
  return `CH-${id.slice(0, 6).toUpperCase()}`
}

// ── Membership card ───────────────────────────────────────────────────────────
function MemberCard({ patron }: { patron: PatronData }) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] mx-auto"
      style={{
        background: 'linear-gradient(140deg, #1c1108 0%, #2e1c0a 40%, #1a2e1f 100%)',
        border: '1px solid rgba(200,135,58,0.25)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,135,58,0.08), inset 0 1px 0 rgba(200,135,58,0.12)',
        maxWidth: 380,
        aspectRatio: '1.586',
        width: '100%',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent 0, transparent 22px,
          rgba(200,135,58,0.03) 22px, rgba(200,135,58,0.03) 23px
        )`,
      }} />

      {/* Radial glows */}
      <div className="absolute" style={{ top: '-20%', right: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,135,58,0.15) 0%, transparent 70%)' }} />
      <div className="absolute" style={{ bottom: '-20%', left: '-5%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)' }} />

      {/* Top hairline */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200,135,58,0.4), transparent)' }} />

      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top: logo + member badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C8873A, #a06020)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-white/70 text-xs tracking-wide">CabHouse</span>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ background: 'rgba(200,135,58,0.15)', border: '1px solid rgba(200,135,58,0.3)', color: '#C8873A' }}
          >
            Member
          </span>
        </div>

        {/* Middle: coupon balance */}
        <div>
          <p className="text-white/35 text-[9px] font-body uppercase tracking-[0.25em] mb-1">Coupon Balance</p>
          <div className="flex items-end gap-2">
            <span className="font-display font-black text-white" style={{ fontSize: '3.2rem', lineHeight: 1, letterSpacing: '-0.05em' }}>
              {patron.couponBalance}
            </span>
            <span className="text-white/35 font-body text-sm mb-1.5">
              {patron.couponBalance === 1 ? 'coupon' : 'coupons'}
            </span>
          </div>
        </div>

        {/* Bottom: name + member ID */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/35 text-[8px] font-body uppercase tracking-[0.2em] mb-0.5">Cardholder</p>
            <p className="text-white font-body font-bold text-sm tracking-wide">{patron.name.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-white/35 text-[8px] font-body uppercase tracking-[0.2em] mb-0.5">Member ID</p>
            <p className="text-white/50 font-mono text-xs">{memberId(patron.id)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ patron, onLogout }: { patron: PatronData; onLogout: () => void }) {
  const [tab, setTab] = useState<'overview' | 'activity'>('overview')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loaded, setLoaded] = useState(false)
  const [activityFilter, setActivityFilter] = useState<'all' | 'earned' | 'redeemed'>('all')

  const token = patronAuth.getToken()

  async function loadActivity() {
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

  function handleTabChange(t: 'overview' | 'activity') {
    setTab(t)
    if (t === 'activity') loadActivity()
  }

  // Merged timeline
  type ActivityItem =
    | { kind: 'earn'; id: string; date: string; amount: number; coupons: number; note: string | null }
    | { kind: 'redeem'; id: string; date: string; value: number; coupons: number; note: string | null }

  const timeline: ActivityItem[] = [
    ...transactions.map(tx => ({ kind: 'earn' as const, id: tx.id, date: tx.createdAt, amount: tx.amount, coupons: tx.couponsAwarded, note: tx.note })),
    ...redemptions.map(r => ({ kind: 'redeem' as const, id: r.id, date: r.createdAt, value: r.valueRedeemed, coupons: r.couponsRedeemed, note: r.note })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filtered = activityFilter === 'all' ? timeline
    : timeline.filter(t => activityFilter === 'earned' ? t.kind === 'earn' : t.kind === 'redeem')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080c08' }}>

      {/* ── Top nav ── */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8873A, #a06020)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-white/60 text-xs">Member Portal</span>
        </div>
        <button
          onClick={onLogout}
          className="text-white/30 hover:text-white/70 text-xs font-body transition-colors flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>

      {/* ── Greeting ── */}
      <div className="px-5 pt-6 pb-5">
        <p className="text-white/35 font-body text-xs mb-0.5">Welcome back</p>
        <h1 className="font-display font-black text-white" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', letterSpacing: '-0.03em' }}>
          {patron.name.split(' ')[0]}
        </h1>
      </div>

      {/* ── Membership card ── */}
      <div className="px-5 mb-7">
        <MemberCard patron={patron} />
      </div>

      {/* ── Quick stats row ── */}
      <div className="px-5 mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Balance', value: `${patron.couponBalance}`, sub: 'coupons' },
          { label: 'Phone', value: patron.phone.slice(-4), sub: `···${patron.phone.slice(-4)}` },
          { label: 'Since', value: new Date(patron.createdAt).getFullYear().toString(), sub: fmtMonth(patron.createdAt).split(' ')[0] },
        ].map(s => (
          <div key={s.label} className="rounded-2xl px-3 py-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white/30 text-[9px] font-body uppercase tracking-[0.15em] mb-1">{s.label}</p>
            <p className="text-white font-display font-black text-xl" style={{ letterSpacing: '-0.03em' }}>{s.value}</p>
            <p className="text-white/30 text-[9px] font-body mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="px-5 mb-5">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {([['overview', 'Overview'], ['activity', 'Activity']] as const).map(([t, label]) => (
            <button key={t} onClick={() => handleTabChange(t)}
              className="flex-1 py-2.5 rounded-lg font-body font-semibold text-sm transition-all"
              style={{
                background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-5 flex-1 pb-10">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-4">

            {/* Present at checkout */}
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(200,135,58,0.12), rgba(200,135,58,0.04))', border: '1px solid rgba(200,135,58,0.2)' }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,135,58,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8873A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-body font-semibold text-sm mb-0.5">Present at checkout</p>
                  <p className="text-white/45 font-body text-xs leading-relaxed">Give your phone number <span className="text-white/60 font-semibold">{patron.phone}</span> at any CabHouse service point to earn or redeem coupons.</p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/35 text-[10px] font-body uppercase tracking-[0.2em] mb-4">How it works</p>
              <div className="space-y-4">
                {[
                  { n: '1', title: 'Visit & spend', body: 'Pay for any CabHouse service — park entry, apartments, events, or water.' },
                  { n: '2', title: 'Earn coupons', body: 'Give your phone number at checkout. Coupons are added instantly.' },
                  { n: '3', title: 'Redeem on next visit', body: 'Use your coupons for discounts on future visits. No expiry.' },
                ].map(step => (
                  <div key={step.n} className="flex gap-3.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#C8873A', color: '#fff', fontSize: 10, fontWeight: 900 }}>
                      {step.n}
                    </div>
                    <div>
                      <p className="text-white font-body font-semibold text-sm">{step.title}</p>
                      <p className="text-white/40 font-body text-xs mt-0.5 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all hover:brightness-110"
              style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.18)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#25D366' }}>
                  <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-body font-semibold text-sm">Message us on WhatsApp</p>
                  <p className="text-white/40 font-body text-xs">Questions, bookings, help</p>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <div>
            {/* Filter pills */}
            <div className="flex gap-2 mb-5">
              {([['all', 'All'], ['earned', 'Earned'], ['redeemed', 'Redeemed']] as const).map(([f, label]) => (
                <button key={f} onClick={() => setActivityFilter(f)}
                  className="px-4 py-1.5 rounded-full font-body text-xs font-semibold transition-all"
                  style={{
                    background: activityFilter === f ? '#C8873A' : 'rgba(255,255,255,0.06)',
                    color: activityFilter === f ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: activityFilter === f ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Loading */}
            {!loaded && (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-amber-500 animate-spin" />
                <p className="text-white/25 text-xs font-body">Loading activity…</p>
              </div>
            )}

            {/* Empty state */}
            {loaded && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p className="text-white/30 text-sm font-body">No activity yet</p>
                <p className="text-white/18 text-xs font-body">Visit CabHouse to earn your first coupons</p>
              </div>
            )}

            {/* Timeline */}
            {loaded && filtered.length > 0 && (
              <div className="space-y-2.5">
                {filtered.map(item => (
                  <div
                    key={item.id}
                    className="rounded-2xl p-4 flex items-center gap-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: item.kind === 'earn'
                          ? 'rgba(200,135,58,0.15)'
                          : 'rgba(248,113,113,0.12)',
                      }}
                    >
                      {item.kind === 'earn' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8873A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                        </svg>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-body font-semibold text-sm">
                        {item.kind === 'earn'
                          ? `Spent KES ${Number(item.amount).toLocaleString()}`
                          : `Redeemed KES ${Number(item.value).toLocaleString()}`}
                      </p>
                      {item.note && <p className="text-white/30 text-xs font-body truncate mt-0.5">{item.note}</p>}
                      <p className="text-white/25 text-[10px] font-body mt-0.5">{fmt(item.date)}</p>
                    </div>

                    {/* Coupon badge */}
                    <div className="shrink-0 text-right">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full font-body font-black text-xs"
                        style={{
                          background: item.kind === 'earn'
                            ? 'rgba(200,135,58,0.15)'
                            : 'rgba(248,113,113,0.12)',
                          color: item.kind === 'earn' ? '#C8873A' : '#f87171',
                        }}
                      >
                        {item.kind === 'earn' ? '+' : '-'}{item.coupons}
                      </span>
                      <p className="text-white/20 text-[9px] font-body mt-1">
                        {item.coupons === 1 ? 'coupon' : 'coupons'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080c08' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-amber-500 animate-spin" />
          <p className="text-white/25 text-xs font-body">Loading your membership…</p>
        </div>
      </div>
    )
  }

  return patron ? <Dashboard patron={patron} onLogout={handleLogout} /> : null
}
