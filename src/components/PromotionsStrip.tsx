import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromotions, type PromotionTag } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; color: string; bg: string; glow: string }> = {
  DEAL:       { label: 'Deal',        color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  glow: 'rgba(245,158,11,0.35)'  },
  DISCOUNT:   { label: 'Discount',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   glow: 'rgba(239,68,68,0.35)'   },
  NEW:        { label: 'New',         color: '#38BDF8', bg: 'rgba(56,189,248,0.15)',  glow: 'rgba(56,189,248,0.35)'  },
  EXPERIENCE: { label: 'Experience',  color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', glow: 'rgba(167,139,250,0.35)' },
  EVENT:      { label: 'Event',       color: '#34D399', bg: 'rgba(52,211,153,0.15)',  glow: 'rgba(52,211,153,0.35)'  },
  SEASONAL:   { label: 'Seasonal',    color: '#FB923C', bg: 'rgba(251,146,60,0.15)',  glow: 'rgba(251,146,60,0.35)'  },
}

const wa = SITE.contact.whatsapp.replace('+', '')

export default function PromotionsStrip() {
  const promotions = usePromotions()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [vis, setVis] = useState(true)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 800)
    return () => clearTimeout(t)
  }, [])

  const count = promotions.length

  const goTo = useCallback((idx: number) => {
    if (idx === active) return
    setVis(false)
    setTimeout(() => { setActive(idx); setVis(true) }, 240)
  }, [active])

  const next = useCallback(() => goTo((active + 1) % count), [active, count, goTo])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [count, next])

  if (count === 0) return null

  const promo = promotions[active]
  const tag = TAG_CONFIG[promo.tag]
  const waFallback = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I saw your promotion: ${promo.title}`)}`
  const hasImage = !!promo.imageUrl

  function handleCta(e: React.MouseEvent) {
    e.stopPropagation()
    if (promo.ctaUrl) window.open(promo.ctaUrl, '_blank', 'noopener,noreferrer')
    else navigate('/promotions')
  }

  return (
    <>
      <style>{`
        @keyframes promo-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes promo-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 var(--promo-glow); }
          50% { box-shadow: 0 0 0 4px transparent; }
        }
        @keyframes promo-sweep {
          0%   { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateX(400%) skewX(-12deg); opacity: 0; }
        }
        .promo-tag-ring {
          animation: promo-pulse-ring 2.4s ease-in-out infinite;
        }
      `}</style>

      <div
        className="px-3 md:px-5 pt-3"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden cursor-pointer group relative"
          style={{
            background: 'linear-gradient(135deg, #0e0e0e 0%, #141414 100%)',
            border: `1px solid rgba(255,255,255,0.07)`,
            minHeight: 112,
            boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.3)`,
          }}
          onClick={() => navigate('/promotions')}
          role="banner"
          aria-label={`Promotion: ${promo.title}`}
        >
          {/* ── Left trapezoid image ── */}
          {hasImage && (
            <div
              className="absolute hidden md:block top-0 left-0 bottom-0"
              style={{
                width: '26%',
                backgroundImage: `url(${promo.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)',
                opacity: vis ? 1 : 0,
                transition: 'opacity 0.24s ease',
              }}
            >
              {/* fade toward center */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 45%, #0e0e0e 100%)' }} />
              {/* color tint */}
              <div className="absolute inset-0" style={{ background: tag.bg, mixBlendMode: 'overlay' }} />
            </div>
          )}

          {/* ── Right trapezoid image ── */}
          {hasImage && (
            <div
              className="absolute hidden md:block top-0 right-0 bottom-0"
              style={{
                width: '26%',
                backgroundImage: `url(${promo.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
                opacity: vis ? 1 : 0,
                transition: 'opacity 0.24s ease',
              }}
            >
              {/* fade toward center */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 45%, #0e0e0e 100%)' }} />
              {/* color tint */}
              <div className="absolute inset-0" style={{ background: tag.bg, mixBlendMode: 'overlay' }} />
            </div>
          )}

          {/* Mobile: full-bg image muted */}
          {hasImage && (
            <div
              className="absolute md:hidden inset-0"
              style={{
                backgroundImage: `url(${promo.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: vis ? 0.12 : 0,
                transition: 'opacity 0.24s ease',
              }}
            />
          )}

          {/* Top hairline accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(to right, transparent 10%, ${tag.color}50 50%, transparent 90%)` }}
          />

          {/* Subtle center glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${tag.bg} 0%, transparent 70%)` }}
          />

          {/* Hover shimmer sweep */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              style={{
                position: 'absolute', top: 0, bottom: 0, width: '25%',
                background: `linear-gradient(to right, transparent, ${tag.color}10, transparent)`,
                animation: 'promo-sweep 1.6s ease forwards',
              }}
            />
          </div>

          {/* ── Content row ── */}
          <div
            className="relative flex items-center h-full gap-4 px-5 md:px-8"
            style={{
              minHeight: 112,
              opacity: vis ? 1 : 0,
              transition: 'opacity 0.22s ease',
            }}
          >
            {/* Spacers that clear the image trapezoids on desktop */}
            {hasImage && <div className="hidden md:block shrink-0" style={{ width: '22%' }} />}

            {/* ── Left content: tag + text ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              {/* Tag pill */}
              <div className="flex items-center gap-2">
                <span
                  className="promo-tag-ring inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.18em]"
                  style={{
                    background: `linear-gradient(135deg, ${tag.color}22, ${tag.color}11)`,
                    border: `1px solid ${tag.color}40`,
                    color: tag.color,
                    '--promo-glow': tag.glow,
                  } as React.CSSProperties}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: tag.color, animationDuration: '1.6s' }}
                  />
                  {tag.label}
                </span>

                {/* Desktop pagination */}
                {count > 1 && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    {promotions.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); goTo(i) }}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === active ? 20 : 5,
                          height: 5,
                          background: i === active
                            ? `linear-gradient(to right, ${tag.color}, ${tag.color}bb)`
                            : 'rgba(255,255,255,0.12)',
                        }}
                        aria-label={`Go to promotion ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <p
                className="font-display font-black text-white leading-tight group-hover:text-white/90 transition-colors"
                style={{ fontSize: 'clamp(0.875rem, 2.2vw, 1.125rem)', letterSpacing: '-0.025em', textWrap: 'balance' } as React.CSSProperties}
              >
                {promo.title}
              </p>

              {/* Subtitle (desktop) */}
              {promo.subtitle && (
                <p
                  className="text-white/38 font-body text-xs leading-relaxed hidden md:block"
                  style={{ maxWidth: '42ch' }}
                >
                  {promo.subtitle}
                </p>
              )}
            </div>

            {/* ── Right controls ── */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              {/* CTA */}
              <a
                href={promo.ctaUrl || waFallback}
                onClick={handleCta}
                className="inline-flex items-center gap-2 font-body font-black text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 hover:brightness-115 hover:scale-[1.02] active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${tag.color}, ${tag.color}cc)`,
                  color: '#fff',
                  boxShadow: `0 2px 16px ${tag.glow}, 0 0 0 1px ${tag.color}22`,
                }}
              >
                {promo.ctaLabel || 'See Offer'}
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </a>

              {/* "All offers" ghost link (desktop) */}
              <button
                onClick={e => { e.stopPropagation(); navigate('/promotions') }}
                className="hidden md:inline-flex items-center gap-1 font-body text-[9px] uppercase tracking-widest transition-colors"
                style={{ color: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
              >
                All offers
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </button>
            </div>

            {/* Spacer for right image on desktop */}
            {hasImage && <div className="hidden md:block shrink-0" style={{ width: '20%' }} />}
          </div>
        </div>
      </div>
    </>
  )
}
