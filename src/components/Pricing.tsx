import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

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
      className="bg-brand-dark px-6 lg:px-10 flex flex-col lg:h-[80dvh]"
      style={{ minHeight: 480 }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:h-full py-8 lg:py-10">

        {/* Header row */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex items-center justify-between mb-5 flex-shrink-0"
          style={{ opacity: inView ? 1 : 0, transition: 'all 0.5s ease' }}
        >
          <h2 className="font-display font-black text-white leading-none"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}>
            Packages & <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Pricing</em>
          </h2>
          <p className="text-white/25 font-body text-[10px] hidden lg:block">All prices in KES · WhatsApp booking</p>
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
        <div className="lg:flex-1 lg:min-h-0">

          {/* â”€â”€ Packages â”€â”€ */}
          {tab === 'packages' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:h-full">
              {PACKAGES.map(pkg => (
                <div key={pkg.name}
                  className={`rounded-xl flex flex-col border lg:h-full ${
                    pkg.highlight
                      ? 'bg-brand-gold border-transparent'
                      : 'bg-white/[0.04] border-white/8'
                  }`}
                >
                  <div className="p-3 sm:p-4 pb-3 flex-shrink-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-black text-white leading-none"
                        style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)' }}>
                        {pkg.name}
                      </h3>
                      {pkg.tag && (
                        <span className={`text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                          pkg.highlight ? 'bg-white/25 text-white' : 'bg-brand-gold/20 text-brand-gold'
                        }`}>{pkg.tag}</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`font-display font-black ${pkg.highlight ? 'text-white' : 'text-brand-gold'}`}
                        style={{ fontSize: 'clamp(1.1rem, 2vw, 1.7rem)' }}>
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className={`font-body text-[9px] uppercase tracking-wide ${pkg.highlight ? 'text-white/60' : 'text-white/30'}`}>
                        KES/pax
                      </span>
                    </div>
                  </div>

                  <div className={`mx-3 sm:mx-4 h-px flex-shrink-0 ${pkg.highlight ? 'bg-white/20' : 'bg-white/6'}`} />

                  <ul className="p-3 sm:p-4 space-y-1.5 flex-1">
                    {pkg.activities.map(a => (
                      <li key={a} className={`flex items-center gap-2 font-body text-[10px] sm:text-[11px] ${pkg.highlight ? 'text-white/85' : 'text-white/50'}`}>
                        <span className={`w-1 h-1 rounded-full flex-shrink-0 ${pkg.highlight ? 'bg-white' : 'bg-brand-gold'}`} />
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 sm:p-4 pt-0 flex-shrink-0">
                    <a
                      href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'd like to book the ${pkg.name} Package`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`block text-center text-[9px] font-body font-bold tracking-widest uppercase py-2 rounded-full transition-all duration-200 ${
                        pkg.highlight
                          ? 'bg-white text-brand-gold hover:bg-white/90'
                          : 'bg-white/6 text-white/50 hover:bg-brand-gold hover:text-white border border-white/8'
                      }`}>
                      Book
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* â”€â”€ Activities â”€â”€ */}
          {tab === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:h-full">
              <div className="bg-white/[0.04] border border-white/8 rounded-xl p-5 flex flex-col">
                <h3 className="font-display font-bold text-white text-sm mb-4 flex-shrink-0">Individual Activities</h3>
                <div className="flex flex-col gap-0">
                  {SINGLES.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between py-2.5 ${i < SINGLES.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div>
                        <p className="text-white font-body text-xs font-medium">{s.name}</p>
                        <p className="text-white/30 font-body text-[10px]">{s.note}</p>
                      </div>
                      <span className="text-brand-gold font-display font-bold text-sm">KES {s.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.04] border border-white/8 rounded-xl p-5 flex flex-col">
                <h3 className="font-display font-bold text-white text-sm mb-4 flex-shrink-0">Cars & Go-Karts</h3>
                <div className="flex flex-col gap-0">
                  {CARS.map((c, i) => (
                    <div key={i} className={`flex items-center justify-between py-2.5 ${i < CARS.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div>
                        <p className="text-white font-body text-xs font-medium">{c.name}</p>
                        <p className="text-white/30 font-body text-[10px]">{c.note}</p>
                      </div>
                      <span className="text-brand-gold font-display font-bold text-sm">KES {c.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ Stays â”€â”€ */}
          {tab === 'stays' && (
            <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 sm:p-5 lg:h-full flex flex-col">
              <h3 className="font-display font-bold text-white text-sm mb-4 flex-shrink-0">Stay With Us</h3>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs font-body min-w-[320px]">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left pb-2 text-white/25 text-[9px] uppercase tracking-widest font-semibold">Accommodation</th>
                      <th className="text-right pb-2 text-white/25 text-[9px] uppercase tracking-widest font-semibold">Room Only</th>
                      <th className="text-right pb-2 text-white/25 text-[9px] uppercase tracking-widest font-semibold hidden sm:table-cell">+B / 1 pax</th>
                      <th className="text-right pb-2 text-white/25 text-[9px] uppercase tracking-widest font-semibold hidden sm:table-cell">+B / 2 pax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STAYS.map((s, i) => (
                      <tr key={i} className={i < STAYS.length - 1 ? 'border-b border-white/5' : ''}>
                        <td className="py-2.5 text-white font-medium">{s.name}</td>
                        <td className="py-2.5 text-right text-brand-gold font-display font-bold">{s.base.toLocaleString()}</td>
                        <td className="py-2.5 text-right text-white/45 hidden sm:table-cell">{s.b1 ? s.b1.toLocaleString() : '"”'}</td>
                        <td className="py-2.5 text-right text-white/45 hidden sm:table-cell">{s.b2 ? s.b2.toLocaleString() : '"”'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-white/20 font-body text-[9px] mt-3 flex-shrink-0">+B = breakfast included · Prices per night in KES</p>
            </div>
          )}

          {/* â”€â”€ Venues â”€â”€ */}
          {tab === 'venues' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:h-full">
              {VENUES.map((v, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-5 flex flex-col lg:h-full">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-white text-sm mb-1">{v.name}</h3>
                    <p className="text-white/30 font-body text-[10px] mb-4">{v.note}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-brand-gold font-display font-black" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)' }}>
                        {v.price.toLocaleString()}
                      </span>
                      <span className="text-white/20 font-body text-[9px] uppercase tracking-wide">KES / event</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I want to inquire about the ${v.name} venue`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 block text-center text-[9px] font-body font-bold tracking-widest uppercase py-2 rounded-full bg-white/6 text-white/50 hover:bg-brand-gold hover:text-white border border-white/8 transition-all duration-200">
                    Enquire
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
