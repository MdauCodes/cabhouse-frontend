import { useState, useEffect, useCallback } from 'react'
import { useMediaUrl } from '../hooks/useMedia'
import { SITE } from '../config/site'

// ─── Typing effect ────────────────────────────────────────────────────────────
const TYPED_LINES = [
  'Starts Here',
  'Awaits in Kisii',
  'Is Unforgettable',
  'Begins at CabHouse',
  'Is One Visit Away',
  'Is Worth Every Minute',
]

function useTyping(lines: string[]) {
  const [displayed, setDisplayed] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const full = lines[lineIdx]
    if (!isDeleting && displayed === full) {
      const t = setTimeout(() => setIsDeleting(true), 2200)
      return () => clearTimeout(t)
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setLineIdx(i => (i + 1) % lines.length)
      return
    }
    const speed = isDeleting ? 35 : 58
    const t = setTimeout(() => {
      setDisplayed(isDeleting ? full.slice(0, displayed.length - 1) : full.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [displayed, isDeleting, lineIdx, lines])

  return displayed
}

// ─── Slideshow ────────────────────────────────────────────────────────────────
function useSlideshow(slides: (string | null | undefined)[]) {
  const valid = slides.filter(Boolean) as string[]
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const advance = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setCurrent(c => (c + 1) % Math.max(valid.length, 1))
      setFading(false)
    }, 700)
  }, [valid.length])

  useEffect(() => {
    if (valid.length < 2) return
    const t = setInterval(advance, 6000)
    return () => clearInterval(t)
  }, [advance, valid.length])

  return { slides: valid, current, fading }
}

// ─── Side brand cards ─────────────────────────────────────────────────────────
const SIDE_BRANDS = [
  {
    name: 'CabHouse Water',
    label: 'Hydration',
    tagline: 'Pure, crisp water — bulk or domestic, delivered to your door.',
    cta: 'Order Now',
    href: '/water',
    accentColor: '#38BDF8',
    imageSrc: '/assets/cabhouse-water.png',
  },
  {
    name: 'CabHouse Apartments',
    label: 'Accommodation',
    tagline: 'Fully furnished apartments in the heart of Kisii town.',
    cta: 'Book a Stay',
    href: '/apartments',
    accentColor: '#C9A84C',
    imageSrc: '/assets/cabhouse-apartments.png',
  },
]

// ─── Main hero ────────────────────────────────────────────────────────────────
export default function BrandPillars() {
  const typed = useTyping(TYPED_LINES)

  const s1 = useMediaUrl('hero-1')
  const s2 = useMediaUrl('hero-2')
  const s3 = useMediaUrl('hero-3')
  const s4 = useMediaUrl('hero-4')
  const { slides, current, fading } = useSlideshow([s1, s2, s3, s4])

  const wa = SITE.contact.whatsapp.replace('+', '')

  return (
    <section
      id="brands"
      className="relative overflow-hidden bg-brand-dark"
      style={{ height: '100dvh', minHeight: 580 }}
    >
      {/* ── Background slideshow ── */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === current ? (fading ? 0 : 1) : 0,
              transition: 'opacity 900ms ease',
              animation: i === current ? 'kenBurns 16s ease-in-out infinite alternate' : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-brand-dark/60 lg:hidden" />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, #0D1B12 0%, #0D1B12 28%, rgba(13,27,18,0.85) 42%, rgba(13,27,18,0.45) 60%, rgba(13,27,18,0.1) 78%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

      {/* ── Content row ── */}
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 w-full"
        style={{ paddingBottom: 72 }}>

        {/* Left — Park content */}
        <div className="flex-1 flex flex-col justify-center lg:max-w-[52%]">
          <p className="text-brand-gold/60 font-body text-[9px] uppercase tracking-[0.35em] font-bold mb-5">
            CabHouse Agencies Ltd · Kisii
          </p>

          <h1
            className="font-display font-black text-white mb-1"
            style={{ fontSize: 'clamp(2.2rem, 3.8vw, 4.2rem)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
          >
            Your Best Day Out
          </h1>
          <h1
            className="font-display font-black mb-7"
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 4.2rem)',
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: '#C9A84C',
              minHeight: '1.08em',
            }}
          >
            {typed}
            <span
              className="inline-block w-[3px] h-[0.8em] align-middle ml-1 bg-brand-gold rounded-sm"
              style={{ animation: 'blink 0.75s step-end infinite' }}
            />
          </h1>

          <p className="text-white/70 font-body text-sm leading-relaxed mb-8 max-w-[28rem]">
            Play, stay, dine and celebrate — everything for an unforgettable day is waiting in Kisii.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-9 flex-wrap">
            {[
              { v: '8+', l: 'Activities' },
              { v: '4.7★', l: 'Google Rating' },
              { v: 'Daily', l: '8 AM – 8 PM' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                <div>
                  <p className="text-white font-display font-bold text-xl leading-none">{s.v}</p>
                  <p className="text-white/35 text-[10px] font-body uppercase tracking-wide mt-0.5">{s.l}</p>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/10" />}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/20 uppercase tracking-wide"
            >
              Book via WhatsApp
            </a>
            <a
              href="/park"
              className="border border-white/25 hover:border-white/60 text-white font-body font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:bg-white/8 uppercase tracking-wide"
            >
              Explore the Park
            </a>
          </div>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="flex items-center gap-1.5 mt-10 pt-6 border-t border-white/8">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1 bg-brand-gold' : 'w-1 h-1 bg-white/20'}`}
                />
              ))}
              <span className="text-white/15 text-[9px] font-body ml-1 tracking-widest tabular-nums">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Right — Brand cards (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 ml-auto w-[310px] xl:w-[350px] self-center">
          {SIDE_BRANDS.map(b => (
            <a
              key={b.name}
              href={b.href}
              className="group relative overflow-hidden rounded-2xl flex flex-col"
              style={{
                height: 210,
                boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
                style={{ backgroundImage: `url(${b.imageSrc})` }}
              />
              {/* Base overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10" />
              {/* Accent shimmer on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(160deg, ${b.accentColor}22 0%, transparent 55%)` }}
              />
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: b.accentColor }} />

              {/* Content */}
              <div className="relative z-10 mt-auto p-5">
                <p
                  className="font-body text-[9px] uppercase tracking-[0.28em] font-bold mb-2"
                  style={{ color: b.accentColor }}
                >
                  {b.label}
                </p>
                <h3
                  className="font-display font-black text-white leading-tight mb-1.5"
                  style={{ fontSize: 'clamp(1rem, 1.4vw, 1.25rem)', letterSpacing: '-0.02em' }}
                >
                  {b.name}
                </h3>
                <p className="text-white/55 font-body text-[11px] leading-snug mb-4">{b.tagline}</p>

                {/* Pill CTA button */}
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body font-bold text-[11px] uppercase tracking-wider transition-all duration-200 group-hover:gap-3"
                  style={{
                    background: `${b.accentColor}22`,
                    border: `1px solid ${b.accentColor}55`,
                    color: b.accentColor,
                  }}
                >
                  {b.cta}
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" stroke={b.accentColor} strokeWidth="2.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Mobile brand chips — horizontal scroll below CTAs ── */}
      <div className="lg:hidden absolute bottom-16 left-0 right-0 z-10 px-8 flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {SIDE_BRANDS.map(b => (
          <a
            key={b.name}
            href={b.href}
            className="group flex-shrink-0 relative overflow-hidden rounded-xl flex items-end"
            style={{ width: 180, height: 90 }}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${b.imageSrc})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />
            <div className="relative z-10 p-3">
              <p className="font-body text-[8px] uppercase tracking-widest mb-0.5" style={{ color: b.accentColor }}>{b.label}</p>
              <p className="text-white font-display font-bold text-xs leading-tight">{b.name}</p>
            </div>
          </a>
        ))}
      </div>

      {/* ── Wavy bottom — pronounced white wave ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: '100%', height: 72, display: 'block' }}>
          <path
            d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,18 1440,36 L1440,72 L0,72 Z"
            fill="white"
          />
        </svg>
      </div>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.06) translate(-1%, -0.8%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
