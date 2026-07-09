// ─── Media Configuration ────────────────────────────────────────────────────
// Each slot: localPath = public/assets/ fallback, cloudinaryUrl = production URL.
// /mdau/dev admin panel manages uploads and applies overrides via localStorage.
// raw-N.jpeg/jpg = original cabhouse files copied from desktop.
// ────────────────────────────────────────────────────────────────────────────

export interface MediaSlot {
  id: string
  label: string
  section: string
  type: 'image' | 'video'
  localPath: string
  cloudinaryUrl: string | null
  alt?: string
}

export const MEDIA_SLOTS: MediaSlot[] = [

  // ── Hero slides ───────────────────────────────────────────────────────────
  // hero-new-1: rope bridge against brilliant blue sky — cinematic wide
  // hero-new-2: group on rope course with harnesses — real people, action
  // hero-new-3: kids in pool with inflatable slide — fun/family energy
  { id: 'hero-1', label: 'Hero Slide 1', section: 'Hero', type: 'image', localPath: '/assets/hero-3.webp', cloudinaryUrl: null, alt: 'Rope bridge against clear blue sky' },
  { id: 'hero-2', label: 'Hero Slide 2', section: 'Hero', type: 'image', localPath: '/assets/hero-5.webp', cloudinaryUrl: null, alt: 'Group on high ropes adventure course' },
  { id: 'hero-3', label: 'Hero Slide 3', section: 'Hero', type: 'image', localPath: '/assets/hero-6.png', cloudinaryUrl: null, alt: 'CabHouse Park activity' },
  { id: 'hero-4', label: 'Hero Slide 4', section: 'Hero', type: 'image', localPath: '/assets/hero-7.png',       cloudinaryUrl: null, alt: 'CabHouse Park experience' },
  { id: 'hero-5', label: 'Hero Slide 5', section: 'Hero', type: 'image', localPath: '/assets/hero-new-1.webp', cloudinaryUrl: null, alt: 'Rope bridge against brilliant blue sky' },
  { id: 'hero-6', label: 'Hero Slide 6', section: 'Hero', type: 'image', localPath: '/assets/hero-new-2.webp', cloudinaryUrl: null, alt: 'Group on rope course with harnesses' },
  { id: 'hero-7', label: 'Hero Slide 7', section: 'Hero', type: 'image', localPath: '/assets/hero-new-3.webp', cloudinaryUrl: null, alt: 'Kids in pool with inflatable slide' },
  { id: 'hero-video',   label: 'Hero Background Video', section: 'Hero', type: 'video', localPath: '',                    cloudinaryUrl: null },

  // ── Experience Cards (Relax / Play / Explore / Celebrate / Move) ──────────
  // raw-9: calm garden/green landscape — Relax
  // raw-5: kids in pool with inflatable slides — Play
  // raw-4: harness rope course group — Explore
  // raw-6: team group photo with bouncy castle — Celebrate
  // raw-7: sky bike + games composite — Move
  { id: 'exp-relax',     label: 'Relax Card',     section: 'Experience Cards', type: 'image', localPath: '/assets/raw-9.jpeg',  cloudinaryUrl: null, alt: 'Relaxing gardens at CabHouse' },
  { id: 'exp-play',      label: 'Play Card',      section: 'Experience Cards', type: 'image', localPath: '/assets/raw-5.jpeg',  cloudinaryUrl: null, alt: 'Kids pool and inflatable waterslides' },
  { id: 'exp-explore',   label: 'Explore Card',   section: 'Experience Cards', type: 'image', localPath: '/assets/raw-4.jpeg',  cloudinaryUrl: null, alt: 'Rope course group adventure' },
  { id: 'exp-celebrate', label: 'Celebrate Card', section: 'Experience Cards', type: 'image', localPath: '/assets/raw-6.jpeg',  cloudinaryUrl: null, alt: 'Team celebration at CabHouse Events' },
  { id: 'exp-move',      label: 'Move Card',      section: 'Experience Cards', type: 'image', localPath: '/assets/raw-7.jpeg',  cloudinaryUrl: null, alt: 'Activities and movement at CabHouse' },

  // ── Featured Experiences ──────────────────────────────────────────────────
  // raw-8: bridge/rope structure — Adventures feature
  // raw-7: games composite — Park & Games feature
  // raw-3: rope course group smiling — Resort/Stay feature
  // raw-6: group gathering — Events feature
  { id: 'feat-adventure', label: 'Adventure Feature', section: 'Featured', type: 'image', localPath: '/assets/raw-8.jpeg',  cloudinaryUrl: null, alt: 'Adventure park rope bridge' },
  { id: 'feat-games',     label: 'Games Feature',     section: 'Featured', type: 'image', localPath: '/assets/raw-7.jpeg',  cloudinaryUrl: null, alt: 'Park games and activities' },
  { id: 'feat-resort',    label: 'Resort Feature',    section: 'Featured', type: 'image', localPath: '/assets/recharge-in-style-v2.png', cloudinaryUrl: null, alt: 'Recharge in Style — CabHouse dining and gardens' },
  { id: 'feat-events',    label: 'Events Feature',    section: 'Featured', type: 'image', localPath: '/assets/recharge-in-style.png',    cloudinaryUrl: null, alt: 'Celebrate and Stay — CabHouse events and cabins' },
  { id: 'feat-video',     label: 'Featured Video',    section: 'Featured', type: 'video', localPath: '/assets/raw-15.mp4', cloudinaryUrl: null },

  // ── Gallery (3 images + 8 videos) ────────────────────────────────────────
  { id: 'gallery-1',  label: 'Gallery Image 1', section: 'Gallery', type: 'image', localPath: '/assets/raw-8.jpeg', cloudinaryUrl: null, alt: 'Rope bridge' },
  { id: 'gallery-2',  label: 'Gallery Image 2', section: 'Gallery', type: 'image', localPath: '/assets/raw-4.jpeg', cloudinaryUrl: null, alt: 'Group rope course' },
  { id: 'gallery-3',  label: 'Gallery Image 3', section: 'Gallery', type: 'image', localPath: '/assets/hero-3.webp', cloudinaryUrl: null, alt: 'CabHouse Park' },
  { id: 'gallery-v1', label: 'Gallery Video 1',  section: 'Gallery', type: 'video', localPath: '/assets/vid-21.mp4', cloudinaryUrl: null },
  { id: 'gallery-v2', label: 'Gallery Video 2',  section: 'Gallery', type: 'video', localPath: '/assets/vid-23.mp4', cloudinaryUrl: null },
  { id: 'gallery-v3', label: 'Gallery Video 3',  section: 'Gallery', type: 'video', localPath: '/assets/vid-31.mp4', cloudinaryUrl: null },
  { id: 'gallery-v4', label: 'Gallery Video 4',  section: 'Gallery', type: 'video', localPath: '/assets/vid-32.mp4', cloudinaryUrl: null },
  { id: 'gallery-v5', label: 'Gallery Video 5',  section: 'Gallery', type: 'video', localPath: '/assets/vid-49.mp4', cloudinaryUrl: null },
  { id: 'gallery-v6', label: 'Gallery Video 6',  section: 'Gallery', type: 'video', localPath: '/assets/vid-50.mp4', cloudinaryUrl: null },
  { id: 'gallery-v7', label: 'Gallery Video 7',  section: 'Gallery', type: 'video', localPath: '/assets/vid-51.mp4', cloudinaryUrl: null },
  { id: 'gallery-v8', label: 'Gallery Video 8',  section: 'Gallery', type: 'video', localPath: '/assets/vid-52.mp4', cloudinaryUrl: null },
]

export function getSlot(id: string): MediaSlot | undefined {
  return MEDIA_SLOTS.find(s => s.id === id)
}

export function getSlotUrl(id: string): string {
  const slot = getSlot(id)
  if (!slot) return ''
  const override = localStorage.getItem(`media_override_${id}`)
  if (override) return override
  return slot.cloudinaryUrl ?? slot.localPath
}
