import { useInView } from '../hooks/useInView'

const BRANDS = [
  {
    name: 'CabHouse Park',
    tagline: 'PLAY. STAY. CELEBRATE.',
    desc: 'Your ultimate playground for active fun, family bonding, and corporate milestones. Games, restaurant, pool, camping, weddings and more.',
    tags: ['Pool & Play', 'Restaurant', 'Camping', 'Events & Weddings'],
    cta: 'EXPLORE PARK →',
    href: '/park',
    img: '/assets/park-pool.jpeg',
    badge: 'FLAGSHIP',
  },
  {
    name: 'CabHouse Apartments',
    tagline: 'HOME AWAY FROM HOME.',
    desc: 'The sophisticated comfort of home blended with world-class hospitality. Premium short and long-stay furnished apartments with exclusive amenities.',
    tags: ['Short Stays', 'Long Stays', 'Furnished Units'],
    cta: 'EXPLORE APARTMENTS →',
    href: '/apartments',
    img: '/assets/cabhouse-apartments.png',
    badge: null,
  },
  {
    name: 'CabHouse Water',
    tagline: 'PREMIUM WATER DELIVERED.',
    desc: 'Pure, crisp hydration engineered to sustain your health and active lifestyle. Sourced and bottled right here in Kisii.',
    tags: ['Domestic Delivery', 'Bulk Orders', 'Pure & Local'],
    cta: 'EXPLORE WATER →',
    href: '/water',
    img: '/assets/cabhouse-water.png',
    badge: null,
  },
]

export default function BrandShowcase() {
  const { ref, inView } = useInView(0.08)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-4 lg:px-10 py-12 lg:py-20">

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-12"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <p className="font-body text-xs uppercase tracking-[0.28em] font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
            CabHouse Agencies Ltd
          </p>
          <h2
            className="font-display font-black text-brand-dark leading-tight"
            style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.028em' }}
          >
            One company. Three experiences.
          </h2>
          <p className="text-brand-dark/65 font-body text-base mt-4 max-w-xl mx-auto leading-relaxed">
            CabHouse Agencies is the home of Park, Water and Apartments — all in one destination in Kisii.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BRANDS.map((b, i) => (
            <a
              key={b.name}
              href={b.href}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-dark/[0.07] hover:shadow-xl transition-all duration-300"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s, box-shadow 0.3s ease`,
              }}
            >
              {/* Photo */}
              <div className="relative overflow-hidden" style={{ height: 200 }}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url(${b.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {b.badge && (
                  <span className="absolute top-3 left-3 text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}>
                    {b.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="text-white font-display font-bold text-sm drop-shadow">{b.name}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="font-body text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
                  {b.tagline}
                </p>
                <p className="text-brand-dark/70 font-body text-sm leading-relaxed mb-4">{b.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {b.tags.map(t => (
                    <span key={t} className="text-[10px] font-body text-brand-dark/50 border border-brand-dark/12 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <span
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wide transition-all duration-200 group-hover:brightness-110"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}
                >
                  {b.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
