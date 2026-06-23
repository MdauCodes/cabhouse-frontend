import { useState } from 'react'
import { X } from 'lucide-react'
import { SITE } from '../config/site'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  const wa = SITE.contact.whatsapp.replace('+', '')
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-xs font-body font-medium" style={{ backgroundColor: 'var(--color-gold)' }}>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-black/80">
          <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
          CabHouse Park is open daily · 8 AM – 8 PM · Kisii
        </span>
        <a
          href={`https://wa.me/${wa}`}
          target="_blank" rel="noopener noreferrer"
          className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide hover:bg-brand-dark transition-colors"
        >
          Book now →
        </a>
      </div>
      <div className="flex-1 flex justify-end">
        <button onClick={() => setVisible(false)} className="text-black/40 hover:text-black transition-colors p-1 ml-3">
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
