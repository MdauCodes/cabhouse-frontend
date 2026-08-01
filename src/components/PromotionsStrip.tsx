import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromotions, type PromotionTag, type PromotionData } from '../hooks/usePromotions'
import { SITE } from '../config/site'

const TAG_CONFIG: Record<PromotionTag, { label: string; accent: string; glow: string; dark: string }> = {
  DEAL:       { label: 'Deal',       accent: '#F59E0B', glow: 'rgba(245,158,11,0.4)',  dark: '#92400e' },
  DISCOUNT:   { label: 'Discount',   accent: '#EF4444', glow: 'rgba(239,68,68,0.4)',   dark: '#991b1b' },
  NEW:        { label: 'New',        accent: '#38BDF8', glow: 'rgba(56,189,248,0.4)',  dark: '#075985' },
  EXPERIENCE: { label: 'Experience', accent: '#A78BFA', glow: 'rgba(167,139,250,0.4)', dark: '#5b21b6' },
  EVENT:      { label: 'Event',      accent: '#34D399', glow: 'rgba(52,211,153,0.4)',  dark: '#065f46' },
  SEASONAL:   { label: 'Seasonal',   accent: '#FB923C', glow: 'rgba(251,146,60,0.4)',  dark: '#9a3412' },
}

const FADE_MS = 550
const wa = SITE.contact.whatsapp.replace('+', '')

// ── Single promo layer ───────────────────────────────────────────────────────
function PromoLayer({
  promo, promotions, active, navigate, entering,
}: {
  promo: PromotionData
  promotions: PromotionData[]
  active: number
  navigate: (p: string) => void
  entering: boolean
}) {
  const tag = TAG_CONFIG[promo.tag]
  const count = promotions.length
  const waFallback = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I saw your promotion: ${promo.title}`)}`

  function handleCta(e: React.MouseEvent) {
    e.stopPropagation()
    if (promo.ctaUrl) window.open(promo.ctaUrl, '_blank', 'noopener,noreferrer')
    else navigate('/promotions')
  }

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        opacity: entering ? 1 : 0,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: entering ? 'auto' : 'none',
      }}
    >
      {/* Left trapezoid image */}
      {promo.imageUrl && (
        <div className="absolute hidden md:block top-0 left-0 bottom-0 z-0" style={{
          width: '28%',
          backgroundImage: `url(${promo.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)',
        }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(5,15,5,0.1) 20%, #050f05 100%)' }} />
          <div className="absolute inset-0" style={{ background: `${tag.accent}15`, mixBlendMode: 'overlay' }} />
        </div>
      )}

      {/* Right trapezoid image */}
      {promo.imageUrl && (
        <div className="absolute hidden md:block top-0 right-0 bottom-0 z-0" style={{
          width: '28%',
          backgroundImage: `url(${promo.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
        }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(5,15,5,0.1) 20%, #050f05 100%)' }} />
          <div className="absolute inset-0" style={{ background: `${tag.accent}15`, mixBlendMode: 'overlay' }} />
        </div>
      )}

      {/* Mobile bg image */}
      {promo.imageUrl && (
        <div className="absolute md:hidden inset-0 z-0" style={{
          backgroundImage: `url(${promo.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
        }} />
      )}

      {/* Center glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 70% 100% at 50% 50%, ${tag.accent}18 0%, transparent 65%)`,
      }} />

      {/* Content row */}
      <div className="relative z-10 flex items-center flex-1 px-5 md:px-10 gap-4 md:gap-8">
        {promo.imageUrl && <div className="hidden md:block shrink-0" style={{ width: '22%' }} />}

        {/* Left: tag + title + subtitle */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]"
              style={{
                background: `linear-gradient(135deg, ${tag.accent}28, ${tag.accent}12)`,
                border: `1px solid ${tag.accent}45`,
                color: tag.accent,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: tag.accent, animationDuration: '1.4s' }} />
              {tag.label}
            </span>

            {count > 1 && (
              <div className="flex items-center gap-1.5">
                {promotions.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-500" style={{
                    width: i === active ? 22 : 5, height: 5,
                    background: i === active
                      ? `linear-gradient(to right, ${tag.accent}, ${tag.accent}bb)`
                      : 'rgba(255,255,255,0.12)',
                  }} />
                ))}
              </div>
            )}
          </div>

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

          {promo.subtitle && (
            <p className="text-white/38 font-body text-xs md:hidden leading-relaxed">{promo.subtitle}</p>
          )}
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 flex flex-col items-end gap-3">
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

      {/* Scrolling ticker */}
      <div className="hidden md:block relative z-10 overflow-hidden" style={{ height: 26, borderTop: `1px solid ${tag.accent}18`, flexShrink: 0 }}>
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
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PromotionsStrip() {
  const promotions = usePromotions()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [entered, setEntered] = useState(false)
  const lockRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300)
    return () => clearTimeout(t)
  }, [])

  const count = promotions.length

  const goTo = useCallback((idx: number) => {
    if (idx === active || lockRef.current) return
    lockRef.current = true
    setPrev(active)
    setActive(idx)
    // Clear outgoing layer after fade completes
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setPrev(null)
      lockRef.current = false
    }, FADE_MS + 60)
  }, [active])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % count
        if (!lockRef.current) {
          lockRef.current = true
          setPrev(a)
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => {
            setPrev(null)
            lockRef.current = false
          }, FADE_MS + 60)
        }
        return next
      })
    }, 7000)
    return () => clearInterval(id)
  }, [count])

  if (count === 0) return null

  const promo = promotions[active]
  const tag = TAG_CONFIG[promo.tag]

  return (
    <>
      <style>{`
        @keyframes promo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes promo-enter {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="px-3 md:px-5 pt-3"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative cursor-pointer group"
          style={{
            background: `linear-gradient(135deg, #050f05 0%, #091409 50%, #050f05 100%)`,
            border: `1px solid ${tag.accent}25`,
            boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 8px 48px rgba(0,0,0,0.6), 0 0 80px ${tag.glow}`,
            minHeight: 148,
            transition: `border-color ${FADE_MS}ms ease, box-shadow ${FADE_MS}ms ease`,
          }}
          onClick={() => navigate('/promotions')}
          role="banner"
          aria-label={`Promotion: ${promo.title}`}
        >
          {/* Diagonal stripe texture */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            backgroundImage: `repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 18px,
              rgba(255,255,255,0.012) 18px,
              rgba(255,255,255,0.012) 19px
            )`,
          }} />

          {/* Top accent line — transitions with tag color */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
            background: `linear-gradient(to right, transparent 5%, ${tag.accent} 30%, ${tag.accent} 70%, transparent 95%)`,
            boxShadow: `0 0 12px 1px ${tag.glow}`,
            transition: `background ${FADE_MS}ms ease, box-shadow ${FADE_MS}ms ease`,
          }} />

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{
            background: `linear-gradient(to right, transparent 15%, ${tag.accent}40 50%, transparent 85%)`,
            transition: `background ${FADE_MS}ms ease`,
          }} />

          {/* ── Cross-fade layers — outgoing fades out, incoming fades in ── */}
          <div className="absolute inset-0" style={{ minHeight: 148 }}>
            {/* Outgoing layer */}
            {prev !== null && (
              <PromoLayer
                key={`prev-${prev}`}
                promo={promotions[prev]}
                promotions={promotions}
                active={active}
                navigate={navigate}
                entering={false}
              />
            )}
            {/* Incoming layer */}
            <PromoLayer
              key={`curr-${active}`}
              promo={promotions[active]}
              promotions={promotions}
              active={active}
              navigate={navigate}
              entering
            />
          </div>

          {/* Dot navigation — always on top, interactive */}
          {count > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20 md:hidden">
              {promotions.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); goTo(i) }}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === active ? 20 : 6, height: 6,
                    background: i === active ? tag.accent : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={`Promotion ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
