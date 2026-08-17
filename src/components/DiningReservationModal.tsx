import { useState, useEffect } from 'react'
import { X, Check, ChevronRight, ChevronLeft, Loader2, CalendarDays, Users, Phone, Mail, User, ShieldCheck, AlertCircle, Utensils, Eye, EyeOff } from 'lucide-react'

const BASE = import.meta.env.VITE_API_URL ?? 'https://cabhouse-kisii-backend-production.up.railway.app/api'

// ── Types ────────────────────────────────────────────────────────────────────

interface DiningSlot {
  id: string
  name: string
  startTime: string | null   // "HH:mm:ss"
  endTime: string | null
  maxTables: number
  maxPartySize: number
  depositThresholdParty: number
  depositType: 'NONE' | 'FLAT' | 'PER_HEAD'
  depositAmount: number | null
  active: boolean
}

interface DiningReservationResult {
  id: string
  refCode: string
  depositAmount: number | null
  status: string
}

interface Props {
  onClose: () => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(t: string | null): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function fmtTimeRange(slot: DiningSlot): string {
  const s = fmtTime(slot.startTime)
  const e = fmtTime(slot.endTime)
  if (s && e) return `${s} – ${e}`
  if (s) return `From ${s}`
  return ''
}

function computeDeposit(slot: DiningSlot, partySize: number): number | null {
  if (partySize < slot.depositThresholdParty) return null
  if (slot.depositType === 'NONE') return null
  if (slot.depositType === 'FLAT') return Number(slot.depositAmount ?? 0)
  if (slot.depositType === 'PER_HEAD') return Number(slot.depositAmount ?? 0) * partySize
  return null
}

function fmtDeposit(slot: DiningSlot, partySize: number): string {
  const d = computeDeposit(slot, partySize)
  if (d === null) return 'No deposit required'
  return `KES ${d.toLocaleString()} deposit`
}

function today() { return new Date().toISOString().split('T')[0] }

// ── Inline member registration ────────────────────────────────────────────────

function MemberSignupInline({ name, phone, bookingEmail }: { name: string; phone: string; bookingEmail: string }) {
  const [phase, setPhase] = useState<'prompt' | 'form' | 'submitting' | 'success' | 'taken'>('prompt')
  const [regEmail, setRegEmail] = useState(bookingEmail)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)
  const pwdValid = password.length >= 8
  const canSubmit = emailValid && pwdValid && password === confirm

  async function register() {
    setErr(''); setPhase('submitting')
    try {
      const regRes = await fetch(`${BASE}/patrons/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email: regEmail.trim().toLowerCase(), name, password }),
      })
      if (regRes.status === 409) { setPhase('taken'); return }
      if (!regRes.ok) {
        const j = await regRes.json()
        throw new Error(j.message ?? 'Registration failed')
      }
      const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: phone, password }),
      })
      if (loginRes.ok) {
        const lj = await loginRes.json()
        if (lj.success && lj.data?.accessToken) {
          localStorage.setItem('cabhouse_patron_token', lj.data.accessToken)
        }
      }
      setPhase('success')
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors font-body'

  if (phase === 'success') {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
            <Check size={12} className="text-white" />
          </div>
          <p className="font-semibold text-slate-800">Account created!</p>
        </div>
        <p className="text-slate-500 text-xs mb-3">Your CabHouse member account is ready. Track bookings, earn coupons, and access deals.</p>
        <a href="/patrons"
          className="block text-center font-body font-bold text-sm py-2.5 rounded-full text-white transition-all hover:brightness-110"
          style={{ backgroundColor: 'var(--color-gold)' }}>
          Go to My Portal
        </a>
      </div>
    )
  }

  if (phase === 'taken') {
    return (
      <div className="border border-slate-200 rounded-xl p-4 text-sm">
        <p className="font-semibold text-slate-800 mb-1">Already a member?</p>
        <p className="text-slate-500 text-xs mb-3">An account with this phone number already exists. Sign in to access your portal.</p>
        <a href="/login?next=/patrons"
          className="block text-center font-body font-bold text-sm py-2.5 rounded-full text-white transition-all hover:brightness-110"
          style={{ backgroundColor: 'var(--color-gold)' }}>
          Sign In
        </a>
      </div>
    )
  }

  if (phase === 'prompt') {
    return (
      <div className="border border-slate-200 rounded-xl p-4 text-sm">
        <p className="font-semibold text-slate-800 mb-2">Become a CabHouse Member</p>
        <p className="text-slate-500 text-xs leading-relaxed mb-3">Register for free to track all your bookings, earn loyalty coupons on every visit, and access exclusive member deals.</p>
        <button onClick={() => setPhase('form')}
          className="w-full text-center font-body font-bold text-sm py-2.5 rounded-full text-white transition-all hover:brightness-110"
          style={{ backgroundColor: 'var(--color-gold)' }}>
          Create Member Account
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">Use the same phone number you booked with</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
      <p className="font-semibold text-slate-800">Create your member account</p>

      <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 space-y-0.5">
        <p><span className="text-slate-400">Name:</span> {name}</p>
        <p><span className="text-slate-400">Phone:</span> {phone}</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address *</label>
        <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
          placeholder="your@email.com" className={inputCls} />
        <p className="text-xs text-slate-400 mt-1">Required to create your account</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Password *</label>
        <div className="relative">
          <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min 8 characters" className={inputCls + ' pr-10'} />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Confirm Password *</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Re-enter password" className={inputCls} />
        {confirm && password !== confirm && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
      </div>

      {err && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2">
          <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-600 text-xs">{err}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setPhase('prompt')}
          className="px-3 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-body hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={register} disabled={!canSubmit || phase === 'submitting'}
          className="flex-1 flex items-center justify-center gap-2 font-body font-bold text-xs py-2.5 rounded-lg text-white transition-all hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-gold)' }}>
          {phase === 'submitting' ? <><Loader2 size={12} className="animate-spin" />Creating…</> : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DiningReservationModal({ onClose }: Props) {
  const [step, setStep] = useState(1)

  // Step 1 — slot
  const [slots, setSlots] = useState<DiningSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [slotsErr, setSlotsErr] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<DiningSlot | null>(null)

  // Step 2 — date + party size
  const [date, setDate] = useState(today())
  const [partySize, setPartySize] = useState(2)

  // Step 3 — contact
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Step 4 — submit + result
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState('')
  const [result, setResult] = useState<DiningReservationResult | null>(null)

  // Post-payment phase
  const [payPhase, setPayPhase] = useState<'instructions' | 'confirm' | 'done'>('instructions')
  const [mpesaCode, setMpesaCode] = useState('')
  const [mpesaName, setMpesaName] = useState('')
  const [paySubmitting, setPaySubmitting] = useState(false)
  const [payErr, setPayErr] = useState('')

  // Booking settings (M-Pesa paybill etc.)
  const [paybill, setPaybill] = useState('')
  const [account, setAccount] = useState('')
  const [instructions, setInstructions] = useState('')

  // ── Scroll lock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // ── Load slots + booking settings ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE}/dining/slots/public`)
      .then(r => r.json())
      .then(j => {
        const list: DiningSlot[] = j.data ?? []
        setSlots(list)
        if (list.length === 0) setSlotsErr('No dining slots available right now. Please call us to reserve.')
      })
      .catch(() => setSlotsErr('Could not load dining slots. Please try again or call us.'))
      .finally(() => setLoadingSlots(false))

    fetch(`${BASE}/content/public/blocks`)
      .then(r => r.json())
      .then(j => {
        const m: Record<string, string> = {}
        ;(j.data ?? []).forEach((b: { key: string; value: string }) => { m[b.key] = b.value })
        setPaybill(m['booking.paybill'] ?? '')
        setAccount(m['booking.account'] ?? '')
        setInstructions(m['booking.instructions'] ?? '')
      })
      .catch(() => {})
  }, [])

  // ── Submit reservation ──────────────────────────────────────────────────────
  async function submit() {
    if (!selectedSlot) return
    setSubmitting(true); setSubmitErr('')
    try {
      const res = await fetch(`${BASE}/dining/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diningSlotId: selectedSlot.id,
          date,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          partySize,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Submission failed')
      const bookingResult = json.data as DiningReservationResult
      setResult(bookingResult)
      const depositRequired = bookingResult.depositAmount !== null && Number(bookingResult.depositAmount) > 0
      setPayPhase(depositRequired ? 'instructions' : 'done')
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
      const res = await fetch(`${BASE}/dining/reservations/${result.id}/record-payment`, {
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
  const depositAmt = selectedSlot ? computeDeposit(selectedSlot, partySize) : null
  const needsDeposit = depositAmt !== null && depositAmt > 0
  const emailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canNext2 = !!date && partySize >= 1
  const canNext3 = name.trim().length >= 2 && phone.trim().length >= 9 && emailValid

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors font-body'

  // ── Post-booking screens ────────────────────────────────────────────────────
  if (result) {
    const wasDepositPaid = result.depositAmount !== null && Number(result.depositAmount) > 0

    if (payPhase === 'done') {
      return (
        <Overlay onClose={onClose}>
          <ModalHeader onClose={onClose} title="Table Reserved!" subtitle="" />
          <div className="px-6 py-8 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                <Check size={28} className="text-white" />
              </div>
              <div>
                {wasDepositPaid ? (
                  <>
                    <p className="font-display font-black text-slate-900 text-lg">Payment details submitted</p>
                    <p className="text-slate-500 text-sm mt-1">Our team will verify your M-Pesa payment and confirm your reservation.</p>
                  </>
                ) : (
                  <>
                    <p className="font-display font-black text-slate-900 text-lg">Reservation received!</p>
                    <p className="text-slate-500 text-sm mt-1">Our team will contact you to confirm your table.</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Your reservation reference</p>
              <p className="font-mono text-xl font-black text-slate-900 tracking-widest">{result.refCode}</p>
              <p className="text-xs text-slate-400 mt-1">Quote this when you arrive</p>
            </div>

            {email && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                <Mail size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Check your email</p>
                  <p className="text-slate-500 text-xs mt-0.5">A confirmation has been sent to <strong>{email}</strong>.</p>
                </div>
              </div>
            )}

            <MemberSignupInline name={name} phone={phone} bookingEmail={email} />

            <button onClick={onClose}
              className="w-full font-body font-semibold text-sm py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
        </Overlay>
      )
    }

    if (payPhase === 'confirm') {
      return (
        <Overlay onClose={onClose}>
          <ModalHeader onClose={onClose} title="Submit Payment Details" subtitle="So we can match your M-Pesa payment" />
          <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>

            <div className="border border-slate-200 rounded-xl divide-y text-sm">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-xs">Booked under</span>
                <span className="font-semibold text-slate-800">{name}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-xs">Reservation ref</span>
                <span className="font-mono font-black text-slate-900 tracking-widest">{result.refCode}</span>
              </div>
              {needsDeposit && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-slate-400 text-xs">Amount paid</span>
                  <span className="font-bold text-slate-800">KES {(depositAmt ?? 0).toLocaleString()}</span>
                </div>
              )}
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Enter the M-Pesa details from the SMS you received after paying. Our team will use these to find and verify your payment.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">M-Pesa Transaction Code *</label>
                <input value={mpesaCode} onChange={e => setMpesaCode(e.target.value.toUpperCase())}
                  placeholder="e.g. QBD1A2B3C4" className={inputCls} />
                <p className="text-xs text-slate-400 mt-1">The code in the M-Pesa SMS you received after paying</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Name on your M-Pesa account *</label>
                <input value={mpesaName} onChange={e => setMpesaName(e.target.value)}
                  placeholder="Full name as registered on M-Pesa" className={inputCls} />
                <p className="text-xs text-slate-400 mt-1">The name our staff will see on the payment record</p>
              </div>
            </div>

            {payErr && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs">{payErr}</p>
              </div>
            )}

            <button onClick={submitPayment}
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

    // ── Payment instructions ──────────────────────────────────────────────────
    return (
      <Overlay onClose={onClose}>
        <ModalHeader onClose={onClose} title="One Last Step" subtitle="Your table is reserved — payment confirms it" />
        <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Reservation not yet confirmed</p>
              <p className="text-amber-700 text-xs mt-0.5">
                {needsDeposit
                  ? 'Your table is temporarily held. Pay the deposit below to secure it — your reservation is only confirmed after we verify your payment.'
                  : 'Your table is temporarily held. Our team will call you to confirm the reservation.'}
              </p>
            </div>
          </div>

          {needsDeposit ? (
            <>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-slate-600 text-sm font-semibold">Deposit to pay now</span>
                <span className="font-black text-slate-900 text-xl">KES {(depositAmt ?? 0).toLocaleString()}</span>
              </div>

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
                    ['5', 'Enter Amount', `KES ${(depositAmt ?? 0).toLocaleString()}`],
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

              {instructions && <p className="text-xs text-slate-400 leading-relaxed">{instructions}</p>}

              <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-slate-600">
                <ShieldCheck size={14} className="text-green-600 mt-0.5 shrink-0" />
                <span>After paying, you'll receive an M-Pesa SMS with a transaction code. Click <strong>"I have paid"</strong> below and enter those details — we'll use them to match your payment.</span>
              </div>

              <button onClick={() => setPayPhase('confirm')}
                className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110"
                style={{ backgroundColor: 'var(--color-gold)' }}>
                <Check size={16} /> I have paid — enter my details
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-center">
              <p className="font-semibold text-slate-800">No deposit required</p>
              <p className="text-slate-500 mt-1 text-xs">Our team will contact you at {phone} to confirm your table.</p>
            </div>
          )}

          <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 text-sm">
            <span className="text-slate-400 text-xs">Reservation ref</span>
            <span className="font-mono font-black text-slate-800 tracking-widest text-sm">{result.refCode}</span>
          </div>

          {email && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-slate-600">
              <Mail size={14} className="text-blue-500 mt-0.5 shrink-0" />
              <span>A summary has been sent to <strong>{email}</strong></span>
            </div>
          )}

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
  const stepTitles = ['Choose a Time Slot', 'Your Visit', 'Your Details', 'Review & Book']

  return (
    <Overlay onClose={onClose}>
      <ModalHeader onClose={onClose} title={stepTitles[step - 1]} subtitle={`Step ${step} of 4`} />

      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-slate-100 shrink-0">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= step ? 'bg-brand-gold' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>

        {/* ── Step 1: Slot selection ── */}
        {step === 1 && (
          <div className="space-y-3">
            {loadingSlots ? (
              <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
            ) : slotsErr ? (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-sm">{slotsErr}</p>
              </div>
            ) : (
              slots.map(slot => (
                <button key={slot.id} onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                  className={`w-full text-left border rounded-xl p-4 transition-all ${selectedSlot?.id === slot.id ? 'border-brand-gold bg-amber-50 ring-1 ring-brand-gold/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: selectedSlot?.id === slot.id ? 'var(--color-gold)' : '#f1f5f9' }}>
                        <Utensils size={14} className={selectedSlot?.id === slot.id ? 'text-white' : 'text-slate-400'} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{slot.name}</p>
                        {fmtTimeRange(slot) && (
                          <p className="text-xs text-slate-500 mt-0.5">{fmtTimeRange(slot)}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">Up to {slot.maxPartySize} guests per table</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">{fmtDeposit(slot, partySize)}</p>
                    </div>
                  </div>
                  {selectedSlot?.id === slot.id && (
                    <div className="mt-2 flex items-center gap-1 text-[#C8873A] text-xs font-semibold">
                      <Check size={12} /> Selected
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}

        {/* ── Step 2: Date + party size ── */}
        {step === 2 && selectedSlot && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">Selected slot</p>
              <p className="font-semibold text-slate-800">{selectedSlot.name}</p>
              {fmtTimeRange(selectedSlot) && (
                <p className="text-sm text-slate-500">{fmtTimeRange(selectedSlot)}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <CalendarDays size={12} className="inline mr-1" />When are you dining with us? *
              </label>
              <input type="date" value={date} min={today()}
                onChange={e => setDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Users size={12} className="inline mr-1" />How many of you are dining? *
              </label>
              <input type="number" min={1} max={selectedSlot.maxPartySize}
                value={partySize} onChange={e => setPartySize(Math.max(1, Math.min(selectedSlot.maxPartySize, Number(e.target.value))))}
                className={inputCls} />
              <p className="text-xs text-slate-400 mt-1">Max {selectedSlot.maxPartySize} guests for this slot</p>
            </div>
            {partySize >= 1 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
                <p className="font-semibold text-slate-800">{fmtDeposit(selectedSlot, partySize)}</p>
                {needsDeposit && (
                  <p className="text-xs text-slate-500 mt-0.5">Paid via M-Pesa after you submit</p>
                )}
                {!needsDeposit && selectedSlot.depositType !== 'NONE' && partySize < selectedSlot.depositThresholdParty && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deposit applies for groups of {selectedSlot.depositThresholdParty}+
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Contact details ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <User size={12} className="inline mr-1" />Full Name *
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Phone size={12} className="inline mr-1" />Phone Number *
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">
                <Mail size={12} className="inline mr-1" />Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Optional — for confirmation email" className={inputCls} />
              {email && !emailValid && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your details are used only to manage your reservation.
            </p>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && selectedSlot && (
          <div className="space-y-5">
            <div className="border rounded-xl divide-y text-sm">
              {[
                ['Slot', selectedSlot.name],
                ['Time', fmtTimeRange(selectedSlot) || '—'],
                ['Date', date],
                ['Party size', String(partySize)],
                ['Deposit', fmtDeposit(selectedSlot, partySize)],
                ['Name', name],
                ['Phone', phone],
                ...(email ? [['Email', email]] : []),
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-4 py-2.5">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800 text-right max-w-48 break-all">{val}</span>
                </div>
              ))}
            </div>

            {needsDeposit && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-slate-600">
                <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <span>A deposit of <strong>KES {(depositAmt ?? 0).toLocaleString()}</strong> will be required after submission to confirm your table.</span>
              </div>
            )}

            {submitErr && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs">{submitErr}</p>
              </div>
            )}

            <button onClick={submit} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Confirm Reservation'}
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
            <button onClick={() => { if (selectedSlot) setStep(2) }} disabled={!selectedSlot || !!slotsErr}
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
