import { SITE } from '../config/site'

export default function MapSection() {
  return (
    <section
      id="location"
      className="bg-brand-dark px-6 lg:px-10 flex flex-col"
      style={{ height: '80dvh', minHeight: 420 }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full py-8 lg:py-10">

        {/* Header */}
        <div className="mb-5 flex-shrink-0">
          <h2
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)', letterSpacing: '-0.02em' }}
          >
            Get Here. Make <em className="not-italic" style={{ color: 'var(--color-gold)' }}>Memories</em>.
          </h2>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">

          {/* Info panel "” single compact block */}
          <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">

            {/* Compact info rows in one card */}
            <div className="bg-white/[0.04] border border-white/8 rounded-xl flex-shrink-0">

              {/* Address */}
              <div className="flex items-start gap-4 px-4 py-3 border-b border-white/6">
                <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-brand-gold">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-body text-xs font-semibold">Kisii, Kenya</p>
                  <p className="text-white/40 font-body text-[10px] mt-0.5">Near Nyankororo Forest · Kisii"“Riana Road</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 px-4 py-3 border-b border-white/6">
                <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-brand-gold" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-body text-xs font-semibold">Open Daily · 8 AM "“ 8 PM</p>
                  <p className="text-white/40 font-body text-[10px] mt-0.5">Monday through Sunday, year-round</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4 px-4 py-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-brand-gold" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-.53a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <a href={`tel:${SITE.contact.phone}`} className="text-white font-body text-xs font-semibold hover:text-brand-gold transition-colors block">
                    {SITE.contact.phone}
                  </a>
                  <a href={`mailto:${SITE.contact.email}`} className="text-white/40 font-body text-[10px] mt-0.5 hover:text-brand-gold transition-colors block">
                    {SITE.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Action buttons "” side by side */}
            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
              <a
                href={SITE.location.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-orange text-white font-body font-semibold text-xs py-3 rounded-xl transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Directions
              </a>
              <a
                href={`https://wa.me/${SITE.contact.whatsapp.replace('+', '')}?text=Hi%2C%20I%27d%20like%20to%20visit%20CabHouse%20Park`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-body font-semibold text-xs py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.338-1.506A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.375l-.359-.214-3.724.976.993-3.626-.235-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/8 min-h-0 flex-1">
            <iframe
              title="CabHouse Park Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3990!2d34.0!3d0.626366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b4e09c4df8939%3A0x0!2sCabhouse%20Park!5e0!3m2!1sen!2ske!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: 240 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
