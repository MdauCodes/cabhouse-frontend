import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    title: 'Holistic Well-Being',
    desc: 'We promote healthy, active living across all our entertainment and hospitality services "” mind, body and spirit.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'Uncompromising Quality',
    desc: 'From meticulously maintained facilities to pristine water filtration "” your safety and comfort always come first.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Unified Convenience',
    desc: 'Your single, trusted partner for recreation, accommodation and hydration "” everything under one roof in Kisii.',
  },
]

const BRANDS = [
  {
    label: 'Park',
    name: 'CabHouse Park',
    href: '/park',
    color: 'bg-brand-gold',
    desc: 'Your ultimate playground for active fun, family bonding and corporate milestones. Eight activity zones, dining, events and overnight stays.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Water',
    name: 'CabHouse Water',
    href: '/water',
    color: 'bg-sky-600',
    desc: 'Pure, crisp hydration engineered to sustain your health and active lifestyle. Responsibly sourced, rigorously filtered, delivered to your door.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
  {
    label: 'Apartments',
    name: 'CabHouse Apartments',
    href: '/apartments',
    color: 'bg-brand-gold',
    desc: 'The sophisticated comfort of home blended with world-class hospitality. Furnished apartments in the heart of Kisii town "” short or long stay.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 22V12M21 22V12M1 12h22M12 2L2 7h20L12 2z"/><rect x="9" y="17" width="6" height="5"/>
      </svg>
    ),
  },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(18px)', transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s` }}
    >
      {children}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div style={{ overflowX: 'clip', background: 'var(--canvas)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="bg-brand-dark relative overflow-hidden rounded-3xl" style={{ minHeight: 380 }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, var(--color-gold) 0%, transparent 60%), radial-gradient(circle at 80% 20%, var(--color-green) 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <p className="text-brand-gold font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-4">About Us</p>
            <h1
              className="font-display font-black text-white leading-[0.93] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            >
              Where Hospitality,<br />
              <em className="not-italic text-brand-gold">Wellness & Adventure</em><br />
              Converge.
            </h1>
            <p className="text-white/60 font-body text-sm leading-relaxed max-w-xl">
              At CabHouse Agencies Ltd, we deliver premium lifestyle solutions designed to elevate your everyday experiences, travels and celebrations "” all under one roof in Kisii.
            </p>
          </FadeIn>
        </div>

      </div>
      </section>

      {/* Our Ecosystem */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-20">
          <FadeIn>
            <p className="text-brand-dark/35 font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">Our Ecosystem</p>
            <h2
              className="font-display font-black text-brand-dark mb-10 leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', letterSpacing: '-0.02em' }}
            >
              One Family.{' '}
              <em className="not-italic text-brand-gold">Three Experiences.</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRANDS.map((b, i) => (
              <FadeIn key={b.name} delay={i * 0.1}>
                <a href={b.href} className="group block border border-brand-dark/8 rounded-2xl p-6 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300">
                  <div className={`w-10 h-10 ${b.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {b.icon}
                  </div>
                  <p className="text-brand-dark/35 font-body text-[9px] uppercase tracking-widest mb-1">{b.label}</p>
                  <h3 className="font-display font-black text-brand-dark text-base mb-2" style={{ letterSpacing: '-0.02em' }}>{b.name}</h3>
                  <p className="text-brand-dark/55 font-body text-xs leading-relaxed mb-4">{b.desc}</p>
                  <span className="inline-flex items-center gap-1 text-brand-gold font-body font-semibold text-[10px] uppercase tracking-wider group-hover:gap-2 transition-all duration-200">
                    Explore
                    <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-20">
          <FadeIn>
            <p className="text-brand-dark/35 font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">What Drives Us</p>
            <h2
              className="font-display font-black text-brand-dark mb-10 leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', letterSpacing: '-0.02em' }}
            >
              The Values Behind{' '}
              <em className="not-italic text-brand-gold">Everything We Do</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-brand-gold/12 text-brand-gold rounded-xl flex items-center justify-center">
                    {v.icon}
                  </div>
                  <h3 className="font-display font-black text-brand-dark text-sm" style={{ letterSpacing: '-0.01em' }}>{v.title}</h3>
                  <p className="text-brand-dark/55 font-body text-xs leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline banner */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="bg-brand-dark rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16 text-center">
        <FadeIn>
          <p className="text-brand-gold font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Our Promise</p>
          <h2
            className="font-display font-black text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)', letterSpacing: '-0.03em' }}
          >
            Unleash Your Energy,{' '}
            <em className="not-italic text-brand-gold">Nourish Your Soul.</em>
          </h2>
          <p className="text-white/50 font-body text-sm leading-relaxed max-w-xl mx-auto mb-8">
            From high-flying thrills to serene gardens "” a vibrant sanctuary of fun and wellness crafted for every generation. Make Kisii your next destination.
          </p>
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to know more about CabHouse Agencies")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 uppercase tracking-wide"
          >
            Get in Touch
          </a>
        </FadeIn>
      </div>
      </section>

      {/* Location */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
              <div className="lg:w-1/2">
                <p className="text-brand-dark/35 font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">Find Us</p>
                <h2 className="font-display font-black text-brand-dark text-xl mb-4" style={{ letterSpacing: '-0.02em' }}>
                  Based in <em className="not-italic text-brand-gold">Kisii, Kenya</em>
                </h2>
                <div className="flex flex-col gap-3 text-brand-dark/60 font-body text-sm">
                  <p>{SITE.location.address}</p>
                  <p>{SITE.location.poBox}</p>
                  <p>
                    <a href={`tel:${SITE.contact.phone}`} className="hover:text-brand-gold transition-colors">{SITE.contact.phone}</a>
                    {' · '}
                    <a href={`tel:${SITE.contact.phone2}`} className="hover:text-brand-gold transition-colors">{SITE.contact.phone2}</a>
                  </p>
                  <p>
                    <a href={`mailto:${SITE.contact.email}`} className="hover:text-brand-gold transition-colors">{SITE.contact.email}</a>
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col gap-3">
                {BRANDS.map((b) => (
                  <a key={b.name} href={b.href}
                    className="flex items-center gap-4 border border-brand-dark/8 rounded-xl px-5 py-3.5 hover:border-brand-gold/40 hover:bg-brand-cream transition-all duration-200 group">
                    <div className={`w-8 h-8 ${b.color} text-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {b.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-brand-dark text-sm" style={{ letterSpacing: '-0.01em' }}>{b.name}</p>
                      <p className="text-brand-dark/40 font-body text-[10px]">{b.label === 'Park' ? 'Open daily 8AM "“ 8PM' : b.label === 'Water' ? 'Delivery available' : 'Short & long stays'}</p>
                    </div>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-brand-dark/25 group-hover:text-brand-gold transition-colors" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
