import { useState } from 'react'
import { SITE } from '../config/site'

const FAQS = [
  {
    q: 'What is CabHouse Agencies?',
    a: 'CabHouse Agencies is a multi-brand leisure and lifestyle company based in Kisii, Kenya. We operate CabHouse Park (adventure & recreation), CabHouse Water (premium drinking water), and CabHouse Apartments (short and long-term furnished stays).',
  },
  {
    q: 'Where are you located?',
    a: `We're located ${SITE.location.address}. It's an easy drive from Kisii town centre. Open daily from 8 AM to 8 PM.`,
  },
  {
    q: 'What activities are available at the park?',
    a: 'CabHouse Park has 8+ activity zones including: Zip Line, Sky Bike, 100m Rainbow Slide, Mountain & Bridge Challenge, Swimming Pool with inflatables, Go-Karts, Bumper Cars, and Bouncing Castles. We also have a restaurant, camping facilities, and event spaces.',
  },
  {
    q: 'Can I book a corporate event or group visit?',
    a: 'Absolutely. We host team building events, school trips, weddings, birthday parties, gala dinners and conferences. We have a garden (200 PAX), indoor hall, and tent facilities. Get in touch via WhatsApp or our contact form for a tailored proposal.',
  },
  {
    q: 'How do I pay and confirm a booking?',
    a: 'The easiest way is to WhatsApp us directly â€” we confirm availability, share pricing, and arrange payment from there. We accept M-Pesa, bank transfer, and cash on arrival for most bookings.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-brand-dark px-5 lg:px-10 py-14 lg:py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-3 text-center" style={{ color: 'var(--color-gold)' }}>
          Quick Answers
        </p>
        <h2
          className="font-display font-black text-white leading-tight text-center mb-10"
          style={{ fontSize: 'var(--type-h2)', letterSpacing: '-0.03em' }}
        >
          The things you'd ask if we were standing right there.
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-white/8 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
              >
                <span className="text-white font-body text-sm font-medium group-hover:text-brand-gold transition-colors pr-4">
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center transition-all duration-200"
                  style={open === i ? { backgroundColor: 'var(--color-gold)', borderColor: 'var(--color-gold)' } : {}}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-200" style={{ transform: open === i ? 'rotate(45deg)' : 'none', stroke: open === i ? '#111' : 'rgba(255,255,255,0.5)' }} strokeWidth="2">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-white/50 font-body text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

