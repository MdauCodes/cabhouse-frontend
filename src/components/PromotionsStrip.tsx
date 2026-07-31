import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromotions, type PromotionTag } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; accent: string; glow: string; dark: string }> = {
  DEAL:       { label: 'Deal',       accent: '#F59E0B', glow: 'rgba(245,158,11,0.4)',  dark: '#92400e' },
  DISCOUNT:   { label: 'Discount',   accent: '#EF4444', glow: 'rgba(239,68,68,0.4)',   dark: '#991b1b' },
  NEW:        { label: 'New',        accent: '#38BDF8', glow: 'rgba(56,189,248,0.4)',  dark: '#075985' },
  EXPERIENCE: { label: 'Experience', accent: '#A78BFA', glow: 'rgba(167,139,250,0.4)', dark: '#5b21b6' },
  EVENT:      { label: 'Event',      accent: '#34D399', glow: 'rgba(52,211,153,0.4)',  dark: '#065f46' },
  SEASONAL:   { label: 'Seasonal',   accent: '#FB923C', glow: 'rgba(251,146,60,0.4)',  dark: '#9a3412' },
}

const wa = SITE.contact.whatsapp.replace('+', '')

export default function PromotionsStrip() {
  const promotions = usePromotions()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [vis, setVis] = useState(true)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 400)
    return () => clearTimeout(t)
  }, [])

  const count = promotions.length

  const goTo = useCallback((idx: number) => {
    if (idx === active) return
    setVis(false)
    setTimeout(() => { setActive(idx); setVis(true) }, 220)
  }, [active])

  const next = useCallback(() => goTo((active + 1) % count), [active, count, goTo])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(next, 7000)
    return () => clearInterval(id)
  }, [count, next])

  if (count === 0) return null

  const promo = promotions[active]
  const tag = TAG_CONFIG[promo.tag]
  const waFallback = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I saw your promotion: ${promo.title}`)}`

  function handleCta(e: React.MouseEvent) {
    e.stopPropagation()
    if (promo.ctaUrl) window.open(promo.ctaUrl, '_blank', 'noopener,noreferrer')
    else navigate('/promotions')
  }

  return (
    <>
      <style>{`
        @keyframes promo-enter {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes promo-flash {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes promo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes promo-shine {
          0%   { left: -80%; }
          100% { left: 130%; }
        }
        @keyframes promo-badge-pop {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50%       { transform: scale(1.06) rotate(-2deg); }
        }
        .promo-badge-pop { animation: promo-badge-pop 2s ease-in-out infinite; }
        .promo-flash      { animation: promo-flash 1.4s ease-in-out infinite; }
      `}</style>

      <div
        className="px-3 md:px-5 pt-3"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          animation: entered ? undefined : 'promo-enter 0.5s ease forwards',
        }}
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative cursor-pointer group"
          style={{
            background: `linear-gradient(135deg, #050f05 0%, #091409 50%, #050f05 100%)`,
            border: `1px solid ${tag.accent}25`,
            boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 8px 48px rgba(0,0,0,0.6), 0 0 80px ${tag.glow}`,
            minHeight: 148,
          }}
          onClick={() => navigate('/promotions')}
          role="banner"
          aria-label={`Promotion: ${promo.title}`}
        >
          {/* ── Diagonal stripe texture ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 18px,
              rgba(255,255,255,0.012) 18px,
              rgba(255,255,255,0.012) 19px
            )`,
          }} />

          {/* ── Top accent line ── */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background: `linear-gradient(to right, transparent 5%, ${tag.accent} 30%, ${tag.accent} 70%, transparent 95%)`,
            boxShadow: `0 0 12px 1px ${tag.glow}`,
          }} />

          {/* ── Bottom accent line ── */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{
            background: `linear-gradient(to right, transparent 15%, ${tag.accent}40 50%, transparent 85%)`,
          }} />

          {/* ── Left image trapezoid ── */}
          {promo.imageUrl && (
            <div className="absolute hidden md:block top-0 left-0 bottom-0" style={{
              width: '28%',
              backgroundImage: `url(${promo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)',
              opacity: vis ? 1 : 0,
              transition: 'opacity 0.22s ease',
            }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(5,15,5,0.1) 20%, #050f05 100%)' }} />
              <div className="absolute inset-0" style={{ background: `${tag.accent}15`, mixBlendMode: 'overlay' }} />
            </div>
          )}

          {/* ── Right image trapezoid ── */}
          {promo.imageUrl && (
            <div className="absolute hidden md:block top-0 right-0 bottom-0" style={{
              width: '28%',
              backgroundImage: `url(${promo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
              opacity: vis ? 1 : 0,
              transition: 'opacity 0.22s ease',
            }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(5,15,5,0.1) 20%, #050f05 100%)' }} />
              <div className="absolute inset-0" style={{ background: `${tag.accent}15`, mixBlendMode: 'overlay' }} />
            </div>
          )}

          {/* ── Mobile background image ── */}
          {promo.imageUrl && (
            <div className="absolute md:hidden inset-0" style={{
              backgroundImage: `url(${promo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: vis ? 0.08 : 0,
              transition: 'opacity 0.22s ease',
            }} />
          )}

          {/* ── Center radial glow ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 70% 100% at 50% 50%, ${tag.accent}18 0%, transparent 65%)`,
          }} />

          {/* ── Shine on hover ── */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-0 bottom-0 w-20 opacity-0 group-hover:opacity-100" style={{
              background: `linear-gradient(to right, transparent, ${tag.accent}18, transparent)`,
              animation: 'promo-shine 1s ease forwards',
              animationPlayState: 'paused',
            }} />
          </div>

          {/* ══ MAIN CONTENT ══ */}
          <div
            className="relative flex items-center h-full px-5 md:px-10 gap-4 md:gap-8"
            style={{
              minHeight: 148,
              opacity: vis ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {promo.imageUrl && <div className="hidden md:block shrink-0" style={{ width: '22%' }} />}

            {/* ── Left: label + title + sub ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">

              {/* Tag pill + dots */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]"
                  style={{
                    background: `linear-gradient(135deg, ${tag.accent}28, ${tag.accent}12)`,
                    border: `1px solid ${tag.accent}45`,
                    color: tag.accent,
                  }}
                >
                  <span className="promo-flash w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.accent }} />
                  {tag.label}
                </span>

                {count > 1 && (
                  <div className="flex items-center gap-1.5">
                    {promotions.map((_, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); goTo(i) }}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === active ? 22 : 5, height: 5,
                          background: i === active
                            ? `linear-gradient(to right, ${tag.accent}, ${tag.accent}bb)`
                            : 'rgba(255,255,255,0.12)',
                        }}
                        aria-label={`Promotion ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── BIG TITLE — marketing grade ── */}
              <div>
                <p
                  className="font-display font-black text-white leading-none uppercase"
                  style={{
                    fontSize: 'clamp(1.35rem, 3.5vw, 2rem)',
                    letterSpacing: '-0.03em',
                    textShadow: `0 0 40px ${tag.glow}`,
                  }}
                >
                  {promo.title}
                </p>
                {promo.subtitle && (
                  <p className="text-white/40 font-body text-xs mt-1.5 hidden md:block" style={{ maxWidth: '48ch' }}>
                    {promo.subtitle}
                  </p>
                )}
              </div>

              {/* Mobile subtitle */}
              {promo.subtitle && (
                <p className="text-white/38 font-body text-xs md:hidden leading-relaxed">{promo.subtitle}</p>
              )}
            </div>

            {/* ── Right: CTA stack ── */}
            <div className="shrink-0 flex flex-col items-end gap-3">

              {/* Main CTA button */}
              <a
                href={promo.ctaUrl || waFallback}
                onClick={handleCta}
                className="inline-flex items-center gap-2.5 font-body font-black uppercase tracking-[0.12em] px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${tag.accent} 0%, ${tag.dark} 100%)`,
                  color: '#fff',
                  fontSize: '0.7rem',
                  boxShadow: `0 4px 24px ${tag.glow}, 0 0 0 1px ${tag.accent}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                {promo.ctaLabel || 'Claim Offer'}
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </a>

              {/* Ghost "all offers" */}
              <button
                onClick={e => { e.stopPropagation(); navigate('/promotions') }}
                className="hidden md:flex items-center gap-1 font-body text-[9px] uppercase tracking-widest transition-colors"
                style={{ color: 'rgba(255,255,255,0.18)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
              >
                All offers
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </button>
            </div>

            {promo.imageUrl && <div className="hidden md:block shrink-0" style={{ width: '22%' }} />}
          </div>

          {/* ── Scrolling ticker at bottom (desktop) ── */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 26, borderTop: `1px solid ${tag.accent}18` }}>
            <div
              className="flex items-center whitespace-nowrap h-full"
              style={{ animation: 'promo-scroll 18s linear infinite', width: 'max-content' }}
            >
              {[...Array(6)].map((_, i) => (
                <span key={i} className="inline-flex items-center gap-4 px-6 font-body text-[9px] uppercase tracking-[0.25em]" style={{ color: `${tag.accent}60` }}>
                  <span>{promo.title}</span>
                  <span style={{ color: `${tag.accent}35` }}>◆</span>
                  <span>{promo.ctaLabel || 'Limited time'}</span>
                  <span style={{ color: `${tag.accent}35` }}>◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
