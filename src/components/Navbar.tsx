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

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-body font-bold px-5 py-2.5 rounded-full transition-all duration-200 tracking-wide uppercase hover:brightness-110"
            style={{ backgroundColor: 'var(--color-gold)', color: '#fff' }}
          >
            Book Now
          </a>
          <a
            href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-body font-bold px-5 py-2.5 rounded-full transition-all duration-200 tracking-wide uppercase"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
            </svg>
            WhatsApp
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
              className="mt-3 text-white text-center font-bold px-5 py-3 rounded-full text-sm uppercase tracking-wide"
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
