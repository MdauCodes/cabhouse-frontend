const PROD_API = 'https://cabhouse-kisii-backend-production.up.railway.app/api'
const BASE = import.meta.env.DEV ? 'http://localhost:8081/api' : PROD_API

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Request failed: ${res.status}`)
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

// ── Auth token helpers ───────────────────────────────────────────────────────
const STAFF_TOKEN_KEY = 'cabhouse_staff_token'
const PATRON_SESSION_KEY = 'cabhouse_patron_session'

export const staffAuth = {
  getToken: () => localStorage.getItem(STAFF_TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(STAFF_TOKEN_KEY, t),
  clear: () => localStorage.removeItem(STAFF_TOKEN_KEY),
}

export const patronSession = {
  get: () => {
    const raw = sessionStorage.getItem(PATRON_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },
  set: (data: unknown) => sessionStorage.setItem(PATRON_SESSION_KEY, JSON.stringify(data)),
  clear: () => sessionStorage.removeItem(PATRON_SESSION_KEY),
}
