import { useState, useEffect, useCallback } from 'react'
import { usePromotions, type PromotionTag } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; color: string; glow: string }> = {
  DEAL:       { label: 'Deal',        color: '#F59E0B', glow: 'rgba(245,158,11,0.18)' },
  DISCOUNT:   { label: 'Discount',    color: '#DC2626', glow: 'rgba(220,38,38,0.18)' },
  NEW:        { label: 'New',         color: '#0EA5E9', glow: 'rgba(14,165,233,0.18)' },
  EXPERIENCE: { label: 'Experience',  color: '#A855F7', glow: 'rgba(168,85,247,0.18)' },
  EVENT:      { label: 'Event',       color: '#10B981', glow: 'rgba(16,185,129,0.18)' },
  SEASONAL:   { label: 'Seasonal',    color: '#EA580C', glow: 'rgba(234,88,12,0.18)' },
}

export default function PromotionsStrip() {
  const promotions = usePromotions()
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  const count = promotions.length

  const goTo = useCallback((idx: number) => {
    if (idx === active || animating) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setActive(idx)
      setVisible(true)
      setAnimating(false)
    }, 280)
  }, [active, animating])

  const next = useCallback(() => {
    goTo((active + 1) % count)
  }, [active, count, goTo])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [count, next])

  if (count === 0) return null

  const promo = promotions[active]
  const tag = TAG_CONFIG[promo.tag]
  const wa = SITE.contact.whatsapp.replace('+', '')
  const ctaUrl = promo.ctaUrl || `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I saw your promotion: ${promo.title}`)}`

  return (
    <div style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative"
        style={{ backgroundColor: '#1a0f0f' }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ backgroundColor: tag.color }}
        />

        {/* Background glow spot */}
        <div
          className="absolute top-0 left-0 w-72 h-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 0% 50%, ${tag.glow} 0%, transparent 70%)`,
            transition: 'background 0.4s ease',
          }}
        />

        {/* Optional hero image (right side) */}
        {promo.imageUrl && (
          <div
            className="absolute right-0 top-0 bottom-0 w-48 lg:w-64 pointer-events-none"
            style={{
              backgroundImage: `url(${promo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
            }}
          />
        )}

        <div
          className="relative z-10 px-7 lg:px-10 py-6 lg:py-7 flex flex-col sm:flex-row sm:items-center gap-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
          }}
        >
          {/* Left: badge + text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2.5">
              <span
                className="inline-flex items-center gap-1.5 text-[9px] font-body font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: tag.color, color: '#fff' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
                  style={{ animationDuration: '1.8s' }}
                />
                {tag.label}
              </span>
              {count > 1 && (
                <span className="text-white/20 font-body text-[10px]">
                  {active + 1} / {count}
                </span>
              )}
            </div>

            <h3
              className="font-display font-black text-white leading-[1.05] mb-1.5"
              style={{
                fontSize: 'clamp(1.05rem, 2.2vw, 1.55rem)',
                letterSpacing: '-0.02em',
                textShadow: `0 0 40px ${tag.glow}`,
              }}
            >
              {promo.title}
            </h3>

            {promo.subtitle && (
              <p className="text-white/55 font-body text-sm leading-relaxed max-w-xl">
                {promo.subtitle}
              </p>
            )}
          </div>

          {/* Right: CTA + dots */}
          <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
            <a
              href={ctaUrl}
              target={ctaUrl.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-200 hover:brightness-110 hover:shadow-lg whitespace-nowrap"
              style={{ backgroundColor: tag.color, color: '#fff', boxShadow: `0 4px 18px ${tag.glow}` }}
            >
              {promo.ctaLabel || 'Find Out More'}
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </a>

            {count > 1 && (
              <div className="flex items-center gap-1.5">
                {promotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === active ? 18 : 6,
                      height: 6,
                      backgroundColor: i === active ? tag.color : 'rgba(255,255,255,0.2)',
                    }}
                    aria-label={`Go to promotion ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
