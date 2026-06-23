import { useState, useEffect, useCallback } from 'react'
import { SITE } from '../config/site'

const SLIDES = [
  {
    img: '/assets/park-pool.jpeg',
    eyebrow: 'SOMEWHERE TO COOL OFF',
    headline: "Yes — there's a pool.",
    accent: "And it's open to you.",
    sub: 'Day visits or overnight stays built around the water and the people you came with.',
    cta2: { label: 'Explore Park →', href: '/park' },
  },
  {
    img: '/assets/park-adventure.jpeg',
    eyebrow: 'PUSH YOUR LIMITS',
    headline: 'Zip lines. Go-karts.',
    accent: 'Pure adrenaline.',
    sub: 'Eight activity zones set against the open Kisii sky — from rainbow slides to sky bikes.',
    cta2: { label: 'View Activities →', href: '/park#games' },
  },
  {
    img: '/assets/park-group.jpeg',
    eyebrow: 'READY WHEN YOU ARE',
    headline: 'One family.',
    accent: 'Endless experiences.',
    sub: 'Park, Water, Apartments — all in one place. Book any experience with one message.',
    cta2: { label: 'Our Story →', href: '/about' },
  },
  {
    img: '/assets/park-games.jpeg',
    eyebrow: 'THE PLACE FAMILIES CHOOSE',
    headline: 'The place the family',
    accent: 'keeps coming back to.',
    sub: 'Comfortable stays and easy days that everyone — kids included — settle into fast.',
    cta2: { label: 'Book a Stay →', href: '/relax' },
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((idx: number) => {
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 350)
  }, [])

  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [active, goTo])

  const slide = SLIDES[active]
  const wa = SITE.contact.whatsapp.replace('+', '')

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(520px, 85vh, 800px)' }}>

      {/* Background images — crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${s.img})`, opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Badge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
        <img src="/assets/logo-agencies.png" alt="CabHouse" className="h-5 w-auto" style={{ mixBlendMode: 'screen' }} />
        <span className="text-white font-body text-[10px] uppercase tracking-[0.2em] font-bold">CabHouse Agencies Ltd</span>
      </div>

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-24 max-w-5xl"
        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
          {slide.eyebrow}
        </p>
        <h1
          className="font-display font-black text-white leading-[1.0] mb-3"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', letterSpacing: '-0.03em' }}
        >
          {slide.headline}<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>{slide.accent}</em>
        </h1>
        <p className="text-white/65 font-body text-sm leading-relaxed mb-8 max-w-lg">{slide.sub}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/${wa}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body font-bold text-sm px-7 py-3.5 rounded-full uppercase tracking-wide transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}
          >
            BOOK NOW →
          </a>
          <a
            href={slide.cta2.href}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-7 py-3.5 rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            {slide.cta2.label}
          </a>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              backgroundColor: i === active ? 'var(--color-gold)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
