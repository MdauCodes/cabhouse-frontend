import { useInView } from '../hooks/useInView'
import { useContentBlocks } from '../hooks/useContentBlocks'

const BRAND_STATIC = [
  { key: 'park',       name: 'CabHouse Park',       href: '/park',       img: '/assets/park-pool.jpeg',      badge: 'FLAGSHIP' },
  { key: 'apartments', name: 'CabHouse Apartments',  href: '/apartments', img: '/assets/apartment-top2.png', badge: null },
  { key: 'water',      name: 'CabHouse Water',       href: '/water',      img: '/assets/cabhouse-water.png', badge: null },
]

const BRAND_DEFAULTS = {
  park:       { tagline: 'PLAY. STAY. CELEBRATE.',     desc: 'Your ultimate playground for active fun, family bonding, and corporate milestones. Games, restaurant, pool, camping, weddings and more.',   tags: ['Thrill & Play', 'Restaurant', 'Camping', 'Events & Weddings'], cta: 'EXPLORE PARK →' },
  apartments: { tagline: 'HOME AWAY FROM HOME.',        desc: 'The sophisticated comfort of home blended with world-class hospitality. Premium short and long-stay furnished apartments with exclusive amenities.', tags: ['Short Stays', 'Long Stays', 'Furnished Units'], cta: 'EXPLORE APARTMENTS →' },
  water:      { tagline: 'PREMIUM WATER DELIVERED.',    desc: 'Pure, crisp hydration engineered to sustain your health and active lifestyle. Sourced and bottled right here in Kisii.',                       tags: ['Domestic Delivery', 'Bulk Orders', 'Pure & Local'], cta: 'EXPLORE WATER →' },
}

export default function BrandShowcase() {
  const { ref, inView } = useInView(0.08)
  const { get } = useContentBlocks()

  const heading    = get('home.brand.heading',    'One company. Three experiences.')
  const subheading = get('home.brand.subheading', 'CabHouse Agencies is the home of Park, Water and Apartments — all in one destination in Kisii.')

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-4 lg:px-10 py-12 lg:py-20" style={{ backgroundColor: '#1a2e1f' }}>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-12"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <p className="font-body text-xs uppercase tracking-[0.28em] font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
            CabHouse Agencies Ltd
          </p>
          <h2
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.028em' }}
          >
            {heading}
          </h2>
          <p className="text-white/60 font-body text-base mt-4 max-w-xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BRAND_STATIC.map((b, i) => {
            const d = BRAND_DEFAULTS[b.key as keyof typeof BRAND_DEFAULTS]
            const tagline = get(`home.brand.${b.key}.tagline`, d.tagline)
            const desc    = get(`home.brand.${b.key}.desc`,    d.desc)

            return (
              <a
                key={b.name}
                href={b.href}
                className="group bg-white/10 hover:bg-white/15 rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-300"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s, box-shadow 0.3s ease`,
                }}
              >
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

                <div className="p-5">
                  <p className="font-body text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
                    {tagline}
                  </p>
                  <p className="text-white/65 font-body text-sm leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {d.tags.map(t => (
                      <span key={t} className="text-[10px] font-body text-white/60 border border-white/15 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <span
                    className="inline-flex items-center justify-center w-full py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wide transition-all duration-200 group-hover:brightness-110"
                    style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}
                  >
                    {d.cta}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
