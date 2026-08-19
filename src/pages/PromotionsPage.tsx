import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { usePromotions, type PromotionTag, type PromotionData } from '../hooks/usePromotions'
import { SITE } from '../config/site'
import BookingModal from '../components/BookingModal'

const TAG_CONFIG: Record<PromotionTag, { label: string; color: string; bg: string }> = {
  DEAL:       { label: 'Deal',        color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  DISCOUNT:   { label: 'Discount',    color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  NEW:        { label: 'New',         color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  EXPERIENCE: { label: 'Experience',  color: '#A78BFA', bg: 'rgba(167,139,250,0.12)'},
  EVENT:      { label: 'Event',       color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
  SEASONAL:   { label: 'Seasonal',    color: '#FB923C', bg: 'rgba(251,146,60,0.12)' },
}

const wa = SITE.contact.whatsapp.replace('+', '')

function expiresIn(iso: string | null): string | null {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return null
  const days = Math.ceil(ms / 86400000)
  if (days === 1) return 'Expires today'
  if (days <= 7) return `Expires in ${days} days`
  return null
}

function PromoCard({ promo, onBook }: { promo: PromotionData; onBook: (service: string) => void }) {
  const tag = TAG_CONFIG[promo.tag]
  const deadline = expiresIn(promo.expiresAt)
  const isBookingLink = !!promo.ctaUrl?.startsWith('booking:')
  const ctaHref = promo.ctaUrl || `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I'm interested in: ${promo.title}`)}`
  const isExternal = !isBookingLink && ctaHref.startsWith('http')

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col group relative"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        {promo.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${promo.imageUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${tag.color}28 0%, #080808 100%)` }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.9) 100%)' }} />

        {/* Top row: tag + deadline */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[9px] font-body font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{ backgroundColor: tag.color, color: '#fff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDuration: '1.8s' }} />
            {tag.label}
          </span>
          {deadline && (
            <span
              className="text-[9px] font-body font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              {deadline}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="font-display font-black text-white leading-tight mb-2"
          style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', letterSpacing: '-0.025em' }}
        >
          {promo.title}
        </h3>
        {promo.subtitle && (
          <p className="text-white/50 font-body text-sm leading-relaxed mb-4 flex-1">
            {promo.subtitle}
          </p>
        )}

        <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {isBookingLink ? (
            <button
              onClick={() => onBook(promo.ctaUrl!.slice('booking:'.length))}
              className="inline-flex items-center gap-2 font-body font-black text-[11px] uppercase tracking-[0.14em] px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: tag.color, color: '#fff' }}
            >
              {promo.ctaLabel || 'Book Now'}
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </button>
          ) : (
            <a
              href={ctaHref}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 font-body font-black text-[11px] uppercase tracking-[0.14em] px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: tag.color, color: '#fff' }}
            >
              {promo.ctaLabel || 'Enquire on WhatsApp'}
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${tag.bg} 0%, transparent 60%)` }}
      />
    </div>
  )
}

export default function PromotionsPage() {
  const navigate = useNavigate()
  const promotions = usePromotions()
  const [bookService, setBookService] = useState<string | null>(null)
  const waBase = `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to know about CabHouse's current offers")}`

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* Page header */}
      <section className="relative overflow-hidden" style={{ paddingTop: 120, paddingBottom: 64 }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,135,58,0.08) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-widest mb-8 transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          <p className="font-body text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: '#C8873A' }}>
            CabHouse Agencies
          </p>
          <h1
            className="font-display font-black text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            Offers & Promotions
          </h1>
          <p className="text-white/45 font-body text-base leading-relaxed max-w-lg">
            Current deals, packages, and events at CabHouse Park. Every offer links directly to our team on WhatsApp for instant booking.
          </p>
        </div>
      </section>

      {/* Promotions grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
        {promotions.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <p className="font-display font-black text-white/30 text-xl mb-2">No active promotions</p>
            <p className="text-white/20 font-body text-sm mb-8">Check back soon — new offers are added regularly.</p>
            <a
              href={waBase}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body font-black text-[11px] uppercase tracking-[0.14em] px-6 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ backgroundColor: '#C8873A', color: '#fff' }}
            >
              Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map(p => <PromoCard key={p.id} promo={p} onBook={setBookService} />)}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      {promotions.length > 0 && (
        <section
          className="mx-5 md:mx-8 mb-16 max-w-7xl xl:mx-auto rounded-3xl px-8 md:px-14 py-12 relative overflow-hidden"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(200,135,58,0.07) 0%, transparent 60%)' }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-body text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: '#C8873A' }}>
                Not seeing what you need?
              </p>
              <h2
                className="font-display font-black text-white"
                style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', letterSpacing: '-0.03em' }}
              >
                Talk to us on WhatsApp
              </h2>
              <p className="text-white/40 font-body text-sm mt-2">
                Custom packages available. Our team responds within minutes.
              </p>
            </div>
            <a
              href={waBase}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-3 font-body font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all hover:brightness-110 hover:shadow-2xl"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Book on WhatsApp
            </a>
          </div>
        </section>
      )}

      <Footer />
      <FloatingWhatsApp />
      {bookService && (
        <BookingModal defaultService={bookService} onClose={() => setBookService(null)} />
      )}
    </div>
  )
}
