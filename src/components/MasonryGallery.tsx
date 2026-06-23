import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export interface GalleryPhoto {
  src: string
  label?: string
  span?: 'normal' | 'tall'
}

interface Props {
  photos: GalleryPhoto[]
  title?: string
  subtitle?: string
  columns?: string
  gap?: number
}

export default function MasonryGallery({ photos, title, subtitle, columns = 'columns-2 sm:columns-3 lg:columns-4', gap = 8 }: Props) {
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
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', letterSpacing: '-0.02em' }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {subtitle && (
                <p className="text-brand-dark/35 font-body text-xs">{subtitle}</p>
              )}
            </div>
          )}

          <div className={`${columns}`} style={{ columnGap: gap, lineHeight: 0 }}>
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => open(i)}
                className="break-inside-avoid group relative w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold cursor-zoom-in"
                style={{ marginBottom: gap, display: 'block' }}
              >
                <img
                  src={p.src}
                  alt={p.label ?? ''}
                  loading="lazy"
                  className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.05]"
                  style={{ lineHeight: 0 }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 border border-white/40">
                    <ZoomIn className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                </div>
                {p.label && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl">
                    <p className="text-white font-body text-[10px] font-medium leading-tight">{p.label}</p>
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
