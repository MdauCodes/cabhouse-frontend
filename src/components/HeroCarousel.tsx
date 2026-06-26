import { useState } from 'react'
import { SITE } from '../config/site'

const wa = SITE.contact.whatsapp.replace('+', '')

const BRANDS = [
  {
    id: 'park',
    num: '01',
    name: 'CabHouse Park',
    eyebrow: 'Recreation & Events',
    headline: 'Your Best\nDay Out',
    tagline: 'Unleash your energy.\nNourish your soul.',
    img: '/assets/hero-5.webp',
    color: '#C8873A',
    cta: { label: 'Book a Visit', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}` },
    cta2: { label: 'See Packages', href: '#packages' },
    stats: [{ val: '8+', label: 'Activities' }, { val: '4.7★', label: 'Rating' }],
  },
  {
    id: 'apartments',
    num: '02',
    name: 'CabHouse Apartments',
    eyebrow: 'Short & Long Stays',
    headline: 'Your Home\nAway',
    tagline: 'Premium furnished\napartments in Kisii.',
    img: '/assets/apartments-7.jpeg',
    color: '#A78BFA',
    cta: { label: 'View Apartments', href: '/apartments' },
    cta2: { label: 'Enquire Now', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to enquire about CabHouse Apartments")}` },
    stats: [{ val: 'Short', label: 'Term' }, { val: 'Long', label: 'Term' }],
  },
  {
    id: 'water',
    num: '03',
    name: 'CabHouse Water',
    eyebrow: 'Home & Bulk Delivery',
    headline: 'Pure.\nLocal.\nDelivered.',
    tagline: 'Premium water from\nthe heart of Kisii.',
    img: '/assets/cabhouse-water-25.jpeg',
    color: '#38BDF8',
    cta: { label: 'Order Now', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}` },
    cta2: { label: 'Learn More', href: '/water' },
    stats: [{ val: 'Bulk', label: 'Orders' }, { val: 'Home', label: 'Delivery' }],
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      {/* ── Desktop: accordion ── */}
      <div
        className="relative overflow-hidden rounded-3xl hidden md:flex"
        style={{ height: '70dvh', minHeight: 520, maxHeight: 800 }}
      >
        {BRANDS.map((b, i) => {
          const isActive = i === active
          return (
            <div
              key={b.id}
              onClick={() => setActive(i)}
              className="relative overflow-hidden cursor-pointer flex-shrink-0 select-none"
              style={{
                width: isActive ? '58%' : '21%',
                transition: 'width 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
              }}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${b.img})`,
                  transform: isActive ? 'scale(1)' : 'scale(1.08)',
                  transition: 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
                  filter: isActive ? 'none' : 'brightness(0.55)',
                }}
              />

              {/* Active overlay: left-to-right gradient for text legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(100deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.08) 100%)',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />
              {/* Bottom vignette always */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

              {/* Column separator */}
              {i < BRANDS.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px z-10" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
              )}

              {/* ── Collapsed label (bottom) ── */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6 z-10"
                style={{
                  opacity: isActive ? 0 : 1,
                  transform: isActive ? 'translateY(6px)' : 'translateY(0)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  pointerEvents: isActive ? 'none' : 'auto',
                }}
              >
                <p className="font-body text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: b.color }}>
                  {b.num}
                </p>
                <p className="font-display font-black text-white text-base leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {b.name}
                </p>
              </div>

              {/* ── Expanded content ── */}
              <div
                className="absolute inset-0 flex flex-col justify-center px-10 z-10"
                style={{
                  paddingTop: '5rem',
                  paddingBottom: '4rem',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(-12px)',
                  transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Number + eyebrow */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: b.color }}>{b.num}</span>
                  <div className="w-8 h-px" style={{ backgroundColor: b.color, opacity: 0.5 }} />
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{b.eyebrow}</span>
                </div>

                {/* Headline */}
                <h1
                  className="font-display font-black text-white leading-[0.92] mb-5 whitespace-pre-line"
                  style={{ fontSize: 'var(--type-hero)', letterSpacing: '-0.03em' }}
                >
                  {b.headline}
                </h1>

                {/* Tagline */}
                <p className="text-white/50 font-body text-sm leading-relaxed mb-8 whitespace-pre-line">
                  {b.tagline}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-8">
                  {b.stats.map((s, si) => (
                    <div key={si} className="flex items-center gap-6">
                      {si > 0 && <div className="w-px h-6 bg-white/12" />}
                      <div>
                        <p className="font-display font-black text-white text-2xl leading-none">{s.val}</p>
                        <p className="text-white/30 font-body text-[9px] uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-5">
                  <a
                    href={b.cta.href}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="font-body font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 rounded-full transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: b.color, color: '#111' }}
                  >
                    {b.cta.label}
                  </a>
                  <a
                    href={b.cta2.href}
                    onClick={e => e.stopPropagation()}
                    className="font-body font-semibold text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    {b.cta2.label}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Mobile: stacked brand cards ── */}
      <div className="md:hidden flex flex-col gap-2">
        {BRANDS.map((b, i) => {
          const isActive = i === active
          return (
            <div
              key={b.id}
              onClick={() => setActive(i)}
              className="relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ height: isActive ? 380 : 80, transition: 'height 0.55s cubic-bezier(0.76, 0, 0.24, 1)' }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${b.img})`, filter: isActive ? 'none' : 'brightness(0.5)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />

              {/* Collapsed */}
              <div className="absolute inset-0 flex items-center px-5 z-10" style={{ opacity: isActive ? 0 : 1, transition: 'opacity 0.2s' }}>
                <span className="font-body text-[9px] font-bold uppercase tracking-widest mr-3" style={{ color: b.color }}>{b.num}</span>
                <span className="font-display font-black text-white text-base" style={{ letterSpacing: '-0.02em' }}>{b.name}</span>
              </div>

              {/* Expanded */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6 z-10"
                style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.3s ease 0.2s' }}
              >
                <p className="font-body text-[9px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: b.color }}>{b.eyebrow}</p>
                <h2 className="font-display font-black text-white text-2xl leading-[0.95] mb-3 whitespace-pre-line" style={{ letterSpacing: '-0.02em' }}>{b.headline}</h2>
                <p className="text-white/50 font-body text-xs leading-relaxed mb-4 whitespace-pre-line">{b.tagline}</p>
                <a
                  href={b.cta.href}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex font-body font-bold text-xs uppercase tracking-wide px-5 py-2.5 rounded-full"
                  style={{ backgroundColor: b.color, color: '#111' }}
                >
                  {b.cta.label}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
