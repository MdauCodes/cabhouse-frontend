import { useState, useEffect } from 'react'
import { getSlotUrl, MEDIA_SLOTS, type MediaSlot } from '../config/media'

export function useMediaUrl(id: string): string {
  const [url, setUrl] = useState(() => getSlotUrl(id))

  useEffect(() => {
    const handler = () => setUrl(getSlotUrl(id))
    window.addEventListener('media-config-updated', handler)
    return () => window.removeEventListener('media-config-updated', handler)
  }, [id])

  return url
}

export function useAllSlots(): MediaSlot[] {
  return MEDIA_SLOTS
}

export function applyOverride(id: string, url: string) {
  localStorage.setItem(`media_override_${id}`, url)
  window.dispatchEvent(new Event('media-config-updated'))
}

export function clearOverride(id: string) {
  localStorage.removeItem(`media_override_${id}`)
  window.dispatchEvent(new Event('media-config-updated'))
}
