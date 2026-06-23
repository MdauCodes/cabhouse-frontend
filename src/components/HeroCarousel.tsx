import { useState, useEffect, useCallback, useRef } from 'react'
import { SITE } from '../config/site'

const SLIDES = [
  { img: '/assets/park-bridge.jpeg' },
  { img: '/assets/park-pool.jpeg' },
  { img: '/assets/park-adventure.jpeg' },
  { img: '/assets/park-games.jpeg' },
]

const TYPING_LINES = [
  'Starts Here',
  'Awaits in Kisii',
  'Is Unforgettable',
  'Begins at CabHouse',
  'Is One Visit Away',
  'Is Worth Every Minute',
]

const SLIDE_DURATION = 6000

function useTyping(lines: string[]) {
  const [displayed, setDisplayed] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const full = lines[lineIdx]
    if (!isDeleting && displayed === full) {
      const t = setTimeout(() => setIsDeleting(true), 2400)
      return () => clearTimeout(t)
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setLineIdx(i => (i + 1) % lines.length)
      return
    }
    const speed = isDeleting ? 32 : 55
    const t = setTimeout(() => {
      setDisplayed(isDeleting
        ? full.slice(0, displayed.length - 1)
        : full.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [displayed, isDeleting, lineIdx, lines])

  return displayed
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const typed = useTyping(TYPING_LINES)
  const wa = SITE.contact.whatsapp.replace('+', '')

  const goTo = useCallback((idx: number) => {
    setActive(idx)
    setProgress(0)
  }, [])

  // progress bar + auto-advance
  useEffect(() => {
    setProgress(0)
    const step = 100 / (SLIDE_DURATION / 50)
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          goTo((active + 1) % SLIDES.length)
          return 0
        }
        return p + step
      })
    }, 50)
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [active, goTo])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '70dvh', minHeight: 480, maxHeight: 760 }}>

      {/* Slide backgrounds — crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${s.img})`, opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 max-w-3xl">

        {/* Eyebrow */}
        <p className="font-body text-[10px] uppercase tracking-[0.3em] font-bold mb-5" style={{ color: 'var(--color-gold)' }}>
          The Adventure Park · Kisii, Kenya
        </p>

        {/* Heading */}
        <h1
          className="font-display font-black text-white leading-[1.0] mb-2"
          style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}
        >
          Your Best Day Out
        </h1>
        <h1
          className="font-display font-black leading-[1.0] mb-6"
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 4rem)',
            letterSpacing: '-0.03em',
            color: 'var(--color-gold)',
            minHeight: '1.05em',
          }}
        >
          {typed}
          <span
            className="inline-block w-[4px] rounded-sm align-middle ml-1"
            style={{
              height: '0.8em',
              backgroundColor: 'var(--color-gold)',
              animation: 'blink 0.75s step-end infinite',
            }}
          />
        </h1>

        {/* Subtext */}
        <p className="text-white/65 font-body text-sm lg:text-base leading-relaxed mb-8 max-w-md">
          Play, stay, dine and celebrate — everything you need for an unforgettable day is waiting for you in Kisii.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8">
          <div>
            <p className="font-display font-black text-white text-2xl leading-none">8+</p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">Activities</p>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <p className="font-display font-black text-white text-2xl leading-none">4.7<span style={{ color: 'var(--color-gold)' }}>★</span></p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">Google Rating</p>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <p className="font-display font-black text-white text-2xl leading-none">Daily</p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">8 AM – 8 PM</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-body font-bold text-sm px-7 py-3.5 rounded-full uppercase tracking-wide transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)', color: '#111' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
            </svg>
            Book via WhatsApp
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-body font-bold text-sm px-7 py-3.5 rounded-full border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Slide indicator — bottom left */}
      <div className="absolute bottom-8 left-6 lg:left-16 z-10 flex items-center gap-4">
        {/* Progress line */}
        <div className="flex items-center gap-2">
          <div className="relative w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-none"
              style={{ width: `${progress}%`, backgroundColor: 'var(--color-gold)' }}
            />
          </div>
          {/* Dots */}
          <div className="flex gap-1.5 ml-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  backgroundColor: i === active ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
        {/* Counter */}
        <span className="text-white/40 font-body text-[11px] font-semibold tabular-nums">
          {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20 leading-none">
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 48 }}>
          <path d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z" fill="#ffffff" />
        </svg>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  )
}
