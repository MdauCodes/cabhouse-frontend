import { SITE } from '../config/site'

const INTENTS = [
  {
    num: '01',
    title: 'Somewhere to stay',
    sub: 'Rooms, cabins & overnight camping',
    cta: 'Book a stay →',
    waMsg: "Hi, I'd like to book a stay at CabHouse Park",
  },
  {
    num: '02',
    title: 'A day out',
    sub: 'Pool, play, camping & activities',
    cta: 'Book a visit →',
    waMsg: "Hi, I'd like to book a day visit at CabHouse Park",
  },
  {
    num: '03',
    title: 'Order water',
    sub: 'Bulk or domestic water delivery',
    cta: 'Order now →',
    waMsg: "Hi, I'd like to order CabHouse Water",
  },
  {
    num: '04',
    title: 'An event hosted',
    sub: 'Birthdays, schools & corporate',
    cta: 'Plan an event →',
    waMsg: "Hi, I'd like to enquire about hosting an event at CabHouse",
  },
]

export default function IntentSection() {
  const wa = SITE.contact.whatsapp.replace('+', '')
  return (
    <section className="bg-brand-dark px-5 lg:px-10 py-14 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: 'var(--color-gold)' }}>
          Tell us what you need
        </p>
        <h2
          className="font-display font-black text-white leading-[1.0] mb-10"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', letterSpacing: '-0.03em' }}
        >
          We'll handle{' '}
          <span className="text-white/25">the rest from here.</span>
        </h2>

        <div className="border border-white/8 rounded-2xl p-4 lg:p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-white/30 font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-5">
            What are you here for?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INTENTS.map(intent => (
              <a
                key={intent.num}
                href={`https://wa.me/${wa}?text=${encodeURIComponent(intent.waMsg)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-col bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-brand-gold/40 rounded-xl p-4 transition-all duration-200 group"
              >
                <span className="font-body text-xs font-bold mb-2" style={{ color: 'var(--color-gold)' }}>{intent.num}</span>
                <h3 className="font-display font-bold text-white text-base leading-tight mb-1">{intent.title}</h3>
                <p className="text-white/40 font-body text-xs leading-relaxed mb-4 flex-1">{intent.sub}</p>
                <span
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-lg font-body font-bold text-xs uppercase tracking-wide transition-all duration-200 group-hover:brightness-110"
                  style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}
                >
                  {intent.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
