import { useInView } from '../hooks/useInView'

const EXPERIENCES = [
  {
    img: '/assets/park-pool.jpeg',
    badge: 'OPEN DAILY',
    badgeDark: true,
    title: 'Pool & Play',
    href: '/park',
  },
  {
    img: '/assets/camping-outside-1.jpeg',
    badge: null,
    badgeDark: false,
    title: 'Camping',
    href: '/relax',
  },
  {
    img: '/assets/park-group.jpeg',
    badge: 'GROUPS WELCOME',
    badgeDark: false,
    title: 'Events',
    href: '/events',
  },
  {
    img: '/assets/park-adventure.jpeg',
    badge: 'MOST POPULAR',
    badgeDark: false,
    title: 'Adventure',
    href: '/park#games',
  },
  {
    img: '/assets/park-extra-1.png',
    badge: null,
    badgeDark: false,
    title: 'Stay Over',
    href: '/relax',
  },
]

export default function ExperiencesStrip() {
  const { ref, inView } = useInView(0.08)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="bg-brand-dark rounded-3xl overflow-hidden px-4 lg:px-10 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex items-end justify-between mb-8"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
              CabHouse Park · Flagship
            </p>
            <h2
              className="font-display font-black text-white leading-tight"
              style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.03em' }}
            >
              Five experiences, one destination.
            </h2>
          </div>
          <a
            href="/park"
            className="hidden lg:flex items-center gap-1.5 font-body text-sm font-semibold transition-colors"
            style={{ color: 'var(--color-gold)' }}
          >
            View all Park experiences →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXPERIENCES.map((exp, i) => (
            <a
              key={exp.title}
              href={exp.href}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                height: 'clamp(180px, 22vw, 280px)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.08]"
                style={{ backgroundImage: `url(${exp.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {exp.badge && (
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={exp.badgeDark
                      ? { backgroundColor: 'var(--color-gold)', color: '#111' }
                      : { backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(4px)' }
                    }
                  >
                    {exp.badge}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: 'var(--color-gold)' }}
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="#111" strokeWidth="2.5">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </div>
                  <span className="text-white font-body font-semibold text-sm">{exp.title}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <a href="/park" className="mt-5 flex lg:hidden items-center gap-1.5 font-body text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>
          View all Park experiences →
        </a>
      </div>
      </div>
    </section>
  )
}
