import { useState, useEffect } from 'react'

const KEY = 'ch_privacy_ack'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 md:px-5 md:pb-4"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 rounded-2xl px-5 py-4"
        style={{
          backgroundColor: 'rgba(18,14,10,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(200,135,58,0.22)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          pointerEvents: 'auto',
        }}
      >
        {/* Gold accent bar */}
        <span
          className="hidden sm:block flex-shrink-0 w-0.5 self-stretch rounded-full"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />

        {/* Text */}
        <p className="flex-1 font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
          <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>
            CabHouse Agencies Ltd
          </span>
          {' '}does not use tracking cookies, analytics, or third-party advertising scripts.
          This site only links to WhatsApp and Instagram for booking and social purposes.
          {' '}
          <a
            href="/about"
            className="underline underline-offset-2 transition-colors"
            style={{ color: 'var(--color-gold)' }}
          >
            About us
          </a>
        </p>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 font-body font-bold text-xs px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
