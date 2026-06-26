import { useState, useEffect, useCallback, useRef } from 'react'
import { SITE } from '../config/site'

const wa = SITE.contact.whatsapp.replace('+', '')

type Brand = {
  id: string
  name: string
  tagline: string
  desc: string
  color: string
  dot: string
  headline: string
  sub: string
  heroTagline: string
  stats: { val: string; label: string }[]
  cta: { label: string; href: string; external?: boolean }
  cta2?: { label: string; href: string }
  slides: string[]
}

const BRANDS: Brand[] = [
  {
    id: 'park',
    name: 'CabHouse Park',
    tagline: 'Play. Stay. Celebrate.',
    desc: 'Pool, go-karts, camping, restaurant & events — open daily in Kisii.',
    color: 'var(--color-gold)',
    dot: '#C8873A',
    headline: 'Your Best Day Out',
    sub: 'Awaits in Kisii.',
    heroTagline: 'Unleash Your Energy, Nourish Your Soul.',
    stats: [
      { val: '8+', label: 'Activities' },
      { val: '4.7★', label: 'Rating' },
      { val: '8AM–8PM', label: 'Daily' },
    ],
    cta: { label: 'Book a Visit', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`, external: true },
    cta2: { label: 'See Packages', href: '#packages' },
    slides: ['/assets/hero-5.webp', '/assets/hero-4.webp', '/assets/hero-7.png', '/assets/hero-8.png'],
  },
  {
    id: 'apartments',
    name: 'CabHouse Apartments',
    tagline: 'Home Away From Home.',
    desc: 'Premium furnished apartments for short & long stays in Kisii town.',
    color: '#C4B5FD',
    dot: '#8B5CF6',
    headline: 'Your Home',
    sub: 'Away From Home.',
    heroTagline: 'Premium furnished apartments in the heart of Kisii town.',
    stats: [
      { val: 'Short', label: 'Term Stays' },
      { val: 'Long', label: 'Term Stays' },
      { val: 'Kisii', label: 'Town Centre' },
    ],
    cta: { label: 'View Apartments', href: '/apartments' },
    cta2: { label: 'Enquire', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to enquire about CabHouse Apartments")}` },
    slides: ['/assets/apartments-7.jpeg', '/assets/apartments-6.jpeg'],
  },
  {
    id: 'water',
    name: 'CabHouse Water',
    tagline: 'Premium Water Delivered.',
    desc: 'Pure, locally sourced water for home and bulk delivery across Kisii.',
    color: '#7DD3FC',
    dot: '#0EA5E9',
    headline: 'Pure. Local.',
    sub: 'Delivered.',
    heroTagline: 'Premium water sourced and bottled right here in Kisii.',
    stats: [
      { val: 'Bulk', label: 'Orders' },
      { val: 'Home', label: 'Delivery' },
      { val: 'Kisii', label: 'Sourced' },
    ],
    cta: { label: 'Order Water', href: `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}`, external: true },
    cta2: { label: 'Learn More', href: '/water' },
    slides: ['/assets/cabhouse-water-25.jpeg'],
  },
]

const SLIDE_DURATION = 5500

export default function HeroCarousel() {
  const [activeBrand, setActiveBrand] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [contentVisible, setContentVisible] = useState(true)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const brand = BRANDS[activeBrand]
  const currentSlide = brand.slides[slideIdx % brand.slides.length]

  const switchBrand = useCallback((idx: number) => {
    if (idx === activeBrand) return
    setContentVisible(false)
    setTimeout(() => {
      setActiveBrand(idx)
      setSlideIdx(0)
      setProgress(0)
      setContentVisible(true)
    }, 250)
  }, [activeBrand])

  // auto-advance slides within brand
  useEffect(() => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    const step = 100 / (SLIDE_DURATION / 50)
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setSlideIdx(i => i + 1)
          return 0
        }
        return p + step
      })
    }, 50)
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [activeBrand, slideIdx])

  // preload all brand slides
  const allSlides = BRANDS.flatMap(b => b.slides)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '70dvh', minHeight: 480, maxHeight: 760 }}>

      {/* All slide backgrounds */}
      {allSlides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${src})`, opacity: src === currentSlide ? 1 : 0 }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

      {/* === LEFT — Hero content === */}
      <div
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-14 max-w-xl"
        style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}
      >
        {/* Brand eyebrow */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-[0.15em]"
            style={{
              border: `1px solid ${brand.color}`,
              color: brand.color,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
            {brand.name}
          </span>
        </div>

        <h1 className="font-display font-black text-white leading-[1.0] mb-1.5"
          style={{ fontSize: 'var(--type-hero)', letterSpacing: '-0.03em' }}>
          {brand.headline}
        </h1>
        <h1 className="font-display font-black leading-[1.0] mb-4"
          style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.03em', color: brand.color }}>
          {brand.sub}
        </h1>

        <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
          {brand.heroTagline}
        </p>

        <div className="flex items-center gap-5 mb-7">
          {brand.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-5">
              {i > 0 && <div className="w-px h-5 bg-white/15" />}
              <div>
                <p className="font-display font-black text-white text-lg leading-none">{s.val}</p>
                <p className="text-white/40 font-body text-[9px] uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={brand.cta.href}
            {...(brand.cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: brand.color, color: '#111' }}
          >
            {brand.cta.label}
          </a>
          {brand.cta2 && (
            <a href={brand.cta2.href}
              className="font-body font-semibold text-sm text-white/65 hover:text-white transition-colors flex items-center gap-1.5">
              {brand.cta2.label}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* === RIGHT — Brand switcher card === */}
      <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2 w-64">
        {BRANDS.map((b, i) => {
          const isActive = i === activeBrand
          return (
            <button
              key={b.id}
              onClick={() => switchBrand(i)}
              className="text-left rounded-2xl transition-all duration-300"
              style={{
                background: isActive ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.30)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isActive ? `1px solid ${b.color}` : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? `0 0 0 1px ${b.dot}22, 0 8px 32px rgba(0,0,0,0.3)` : 'none',
                padding: isActive ? '16px' : '12px 16px',
              }}
            >
              {/* Brand header */}
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? b.color : 'rgba(255,255,255,0.25)' }} />
                <span
                  className="font-body font-bold text-xs uppercase tracking-[0.12em]"
                  style={{ color: isActive ? b.color : 'rgba(255,255,255,0.45)' }}
                >
                  {b.name}
                </span>
              </div>

              {/* Tagline — always visible */}
              <p className="font-display font-bold text-sm pl-4.5 leading-tight"
                style={{
                  color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)',
                  paddingLeft: '18px',
                }}>
                {b.tagline}
              </p>

              {/* Expanded content */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isActive ? '120px' : '0px', opacity: isActive ? 1 : 0, marginTop: isActive ? 10 : 0 }}
              >
                <p className="text-white/50 font-body text-xs leading-relaxed mb-3" style={{ paddingLeft: '18px' }}>
                  {b.desc}
                </p>
                {/* Slide progress for this brand */}
                <div style={{ paddingLeft: '18px' }}>
                  <div className="relative h-0.5 bg-white/15 rounded-full overflow-hidden" style={{ width: 80 }}>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-none"
                      style={{ width: `${progress}%`, backgroundColor: b.color }}
                    />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Mobile — brand tabs at bottom */}
      <div className="absolute bottom-5 left-6 right-6 z-20 flex gap-2 lg:hidden">
        {BRANDS.map((b, i) => {
          const isActive = i === activeBrand
          return (
            <button
              key={b.id}
              onClick={() => switchBrand(i)}
              className="flex-1 rounded-xl py-2.5 px-3 text-left transition-all duration-200"
              style={{
                background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(12px)',
                border: isActive ? `1px solid ${b.color}` : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5" style={{ backgroundColor: isActive ? b.color : 'rgba(255,255,255,0.25)' }} />
              <span className="font-body font-bold text-[9px] uppercase tracking-wide" style={{ color: isActive ? b.color : 'rgba(255,255,255,0.4)' }}>
                {b.id === 'park' ? 'Park' : b.id === 'apartments' ? 'Apartments' : 'Water'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
    </section>
  )
}
