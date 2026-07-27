import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export interface GalleryPhoto {
  src: string
  label?: string
}

interface Props {
  photos: GalleryPhoto[]
  title?: string
  subtitle?: string
}

const STAR_CLIP = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'

export default function MasonryGallery({ photos, title, subtitle }: Props) {
  const [lightbox, setLightbox] = useState<{ idx: number } | null>(null)

  const close = useCallback(() => {
    setLightbox(null)
    document.body.style.overflow = ''
  }, [])

  const prev = useCallback(() => {
    setLightbox(l => l ? { idx: (l.idx - 1 + photos.length) % photos.length } : null)
  }, [photos.length])

  const next = useCallback(() => {
    setLightbox(l => l ? { idx: (l.idx + 1) % photos.length } : null)
  }, [photos.length])

  const open = useCallback((idx: number) => {
    setLightbox({ idx })
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, close, prev, next])

  const active = lightbox !== null ? photos[lightbox.idx] : null

  return (
    <>
      <section className="bg-white px-5 lg:px-10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {(title || subtitle) && (
            <div className="mb-7">
              {title && (
                <h2 className="font-display font-black text-brand-dark leading-[0.93] mb-1"
                  style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {subtitle && (
                <p className="text-brand-dark/35 font-body text-xs">{subtitle}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => open(i)}
                className="relative group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold cursor-zoom-in"
                style={{ aspectRatio: '4/5', boxShadow: '0 10px 30px rgba(26,20,10,0.10)' }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img
                    src={p.src}
                    alt={p.label ?? ''}
                    loading="lazy"
                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 border border-white/40">
                      <ZoomIn className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  {p.label && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-body text-[10px] font-medium leading-tight">{p.label}</p>
                    </div>
                  )}
                </div>
                {/* Ring accent */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                {/* Featured star badge on the first photo */}
                {i === 0 && (
                  <div
                    className="absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center"
                    style={{ background: 'var(--color-gold)', clipPath: STAR_CLIP }}
                  >
                    <span className="text-white font-body text-[7px] font-bold uppercase">Featured</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white/70 font-body text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {(lightbox?.idx ?? 0) + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-3 sm:left-6 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Image */}
          <img
            src={active.src}
            alt={active.label ?? ''}
            onClick={e => e.stopPropagation()}
            className="max-w-[92vw] max-h-[90vh] object-contain rounded-xl shadow-2xl select-none"
          />

          {/* Label */}
          {active.label && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 text-white font-body text-xs px-4 py-1.5 rounded-full backdrop-blur-sm">
              {active.label}
            </div>
          )}

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-3 sm:right-6 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  )
}
