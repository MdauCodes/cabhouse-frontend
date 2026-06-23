import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const EVENT_TYPES = [
  { title: 'Weddings', desc: 'Lush garden ceremony, reception hall and full catering. Up to 200 guests.', tag: 'Garden & Hall' },
  { title: 'Corporate Retreats', desc: 'Team-building on the rope course + strategy sessions in our boardroom.', tag: 'Indoor & Outdoor' },
  { title: 'Birthday Parties', desc: 'Private park access with catering packages from our kitchen.', tag: 'All Ages' },
  { title: 'Galas & Dinners', desc: 'Formal dinners under premium tents or in the garden with full lighting.', tag: 'Premium Tents' },
  { title: 'School Trips', desc: 'Safe, monitored group packages with activity guides and catering.', tag: 'Group Packages' },
  { title: 'Photo & Film Shoots', desc: 'Our grounds "” rope bridges, gardens and pools "” as your backdrop.', tag: 'By Appointment' },
]

function Hero() {
  const img = useMediaUrl('feat-events')
  const { ref, inView } = useInView(0.05)
  return (
    <section className="relative overflow-hidden" style={{ height: '60dvh', minHeight: 380 }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundColor: '#1a2e1f' }} />
      <div className="absolute inset-0 bg-brand-dark/65" />
      <div ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-10 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-brand-gold" />
          <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">CabHouse Events</p>
        </div>
        <h1 className="font-display font-black text-white leading-[0.93] mb-4"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', letterSpacing: '-0.02em' }}>
          Your Celebration.<br /><em className="not-italic" style={{ color: 'var(--color-gold)' }}>Our Venue.</em>
        </h1>
        <p className="text-white/60 font-body text-sm leading-relaxed max-w-sm mb-6">
          Gardens for 200, indoor halls, premium tents, restaurant and bar. Every detail handled "” so you can be fully present.
        </p>
        <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20hosting%20an%20event%20at%20CabHouse`}
          target="_blank" rel="noopener noreferrer"
          className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 self-start">
          Enquire Now
        </a>
      </div>
    </section>
  )
}

export default function EventsPage() {
  const { ref, inView } = useInView()

  return (
    <Layout>
      <Hero />

      {/* Event types */}
      <section className="bg-white px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div ref={ref as React.RefObject<HTMLDivElement>}
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-brand-gold" />
              <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">What We Host</p>
            </div>
            <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.02em' }}>
              Every Kind of <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Celebration</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENT_TYPES.map((e, i) => (
              <div key={i} className="bg-brand-cream rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full">
                  {e.tag}
                </span>
                <h3 className="font-display font-bold text-brand-dark text-xl mt-4 mb-2">{e.title}</h3>
                <p className="text-gray-500 font-body text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue features */}
      <section className="bg-brand-dark px-6 lg:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-brand-gold" />
            <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">Venue Features</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { v: '200+', l: 'Guest capacity' },
              { v: 'Full Kitchen', l: 'On-site catering' },
              { v: 'Garden & Hall', l: 'Indoor + outdoor' },
              { v: 'Bar', l: 'Licensed & stocked' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-5">
                <p className="font-display font-black text-white text-2xl leading-none mb-1">{s.v}</p>
                <p className="font-body text-[10px] uppercase tracking-wide text-white/40">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-5">
            <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=Hi%2C%20I%27d%20like%20to%20plan%20an%20event%20at%20CabHouse`}
              target="_blank" rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-6 py-3 rounded-full transition-all hover:scale-105">
              Plan Your Event
            </a>
            <a href={`tel:${SITE.contact.phone}`}
              className="text-white/50 hover:text-white font-body text-sm font-medium transition-colors">
              {SITE.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
