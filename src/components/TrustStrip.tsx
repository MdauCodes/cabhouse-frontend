const PILLARS = [
  { label: 'Open 7 Days', sub: '8 AM – 8 PM' },
  { label: "Kisii's #1", sub: 'Recreation Centre' },
  { label: '4.7 Stars', sub: 'Google Reviews' },
  { label: '5 Activity Zones', sub: 'One Admission' },
  { label: 'Est. 2022', sub: 'Kisii, Kenya' },
]

export default function TrustStrip() {
  return (
    <div className="bg-white border-b border-brand-dark/8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-stretch divide-x divide-brand-dark/8 min-w-max lg:min-w-0">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-4 lg:py-5 px-6 lg:px-4 lg:flex-1 text-center gap-0.5 whitespace-nowrap lg:whitespace-normal"
            >
              <p className="font-display font-bold text-brand-dark text-sm leading-tight">{p.label}</p>
              <p className="font-body text-[10px] text-brand-dark/40 leading-tight">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
