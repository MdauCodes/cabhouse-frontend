import { useState } from 'react'
import Layout from '../components/Layout'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const USES = [
  {
    title: 'Home Delivery',
    desc: 'Clean water at your door — no queues, no heavy lifting. 5L, 10L and 20L options for families and households across Kisii.',
    wa: "Hi, I'd like to order CabHouse Water for home delivery",
  },
  {
    title: 'Office & Workplace',
    desc: 'Keep your team sharp and hydrated with scheduled dispenser refills. Bulk pricing built for business.',
    wa: "Hi, I'd like to order CabHouse Water for our office",
  },
  {
    title: 'Events & Functions',
    desc: 'Make your event memorable — not thirsty. Bottled supply for weddings, conferences, school events and corporate functions.',
    wa: "Hi, I'd like to order CabHouse Water for an event",
  },
  {
    title: 'Retail & Resale',
    desc: 'Stock your shelves with a brand people trust. Trade accounts for supermarkets, hotels, restaurants and kiosks — great margins, reliable supply.',
    wa: "Hi, I'd like to enquire about CabHouse Water wholesale/retail supply",
  },
]

const FORMATS = [
  { size: '500 ml', use: 'On-the-go · Events', tag: 'Individual' },
  { size: '1 L',    use: 'Dining table · Family', tag: 'Popular' },
  { size: '5 L',    use: 'Home use · Cooking', tag: 'Value' },
  { size: '10 L',   use: 'Office · Bulk home', tag: 'Bulk' },
  { size: '20 L',   use: 'Dispenser refill · Trade', tag: 'Trade' },
]

function DualCTA() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', qty: '', message: '' })
  const [sent, setSent] = useState(false)
  const { ref, inView } = useInView(0.08)
  const wa = SITE.contact.whatsapp.replace('+', '')

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Water Supply Enquiry — ${form.company || form.name}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        form.company ? `Organisation: ${form.company}` : '',
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : '',
        form.qty ? `Required quantity/format: ${form.qty}` : '',
        '',
        `Message:\n${form.message}`,
      ].filter(Boolean).join('\n')
    )
    window.location.href = `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  const inputCls = 'w-full bg-white/10 border border-white/15 rounded-lg px-3.5 py-2.5 font-body text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/40 transition-colors'

  return (
    <section id="order" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        {/* WhatsApp — quick individual orders */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex-1 flex flex-col p-8 lg:p-12"
          style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-16px)', transition: 'all 0.6s ease' }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: '#25D366' }}>
            Quick Order
          </p>
          <h3 className="font-display font-black text-white leading-[0.95] mb-3"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
            Order on <em className="not-italic" style={{ color: '#25D366' }}>WhatsApp</em>
          </h3>
          <p className="text-white/40 font-body text-xs leading-relaxed mb-8 max-w-xs">
            Fastest for household orders, event supply and quick top-ups. We confirm and deliver same day where possible.
          </p>
          <div className="space-y-2 mb-8 flex-1">
            {USES.map(u => (
              <a key={u.title}
                href={`https://wa.me/${wa}?text=${encodeURIComponent(u.wa)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-green-400/35 transition-all duration-200 group"
              >
                <span className="text-white/65 font-body text-sm group-hover:text-white transition-colors">{u.title}</span>
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            ))}
          </div>
          <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-white font-body font-bold text-sm px-6 py-3.5 rounded-full self-start"
            style={{ backgroundColor: '#25D366' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
            </svg>
            Open WhatsApp
          </a>
          <p className="text-white/20 font-body text-[10px] mt-4">{SITE.contact.phone} · {SITE.contact.phone2}</p>
        </div>

        {/* Email — bulk / trade / institutional */}
        <div className="flex-1 flex flex-col p-8 lg:p-12"
          style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(16px)', transition: 'all 0.6s ease 0.1s' }}>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-gold)' }}>Bulk &amp; Trade</p>
          <h3 className="font-display font-black text-white leading-[0.95] mb-3"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
            Send a Supply <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Enquiry</em>
          </h3>
          <p className="text-white/50 font-body text-xs leading-relaxed mb-7 max-w-xs">
            For institutions, businesses and resellers needing regular supply, custom volumes or trade pricing.
          </p>

          {sent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-display font-bold text-white text-base mb-1">Email app opening…</p>
              <p className="text-white/40 font-body text-xs">Your enquiry is pre-filled and ready to send.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={form.name} onChange={set('name')} placeholder="Your name *" className={inputCls} />
                <input value={form.company} onChange={set('company')} placeholder="Organisation" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required type="email" value={form.email} onChange={set('email')} placeholder="Email address *" className={inputCls} />
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Phone" className={inputCls} />
              </div>
              <select value={form.qty} onChange={set('qty')} className={inputCls}>
                <option value="">Required format / volume</option>
                <option>500 ml bottles</option>
                <option>1 L bottles</option>
                <option>5 L jerricans</option>
                <option>10 L jerricans</option>
                <option>20 L dispenser refills</option>
                <option>Mixed / multiple formats</option>
              </select>
              <textarea required value={form.message} onChange={set('message')}
                placeholder="Delivery location, frequency, quantity per order…"
                rows={4} className={`${inputCls} resize-none flex-1`} />
              <button type="submit"
                className="inline-flex items-center gap-2 text-white font-body font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 self-start uppercase tracking-wide"
                style={{ backgroundColor: 'var(--color-gold)' }}>
                Send Enquiry
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
              <p className="text-white/30 font-body text-[10px] mt-1">Opens your email app · no account needed</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function HeroSection() {
  const { ref, inView } = useInView(0.05)
  return (
    <>
      {/* Banner — full display, no overlay, no CTA on top of it */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="overflow-hidden rounded-3xl w-full">
          <img
            src="/assets/cabhouse-section-herosection.webp"
            alt="CabHouse Water Refilling & Bottling"
            className="w-full object-cover object-top block"
            style={{ maxHeight: 480, minHeight: 220 }}
          />
        </div>
      </section>

      {/* CTA strip below the banner */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="rounded-3xl overflow-hidden px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: '#1a2e1f',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(12px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-1" style={{ color: 'var(--color-gold)' }}>
              Pure · Refreshing · Healthy
            </p>
            <p className="font-display font-black text-white leading-tight" style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
              Order CabHouse Water Today
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <a
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 uppercase tracking-wide text-center"
            >
              Order via WhatsApp
            </a>
            <a
              href="#order"
              className="border border-white/30 hover:border-white/60 text-white font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 uppercase tracking-wide text-center"
            >
              Bulk Enquiry
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default function WaterPage() {
  const { ref, inView } = useInView(0.1)

  return (
    <Layout>
      <HeroSection />

      {/* Quality pillars — green */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="rounded-3xl overflow-hidden px-6 lg:px-10 py-10" style={{ backgroundColor: '#1a2e1f' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
            {[
              { label: 'Source & Purity', value: 'Responsibly Sourced', sub: 'Rigorously filtered for absolute purity — every batch tested before it reaches you.' },
              { label: 'Taste & Minerals', value: 'Crisp & Balanced', sub: 'Clean, refreshing taste with naturally balanced minerals. Engineered to fuel an active lifestyle.' },
              { label: 'Eco-Friendly', value: 'Sustainable Packaging', sub: 'Packaged in materials that protect both your health and our planet.' },
            ].map((q, i) => (
              <div key={i}>
                <p className="text-brand-gold font-body text-[9px] uppercase tracking-[0.3em] font-semibold mb-1">{q.label}</p>
                <p className="text-white font-display font-bold text-base mb-1" style={{ letterSpacing: '-0.01em' }}>{q.value}</p>
                <p className="text-white/45 font-body text-xs leading-relaxed">{q.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer — gold */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#D4B882' }}>
          <div className="max-w-7xl mx-auto">
            <div ref={ref as React.RefObject<HTMLDivElement>}
              className="mb-10"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}>
              <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-2"
                style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
                Water for Every <em className="not-italic" style={{ color: '#7a5a2a' }}>Need</em>
              </h2>
              <p className="text-brand-dark/50 font-body text-xs">Perfect for intense workouts · corporate boardrooms · daily family hydration</p>
            </div>

            {/* Use cases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {USES.map((u, i) => (
                <a key={i}
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(u.wa)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-xl border border-black/10 bg-white/30 hover:bg-white/50 hover:border-black/20 transition-all duration-200 group">
                  <span className="w-8 h-8 rounded-full bg-black/10 text-brand-dark flex items-center justify-center font-display font-bold text-sm flex-shrink-0 group-hover:bg-brand-dark/20 transition-colors">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display font-bold text-brand-dark text-sm mb-1">{u.title}</p>
                    <p className="text-brand-dark/50 font-body text-xs leading-relaxed">{u.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Formats */}
            <h3 className="font-display font-black text-brand-dark mb-5" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', letterSpacing: '-0.02em' }}>
              Available <em className="not-italic" style={{ color: '#7a5a2a' }}>Formats</em>
            </h3>
            <div className="flex flex-wrap gap-3">
              {FORMATS.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/30 border border-black/10 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-display font-bold text-brand-dark text-base leading-none">{f.size}</p>
                    <p className="text-brand-dark/50 font-body text-[10px] mt-0.5">{f.use}</p>
                  </div>
                  <span className="text-[8px] font-body font-bold uppercase tracking-widest bg-black/10 text-brand-dark/60 px-2 py-0.5 rounded-full ml-1">
                    {f.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DualCTA />
    </Layout>
  )
}
