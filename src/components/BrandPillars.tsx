import { useState, useEffect } from 'react'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'

// ─── Typing effect ────────────────────────────────────────────────────────────
const PARK_LINES = [
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const PARK = {
  tag: 'Open Daily · 8 AM – 8 PM',
  cta: 'Plan Your Visit',
  href: '/park',
  imageId: 'hero-1',
}

const SIDES = [
  {
    id: 'water',
    name: 'CabHouse Water',
    label: 'Hydrate',
    tagColor: 'bg-sky-500/90 text-white',
    accentColor: '#38BDF8',
    desc: 'Pure, crisp water delivered to your door. Bulk or domestic.',
    cta: 'Order Water',
    href: '/water',
    imageSrc: '/assets/cabhouse-water.png',
    logoSrc: '/assets/logo-water.png',
  },
  {
    id: 'apt',
    name: 'CabHouse Apartments',
    label: 'Stay',
    tagColor: 'bg-brand-gold/90 text-white',
    accentColor: '#C9A84C',
    desc: 'Furnished apartments in Kisii town. Short or long term.',
    cta: 'Book a Stay',
    href: '/apartments',
    imageSrc: '/assets/cabhouse-apartments.png',
    logoSrc: '/assets/logo-apartments.png',
  },
]

// ─── Park card ────────────────────────────────────────────────────────────────
function ParkCard({ inView }: { inView: boolean }) {
  const url = useMediaUrl(PARK.imageId)
  const typed = useTyping(PARK_LINES)

  return (
    <a
      href={PARK.href}
      className="group relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        flex: '1.65 1 0',
        minHeight: 380,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#0D1B12' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-brand-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/25 to-transparent" />

      {/* Badge */}
      <div className="relative z-10 p-5 lg:p-6">
        <span className="text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-brand-green text-white">
          {PARK.tag}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-auto p-5 lg:p-7">
        <p className="text-white/40 font-body text-[10px] uppercase tracking-[0.25em] mb-2">The Adventure Park</p>

        <h2
          className="font-display font-black text-white leading-[1.0] mb-1"
          style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.8rem)', letterSpacing: '-0.03em' }}
        >
          Your Best Day Out
        </h2>
        <h2
          className="font-display font-black leading-[1.0] mb-5"
          style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.8rem)', letterSpacing: '-0.03em', color: '#C9A84C', minHeight: '1.1em' }}
        >
          {typed}
          <span
            className="inline-block w-[3px] h-[0.82em] align-middle ml-1 bg-brand-gold rounded-sm"
            style={{ animation: 'blink 0.75s step-end infinite' }}
          />
        </h2>

        <p className="text-white/80 font-body text-xs leading-relaxed mb-5 max-w-[30rem]">
          Zip lines, go-karts, pools, dining and overnight camping — everything for an unforgettable day, all in one place in Kisii.
        </p>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mb-6 text-white/55 font-body text-[10px] uppercase tracking-wide">
          <span>8+ Activities</span>
          <span className="w-px h-3 bg-white/15" />
          <span>4.7★ Google</span>
          <span className="w-px h-3 bg-white/15" />
          <span>Est. 2022</span>
        </div>

        <span className="inline-flex items-center gap-2 bg-brand-gold group-hover:bg-brand-orange text-white font-body font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors duration-200">
          {PARK.cta}
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </a>
  )
}

// ─── Side card ────────────────────────────────────────────────────────────────
function SideCard({ brand, idx, inView }: { brand: typeof SIDES[0]; idx: number; inView: boolean }) {
  return (
    <a
      href={brand.href}
      className="group relative overflow-hidden rounded-2xl flex flex-col flex-1"
      style={{
        minHeight: 185,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `opacity 0.65s ease ${(idx + 1) * 0.12}s, transform 0.65s ease ${(idx + 1) * 0.12}s`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${brand.imageSrc})` }}
      />
      {/* Strong base dark layer */}
      <div className="absolute inset-0 bg-brand-dark/60" />
      {/* Gradient to concentrate darkness at bottom where text lives */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/75 to-transparent" />

      {/* Accent shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(150deg, ${brand.accentColor}18 0%, transparent 55%)` }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: brand.accentColor, opacity: 0.55 }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: brand.accentColor, boxShadow: `0 0 8px ${brand.accentColor}` }} />

      {/* Badge */}
      <div className="relative z-10 p-4">
        <span className={`text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${brand.tagColor}`}>
          {brand.label}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-auto p-4 rounded-b-2xl" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 60%, transparent 100%)' }}>
        <img src={brand.logoSrc} alt={brand.name} className="h-8 w-auto object-contain mb-2" style={{ mixBlendMode: 'screen' }} />
        <h3
          className="font-display font-black text-white text-sm leading-tight mb-1.5 drop-shadow-md"
          style={{ letterSpacing: '-0.02em' }}
        >
          {brand.name}
        </h3>
        <p className="text-white/90 font-body text-[11px] leading-relaxed mb-3">{brand.desc}</p>

        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-body font-bold text-[10px] uppercase tracking-wider transition-all duration-200 group-hover:gap-2.5"
          style={{
            background: `${brand.accentColor}35`,
            border: `1px solid ${brand.accentColor}80`,
            color: brand.accentColor,
          }}
        >
          {brand.cta}
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" stroke={brand.accentColor} strokeWidth="2.5">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </a>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function BrandPillars() {
  const { ref, inView } = useInView(0.05)

  return (
    <section
      id="brands"
      className="bg-brand-dark relative overflow-hidden"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(ellipse at 20% 80%, #C9A84C 0%, transparent 55%), radial-gradient(ellipse at 78% 10%, #2D6A4F 0%, transparent 50%)' }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 flex flex-col flex-1 max-w-7xl w-full mx-auto px-5 lg:px-10 pt-6 pb-8 lg:pt-8 lg:pb-10"
      >
        {/* Section label */}
        <div
          className="mb-4"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(10px)', transition: 'all 0.45s ease' }}
        >
          <p className="text-brand-gold/45 font-body text-[9px] uppercase tracking-[0.35em] font-bold">CabHouse Agencies Ltd</p>
          <h1
            className="font-display font-black text-white mt-1 leading-tight"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.45rem)', letterSpacing: '-0.025em' }}
          >
            One Family.{' '}
            <em className="not-italic" style={{ color: '#C9A84C' }}>Every Need Covered.</em>
          </h1>
        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1" style={{ minHeight: 0 }}>
          <ParkCard inView={inView} />
          <div className="flex flex-col gap-3 lg:w-[34%]">
            {SIDES.map((b, i) => (
              <SideCard key={b.id} brand={b} idx={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>

      {/* Wavy bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: '100%', height: 56, display: 'block' }}>
          <path
            d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
            fill="white"
          />
        </svg>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
