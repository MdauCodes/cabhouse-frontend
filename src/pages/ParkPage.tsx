import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import MasonryGallery from '../components/MasonryGallery'

const ACTIVITIES = [
  { title: 'Zip Line',          desc: 'Soar across a 100m+ aerial line with a panoramic view of Kisii.', price: 'KES 500', icon: 'â†—' },
  { title: 'Sky Bike',          desc: 'Pedal through the air for an exhilarating cardio workout with panoramic views.', price: 'KES 500', icon: 'âŸ³' },
  { title: 'Rainbow Slide',     desc: 'Kenya\'s most colourful mega-slide "” unlimited rides all day.', price: 'KES 500', icon: 'â†“' },
  { title: 'Mountain & Bridge', desc: 'Build strength and confidence on rugged, professionally guided outdoor courses.', price: 'KES 500', icon: 'â–²' },
  { title: 'Swimming Pool',     desc: 'Multiple pools with giant inflatables. Perfect for families and groups.', price: 'KES 500', icon: '~' },
  { title: 'Go-Karts',         desc: 'Race the dedicated kart track. 15-minute or 30-minute sessions.', price: 'From KES 500', icon: 'â–¶' },
  { title: 'Bumper Cars',      desc: 'Active, laughter-filled play spaces built to keep the young ones moving.', price: 'From KES 300', icon: 'â—' },
  { title: 'Bouncing Castles', desc: 'Kids\' inflatables, swings and safe play areas.', price: 'In packages', icon: '◆' },
]

const PACKAGES = [
  {
    name: 'Bronze', price: 1000, highlight: false, tag: null,
    activities: ['Bouncing Castles', 'Rainbow Slides', 'Swings'],
  },
  {
    name: 'Silver', price: 1300, highlight: false, tag: null,
    activities: ['Bouncing Castles', 'Rainbow Slides', 'Swings', 'Swimming'],
  },
  {
    name: 'Platinum', price: 1400, highlight: true, tag: 'Popular',
    activities: ['Zipline', 'Sky Bike', 'Rainbow Slides', 'Bridge & Mountain'],
  },
  {
    name: 'Gold', price: 2500, highlight: false, tag: 'All-In',
    activities: ['Every Activity', 'Unlimited Access', 'Full Day Pass'],
  },
]

const STAYS = [
  { name: 'Wooden Cabin',       base: 3000 },
  { name: 'Tented Cabin (Big)', base: 2500 },
  { name: 'Tented Cabin (Sm)',  base: 2000 },
  { name: 'Camping Tent',       base: 1500 },
]

function HeroSection() {
  const img = useMediaUrl('hero-1')
  const { ref, inView } = useInView(0.05)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '70dvh', minHeight: 420 }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundColor: 'var(--color-dark)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, var(--color-dark) 0%, var(--color-dark) 28%, rgba(17,17,17,0.55) 55%, rgba(17,17,17,0.1) 80%, transparent 100%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease', paddingBottom: 48 }}
      >
        <h1
          className="font-display font-black text-white leading-[0.93] mb-5"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)', letterSpacing: '-0.025em' }}
        >
          Play Hard.<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Play All Day.</em>
        </h1>

        <p className="text-white/55 font-body text-sm leading-relaxed mb-8 max-w-[28rem]">
          Eight activity zones, three pool areas and a go-kart track "” all in one admission at Kisii's biggest recreation destination.
        </p>

        <div className="flex items-center gap-5 mb-10">
          {[
            { v: '8', l: 'Activity Zones' },
            { v: 'KES 1K', l: 'Entry from' },
            { v: 'Daily', l: '8 AM "“ 8 PM' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-5">
              <div>
                <p className="text-white font-display font-bold text-xl leading-none">{s.v}</p>
                <p className="text-white/40 font-body text-[10px] uppercase tracking-wide mt-0.5">{s.l}</p>
              </div>
              {i < 2 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/25 uppercase tracking-wide"
          >
            Book via WhatsApp
          </a>
          <a
            href="#packages"
            className="border border-white/30 hover:border-white text-white font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/10 uppercase tracking-wide"
          >
            See Packages
          </a>
        </div>
      </div>
    </div>
    </section>
  )
}

function ActivitiesSection() {
  const { ref, inView } = useInView()

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mb-10"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <h2
            className="font-display font-black text-brand-dark leading-[0.93]"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}
          >
            Eight Ways to <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Have Fun</em>
          </h2>
          <p className="text-brand-dark/45 font-body text-xs mt-1.5">All prices per person · some activities also included in packages</p>
        </div>

        {/* Activity list "” elegant rows instead of cards */}
        <div className="divide-y divide-brand-dark/[0.06]">
          {ACTIVITIES.map((a, i) => (
            <ActivityRow key={i} a={a} idx={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ActivityRow({ a, idx }: { a: typeof ACTIVITIES[0]; idx: number }) {
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center justify-between py-4 gap-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateX(-10px)',
        transition: `opacity 0.5s ease ${idx * 0.04}s, transform 0.5s ease ${idx * 0.04}s`,
      }}
    >
      <div className="flex items-center gap-5 min-w-0">
        <span className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-display font-bold text-xs flex-shrink-0">
          {idx + 1}
        </span>
        <div className="min-w-0">
          <p className="font-display font-bold text-brand-dark text-sm leading-tight">{a.title}</p>
          <p className="text-brand-dark/45 font-body text-xs mt-0.5 leading-relaxed">{a.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-brand-gold font-display font-bold text-sm whitespace-nowrap">{a.price}</span>
        <a
          href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'd like to book ${a.title} at CabHouse Park`)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-dark/15 text-brand-dark/50 hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/5 transition-all duration-200 hidden sm:inline-flex"
        >
          Book
        </a>
      </div>
    </div>
  )
}

function PackagesSection() {
  useMediaUrl('hero-2')
  const { ref, inView } = useInView()

  return (
    <section id="packages" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto bg-brand-dark rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16">

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-10"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <h2
            className="font-display font-black text-white leading-[0.93]"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}
          >
            Day <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Packages</em>
          </h2>
          <p className="text-white/25 font-body text-[10px]">All prices per person in KES · book via WhatsApp</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PACKAGES.map(pkg => (
            <a
              key={pkg.name}
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'd like to book the ${pkg.name} Package at CabHouse Park`)}`}
              target="_blank" rel="noopener noreferrer"
              className={`rounded-xl flex flex-col p-4 border transition-all duration-200 group ${
                pkg.highlight
                  ? 'bg-brand-gold border-transparent'
                  : 'bg-white/[0.04] border-white/8 hover:border-brand-gold/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-black text-white leading-none"
                  style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
                  {pkg.name}
                </h3>
                {pkg.tag && (
                  <span className={`text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                    pkg.highlight ? 'bg-white/25 text-white' : 'bg-brand-gold/20 text-brand-gold'
                  }`}>{pkg.tag}</span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className={`font-display font-black ${pkg.highlight ? 'text-white' : 'text-brand-gold'}`}
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>
                  {pkg.price.toLocaleString()}
                </span>
                <span className={`font-body text-[9px] uppercase tracking-wide ${pkg.highlight ? 'text-white/60' : 'text-white/30'}`}>
                  KES/pax
                </span>
              </div>

              <div className={`h-px mb-3 ${pkg.highlight ? 'bg-white/20' : 'bg-white/6'}`} />

              <ul className="space-y-1.5 flex-1 mb-4">
                {pkg.activities.map(act => (
                  <li key={act} className={`flex items-center gap-2 font-body text-[11px] ${pkg.highlight ? 'text-white/85' : 'text-white/50'}`}>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${pkg.highlight ? 'bg-white' : 'bg-brand-gold'}`} />
                    {act}
                  </li>
                ))}
              </ul>

              <span className={`text-center text-[9px] font-body font-bold tracking-widest uppercase py-2 rounded-full transition-all duration-200 ${
                pkg.highlight
                  ? 'bg-white text-brand-gold'
                  : 'bg-white/6 text-white/50 group-hover:bg-brand-gold group-hover:text-white border border-white/8'
              }`}>
                Book Now
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

const PARK_PHOTOS = [
  { src: '/assets/park-adventure.jpeg', label: 'Adventure Activities' },
  { src: '/assets/raw-1.jpg',           label: 'CabHouse Park' },
  { src: '/assets/park-pool.jpeg',      label: 'Swimming Pool' },
  { src: '/assets/raw-2.jpg',           label: 'Park Grounds' },
  { src: '/assets/park-bridge.jpeg',    label: 'Bridge Challenge' },
  { src: '/assets/raw-3.jpg',           label: 'CabHouse Experience' },
  { src: '/assets/park-games.jpeg',     label: 'Games & Rides' },
  { src: '/assets/raw-4.jpeg',          label: 'Park Views' },
  { src: '/assets/park-group.jpeg',     label: 'Group Fun' },
  { src: '/assets/raw-5.jpeg',          label: 'Activities' },
  { src: '/assets/park-extra-1.png',    label: 'Park Highlights' },
  { src: '/assets/raw-6.jpeg',          label: 'Park Life' },
  { src: '/assets/raw-7.jpeg',          label: 'Outdoors' },
  { src: '/assets/raw-8.jpeg',          label: 'Adventure' },
  { src: '/assets/raw-9.jpeg',          label: 'CabHouse' },
  { src: '/assets/raw-10.jpeg',         label: 'Park' },
]

const CAMPING_PHOTOS = [
  { src: '/assets/wooden-tent-31.jpeg', label: 'Wooden Cabin' },
  { src: '/assets/inside-tent-29.jpeg', label: 'Inside "” Tent with Bed' },
  { src: '/assets/camping-outside-1.jpeg', label: 'Campsite' },
  { src: '/assets/outside-tent-28.jpeg', label: 'Tent Exterior' },
  { src: '/assets/camping-outside-2.jpeg', label: 'Outdoor Camp' },
  { src: '/assets/just-tent-camp-34.jpeg', label: 'Tent Camp' },
  { src: '/assets/outdoor-tent-32.jpeg', label: 'Outdoor Tents' },
  { src: '/assets/outdoor-vegetation-33.jpeg', label: 'Nature Surroundings' },
  { src: '/assets/camping-outside-3.jpeg', label: 'Camp Grounds' },
  { src: '/assets/camping-4.jpeg', label: 'Camping Experience' },
  { src: '/assets/camping-5.jpeg', label: 'Camp Life' },
]

function StaySection() {
  const { ref, inView } = useInView(0.08)

  return (
    <>
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16">

        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-2"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}>
              Stay the <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Night</em>
            </h2>
            <p className="text-brand-dark/50 font-body text-xs leading-relaxed max-w-sm">
              Extend your day into a full overnight experience. Wooden cabins, tented cabins or camping under the stars.
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {STAYS.map((s, i) => (
                <span key={i} className="flex items-center gap-2 border border-brand-dark/[0.08] rounded-lg px-3 py-1.5">
                  <span className="font-body text-xs text-brand-dark/60">{s.name}</span>
                  <span className="text-brand-gold font-display font-bold text-xs">KES {s.base.toLocaleString()}<span className="text-brand-dark/30 font-body text-[9px] font-normal">/night</span></span>
                </span>
              ))}
            </div>
            <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book an overnight stay at CabHouse Park")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-green text-white font-body font-bold text-xs px-6 py-3 rounded-full transition-all duration-200 uppercase tracking-wide self-start lg:self-end">
              Book a Stay
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>

    <MasonryGallery
      photos={CAMPING_PHOTOS}
      title='Stay the Night <em class="not-italic" style="color:var(--color-gold)">Gallery</em>'
      subtitle="Tap any photo to view full size"
      columns="columns-2 sm:columns-3 lg:columns-4"
      gap={8}
    />
    </>
  )
}

export default function ParkPage() {
  return (
    <Layout>
      <HeroSection />
      <ActivitiesSection />
      <MasonryGallery
        photos={PARK_PHOTOS}
        title='The Park <em class="not-italic" style="color:var(--color-gold)">In Pictures</em>'
        subtitle="Tap any photo to view full size"
        columns="columns-2 sm:columns-3 lg:columns-4 xl:columns-5"
        gap={8}
      />
      <PackagesSection />
      <StaySection />
    </Layout>
  )
}
