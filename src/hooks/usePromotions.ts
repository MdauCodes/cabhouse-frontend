import { useState, useEffect } from 'react'

const API = import.meta.env.DEV
  ? 'http://localhost:8081/api'
  : 'https://cabhouse-kisii-backend-production.up.railway.app/api'

const CACHE_KEY = 'cabhouse_promotions'
const CACHE_TTL = 3 * 60 * 1000

export type PromotionTag = 'DEAL' | 'DISCOUNT' | 'NEW' | 'EXPERIENCE' | 'EVENT' | 'SEASONAL'

export interface PromotionData {
  id: string
  title: string
  subtitle: string | null
  tag: PromotionTag
  ctaLabel: string | null
  ctaUrl: string | null
  imageUrl: string | null
  active: boolean
  expiresAt: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
}

let moduleList: PromotionData[] | null = null
let listeners: Array<(list: PromotionData[]) => void> = []
let fetchStarted = false

function readCache(): PromotionData[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL) return null
    return parsed.data as PromotionData[]
  } catch {
    return null
  }
}

function writeCache(data: PromotionData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

function notify(data: PromotionData[]) {
  moduleList = data
  listeners.forEach(l => l(data))
}

async function fetchPromotions() {
  if (fetchStarted) return
  fetchStarted = true
  try {
    const res = await fetch(`${API}/promotions/public`)
    if (!res.ok) throw new Error('fetch failed')
    const json = await res.json()
    const data = json.data as PromotionData[]
    writeCache(data)
    notify(data)
  } catch {
    fetchStarted = false
  }
}

export function usePromotions(): PromotionData[] {
  const [list, setList] = useState<PromotionData[]>(() => moduleList ?? readCache() ?? [])

  useEffect(() => {
    const listener = (l: PromotionData[]) => setList(l)
    listeners.push(listener)
    fetchPromotions()
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  return list
}

export function invalidatePromotionsCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
  fetchStarted = false
  moduleList = null
}
