import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

type Block = {
  eyebrow: string
  title: string
  accent: string
  body: string
  bullets: string[]
  cta: string
  waMsg: string
  href: string
  imageId: string
  reverse: boolean
  dark: boolean
  bg: string
}

const BLOCKS: Block[] = [
  {
    eyebrow: 'Adventures',
    title: 'Push Your',
    accent: 'Limits',
    body: 'Rope courses, sky bike, zip line and the 100m rainbow slide — all set against the open Kisii sky.',
    bullets: ['100m Rainbow Slide', 'Sky Bike — aerial cycling', 'Zip Line', 'Mountain & Bridge Challenge'],
    cta: 'Book Adventures',
    waMsg: 'Hi, I want to book adventure activities at CabHouse Park',
    href: '/park',
    imageId: 'hero-1',
    reverse: false,
    dark: true,
    bg: '#0D1B12',
  },
  {
    eyebrow: 'Games & Rides',
    title: 'Play All',
    accent: 'Day',
    body: 'Bumper cars, go-karts, giant pool inflatables and a kids park — non-stop action for every age.',
    bullets: ['Bumper Cars — 10 / 30 min / 1 hr', 'Go-Karts — 15 / 30 min', 'Swimming Pool & Inflatables', 'Bouncing Castles'],
    cta: 'See All Games',
    waMsg: 'Hi, I want to book games at CabHouse Park',
    href: '/park',
    imageId: 'hero-3',
    reverse: true,
    dark: false,
    bg: '#ffffff',
  },
  {
    eyebrow: 'Dine & Unwind',
    title: 'Recharge in',
    accent: 'Style',
    body: 'Lush landscaped gardens, a full-service restaurant and a lively bar with craft cocktails and local flavours.',
    bullets: ['Full-Service Restaurant', 'Bar & Craft Cocktails', 'Landscaped Green Gardens', 'Group Dining Available'],
    cta: 'Reserve a Table',
    waMsg: 'Hi, I want to reserve dining at CabHouse Park',
    href: '/park#dining',
    imageId: 'feat-resort',
    reverse: false,
    dark: true,
    bg: '#0D1B12',
  },
  {
    eyebrow: 'Events & Stays',
    title: 'Celebrate &',
    accent: 'Stay',
    body: 'Elegant halls, garden spaces and premium tents for events. Stay the night in cozy cabins or under the stars in a tented camp.',
    bullets: ['Gardens — up to 200 pax', 'Indoor Hall & Premium Tents', 'Cabins from KES 3,000', 'Camping from KES 1,500'],
    cta: 'Plan Your Event',
    waMsg: 'Hi, I want to inquire about events or stays at CabHouse',
    href: '/events',
    imageId: 'feat-events',
    reverse: true,
    dark: false,
    bg: '#F5F0E8',
  },
]

function ParkBlock({ b, index: _index }: { b: Block; index: number }) {
  const url = useMediaUrl(b.imageId)
  const { ref, inView } = useInView(0.08)

  const fadeDir = b.reverse ? 'to left' : 'to right'

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative flex flex-col lg:flex-row lg:h-[56dvh] lg:min-h-[340px] lg:max-h-[520px] ${b.reverse ? 'lg:flex-row-reverse' : ''}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        background: b.bg,
      }}
    >
      {/* Image — 280px on mobile, full height on desktop */}
      <div className="relative w-full lg:w-[55%] overflow-hidden flex-shrink-0 h-[280px] lg:h-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#0D1B12' }}
        />
        {/* Fade — bottom on mobile, side on desktop */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{ background: `linear-gradient(${fadeDir}, transparent 30%, ${b.bg} 90%)` }}
        />
        <div
          className="absolute inset-0 pointer-events-none lg:hidden"
          style={{ background: `linear-gradient(to bottom, transparent 40%, ${b.bg} 100%)` }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)' }} />
      </div>

      {/* Content */}
      <div
        className="w-full lg:w-[48%] flex flex-col justify-center px-6 lg:px-12 xl:px-16 py-7 lg:py-0"
        style={{ background: b.bg }}
      >
        <h3
          className={`font-display font-black leading-[0.92] mb-3 ${b.dark ? 'text-white' : 'text-brand-dark'}`}
          style={{ fontSize: 'clamp(1.3rem, 2vw, 1.9rem)', letterSpacing: '-0.025em' }}
        >
          {b.title}{' '}
          <em className="not-italic" style={{ color: '#C9A84C' }}>{b.accent}</em>
        </h3>

        <p className={`font-body text-xs leading-relaxed mb-4 max-w-xs ${b.dark ? 'text-white/50' : 'text-brand-dark/50'}`}>
          {b.body}
        </p>

        <ul className="space-y-1.5 mb-5">
          {b.bullets.map((bullet, i) => (
            <li key={i} className={`flex items-center gap-2.5 font-body text-xs ${b.dark ? 'text-white/55' : 'text-brand-dark/65'}`}>
              <span className="w-1 h-1 rounded-full bg-brand-gold flex-shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(b.waMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-[10px] px-5 py-2.5 rounded-full transition-all duration-200 uppercase tracking-wider"
          >
            {b.cta}
          </a>
          <a
            href={b.href}
            className={`font-body text-[10px] font-semibold flex items-center gap-1 transition-colors group ${b.dark ? 'text-white/30 hover:text-white' : 'text-brand-dark/40 hover:text-brand-dark'}`}
          >
            Learn more
            <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ParkDeepDive() {
  const { ref, inView } = useInView()

  return (
    <section id="park">

      {/* Section header */}
      <div
        className="bg-white px-6 lg:px-10 py-8 lg:py-12 border-b border-brand-dark/8"
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <h2
            className="font-display font-black text-brand-dark leading-[0.93]"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}
          >
            CabHouse Park —{' '}
            <em className="not-italic" style={{ color: '#C9A84C' }}>Your Playground</em>
          </h2>
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-xs px-6 py-2.5 rounded-full transition-all uppercase tracking-wide hidden lg:inline-flex"
          >
            Book Your Visit
          </a>
        </div>
      </div>

      {/* Alternating panels — full width */}
      <div className="flex flex-col">
        {BLOCKS.map((b, i) => (
          <ParkBlock key={i} b={b} index={i} />
        ))}
      </div>

    </section>
  )
}
