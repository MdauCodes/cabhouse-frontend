import { useState } from 'react'
import { SITE } from '../config/site'
import { useInView } from '../hooks/useInView'


const WA_OPTIONS = [
  { label: 'Book Park Entry',        msg: "Hi, I'd like to book a visit to CabHouse Park" },
  { label: 'Plan an Overnight Stay', msg: "Hi, I'd like to book an overnight stay at CabHouse Park" },
  { label: 'Host an Event',          msg: "Hi, I'd like to enquire about hosting an event at CabHouse" },
  { label: 'Make a Group Booking',   msg: "Hi, I'd like to make a group booking at CabHouse Park" },
]

function WhatsAppPanel() {
  const wa = SITE.contact.whatsapp.replace('+', '')
  const { ref, inView } = useInView(0.08)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex-1 flex flex-col p-8 lg:p-12"
      style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-16px)', transition: 'all 0.6s ease' }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: '#25D366' }}>
        Individuals &amp; Families
      </p>
      <h3
        className="font-display font-black text-white leading-[0.95] mb-3"
        style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}
      >
        Chat with us on{' '}
        <em className="not-italic" style={{ color: '#25D366' }}>WhatsApp</em>
      </h3>
      <p className="text-white/40 font-body text-xs leading-relaxed mb-8 max-w-xs">
        Quick answers, same-day bookings, and personal help — we reply in minutes.
      </p>

      <div className="space-y-2 mb-8 flex-1">
        {WA_OPTIONS.map(o => (
          <a
            key={o.label}
            href={`https://wa.me/${wa}?text=${encodeURIComponent(o.msg)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-green-400/35 transition-all duration-200 group"
          >
            <span className="text-white/65 font-body text-sm group-hover:text-white transition-colors">{o.label}</span>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        ))}
      </div>

      <a
        href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to find out more about CabHouse")}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 text-white font-body font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 self-start"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
        </svg>
        Open WhatsApp
      </a>

      <p className="text-white/20 font-body text-[10px] mt-4">
        {SITE.contact.phone} · {SITE.contact.phone2}
      </p>
    </div>
  )
}

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

function EmailPanel() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { ref, inView } = useInView(0.08)

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone || null,
          email: form.email,
          company: form.company || null,
          service: 'CORPORATE',
          guests: 1,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setState('success')
    } catch {
      setState('error')
    }
  }

  const inputCls =
    'w-full bg-white/10 border border-white/15 rounded-lg px-3.5 py-2.5 font-body text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/40 transition-colors'

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex-1 flex flex-col p-8 lg:p-12"
      style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(16px)', transition: 'all 0.6s ease 0.1s' }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-gold)' }}>
        Corporates &amp; Enterprises
      </p>
      <h3
        className="font-display font-black text-white leading-[0.95] mb-3"
        style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}
      >
        Send a Formal{' '}
        <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Enquiry</em>
      </h3>
      <p className="text-white/50 font-body text-xs leading-relaxed mb-7 max-w-xs">
        For team events, school trips, weddings and bulk bookings — we'll reply with a tailored proposal.
      </p>

      {state === 'success' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(200,135,58,0.15)', border: '1px solid rgba(200,135,58,0.3)' }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" stroke="#C8873A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10l4 4 8-8" />
            </svg>
          </div>
          <p className="text-white font-bold text-lg font-display">Enquiry received</p>
          <p className="text-white/50 text-sm font-body max-w-[28ch]">We'll review your message and get back to you within 24 hours.</p>
          <button
            onClick={() => { setForm({ name: '', company: '', email: '', phone: '', message: '' }); setState('idle') }}
            className="text-white/40 text-xs font-body underline underline-offset-2 mt-2"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={set('name')} placeholder="Your name *" className={inputCls} />
            <input value={form.company} onChange={set('company')} placeholder="Organisation" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required type="email" value={form.email} onChange={set('email')} placeholder="Email address *" className={inputCls} />
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" className={inputCls} />
          </div>
          <textarea
            required value={form.message} onChange={set('message')}
            placeholder="Tell us about your event, group size, preferred dates..."
            rows={5}
            className={`${inputCls} resize-none flex-1`}
          />
          {state === 'error' && (
            <p className="text-red-400 text-xs font-body">Something went wrong — please try again or contact us on WhatsApp.</p>
          )}
          <button
            type="submit"
            disabled={state === 'loading'}
            className="inline-flex items-center gap-2 text-white font-body font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 self-start uppercase tracking-wide disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-gold)' }}
          >
            {state === 'loading' ? 'Sending…' : 'Send Enquiry'}
            {state !== 'loading' && (
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default function BookingCTA() {
  return (
    <section id="contact" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        <WhatsAppPanel />
        <EmailPanel />
      </div>
    </section>
  )
}
