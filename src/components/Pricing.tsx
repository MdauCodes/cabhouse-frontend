import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

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
    waMsg: `Hi CabHouse 👋 I'd like to book the *Bronze Package* at KES 1,000 per person.\n\nThis includes: Bouncing Castles, Rainbow Slides & Swings.\n\nPlease let me know your available dates and how many people I can bring. Thank you!`,
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
    waMsg: `Hi CabHouse 👋 I'd like to book the *Silver Package* at KES 1,300 per person.\n\nThis includes: Bouncing Castles, Rainbow Slides, Swings & Swimming.\n\nKindly confirm availability and any group rates if applicable. Looking forward to visiting!`,
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
    waMsg: `Hi CabHouse 👋 I'd like to book the *Platinum Package* at KES 1,400 per person — your most popular pick!\n\nThis includes: Zipline, Sky Bike, Rainbow Slides & Bridge & Mountain.\n\nPlease share available dates and whether group bookings receive any discount. Excited to experience this!`,
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
    waMsg: `Hi CabHouse 👋 I'm interested in the *Gold All-In Package* at KES 2,500 per person — the full experience!\n\nThis covers: Every Activity, Unlimited Access & a Full Day Pass.\n\nI'd like to plan an unforgettable day out. Please confirm available dates, group size options, and anything I should know before arrival. Can't wait!`,
  },
]

const SINGLES = [
  { name: 'Mountain & Bridge', note: 'Unlimited', price: 500 },
  { name: 'Swimming',          note: 'Unlimited', price: 500 },
  { name: 'Zipline',           note: 'One round', price: 500 },
  { name: 'Sky Bike',          note: 'One round', price: 500 },
  { name: 'Rainbow Slide',     note: 'Unlimited', price: 500 },
]

const CARS = [
  { name: 'Bumper Car',  note: '10 mins',  price: 300 },
  { name: 'Bumper Car',  note: '30 mins',  price: 750 },
  { name: 'Bumper Car',  note: '1 hour',   price: 1000 },
  { name: 'Go-Kart',    note: '15 mins',  price: 500 },
  { name: 'Go-Kart',    note: '30 mins',  price: 1000 },
]

const STAYS = [
  { name: 'Wooden Cabin',        base: 3000, b1: 3500, b2: 4000 },
  { name: 'Tented Cabin (Big)',  base: 2500, b1: 3000, b2: 3500 },
  { name: 'Tented Cabin (Sm)',   base: 2000, b1: 2500, b2: 3000 },
  { name: 'Camping Tent (Sm)',   base: 1500, b1: 2000, b2: null },
  { name: 'Camping Tent (Big)',  base: 5000, b1: 7500, b2: null },
]

const VENUES = [
  { name: 'Gardens',      note: 'Up to 200 pax',      price: 20000 },
  { name: 'Indoor Hall',  note: 'Corporate & social',  price: 10000 },
  { name: 'Premium Tent', note: 'Outdoor events',      price: 4000 },
]

type Tab = 'packages' | 'activities' | 'stays' | 'venues'

const TABS: { id: Tab; label: string }[] = [
  { id: 'packages',   label: 'Packages' },
  { id: 'activities', label: 'Activities' },
  { id: 'stays',      label: 'Stays' },
  { id: 'venues',     label: 'Venues' },
]

export default function Pricing() {
  const { ref, inView } = useInView()
  const [tab, setTab] = useState<Tab>('packages')

  return (
    <section
      id="packages"
      style={{ background: 'var(--canvas)' }}
      className="px-3 md:px-5 pt-3"
    >
      <div className="bg-brand-dark rounded-3xl overflow-hidden px-4 lg:px-10 flex flex-col" style={{ minHeight: 480 }}>
      <div className="max-w-7xl mx-auto w-full flex flex-col py-8 lg:py-10">

        {/* Header row */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex items-center justify-between mb-5 flex-shrink-0"
          style={{ opacity: inView ? 1 : 0, transition: 'all 0.5s ease' }}
        >
          <h2 className="font-display font-black text-white leading-none"
            style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
            Packages & <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Pricing</em>
          </h2>
          <p className="text-white/45 font-body text-xs hidden lg:block">All prices in KES · WhatsApp booking</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white/5 rounded-full p-1 self-start flex-shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full font-body text-xs font-semibold transition-all duration-200 ${
                tab === t.id ? 'bg-brand-gold text-white' : 'text-white/40 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>

          {/* â"€â"€ Packages â"€â"€ */}
          {tab === 'packages' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PACKAGES.map(pkg => (
                <div key={pkg.name}
                  className="rounded-xl flex flex-col relative overflow-hidden"
                  style={{ background: pkg.bg, border: pkg.border }}
                >
                  <div className="p-3 sm:p-4 pb-2 flex-shrink-0">
                    {/* Tier level dots */}
                    <div className="flex items-center gap-1 mb-2.5">
                      {[1,2,3,4].map(n => (
                        <span key={n} className="w-1.5 h-1.5 rounded-full transition-all"
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
                        <span
                          className="text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                          style={{ background: pkg.solid ? 'rgba(255,255,255,0.25)' : `${pkg.accent}28`, color: pkg.accent }}
                        >{pkg.tag}</span>
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
                      className="block text-center font-body font-bold tracking-wide py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
                      style={{
                        fontSize: 'clamp(8px, 1.1vw, 11px)',
                        background: pkg.solid ? '#fff' : 'var(--color-gold)',
                        color: pkg.solid ? 'var(--color-gold)' : '#fff',
                        border: 'none',
                      }}>
                      {pkg.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Activities ── */}
          {tab === 'activities' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                {/* Individual Activities */}
                <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 sm:p-5 flex flex-col">
                  <h3 className="font-display font-bold text-white text-sm mb-3 flex-shrink-0">Individual Activities</h3>
                  <div className="flex flex-col flex-1">
                    {SINGLES.map((s, i) => (
                      <div key={i} className={`flex items-center justify-between py-2.5 gap-3 ${i < SINGLES.length - 1 ? 'border-b border-white/5' : ''}`}>
                        <div className="min-w-0">
                          <p className="text-white font-body text-xs font-medium">{s.name}</p>
                          <p className="text-white/30 font-body text-[10px]">{s.note}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-brand-gold font-display font-bold text-sm">KES {s.price.toLocaleString()}</span>
                          <a
                            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to book the *${s.name}* activity (${s.note}) at KES ${s.price.toLocaleString()}.\n\nPlease confirm availability and let me know the best time to visit. Thank you!`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[9px] font-body font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                            style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                            Book
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Cars & Go-Karts */}
                <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 sm:p-5 flex flex-col">
                  <h3 className="font-display font-bold text-white text-sm mb-3 flex-shrink-0">Cars & Go-Karts</h3>
                  <div className="flex flex-col flex-1">
                    {CARS.map((c, i) => (
                      <div key={i} className={`flex items-center justify-between py-2.5 gap-3 ${i < CARS.length - 1 ? 'border-b border-white/5' : ''}`}>
                        <div className="min-w-0">
                          <p className="text-white font-body text-xs font-medium">{c.name}</p>
                          <p className="text-white/30 font-body text-[10px]">{c.note}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-brand-gold font-display font-bold text-sm">KES {c.price.toLocaleString()}</span>
                          <a
                            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to book a *${c.name}* session for *${c.note}* at KES ${c.price.toLocaleString()}.\n\nPlease let me know your available slots and how to confirm my reservation. Can't wait!`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[9px] font-body font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                            style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                            Book
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Upsell banner */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.04] border border-white/8 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-white/55 text-center sm:text-left">
                  <span className="text-white font-semibold">Save more with a package.</span> Bundles like Platinum (KES 1,400) give you multiple activities at a better rate.
                </p>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I was browsing your individual activities and I'm interested in getting more value. Could you help me pick the best package for my group and visit date? Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-[10px] font-body font-bold tracking-wide px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                  Help Me Pick a Package
                </a>
              </div>
            </div>
          )}

          {/* ── Stays ── */}
          {tab === 'stays' && (
            <div className="flex flex-col gap-3">
              <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 sm:p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-white text-sm mb-4 flex-shrink-0">Stay With Us</h3>
                <div className="flex flex-col flex-1 overflow-y-auto">
                  {STAYS.map((s, i) => (
                    <div key={i} className={`flex flex-wrap items-center gap-x-4 gap-y-1 py-3 ${i < STAYS.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-white font-body text-xs font-semibold">{s.name}</p>
                        <p className="text-white/30 font-body text-[10px]">from KES {s.base.toLocaleString()} / night</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-[10px] font-body text-white/40">
                        <span>+Breakfast 1 pax: <span className="text-white/60">{s.b1?.toLocaleString() ?? '—'}</span></span>
                        {s.b2 && <span>2 pax: <span className="text-white/60">{s.b2.toLocaleString()}</span></span>}
                      </div>
                      <a
                        href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to reserve a *${s.name}* at CabHouse Park.\n\nStarting from KES ${s.base.toLocaleString()} per night. Please let me know available dates, whether breakfast is available, and what I should bring or prepare for my stay. Looking forward to it!`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[9px] font-body font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                        style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                        Reserve
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-white/20 font-body text-[9px] mt-3 flex-shrink-0">+B = breakfast included · Prices per night in KES</p>
              </div>
              {/* Upsell banner */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.04] border border-white/8 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-white/55 text-center sm:text-left">
                  <span className="text-white font-semibold">Staying over?</span> Combine your accommodation with a day package and get the full CabHouse experience in one visit.
                </p>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to plan a stay at CabHouse Park and also enjoy the park activities while I'm there. Can you help me put together a combined stay + activities plan for my group? Please share available dates and any special offers. Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-[10px] font-body font-bold tracking-wide px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                  Plan My Stay + Activities
                </a>
              </div>
            </div>
          )}

          {/* ── Venues ── */}
          {tab === 'venues' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                {VENUES.map((v, i) => {
                  const msgs = [
                    `Hi CabHouse 👋 I'm interested in hosting an event at your *Gardens* venue (up to 200 pax) at KES ${v.price.toLocaleString()}.\n\nCould you share available dates, setup options, catering arrangements, and any décor restrictions? I'd love to plan something special here!`,
                    `Hi CabHouse 👋 I'd like to enquire about your *Indoor Hall* for a corporate or social event at KES ${v.price.toLocaleString()}.\n\nPlease share available dates, capacity details, AV/projector availability, and catering options. Looking forward to discussing further!`,
                    `Hi CabHouse 👋 I'm keen on booking your *Premium Tent* for an outdoor event at KES ${v.price.toLocaleString()}.\n\nCould you let me know the tent capacity, available dates, furniture/décor included, and whether you offer catering or bar services? Thank you!`,
                  ]
                  const ctas = ['Book the Gardens', 'Reserve the Hall', 'Book Premium Tent']
                  return (
                    <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-5 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-white text-sm mb-1">{v.name}</h3>
                        <p className="text-white/30 font-body text-[10px] mb-4">{v.note}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-brand-gold font-display font-black" style={{ fontSize: 'var(--type-h2)' }}>
                            {v.price.toLocaleString()}
                          </span>
                          <span className="text-white/20 font-body text-[9px] uppercase tracking-wide">KES / event</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(msgs[i])}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-4 block text-center font-body font-bold py-2.5 rounded-full transition-all duration-200 hover:brightness-110"
                        style={{ fontSize: 'clamp(9px, 1.1vw, 11px)', backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                        {ctas[i]}
                      </a>
                    </div>
                  )
                })}
              </div>
              {/* Bottom nudge */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.04] border border-white/8 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-white/55 text-center sm:text-left">
                  <span className="text-white font-semibold">Not sure which venue fits your event?</span> Tell us your headcount, date, and budget — we'll suggest the best option.
                </p>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi CabHouse 👋 I'm planning an event and would like help choosing the right venue.\n\nCould you help me based on my headcount, date, and budget? I'm open to Gardens, Indoor Hall, or the Premium Tent. Please get in touch so we can plan this together. Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-[10px] font-body font-bold tracking-wide px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                  Help Me Choose a Venue
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </section>
  )
}
