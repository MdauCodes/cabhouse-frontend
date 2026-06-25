import { useInView } from '../hooks/useInView'

const OFFERS = [
  {
    tag: 'Best Value',
    title: 'All-In Day Pass',
    price: 'KES 2,500',
    desc: 'Every activity, unlimited all day. No per-ride fees.',
    href: '/#packages',
  },
  {
    tag: 'Groups',
    title: 'School Excursion',
    price: 'From KES 800/head',
    desc: 'Guided packages with activity coordinators and meals.',
    href: '/events#school',
  },
  {
    tag: 'Stay & Play',
    title: 'Overnight Getaway',
    price: 'From KES 3,000',
    desc: 'Cabin stay plus full park access for the whole day.',
    href: '/relax',
  },
]

export default function OffersStrip() {
  const { ref, inView } = useInView(0.1)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-5 lg:px-10 py-10 lg:py-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(10px)', transition: 'all 0.45s ease' }}
        >
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-1" style={{ color: 'var(--color-gold)' }}>
              Featured Offers
            </p>
            <h2
              className="font-display font-black text-brand-dark leading-tight"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)', letterSpacing: '-0.02em' }}
            >
              Experiences worth booking
            </h2>
          </div>
          <a
            href="/#packages"
            className="text-brand-dark/50 hover:text-brand-dark font-body text-xs font-semibold uppercase tracking-widest transition-colors flex-shrink-0"
          >
            View all packages →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OFFERS.map((o, i) => (
            <a
              key={o.title}
              href={o.href}
              className="group relative bg-brand-cream rounded-2xl p-5 hover:shadow-md transition-all duration-200 overflow-hidden"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(12px)',
                transition: `opacity 0.45s ease ${i * 0.08}s, transform 0.45s ease ${i * 0.08}s, box-shadow 0.2s ease`,
              }}
            >
              <span
                className="inline-block text-[9px] font-body font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3"
                style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}
              >
                {o.tag}
              </span>
              <h3 className="font-display font-bold text-brand-dark text-lg leading-tight mb-1">{o.title}</h3>
              <p className="font-display font-black mb-3" style={{ color: 'var(--color-gold)', fontSize: '1.05rem' }}>
                {o.price}
              </p>
              <p className="text-brand-dark/55 font-body text-sm leading-relaxed">{o.desc}</p>
              <div className="absolute bottom-4 right-4 text-brand-dark/25 group-hover:text-brand-dark/60 font-body text-xs font-bold uppercase tracking-widest transition-colors">
                Book →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
