import { useState, useEffect } from 'react'

interface ContentBlock {
  key: string
  value: string
  label: string
  section: string
}

const CACHE_KEY = 'cabhouse_content_blocks'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

type BlockMap = Record<string, string>

// Module-level singleton — one fetch shared across all hook consumers
let moduleMap: BlockMap | null = null
let listeners: Array<(map: BlockMap) => void> = []
let fetchStarted = false

function readCache(): BlockMap | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { map, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return map
  } catch { return null }
}

function writeCache(map: BlockMap) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ map, ts: Date.now() })) } catch {}
}

function notifyListeners(map: BlockMap) {
  moduleMap = map
  listeners.forEach(fn => fn(map))
}

async function fetchBlocks() {
  if (fetchStarted) return
  fetchStarted = true
  try {
    const BASE = import.meta.env.DEV
      ? 'http://localhost:8081/api'
      : 'https://cabhouse-kisii-backend-production.up.railway.app/api'
    const res = await fetch(`${BASE}/content/public/blocks`)
    if (!res.ok) return
    const json = await res.json()
    const blocks: ContentBlock[] = json.data ?? []
    const map: BlockMap = {}
    blocks.forEach(b => { map[b.key] = b.value })
    writeCache(map)
    notifyListeners(map)
  } catch {}
}

export function useContentBlocks() {
  const [map, setMap] = useState<BlockMap>(() => {
    if (moduleMap) return moduleMap
    return readCache() ?? {}
  })

  useEffect(() => {
    const listener = (m: BlockMap) => setMap(m)
    listeners.push(listener)
    fetchBlocks()
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  function get(key: string, fallback: string): string {
    return map[key] ?? fallback
  }

  return { get, map }
}

export function invalidateContentCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
  fetchStarted = false
  moduleMap = null
}
