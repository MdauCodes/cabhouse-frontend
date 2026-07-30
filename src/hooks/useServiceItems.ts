import { useState, useEffect } from 'react'

const API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'

const CACHE_KEY = 'cabhouse_service_items'
const CACHE_TTL = 5 * 60 * 1000

export interface ServiceImageData {
  id: string
  cloudinaryUrl: string
  label: string
  displayOrder: number
}

export interface ServiceItemData {
  id: string
  category: string
  slug: string
  title: string
  description: string
  price: string | null
  tag: string | null
  displayOrder: number
  visible: boolean
  images: ServiceImageData[]
}

type CategoryMap = Record<string, ServiceItemData[]>

let moduleMap: CategoryMap | null = null
let listeners: Array<(map: CategoryMap) => void> = []
let fetchStarted = false

function readCache(): CategoryMap | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL) return null
    return parsed.data as CategoryMap
  } catch {
    return null
  }
}

function writeCache(data: CategoryMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

function notify(data: CategoryMap) {
  moduleMap = data
  listeners.forEach(l => l(data))
}

async function fetchAllItems() {
  if (fetchStarted) return
  fetchStarted = true
  try {
    const res = await fetch(`${API}/service-items/public?category=PARK_ACTIVITY`)
    if (!res.ok) throw new Error('fetch failed')
    // fetch all categories in parallel
    const categories = [
      'PARK_ACTIVITY', 'PARK_PACKAGE', 'PARK_STAY', 'PARK_DINING',
      'APT_UNIT', 'WATER_USE', 'WATER_FORMAT',
    ]
    const results = await Promise.all(
      categories.map(cat =>
        fetch(`${API}/service-items/public?category=${cat}`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(j => ({ cat, items: j.data as ServiceItemData[] }))
          .catch(() => ({ cat, items: [] as ServiceItemData[] }))
      )
    )
    const map: CategoryMap = {}
    for (const { cat, items } of results) map[cat] = items
    writeCache(map)
    notify(map)
  } catch {
    fetchStarted = false
  }
}

export function useServiceItems(category?: string): ServiceItemData[] {
  const [map, setMap] = useState<CategoryMap>(() => moduleMap ?? readCache() ?? {})

  useEffect(() => {
    const listener = (m: CategoryMap) => setMap(m)
    listeners.push(listener)
    fetchAllItems()
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  if (!category) return []
  return map[category] ?? []
}

export function invalidateServiceItemsCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
  fetchStarted = false
  moduleMap = null
}
