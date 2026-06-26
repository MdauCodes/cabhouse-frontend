import { SITE } from '../config/site'

const BRAND_LINKS = [
  { name: 'CabHouse Park',       href: '/park',       dot: 'var(--color-gold)' },
  { name: 'CabHouse Water',      href: '/water',      dot: '#38BDF8' },
  { name: 'CabHouse Apartments', href: '/apartments', dot: 'var(--color-gold)' },
]

const COL_BRANDS = [
  { label: 'CabHouse Park',       href: '/park' },
  { label: 'CabHouse Water',      href: '/water' },
  { label: 'CabHouse Apartments', href: '/apartments' },
  { label: 'Home',                href: '/' },
]

const COL_EXPERIENCES = [
  { label: 'Pool & Play',        href: '/park' },
  { label: 'Camping',            href: '/relax' },
  { label: 'Events & Weddings',  href: '/events' },
  { label: 'Restaurant',         href: '/park#dining' },
  { label: 'Transport',          href: '/park' },
]

const COL_COMPANY = [
  { label: 'About CabHouse',  href: '/about' },
  { label: 'WhatsApp Us',     href: `https://wa.me/${SITE.contact.whatsapp.replace('+', '')}` },
  { label: 'Contact',         href: '#contact' },
]

const COL_LEGAL = [
  { label: 'Privacy Policy',   href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export default function Footer() {
  const wa = SITE.contact.whatsapp.replace('+', '')
  return (
    <section style={{ background: 'var(--canvas)' }} className="px-3 md:px-5 pb-3 md:pb-5">
    <footer style={{ backgroundColor: 'var(--color-dark)' }} className="rounded-3xl overflow-hidden">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/6">

          {/* Brand col — spans 2 on mobile, 1 on lg */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/assets/logo-agencies.png" alt="CabHouse" className="h-10 w-auto" />
              <div>
                <p className="font-display font-black text-white text-sm leading-none">CabHouse</p>
                <p className="font-body text-white/40 text-[9px] uppercase tracking-widest">Agencies Ltd</p>
              </div>
            </div>
            <p className="text-white/35 font-body text-xs leading-relaxed mb-5">
              Park · Water · Apartments.<br />
              One family of experiences, in Kisii.
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {BRAND_LINKS.map(b => (
                <a key={b.name} href={b.href} className="flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.dot }} />
                  <span className="text-white/50 group-hover:text-white font-body text-xs transition-colors">{b.name}</span>
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#25D366] flex items-center justify-center text-white/40 hover:text-[#25D366] transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
                </svg>
              </a>
              <a href={`mailto:${SITE.contact.email}`}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-brand-gold flex items-center justify-center text-white/40 hover:text-brand-gold transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
              <a href={`tel:${SITE.contact.phone}`}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-brand-gold flex items-center justify-center text-white/40 hover:text-brand-gold transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.6 19.79 19.79 0 01.06 1a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Our Brands */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Our Brands</p>
            <ul className="space-y-3">
              {COL_BRANDS.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/55 hover:text-brand-gold font-body text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Experiences</p>
            <ul className="space-y-3">
              {COL_EXPERIENCES.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/55 hover:text-brand-gold font-body text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Company</p>
            <ul className="space-y-3">
              {COL_COMPANY.map(l => (
                <li key={l.label}>
                  <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-white/55 hover:text-brand-gold font-body text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Legal</p>
            <ul className="space-y-3">
              {COL_LEGAL.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/55 hover:text-brand-gold font-body text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-white/20 font-body text-xs">
            &copy; {new Date().getFullYear()} CabHouse Agencies Ltd. All rights reserved.
          </p>
          <p className="text-white/15 font-body text-xs flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 opacity-50">
              <circle cx="8" cy="8" r="6"/><path d="M8 4v4l2.5 2.5"/>
            </svg>
            East Africa · Kisii, Kenya
          </p>
        </div>
      </div>

      {/* Contact bar */}
      <div className="border-t border-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 font-body text-sm">
            Not sure which experience is right for you?{' '}
            <span className="text-white/20">Mon–Sat, 8am–6pm</span>
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${wa}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-body font-bold text-xs px-4 py-2.5 rounded-full transition-all uppercase tracking-wide"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
              </svg>
              WhatsApp Us
            </a>
            <a href={`tel:${SITE.contact.phone}`} className="text-white/40 hover:text-brand-gold font-body text-sm transition-colors">
              {SITE.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
    </section>
  )
}
