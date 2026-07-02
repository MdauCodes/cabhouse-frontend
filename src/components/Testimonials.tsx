import { useState } from 'react'
import { useInView } from '../hooks/useInView'

// Replace with the actual Google Maps Place URL for CabHouse Park once confirmed
const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/CabHouse+Park+Kisii'

const REVIEWS = [
  { name: 'Sarah M.',  month: 'June 2025',  rating: 5, text: 'The zip line and sky bike were unforgettable. Staff were warm and professional throughout. CabHouse is genuinely world-class —right here in Kisii.' },
  { name: 'James K.',  month: 'May 2025',   rating: 5, text: "Brought the family for my daughter's birthday. Kids loved the pool and inflatables. Stayed in a wooden cabin —very comfortable. Already planning the next visit." },
  { name: 'Mercy A.',  month: 'April 2025', rating: 5, text: 'Our company retreat was outstanding. The team-building course kept everyone engaged and the garden dinner venue was stunning. Highly recommend for corporate events.' },
  { name: 'David O.',  month: 'March 2025', rating: 4, text: 'The mountain challenge course is no joke —challenging and exhilarating. Rainbow slide was the highlight. Great package value for what you get.' },
  { name: 'Faith W.',  month: 'June 2025',  rating: 5, text: 'Finally a world-class recreation spot in Kisii. Beautiful gardens, great food, top-tier activities. CabHouse has genuinely set a new standard for this region.' },
  { name: 'Peter N.',  month: 'May 2025',   rating: 5, text: 'Came for a day trip, ended up booking a camping tent for the night. Falling asleep to nature with everything the park offers right there —pure magic.' },
]

// Characters before "Read more" kicks in
const TRUNCATE_AT = 120

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 fill-current ${i < n ? 'text-brand-gold' : 'text-brand-dark/20'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ r, idx }: { r: typeof REVIEWS[0]; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = r.text.length > TRUNCATE_AT
  const { ref, inView } = useInView(0.08)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="bg-white/30 rounded-2xl p-5 flex flex-col gap-3 border border-brand-dark/10"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(14px)',
        transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
      }}
    >
      <Stars n={r.rating} />
      <p className="font-display text-4xl text-brand-gold leading-none select-none" aria-hidden>&ldquo;</p>

      <div className="-mt-3">
        <p className="text-brand-dark/65 font-body text-sm leading-relaxed">
          {expanded || !needsTruncation
            ? r.text
            : `${r.text.slice(0, TRUNCATE_AT).trimEnd()}…`}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-2 text-brand-gold hover:text-brand-orange font-body text-xs font-semibold transition-colors duration-150 flex items-center gap-1"
          >
            {expanded ? 'Show less' : 'Read more'}
            <svg
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`w-2.5 h-2.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-brand-dark/10 mt-auto">
        <p className="font-display font-bold text-brand-dark text-sm">{r.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-brand-dark/40 font-body text-xs">{r.month}</p>
          {/* Google "G" mark */}
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"
            title="View on Google" className="opacity-40 hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { ref, inView } = useInView()
  const [page, setPage] = useState(0)
  const perPage = 3
  const pages = Math.ceil(REVIEWS.length / perPage)
  const visible = REVIEWS.slice(page * perPage, page * perPage + perPage)

  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pt-3">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden px-4 lg:px-10 py-10 lg:py-14" style={{ backgroundColor: '#D4B882' }}>

        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}
        >
          <div>
            <h2 className="font-display font-black text-brand-dark leading-[0.93]"
              style={{ fontSize: 'var(--type-h3)', letterSpacing: '-0.02em' }}>
              Rated <em className="not-italic" style={{ color: 'var(--color-gold)' }}>4.7 Stars</em> on Google
            </h2>
            <p className="text-brand-dark/50 font-body text-xs mt-1">Real reviews from real visitors</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Rating badge */}
            <div className="flex items-center gap-4 border border-brand-dark/10 rounded-2xl px-5 py-3.5">
              <div>
                <p className="font-display font-black text-2xl text-brand-dark leading-none">4.7</p>
                <Stars n={5} />
                <p className="text-brand-dark/40 font-body text-[10px] mt-1">56 reviews</p>
              </div>
              <div className="w-px h-10 bg-brand-dark/10" />
              <div>
                <p className="font-display font-bold text-xl text-brand-dark leading-none">#1</p>
                <p className="text-brand-dark/40 font-body text-[10px] mt-1 leading-snug max-w-[80px]">Recreation centre in Kisii</p>
              </div>
            </div>

            {/* Google Reviews link */}
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-brand-dark/10 hover:border-brand-dark/25 rounded-2xl px-4 py-3.5 transition-colors group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="font-body font-semibold text-brand-dark text-xs leading-none">All Reviews</p>
                <p className="font-body text-brand-dark/40 text-[10px] mt-0.5">Open Google Maps</p>
              </div>
            </a>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visible.map((r, i) => (
            <ReviewCard key={`${page}-${i}`} r={r} idx={i} />
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex gap-2 justify-center mt-7">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`rounded-full transition-all duration-300 ${i === page ? 'w-5 h-1.5 bg-brand-gold' : 'w-1.5 h-1.5 bg-brand-dark/25 hover:bg-brand-dark/40'}`} />
            ))}
          </div>
        )}

        {/* Bottom CTA to Google */}
        <div className="mt-8 flex justify-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark font-body text-xs transition-colors duration-150 group"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            See all 56 reviews on Google
            <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      <div className="-mx-6 lg:-mx-10 mt-12" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ width: '100%', height: 32, display: 'block' }}>
          <path d="M0,8 C240,32 480,0 720,16 C960,32 1200,0 1440,8 L1440,32 L0,32 Z" fill="var(--color-dark)" />
        </svg>
      </div>
    </section>
  )
}
