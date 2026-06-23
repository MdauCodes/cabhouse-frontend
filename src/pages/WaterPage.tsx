import { useState } from 'react'
import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const USES = [
  {
    title: 'Home Delivery',
    desc: 'Fresh, purified water delivered to your door in Kisii. 5L, 10L and 20L options for families and households.',
    wa: "Hi, I'd like to order CabHouse Water for home delivery",
  },
  {
    title: 'Office & Workplace',
    desc: 'Keep your team refreshed with regular dispenser refill schedules. Bulk pricing available.',
    wa: "Hi, I'd like to order CabHouse Water for our office",
  },
  {
    title: 'Events & Functions',
    desc: 'Bottled water supply for weddings, conferences, school events and corporate functions across Kisii County.',
    wa: "Hi, I'd like to order CabHouse Water for an event",
  },
  {
    title: 'Retail & Resale',
    desc: 'Trade accounts for supermarkets, hotels, restaurants and kiosks. Competitive wholesale rates and branded stock.',
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

  const inputCls = 'w-full bg-white border border-brand-dark/[0.12] rounded-lg px-3.5 py-2.5 font-body text-sm text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-dark/35 transition-colors'

  return (
    <section id="order" className="flex flex-col lg:flex-row">
      {/* WhatsApp — quick individual orders */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="flex-1 bg-brand-dark flex flex-col p-8 lg:p-12"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-16px)', transition: 'all 0.6s ease' }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: '#25D366' }}>
          Quick Order
        </p>
        <h3 className="font-display font-black text-white leading-[0.95] mb-3"
          style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', letterSpacing: '-0.02em' }}>
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
      <div className="flex-1 bg-brand-cream flex flex-col p-8 lg:p-12"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(16px)', transition: 'all 0.6s ease 0.1s' }}>
        <p className="text-brand-green font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Bulk & Trade</p>
        <h3 className="font-display font-black text-brand-dark leading-[0.95] mb-3"
          style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', letterSpacing: '-0.02em' }}>
          Send a Supply <em className="not-italic" style={{ color: '#C9A84C' }}>Enquiry</em>
        </h3>
        <p className="text-brand-dark/45 font-body text-xs leading-relaxed mb-7 max-w-xs">
          For institutions, businesses and resellers needing regular supply, custom volumes or trade pricing.
        </p>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-brand-green" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-display font-bold text-brand-dark text-base mb-1">Email app opening…</p>
            <p className="text-brand-dark/40 font-body text-xs">Your enquiry is pre-filled and ready to send.</p>
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
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-green text-white font-body font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 self-start uppercase tracking-wide">
              Send Enquiry
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
            <p className="text-brand-dark/25 font-body text-[10px] mt-1">Opens your email app · no account needed</p>
          </form>
        )}
      </div>
    </section>
  )
}

function HeroSection() {
  const img = useMediaUrl('hero-2')
  const { ref, inView } = useInView(0.05)
  return (
    <section className="relative overflow-hidden" style={{ height: '60dvh', minHeight: 340 }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundColor: '#0a1f2e' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0D1B12 0%, #0D1B12 30%, rgba(13,27,18,0.6) 60%, rgba(13,27,18,0.15) 100%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30" />
      <div ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease', paddingBottom: 48 }}>
        <img src="/assets/logo-water.png" alt="CabHouse Water" className="h-16 w-auto object-contain mb-5" style={{ mixBlendMode: 'screen' }} />
        <h1 className="font-display font-black text-white leading-[0.93] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', letterSpacing: '-0.025em' }}>
          Pure Water,<br />
          <em className="not-italic" style={{ color: '#C9A84C' }}>Delivered to You</em>
        </h1>
        <p className="text-white/55 font-body text-sm leading-relaxed mb-8 max-w-[28rem]">
          CabHouse Water is purified and bottled right here in Kisii — clean, safe and ready for your home, office or event.
        </p>
        <div className="flex items-center gap-4">
          <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/25 uppercase tracking-wide">
            Order via WhatsApp
          </a>
          <a href="#order"
            className="border border-white/30 hover:border-white text-white font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/10 uppercase tracking-wide">
            Bulk Enquiry
          </a>
        </div>
      </div>
    </section>
  )
}

export default function WaterPage() {
  const { ref, inView } = useInView(0.1)

  return (
    <Layout>
      <HeroSection />

      {/* What we offer */}
      <section className="bg-white px-6 lg:px-10 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div ref={ref as React.RefObject<HTMLDivElement>}
            className="mb-10"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}>
            <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-2"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}>
              Water for Every <em className="not-italic" style={{ color: '#C9A84C' }}>Need</em>
            </h2>
            <p className="text-brand-dark/40 font-body text-xs">Domestic · Commercial · Events · Trade</p>
          </div>

          {/* Use cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {USES.map((u, i) => (
              <a key={i}
                href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(u.wa)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl border border-brand-dark/[0.07] hover:border-brand-gold/40 hover:bg-brand-gold/[0.02] transition-all duration-200 group">
                <span className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-display font-bold text-sm flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-bold text-brand-dark text-sm mb-1">{u.title}</p>
                  <p className="text-brand-dark/45 font-body text-xs leading-relaxed">{u.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Formats */}
          <h3 className="font-display font-black text-brand-dark mb-5" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', letterSpacing: '-0.02em' }}>
            Available <em className="not-italic" style={{ color: '#C9A84C' }}>Formats</em>
          </h3>
          <div className="flex flex-wrap gap-3">
            {FORMATS.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-brand-cream rounded-xl px-4 py-3">
                <div>
                  <p className="font-display font-bold text-brand-dark text-base leading-none">{f.size}</p>
                  <p className="text-brand-dark/40 font-body text-[10px] mt-0.5">{f.use}</p>
                </div>
                <span className="text-[8px] font-body font-bold uppercase tracking-widest bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-full ml-1">
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DualCTA />
    </Layout>
  )
}
