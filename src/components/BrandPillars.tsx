import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'

const PARK = {
  name: 'CabHouse Park',
  tag: 'Open Now',
  tagColor: 'bg-brand-green text-white',
  desc: 'A full day of adventures, food and fun — for every age. Zip lines, pools, go-karts, dining and overnight stays. No planning needed, just show up.',
  cta: 'Plan Your Visit',
  href: '/park',
  imageId: 'hero-1',
}

const SIDES = [
  {
    id: 'water',
    name: 'CabHouse Water',
    tag: 'Order Now',
    tagColor: 'bg-sky-500/90 text-white',
    desc: 'Cold, clean water delivered to your home, office or event. Bulk or domestic — we bring it to your door.',
    cta: 'Order Water',
    href: '/water',
    imageSrc: '/assets/cabhouse-water.png',
  },
  {
    id: 'apt',
    name: 'CabHouse Apartments',
    tag: 'Book a Stay',
    tagColor: 'bg-brand-gold/90 text-white',
    desc: 'Furnished apartments in Kisii town — move in today, stay as long as you need. Short or long term.',
    cta: 'Book a Stay',
    href: '/apartments',
    imageSrc: '/assets/cabhouse-apartments.png',
  },
]

function ParkCard({ inView }: { inView: boolean }) {
  const url = useMediaUrl(PARK.imageId)

  return (
    <a
      href={PARK.href}
      className="group relative overflow-hidden rounded-2xl flex-1 lg:flex-none lg:w-[52%] flex flex-col"
      style={{
        minHeight: 340,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#0D1B12' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />

      {/* Badge */}
      <div className="relative z-10 p-5">
        <span className={`text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${PARK.tagColor}`}>
          {PARK.tag}
        </span>
      </div>

      {/* Content pinned to bottom */}
      <div className="relative z-10 mt-auto p-5 lg:p-6">
        <p className="text-white/50 font-body text-[10px] uppercase tracking-widest mb-1">Play</p>
        <h3
          className="font-display font-black text-white leading-tight mb-2"
          style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', letterSpacing: '-0.02em' }}
        >
          {PARK.name}
        </h3>
        <p className="text-white/70 font-body text-xs leading-relaxed mb-4 max-w-[28rem]">
          {PARK.desc}
        </p>
        <span className="inline-flex items-center gap-1.5 bg-brand-gold group-hover:bg-brand-orange text-white font-body font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full transition-colors duration-200">
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
      className="group relative overflow-hidden rounded-2xl flex-1 flex flex-col"
      style={{
        minHeight: 160,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${(idx + 1) * 0.1}s, transform 0.6s ease ${(idx + 1) * 0.1}s`,
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${brand.imageSrc})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/30 to-transparent" />

      {/* Badge */}
      <div className="relative z-10 p-4">
        <span className={`text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${brand.tagColor}`}>
          {brand.tag}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-auto p-4">
        <p className="text-white/45 font-body text-[9px] uppercase tracking-widest mb-0.5">
          {brand.id === 'water' ? 'Hydrate' : 'Stay'}
        </p>
        <h3 className="font-display font-black text-white text-sm leading-tight mb-1.5" style={{ letterSpacing: '-0.02em' }}>
          {brand.name}
        </h3>
        <p className="text-white/65 font-body text-[11px] leading-relaxed mb-3">
          {brand.desc}
        </p>
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
  const { ref, inView } = useInView(0.08)

  return (
    <section id="brands" className="bg-white px-6 lg:px-10 py-10 lg:py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 mb-6"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <h2
            className="font-display font-black text-brand-dark leading-[0.93]"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}
          >
            One Family.{' '}
            <em className="not-italic" style={{ color: '#C9A84C' }}>Every Need Covered.</em>
          </h2>
          <p className="text-brand-dark/40 font-body text-xs leading-relaxed hidden lg:block">
            Play, stay and refresh — all under one roof in Kisii.
          </p>
        </div>

        {/* Layout: Park hero left, Water + Apartments stacked right */}
        <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: 380 }}>
          <ParkCard inView={inView} />

          <div className="flex flex-col gap-4 lg:flex-1">
            {SIDES.map((b, i) => (
              <SideCard key={b.id} brand={b} idx={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
