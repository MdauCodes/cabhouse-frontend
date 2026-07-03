import Layout from '../components/Layout'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import MasonryGallery from '../components/MasonryGallery'

const ACTIVITIES = [
  { title: 'Zip Line',          desc: 'Soar across a 100m+ aerial line with a panoramic view of Kisii.', price: 'KES 500' },
  { title: 'Sky Bike',          desc: 'Pedal through the air for an exhilarating cardio workout with panoramic views.', price: 'KES 500' },
  { title: 'Rainbow Slide',     desc: "Feel the rush of pure joy on our 100m vibrant gravity slide — unlimited rides all day.", price: 'KES 500' },
  { title: 'Mountain & Bridge', desc: 'Build strength and confidence on rugged, professionally guided outdoor courses.', price: 'KES 500' },
  { title: 'Swimming Pool',     desc: 'Multiple pools with giant inflatables. Perfect for families and groups.', price: 'KES 500' },
  { title: 'Go-Karts',         desc: 'Race the dedicated kart track. 15-minute or 30-minute sessions.', price: 'From KES 500' },
  { title: 'Bumper Cars',      desc: 'Active, laughter-filled play spaces built to keep the young ones moving.', price: 'From KES 300' },
  { title: 'Bouncing Castles', desc: "Kids' inflatables, swings and safe play areas.", price: 'In packages' },
]

const PACKAGES = [
  {
    name: 'Bronze', price: 1000, tag: null, level: 1,
    activities: ['Bouncing Castles', 'Rainbow Slides', 'Swings'],
    bg: 'rgba(68,30,4,0.55)',
    border: '1px solid rgba(160,80,20,0.30)',
    accent: '#B87040',
    dot: '#B87040',
    priceSize: 'clamp(1rem, 1.8vw, 1.5rem)',
    solid: false,
    cta: 'Reserve My Spot',
    waMsg: "Hi CabHouse I'd like to book the Bronze Package at KES 1,000 per person.\n\nThis includes: Bouncing Castles, Rainbow Slides & Swings.\n\nPlease let me know your available dates and how many people I can bring. Thank you!",
  },
  {
    name: 'Silver', price: 1300, tag: null, level: 2,
    activities: ['Bouncing Castles', 'Rainbow Slides', 'Swings', 'Swimming'],
    bg: 'linear-gradient(160deg, rgba(60,75,100,0.70) 0%, rgba(40,55,75,0.60) 100%)',
    border: '1px solid rgba(148,163,184,0.35)',
    accent: '#A8BACE',
    dot: '#A8BACE',
    priceSize: 'clamp(1.1rem, 1.9vw, 1.6rem)',
    solid: false,
    cta: 'Book Silver Package',
    waMsg: "Hi CabHouse I'd like to book the Silver Package at KES 1,300 per person.\n\nThis includes: Bouncing Castles, Rainbow Slides, Swings & Swimming.\n\nKindly confirm availability and any group rates if applicable. Looking forward to visiting!",
  },
  {
    name: 'Platinum', price: 1400, tag: 'Popular', level: 3,
    activities: ['Zipline', 'Sky Bike', 'Rainbow Slides', 'Bridge & Mountain'],
    bg: 'var(--color-gold)',
    border: '2px solid rgba(255,255,255,0.20)',
    accent: '#fff',
    dot: '#fff',
    priceSize: 'clamp(1.2rem, 2.1vw, 1.75rem)',
    solid: true,
    cta: 'Secure Platinum Now',
    waMsg: "Hi CabHouse I'd like to book the Platinum Package at KES 1,400 per person - your most popular pick!\n\nThis includes: Zipline, Sky Bike, Rainbow Slides & Bridge & Mountain.\n\nPlease share available dates and whether group bookings receive any discount. Excited to experience this!",
  },
  {
    name: 'Gold', price: 2500, tag: 'All-In', level: 4,
    activities: ['Every Activity', 'Unlimited Access', 'Full Day Pass'],
    bg: 'linear-gradient(160deg, rgba(120,70,10,0.85) 0%, rgba(80,40,5,0.90) 100%)',
    border: '2px solid rgba(250,190,60,0.55)',
    accent: '#FBBF24',
    dot: '#FBBF24',
    priceSize: 'clamp(1.3rem, 2.3vw, 2rem)',
    solid: false,
    cta: 'Claim Gold Experience',
    waMsg: "Hi CabHouse I'm interested in the Gold All-In Package at KES 2,500 per person - the full experience!\n\nThis covers: Every Activity, Unlimited Access & a Full Day Pass.\n\nI'd like to plan an unforgettable day out. Please confirm available dates, group size options, and anything I should know before arrival. Can't wait!",
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
        className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease', paddingBottom: 48 }}
      >
        <h1
          className="font-display font-black text-white leading-[0.93] mb-5"
          style={{ fontSize: 'var(--type-h1)', letterSpacing: '-0.025em' }}
        >
          Play Hard.<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Play All Day.</em>
        </h1>

        <p className="text-white/55 font-body text-sm leading-relaxed mb-8 max-w-[28rem]">
          Escape the ordinary at Kisii's premier recreation destination — zip lines, sky bikes, go-karts, three pools and eight activity zones built for every age, every group, every occasion.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          {[
            { v: '8', l: 'Activity Zones' },
            { v: 'KES 1K', l: 'Entry from' },
            { v: 'Daily', l: '8 AM — 8 PM' },
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/25 uppercase tracking-wide text-center"
          >
            Book via WhatsApp
          </a>
          <a
            href="#packages"
            className="border border-white/30 hover:border-white text-white font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/10 uppercase tracking-wide text-center"
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
    <section id="games" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#D4B882' }}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mb-10"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <h2
            className="font-display font-black text-brand-dark leading-[0.93]"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
          >
            Eight Ways to <em className="not-italic" style={{ color: '#7a5a2a' }}>Have Fun</em>
          </h2>
          <p className="text-brand-dark/50 font-body text-xs mt-1.5">All prices per person · some activities also included in packages</p>
        </div>

        <div className="divide-y divide-brand-dark/[0.08]">
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
        <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-brand-dark font-display font-bold text-xs flex-shrink-0">
          {idx + 1}
        </span>
        <div className="min-w-0">
          <p className="font-display font-bold text-brand-dark text-sm leading-tight">{a.title}</p>
          <p className="text-brand-dark/50 font-body text-xs mt-0.5 leading-relaxed">{a.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-brand-dark font-display font-bold text-sm whitespace-nowrap">{a.price}</span>
        <a
          href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'd like to book ${a.title} at CabHouse Park`)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-[11px] font-body font-bold uppercase tracking-widest px-3.5 py-2 rounded-full border border-black/20 text-brand-dark/60 hover:border-brand-dark hover:text-brand-dark hover:bg-black/10 transition-all duration-200 hidden sm:inline-flex"
        >
          Book
        </a>
      </div>
    </div>
  )
}

function PackagesSection() {
  const { ref, inView } = useInView()

  return (
    <section id="packages" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#1a2e1f' }}>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-10"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <h2
            className="font-display font-black text-white leading-[0.93]"
            style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
          >
            Day <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Packages</em>
          </h2>
          <p className="text-white/25 font-body text-[10px]">All prices per person in KES · book via WhatsApp</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PACKAGES.map(pkg => (
            <div key={pkg.name}
              className="rounded-xl flex flex-col relative overflow-hidden"
              style={{ background: pkg.bg, border: pkg.border }}
            >
              <div className="p-3 sm:p-4 pb-2 flex-shrink-0">
                <div className="flex items-center gap-1 mb-2.5">
                  {[1,2,3,4].map(n => (
                    <span key={n} className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: n <= pkg.level ? pkg.accent : 'rgba(255,255,255,0.12)' }} />
                  ))}
                  <span className="ml-1 font-body text-[8px] uppercase tracking-widest"
                    style={{ color: `${pkg.accent}99` }}>
                    {pkg.level === 1 ? 'Entry' : pkg.level === 2 ? 'Standard' : pkg.level === 3 ? 'Premium' : 'Elite'}
                  </span>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-black text-white leading-none"
                    style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)' }}>
                    {pkg.name}
                  </h3>
                  {pkg.tag && (
                    <span className="text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                      style={{ background: pkg.solid ? 'rgba(255,255,255,0.25)' : `${pkg.accent}28`, color: pkg.accent }}>
                      {pkg.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-black" style={{ fontSize: pkg.priceSize, color: pkg.accent }}>
                    {pkg.price.toLocaleString()}
                  </span>
                  <span className="font-body text-[9px] uppercase tracking-wide text-white/35">KES/pax</span>
                </div>
              </div>

              <div className="mx-3 sm:mx-4 h-px flex-shrink-0" style={{ backgroundColor: `${pkg.accent}28` }} />

              <ul className="p-3 sm:p-4 space-y-2 flex-1">
                {pkg.activities.map(a => (
                  <li key={a} className="flex items-center gap-2 font-body text-[10px] sm:text-[11px]"
                    style={{ color: pkg.solid ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.70)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pkg.dot }} />
                    {a}
                  </li>
                ))}
              </ul>

              <div className="p-3 sm:p-4 pt-0 flex-shrink-0">
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(pkg.waMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="block text-center font-body font-bold tracking-wide py-3.5 rounded-full transition-all duration-200 hover:opacity-90"
                  style={{
                    fontSize: 'clamp(11px, 1.3vw, 13px)',
                    background: pkg.solid ? '#fff' : 'var(--color-gold)',
                    color: pkg.solid ? 'var(--color-gold)' : '#fff',
                  }}>
                  {pkg.cta}
                </a>
              </div>
            </div>
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
  { src: '/assets/inside-tent-29.jpeg', label: 'Inside — Tent with Bed' },
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

const DINING_FEATURES = [
  { label: 'Full-Service Restaurant', desc: 'Wholesome, locally sourced meals served all day.' },
  { label: 'Bar & Craft Cocktails',   desc: 'Lively bar with craft cocktails, juices and local favourites.' },
  { label: 'Landscaped Gardens',      desc: 'Outdoor seating in beautifully kept green spaces.' },
  { label: 'Group & Event Catering',  desc: 'We cater for birthday parties, corporate lunches and large groups.' },
]

function DiningSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section id="dining" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#D4B882' }}>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-start">

          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="lg:w-1/2"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
          >
            <p className="text-brand-dark/40 font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">Dine &amp; Drink</p>
            <h2
              className="font-display font-black text-brand-dark leading-[0.93] mb-4"
              style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
            >
              Restaurant<br /><em className="not-italic" style={{ color: '#7a5a2a' }}>&amp; Bar</em>
            </h2>
            <p className="text-brand-dark/55 font-body text-sm leading-relaxed mb-8 max-w-sm">
              Full-service restaurant and lively bar serving craft cocktails and local flavours — all set within CabHouse Park&apos;s serene gardens.
            </p>

            <div className="divide-y divide-brand-dark/[0.08]">
              {DINING_FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-4"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'none' : 'translateX(-8px)',
                    transition: `opacity 0.45s ease ${0.1 + i * 0.06}s, transform 0.45s ease ${0.1 + i * 0.06}s`,
                  }}
                >
                  <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-brand-dark text-sm leading-tight">{f.label}</p>
                    <p className="text-brand-dark/50 font-body text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="lg:w-1/2 flex flex-col gap-5"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.15s' }}
          >
            <div className="rounded-2xl px-6 py-8 flex flex-col gap-5" style={{ backgroundColor: '#1a2e1f' }}>
              <p className="text-brand-gold font-body text-[10px] uppercase tracking-[0.3em] font-semibold">Open to All Guests</p>
              <p className="text-white font-display font-black leading-tight" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
                Recharge with food<br />
                <em className="not-italic" style={{ color: 'var(--color-gold)' }}>that hits the spot.</em>
              </p>
              <p className="text-white/55 font-body text-xs leading-relaxed max-w-xs">
                Whether you are finishing a day of activities or planning a standalone lunch — our kitchen is open. Groups of 10+ should call ahead.
              </p>
              <div className="h-px bg-white/8" />
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to make a dining reservation or enquire about group catering at CabHouse Park")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-white font-body font-bold text-xs px-5 py-3 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--color-gold)' }}
                >
                  Reserve a Table
                </a>
                <a
                  href={`tel:${SITE.contact.phone}`}
                  className="inline-flex items-center justify-center border border-white/15 text-white/70 hover:text-white font-body text-xs px-5 py-3 rounded-full transition-colors duration-200"
                >
                  {SITE.contact.phone}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { v: '8 AM',  l: 'Kitchen opens' },
                { v: '10 PM', l: 'Bar closes' },
                { v: '200+',  l: 'Seating capacity' },
                { v: 'Daily', l: 'Open all week' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-black/10 bg-white/20 px-4 py-4">
                  <p className="font-display font-black text-brand-dark text-xl leading-none" style={{ letterSpacing: '-0.02em' }}>{s.v}</p>
                  <p className="text-brand-dark/50 font-body text-[10px] mt-1 uppercase tracking-wide">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function StaySection() {
  const { ref, inView } = useInView(0.08)

  return (
    <>
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3 pb-3 md:pb-5">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 lg:px-10 py-14 lg:py-16" style={{ backgroundColor: '#1a2e1f' }}>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <h2 className="font-display font-black text-white leading-[0.93] mb-2"
              style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
              Stay the <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Night</em>
            </h2>
            <p className="text-white/55 font-body text-xs leading-relaxed max-w-sm">
              Don't let the day end here. Choose from cosy wooden cabins, immersive fully-equipped tented camps or open-sky camping — all set within the CabHouse grounds.
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {STAYS.map((s, i) => (
                <span key={i} className="flex items-center gap-2 border border-white/15 rounded-lg px-3 py-1.5">
                  <span className="font-body text-xs text-white/60">{s.name}</span>
                  <span className="text-brand-gold font-display font-bold text-xs">KES {s.base.toLocaleString()}<span className="text-white/35 font-body text-[9px] font-normal">/night</span></span>
                </span>
              ))}
            </div>
            <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book an overnight stay at CabHouse Park")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-body font-bold text-xs px-6 py-3 rounded-full transition-all duration-200 uppercase tracking-wide self-start lg:self-end"
              style={{ backgroundColor: 'var(--color-gold)' }}>
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
      <DiningSection />
      <StaySection />
    </Layout>
  )
}
