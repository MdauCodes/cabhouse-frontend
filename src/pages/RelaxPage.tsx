import { useState } from 'react'
import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import MasonryGallery from '../components/MasonryGallery'
import BookingModal from '../components/BookingModal'

const RELAX_PHOTOS = [
  { src: '/assets/raw-33.jpeg', label: 'Overnight Stay' },
  { src: '/assets/raw-34.jpeg', label: 'Cabin Life' },
  { src: '/assets/raw-35.jpeg', label: 'CabHouse Grounds' },
  { src: '/assets/raw-36.jpeg', label: 'Nature' },
  { src: '/assets/raw-37.jpeg', label: 'Camp Morning' },
  { src: '/assets/raw-38.jpeg', label: 'Tent View' },
  { src: '/assets/raw-39.jpeg', label: 'Campfire Ready' },
  { src: '/assets/raw-40.jpeg', label: 'Waking Up Here' },
  { src: '/assets/raw-41.jpeg', label: 'Peaceful' },
  { src: '/assets/raw-42.jpeg', label: 'Outdoors' },
  { src: '/assets/raw-43.jpeg', label: 'Nature Stay' },
  { src: '/assets/raw-44.jpeg', label: 'Camping' },
  { src: '/assets/raw-45.jpeg', label: 'Rest' },
  { src: '/assets/raw-46.jpeg', label: 'Glamping' },
  { src: '/assets/raw-47.jpeg', label: 'Starry Nights' },
  { src: '/assets/raw-48.jpeg', label: 'CabHouse Stay' },
]

const STAYS = [
  { name: 'Wooden Cabin', desc: 'En-suite cabin with private veranda and garden views. Sleeps 2.', base: 3000, b1: 3500, b2: 4000 },
  { name: 'Tented Cabin (Big)', desc: 'Spacious glamping tent with real beds and power. Sleeps 2-3.', base: 2500, b1: 3000, b2: 3500 },
  { name: 'Tented Cabin (Small)', desc: 'Cosy tented accommodation for solo or couple travellers.', base: 2000, b1: 2500, b2: 3000 },
  { name: 'Camping Tent (Small)', desc: 'Standard camping tent under the open sky. BYO sleeping bag.', base: 1500, b1: 2000, b2: null },
  { name: 'Camping Tent (Big)', desc: 'Group camping tent — perfect for youth outings and large families.', base: 5000, b1: 7500, b2: null },
]

function Hero() {
  const img = useMediaUrl('feat-resort')
  const { ref, inView } = useInView(0.05)
  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '60dvh', minHeight: 380 }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundColor: '#1a2e1f' }} />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,20,8,0.75) 0%, rgba(8,20,8,0.45) 55%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,20,8,0.80) 0%, transparent 60%)' }} />
      <div ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-10 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-brand-gold" />
          <p className="text-brand-gold font-body text-sm tracking-[0.18em] uppercase font-black">CabHouse Park · Stay &amp; Camp</p>
        </div>
        <h1 className="font-display font-black text-white leading-[0.93] mb-4"
          style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.02em' }}>
          Stay the Night.<br /><em className="not-italic" style={{ color: 'var(--color-gold)' }}>Wake Up to This.</em>
        </h1>
        <p className="text-white/85 font-body text-sm leading-relaxed max-w-sm mb-6">
          Fall asleep to crickets and wake up to open skies. Wooden cabins, glamping tents and camping — set right inside CabHouse Park, with breakfast and every activity just outside your door.
        </p>
        <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20stay%20at%20CabHouse`}
          target="_blank" rel="noopener noreferrer"
          className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 self-start">
          Book Your Stay
        </a>
      </div>
    </div>
    </section>
  )
}

export default function RelaxPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const { ref, inView } = useInView()

  return (
    <Layout>
      <Hero />

      {/* Stay options — gold */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
        <div className="rounded-3xl overflow-hidden px-6 lg:px-10 py-16 lg:py-20" style={{ backgroundColor: '#D4B882' }}>
          <div className="max-w-7xl mx-auto">
            <div ref={ref as React.RefObject<HTMLDivElement>}
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-black/30" />
                <p className="text-brand-dark/60 font-body text-[10px] tracking-[0.3em] uppercase font-semibold">Accommodation</p>
              </div>
              <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-10"
                style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
                Five Ways to <em className="not-italic" style={{ color: '#7a5a2a' }}>Sleep Here</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {STAYS.map((s, i) => (
                <div key={i} className="bg-white/30 border border-black/10 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-brand-dark text-xl mb-2">{s.name}</h3>
                  <p className="text-brand-dark/55 font-body text-sm leading-relaxed mb-5">{s.desc}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-sm font-body border-b border-black/10 pb-2">
                      <span className="text-brand-dark/50">Room only</span>
                      <span className="font-display font-bold text-brand-dark">KES {s.base.toLocaleString()}</span>
                    </div>
                    {s.b1 && (
                      <div className="flex justify-between text-sm font-body border-b border-black/10 pb-2">
                        <span className="text-brand-dark/50">+Breakfast / 1 pax</span>
                        <span className="text-brand-dark font-semibold">KES {s.b1.toLocaleString()}</span>
                      </div>
                    )}
                    {s.b2 && (
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-brand-dark/50">+Breakfast / 2 pax</span>
                        <span className="text-brand-dark font-semibold">KES {s.b2.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="block w-full text-center text-white font-body font-semibold text-xs tracking-widest uppercase py-2.5 rounded-full transition-colors hover:brightness-110"
                    style={{ backgroundColor: '#1a2e1f' }}>
                    Book This
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MasonryGallery
        photos={RELAX_PHOTOS}
        title='Sleeping Under <em class="not-italic" style="color:var(--color-gold)">the Stars</em>'
        subtitle="Tap any photo to view full size"
      />

      {/* Info strip — green */}
      <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
        <div className="rounded-3xl overflow-hidden px-6 lg:px-10 py-12" style={{ backgroundColor: '#1a2e1f' }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 justify-between">
            {[
              { label: 'Check-in', value: '2:00 PM', sub: 'Check-out 11:00 AM' },
              { label: 'Breakfast', value: 'Available', sub: 'Served 7:00–10:00 AM' },
              { label: 'Park Access', value: 'Included', sub: 'Guests have full park access' },
              { label: 'Contact', value: SITE.contact.phone, sub: 'WhatsApp or call' },
            ].map((item, i) => (
              <div key={i} className="flex-1">
                <p className="text-brand-gold font-body text-[9px] uppercase tracking-[0.3em] font-semibold mb-1">{item.label}</p>
                <p className="text-white font-display font-bold text-xl mb-0.5">{item.value}</p>
                <p className="text-white/40 font-body text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {enquiryOpen && <BookingModal defaultService="PARK" onClose={() => setEnquiryOpen(false)} />}
    </Layout>
  )
}
