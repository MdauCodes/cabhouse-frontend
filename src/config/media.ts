// ─── Media Configuration ────────────────────────────────────────────────────
// Each slot: localPath = public/assets/ fallback, cloudinaryUrl = production URL.
// /ch/admin panel manages uploads and applies overrides via localStorage.
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

  // ── Park — Your Playground (dedicated, not shared with Hero slides) ───────
  { id: 'pdd-push-limits', label: 'Push Your Limits Panel', section: 'Park Playground', type: 'image', localPath: '/assets/hero-10.png', cloudinaryUrl: null, alt: '100m rainbow slide' },
  { id: 'pdd-play-day',    label: 'Play All Day Panel',     section: 'Park Playground', type: 'image', localPath: '/assets/raw-60.jpeg', cloudinaryUrl: null, alt: 'Bumper cars at CabHouse Park' },

  // ── Gallery (3 images + 8 videos) ────────────────────────────────────────
  { id: 'gallery-1',  label: 'Gallery Image 1', section: 'Gallery', type: 'image', localPath: '/assets/raw-8.jpeg', cloudinaryUrl: null, alt: 'Rope bridge' },
  { id: 'gallery-2',  label: 'Gallery Image 2', section: 'Gallery', type: 'image', localPath: '/assets/raw-4.jpeg', cloudinaryUrl: null, alt: 'Group rope course' },
  { id: 'gallery-3',  label: 'Gallery Image 3', section: 'Gallery', type: 'image', localPath: '/assets/hero-3.webp', cloudinaryUrl: null, alt: 'CabHouse Park' },
  { id: 'gallery-v1', label: 'Gallery Video 1',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/4af0df44d799f35d39ae697c6e7f9e58_1783922443120.mp4', cloudinaryUrl: null },
  { id: 'gallery-v2', label: 'Gallery Video 2',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/51c6138def58311b20d61b7011a55c0d_1783925968206.mp4',  cloudinaryUrl: null },
  { id: 'gallery-v3', label: 'Gallery Video 3',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/99f343f855506e7be8bd476d8a43c2e9_1783925919420.mp4',  cloudinaryUrl: null },
  { id: 'gallery-v4', label: 'Gallery Video 4',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/d05eae8a47403e5e4b10b718dc29acdf_1783926120068.mp4',  cloudinaryUrl: null },
  { id: 'gallery-v5', label: 'Gallery Video 5',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/d25a549f5bc833357bbce4d28caf846f_1783925991247.mp4',  cloudinaryUrl: null },
  { id: 'gallery-v6', label: 'Gallery Video 6',  section: 'Gallery', type: 'video', localPath: '/assets/raw-56.mp4', cloudinaryUrl: null },
  { id: 'gallery-v7', label: 'Gallery Video 7',  section: 'Gallery', type: 'video', localPath: '/assets/more-videos/ebb227e92d423cc1f0e366a0c3a10ab6_1783926433436.mp4',  cloudinaryUrl: null },
  { id: 'gallery-v8', label: 'Gallery Video 8',  section: 'Gallery', type: 'video', localPath: '/assets/raw-31.mp4', cloudinaryUrl: null },
  { id: 'gallery-v9',  label: 'Gallery Video 9',  section: 'Gallery', type: 'video', localPath: '/assets/raw-21.mp4', cloudinaryUrl: null },
  { id: 'gallery-v10', label: 'Gallery Video 10', section: 'Gallery', type: 'video', localPath: '/assets/raw-20.mp4', cloudinaryUrl: null },
  { id: 'gallery-v11', label: 'Gallery Video 11', section: 'Gallery', type: 'video', localPath: '/assets/raw-32.mp4', cloudinaryUrl: null },
  { id: 'gallery-v12', label: 'Gallery Video 12', section: 'Gallery', type: 'video', localPath: '/assets/raw-55.mp4', cloudinaryUrl: null },
  { id: 'gallery-v13', label: 'Gallery Video 13', section: 'Gallery', type: 'video', localPath: '/assets/raw-49.mp4', cloudinaryUrl: null },
  { id: 'gallery-v14', label: 'Gallery Video 14', section: 'Gallery', type: 'video', localPath: '/assets/raw-50.mp4', cloudinaryUrl: null },
  { id: 'gallery-v15', label: 'Gallery Video 15', section: 'Gallery', type: 'video', localPath: '/assets/raw-51.mp4', cloudinaryUrl: null },
  { id: 'gallery-v16', label: 'Gallery Video 16', section: 'Gallery', type: 'video', localPath: '/assets/raw-52.mp4', cloudinaryUrl: null },
  { id: 'gallery-v17', label: 'Gallery Video 17', section: 'Gallery', type: 'video', localPath: '/assets/raw-53.mp4', cloudinaryUrl: null },
  { id: 'gallery-v18', label: 'Gallery Video 18', section: 'Gallery', type: 'video', localPath: '/assets/raw-54.mp4', cloudinaryUrl: null },
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
