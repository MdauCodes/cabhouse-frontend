const PROD_API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'
const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? PROD_API : PROD_API)

// ── Token storage keys ───────────────────────────────────────────────────────
const STAFF_TOKEN_KEY    = 'cabhouse_staff_token'
const ADMIN_TOKEN_KEY    = 'cabhouse_admin_token'
const ADMIN_REFRESH_KEY  = 'cabhouse_admin_refresh'
const ADMIN_USER_KEY     = 'cabhouse_admin_user'
const PATRON_TOKEN_KEY   = 'cabhouse_patron_token'
const PATRON_SESSION_KEY = 'cabhouse_patron_session'

// ── Unauthorized event — fired when token refresh fails ──────────────────────
export const UNAUTHORIZED_EVENT = 'cabhouse:unauthorized'
function emitUnauthorized() {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}

// ── Token refresh (admin only) ───────────────────────────────────────────────
let refreshPromise: Promise<string | null> | null = null

async function attemptRefresh(): Promise<string | null> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY)
    if (!refreshToken) return null
    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) return null
      const { accessToken, refreshToken: newRefresh } = json.data as {
        accessToken: string; refreshToken: string | null
      }
      adminAuth.setSession(accessToken, newRefresh)
      return accessToken
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

// ── Core request ─────────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
  _isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok || !json.success) {
    // On 401, try refreshing the access token once then retry
    if (res.status === 401 && !_isRetry && token === adminAuth.getToken()) {
      const newToken = await attemptRefresh()
      if (newToken) {
        return request<T>(path, options, newToken, true)
      }
      // Refresh failed — notify listeners so the UI can log out
      emitUnauthorized()
    }
    const err = new Error(json.message ?? `Request failed: ${res.status}`) as Error & { status: number }
    err.status = res.status
    throw err
  }
  return json.data as T
}

export const api = {
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET' }, token),

  put: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token),

  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token),

  del: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'DELETE' }, token),
}

// ── Auth helpers ─────────────────────────────────────────────────────────────
export const staffAuth = {
  getToken: () => localStorage.getItem(STAFF_TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(STAFF_TOKEN_KEY, t),
  clear: () => localStorage.removeItem(STAFF_TOKEN_KEY),
}

export const adminAuth = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  /** Call after login (pass refreshToken) or after a token refresh (pass newRefreshToken). */
  setSession: (accessToken: string, refreshToken: string | null, username?: string, role?: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(ADMIN_REFRESH_KEY, refreshToken)
    if (username !== undefined && role !== undefined) {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ username, role }))
    }
    staffAuth.setToken(accessToken)
  },
  clear: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_REFRESH_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
    staffAuth.clear()
  },
}

export const patronAuth = {
  getToken: () => localStorage.getItem(PATRON_TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(PATRON_TOKEN_KEY, t),
  clear: () => localStorage.removeItem(PATRON_TOKEN_KEY),
}

export const patronSession = {
  get: () => {
    const raw = sessionStorage.getItem(PATRON_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },
  set: (data: unknown) => sessionStorage.setItem(PATRON_SESSION_KEY, JSON.stringify(data)),
  clear: () => sessionStorage.removeItem(PATRON_SESSION_KEY),
}
