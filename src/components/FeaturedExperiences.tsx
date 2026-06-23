import { useState, useEffect } from 'react'
import { useMediaUrl } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { SITE } from '../config/site'

function CarouselImage() {
  const url0 = useMediaUrl('feat-adventure')
  const url1 = useMediaUrl('feat-games')
  const imgs = [url0, url1].filter(Boolean)
  const [cur, setCur] = useState(0)
  useEffect(() => {
    if (!imgs.length) return
    const t = setInterval(() => setCur(c => (c + 1) % imgs.length), 3500)
    return () => clearInterval(t)
  }, [imgs.length])
  return (
    <div className="absolute inset-0">
      {imgs.map((src, i) => (
        <div key={src} className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${src})`, opacity: i === cur ? 1 : 0 }} />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {imgs.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            className={`rounded-full transition-all duration-300 ${i === cur ? 'w-4 h-1 bg-brand-gold' : 'w-1 h-1 bg-white/40'}`} />
        ))}
      </div>
    </div>
  )
}

function FadeInImage({ id }: { id: string }) {
  const url = useMediaUrl(id)
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: url ? `url(${url})` : undefined,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateX(0)' : 'translateX(32px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          backgroundColor: '#1a2e1f',
        }} />
    </div>
  )
}

function BackgroundImagePanel({ id }: { id: string }) {
  const url = useMediaUrl(id)
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#1a2e1f' }} />
      <div className="absolute inset-0 bg-brand-dark/55" />
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <p className="font-display font-black text-white text-center leading-tight"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          Your home<br />away from home
        </p>
      </div>
    </div>
  )
}

function BleedImage({ id, reverse }: { id: string; reverse?: boolean }) {
  const url = useMediaUrl(id)
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute inset-0 overflow-hidden"
      style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.9s ease' }}>
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: url ? `url(${url})` : undefined, backgroundColor: '#1a2e1f' }} />
      <div className="absolute inset-0" style={{
        background: reverse
          ? 'linear-gradient(to left, #1f2937 0%, transparent 40%)'
          : 'linear-gradient(to right, #1f2937 0%, transparent 40%)',
      }} />
    </div>
  )
}

function Eyebrow({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-6 h-px flex-shrink-0 ${dark ? 'bg-brand-gold' : 'bg-brand-green'}`} />
      <p className={`font-body text-[10px] tracking-[0.3em] uppercase font-semibold ${dark ? 'text-brand-gold' : 'text-brand-green'}`}>{label}</p>
    </div>
  )
}

type FeatureConfig = {
  eyebrow: string; title: string; accent: string; body: string
  stats: { v: string; l: string }[]; cta: string; href: string
  dark: boolean; imageBlock: string; reverse: boolean
  imageId: string
  imageRatio: string   // e.g. 'lg:w-[55%]' or 'lg:w-[45%]'
  contentBg: string
  blockBg: string
}

function FeatureBlock({ f, index: _index }: { f: FeatureConfig; index: number }) {
  const { ref, inView } = useInView(0.1)

  const imageSide = (
    <div className={`relative ${f.imageRatio} overflow-hidden`} style={{ minHeight: 260 }}>
      {f.imageBlock === 'carousel'    && <CarouselImage />}
      {f.imageBlock === 'fade'        && <FadeInImage id={f.imageId} />}
      {f.imageBlock === 'background'  && <BackgroundImagePanel id={f.imageId} />}
      {f.imageBlock === 'bleed'       && <BleedImage id={f.imageId} reverse={f.reverse} />}
    </div>
  )

  const contentSide = (
    <div className={`flex-1 flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-10 lg:py-14 ${f.contentBg}`}>
      <Eyebrow label={f.eyebrow} dark={f.dark} />
      <h3 className={`font-display font-black leading-[0.93] mb-4 ${f.dark ? 'text-white' : 'text-brand-dark'}`}
        style={{ fontSize: 'clamp(1.7rem, 3vw, 2.8rem)', letterSpacing: '-0.02em' }}>
        {f.title}{' '}
        <em className="not-italic" style={{ color: 'var(--color-gold)' }}>{f.accent}</em>
      </h3>
      <p className={`font-body text-sm leading-relaxed mb-6 max-w-sm ${f.dark ? 'text-white/60' : 'text-gray-500'}`}>
        {f.body}
      </p>
      {/* Stats with dividers between each */}
      <div className={`flex gap-0 mb-7 pb-6 border-b ${f.dark ? 'border-white/10' : 'border-gray-100'}`}>
        {f.stats.map((s, si) => (
          <div key={si} className="flex items-stretch">
            <div className="pr-6">
              <p className={`font-display font-bold text-base leading-none mb-0.5 ${f.dark ? 'text-white' : 'text-brand-dark'}`}>{s.v}</p>
              <p className={`font-body text-[10px] uppercase tracking-wide ${f.dark ? 'text-white/35' : 'text-gray-400'}`}>{s.l}</p>
            </div>
            {si < f.stats.length - 1 && (
              <div className={`w-px self-stretch mr-6 ${f.dark ? 'bg-white/10' : 'bg-gray-150'}`} style={{ backgroundColor: f.dark ? 'rgba(255,255,255,0.1)' : '#e8e8e8' }} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <a href={f.href}
          className="bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-sm">
          {f.cta}
        </a>
        <a href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
          className={`font-body text-sm font-medium flex items-center gap-1.5 transition-colors group ${f.dark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-brand-dark'}`}>
          Book now
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </a>
      </div>
    </div>
  )

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col lg:flex-row ${f.reverse ? 'lg:flex-row-reverse' : ''} overflow-hidden rounded-2xl`}
      style={{
        maxHeight: '80dvh', minHeight: 340,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'all 0.6s ease',
        background: f.blockBg,
      }}>
      {imageSide}
      {contentSide}
    </div>
  )
}

const FEATURES: FeatureConfig[] = [
  {
    eyebrow: 'CabHouse Adventures',
    title: 'Push Your', accent: 'Limits',
    body: 'Rope bridges, 100m rainbow slide, zip line and sky bike set against open Kisii sky. You\'ll be challenged. You\'ll love it.',
    stats: [{ v: '100m', l: 'Slide' }, { v: 'Sky Bike', l: 'Aerial' }, { v: 'Zip Line', l: 'Thrills' }],
    cta: 'See Adventures', href: '/park', dark: true,
    imageBlock: 'carousel', reverse: false, imageId: 'feat-adventure',
    imageRatio: 'lg:w-[55%]',
    contentBg: 'bg-gray-900',
    blockBg: '#111827',
  },
  {
    eyebrow: 'CabHouse Park & Games',
    title: 'Play All', accent: 'Day',
    body: 'Go-karts, bumper cars, giant pool inflatables and a kids\' park. Everyone leaves tired, happy and asking when they can come back.',
    stats: [{ v: 'Go-Karts', l: 'Cars' }, { v: 'Pools', l: 'Inflatables' }, { v: 'KES 300', l: 'From' }],
    cta: 'See Activities', href: '/park', dark: false,
    imageBlock: 'fade', reverse: true, imageId: 'feat-games',
    imageRatio: 'lg:w-[45%]',
    contentBg: 'bg-white',
    blockBg: '#ffffff',
  },
  {
    eyebrow: 'CabHouse Resorts',
    title: 'Stay the', accent: 'Night',
    body: 'Wooden cabins and starlit camping tents. Fall asleep to nature and wake up with everything the park has to offer right outside.',
    stats: [{ v: 'KES 1,500', l: 'Camping' }, { v: 'KES 3,000', l: 'Cabin' }, { v: '+B', l: 'Breakfast' }],
    cta: 'Explore Stays', href: '/relax', dark: true,
    imageBlock: 'background', reverse: false, imageId: 'feat-resort',
    imageRatio: 'lg:w-[60%]',
    contentBg: 'bg-brand-dark',
    blockBg: 'var(--color-dark)',
  },
  {
    eyebrow: 'CabHouse Events',
    title: 'Celebrate', accent: 'Here',
    body: 'Gardens for 200, indoor halls, premium tents, restaurant and bar. Weddings, corporate retreats and galas "” complete venue.',
    stats: [{ v: '200', l: 'Guests' }, { v: 'Gardens', l: 'Hall & Tents' }, { v: 'Full', l: 'Catering' }],
    cta: 'Plan an Event', href: '/events', dark: false,
    imageBlock: 'bleed', reverse: true, imageId: 'feat-events',
    imageRatio: 'lg:w-[50%]',
    contentBg: 'bg-brand-cream',
    blockBg: 'var(--color-cream)',
  },
]

export default function FeaturedExperiences() {
  const { ref, inView } = useInView()

  return (
    <section id="park" className="bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-brand-gold" />
            <p className="text-brand-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">What Awaits You</p>
          </div>
          <h2 className="font-display font-black text-brand-dark leading-[0.93]"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw, 3rem)', letterSpacing: '-0.02em' }}>
            Experiences Worth the <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Journey</em>
          </h2>
        </div>
      </div>

      {/* Feature blocks with generous gap between each */}
      <div className="flex flex-col gap-6 px-6 lg:px-10 pb-14 max-w-7xl mx-auto">
        {FEATURES.map((f, i) => <FeatureBlock key={i} f={f} index={i} />)}
      </div>

    </section>
  )
}
