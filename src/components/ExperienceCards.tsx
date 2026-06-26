import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const EXPERIENCES = [
  { id: 'exp-relax',     pillar: 'Relax',     unit: 'CabHouse Resorts',    desc: 'Cabins, tents and serene gardens. Switch off completely.', href: '/relax' },
  { id: 'exp-play',      pillar: 'Play',      unit: 'CabHouse Park',       desc: 'Pools, inflatables, go-karts and bumper cars. Joy for every age.', href: '/park' },
  { id: 'exp-explore',   pillar: 'Explore',   unit: 'CabHouse Adventures', desc: 'Zip lines, sky bikes and rope courses. Push your limits.', href: '/park' },
  { id: 'exp-celebrate', pillar: 'Celebrate', unit: 'CabHouse Events',     desc: 'Weddings, galas and team-building hosted to perfection.', href: '/events' },
  { id: 'exp-move',      pillar: 'Move',      unit: 'CabHouse Car Hire',   desc: 'Rentals and transfers "” freedom on every road.', href: '/contact' },
]

function Card({ exp, idx, tall }: { exp: typeof EXPERIENCES[0]; idx: number; tall?: boolean }) {
  const url = useMediaUrl(exp.id)
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative overflow-hidden rounded-xl cursor-pointer border border-gray-100 hover:border-brand-gold/50 transition-all duration-300"
      style={{
        height: tall ? '100%' : '100%',
        minHeight: tall ? 260 : 140,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${idx * 0.08}s, transform 0.6s ease ${idx * 0.08}s, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(201,168,76,0.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 0 transparent' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#1a2e1f' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/15 to-transparent" />
      <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-400" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
        <p className="text-brand-gold font-body text-[9px] tracking-[0.25em] uppercase font-semibold mb-1.5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {exp.unit}
        </p>
        <h3 className="font-display font-black text-white leading-none mb-2"
          style={{ fontSize: 'var(--type-h3)' }}>
          {exp.pillar}
        </h3>
        <p className="text-white/65 font-body text-xs leading-relaxed max-w-[14rem] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-400 mb-3">
          {exp.desc}
        </p>
        <a href={exp.href}
          className="inline-flex items-center gap-1 text-brand-gold font-body font-bold text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          Discover
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="2.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </a>
      </div>
    </div>
  )
}

export default function ExperienceCards() {
  const { ref, inView } = useInView()

  return (
    <section id="experiences" className="bg-white py-14 lg:py-16 px-6 lg:px-10"
      style={{ maxHeight: '80dvh', minHeight: 400 }}>
      <div className="max-w-7xl mx-auto h-full flex flex-col" style={{ maxHeight: 'calc(80dvh - 7rem)' }}>

        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-brand-gold" />
              <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">One Destination, Five Worlds</p>
            </div>
            <h2 className="font-display font-black text-brand-dark leading-[0.9]"
              style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.03em' }}>
              How Do You Want To <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Feel</em> Today?
            </h2>
          </div>
          <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all hover:scale-105 flex-shrink-0 uppercase tracking-wide shadow-md shadow-brand-gold/20">
            Book Your Visit
          </a>
        </div>

        {/* Bento grid "” 3 cols, 2 rows: Relax tall on left, 2x2 on right */}
        <div className="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-3 flex-1 min-h-0">
          {/* Relax "” spans both rows */}
          <div className="col-span-1 row-span-2">
            <Card exp={EXPERIENCES[0]} idx={0} tall />
          </div>
          {/* Play */}
          <div className="col-span-1 row-span-1">
            <Card exp={EXPERIENCES[1]} idx={1} />
          </div>
          {/* Explore */}
          <div className="col-span-1 row-span-1">
            <Card exp={EXPERIENCES[2]} idx={2} />
          </div>
          {/* Celebrate */}
          <div className="col-span-1 row-span-1">
            <Card exp={EXPERIENCES[3]} idx={3} />
          </div>
          {/* Move */}
          <div className="col-span-1 row-span-1">
            <Card exp={EXPERIENCES[4]} idx={4} />
          </div>
        </div>
      </div>
    </section>
  )
}
