import { type ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingWhatsApp from './FloatingWhatsApp'
import CookieBanner from './CookieBanner'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'clip', background: 'var(--canvas)' }}>
      <Navbar />
      {children}
      <Footer />
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  )
}
