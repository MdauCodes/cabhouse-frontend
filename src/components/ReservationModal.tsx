import { useState, useEffect } from 'react'
import { X, Check, ChevronRight, ChevronLeft, Loader2, CalendarDays, Users, Phone, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react'

const BASE = import.meta.env.VITE_API_URL ?? 'https://cabhouse-kisii-backend-production.up.railway.app/api'

// ── Types ────────────────────────────────────────────────────────────────────

interface Resource {
  id: string
  name: string
  slug: string
  type: 'DAY_PACKAGE' | 'NIGHT_STAY' | 'VENUE'
  pricingUnit: 'PER_NIGHT' | 'PER_PAX' | 'PER_EVENT'
  basePrice: number
  depositType: 'FREE' | 'FLAT' | 'PERCENT'
  depositValue: number | null
  dailyVisitorCap: number | null
  bookingNote: string | null
  visible: boolean
}

interface AvailabilityDay {
  date: string
  booked: number
  cap: number
  available: boolean
}

interface ReservationResponse {
  id: string
  referenceCode: string
  depositAmount: number | null
  status: string
}

export type ResourceTypeFilter = 'DAY_PACKAGE' | 'NIGHT_STAY' | 'VENUE' | null

interface Props {
  onClose: () => void
  defaultType?: ResourceTypeFilter
  defaultResourceId?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(r: Resource): string {
  const p = `KES ${Number(r.basePrice).toLocaleString()}`
  return r.pricingUnit === 'PER_NIGHT' ? `${p}/night`
       : r.pricingUnit === 'PER_PAX'   ? `${p}/person`
       : p
}

function calcDeposit(r: Resource, guests: number): number {
  if (r.depositType === 'FREE') return 0
  if (r.depositType === 'FLAT') return Number(r.depositValue ?? 0)
  const pct = r.depositValue ?? 0
  return Math.ceil(r.basePrice * guests * pct / 100)
}

function fmtDeposit(r: Resource, guests: number): string {
  if (r.depositType === 'FREE') return 'No deposit required'
  if (r.depositType === 'FLAT') return `KES ${Number(r.depositValue ?? 0).toLocaleString()} deposit`
  const pct = r.depositValue ?? 0
  const amt = Math.ceil(r.basePrice * guests * pct / 100)
  return `KES ${amt.toLocaleString()} deposit (${pct}%)`
}

function toIso(d: Date) { return d.toISOString().split('T')[0] }
function today() { return toIso(new Date()) }

const TYPE_LABELS: Record<string, string> = {
  DAY_PACKAGE: 'Day Package',
  NIGHT_STAY:  'Night Stay',
  VENUE:       'Event Venue',
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReservationModal({ onClose, defaultType, defaultResourceId }: Props) {
  const [step, setStep] = useState(1)

  // Step 1 — resource
  const [resources, setResources] = useState<Resource[]>([])
  const [loadingRes, setLoadingRes] = useState(true)
  const [selectedRes, setSelectedRes] = useState<Resource | null>(null)
  const [typeFilter, setTypeFilter] = useState<ResourceTypeFilter>(defaultType ?? null)

  // Step 2 — date / guests
  const [checkIn, setCheckIn] = useState(today())
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [avail, setAvail] = useState<AvailabilityDay | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [availErr, setAvailErr] = useState('')

  // Step 3 — customer
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Step 4 — submit + result
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState('')
  const [result, setResult] = useState<ReservationResponse | null>(null)

  // Post-payment phase
  const [payPhase, setPayPhase] = useState<'instructions' | 'confirm' | 'done'>('instructions')
  const [mpesaCode, setMpesaCode] = useState('')
  const [mpesaName, setMpesaName] = useState('')
  const [paySubmitting, setPaySubmitting] = useState(false)
  const [payErr, setPayErr] = useState('')

  // Booking settings
  const [paybill, setPaybill] = useState('')
  const [account, setAccount] = useState('')
  const [instructions, setInstructions] = useState('')

  // ── Scroll lock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // ── Load resources + booking settings ──────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE}/reservations/resources/public`)
      .then(r => r.json())
      .then(j => {
        const list: Resource[] = (j.data ?? []).filter((r: Resource) => r.visible)
        setResources(list)
        if (defaultResourceId) {
          const found = list.find(r => r.id === defaultResourceId)
          if (found) { setSelectedRes(found); setStep(2) }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRes(false))

    fetch(`${BASE}/content/public/blocks`)
      .then(r => r.json())
      .then(j => {
        const blocks: { key: string; value: string }[] = j.data ?? []
        const m: Record<string, string> = {}
        blocks.forEach(b => { m[b.key] = b.value })
        setPaybill(m['booking.paybill'] ?? '')
        setAccount(m['booking.account'] ?? '')
        setInstructions(m['booking.instructions'] ?? '')
      })
      .catch(() => {})
  }, [])

  // ── Availability check ──────────────────────────────────────────────────────
  async function checkAvail() {
    if (!selectedRes || !checkIn) return
    setLoadingAvail(true); setAvailErr(''); setAvail(null)
    try {
      const url = `${BASE}/reservations/resources/public/${selectedRes.id}/availability?from=${checkIn}&to=${checkIn}`
      const res = await fetch(url)
      const json = await res.json()
      const days: AvailabilityDay[] = json.data ?? []
      setAvail(days[0] ?? null)
    } catch {
      setAvailErr('Could not check availability. Please continue.')
    } finally {
      setLoadingAvail(false)
    }
  }

  useEffect(() => {
    if (step === 2 && selectedRes && checkIn) checkAvail()
  }, [step, checkIn, selectedRes])

  // ── Submit booking ──────────────────────────────────────────────────────────
  async function submit() {
    if (!selectedRes) return
    setSubmitting(true); setSubmitErr('')
    try {
      const body: Record<string, unknown> = {
        resourceId: selectedRes.id,
        customerName: name,
        customerPhone: phone,
        customerEmail: email.trim(),
        guests,
        checkIn: checkIn || undefined,
      }
      if (selectedRes.type === 'NIGHT_STAY' && checkOut) body.checkOut = checkOut

      const res = await fetch(`${BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Submission failed')
      setResult(json.data as ReservationResponse)
      setPayPhase('instructions')
    } catch (e: any) {
      setSubmitErr(e.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Submit payment confirmation ─────────────────────────────────────────────
  async function submitPayment() {
    if (!result || !mpesaCode.trim() || !mpesaName.trim()) return
    setPaySubmitting(true); setPayErr('')
    try {
      const res = await fetch(`${BASE}/reservations/${result.id}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentReference: mpesaCode.trim(), paymentName: mpesaName.trim() }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Could not record payment')
      setPayPhase('done')
    } catch (e: any) {
      setPayErr(e.message ?? 'Something went wrong. Please try again.')
    } finally {
      setPaySubmitting(false)
    }
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered = typeFilter ? resources.filter(r => r.type === typeFilter) : resources
  const depositAmt = selectedRes ? calcDeposit(selectedRes, guests) : 0
  const needsDeposit = selectedRes?.depositType !== 'FREE' && depositAmt > 0
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canNext2 = !!checkIn && (avail == null || avail.available) && guests >= 1
  const canNext3 = name.trim().length >= 2 && phone.trim().length >= 9 && emailValid

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors font-body'

  // ── Post-booking screens ────────────────────────────────────────────────────
  if (result) {
    // ── Phase: Done ───────────────────────────────────────────────────────────
    if (payPhase === 'done') {
      return (
        <Overlay onClose={onClose}>
          <ModalHeader onClose={onClose} title="All Done!" subtitle="" />
          <div className="px-6 py-8 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                <Check size={28} className="text-white" />
              </div>
              <div>
                <p className="font-display font-black text-slate-900 text-lg">Payment details submitted</p>
                <p className="text-slate-500 text-sm mt-1">Our team will verify your M-Pesa payment and confirm your booking.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Your booking reference</p>
              <p className="font-mono text-xl font-black text-slate-900 tracking-widest">{result.referenceCode}</p>
              <p className="text-xs text-slate-400 mt-1">Quote this when you arrive</p>
            </div>

            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <Mail size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Check your email</p>
                <p className="text-slate-500 text-xs mt-0.5">A booking summary and payment instructions have been sent to <strong>{email}</strong>. You'll receive a second email once your booking is confirmed.</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-slate-800 mb-2">Become a CabHouse Member</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">Register for free to track all your bookings, earn loyalty coupons on every visit, and access exclusive member deals.</p>
              <a href="/login" onClick={onClose}
                className="block text-center font-body font-bold text-sm py-2.5 rounded-full text-white transition-all hover:brightness-110"
                style={{ backgroundColor: 'var(--color-gold)' }}>
                Create Member Account
              </a>
              <p className="text-center text-xs text-slate-400 mt-2">Use the same phone number you booked with</p>
            </div>

            <button onClick={onClose}
              className="w-full font-body font-semibold text-sm py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
        </Overlay>
      )
    }

    // ── Phase: Payment confirmation form ──────────────────────────────────────
    if (payPhase === 'confirm') {
      return (
        <Overlay onClose={onClose}>
          <ModalHeader onClose={onClose} title="Submit Payment Details" subtitle="So we can match your M-Pesa payment" />
          <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>

            {/* Booking context — shown so admin can match */}
            <div className="border border-slate-200 rounded-xl divide-y text-sm">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-xs">Booked under</span>
                <span className="font-semibold text-slate-800">{name}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-xs">Booking ref</span>
                <span className="font-mono font-black text-slate-900 tracking-widest">{result.referenceCode}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-xs">Amount paid</span>
                <span className="font-bold text-slate-800">KES {depositAmt.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Enter the M-Pesa details from the confirmation SMS you received after paying. Our team will use these to find and verify your payment.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  M-Pesa Transaction Code *
                </label>
                <input
                  value={mpesaCode}
                  onChange={e => setMpesaCode(e.target.value.toUpperCase())}
                  placeholder="e.g. QBD1A2B3C4"
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 mt-1">The code in the M-Pesa SMS you received after paying</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Name on your M-Pesa account *
                </label>
                <input
                  value={mpesaName}
                  onChange={e => setMpesaName(e.target.value)}
                  placeholder="Full name as registered on M-Pesa"
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 mt-1">The name our staff will see on the payment record</p>
              </div>
            </div>

            {payErr && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs">{payErr}</p>
              </div>
            )}

            <button
              onClick={submitPayment}
              disabled={paySubmitting || !mpesaCode.trim() || !mpesaName.trim()}
              className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              {paySubmitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Submit Payment Details'}
            </button>

            <button onClick={() => setPayPhase('instructions')}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1">
              Back to M-Pesa instructions
            </button>
          </div>
        </Overlay>
      )
    }

    // ── Phase: Payment instructions (default after booking created) ───────────
    return (
      <Overlay onClose={onClose}>
        <ModalHeader onClose={onClose} title="One Last Step" subtitle="Your spot is reserved — payment confirms it" />
        <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>

          {/* Pending-state banner — clearly not done yet */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Booking not yet confirmed</p>
              <p className="text-amber-700 text-xs mt-0.5">Your spot is temporarily held. Pay the deposit below to secure it — your booking is only confirmed after we verify your payment.</p>
            </div>
          </div>

          {needsDeposit ? (
            <>
              {/* Payment amount */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-slate-600 text-sm font-semibold">Deposit to pay now</span>
                <span className="font-black text-slate-900 text-xl">KES {depositAmt.toLocaleString()}</span>
              </div>

              {/* M-Pesa steps */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <p className="font-semibold text-slate-800 text-sm">Pay via M-Pesa</p>
                </div>
                <div className="px-4 py-4 space-y-3 text-sm">
                  {[
                    ['1', 'Open M-Pesa on your phone', ''],
                    ['2', 'Select Lipa na M-Pesa → Pay Bill', ''],
                    ['3', 'Enter Business Number', paybill ? `Paybill: ${paybill}` : ''],
                    ['4', 'Enter Account Number', account ? `Account: ${account}` : ''],
                    ['5', 'Enter Amount', `KES ${depositAmt.toLocaleString()}`],
                    ['6', 'Enter your M-Pesa PIN and confirm', ''],
                  ].map(([n, step, detail]) => (
                    <div key={n} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: 'var(--color-gold)' }}>
                        {n}
                      </span>
                      <div>
                        <p className="text-slate-700">{step}</p>
                        {detail && <p className="font-mono font-bold text-slate-900 text-base mt-0.5">{detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {instructions && (
                <p className="text-xs text-slate-400 leading-relaxed">{instructions}</p>
              )}

              <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-slate-600">
                <ShieldCheck size={14} className="text-green-600 mt-0.5 shrink-0" />
                <span>After paying, you'll receive an M-Pesa SMS with a transaction code. Click <strong>"I have paid"</strong> below and enter those details — we'll use them to match your payment.</span>
              </div>

              <button
                onClick={() => setPayPhase('confirm')}
                className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110"
                style={{ backgroundColor: 'var(--color-gold)' }}>
                <Check size={16} /> I have paid — enter my details
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-center">
              <p className="font-semibold text-slate-800">No deposit required</p>
              <p className="text-slate-500 mt-1 text-xs">Our team will contact you at {phone} to confirm your booking.</p>
            </div>
          )}

          {/* Reference — compact, not celebratory */}
          <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-slate-400 text-xs">Booking ref</span>
            <span className="font-mono font-black text-slate-800 tracking-widest text-sm">{result.referenceCode}</span>
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-slate-600">
            <Mail size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <span>A booking summary and payment instructions have been sent to <strong>{email}</strong></span>
          </div>

          {!needsDeposit && (
            <button onClick={onClose}
              className="w-full font-body font-semibold text-sm py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Done
            </button>
          )}
        </div>
      </Overlay>
    )
  }

  // ── Steps ───────────────────────────────────────────────────────────────────
  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        title={step === 1 ? 'Choose a Package' : step === 2 ? 'Pick a Date' : step === 3 ? 'Your Details' : 'Review & Confirm'}
        subtitle={`Step ${step} of 4`}
      />

      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-slate-100 shrink-0">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= step ? 'bg-brand-gold' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>

        {/* ── Step 1: Resource selection ── */}
        {step === 1 && (
          <div className="space-y-4">
            {resources.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {([null, 'DAY_PACKAGE', 'NIGHT_STAY', 'VENUE'] as ResourceTypeFilter[]).map(t => (
                  <button key={String(t)} onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${typeFilter === t ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                    {t ? TYPE_LABELS[t] : 'All'}
                  </button>
                ))}
              </div>
            )}
            {loadingRes ? (
              <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No packages available at this time.</p>
            ) : (
              <div className="space-y-2.5">
                {filtered.map(r => (
                  <button key={r.id} onClick={() => setSelectedRes(selectedRes?.id === r.id ? null : r)}
                    className={`w-full text-left border rounded-xl p-4 transition-all ${selectedRes?.id === r.id ? 'border-brand-gold bg-amber-50 ring-1 ring-brand-gold/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{TYPE_LABELS[r.type]}</p>
                        {r.bookingNote && <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{r.bookingNote}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800">{fmtPrice(r)}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{fmtDeposit(r, guests)}</p>
                      </div>
                    </div>
                    {selectedRes?.id === r.id && (
                      <div className="mt-2 flex items-center gap-1 text-[#C8873A] text-xs font-semibold">
                        <Check size={12} /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Date + Guests ── */}
        {step === 2 && selectedRes && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">Selected</p>
              <p className="font-semibold text-slate-800">{selectedRes.name}</p>
              <p className="text-sm text-slate-600">{fmtPrice(selectedRes)}</p>
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <CalendarDays size={12} className="inline mr-1" />
                {selectedRes.type === 'NIGHT_STAY' ? 'When are you checking in?' : 'When are you visiting?'} *
              </label>
              <input type="date" value={checkIn} min={today()} onChange={e => setCheckIn(e.target.value)} className={inputCls} />
            </div>
            {selectedRes.type === 'NIGHT_STAY' && (
              <div>
                <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                  <CalendarDays size={12} className="inline mr-1" />And checking out on?
                </label>
                <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} className={inputCls} />
              </div>
            )}
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Users size={12} className="inline mr-1" />How many of you are visiting? *
              </label>
              <input type="number" min={1} max={selectedRes.dailyVisitorCap ?? 500}
                value={guests} onChange={e => setGuests(Math.max(1, Number(e.target.value)))} className={inputCls} />
              <p className="text-xs text-slate-400 mt-1">
                Count everyone in your group{selectedRes.dailyVisitorCap ? ` — max ${selectedRes.dailyVisitorCap} per day` : ''}
              </p>
            </div>
            {loadingAvail && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 size={14} className="animate-spin" />Checking availability…
              </div>
            )}
            {!loadingAvail && avail && (
              <div className={`rounded-xl p-3 text-sm flex items-center gap-2 ${avail.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className={`w-2 h-2 rounded-full ${avail.available ? 'bg-green-500' : 'bg-red-500'}`} />
                {avail.available
                  ? `Available on ${checkIn}${avail.cap < 99999 ? ` — ${avail.cap - avail.booked} spots remaining` : ''}`
                  : `Fully booked on ${checkIn}. Please choose another date.`}
              </div>
            )}
            {availErr && <p className="text-xs text-slate-400">{availErr}</p>}
            {guests > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
                <p className="font-semibold text-slate-800">Deposit required: {fmtDeposit(selectedRes, guests)}</p>
                {selectedRes.depositType !== 'FREE' && (
                  <p className="text-xs text-slate-500 mt-0.5">Paid via M-Pesa after you submit</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Customer details ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <User size={12} className="inline mr-1" />Full Name *
              </label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Phone size={12} className="inline mr-1" />Phone Number *
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Mail size={12} className="inline mr-1" />Email Address *
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className={inputCls} />
              {email && !emailValid && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Required — we'll send your booking confirmation and payment instructions here</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your details are used only to manage your reservation.{' '}
              <a href="/privacy" target="_blank" className="underline hover:text-slate-600">Privacy Policy</a> ·{' '}
              <a href="/terms" target="_blank" className="underline hover:text-slate-600">Terms of Use</a>
            </p>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && selectedRes && (
          <div className="space-y-5">
            <div className="border rounded-xl divide-y text-sm">
              {[
                ['Package', selectedRes.name],
                ['Date', checkIn + (checkOut ? ` → ${checkOut}` : '')],
                ['Guests', String(guests)],
                ['Deposit', fmtDeposit(selectedRes, guests)],
                ['Name', name],
                ['Phone', phone],
                ['Email', email],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-4 py-2.5">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800 text-right max-w-48 break-all">{val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-slate-600">
              <Mail size={14} className="text-blue-500 mt-0.5 shrink-0" />
              <span>Booking confirmation and M-Pesa payment instructions will be sent to <strong>{email}</strong></span>
            </div>

            {submitErr && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs">{submitErr}</p>
              </div>
            )}

            <button onClick={submit} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Confirm & Book'}
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 text-sm font-body hover:bg-slate-50 transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
        )}
        {step === 1 && (
          <>
            <button onClick={() => { if (selectedRes) setStep(2) }} disabled={!selectedRes}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full font-body font-bold text-sm text-white transition-all hover:brightness-110 disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              Next <ChevronRight size={14} />
            </button>
            <button onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-500 font-body text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </>
        )}
        {step === 2 && (
          <button onClick={() => { if (canNext2) setStep(3) }} disabled={!canNext2}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full font-body font-bold text-sm text-white transition-all hover:brightness-110 disabled:opacity-40"
            style={{ backgroundColor: 'var(--color-gold)' }}>
            Next <ChevronRight size={14} />
          </button>
        )}
        {step === 3 && (
          <button onClick={() => { if (canNext3) setStep(4) }} disabled={!canNext3}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full font-body font-bold text-sm text-white transition-all hover:brightness-110 disabled:opacity-40"
            style={{ backgroundColor: 'var(--color-gold)' }}>
            Review Booking <ChevronRight size={14} />
          </button>
        )}
      </div>
    </Overlay>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
      <div>
        <h2 className="font-display font-black text-slate-900 text-lg" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p className="text-slate-400 text-xs mt-0.5 font-body">{subtitle}</p>}
      </div>
      <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
        <X size={18} />
      </button>
    </div>
  )
}
