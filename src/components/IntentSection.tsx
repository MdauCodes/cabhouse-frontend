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
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden px-5 lg:px-10 py-16 lg:py-20">
        <p className="font-body text-xs uppercase tracking-[0.28em] font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
          Tell us what you need
        </p>
        <h2
          className="font-display font-black text-brand-dark leading-[1.05] mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', letterSpacing: '-0.028em' }}
        >
          We'll handle{' '}
          <span className="text-brand-dark/40">the rest from here.</span>
        </h2>

        <div className="rounded-2xl p-5 lg:p-7" style={{ backgroundColor: 'var(--color-forest)' }}>
          <p className="text-white/40 font-body text-xs uppercase tracking-[0.22em] font-semibold mb-6">
            What are you here for?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTENTS.map(intent => (
              <a
                key={intent.num}
                href={`https://wa.me/${wa}?text=${encodeURIComponent(intent.waMsg)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-col bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] hover:border-brand-gold/50 rounded-xl p-5 transition-all duration-200 group"
              >
                <span className="font-body text-xs font-bold mb-3" style={{ color: 'var(--color-gold)' }}>{intent.num}</span>
                <h3 className="font-display font-bold text-white text-lg leading-tight mb-1.5">{intent.title}</h3>
                <p className="text-white/55 font-body text-sm leading-relaxed mb-5 flex-1">{intent.sub}</p>
                <span
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg font-body font-bold text-xs uppercase tracking-wide transition-all duration-200 group-hover:brightness-110"
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
