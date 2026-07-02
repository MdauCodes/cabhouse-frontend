import { useState, useRef, useEffect, useCallback } from 'react'
import { VolumeX, Volume2 } from 'lucide-react'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

const REELS: { id: string; label: string; tag: string }[] = [
  { id: 'gallery-v1', label: 'Bridge & Mountain Challenge', tag: 'Adventure' },
  { id: 'gallery-v2', label: 'Sky Bike - Pedal Through the Air', tag: 'Thrills' },
  { id: 'gallery-v3', label: 'Rainbow Slides - Unlimited Rides', tag: 'Fun' },
  { id: 'gallery-v4', label: 'Go-Karts - Race the Track', tag: 'Speed' },
  { id: 'gallery-v5', label: 'Group Fun at CabHouse Park', tag: 'Groups' },
  { id: 'gallery-v6', label: 'Zipline - Soar 100m Above Kisii', tag: 'Extreme' },
  { id: 'gallery-v7', label: 'A Day at the Swimming Pool', tag: 'Family' },
  { id: 'gallery-v8', label: 'Camp Life Under the Stars', tag: 'Stays' },
]

const WA_URL = `https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(
  "Hi CabHouse! I just watched your reels and I want to book a visit. When can I come?"
)}`
const IG_URL = 'https://www.instagram.com/cabhouse.park'

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const IG_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

// ── Individual reel card ─────────────────────────────────────────────────────

function ReelCard({
  reel, idx, total, isActive, onActivate,
}: {
  reel: typeof REELS[0]
  idx: number
  total: number
  isActive: boolean
  onActivate: () => void
}) {
  const url = useMediaUrl(reel.id)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>()

  // Play / pause based on which card is active
  useEffect(() => {
    const v = videoRef.current
    if (!v || !url) return
    if (isActive) {
      v.currentTime = 0
      v.play().catch(() => {})
      const tick = () => {
        if (v.duration) setProgress((v.currentTime / v.duration) * 100)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      v.pause()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setProgress(0)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isActive, url])

  // Detect when this card occupies the snap slot
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.intersectionRatio >= 0.75) onActivate() },
      { threshold: 0.75 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onActivate])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (v) { v.muted = !muted; setMuted(m => !m) }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 w-full bg-black overflow-hidden"
      style={{ scrollSnapAlign: 'start', height: '100%' }}
    >
      {/* Video */}
      {url ? (
        <video
          ref={videoRef}
          src={url}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-dark animate-pulse" />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)' }}
      />

      {/* Top row: live badge + counter */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-gold)', animation: isActive ? 'pulse 2s infinite' : 'none' }}
          />
          <span className="text-white font-body text-[8px] uppercase tracking-widest font-bold">
            {isActive ? 'Playing' : 'Reel'}
          </span>
        </div>
        <span className="text-white/40 font-body text-[9px] tabular-nums">{idx + 1} / {total}</span>
      </div>

      {/* Right-side action rail */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 pointer-events-auto">
        {/* Mute */}
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/75 transition-colors"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* WhatsApp book CTA */}
        <a
          href={WA_URL}
          target="_blank" rel="noopener noreferrer"
          aria-label="Book via WhatsApp"
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'var(--color-gold)' }}
          onClick={e => e.stopPropagation()}
        >
          {WA_ICON}
        </a>

        {/* Instagram follow */}
        <a
          href={IG_URL}
          target="_blank" rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/75 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          {IG_ICON}
        </a>
      </div>

      {/* Bottom: tag + label + progress bar */}
      <div className="absolute bottom-0 left-0 right-4 p-4 pb-5 pointer-events-none">
        <span
          className="inline-block font-body font-bold text-[8px] uppercase tracking-[0.25em] px-2 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: 'rgba(200,135,58,0.25)', color: 'var(--color-gold)' }}
        >
          {reel.tag}
        </span>
        <p className="text-white font-display font-black text-lg leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
          {reel.label}
        </p>
        {/* Progress */}
        <div className="h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--color-gold)',
              transition: progress === 0 ? 'none' : 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      {/* Scroll hint on the first active card */}
      {idx === 0 && isActive && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 opacity-60">
          <span className="text-white font-body text-[9px] uppercase tracking-widest">Scroll for more</span>
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white animate-bounce" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ── End card: follow CTA ─────────────────────────────────────────────────────

function EndCard() {
  return (
    <div
      className="relative flex-shrink-0 w-full flex flex-col items-center justify-center bg-brand-dark gap-6 px-8"
      style={{ scrollSnapAlign: 'start', height: '100%' }}
    >
      <div className="absolute inset-0 opacity-8 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, var(--color-gold) 0%, transparent 55%), radial-gradient(circle at 75% 25%, rgba(60,120,60,0.4) 0%, transparent 50%)' }} />
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-gold)' }}>
          You made it to the end
        </p>
        <h3 className="font-display font-black text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '-0.03em' }}>
          Want to live this,<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>not just watch it?</em>
        </h3>
        <p className="text-white/50 font-body text-sm leading-relaxed max-w-[260px]">
          Book your visit in 30 seconds on WhatsApp. We will handle the rest.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          <a
            href={WA_URL}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white font-body font-bold text-sm py-3 rounded-full transition-all hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)' }}
          >
            {WA_ICON}
            Book via WhatsApp
          </a>
          <a
            href={IG_URL}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white/60 font-body text-xs py-2.5 rounded-full border border-white/15 hover:border-white/35 hover:text-white transition-all"
          >
            {IG_ICON}
            Follow @cabhouse.park
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main Gallery component ───────────────────────────────────────────────────

export default function Gallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const { ref: sectionRef, inView: sectionInView } = useInView(0.1)
  const { ref: headerRef, inView: headerInView } = useInView(0.1)

  // Pause everything when section leaves viewport
  const handleActivate = useCallback((idx: number) => {
    if (sectionInView) setActiveIdx(idx)
  }, [sectionInView])

  useEffect(() => {
    if (!sectionInView) setActiveIdx(null)
  }, [sectionInView])

  return (
    <section id="gallery" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: '#1a2e1f' }}
      >
        {/* Compact header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="px-6 lg:px-10 pt-7 pb-4 flex items-end justify-between"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? 'none' : 'translateY(10px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-1" style={{ color: 'var(--color-gold)' }}>
              Reels &amp; Moments
            </p>
            <h2 className="font-display font-black text-white leading-none" style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
              Live from <em className="not-italic" style={{ color: 'var(--color-gold)' }}>CabHouse Park</em>
            </h2>
          </div>
          <p className="text-white/25 font-body text-[10px] pb-1 hidden sm:block">
            Scroll through to explore
          </p>
        </div>

        {/* The reel feed */}
        {/* Desktop: phone-frame centered; Mobile: full width */}
        <div className="pb-6 px-4 lg:px-10">
          <div className="mx-auto" style={{ maxWidth: 'min(100%, 400px)' }}>
            <div
              className="overflow-y-scroll rounded-2xl"
              style={{
                height: 'clamp(480px, 82dvh, 720px)',
                scrollSnapType: 'y mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {REELS.map((reel, idx) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  idx={idx}
                  total={REELS.length}
                  isActive={activeIdx === idx}
                  onActivate={() => handleActivate(idx)}
                />
              ))}
              <EndCard />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #gallery ::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </section>
  )
}
