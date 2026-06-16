import { SITE } from '../config/site'

const UNITS = [
  { name: 'CabHouse Park',       desc: 'Adventure, games & family fun',    href: '/park' },
  { name: 'CabHouse Resorts',    desc: 'Rooms, cabins & camping stays',     href: '/relax' },
  { name: 'CabHouse Events',     desc: 'Weddings, galas & team-building',   href: '/events' },
  { name: 'CabHouse Water',      desc: 'Premium bottled water',             href: '/water' },
  { name: 'CabHouse Apartments', desc: 'Short & long-term stays, Kisii',    href: '/apartments' },
]

const SOCIALS = [
  { label: 'Instagram', href: SITE.social.instagram },
  { label: 'Facebook',  href: SITE.social.facebook },
  { label: 'TikTok',    href: SITE.social.tiktok },
  { label: 'YouTube',   href: SITE.social.youtube },
]

export default function Footer() {
  return (
    <footer className="bg-black px-6 lg:px-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/6">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-display font-black text-white text-lg tracking-tight mb-5">CabHouse Agencies</p>
            <p className="text-white/35 font-body text-sm leading-relaxed mb-5">
              Kisii's premier lifestyle, leisure and adventure ecosystem. Where great memories begin.
            </p>
            <p className="text-white/20 font-body text-xs italic">"{SITE.tagline}"</p>
          </div>

          {/* Our brands */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Our Brands</p>
            <ul className="space-y-3.5">
              {UNITS.map(u => (
                <li key={u.name}>
                  <a href={u.href} className="group">
                    <p className="text-white/70 group-hover:text-brand-gold font-body text-sm font-medium leading-none mb-0.5 transition-colors">{u.name}</p>
                    <p className="text-white/25 font-body text-xs">{u.desc}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Contact Us</p>
            <ul className="space-y-3.5">
              <li>
                <a href={`tel:${SITE.contact.phone}`} className="text-white/60 hover:text-brand-gold font-body text-sm transition-colors block">
                  {SITE.contact.phone}
                </a>
                <a href={`tel:${SITE.contact.phone2}`} className="text-white/40 hover:text-brand-gold font-body text-sm transition-colors block mt-0.5">
                  {SITE.contact.phone2}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.contact.email}`} className="text-white/60 hover:text-brand-gold font-body text-sm transition-colors">
                  {SITE.contact.email}
                </a>
              </li>
              <li className="text-white/30 font-body text-xs leading-relaxed pt-1">
                {SITE.location.address}<br />
                Open Daily · 8 AM – 8 PM
              </li>
            </ul>
          </div>

          {/* Social + WhatsApp */}
          <div>
            <p className="text-white/40 font-body text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">Follow Us</p>
            <ul className="space-y-3 mb-7">
              {SOCIALS.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-brand-gold font-body text-sm transition-colors flex items-center gap-2 group"
                  >
                    {s.label}
                    <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-body font-semibold text-xs px-4 py-2.5 rounded-full transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-white/20 font-body text-xs">
            &copy; {new Date().getFullYear()} CabHouse Agencies Ltd. All rights reserved.
          </p>
          <p className="text-white/15 font-body text-xs">Kisii, Kenya</p>
        </div>
      </div>
    </footer>
  )
}
