import { useState } from 'react'
import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import ReservationModal from '../components/ReservationModal'

const CORPORATE = [
  {
    id: 'team-building',
    title: 'Team Building',
    tag: 'Outdoor',
    desc: 'Rope challenges, go-kart races, group pool relay and guided park games. The perfect formula for cohesion, morale and shared achievement.',
    features: ['Rope course & bridge challenges', 'Go-kart team races', 'Group pool activities', 'Dedicated event coordinator', 'Catering packages available'],
  },
  {
    id: 'conferences',
    title: 'Conferences',
    tag: 'Indoor Hall',
    desc: 'Air-conditioned indoor hall for up to 150 delegates. Ideal for presentations, workshops and breakout sessions with full AV support.',
    features: ['Seats up to 150 delegates', 'Full AV & projection setup', 'High-speed WiFi', 'Breakout spaces', 'In-house catering'],
  },
  {
    id: 'gala-dinners',
    title: 'Gala Dinners',
    tag: 'Tented or Gardens',
    desc: 'Elegant dining under premium tents or in the gardens. Full lighting, décor coordination, live entertainment options and gourmet catering.',
    features: ['Gardens or premium tent venue', 'Full décor coordination', 'Gourmet catering menu', 'Bar & beverage service', 'Live entertainment options'],
  },
  {
    id: 'executive-retreats',
    title: 'Executive Retreats',
    tag: 'Exclusive Access',
    desc: 'Private park access for a day or weekend. Luxury cabin accommodation, curated activities, premium dining and a dedicated event team throughout.',
    features: ['Exclusive park access', 'Luxury cabin accommodation', 'Curated activity schedule', 'Premium dining service', 'Dedicated event staff'],
  },
]

const SOCIAL = [
  {
    id: 'weddings',
    title: 'Weddings',
    tag: 'Garden & Hall',
    desc: 'Lush garden ceremony and reception hall for up to 200 guests. Full décor and catering packages tailored to your vision.',
  },
  {
    id: 'birthday',
    title: 'Birthday Parties',
    tag: 'All Ages',
    desc: 'Private activity zones with custom catering packages. Designed for both kids and adults — unforgettable every time.',
  },
  {
    id: 'school',
    title: 'School Packages',
    tag: 'Group Rates',
    desc: 'Safe, monitored group visits with activity guides, meal plans and transport coordination. From KES 800 per student.',
  },
]

const VENUES = [
  {
    name: 'Gardens',
    capacity: 'Up to 200 PAX',
    price: 'KES 20,000',
    best: 'Weddings, galas, outdoor events',
  },
  {
    name: 'Indoor Hall',
    capacity: 'Up to 150 PAX',
    price: 'KES 10,000',
    best: 'Conferences, meetings, workshops',
  },
  {
    name: 'Premium Tent',
    capacity: 'Flexible',
    price: 'KES 4,000',
    best: 'Intimate gatherings, supplementary space',
  },
]

function Hero({ onBook }: { onBook: () => void }) {
  const img = useMediaUrl('feat-events')
  const { ref, inView } = useInView(0.05)
  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '60dvh', minHeight: 380 }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundColor: 'var(--color-dark)' }} />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,20,8,0.70) 0%, rgba(8,20,8,0.40) 55%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,20,8,0.75) 0%, transparent 60%)' }} />
      <div ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-10 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-brand-gold" />
          <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">CabHouse Events</p>
        </div>
        <h1 className="font-display font-black text-white leading-[0.93] mb-4"
          style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.02em' }}>
          Your Celebration.<br /><em className="not-italic" style={{ color: 'var(--color-gold)' }}>Our Venue.</em>
        </h1>
        <p className="text-white/85 font-body text-sm leading-relaxed max-w-sm mb-6">
          Lush gardens for 200, an air-conditioned indoor hall, premium tents, restaurant and bar — every detail handled so you can show up, breathe and actually enjoy the moment.
        </p>
        <button onClick={onBook}
          className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 self-start">
          Reserve a Venue
        </button>
      </div>
    </div>
    </section>
  )
}

export default function EventsPage() {
  const { ref: corpRef, inView: corpInView } = useInView(0.08)
  const { ref: socialRef, inView: socialInView } = useInView(0.08)
  const { ref: venueRef, inView: venueInView } = useInView(0.08)
  const wa = SITE.contact.whatsapp.replace('+', '')
  const [bookOpen, setBookOpen] = useState(false)

  return (
    <Layout>
      <Hero onBook={() => setBookOpen(true)} />

      {/* ── Corporate Events ── gold */}
      <section id="corporate" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-16 lg:py-20" style={{ backgroundColor: '#D4B882' }}>
          <div
            ref={corpRef as React.RefObject<HTMLDivElement>}
            style={{ opacity: corpInView ? 1 : 0, transform: corpInView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-3 text-brand-dark/50">
              Corporate Events
            </p>
            <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-10"
              style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
              Built for <em className="not-italic" style={{ color: '#7a5a2a' }}>Business</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CORPORATE.map((e, i) => (
              <div
                key={e.id}
                id={e.id}
                className="bg-white/30 border border-black/10 rounded-2xl p-6 lg:p-7"
                style={{
                  opacity: corpInView ? 1 : 0,
                  transform: corpInView ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <span className="inline-block text-[9px] font-body font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-4"
                  style={{ backgroundColor: '#1a2e1f', color: '#D4B882' }}>
                  {e.tag}
                </span>
                <h3 className="font-display font-bold text-brand-dark text-xl mb-2">{e.title}</h3>
                <p className="text-brand-dark/60 font-body text-sm leading-relaxed mb-5">{e.desc}</p>
                <ul className="space-y-1.5 mb-6">
                  {e.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-brand-dark/70 font-body text-sm">
                      <span className="mt-1 w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#1a2e1f' }}>
                        <svg viewBox="0 0 10 10" className="w-2 h-2 fill-white"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I'd like to enquire about ${e.title} at CabHouse`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl font-body font-bold text-xs uppercase tracking-wide transition-all duration-200 hover:brightness-110 text-white"
                  style={{ backgroundColor: '#1a2e1f' }}
                >
                  Enquire about {e.title} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Venue Pricing ── green */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#1a2e1f' }}>
          <div
            ref={venueRef as React.RefObject<HTMLDivElement>}
            style={{ opacity: venueInView ? 1 : 0, transform: venueInView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-3 text-white/50">
              Venue Hire
            </p>
            <h2 className="font-display font-black text-white leading-tight mb-10"
              style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
              Choose your <em className="not-italic" style={{ color: 'var(--color-gold)' }}>space</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VENUES.map((v, i) => (
              <div
                key={v.name}
                className="bg-white/10 border border-white/10 rounded-2xl p-6"
                style={{
                  opacity: venueInView ? 1 : 0,
                  transform: venueInView ? 'none' : 'translateY(14px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <h3 className="font-display font-bold text-white text-lg mb-1">{v.name}</h3>
                <p className="text-white/40 font-body text-xs mb-4">{v.capacity}</p>
                <p className="font-display font-black mb-1" style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>
                  {v.price}
                </p>
                <p className="text-white/30 font-body text-[10px] uppercase tracking-wide mb-5">per booking</p>
                <p className="text-white/55 font-body text-sm leading-relaxed">
                  <span className="text-white/30 text-[10px] uppercase tracking-wider font-semibold block mb-1">Best for</span>
                  {v.best}
                </p>
              </div>
            ))}
          </div>

          <p className="text-white/25 font-body text-xs mt-6">
            Venue hire excludes catering, décor and equipment. Packages available on request.
          </p>
        </div>
      </section>

      {/* ── Social Events ── gold */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-16 lg:py-20" style={{ backgroundColor: '#D4B882' }}>
        <div className="max-w-7xl mx-auto">
          <div
            ref={socialRef as React.RefObject<HTMLDivElement>}
            style={{ opacity: socialInView ? 1 : 0, transform: socialInView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-3 text-brand-dark/50">
              Social Events
            </p>
            <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-10"
              style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
              Every Kind of <em className="not-italic" style={{ color: '#7a5a2a' }}>Celebration</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SOCIAL.map((e, i) => (
              <div
                key={e.id}
                id={e.id}
                className="bg-white/30 border border-black/10 rounded-2xl p-6"
                style={{
                  opacity: socialInView ? 1 : 0,
                  transform: socialInView ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <span className="inline-block text-[9px] font-body font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-4"
                  style={{ backgroundColor: '#1a2e1f', color: '#D4B882' }}>
                  {e.tag}
                </span>
                <h3 className="font-display font-bold text-brand-dark text-xl mb-2">{e.title}</h3>
                <p className="text-brand-dark/60 font-body text-sm leading-relaxed mb-5">{e.desc}</p>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I'd like to enquire about ${e.title} at CabHouse`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-body font-bold text-xs uppercase tracking-wide transition-colors"
                  style={{ color: '#5a3e1a' }}
                >
                  Plan this event →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* ── CTA ── green */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14" style={{ backgroundColor: '#1a2e1f' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { v: '200+', l: 'Guest capacity' },
              { v: 'Full Kitchen', l: 'On-site catering' },
              { v: 'Garden & Hall', l: 'Indoor + outdoor' },
              { v: 'Licensed Bar', l: 'Fully stocked' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-xl p-5">
                <p className="font-display font-black text-white text-xl leading-none mb-1">{s.v}</p>
                <p className="font-body text-[10px] uppercase tracking-wide text-white/40">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setBookOpen(true)}
              className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-6 py-3 rounded-full transition-all hover:scale-105">
              Reserve a Venue
            </button>
            <a href={`tel:${SITE.contact.phone}`}
              className="text-white/50 hover:text-white font-body text-sm font-medium transition-colors">
              {SITE.contact.phone}
            </a>
          </div>
        </div>
      </section>
      {bookOpen && (
        <ReservationModal defaultType="VENUE" onClose={() => setBookOpen(false)} />
      )}
    </Layout>
  )
}
