import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromotions, type PromotionTag } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; color: string; bg: string }> = {
  DEAL:       { label: 'Deal',        color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  DISCOUNT:   { label: 'Discount',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)'  },
  NEW:        { label: 'New',         color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' },
  EXPERIENCE: { label: 'Experience',  color: '#A78BFA', bg: 'rgba(167,139,250,0.15)'},
  EVENT:      { label: 'Event',       color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
  SEASONAL:   { label: 'Seasonal',    color: '#FB923C', bg: 'rgba(251,146,60,0.15)' },
}

const wa = SITE.contact.whatsapp.replace('+', '')

export default function PromotionsStrip() {
  const promotions = usePromotions()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [vis, setVis] = useState(true)

  const count = promotions.length

  const goTo = useCallback((idx: number) => {
    if (idx === active) return
    setVis(false)
    setTimeout(() => { setActive(idx); setVis(true) }, 260)
  }, [active])

  const next = useCallback(() => goTo((active + 1) % count), [active, count, goTo])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [count, next])

  if (count === 0) return null

  const promo = promotions[active]
  const tag = TAG_CONFIG[promo.tag]

  function handleCta(e: React.MouseEvent) {
    e.preventDefault()
    if (promo.ctaUrl) {
      window.open(promo.ctaUrl, '_blank', 'noopener,noreferrer')
    } else {
      navigate('/promotions')
    }
  }

  function handleBannerClick() {
    navigate('/promotions')
  }

  const waFallback = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I saw your promotion: ${promo.title}`)}`

  return (
    <div style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div
        className="max-w-7xl mx-auto rounded-2xl overflow-hidden cursor-pointer group relative"
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.07)',
          minHeight: 0,
        }}
        onClick={handleBannerClick}
        role="banner"
        aria-label={`Promotion: ${promo.title}`}
      >
        {/* Accent left border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: tag.color }}
        />

        {/* Optional background image — very subtle */}
        {promo.imageUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${promo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.06,
            }}
          />
        )}

        {/* Subtle glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${tag.bg} 0%, transparent 55%)` }}
        />

        {/* Content */}
        <div
          className="relative flex items-center gap-3 md:gap-5 pl-5 pr-4 md:pl-7 md:pr-5"
          style={{
            minHeight: 72,
            opacity: vis ? 1 : 0,
            transition: 'opacity 0.26s ease',
          }}
        >
          {/* Tag chip */}
          <span
            className="shrink-0 inline-flex items-center gap-1.5 text-[9px] font-body font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{ backgroundColor: tag.color, color: '#fff' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
              style={{ animationDuration: '1.8s' }}
            />
            {tag.label}
          </span>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="font-display font-black text-white leading-tight truncate group-hover:text-white/90 transition-colors"
              style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1.05rem)', letterSpacing: '-0.02em' }}
            >
              {promo.title}
            </p>
            {promo.subtitle && (
              <p className="text-white/40 font-body text-xs leading-tight truncate mt-0.5 hidden sm:block">
                {promo.subtitle}
              </p>
            )}
          </div>

          {/* Right: CTA + dots */}
          <div className="shrink-0 flex items-center gap-3">
            {count > 1 && (
              <div className="hidden sm:flex gap-1.5 items-center">
                {promotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); goTo(i) }}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === active ? 16 : 5, height: 5, backgroundColor: i === active ? tag.color : 'rgba(255,255,255,0.18)' }}
                    aria-label={`Go to promotion ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <a
              href={promo.ctaUrl || waFallback}
              onClick={handleCta}
              className="shrink-0 inline-flex items-center gap-2 font-body font-black text-[10px] uppercase tracking-[0.14em] px-4 py-2 rounded-xl transition-all duration-200 hover:brightness-110 whitespace-nowrap"
              style={{ backgroundColor: tag.color, color: '#fff' }}
            >
              {promo.ctaLabel || 'See Offer'}
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </a>

            {/* View all → */}
            <button
              onClick={e => { e.stopPropagation(); navigate('/promotions') }}
              className="hidden md:inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-widest transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
            >
              All offers
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
