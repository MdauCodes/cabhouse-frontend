import { useState, useRef, useEffect } from 'react'
import {
  Upload, Check, Settings, Image, RefreshCw, Copy, ExternalLink,
  ChevronDown, Users, TicketPercent, FileText, Activity,
  LogOut, Menu, X, Plus, Eye, EyeOff, Search, Loader2,
} from 'lucide-react'
import { MEDIA_SLOTS, type MediaSlot, getSlotUrl } from '../config/media'
import { applyOverride, clearOverride } from '../hooks/useMedia'
import { api, staffAuth } from '../lib/api'

// ── Auth storage ─────────────────────────────────────────────────────────────
const ADMIN_TOKEN_KEY = 'cabhouse_admin_token'
const ADMIN_USER_KEY  = 'cabhouse_admin_user'

interface AdminSession { accessToken: string; username: string; role: string }

function getSession(): AdminSession | null {
  try {
    const t = localStorage.getItem(ADMIN_TOKEN_KEY)
    const u = localStorage.getItem(ADMIN_USER_KEY)
    return t && u ? { accessToken: t, ...JSON.parse(u) } : null
  } catch { return null }
}
function saveSession(data: { accessToken: string; username: string; role: string }) {
  localStorage.setItem(ADMIN_TOKEN_KEY, data.accessToken)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ username: data.username, role: data.role }))
  staffAuth.setToken(data.accessToken)
}
function clearSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  staffAuth.clear()
}

// ── Cloudinary config ─────────────────────────────────────────────────────────
const CLD_CLOUD_KEY  = 'cld_cloud_name'
const CLD_PRESET_KEY = 'cld_upload_preset'
function getClds() {
  return { cloudName: localStorage.getItem(CLD_CLOUD_KEY) ?? '', uploadPreset: localStorage.getItem(CLD_PRESET_KEY) ?? '' }
}

interface UploadedAsset { url: string; publicId: string; type: 'image' | 'video'; bytes: number; format: string }

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/4 border border-white/10 rounded-2xl ${className}`}>{children}</div>
  )
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-white/50 text-xs uppercase tracking-widest mb-2">{children}</p>
}
function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-amber-500/60 transition-colors ${className}`}
    />
  )
}
function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-amber-500/60 transition-colors resize-none ${className}`}
    />
  )
}
function Btn({
  children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', className = ''
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}) {
  const base = 'inline-flex items-center gap-2 font-body font-semibold rounded-xl transition-all disabled:opacity-40'
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-amber-600 hover:bg-amber-500 text-white',
    ghost: 'bg-white/6 hover:bg-white/12 text-white/70 hover:text-white',
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400',
    success: 'bg-green-600/15 hover:bg-green-600/25 text-green-400',
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}
function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'gold' | 'green' | 'blue' | 'purple' | 'gray' | 'red' }) {
  const colors = {
    gold:   'bg-amber-500/15 text-amber-400',
    green:  'bg-green-500/15 text-green-400',
    blue:   'bg-blue-500/15 text-blue-400',
    purple: 'bg-purple-500/15 text-purple-400',
    gray:   'bg-white/8 text-white/50',
    red:    'bg-red-500/15 text-red-400',
  }
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${colors[color]}`}>{children}</span>
}
function Spinner() {
  return <Loader2 size={16} className="animate-spin text-white/40" />
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLogin({ onLogin }: { onLogin: (s: AdminSession) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.post<{ accessToken: string; username: string; role: string }>(
        '/auth/login', { username, password }
      )
      if (data.role === 'STAFF') throw new Error('Staff accounts use the POS terminal — not the admin panel')
      saveSession(data)
      onLogin(data)
    } catch (err: any) {
      setError(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 text-center mb-2">CabHouse</p>
        <h1 className="font-display font-black text-white text-2xl text-center mb-1" style={{ letterSpacing: '-0.03em' }}>Admin Panel</h1>
        <p className="text-white/30 text-sm text-center mb-10">Sign in with your admin credentials</p>
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <Label>Username</Label>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required autoFocus />
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="pr-11" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Btn type="submit" disabled={loading} className="w-full justify-center mt-2">
            {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
          </Btn>
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHELL
// ═══════════════════════════════════════════════════════════════════════════════
type Tab = 'media' | 'patrons' | 'coupons' | 'users' | 'services' | 'activity'

const NAV: { id: Tab; label: string; Icon: any; roles: string[] }[] = [
  { id: 'media',    label: 'Media',     Icon: Image,          roles: ['SUPERADMIN','ADMIN'] },
  { id: 'patrons',  label: 'Patrons',   Icon: Users,          roles: ['SUPERADMIN','ADMIN'] },
  { id: 'coupons',  label: 'Coupons',   Icon: TicketPercent,  roles: ['SUPERADMIN','ADMIN'] },
  { id: 'services', label: 'Services',  Icon: FileText,       roles: ['SUPERADMIN','ADMIN'] },
  { id: 'users',    label: 'Users',     Icon: Settings,       roles: ['SUPERADMIN','ADMIN'] },
  { id: 'activity', label: 'Activity',  Icon: Activity,       roles: ['SUPERADMIN','ADMIN'] },
]

function AdminDashboard({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('media')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = session.accessToken

  const allowedNav = NAV.filter(n => n.roles.includes(session.role))

  function navigate(t: Tab) { setTab(t); setSidebarOpen(false) }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-body flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-gray-900 border-r border-white/8 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/8">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-0.5">CabHouse</p>
          <p className="font-display font-black text-white text-sm" style={{ letterSpacing: '-0.02em' }}>Admin Panel</p>
          <p className="text-white/30 text-[10px] mt-1">{session.username} · {session.role}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {allowedNav.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                tab === id
                  ? 'bg-amber-600/20 text-amber-400 font-semibold'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/8">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all">
            <LogOut size={15} /> Sign out
          </button>
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all mt-0.5">
            <ExternalLink size={15} /> View Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <p className="font-semibold text-sm text-white capitalize">{tab}</p>
        </div>

        <div className="flex-1 p-5 lg:p-8 overflow-auto">
          {tab === 'media'    && <MediaTab    token={token} />}
          {tab === 'patrons'  && <PatronsTab  token={token} />}
          {tab === 'coupons'  && <CouponsTab  token={token} />}
          {tab === 'services' && <ServicesTab token={token} />}
          {tab === 'users'    && <UsersTab    token={token} session={session} />}
          {tab === 'activity' && <ActivityTab token={token} />}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEDIA TAB (Cloudinary upload + backend slot sync)
// ═══════════════════════════════════════════════════════════════════════════════
function MediaTab({ token }: { token: string }) {
  const [view, setView] = useState<'upload' | 'slots' | 'credentials'>('slots')
  const [creds, setCreds] = useState(getClds)

  function saveCreds() {
    localStorage.setItem(CLD_CLOUD_KEY, creds.cloudName.trim())
    localStorage.setItem(CLD_PRESET_KEY, creds.uploadPreset.trim())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-white">Media Management</h2>
        <div className="flex gap-1">
          {(['slots','upload','credentials'] as const).map(v => (
            <Btn key={v} variant={view === v ? 'primary' : 'ghost'} size="sm" onClick={() => setView(v)}>
              {v === 'slots' ? 'Image Slots' : v === 'upload' ? 'Upload' : 'Cloudinary Config'}
            </Btn>
          ))}
        </div>
      </div>
      {view === 'slots'       && <SlotsTab token={token} creds={creds} />}
      {view === 'upload'      && <UploadTab creds={creds} />}
      {view === 'credentials' && <CredentialsTab creds={creds} setCreds={setCreds} onSave={saveCreds} />}
    </div>
  )
}

function CredentialsTab({ creds, setCreds, onSave }: {
  creds: { cloudName: string; uploadPreset: string }
  setCreds: (c: { cloudName: string; uploadPreset: string }) => void
  onSave: () => void
}) {
  const [saved, setSaved] = useState(false)
  function save() { onSave(); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <Card className="p-6 max-w-lg">
      <h3 className="text-white font-semibold mb-5">Cloudinary Credentials</h3>
      <div className="space-y-4">
        <div><Label>Cloud Name</Label><Input value={creds.cloudName} onChange={e => setCreds({ ...creds, cloudName: e.target.value })} placeholder="e.g. my-cloud" /></div>
        <div><Label>Unsigned Upload Preset</Label><Input value={creds.uploadPreset} onChange={e => setCreds({ ...creds, uploadPreset: e.target.value })} placeholder="e.g. cabhouse_unsigned" /></div>
        <Btn onClick={save}>{saved ? <><Check size={14} /> Saved</> : 'Save'}</Btn>
      </div>
    </Card>
  )
}

function UploadTab({ creds }: { creds: { cloudName: string; uploadPreset: string } }) {
  const [uploads, setUploads] = useState<UploadedAsset[]>(() => {
    try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] }
  })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function saveUploads(list: UploadedAsset[]) { setUploads(list); localStorage.setItem('cld_uploads', JSON.stringify(list)) }

  async function uploadFiles(files: FileList | File[]) {
    if (!creds.cloudName || !creds.uploadPreset) { setError('Set Cloudinary credentials first.'); return }
    setError(null); setUploading(true); setProgress(0)
    const arr = Array.from(files); const results: UploadedAsset[] = []
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i]; const fd = new FormData()
      fd.append('file', file); fd.append('upload_preset', creds.uploadPreset); fd.append('folder', 'cabhouse')
      const rt = file.type.startsWith('video') ? 'video' : 'image'
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${creds.cloudName}/${rt}/upload`, { method: 'POST', body: fd })
        if (!res.ok) throw new Error(res.statusText)
        const d = await res.json()
        results.push({ url: d.secure_url, publicId: d.public_id, type: rt, bytes: d.bytes, format: d.format })
      } catch (err) { setError(`Failed: ${file.name}`) }
      setProgress(Math.round(((i + 1) / arr.length) * 100))
    }
    saveUploads([...results, ...uploads]); setUploading(false)
  }

  return (
    <div className="max-w-3xl">
      <div
        className="border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-2xl p-14 text-center cursor-pointer transition-all"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); e.dataTransfer.files.length && uploadFiles(e.dataTransfer.files) }}
      >
        <Upload size={28} className="mx-auto text-white/30 mb-3" />
        <p className="text-white/50 text-sm">Drag & drop images here or click to browse</p>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && uploadFiles(e.target.files)} />
      </div>
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/40 mb-1"><span>Uploading…</span><span>{progress}%</span></div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {uploads.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-sm font-semibold">{uploads.length} uploaded</p>
            <button onClick={() => saveUploads([])} className="text-xs text-white/30 hover:text-red-400 transition-colors">Clear all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {uploads.map(a => (
              <div key={a.publicId} className="group relative rounded-xl overflow-hidden aspect-square bg-white/5 border border-white/10">
                <img src={a.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => { navigator.clipboard.writeText(a.url) }} className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Copy size={10} /> Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SlotsTab({ token, creds }: { token: string; creds: { cloudName: string; uploadPreset: string } }) {
  const [uploads] = useState<UploadedAsset[]>(() => {
    try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] }
  })
  const [backendSlots, setBackendSlots] = useState<Record<string, string | null>>({})
  const sections = [...new Set(MEDIA_SLOTS.map(s => s.section))]
  const [openSection, setOpenSection] = useState(sections[0])

  useEffect(() => {
    api.get<{ slotId: string; cloudinaryUrl: string | null }[]>('/content/media-slots', token)
      .then(slots => {
        const map: Record<string, string | null> = {}
        slots.forEach(s => { map[s.slotId] = s.cloudinaryUrl })
        setBackendSlots(map)
      }).catch(() => {})
  }, [token])

  async function applySlot(slotId: string, url: string) {
    await api.put(`/content/media-slots/${slotId}`, { cloudinaryUrl: url }, token)
    setBackendSlots(prev => ({ ...prev, [slotId]: url }))
    applyOverride(slotId, url)
  }

  async function resetSlot(slotId: string) {
    await api.del(`/content/media-slots/${slotId}`, token)
    setBackendSlots(prev => ({ ...prev, [slotId]: null }))
    clearOverride(slotId)
  }

  return (
    <div className="max-w-4xl space-y-3">
      {sections.map(section => {
        const slots = MEDIA_SLOTS.filter(s => s.section === section)
        const isOpen = openSection === section
        return (
          <Card key={section}>
            <button onClick={() => setOpenSection(isOpen ? '' : section)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-sm">{section}</span>
                <Badge color="gray">{slots.length} slots</Badge>
              </div>
              <ChevronDown size={15} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="border-t border-white/8 divide-y divide-white/5">
                {slots.map(slot => (
                  <SlotRow key={slot.id} slot={slot} uploads={uploads}
                    backendUrl={backendSlots[slot.id] ?? null}
                    onApply={applySlot} onReset={resetSlot} />
                ))}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function SlotRow({ slot, uploads, backendUrl, onApply, onReset }: {
  slot: MediaSlot; uploads: UploadedAsset[]
  backendUrl: string | null
  onApply: (id: string, url: string) => Promise<void>
  onReset: (id: string) => Promise<void>
}) {
  const displayUrl = backendUrl ?? getSlotUrl(slot.id)
  const [manual, setManual] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  async function apply(url: string) {
    setSaving(true)
    try { await onApply(slot.id, url); setManual(''); setShowPicker(false) }
    finally { setSaving(false) }
  }
  async function reset() {
    setSaving(true)
    try { await onReset(slot.id) } finally { setSaving(false) }
  }

  return (
    <div className="px-5 py-4 flex gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
        {displayUrl ? <img src={displayUrl} alt={slot.alt} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center"><Image size={18} className="text-white/20" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-white text-sm font-semibold">{slot.label}</p>
          <span className="text-white/30 text-xs">{slot.id}</span>
          {backendUrl && <Badge color="gold">Live</Badge>}
        </div>
        {displayUrl && <p className="text-white/25 text-[10px] font-mono truncate mb-2">{displayUrl}</p>}
        {uploads.length > 0 && (
          <div className="mb-2">
            <button onClick={() => setShowPicker(!showPicker)} className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
              Pick from uploads <ChevronDown size={10} className={showPicker ? 'rotate-180' : ''} />
            </button>
            {showPicker && (
              <div className="mt-2 flex flex-wrap gap-2">
                {uploads.map(u => (
                  <button key={u.publicId} onClick={() => apply(u.url)}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 transition-colors">
                    <img src={u.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <input value={manual} onChange={e => setManual(e.target.value)} onKeyDown={e => e.key === 'Enter' && manual.trim() && apply(manual.trim())}
            placeholder="Paste Cloudinary URL and press Enter…"
            className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-amber-500/60 font-mono" />
          <Btn size="sm" disabled={!manual.trim() || saving} onClick={() => apply(manual.trim())}>
            {saving ? <Spinner /> : 'Apply'}
          </Btn>
          {backendUrl && <Btn size="sm" variant="ghost" onClick={reset} disabled={saving}><RefreshCw size={12} /></Btn>}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATRONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface PatronRow { id: string; name: string; phone: string; couponBalance: number; createdAt: string; active: boolean }

function PatronsTab({ token }: { token: string }) {
  const [patrons, setPatrons] = useState<PatronRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const qs = query ? `&search=${encodeURIComponent(query)}` : ''
    api.get<{ content: PatronRow[]; totalElements: number }>(`/patrons?page=${page}&size=20${qs}`, token)
      .then(d => { setPatrons(d.content); setTotal(d.totalElements) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, query, token])

  function doSearch() { setPage(0); setQuery(search) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Patrons</h2>
          <p className="text-white/40 text-sm mt-0.5">{total} enrolled patron{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-5 max-w-md">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <Input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="Search by name…" className="pl-9" />
        </div>
        <Btn onClick={doSearch}>Search</Btn>
        {query && <Btn variant="ghost" onClick={() => { setSearch(''); setQuery(''); setPage(0) }}>Clear</Btn>}
      </div>

      <Card>
        {loading ? (
          <div className="py-16 flex justify-center"><Spinner /></div>
        ) : patrons.length === 0 ? (
          <p className="py-12 text-center text-white/30 text-sm">No patrons found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Name','Phone','Coupons','Status','Enrolled'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-white/40 text-xs uppercase tracking-widest font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {patrons.map(p => (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 text-white font-semibold">{p.name}</td>
                    <td className="px-5 py-3.5 text-white/60 font-mono text-xs">{p.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-display font-bold text-amber-400">{p.couponBalance}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge color={p.active ? 'green' : 'red'}>{p.active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/8">
            <p className="text-white/40 text-xs">Page {page + 1} of {Math.ceil(total / 20)}</p>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Btn>
              <Btn size="sm" variant="ghost" disabled={(page + 1) * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUPONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function CouponsTab({ token }: { token: string }) {
  const [base, setBase] = useState('')
  const [value, setValue] = useState('')
  const [current, setCurrent] = useState<{ baseAmount: string; couponValue: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<{ baseAmount: string; couponValue: string }>('/coupons/settings', token)
      .then(d => { setCurrent(d); setBase(String(d.baseAmount)); setValue(String(d.couponValue)) })
      .catch(() => {})
  }, [token])

  async function save() {
    setError(''); setSaving(true)
    try {
      const d = await api.put<{ baseAmount: string; couponValue: string }>(
        '/coupons/settings', { baseAmount: parseFloat(base), couponValue: parseFloat(value) }, token
      )
      setCurrent(d); setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  const preview = base && value ? [500, 1000, 2000, 5000, 10000].map(spend => ({
    spend, coupons: Math.floor(spend / parseFloat(base)), discount: Math.floor(spend / parseFloat(base)) * parseFloat(value)
  })) : []

  return (
    <div className="max-w-2xl">
      <h2 className="font-display font-bold text-xl text-white mb-6">Coupon Settings</h2>

      <Card className="p-6 mb-6">
        <h3 className="text-white font-semibold mb-1">Earning Rate</h3>
        <p className="text-white/40 text-sm mb-5">Define how much a patron must spend to earn one coupon, and how much each coupon is worth when redeemed.</p>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <Label>Spend per coupon (KES)</Label>
            <Input type="number" min="1" value={base} onChange={e => { setBase(e.target.value); setSaved(false) }} placeholder="e.g. 500" />
            <p className="text-white/30 text-xs mt-1">Patron earns 1 coupon for every this amount spent</p>
          </div>
          <div>
            <Label>Coupon value (KES)</Label>
            <Input type="number" min="1" value={value} onChange={e => { setValue(e.target.value); setSaved(false) }} placeholder="e.g. 50" />
            <p className="text-white/30 text-xs mt-1">Discount value when a patron redeems 1 coupon</p>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <Btn onClick={save} disabled={!base || !value || saving}>
          {saving ? <><Spinner /> Saving…</> : saved ? <><Check size={14} /> Saved</> : 'Save Settings'}
        </Btn>

        {current && (
          <p className="text-white/30 text-xs mt-4">
            Current live: KES {Number(current.baseAmount).toLocaleString()} = 1 coupon · 1 coupon = KES {Number(current.couponValue).toLocaleString()}
          </p>
        )}
      </Card>

      {preview.length > 0 && (
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4">Preview — what patrons earn</h3>
          <div className="space-y-2">
            {preview.map(p => (
              <div key={p.spend} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/60 text-sm">KES {p.spend.toLocaleString()} spend</span>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400 font-bold text-sm">{p.coupons} coupon{p.coupons !== 1 ? 's' : ''}</span>
                  <span className="text-white/30 text-xs">= KES {p.discount.toLocaleString()} value</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface ServiceRow { id: string; serviceKey: string; title: string; description: string; visible: boolean; displayOrder: number }

function ServicesTab({ token }: { token: string }) {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<ServiceRow[]>('/content/services', token).then(setServices).catch(() => {})
  }, [token])

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const updated = await api.put<ServiceRow>(`/content/services/${editing.id}`, {
        title: editing.title, description: editing.description,
        visible: editing.visible, displayOrder: editing.displayOrder,
      }, token)
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s))
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {} finally { setSaving(false) }
  }

  return (
    <div>
      <h2 className="font-display font-bold text-xl text-white mb-6">CMS Services</h2>
      <div className="grid lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-2">
          {services.map(s => (
            <button key={s.id} onClick={() => { setEditing({ ...s }); setSaved(false) }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                editing?.id === s.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/8 bg-white/4 hover:bg-white/7'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold text-sm">{s.title}</span>
                <Badge color={s.visible ? 'green' : 'gray'}>{s.visible ? 'Visible' : 'Hidden'}</Badge>
              </div>
              <p className="text-white/40 text-xs line-clamp-2">{s.description}</p>
            </button>
          ))}
        </div>

        {/* Editor */}
        {editing && (
          <Card className="p-5 h-fit">
            <h3 className="text-white font-semibold mb-4 text-sm">Editing: {editing.serviceKey}</h3>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex items-center gap-4">
                <div className="flex-1"><Label>Display Order</Label>
                  <Input type="number" min="0" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Visibility</Label>
                  <button onClick={() => setEditing({ ...editing, visible: !editing.visible })}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      editing.visible ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10'
                    }`}>
                    {editing.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
              <Btn onClick={save} disabled={saving}>
                {saving ? <><Spinner /> Saving…</> : saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
              </Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface UserRow { id: string; email: string; username: string; role: string; active: boolean; createdAt: string }

function UsersTab({ token, session }: { token: string; session: AdminSession }) {
  const [roleFilter, setRoleFilter] = useState<'ADMIN' | 'STAFF'>('ADMIN')
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<UserRow | null>(null)

  function load() {
    setLoading(true)
    api.get<{ content: UserRow[] }>(`/users?role=${roleFilter}&size=50`, token)
      .then(d => setUsers(d.content)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [roleFilter, token])

  const roleColor: Record<string, 'gold' | 'blue' | 'purple'> = { SUPERADMIN: 'gold', ADMIN: 'blue', STAFF: 'purple' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-white">Users</h2>
        <Btn onClick={() => setShowCreate(true)}><Plus size={14} /> Add User</Btn>
      </div>

      <div className="flex gap-1 mb-5">
        {(['ADMIN','STAFF'] as const).map(r => (
          <Btn key={r} variant={roleFilter === r ? 'primary' : 'ghost'} size="sm" onClick={() => setRoleFilter(r)}>{r}</Btn>
        ))}
      </div>

      <Card>
        {loading ? <div className="py-16 flex justify-center"><Spinner /></div>
        : users.length === 0 ? <p className="py-12 text-center text-white/30 text-sm">No {roleFilter.toLowerCase()}s yet</p>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Username','Email','Role','Status','Created',''].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 text-white/40 text-xs uppercase tracking-widest font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 text-white font-semibold">{u.username}</td>
                    <td className="px-5 py-3.5 text-white/50 text-xs">{u.email}</td>
                    <td className="px-5 py-3.5"><Badge color={roleColor[u.role] ?? 'gray'}>{u.role}</Badge></td>
                    <td className="px-5 py-3.5"><Badge color={u.active ? 'green' : 'red'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-5 py-3.5 text-white/30 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      {u.id !== session.accessToken && (
                        <Btn size="sm" variant="ghost" onClick={() => setResetTarget(u)}>Reset PW</Btn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showCreate && <CreateUserModal token={token} onDone={() => { setShowCreate(false); load() }} onClose={() => setShowCreate(false)} />}
      {resetTarget && <ResetPasswordModal token={token} user={resetTarget} onDone={() => setResetTarget(null)} onClose={() => setResetTarget(null)} />}
    </div>
  )
}

function CreateUserModal({ token, onDone, onClose }: { token: string; onDone: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'STAFF' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.post('/users', form, token)
      onDone()
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl p-6 bg-gray-900 border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Add User</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" required /></div>
          <div><Label>Username</Label><Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" required /></div>
          <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="min 8 characters" required /></div>
          <div>
            <Label>Role</Label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Btn type="button" variant="ghost" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
            <Btn type="submit" disabled={loading} className="flex-1 justify-center">{loading ? <><Spinner /> Creating…</> : 'Create'}</Btn>
          </div>
        </form>
      </div>
    </div>
  )
}

function ResetPasswordModal({ token, user, onDone, onClose }: { token: string; user: UserRow; onDone: () => void; onClose: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.patch(`/users/${user.id}/password`, { newPassword: pw }, token)
      setDone(true); setTimeout(onDone, 1500)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl p-6 bg-gray-900 border border-white/10" onClick={e => e.stopPropagation()}>
        <h3 className="text-white font-bold text-lg mb-1">Reset Password</h3>
        <p className="text-white/40 text-sm mb-5">{user.username}</p>
        {done ? (
          <p className="text-green-400 text-sm flex items-center gap-2"><Check size={16} /> Password updated</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div><Label>New Password</Label><Input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="min 8 characters" required /></div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2 pt-1">
              <Btn type="button" variant="ghost" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
              <Btn type="submit" disabled={loading || pw.length < 8} className="flex-1 justify-center">{loading ? <><Spinner /> Saving…</> : 'Reset'}</Btn>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface LogRow { id: string; actorId: string; action: string; entityType: string; entityId: string; detail: string | null; createdAt: string }

function ActivityTab({ token }: { token: string }) {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get<{ content: LogRow[]; totalElements: number }>(`/activity?page=${page}&size=50`, token)
      .then(d => { setLogs(d.content); setTotal(d.totalElements) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [page, token])

  const actionColor: Record<string, 'green' | 'gold' | 'red' | 'blue' | 'gray'> = {
    ENROLL_PATRON: 'green', RECORD_SPEND: 'gold', REDEEM_COUPONS: 'blue',
    CREATE_USER: 'green', DEACTIVATE_USER: 'red', UPDATE_COUPON_SETTINGS: 'gold',
    UPDATE_MEDIA_SLOT: 'blue', CLEAR_MEDIA_SLOT: 'gray',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Activity Log</h2>
          <p className="text-white/40 text-sm mt-0.5">{total} recorded action{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <Card>
        {loading ? <div className="py-16 flex justify-center"><Spinner /></div>
        : logs.length === 0 ? <p className="py-12 text-center text-white/30 text-sm">No activity yet</p>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Action','Entity','Detail','Time'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-white/40 text-xs uppercase tracking-widest font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <Badge color={actionColor[l.action] ?? 'gray'}>{l.action.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-5 py-3 text-white/50 text-xs">{l.entityType}</td>
                    <td className="px-5 py-3 text-white/40 text-xs max-w-[200px] truncate">{l.detail ?? '—'}</td>
                    <td className="px-5 py-3 text-white/30 text-xs whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 50 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/8">
            <p className="text-white/40 text-xs">Page {page + 1} of {Math.ceil(total / 50)}</p>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Btn>
              <Btn size="sm" variant="ghost" disabled={(page + 1) * 50 >= total} onClick={() => setPage(p => p + 1)}>Next</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
export default function MdauDev() {
  const [session, setSession] = useState<AdminSession | null>(getSession)

  function handleLogout() { clearSession(); setSession(null) }

  return session
    ? <AdminDashboard session={session} onLogout={handleLogout} />
    : <AdminLogin onLogin={setSession} />
}
