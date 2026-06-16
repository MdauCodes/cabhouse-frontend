import { useState, useEffect, useCallback } from 'react'
import { SITE } from '../config/site'
import { useMediaUrl } from '../hooks/useMedia'

export default function Hero() {
  const slide1 = useMediaUrl('hero-1')
  const slide2 = useMediaUrl('hero-2')
  const slide3 = useMediaUrl('hero-3')
  const slide4 = useMediaUrl('hero-4')

  const slides = [slide1, slide2, slide3, slide4].filter(Boolean)
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const advance = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length)
      setTransitioning(false)
    }, 800)
  }, [transitioning, slides.length])

  useEffect(() => {
    const t = setInterval(advance, 6000)
    return () => clearInterval(t)
  }, [advance])

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-brand-dark"
      style={{ height: '85dvh', minHeight: 500, maxHeight: 860 }}
    >
      {/* Background slides */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 900ms ease',
              animation: i === current ? 'kenBurns 14s ease-in-out infinite alternate' : 'none',
            }}
          />
        ))}
      </div>

      {/* Mobile: full-coverage dark overlay */}
      <div className="absolute inset-0 pointer-events-none bg-brand-dark/60 lg:hidden" />

      {/* Desktop: dark left bleed */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, #0D1B12 0%, #0D1B12 36%, rgba(13,27,18,0.9) 46%, rgba(13,27,18,0.5) 57%, rgba(13,27,18,0.1) 72%, transparent 86%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-14 lg:px-20 xl:px-24 w-full lg:w-[62%]" style={{ paddingBottom: 48 }}>

        {/* Headline */}
        <h1
          className="font-display font-black text-white mb-5"
          style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3.2rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          Your Best Day Out<br />
          <em className="not-italic" style={{ color: '#C9A84C' }}>Starts Here</em>
        </h1>

        <p className="text-white/80 font-body text-sm leading-relaxed mb-10 max-w-[30rem]">
          Play, stay, dine and celebrate — everything you need for an unforgettable day is waiting for you in Kisii.
        </p>

        {/* Proof stats */}
        <div className="flex items-center gap-5 mb-10 flex-wrap">
          {[
            { v: '8+', l: 'Activities' },
            { v: '4.7★', l: 'Google Rating' },
            { v: 'Daily', l: '8 AM – 8 PM' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-6">
              <div>
                <p className="text-white font-display font-bold text-xl leading-none">{s.v}</p>
                <p className="text-white/40 text-[10px] font-body uppercase tracking-wide mt-0.5">{s.l}</p>
              </div>
              {i < 2 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gold hover:bg-brand-orange text-white font-body font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-gold/25 uppercase tracking-wide"
          >
            Book via WhatsApp
          </a>
          <a
            href="#contact"
            className="border border-white/30 hover:border-white text-white font-body font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:bg-white/10 uppercase tracking-wide"
          >
            Get in Touch
          </a>
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="flex items-center gap-2 mt-10 pt-6 border-t border-white/8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => !transitioning && setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-5 h-1 bg-brand-gold' : 'w-1 h-1 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
            <span className="text-white/20 text-[9px] font-body ml-1 tracking-widest tabular-nums">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.05) translate(-1%, -0.5%); }
        }
      `}</style>
    </section>
  )
}
