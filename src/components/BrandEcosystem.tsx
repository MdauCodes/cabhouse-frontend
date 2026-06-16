import { useInView } from '../hooks/useInView'

const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    label: 'Play',
    brand: 'CabHouse Park',
    desc: 'Eight activity zones, pools, dining and events — your full day out sorted.',
    status: 'open',
    href: '/park',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 22V12M21 22V12M1 12h22M12 2L2 7h20L12 2z"/><rect x="9" y="17" width="6" height="5"/>
      </svg>
    ),
    label: 'Stay',
    brand: 'CabHouse Resorts',
    desc: 'Cabins, tented camps and cozy rooms. No need to rush home — the night is yours.',
    status: 'open',
    href: '/apartments',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    label: 'Hydrate',
    brand: 'CabHouse Water',
    desc: 'Premium drinking water, clean and crisp. Sourced responsibly, right here in Kisii.',
    status: 'open',
    href: '/water',
  },
]

export default function BrandEcosystem() {
  const { ref, inView } = useInView(0.1)

  return (
    <section className="bg-white border-y border-brand-dark/[0.06]">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.55s ease' }}
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-brand-dark/[0.07]" />
          <p className="text-brand-dark/35 font-body text-[10px] uppercase tracking-[0.25em] font-semibold whitespace-nowrap">
            Your visit, fully covered
          </p>
          <div className="h-px flex-1 bg-brand-dark/[0.07]" />
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
          {PILLARS.map((p, i) => (
            <a
              key={p.brand}
              href={p.status === 'open' ? p.href : undefined}
              className={`flex flex-col gap-3 group ${p.status === 'open' ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(12px)',
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              {/* Icon + label row */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/18 transition-colors">
                  {p.icon}
                </div>
                <div>
                  <p className="font-display font-black text-brand-dark text-sm leading-none">{p.label}</p>
                  <p className="text-brand-dark/30 font-body text-[10px] mt-0.5">{p.brand}</p>
                </div>
                {p.status === 'soon' && (
                  <span className="ml-auto text-[8px] font-body font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-brand-dark/45 font-body text-xs leading-relaxed">
                {p.desc}
              </p>

              {/* Link cue */}
              {p.status === 'open' && (
                <p className="text-brand-green font-body text-[10px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Explore
                  <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
