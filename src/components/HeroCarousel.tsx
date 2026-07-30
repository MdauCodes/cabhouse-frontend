import { useState, useEffect } from 'react'
import { SITE } from '../config/site'
import { useContentBlocks } from '../hooks/useContentBlocks'

const PARK_SLIDES = [
  '/assets/hero-5.webp',
  '/assets/hero-new-1.webp',
  '/assets/hero-4.webp',
  '/assets/hero-new-2.webp',
  '/assets/hero-7.png',
  '/assets/hero-8.png',
  '/assets/hero-new-3.webp',
  '/assets/hero-6.png',
  '/assets/hero-10.png',
]

export default function HeroCarousel() {
  const [slideIdx, setSlideIdx] = useState(0)
  const { get } = useContentBlocks()

  const parkHeading    = get('hero.park.heading',         'Your Best Day Out.')
  const parkSubheading = get('hero.park.subheading',      'Pool, go-karts, camping, restaurant & events — open daily in Kisii.')
  const parkCta        = get('hero.park.cta',             'Book a Visit')
  const aptsHeading    = get('hero.apartments.heading',   'Your Home Away From Home.')
  const waterHeading   = get('hero.water.heading',        'Pure, Refreshing & Healthy.')

  const wa      = get('contact.whatsapp', SITE.contact.whatsapp).replace('+', '')
  const waBook  = `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`
  const waWater = `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to order CabHouse Water")}`

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % PARK_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      {/* Mobile layout */}
      <div className="flex flex-col gap-2 md:hidden">
        {/* Park — mobile */}
        <div className="relative overflow-hidden rounded-3xl" style={{ height: '62vw', minHeight: 260 }}>
          {PARK_SLIDES.map((src, i) => (
            <div key={src} className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(${src})`, opacity: i === slideIdx ? 1 : 0 }} />
          ))}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,18,5,0.96) 0%, rgba(5,18,5,0.55) 40%, rgba(0,0,0,0.15) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <p className="font-body text-xs font-black uppercase tracking-[0.18em] mb-2" style={{ color: '#C8873A' }}>CabHouse Park · Recreation</p>
            <h1 className="font-display font-black text-white leading-[0.93] mb-3" style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.03em' }}>{parkHeading}</h1>
            <div className="flex items-center gap-3">
              <a href={waBook} target="_blank" rel="noopener noreferrer"
                className="font-body font-bold text-xs uppercase tracking-wide px-5 py-2.5 rounded-full" style={{ backgroundColor: '#C8873A', color: '#fff' }}>
                {parkCta}
              </a>
            </div>
          </div>
        </div>

        {/* Apartments + Water row — mobile */}
        <div className="flex gap-2" style={{ height: '48vw', minHeight: 200 }}>
          <a href="/apartments" className="relative overflow-hidden rounded-3xl flex-1 group block">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]" style={{ backgroundImage: "url('/assets/apartment-top2.png')" }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <p className="font-body text-[11px] font-black uppercase tracking-[0.14em] mb-1" style={{ color: '#C4B5FD' }}>CabHouse Apartments</p>
              <h2 className="font-display font-black text-white text-sm leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{aptsHeading}</h2>
              <span className="inline-flex items-center gap-1 font-body font-semibold text-[10px] text-white/60 group-hover:text-white transition-colors">
                View <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </span>
            </div>
          </a>
          <a href={waWater} target="_blank" rel="noopener noreferrer"
            className="relative overflow-hidden rounded-3xl flex-1 group block">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]" style={{ backgroundImage: "url('/assets/cabhouse-water-25.jpeg')" }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <p className="font-body text-[11px] font-black uppercase tracking-[0.14em] mb-1" style={{ color: '#7DD3FC' }}>CabHouse Water</p>
              <h2 className="font-display font-black text-white text-sm leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{waterHeading}</h2>
              <span className="inline-flex items-center gap-1 font-body font-semibold text-[10px] text-white/60 group-hover:text-white transition-colors">
                Order <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-2" style={{ height: '60dvh', minHeight: 440, maxHeight: 720 }}>

        {/* LEFT: Park */}
        <div className="relative overflow-hidden rounded-3xl flex-1" style={{ minWidth: 0 }}>
          {PARK_SLIDES.map((src, i) => (
            <div key={src} className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(${src})`, opacity: i === slideIdx ? 1 : 0 }} />
          ))}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,18,5,0.97) 0%, rgba(5,18,5,0.88) 30%, rgba(5,18,5,0.45) 65%, rgba(0,0,0,0.1) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
            <p className="font-body text-sm font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#C8873A' }}>
              CabHouse Park · Recreation & Events
            </p>
            <h1 className="font-display font-black text-white leading-[0.93] mb-4"
              style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.03em' }}>
              {parkHeading}
            </h1>
            <p className="text-white/55 font-body text-sm leading-relaxed mb-6 max-w-xs">
              {parkSubheading}
            </p>
            <div className="flex items-center gap-4">
              <a href={waBook} target="_blank" rel="noopener noreferrer"
                className="font-body font-bold text-xs uppercase tracking-[0.1em] px-6 py-3 rounded-full transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: '#C8873A', color: '#fff' }}>
                {parkCta}
              </a>
              <a href="#packages" className="font-body font-semibold text-sm text-white/55 hover:text-white transition-colors flex items-center gap-1.5">
                See Packages
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Apartments + Water stacked */}
        <div className="flex flex-col gap-2" style={{ width: '34%', flexShrink: 0 }}>
          <a href="/apartments" className="relative overflow-hidden rounded-3xl flex-1 group block" style={{ minHeight: 0 }}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
              style={{ backgroundImage: "url('/assets/apartment-top2.png')" }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="font-body text-sm font-black uppercase tracking-[0.16em] mb-1.5" style={{ color: '#C4B5FD' }}>
                CabHouse Apartments
              </p>
              <h2 className="font-display font-black text-white text-lg leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
                {aptsHeading}
              </h2>
              <span className="inline-flex items-center gap-1.5 font-body font-semibold text-xs text-white/60 group-hover:text-white transition-colors">
                View Apartments
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </span>
            </div>
          </a>

          <a href={waWater} target="_blank" rel="noopener noreferrer"
            className="relative overflow-hidden rounded-3xl flex-1 group block" style={{ minHeight: 0 }}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
              style={{ backgroundImage: "url('/assets/cabhouse-water-25.jpeg')" }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="font-body text-sm font-black uppercase tracking-[0.16em] mb-1.5" style={{ color: '#7DD3FC' }}>
                CabHouse Water
              </p>
              <h2 className="font-display font-black text-white text-lg leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
                {waterHeading}
              </h2>
              <span className="inline-flex items-center gap-1.5 font-body font-semibold text-xs text-white/60 group-hover:text-white transition-colors">
                Order Now
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
