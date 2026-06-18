import { useState, useEffect } from 'react'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'

const PARK_LINES = [
  'Starts Here',
  'Awaits in Kisii',
  'Is Unforgettable',
  'Begins at CabHouse',
  'Is One Visit Away',
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
    desc: 'Cold, clean water delivered to your door. Bulk or domestic — pure and crisp.',
    cta: 'Order Water',
    href: '/water',
    imageSrc: '/assets/cabhouse-water.png',
  },
  {
    id: 'apt',
    name: 'CabHouse Apartments',
    label: 'Stay',
    tagColor: 'bg-brand-gold/90 text-white',
    desc: 'Furnished apartments in Kisii town. Move in today — short or long term.',
    cta: 'Book a Stay',
    href: '/apartments',
    imageSrc: '/assets/cabhouse-apartments.png',
  },
]

function ParkCard({ inView }: { inView: boolean }) {
  const url = useMediaUrl(PARK.imageId)
  const typed = useTyping(PARK_LINES)

  return (
    <a
      href={PARK.href}
      className="group relative overflow-hidden rounded-2xl flex flex-col lg:flex-none"
      style={{
        minHeight: 420,
        flex: '1 1 0',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#0D1B12' }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-brand-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/30 to-transparent" />

      {/* Badge */}
      <div className="relative z-10 p-5 lg:p-6">
        <span className="text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-brand-green text-white">
          {PARK.tag}
        </span>
      </div>

      {/* Content pinned to bottom */}
      <div className="relative z-10 mt-auto p-5 lg:p-7">
        <p className="text-white/40 font-body text-[10px] uppercase tracking-[0.25em] mb-2">The Adventure Park</p>
        <h2
          className="font-display font-black text-white leading-[1.0] mb-1"
          style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', letterSpacing: '-0.03em' }}
        >
          Your Best Day Out
        </h2>
        <h2
          className="font-display font-black leading-[1.0] mb-4"
          style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', letterSpacing: '-0.03em', color: '#C9A84C', minHeight: '1.4em' }}
        >
          {typed}
          <span
            className="inline-block w-[2px] h-[0.85em] align-middle ml-[2px] bg-brand-gold"
            style={{ animation: 'blink 0.75s step-end infinite' }}
          />
        </h2>

        <p className="text-white/65 font-body text-xs leading-relaxed mb-5 max-w-[30rem]">
          Zip lines, go-karts, pools, dining and overnight camping — everything you need for an unforgettable day, all in one place in Kisii.
        </p>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mb-5 text-white/35 font-body text-[10px] uppercase tracking-wide">
          <span>8+ Activities</span>
          <span className="w-px h-3 bg-white/15" />
          <span>4.7★ Google</span>
          <span className="w-px h-3 bg-white/15" />
          <span>Est. 2022</span>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-brand-gold group-hover:bg-brand-orange text-white font-body font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors duration-200">
          {PARK.cta}
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </a>
  )
}

function SideCard({ brand, idx, inView }: { brand: typeof SIDES[0]; idx: number; inView: boolean }) {
  return (
    <a
      href={brand.href}
      className="group relative overflow-hidden rounded-2xl flex flex-col flex-1"
      style={{
        minHeight: 180,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `opacity 0.65s ease ${(idx + 1) * 0.12}s, transform 0.65s ease ${(idx + 1) * 0.12}s`,
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
        style={{ backgroundImage: `url(${brand.imageSrc})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-brand-dark/5" />

      <div className="relative z-10 p-4">
        <span className={`text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${brand.tagColor}`}>
          {brand.cta}
        </span>
      </div>

      <div className="relative z-10 mt-auto p-4">
        <p className="text-white/40 font-body text-[9px] uppercase tracking-widest mb-0.5">{brand.label}</p>
        <h3 className="font-display font-black text-white text-sm leading-tight mb-1.5" style={{ letterSpacing: '-0.02em' }}>
          {brand.name}
        </h3>
        <p className="text-white/60 font-body text-[11px] leading-relaxed mb-3">{brand.desc}</p>
        <span className="inline-flex items-center gap-1 text-brand-gold group-hover:text-white font-body font-semibold text-[10px] uppercase tracking-wider transition-colors duration-200">
          {brand.cta}
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function BrandPillars() {
  const { ref, inView } = useInView(0.05)

  return (
    <section
      id="brands"
      className="bg-brand-dark relative overflow-hidden"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Subtle background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(ellipse at 20% 80%, #C9A84C 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, #2D6A4F 0%, transparent 50%)' }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 flex flex-col flex-1 max-w-7xl w-full mx-auto px-5 lg:px-10 pt-6 pb-6 lg:pt-8 lg:pb-8"
      >
        {/* Section label */}
        <div
          className="mb-4"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(10px)', transition: 'all 0.45s ease' }}
        >
          <p className="text-brand-gold/50 font-body text-[9px] uppercase tracking-[0.35em] font-bold">CabHouse Agencies Ltd</p>
          <h1
            className="font-display font-black text-white mt-1 leading-tight"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', letterSpacing: '-0.025em' }}
          >
            One Family.{' '}
            <em className="not-italic" style={{ color: '#C9A84C' }}>Every Need Covered.</em>
          </h1>
        </div>

        {/* Cards — Park left, sides right */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1" style={{ minHeight: 0 }}>
          <div className="lg:flex-[1.65] flex flex-col">
            <ParkCard inView={inView} />
          </div>
          <div className="lg:w-[34%] flex flex-col gap-3">
            {SIDES.map((b, i) => (
              <SideCard key={b.id} brand={b} idx={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
