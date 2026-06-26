import { useState, useEffect, useCallback, useRef } from 'react'
import { SITE } from '../config/site'

const SLIDES = [
  { img: '/assets/hero-5.webp' },
  { img: '/assets/hero-4.webp' },
  { img: '/assets/hero-7.png' },
  { img: '/assets/hero-8.png' },
  { img: '/assets/hero-6.png' },
  { img: '/assets/hero-10.png' },
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
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
    <div className="relative overflow-hidden rounded-3xl" style={{ height: '70dvh', minHeight: 480, maxHeight: 760 }}>

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
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 max-w-2xl">

        {/* Heading */}
        <h1
          className="font-display font-black text-white leading-[1.0] mb-1.5"
          style={{ fontSize: 'var(--type-hero)', letterSpacing: '-0.03em' }}
        >
          Your Best Day Out
        </h1>
        <h1
          className="font-display font-black leading-[1.0] mb-3"
          style={{
            fontSize: 'var(--type-h1)',
            letterSpacing: '-0.03em',
            color: 'var(--color-gold)',
            minHeight: '1.05em',
          }}
        >
          {typed}
          <span
            className="inline-block w-[3px] rounded-sm align-middle ml-1"
            style={{
              height: '0.8em',
              backgroundColor: 'var(--color-gold)',
              animation: 'blink 0.75s step-end infinite',
            }}
          />
        </h1>

        {/* Tagline */}
        <p className="font-body text-white/50 text-sm leading-relaxed mb-5">
          Unleash Your Energy, Nourish Your Soul.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-5 mb-6">
          <div>
            <p className="font-display font-black text-white text-xl leading-none">8+</p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">Activities</p>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div>
            <p className="font-display font-black text-white text-xl leading-none">4.7<span style={{ color: 'var(--color-gold)' }}>★</span></p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">Google Rating</p>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div>
            <p className="font-display font-black text-white text-xl leading-none">Daily</p>
            <p className="text-white/40 font-body text-[9px] uppercase tracking-widest font-semibold mt-0.5">8 AM – 8 PM</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}
          >
            Book a Visit
          </a>
          <a
            href="#packages"
            className="font-body font-semibold text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            See Packages
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
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

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
    </section>
  )
}
