import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'
import { useContentBlocks } from '../hooks/useContentBlocks'

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

interface PkgItem {
  id: string; slug: string; title: string; description: string
  price: string; tag: string | null; accentColor: string | null
  solidBg: boolean; ctaLabel: string | null; features: string[]
  displayOrder: number
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

type Tab = 'packages' | 'activities' | 'stays' | 'venues'
const TABS: { id: Tab; label: string }[] = [
  { id: 'packages',   label: 'Packages' },
  { id: 'activities', label: 'Activities' },
  { id: 'stays',      label: 'Stays' },
  { id: 'venues',     label: 'Venues' },
]

const wa = SITE.contact.whatsapp.replace('+', '')

export default function Pricing() {
  const { ref, inView } = useInView()
  const [tab, setTab] = useState<Tab>('packages')
  const { get } = useContentBlocks()
  const p = (key: string, def: number) => Number(get(key, String(def)))
  const [apiPackages, setApiPackages] = useState<PkgItem[]>([])

  useEffect(() => {
    fetch(`${API}/service-items/public?category=PARK_PACKAGE`)
      .then(r => r.json())
      .then(j => { if (j.success && Array.isArray(j.data)) setApiPackages(j.data) })
      .catch(() => {})
  }, [])

  const SINGLES = [
    { name: 'Mountain & Bridge', note: 'Unlimited', price: p('pricing.mountain', 500) },
    { name: 'Swimming',          note: 'Unlimited', price: p('pricing.swimming', 500) },
    { name: 'Zipline',           note: 'One round', price: p('pricing.zipline', 500) },
    { name: 'Sky Bike',          note: 'One round', price: p('pricing.skybike', 500) },
    { name: 'Rainbow Slide',     note: 'Unlimited', price: p('pricing.slide', 500) },
  ]

  const CARS = [
    { name: 'Bumper Car', note: '10 mins', price: p('pricing.bumpercar.10', 300) },
    { name: 'Bumper Car', note: '30 mins', price: p('pricing.bumpercar.30', 750) },
    { name: 'Bumper Car', note: '1 hour',  price: p('pricing.bumpercar.60', 1000) },
    { name: 'Go-Kart',   note: '15 mins', price: p('pricing.gokart.15', 500) },
    { name: 'Go-Kart',   note: '30 mins', price: p('pricing.gokart.30', 1000) },
  ]

  const cabinWooden     = p('pricing.cabin.wooden', 3000)
  const cabinTentedBig  = p('pricing.cabin.tented.big', 2500)
  const cabinTentedSm   = p('pricing.cabin.tented.small', 2000)
  const tentSm          = p('pricing.tent.small', 1500)
  const tentBig         = p('pricing.tent.big', 5000)

  const STAYS = [
    { name: 'Wooden Cabin',       base: cabinWooden,    b1: cabinWooden + 500,   b2: cabinWooden + 1000 },
    { name: 'Tented Cabin (Big)', base: cabinTentedBig, b1: cabinTentedBig + 500, b2: cabinTentedBig + 1000 },
    { name: 'Tented Cabin (Sm)',  base: cabinTentedSm,  b1: cabinTentedSm + 500,  b2: cabinTentedSm + 1000 },
    { name: 'Camping Tent (Sm)',  base: tentSm,         b1: tentSm + 500,         b2: null },
    { name: 'Camping Tent (Big)', base: tentBig,        b1: tentBig + 2500,       b2: null },
  ]

  const VENUES = [
    { name: 'Gardens',      note: 'Up to 200 pax',     price: p('pricing.venue.gardens', 20000) },
    { name: 'Indoor Hall',  note: 'Corporate & social', price: p('pricing.venue.hall', 10000) },
    { name: 'Premium Tent', note: 'Outdoor events',     price: p('pricing.venue.tent', 4000) },
  ]

  // Static fallbacks used when API hasn't loaded yet
  const FALLBACK_PACKAGES: PkgItem[] = [
    { id:'bronze',   slug:'bronze',   title:'Bronze Package',   description:'', price:`KES ${p('pricing.bronze',1000).toLocaleString()}/pax`,   tag:null,      accentColor:'#B87040', solidBg:false, ctaLabel:'Reserve My Spot',      features:['Bouncing Castles','Rainbow Slides','Swings'],                          displayOrder:1 },
    { id:'silver',   slug:'silver',   title:'Silver Package',   description:'', price:`KES ${p('pricing.silver',1300).toLocaleString()}/pax`,   tag:null,      accentColor:'#A8BACE', solidBg:false, ctaLabel:'Book Silver Package',   features:['Bouncing Castles','Rainbow Slides','Swings','Swimming'],               displayOrder:2 },
    { id:'platinum', slug:'platinum', title:'Platinum Package', description:'', price:`KES ${p('pricing.platinum',1400).toLocaleString()}/pax`, tag:'Popular', accentColor:'#C8873A', solidBg:true,  ctaLabel:'Secure Platinum Now',   features:['Zipline','Sky Bike','Rainbow Slides','Bridge & Mountain'],             displayOrder:3 },
    { id:'gold',     slug:'gold',     title:'Gold Package',     description:'', price:`KES ${p('pricing.gold',2500).toLocaleString()}/pax`,     tag:'All-In',  accentColor:'#FBBF24', solidBg:false, ctaLabel:'Claim Gold Experience', features:['Every Activity','Unlimited Access','Full Day Pass'],                    displayOrder:4 },
  ]

  const PACKAGES = (apiPackages.length > 0 ? apiPackages : FALLBACK_PACKAGES).map((pkg, i) => {
    const accent = pkg.accentColor ?? '#C8873A'
    const { r, g, b } = hexToRgb(accent)
    const level = pkg.displayOrder || (i + 1)
    const featureList = pkg.features.length > 0 ? pkg.features : ['Park Access']
    const priceText = pkg.price ?? ''
    const waMsg = `Hi CabHouse 👋 I'd like to book the *${pkg.title}* at ${priceText} per person.\n\nThis includes: ${featureList.join(', ')}.\n\nPlease let me know your available dates. Thank you!`
    return {
      id: pkg.id, name: pkg.title.replace(' Package', ''), fullName: pkg.title,
      priceText, tag: pkg.tag, level,
      features: featureList,
      bg: pkg.solidBg ? accent : `rgba(${Math.round(r*0.25)},${Math.round(g*0.25)},${Math.round(b*0.25)},0.85)`,
      border: pkg.solidBg ? '2px solid rgba(255,255,255,0.20)' : `1px solid rgba(${r},${g},${b},0.30)`,
      accent: pkg.solidBg ? '#fff' : accent,
      dot: pkg.solidBg ? '#fff' : accent,
      solid: pkg.solidBg,
      cta: pkg.ctaLabel ?? 'Book Now',
      waMsg,
    }
  })

  return (
    <section id="packages" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="rounded-3xl overflow-hidden px-4 lg:px-10 flex flex-col" style={{ minHeight: 480, backgroundColor: '#D4B882' }}>
      <div className="max-w-7xl mx-auto w-full flex flex-col py-8 lg:py-10">

        {/* Header */}
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className="flex items-center justify-between mb-5 flex-shrink-0"
          style={{ opacity: inView ? 1 : 0, transition: 'all 0.5s ease' }}>
          <h2 className="font-display font-black text-brand-dark leading-none"
            style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.02em' }}>
            Packages & <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Pricing</em>
          </h2>
          <p className="text-brand-dark/50 font-body text-xs hidden lg:block">All prices in KES · WhatsApp booking</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-brand-dark/8 rounded-full p-1 w-full sm:w-auto sm:self-start sm:flex-shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all duration-200 ${
                tab === t.id ? 'bg-brand-gold text-white' : 'text-brand-dark/50 hover:text-brand-dark'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {/* ── Packages ── */}
          {tab === 'packages' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PACKAGES.map(pkg => (
                <div key={pkg.id} className="rounded-xl flex flex-col relative overflow-hidden"
                  style={{ background: pkg.bg, border: pkg.border }}>
                  <div className="p-3 sm:p-4 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-1 mb-2.5">
                      {[1,2,3,4].map(n => (
                        <span key={n} className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{ backgroundColor: n <= pkg.level ? pkg.accent : 'rgba(255,255,255,0.12)' }} />
                      ))}
                      <span className="ml-1 font-body text-[8px] uppercase tracking-widest" style={{ color: `${pkg.accent}99` }}>
                        {pkg.level === 1 ? 'Entry' : pkg.level === 2 ? 'Standard' : pkg.level === 3 ? 'Premium' : 'Elite'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-black text-white leading-none" style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)' }}>
                        {pkg.name}
                      </h3>
                      {pkg.tag && (
                        <span className="text-[8px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                          style={{ background: pkg.solid ? 'rgba(255,255,255,0.25)' : `${pkg.accent}28`, color: pkg.accent }}>
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="font-display font-black text-lg sm:text-xl" style={{ color: pkg.accent }}>
                        {pkg.priceText}
                      </span>
                    </div>
                  </div>
                  <div className="mx-3 sm:mx-4 h-px flex-shrink-0" style={{ backgroundColor: `${pkg.accent}28` }} />
                  <ul className="p-3 sm:p-4 space-y-2 flex-1">
                    {pkg.features.map(a => (
                      <li key={a} className="flex items-center gap-2 font-body text-[10px] sm:text-[11px]"
                        style={{ color: pkg.solid ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.70)' }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pkg.dot }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 sm:p-4 pt-0 flex-shrink-0">
                    <a href={`https://wa.me/${wa}?text=${encodeURIComponent(pkg.waMsg)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block text-center font-body font-bold tracking-wide py-3.5 rounded-full transition-all duration-200 hover:opacity-90"
                      style={{ fontSize: 'clamp(11px, 1.3vw, 13px)', background: pkg.solid ? '#fff' : 'var(--color-gold)', color: pkg.solid ? 'var(--color-gold)' : '#fff', border: 'none' }}>
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
                <div className="bg-white/30 border border-brand-dark/10 rounded-xl p-4 sm:p-5 flex flex-col">
                  <h3 className="font-display font-bold text-brand-dark text-sm mb-3 flex-shrink-0">Individual Activities</h3>
                  <div className="flex flex-col flex-1">
                    {SINGLES.map((s, i) => (
                      <div key={i} className={`flex items-center justify-between py-2.5 gap-3 ${i < SINGLES.length - 1 ? 'border-b border-brand-dark/8' : ''}`}>
                        <div className="min-w-0">
                          <p className="text-brand-dark font-body text-xs font-medium">{s.name}</p>
                          <p className="text-brand-dark/40 font-body text-[10px]">{s.note}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-brand-gold font-display font-bold text-sm">KES {s.price.toLocaleString()}</span>
                          <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to book the *${s.name}* activity (${s.note}) at KES ${s.price.toLocaleString()}.\n\nPlease confirm availability and let me know the best time to visit. Thank you!`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[11px] font-body font-bold uppercase tracking-wide px-3.5 py-2 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                            style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                            Book
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/30 border border-brand-dark/10 rounded-xl p-4 sm:p-5 flex flex-col">
                  <h3 className="font-display font-bold text-brand-dark text-sm mb-3 flex-shrink-0">Cars & Go-Karts</h3>
                  <div className="flex flex-col flex-1">
                    {CARS.map((c, i) => (
                      <div key={i} className={`flex items-center justify-between py-2.5 gap-3 ${i < CARS.length - 1 ? 'border-b border-brand-dark/8' : ''}`}>
                        <div className="min-w-0">
                          <p className="text-brand-dark font-body text-xs font-medium">{c.name}</p>
                          <p className="text-brand-dark/40 font-body text-[10px]">{c.note}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-brand-gold font-display font-bold text-sm">KES {c.price.toLocaleString()}</span>
                          <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to book a *${c.name}* session for *${c.note}* at KES ${c.price.toLocaleString()}.\n\nPlease let me know your available slots and how to confirm my reservation. Can't wait!`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[11px] font-body font-bold uppercase tracking-wide px-3.5 py-2 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                            style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                            Book
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/30 border border-brand-dark/10 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-brand-dark/55 text-center sm:text-left">
                  <span className="text-brand-dark font-semibold">Save more with a package.</span> Bundles like Platinum (KES {p('pricing.platinum', 1400).toLocaleString()}) give you multiple activities at a better rate.
                </p>
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I was browsing your individual activities and I'm interested in getting more value. Could you help me pick the best package for my group and visit date? Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-sm font-body font-bold tracking-wide px-5 py-3 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                  Help Me Pick a Package
                </a>
              </div>
            </div>
          )}

          {/* ── Stays ── */}
          {tab === 'stays' && (
            <div className="flex flex-col gap-3">
              <div className="bg-white/30 border border-brand-dark/10 rounded-xl p-4 sm:p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-brand-dark text-sm mb-4 flex-shrink-0">Stay With Us</h3>
                <div className="flex flex-col flex-1 overflow-y-auto">
                  {STAYS.map((s, i) => (
                    <div key={i} className={`flex flex-wrap items-center gap-x-4 gap-y-1 py-3 ${i < STAYS.length - 1 ? 'border-b border-brand-dark/8' : ''}`}>
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-brand-dark font-body text-xs font-semibold">{s.name}</p>
                        <p className="text-brand-dark/40 font-body text-[10px]">from KES {s.base.toLocaleString()} / night</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-[10px] font-body text-brand-dark/40">
                        <span>+Breakfast 1 pax: <span className="text-brand-dark/60">{s.b1?.toLocaleString() ?? '—'}</span></span>
                        {s.b2 && <span>2 pax: <span className="text-brand-dark/60">{s.b2.toLocaleString()}</span></span>}
                      </div>
                      <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to reserve a *${s.name}* at CabHouse Park.\n\nStarting from KES ${s.base.toLocaleString()} per night. Please let me know available dates, whether breakfast is available, and what I should bring or prepare for my stay. Looking forward to it!`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-body font-bold uppercase tracking-wide px-4 py-2 rounded-full border transition-all duration-200 hover:bg-brand-gold hover:text-white hover:border-transparent whitespace-nowrap"
                        style={{ color: 'var(--color-gold)', borderColor: 'rgba(200,135,58,0.35)' }}>
                        Reserve
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-brand-dark/30 font-body text-[9px] mt-3 flex-shrink-0">+B = breakfast included · Prices per night in KES</p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/30 border border-brand-dark/10 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-brand-dark/55 text-center sm:text-left">
                  <span className="text-brand-dark font-semibold">Staying over?</span> Combine your accommodation with a day package and get the full CabHouse experience in one visit.
                </p>
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I'd like to plan a stay at CabHouse Park and also enjoy the park activities while I'm there. Can you help me put together a combined stay + activities plan for my group? Please share available dates and any special offers. Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-sm font-body font-bold tracking-wide px-5 py-3 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
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
                    <div key={i} className="bg-white/30 border border-brand-dark/10 rounded-xl p-5 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-brand-dark text-sm mb-1">{v.name}</h3>
                        <p className="text-brand-dark/40 font-body text-[10px] mb-4">{v.note}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-brand-gold font-display font-black" style={{ fontSize: 'var(--type-h2)' }}>
                            {v.price.toLocaleString()}
                          </span>
                          <span className="text-brand-dark/30 font-body text-[9px] uppercase tracking-wide">KES / event</span>
                        </div>
                      </div>
                      <a href={`https://wa.me/${wa}?text=${encodeURIComponent(msgs[i])}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-4 block text-center font-body font-bold py-3.5 rounded-full transition-all duration-200 hover:brightness-110"
                        style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', backgroundColor: 'var(--color-gold)', color: '#fff' }}>
                        {ctas[i]}
                      </a>
                    </div>
                  )
                })}
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/30 border border-brand-dark/10 rounded-xl px-5 py-3.5">
                <p className="font-body text-xs text-brand-dark/55 text-center sm:text-left">
                  <span className="text-brand-dark font-semibold">Not sure which venue fits your event?</span> Tell us your headcount, date, and budget — we'll suggest the best option.
                </p>
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi CabHouse 👋 I'm planning an event and would like help choosing the right venue.\n\nCould you help me based on my headcount, date, and budget? I'm open to Gardens, Indoor Hall, or the Premium Tent. Please get in touch so we can plan this together. Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 text-sm font-body font-bold tracking-wide px-5 py-3 rounded-full transition-all duration-200 hover:brightness-110 whitespace-nowrap"
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
