import { useState } from 'react'
import Layout from '../components/Layout'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import MasonryGallery from '../components/MasonryGallery'

const UNITS = [
  {
    name: 'Studio Apartment',
    tag: 'Short Stay',
    beds: 1,
    desc: 'Your own space in the heart of Kisii — kitchenette, en-suite and everything you need for a smooth, comfortable solo stay.',
    wa: "Hi, I'd like to enquire about the Studio Apartment at CabHouse Apartments",
  },
  {
    name: '1-Bedroom Apartment',
    tag: 'Short or Long Stay',
    beds: 2,
    desc: 'A proper home base — separate lounge, full kitchen and fast Wi-Fi. Ideal for a longer stay or a comfortable business trip.',
    wa: "Hi, I'd like to enquire about the 1-Bedroom Apartment at CabHouse Apartments",
  },
  {
    name: '2-Bedroom Apartment',
    tag: 'Families & Groups',
    beds: 4,
    desc: 'Spread out and settle in. Two bedrooms, a full living area, kitchen and housekeeping — perfect for families or the whole work team.',
    wa: "Hi, I'd like to enquire about the 2-Bedroom Apartment at CabHouse Apartments",
  },
]

const PERKS = [
  { label: 'Location', value: 'Kisii Town', sub: 'Heart of the CBD — close to major business hubs' },
  { label: 'Stay Terms', value: 'Daily / Monthly', sub: 'Overnight visits, business trips, relocations' },
  { label: 'Wi-Fi & Workspace', value: 'Included', sub: 'High-speed connection with dedicated desk space' },
  { label: 'Housekeeping', value: 'Available', sub: 'On request — so it always feels like home' },
]

function DualCTA() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', unit: '', dates: '', message: '' })
  const [sent, setSent] = useState(false)
  const { ref, inView } = useInView(0.08)
  const wa = SITE.contact.whatsapp.replace('+', '')

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Apartment Enquiry — ${form.company || form.name}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        form.company ? `Organisation: ${form.company}` : '',
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : '',
        form.unit ? `Unit type: ${form.unit}` : '',
        form.dates ? `Preferred dates / duration: ${form.dates}` : '',
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
    <section id="enquire" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        {/* WhatsApp */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex-1 flex flex-col p-8 lg:p-12"
          style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-16px)', transition: 'all 0.6s ease' }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: '#25D366' }}>
            Quick Enquiry
          </p>
          <h3 className="font-display font-black text-white leading-[0.95] mb-3"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
            Chat on <em className="not-italic" style={{ color: '#25D366' }}>WhatsApp</em>
          </h3>
          <p className="text-white/40 font-body text-xs leading-relaxed mb-8 max-w-xs">
            Ask about availability, pricing or take a virtual tour. We'll reply within minutes.
          </p>
          <div className="space-y-2 mb-8 flex-1">
            {UNITS.map(u => (
              <a key={u.name}
                href={`https://wa.me/${wa}?text=${encodeURIComponent(u.wa)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-green-400/35 transition-all duration-200 group">
                <div>
                  <p className="text-white/65 font-body text-sm group-hover:text-white transition-colors leading-none">{u.name}</p>
                  <p className="text-white/25 font-body text-[10px] mt-0.5">Sleeps {u.beds} · {u.tag}</p>
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            ))}
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to enquire about short-term accommodation at CabHouse Apartments")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-green-400/35 transition-all duration-200 group">
              <span className="text-white/65 font-body text-sm group-hover:text-white transition-colors">Short-term / Daily Rate</span>
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to enquire about long-term monthly accommodation at CabHouse Apartments")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-green-400/35 transition-all duration-200 group">
              <span className="text-white/65 font-body text-sm group-hover:text-white transition-colors">Long-term / Monthly Lease</span>
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
          <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to enquire about CabHouse Apartments")}`}
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

        {/* Email — corporate / long-term */}
        <div className="flex-1 flex flex-col p-8 lg:p-12"
          style={{ backgroundColor: '#1a2e1f', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(16px)', transition: 'all 0.6s ease 0.1s' }}>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-gold)' }}>Corporate &amp; Long-Term</p>
          <h3 className="font-display font-black text-white leading-[0.95] mb-3"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
            Send a Formal <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Enquiry</em>
          </h3>
          <p className="text-white/50 font-body text-xs leading-relaxed mb-7 max-w-xs">
            For company relocations, long-term lettings and staff accommodation — we'll respond with availability and rates.
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
              <select value={form.unit} onChange={set('unit')} className={inputCls}>
                <option value="">Apartment type</option>
                <option>Studio Apartment</option>
                <option>1-Bedroom Apartment</option>
                <option>2-Bedroom Apartment</option>
                <option>Multiple units</option>
              </select>
              <input value={form.dates} onChange={set('dates')} placeholder="Preferred move-in date / duration" className={inputCls} />
              <textarea required value={form.message} onChange={set('message')}
                placeholder="Tell us about your requirements…"
                rows={3} className={`${inputCls} resize-none`} />
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
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '65dvh', minHeight: 380 }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/updated-cabhouse aprtment image.png')`, backgroundColor: 'var(--color-dark)' }}
      />
      <div className="absolute inset-0 bg-black/55 lg:hidden" />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ background: 'linear-gradient(to right, var(--color-dark) 0%, var(--color-dark) 28%, rgba(17,17,17,0.75) 50%, rgba(17,17,17,0.2) 80%, transparent 100%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease', paddingBottom: 48 }}
      >
        <p className="text-brand-gold/70 font-body text-[9px] uppercase tracking-[0.3em] font-bold mb-3">CabHouse Apartments · Kisii Town</p>
        <h1
          className="font-display font-black text-white leading-[0.93] mb-4"
          style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.025em' }}
        >
          Your Home<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>in Kisii Town</em>
        </h1>
        <p className="text-white/70 font-body text-sm leading-relaxed mb-8 max-w-[28rem]">
          The sophisticated comfort of home blended with world-class hospitality — right in the heart of Kisii. Whether it's an overnight visit, a business trip or a full relocation, we have your space ready.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to enquire about CabHouse Apartments")}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/25 uppercase tracking-wide text-center"
          >
            Check Availability
          </a>
          <a
            href="#enquire"
            className="border border-white/30 hover:border-white text-white font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/10 uppercase tracking-wide text-center"
          >
            Corporate Enquiry
          </a>
        </div>
      </div>
    </div>
    </section>
  )
}

const APT_PHOTOS = [
  { src: '/assets/updated-cabhouse aprtment image.png', label: 'CabHouse Apartments' },
  { src: '/assets/apartments-top.png', label: 'CabHouse Apartments' },
  { src: '/assets/apartment-top2.png', label: 'CabHouse Apartments Exterior' },
  { src: '/assets/apartment-top3.png', label: 'CabHouse Apartments Building' },
  { src: '/assets/apartments-6.jpeg', label: 'Apartment' },
  { src: '/assets/comfortable-living-room-16.jpeg', label: 'Living Room' },
  { src: '/assets/living-room-12.jpeg', label: 'Lounge' },
  { src: '/assets/confortable-bed-11.jpeg', label: 'Bedroom' },
  { src: '/assets/apartments-9.jpeg', label: 'Apartment View' },
  { src: '/assets/kitchen-14.jpeg', label: 'Kitchen' },
  { src: '/assets/confortable-bed-18.jpeg', label: 'Bedroom' },
  { src: '/assets/sitting-room-23.jpeg', label: 'Sitting Room' },
  { src: '/assets/apartments-10.jpeg', label: 'Apartment' },
  { src: '/assets/kitchen-17.jpeg', label: 'Kitchen' },
  { src: '/assets/comfortable-bed-24.jpeg', label: 'Bedroom' },
  { src: '/assets/living-room-far-13.jpeg', label: 'Living Area' },
  { src: '/assets/apartments-7.jpeg', label: 'Apartment' },
  { src: '/assets/confortable-bed-15.jpeg', label: 'Bedroom' },
  { src: '/assets/confortable-bed-22.jpeg', label: 'Bedroom' },
  { src: '/assets/clean-toilet-30.jpeg', label: 'Bathroom' },
]

export default function ApartmentsPage() {
  const { ref, inView } = useInView(0.1)

  return (
    <Layout>
      <HeroSection />

      {/* Units — gold */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#D4B882' }}>
          <div className="max-w-7xl mx-auto">
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="mb-10"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
            >
              <h2
                className="font-display font-black text-brand-dark leading-[0.93] mb-2"
                style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
              >
                Short Stay. Long Stay. <em className="not-italic" style={{ color: '#7a5a2a' }}>Your Choice.</em>
              </h2>
              <p className="text-brand-dark/50 font-body text-xs">Daily · Weekly · Monthly · Annual leasing available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {UNITS.map((u, i) => (
                <div key={i} className="bg-white/30 border border-black/10 rounded-2xl p-6 hover:bg-white/50 transition-all duration-200">
                  <span className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-brand-dark/70 bg-black/10 px-2.5 py-1 rounded-full">
                    {u.tag}
                  </span>
                  <h3 className="font-display font-bold text-brand-dark mt-4 mb-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
                    {u.name}
                  </h3>
                  <p className="text-brand-dark/50 font-body text-xs leading-relaxed mb-2">{u.desc}</p>
                  <p className="text-brand-dark/35 font-body text-[10px] mb-5">Sleeps up to {u.beds} · Wi-Fi · Fully furnished</p>
                  <a
                    href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(u.wa)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block text-center text-white font-body font-semibold text-xs tracking-widest uppercase py-2.5 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: '#1a2e1f' }}
                  >
                    Enquire
                  </a>
                </div>
              ))}
            </div>

            {/* Perks strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PERKS.map((item, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 bg-white/30">
                  <p className="text-brand-dark/60 font-body text-[9px] uppercase tracking-[0.3em] font-semibold mb-1">{item.label}</p>
                  <p className="font-display font-bold text-brand-dark text-base mb-0.5">{item.value}</p>
                  <p className="text-brand-dark/40 font-body text-[10px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MasonryGallery
        photos={APT_PHOTOS}
        title='Inside Your <em class="not-italic" style="color:var(--color-gold)">Home Away</em>'
        subtitle="Tap any photo to view full size"
        columns="columns-2 sm:columns-3 lg:columns-4 xl:columns-5"
        gap={6}
      />

      <DualCTA />
    </Layout>
  )
}
