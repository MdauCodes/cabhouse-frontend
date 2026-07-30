import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { SITE } from '../config/site'

const PARK_LINKS = [
  { label: 'Park Overview',   href: '/park' },
  { label: 'Games & Rides',   href: '/park#games' },
  { label: 'Stay & Camp',     href: '/relax' },
  { label: 'Dining',          href: '/park#dining' },
  { label: 'Events',          href: '/events' },
]

const PACKAGES_LINKS = [
  { label: 'Park Packages',       href: '/#packages' },
  { label: 'Weddings',            href: '/events#weddings' },
  { label: 'Corporate & Team',    href: '/events#corporate' },
  { label: 'School Packages',     href: '/events#school' },
  { label: 'Birthday Packages',   href: '/events#birthday' },
]

const NAV_BG     = 'rgba(255, 255, 255, 0.92)'
const NAV_BORDER = 'rgba(200, 135, 58, 0.20)'

export default function Navbar() {
  const { pathname } = useLocation()
  const logo = pathname.startsWith('/park')
    ? '/assets/logo-park-noBackground.png'
    : pathname.startsWith('/water')
    ? '/assets/logo-water-noBackground.png'
    : pathname.startsWith('/apartments')
    ? '/assets/logo-apartments-noBackground.png'
    : '/assets/logo-agencies-noBackground.png'

  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [parkOpen,  setParkOpen]  = useState(false)
  const [pkgOpen,   setPkgOpen]   = useState(false)
  const [mParkOpen, setMParkOpen] = useState(false)
  const [mPkgOpen,  setMPkgOpen]  = useState(false)
  const parkRef = useRef<HTMLDivElement>(null)
  const pkgRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setScrolled(window.scrollY > 10)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (parkRef.current && !parkRef.current.contains(e.target as Node)) setParkOpen(false)
      if (pkgRef.current  && !pkgRef.current.contains(e.target  as Node)) setPkgOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkCls = 'text-sm font-body font-medium text-brand-dark/60 hover:text-brand-dark tracking-wide transition-colors duration-150 flex items-center gap-1'

  return (
    <header
      className="sticky top-0 z-50 transition-shadow duration-300"
      style={{
        backgroundColor: NAV_BG,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${NAV_BORDER}`,
        boxShadow: scrolled ? '0 4px 24px rgba(26,23,20,0.10)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[92px]">

        {/* Logo */}
        <a href="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt="CabHouse Agencies"
            className="h-20 w-auto object-contain"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">

          {/* CabHouse Park dropdown */}
          <div ref={parkRef} className="relative">
            <a
              href="/park"
              className={linkCls}
              onMouseEnter={() => setParkOpen(true)}
              onMouseLeave={() => setParkOpen(false)}
              onClick={() => setParkOpen(false)}
            >
              CabHouse Park
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${parkOpen ? 'rotate-180' : ''}`}
                onClick={e => { e.preventDefault(); setParkOpen(v => !v) }}
              />
            </a>
            {parkOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 rounded-xl py-2 z-50"
                style={{
                  backgroundColor: 'rgba(250, 248, 244, 0.96)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: `1px solid ${NAV_BORDER}`,
                  boxShadow: '0 16px 40px rgba(26,23,20,0.12)',
                }}
                onMouseEnter={() => setParkOpen(true)}
                onMouseLeave={() => setParkOpen(false)}
              >
                {PARK_LINKS.map(l => (
                  <a key={l.href} href={l.href}
                    className="block px-4 py-2.5 text-sm font-body text-brand-dark/60 hover:text-brand-dark transition-colors"
                    style={{ ':hover': { backgroundColor: 'rgba(200,135,58,0.06)' } } as React.CSSProperties}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200,135,58,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Offers & Packages dropdown */}
          <div ref={pkgRef} className="relative">
            <button
              className={linkCls}
              onMouseEnter={() => setPkgOpen(true)}
              onMouseLeave={() => setPkgOpen(false)}
              onClick={() => setPkgOpen(v => !v)}
            >
              Offers & Packages
              <ChevronDown size={13} className={`transition-transform duration-200 ${pkgOpen ? 'rotate-180' : ''}`} />
            </button>
            {pkgOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 rounded-xl py-2 z-50"
                style={{
                  backgroundColor: 'rgba(250, 248, 244, 0.96)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: `1px solid ${NAV_BORDER}`,
                  boxShadow: '0 16px 40px rgba(26,23,20,0.12)',
                }}
                onMouseEnter={() => setPkgOpen(true)}
                onMouseLeave={() => setPkgOpen(false)}
              >
                {PACKAGES_LINKS.map(l => (
                  <a key={l.href} href={l.href}
                    className="block px-4 py-2.5 text-sm font-body text-brand-dark/60 hover:text-brand-dark transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200,135,58,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/water"      className={linkCls}>CabHouse Water</a>
          <a href="/apartments" className={linkCls}>Apartments</a>
          <a href="/about"      className={linkCls}>About</a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/login"
            className="font-body font-medium text-sm text-brand-dark/50 hover:text-brand-dark transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
              <circle cx="8" cy="5" r="2.5"/>
              <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
            </svg>
            Sign In
          </a>
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent("Hi, I'd like to book a visit to CabHouse Park")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-brand-dark/70 hover:text-brand-dark transition-colors" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderColor: NAV_BORDER }}
        >
          <nav className="flex flex-col px-5 py-3 gap-0.5">
            {/* Top-level links */}
            <a href="/" onClick={() => setOpen(false)}
              className="text-brand-dark/70 font-body font-semibold py-2 text-sm border-b"
              style={{ borderColor: 'rgba(200,135,58,0.10)' }}>
              Home
            </a>

            {/* Park sub-group — tap to expand */}
            <button
              onClick={() => setMParkOpen(v => !v)}
              className="flex items-center justify-between text-brand-dark/70 font-body font-semibold py-2.5 text-sm border-b"
              style={{ borderColor: 'rgba(200,135,58,0.10)' }}
            >
              CabHouse Park
              <ChevronDown size={15} className={`transition-transform duration-200 ${mParkOpen ? 'rotate-180' : ''}`} />
            </button>
            {mParkOpen && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1.5 pl-1">
                {PARK_LINKS.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="text-brand-dark/55 font-body text-xs py-1.5 hover:text-brand-dark transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            )}

            {/* Packages sub-group — tap to expand */}
            <button
              onClick={() => setMPkgOpen(v => !v)}
              className="flex items-center justify-between text-brand-dark/70 font-body font-semibold py-2.5 text-sm border-b"
              style={{ borderColor: 'rgba(200,135,58,0.10)' }}
            >
              Offers &amp; Packages
              <ChevronDown size={15} className={`transition-transform duration-200 ${mPkgOpen ? 'rotate-180' : ''}`} />
            </button>
            {mPkgOpen && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1.5 pl-1">
                {PACKAGES_LINKS.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="text-brand-dark/55 font-body text-xs py-1.5 hover:text-brand-dark transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            )}

            {/* Remaining top-level */}
            <div className="border-t mt-2 pt-1.5" style={{ borderColor: 'rgba(200,135,58,0.10)' }}>
              <a href="/water" onClick={() => setOpen(false)}
                className="block text-brand-dark/65 font-body text-sm py-2 hover:text-brand-dark transition-colors">
                CabHouse Water
              </a>
              <a href="/apartments" onClick={() => setOpen(false)}
                className="block text-brand-dark/65 font-body text-sm py-2 hover:text-brand-dark transition-colors">
                Apartments
              </a>
              <a href="/about" onClick={() => setOpen(false)}
                className="block text-brand-dark/65 font-body text-sm py-2 hover:text-brand-dark transition-colors">
                About Our Group
              </a>
            </div>

            <a href="/login" onClick={() => setOpen(false)}
              className="block text-brand-dark/55 font-body text-sm py-2 hover:text-brand-dark transition-colors flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5 shrink-0">
                <circle cx="8" cy="5" r="2.5"/>
                <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
              </svg>
              Member Portal / Sign In
            </a>
            <a
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-2 mb-1 text-white text-center font-semibold px-5 py-2.5 rounded-full text-sm"
              style={{ backgroundColor: 'var(--color-gold)' }}
            >
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
