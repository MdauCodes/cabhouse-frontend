import { useEffect, useState } from 'react'

interface Props { ready: boolean }

export default function LoadingScreen({ ready }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  // in → hold: wordmark fades in, bar starts pulsing
  useEffect(() => {
    const t = setTimeout(() => setPhase('hold'), 400)
    return () => clearTimeout(t)
  }, [])

  // hold → out: only when parent says images are ready
  useEffect(() => {
    if (!ready || phase === 'in') return
    const t = setTimeout(() => setPhase('out'), 120)
    return () => clearTimeout(t)
  }, [ready, phase])

  return (
    <>
      {/* Shimmer keyframes */}
      <style>{`
        @keyframes ls-shimmer {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(400%) }
        }
      `}</style>

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
          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}>
            CabHouse
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}>
            Agencies
          </p>
        </div>

        {/* Progress track */}
        <div style={{
          width: 'clamp(100px, 25vw, 180px)',
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.1s',
          position: 'relative',
        }}>
          {phase === 'hold' && !ready ? (
            /* Indeterminate shimmer while waiting for images */
            <div style={{
              position: 'absolute',
              inset: 0,
              width: '30%',
              background: 'var(--color-gold)',
              animation: 'ls-shimmer 1.4s ease-in-out infinite',
              borderRadius: 1,
            }} />
          ) : (
            /* Fill to 100% on ready / out */
            <div style={{
              height: '100%',
              background: 'var(--color-gold)',
              borderRadius: 1,
              width: phase === 'out' || ready ? '100%' : '0%',
              transition: 'width 0.35s ease-out',
            }} />
          )}
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(0.5rem, 1.2vw, 0.6rem)',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: 18,
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.2s',
        }}>
          Where Great Memories Begin
        </p>
      </div>
    </>
  )
}
