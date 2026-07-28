import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { SITE } from '../config/site'

const BASE = import.meta.env.DEV
  ? 'http://localhost:8081/api'
  : 'https://cabhouse-kisii-backend-production.up.railway.app/api'

const SERVICES = [
  { value: 'PARK',       label: 'CabHouse Park — Recreation & Activities' },
  { value: 'APARTMENTS', label: 'CabHouse Apartments — Accommodation' },
  { value: 'WATER',      label: 'CabHouse Water — Delivery or Bulk Order' },
  { value: 'EVENTS',     label: 'Events & Functions — Venue Hire' },
  { value: 'RESTAURANT', label: 'Restaurant & Bar — Dining Reservation' },
  { value: 'OTHER',      label: 'Other / General Enquiry' },
]

interface Props {
  onClose: () => void
  defaultService?: string
}

export default function BookingModal({ onClose, defaultService }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: defaultService ?? 'PARK',
    visitDate: '', guests: 1, message: '',
  })
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const body = {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service: form.service,
        visitDate: form.visitDate || undefined,
        guests: Number(form.guests),
        message: form.message || undefined,
      }
      const res = await fetch(`${BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Something went wrong')
      setState('success')
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Failed to submit booking')
      setState('error')
    }
  }

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors font-body'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-display font-black text-slate-900 text-lg" style={{ letterSpacing: '-0.02em' }}>
              Make a Booking
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 font-body">We'll confirm within a few hours</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {state === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              <Check size={28} className="text-white" />
            </div>
            <h3 className="font-display font-black text-slate-900 text-xl mb-2" style={{ letterSpacing: '-0.02em' }}>
              Booking Received!
            </h3>
            <p className="text-slate-500 text-sm font-body leading-relaxed mb-6 max-w-xs">
              Thank you, {form.name.split(' ')[0]}. Our team will get back to you shortly to confirm your visit.
            </p>
            <p className="text-slate-400 text-xs font-body mb-6">{SITE.contact.phone} · {SITE.contact.whatsapp}</p>
            <button onClick={onClose}
              className="font-body font-bold text-sm px-8 py-3 rounded-full text-white transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Full Name *</label>
                <input required value={form.name} onChange={set('name')} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Phone Number *</label>
                <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+254 7XX XXX XXX" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="Optional — for confirmation" className={inputCls} />
            </div>

            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Service *</label>
              <select required value={form.service} onChange={set('service')} className={inputCls}>
                {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Preferred Date</label>
                <input type="date" value={form.visitDate} onChange={set('visitDate')} min={new Date().toISOString().split('T')[0]} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Number of Guests *</label>
                <input required type="number" min={1} max={500} value={form.guests}
                  onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-xs font-body font-semibold text-slate-600 block mb-1">Message / Special Requests</label>
              <textarea value={form.message} onChange={set('message')} rows={3}
                placeholder="Any specific requirements, questions or notes…"
                className={`${inputCls} resize-none`} />
            </div>

            {state === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-600 text-xs font-body">{errorMsg}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={state === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-full text-white transition-all hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-gold)' }}>
                {state === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : 'Submit Booking'}
              </button>
              <button type="button" onClick={onClose}
                className="px-5 py-3.5 rounded-full border border-slate-200 text-slate-500 font-body text-sm hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>

            <p className="text-slate-400 text-[10px] font-body text-center">
              Or call us directly: {SITE.contact.phone} · {SITE.contact.phone2}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
