import { useState, useEffect } from 'react'

const API = import.meta.env.DEV
  ? 'http://localhost:8081/api'
  : 'https://cabhouse-kisii-backend-production.up.railway.app/api'

const CACHE_KEY = 'cabhouse_gallery_images'
const CACHE_TTL = 5 * 60 * 1000

export interface GalleryImageData {
  id: string
  section: string
  cloudinaryUrl: string
  label: string
  displayOrder: number
}

type SectionMap = Record<string, GalleryImageData[]>

let moduleMap: SectionMap | null = null
let listeners: Array<(map: SectionMap) => void> = []
let fetchStarted = false

function readCache(): SectionMap | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL) return null
    return parsed.data as SectionMap
  } catch {
    return null
  }
}

function writeCache(data: SectionMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

function notify(data: SectionMap) {
  moduleMap = data
  listeners.forEach(l => l(data))
}

async function fetchAllSections() {
  if (fetchStarted) return
  fetchStarted = true
  try {
    const sections = ['PARK', 'CAMPING', 'APARTMENTS', 'WATER', 'EVENTS']
    const results = await Promise.all(
      sections.map(sec =>
        fetch(`${API}/gallery/public?section=${sec}`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(j => ({ sec, items: j.data as GalleryImageData[] }))
          .catch(() => ({ sec, items: [] as GalleryImageData[] }))
      )
    )
    const map: SectionMap = {}
    for (const { sec, items } of results) map[sec] = items
    writeCache(map)
    notify(map)
  } catch {
    fetchStarted = false
  }
}

export function useGalleryImages(section?: string): GalleryImageData[] {
  const [map, setMap] = useState<SectionMap>(() => moduleMap ?? readCache() ?? {})

  useEffect(() => {
    const listener = (m: SectionMap) => setMap(m)
    listeners.push(listener)
    fetchAllSections()
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  if (!section) return []
  return map[section] ?? []
}

export function invalidateGalleryCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
  fetchStarted = false
  moduleMap = null
}
