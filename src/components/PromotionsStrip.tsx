import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromotions, type PromotionTag } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; color: string; bg: string; shimmer: string }> = {
  DEAL:       { label: 'Deal',        color: '#F59E0B', bg: 'rgba(245,158,11,0.18)',  shimmer: 'rgba(245,158,11,0.08)'  },
  DISCOUNT:   { label: 'Discount',    color: '#EF4444', bg: 'rgba(239,68,68,0.18)',   shimmer: 'rgba(239,68,68,0.08)'   },
  NEW:        { label: 'New',         color: '#38BDF8', bg: 'rgba(56,189,248,0.18)',  shimmer: 'rgba(56,189,248,0.08)'  },
  EXPERIENCE: { label: 'Experience',  color: '#A78BFA', bg: 'rgba(167,139,250,0.18)', shimmer: 'rgba(167,139,250,0.08)' },
  EVENT:      { label: 'Event',       color: '#34D399', bg: 'rgba(52,211,153,0.18)',  shimmer: 'rgba(52,211,153,0.08)'  },
  SEASONAL:   { label: 'Seasonal',    color: '#FB923C', bg: 'rgba(251,146,60,0.18)',  shimmer: 'rgba(251,146,60,0.08)'  },
}

// Decorative sparkle marks — scale/position vary per instance
const SPARKLES = [
  { x: '88%', y: '18%', size: 10, opacity: 0.55, delay: '0s'    },
  { x: '93%', y: '68%', size: 7,  opacity: 0.38, delay: '0.6s'  },
  { x: '96%', y: '38%', size: 5,  opacity: 0.28, delay: '1.1s'  },
  { x: '82%', y: '80%', size: 8,  opacity: 0.22, delay: '0.3s'  },
]

function Sparkle({ x, y, size, opacity, delay, color }: { x: string; y: string; size: number; opacity: number; delay: string; color: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        pointerEvents: 'none',
        animation: `promo-twinkle 2.8s ease-in-out infinite`,
        animationDelay: delay,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 4-point star */}
      <path
        d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z"
        fill={color}
      />
    </svg>
  )
}

const wa = SITE.contact.whatsapp.replace('+', '')

export default function PromotionsStrip() {
  const promotions = usePromotions()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [vis, setVis] = useState(true)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 1000)
    return () => clearTimeout(t)
  }, [])

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
        @keyframes promo-twinkle {
          0%, 100% { opacity: var(--sp-op, 0.4); transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          50%       { opacity: calc(var(--sp-op, 0.4) * 0.3); transform: translate(-50%,-50%) scale(0.7) rotate(20deg); }
        }
        @keyframes promo-shimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(500%) skewX(-15deg); }
        }
      `}</style>

      <div
        style={{
          background: 'var(--canvas)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
        className="px-3 md:px-5 pt-3"
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden cursor-pointer group relative"
          style={{
            background: '#0d0d0d',
            border: `1px solid ${tag.shimmer}`,
            minHeight: 96,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 2px 20px ${tag.shimmer}`,
          }}
          onClick={() => navigate('/promotions')}
          role="banner"
          aria-label={`Promotion: ${promo.title}`}
        >
          {/* ── Image panel (left, desktop) / background (mobile) ── */}
          {hasImage && (
            <>
              {/* Desktop: left panel — ~34% width, fades right */}
              <div
                className="absolute hidden md:block top-0 left-0 bottom-0"
                style={{
                  width: '34%',
                  backgroundImage: `url(${promo.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: vis ? 1 : 0,
                  transition: 'opacity 0.28s ease',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 25%, #0d0d0d 92%)' }} />
                <div className="absolute inset-0" style={{ background: tag.bg, mixBlendMode: 'multiply' }} />
              </div>

              {/* Mobile: full-width background, muted */}
              <div
                className="absolute md:hidden inset-0"
                style={{
                  backgroundImage: `url(${promo.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: vis ? 0.2 : 0,
                  transition: 'opacity 0.28s ease',
                }}
              />
            </>
          )}

          {/* Accent left border — thicker, glowing */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-l-2xl"
            style={{
              width: 3,
              background: `linear-gradient(to bottom, transparent 0%, ${tag.color} 30%, ${tag.color} 70%, transparent 100%)`,
              boxShadow: `2px 0 12px ${tag.bg}`,
            }}
          />

          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${tag.color}60, transparent)` }} />

          {/* Ambient glow — desktop */}
          <div
            className="absolute hidden md:block inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 75% 50%, ${tag.bg} 0%, transparent 50%)` }}
          />
          {/* Ambient glow — mobile */}
          <div
            className="absolute md:hidden inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 5% 50%, ${tag.bg} 0%, transparent 60%)` }}
          />

          {/* Ribbon corner badge (top-right) */}
          <div
            className="absolute top-0 right-0 hidden md:block pointer-events-none overflow-hidden"
            style={{ width: 64, height: 64 }}
          >
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: -18,
                width: 72,
                transform: 'rotate(45deg)',
                background: `linear-gradient(135deg, ${tag.color}cc, ${tag.color}88)`,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 7, letterSpacing: '0.12em', color: '#fff', fontWeight: 900, textTransform: 'uppercase', transform: 'rotate(0deg)' }}>
                Offer
              </span>
            </div>
          </div>

          {/* Sparkle decorations (desktop) */}
          <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden>
            {SPARKLES.map((s, i) => (
              <Sparkle key={i} {...s} color={tag.color} />
            ))}
          </div>

          {/* Hover shimmer sweep */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '30%',
                background: `linear-gradient(to right, transparent, ${tag.color}12, transparent)`,
                animation: 'promo-shimmer 1.4s ease forwards',
              }}
            />
          </div>

          {/* ── Content row ── */}
          <div
            className="relative flex items-center gap-3 pl-5 pr-4 md:pr-5 h-full"
            style={{
              minHeight: 96,
              opacity: vis ? 1 : 0,
              transition: 'opacity 0.26s ease',
            }}
          >
            {/* Desktop: spacer that clears the image panel */}
            {hasImage && <div className="hidden md:block shrink-0" style={{ width: '30%' }} />}

            {/* Tag chip */}
            <span
              className="shrink-0 inline-flex items-center gap-1.5 text-[9px] font-body font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${tag.color}, ${tag.color}bb)`,
                color: '#fff',
                boxShadow: `0 0 8px ${tag.bg}`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDuration: '1.8s' }} />
              {tag.label}
            </span>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-black text-white leading-tight truncate group-hover:text-white/90 transition-colors"
                style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', letterSpacing: '-0.02em' }}
              >
                {promo.title}
              </p>
              {promo.subtitle && (
                <p className="text-white/40 font-body text-xs leading-tight truncate mt-0.5 hidden sm:block">
                  {promo.subtitle}
                </p>
              )}
            </div>

            {/* Right controls */}
            <div className="shrink-0 flex items-center gap-3">
              {count > 1 && (
                <div className="hidden sm:flex gap-1.5 items-center">
                  {promotions.map((_, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); goTo(i) }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === active ? 18 : 5,
                        height: 5,
                        background: i === active
                          ? `linear-gradient(to right, ${tag.color}, ${tag.color}bb)`
                          : 'rgba(255,255,255,0.15)',
                        boxShadow: i === active ? `0 0 6px ${tag.bg}` : 'none',
                      }}
                      aria-label={`Go to promotion ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <a
                href={promo.ctaUrl || waFallback}
                onClick={handleCta}
                className="shrink-0 inline-flex items-center gap-2 font-body font-black text-[10px] uppercase tracking-[0.14em] px-4 py-2 rounded-xl transition-all duration-200 hover:brightness-110 whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, ${tag.color}, ${tag.color}cc)`,
                  color: '#fff',
                  boxShadow: `0 2px 12px ${tag.bg}`,
                }}
              >
                {promo.ctaLabel || 'See Offer'}
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </a>

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
    </>
  )
}
