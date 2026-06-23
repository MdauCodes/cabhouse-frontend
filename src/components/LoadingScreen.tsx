import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    // in → hold after 400ms, hold → out after 1800ms total
    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('out'), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.55s ease' : 'opacity 0.3s ease',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          marginBottom: 28,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          CabHouse
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Agencies
        </p>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          width: 'clamp(100px, 25vw, 180px)',
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.1s',
        }}
      >
        {/* Gold fill */}
        <div
          style={{
            height: '100%',
            background: 'var(--color-gold)',
            borderRadius: 1,
            width: phase === 'hold' || phase === 'out' ? '100%' : '0%',
            transition: phase === 'hold' ? 'width 1.1s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(0.5rem, 1.2vw, 0.6rem)',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: 18,
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.2s',
        }}
      >
        Where Great Memories Begin
      </p>
    </div>
  )
}
