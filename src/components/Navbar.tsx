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

const NAV_BG     = 'rgba(250, 248, 244, 0.82)'
const NAV_BORDER = 'rgba(200, 135, 58, 0.20)'

export default function Navbar() {
  const { pathname } = useLocation()
  const logo = pathname.startsWith('/park')
    ? '/assets/park-logo.png'
    : pathname.startsWith('/water')
    ? '/assets/logo-water.png'
    : pathname.startsWith('/apartments')
    ? '/assets/logo-apartments.png'
    : '/assets/logo-agencies.png'

  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [parkOpen,  setParkOpen]  = useState(false)
  const [pkgOpen,   setPkgOpen]   = useState(false)
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[68px]">

        {/* Logo */}
        <a href="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt="CabHouse Agencies"
            className="h-12 w-auto object-contain"
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
        <div className="hidden lg:flex items-center">
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
          style={{ backgroundColor: 'rgba(250, 248, 244, 0.96)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderColor: NAV_BORDER }}
        >
          <nav className="flex flex-col px-6 py-5 gap-1">
            <a href="/" onClick={() => setOpen(false)}
              className="text-brand-dark/80 font-body font-medium py-2.5 text-sm border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              Home
            </a>
            <p className="text-[9px] uppercase tracking-widest font-bold pt-3 pb-1" style={{ color: 'var(--color-gold)' }}>CabHouse Park</p>
            {PARK_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-brand-dark/55 font-body text-sm py-2 pl-3 hover:text-brand-dark transition-colors">
                {l.label}
              </a>
            ))}
            <p className="text-[9px] uppercase tracking-widest font-bold pt-3 pb-1" style={{ color: 'var(--color-gold)' }}>Offers & Packages</p>
            {PACKAGES_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-brand-dark/55 font-body text-sm py-2 pl-3 hover:text-brand-dark transition-colors">
                {l.label}
              </a>
            ))}
            <a href="/water" onClick={() => setOpen(false)}
              className="text-brand-dark/55 font-body text-sm py-2.5 hover:text-brand-dark transition-colors">
              CabHouse Water
            </a>
            <a href="/apartments" onClick={() => setOpen(false)}
              className="text-brand-dark/55 font-body text-sm py-2.5 hover:text-brand-dark transition-colors">
              Apartments
            </a>
            <a href="/about" onClick={() => setOpen(false)}
              className="text-brand-dark/80 font-body font-medium py-2.5 text-sm border-t mt-1"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              About Our Group
            </a>
            <a
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-3 text-white text-center font-semibold px-5 py-2.5 rounded-full text-sm"
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
