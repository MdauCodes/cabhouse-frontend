import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Play, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'

const ITEMS: { id: string; type: 'image' | 'video' }[] = [
  { id: 'gallery-v1', type: 'video' },
  { id: 'gallery-1',  type: 'image' },
  { id: 'gallery-v2', type: 'video' },
  { id: 'gallery-v3', type: 'video' },
  { id: 'gallery-2',  type: 'image' },
  { id: 'gallery-v4', type: 'video' },
  { id: 'gallery-v5', type: 'video' },
  { id: 'gallery-3',  type: 'image' },
  { id: 'gallery-v6', type: 'video' },
  { id: 'gallery-v7', type: 'video' },
  { id: 'gallery-v8', type: 'video' },
]

// â”€â”€ Featured video (first item, auto-plays on scroll) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedVideo({
  url, sectionInView, onOpen,
}: { url: string; sectionInView: boolean; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (sectionInView && !started.current && videoRef.current) {
      started.current = true
      videoRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
    if (!sectionInView && videoRef.current && playing) {
      videoRef.current.pause()
      setPlaying(false)
      started.current = false
    }
  }, [sectionInView, playing])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(m => !m)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group flex-shrink-0"
      style={{ width: 'clamp(260px, 38vw, 480px)', height: '100%' }}
      onClick={onOpen}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

      {/* Playing indicator */}
      {playing && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-white font-body text-[9px] uppercase tracking-widest font-bold">Live</span>
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
      >
        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
      </button>

      {/* Expand hint */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/60 backdrop-blur-sm text-white font-body text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Play size={9} className="fill-white" />
          Full screen
        </div>
      </div>

      {/* Featured label */}
      <div className="absolute bottom-3 left-3 text-white/40 font-body text-[9px] uppercase tracking-widest">
        Featured
      </div>
    </div>
  )
}

// â”€â”€ Strip tile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function VideoTile({ url, idx, onOpen }: { url: string; idx: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView(0.05)
  const [playing, setPlaying] = useState(false)

  const enter = () => {
    videoRef.current?.play().then(() => setPlaying(true)).catch(() => {})
  }
  const leave = () => {
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0; setPlaying(false) }
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex-shrink-0 relative overflow-hidden rounded-xl cursor-pointer group h-full"
      style={{
        width: 130,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(8px)',
        transition: `opacity 0.45s ease ${(idx + 1) * 0.04}s, transform 0.45s ease ${(idx + 1) * 0.04}s`,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onOpen}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        muted loop playsInline preload="metadata"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors duration-300" />

      {/* Reel badge top-left */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
        {playing ? (
          <span className="flex items-end gap-px h-2.5">
            <span className="w-0.5 rounded-sm bg-brand-gold" style={{ height: '40%', animation: 'barA 0.7s ease-in-out infinite alternate' }} />
            <span className="w-0.5 rounded-sm bg-brand-gold" style={{ height: '100%', animation: 'barB 0.7s ease-in-out infinite alternate 0.15s' }} />
            <span className="w-0.5 rounded-sm bg-brand-gold" style={{ height: '60%', animation: 'barA 0.7s ease-in-out infinite alternate 0.3s' }} />
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
        )}
        <span className="text-white text-[7px] font-body font-bold tracking-widest uppercase">Reel</span>
      </div>

      {/* Centre play button — only when not playing */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-gold/80 group-hover:scale-110 transition-all duration-300">
            <Play size={12} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}

function ImageTile({ url, idx, onOpen }: { url: string; idx: number; onOpen: () => void }) {
  const { ref, inView } = useInView(0.05)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex-shrink-0 relative overflow-hidden rounded-xl cursor-pointer group h-full"
      style={{
        width: 120,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(8px)',
        transition: `opacity 0.45s ease ${(idx + 1) * 0.04}s, transform 0.45s ease ${(idx + 1) * 0.04}s`,
      }}
      onClick={onOpen}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${url})` }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
    </div>
  )
}

function StripTile({ item, idx, onOpen }: { item: typeof ITEMS[0]; idx: number; onOpen: () => void }) {
  const url = useMediaUrl(item.id)
  if (!url) return (
    <div
      className="flex-shrink-0 rounded-xl bg-white/[0.04] h-full"
      style={{ width: item.type === 'video' ? 150 : 120 }}
    />
  )
  return item.type === 'video'
    ? <VideoTile url={url} idx={idx} onOpen={onOpen} />
    : <ImageTile url={url} idx={idx} onOpen={onOpen} />
}

// â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Lightbox({ items, startIdx, onClose }: { items: typeof ITEMS; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx)
  const item = items[idx]
  const url = useMediaUrl(item.id)
  const videoRef = useRef<HTMLVideoElement>(null)

  const prev = useCallback(() => setIdx(i => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setIdx(i => (i + 1) % items.length), [items.length])

  useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [idx, item.type])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  return (
    <div className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center" onClick={onClose}>
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={onClose} aria-label="Close"
      >
        <X size={18} />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 font-body text-xs tabular-nums">
        {idx + 1} / {items.length}
      </div>
      <button
        className="absolute left-2 lg:left-8 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </button>
      <div
        className="max-w-5xl w-full max-h-[88vh] px-12 lg:px-16 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video ref={videoRef} key={item.id} src={url} controls autoPlay
            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl w-full" style={{ background: '#000' }} />
        ) : (
          <img key={item.id} src={url} alt="" className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" />
        )}
      </div>
      <button
        className="absolute right-2 lg:right-8 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={e => { e.stopPropagation(); next() }} aria-label="Next"
      >
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={e => { e.stopPropagation(); setIdx(i) }}
            className={`rounded transition-all duration-200 flex-shrink-0 ${
              i === idx ? 'w-6 h-1.5 bg-brand-gold' : 'w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STRIP_ITEMS = ITEMS.slice(1) // everything after the featured first video
const FEATURED = ITEMS[0]

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const { ref: headerRef, inView: headerInView } = useInView(0.1)
  const { ref: sectionRef, inView: sectionInView } = useInView(0.15)
  const stripRef = useRef<HTMLDivElement>(null)
  const featuredUrl = useMediaUrl(FEATURED.id)

  const scroll = (dir: 'l' | 'r') => {
    stripRef.current?.scrollBy({ left: dir === 'r' ? 260 : -260, behavior: 'smooth' })
  }

  // Filmstrip height "” comfortable on all screens
  // const stripH = 'clamp(160px, 28vw, 320px)'

  return (
    <section id="gallery" style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="bg-brand-dark rounded-3xl overflow-hidden">

      {/* Header */}
      <div className="px-6 lg:px-10 pt-8 lg:pt-10 pb-5">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="max-w-7xl mx-auto flex items-end justify-between gap-4"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.28em] font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
              Reels &amp; Moments
            </p>
            <h2
              className="font-display font-black text-white leading-[0.93]"
              style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
            >
              Live from <em className="not-italic" style={{ color: 'var(--color-gold)' }}>CabHouse Park</em>
            </h2>
            <p className="text-white/25 font-body text-[10px] mt-1.5">
              Hover to preview · tap to watch full screen
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => scroll('l')}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => scroll('r')}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile layout: featured full-width, then 2-col grid */}
      <div className=”lg:hidden px-4 pb-6 flex flex-col gap-2”>
        {featuredUrl && (
          <div style={{ height: 'clamp(220px, 56vw, 360px)' }}>
            <FeaturedVideo url={featuredUrl} sectionInView={sectionInView} onOpen={() => setLightboxIdx(0)} />
          </div>
        )}
        <div className=”grid grid-cols-2 gap-2”>
          {STRIP_ITEMS.map((item, i) => (
            <div key={item.id} style={{ height: 'clamp(140px, 38vw, 240px)' }}>
              <StripTile item={item} idx={i} onOpen={() => setLightboxIdx(i + 1)} />
            </div>
          ))}
        </div>
        <a
          href=”https://www.instagram.com/cabhouse.park”
          target=”_blank” rel=”noopener noreferrer”
          className=”mt-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all duration-200 font-body text-xs font-semibold tracking-wide”
        >
          <svg viewBox=”0 0 24 24” fill=”currentColor” className=”w-4 h-4”><path d=”M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z”/></svg>
          Follow us for more
        </a>
      </div>

      {/* Desktop layout: featured left + filmstrip right */}
      <div className=”hidden lg:flex px-10 pb-10 gap-3”>
        {featuredUrl && (
          <div className=”flex-shrink-0 self-stretch” style={{ width: 'clamp(260px, 38vw, 480px)', height: 'clamp(320px, 44vw, 560px)' }}>
            <FeaturedVideo url={featuredUrl} sectionInView={sectionInView} onOpen={() => setLightboxIdx(0)} />
          </div>
        )}
        <div className=”flex-1 min-w-0 flex flex-col gap-3”>
          <div
            ref={stripRef}
            className=”flex gap-2 overflow-x-auto flex-1”
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STRIP_ITEMS.map((item, i) => (
              <StripTile key={item.id} item={item} idx={i} onOpen={() => setLightboxIdx(i + 1)} />
            ))}
            <div className=”flex-shrink-0 w-1” />
          </div>
          <a
            href=”https://www.instagram.com/cabhouse.park”
            target=”_blank” rel=”noopener noreferrer”
            className=”flex-shrink-0 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all duration-200 font-body text-xs font-semibold tracking-wide”
          >
            <svg viewBox=”0 0 24 24” fill=”currentColor” className=”w-3.5 h-3.5”><path d=”M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z”/></svg>
            Follow @cabhouse.park for more moments
          </a>
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox items={ITEMS} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
      <style>{`
        @keyframes barA { from { height: 30% } to { height: 100% } }
        @keyframes barB { from { height: 80% } to { height: 20% } }
      `}</style>
    </div>
    </section>
  )
}
