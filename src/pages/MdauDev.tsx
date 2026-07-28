import { useState, useRef, useEffect } from 'react'
import {
  Upload, Check, Image, RefreshCw, Copy,
  ChevronDown, Users, TicketPercent, FileText, Activity,
  LogOut, Menu, X, Plus, Eye, EyeOff, Search, Loader2,
  TrendingUp, ShieldCheck, LayoutGrid,
  ChevronRight, AlertCircle, ArrowUpRight,
  Pencil, ToggleLeft, ToggleRight, CalendarDays,
} from 'lucide-react'
import { MEDIA_SLOTS, type MediaSlot, getSlotUrl } from '../config/media'
import { applyOverride, clearOverride } from '../hooks/useMedia'
import { useContentBlocks, invalidateContentCache } from '../hooks/useContentBlocks'
import { invalidateGalleryCache } from '../hooks/useGalleryImages'
import { api, staffAuth } from '../lib/api'

// ── Auth ─────────────────────────────────────────────────────────────────────
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
function saveSession(d: { accessToken: string; username: string; role: string }) {
  localStorage.setItem(ADMIN_TOKEN_KEY, d.accessToken)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ username: d.username, role: d.role }))
  staffAuth.setToken(d.accessToken)
}
function clearSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  staffAuth.clear()
}

// ── Cloudinary ───────────────────────────────────────────────────────────────
const CLD_CLOUD_KEY  = 'cld_cloud_name'
const CLD_PRESET_KEY = 'cld_upload_preset'
function getClds() {
  return { cloudName: localStorage.getItem(CLD_CLOUD_KEY) ?? '', uploadPreset: localStorage.getItem(CLD_PRESET_KEY) ?? '' }
}
interface UploadedAsset { url: string; publicId: string; type: 'image' | 'video'; bytes: number; format: string }

// ── Primitive UI ──────────────────────────────────────────────────────────────
function Spinner({ size = 16 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin" />
}

function Badge({ children, variant = 'gray' }: {
  children: React.ReactNode
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'red' | 'gray'
}) {
  const cls = {
    green:  'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber:  'bg-amber-50 text-amber-700 ring-amber-100',
    blue:   'bg-blue-50 text-blue-700 ring-blue-100',
    purple: 'bg-violet-50 text-violet-700 ring-violet-100',
    red:    'bg-red-50 text-red-700 ring-red-100',
    gray:   'bg-slate-100 text-slate-600 ring-slate-200',
  }[variant]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  )
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-violet-500','bg-blue-500','bg-emerald-500','bg-amber-500','bg-pink-500','bg-cyan-500']
  const color = colors[initials.charCodeAt(0) % colors.length]
  const sz = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs'
  return (
    <span className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </span>
  )
}

function Card({ children, className = '', padding = true, onClick }: { children: React.ReactNode; className?: string; padding?: boolean; onClick?: () => void }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding ? 'p-5' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, icon: Icon, trend, color = 'blue', onClick }: {
  label: string; value: string | number; sub?: string
  icon: any; trend?: { value: string; up: boolean }
  color?: 'blue' | 'green' | 'amber' | 'purple'
  onClick?: () => void
}) {
  const iconBg = { blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', purple: 'bg-violet-50 text-violet-600' }[color]
  return (
    <Card className={`flex items-start gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`} onClick={onClick}>
      <div className={`p-2.5 rounded-xl ${iconBg}`}><Icon size={18} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-slate-900 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${trend.up ? 'text-emerald-600' : 'text-red-500'}`}>
            <ArrowUpRight size={12} className={trend.up ? '' : 'rotate-90'} /> {trend.value}
          </p>
        )}
      </div>
    </Card>
  )
}

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${className}`} />
  )
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none ${className}`} />
  )
}

function Btn({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', className = '' }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; className?: string
}) {
  const base = 'inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  const variants = {
    primary:   'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
    ghost:     'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    danger:    'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

function EmptyState({ icon: Icon, title, sub }: { icon: any; title: string; sub?: string }) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={22} className="text-slate-400" />
      </div>
      <p className="text-slate-700 font-semibold text-sm mb-1">{title}</p>
      {sub && <p className="text-slate-400 text-xs">{sub}</p>}
    </div>
  )
}

// ── Modal shell ───────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = 'max-w-md' }: {
  title: string; onClose: () => void; children: React.ReactNode; width?: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${width} bg-white rounded-2xl shadow-xl`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
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
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await api.post<{ accessToken: string; username: string; role: string }>('/auth/login', { username, password })
      if (data.role === 'STAFF') throw new Error('Staff accounts use the POS terminal — not the admin panel')
      saveSession(data); onLogin(data)
    } catch (err: any) { setError(err.message ?? 'Invalid credentials') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] bg-slate-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-amber-500 rounded-lg" />
            <span className="text-white font-bold text-lg tracking-tight">CabHouse</span>
          </div>
          <h1 className="text-white text-3xl font-bold leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Manage everything<br />from one place.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Media, patron accounts, coupon settings, staff users, and the full activity log — all wired to your live backend.
          </p>
        </div>
        <div className="space-y-3">
          {['Media slots synced to backend','Real-time patron balances','Coupon earning rate control','Staff user management'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-amber-500 rounded-lg" />
            <span className="text-slate-900 font-bold">CabHouse</span>
          </div>
          <h2 className="text-slate-900 text-2xl font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>Sign in</h2>
          <p className="text-slate-500 text-sm mb-8">Admin and manager accounts only</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <FieldGroup label="Username">
              <Input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your username" required autoFocus />
            </FieldGroup>
            <FieldGroup label="Password">
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </FieldGroup>
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-xs">{error}</p>
              </div>
            )}
            <Btn type="submit" disabled={loading} className="w-full justify-center mt-2 py-2.5">
              {loading ? <><Spinner size={14} /> Signing in…</> : 'Continue'}
            </Btn>
          </form>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHELL
// ═══════════════════════════════════════════════════════════════════════════════
type Tab = 'overview' | 'media' | 'patrons' | 'coupons' | 'bookings' | 'services' | 'sitems' | 'gallery' | 'content' | 'users' | 'activity'

const NAV: { id: Tab; label: string; Icon: any; group: string }[] = [
  { id: 'overview',  label: 'Overview',     Icon: LayoutGrid,    group: 'main' },
  { id: 'patrons',   label: 'Patrons',      Icon: Users,         group: 'main' },
  { id: 'coupons',   label: 'Coupons',      Icon: TicketPercent, group: 'main' },
  { id: 'bookings',  label: 'Bookings',     Icon: CalendarDays,  group: 'main' },
  { id: 'media',     label: 'Media',        Icon: Image,         group: 'content' },
  { id: 'services',  label: 'Services',     Icon: FileText,      group: 'content' },
  { id: 'sitems',    label: 'Service Items', Icon: LayoutGrid,   group: 'content' },
  { id: 'gallery',   label: 'Gallery',      Icon: Image,         group: 'content' },
  { id: 'content',   label: 'Content',      Icon: Pencil,        group: 'content' },
  { id: 'users',     label: 'Users',        Icon: ShieldCheck,   group: 'system' },
  { id: 'activity',  label: 'Activity',     Icon: Activity,      group: 'system' },
]

const PAGE_TITLES: Record<Tab, string> = {
  overview: 'Overview', media: 'Media', patrons: 'Patrons',
  coupons: 'Coupons', bookings: 'Bookings', services: 'Services', sitems: 'Service Items',
  gallery: 'Gallery', content: 'Content Blocks', users: 'Users', activity: 'Activity Log',
}

function Sidebar({ tab, onTab, onLogout, session, open, onClose }: {
  tab: Tab; onTab: (t: Tab) => void; onLogout: () => void; session: AdminSession; open: boolean; onClose: () => void
}) {
  const groups = [
    { label: 'Main', items: NAV.filter(n => n.group === 'main') },
    { label: 'Content', items: NAV.filter(n => n.group === 'content') },
    { label: 'System', items: NAV.filter(n => n.group === 'system') },
  ]

  function NavItem({ item }: { item: typeof NAV[0] }) {
    const active = tab === item.id
    return (
      <button onClick={() => { onTab(item.id); onClose() }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
          active ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
        }`}>
        <item.Icon size={15} />
        {item.label}
      </button>
    )
  }

  const inner = (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex-shrink-0" />
          <div>
            <p className="text-slate-900 font-bold text-sm leading-none">CabHouse</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={18} /></button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-5">
        {groups.map(g => (
          <div key={g.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{g.label}</p>
            <div className="space-y-0.5">
              {g.items.map(item => <NavItem key={item.id} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100 space-y-0.5">
        <a href="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all">
          <ChevronRight size={15} /> View site
        </a>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 font-medium transition-all">
          <LogOut size={15} /> Sign out
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl bg-slate-50 border border-slate-100">
          <Avatar name={session.username} size="sm" />
          <div className="min-w-0">
            <p className="text-slate-800 text-xs font-semibold truncate">{session.username}</p>
            <p className="text-slate-400 text-[10px]">{session.role}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static z-30 inset-y-0 left-0 w-56 bg-white border-r border-slate-200 transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {inner}
      </aside>
    </>
  )
}

function TopBar({ title, session, onMenuOpen }: { title: string; session: AdminSession; onMenuOpen: () => void }) {
  return (
    <div className="h-14 border-b border-slate-200 bg-white px-5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400">cabhouse.site</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-900 font-semibold">{title}</span>
        </div>
      </div>
      <Avatar name={session.username} />
    </div>
  )
}

function AdminDashboard({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = session.accessToken

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar tab={tab} onTab={setTab} onLogout={onLogout} session={session} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={PAGE_TITLES[tab]} session={session} onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-5 lg:p-8">
          {tab === 'overview'  && <OverviewTab  token={token} onNav={setTab} />}
          {tab === 'media'     && <MediaTab     token={token} />}
          {tab === 'patrons'   && <PatronsTab   token={token} />}
          {tab === 'coupons'   && <CouponsTab   token={token} />}
          {tab === 'bookings'  && <BookingsTab  token={token} />}
          {tab === 'services'  && <ServicesTab  token={token} />}
          {tab === 'sitems'    && <ServiceItemsTab token={token} />}
          {tab === 'gallery'   && <GalleryTab   token={token} />}
          {tab === 'content'   && <ContentTab   token={token} />}
          {tab === 'users'     && <UsersTab     token={token} />}
          {tab === 'activity'  && <ActivityTab  token={token} />}
        </main>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ token, onNav }: { token: string; onNav: (t: Tab) => void }) {
  const [stats, setStats] = useState<{ totalPatrons: number; activePatrons: number; totalCouponsIssued: number; totalCouponsRedeemed: number; pendingBookings: number } | null>(null)
  const [settings, setSettings] = useState<{ baseAmount: string; couponValue: string } | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    api.get<any>('/dashboard/stats', token).then(setStats).catch(() => {})
    api.get<any>('/coupons/settings', token).then(setSettings).catch(() => {})
    api.get<any>('/activity?page=0&size=5', token).then(d => setRecentActivity(d.content ?? [])).catch(() => {})
  }, [token])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 text-xl font-bold">Good day</h1>
        <p className="text-slate-500 text-sm">Here's what's happening at CabHouse.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Patrons" value={stats?.totalPatrons ?? '—'} sub="enrolled members" icon={Users} color="blue" />
        <StatCard label="Active Patrons" value={stats?.activePatrons ?? '—'} sub="verified accounts" icon={ShieldCheck} color="green" />
        <StatCard label="Coupons Issued" value={stats?.totalCouponsIssued ?? '—'} sub="all time" icon={TicketPercent} color="amber" />
        <StatCard label="Coupons Redeemed" value={stats?.totalCouponsRedeemed ?? '—'} sub="all time" icon={TrendingUp} color="purple" />
        <StatCard label="Pending Bookings" value={stats?.pendingBookings ?? '—'} sub="awaiting response" icon={CalendarDays} color="blue"
          onClick={() => onNav('bookings')} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <Card className="lg:col-span-1">
          <h3 className="text-slate-900 font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Manage Patrons', sub: 'Search, view balances', tab: 'patrons' as Tab, icon: Users },
              { label: 'Coupon Settings', sub: 'Adjust earning rate', tab: 'coupons' as Tab, icon: TicketPercent },
              { label: 'Update Media', sub: 'Swap images & videos', tab: 'media' as Tab, icon: Image },
              { label: 'Manage Users', sub: 'Staff & admin accounts', tab: 'users' as Tab, icon: ShieldCheck },
            ].map(a => (
              <button key={a.tab} onClick={() => onNav(a.tab)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors">
                  <a.icon size={14} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm font-medium">{a.label}</p>
                  <p className="text-slate-400 text-xs">{a.sub}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
              </button>
            ))}
          </div>
        </Card>

        {/* Coupon summary */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold text-sm">Coupon Rate</h3>
            <button onClick={() => onNav('coupons')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
          </div>
          {settings ? (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">KES {Number(settings.baseAmount).toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">spend earns 1 coupon</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-700 tracking-tight">KES {Number(settings.couponValue).toLocaleString()}</p>
                <p className="text-amber-600 text-xs mt-1">value per coupon redeemed</p>
              </div>
            </div>
          ) : (
            <EmptyState icon={TicketPercent} title="Not configured" sub="Set a coupon rate to get started" />
          )}
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-1" padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-900 font-semibold text-sm">Recent Activity</h3>
            <button onClick={() => onNav('activity')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          {recentActivity.length === 0 ? (
            <div className="px-5 py-8"><EmptyState icon={Activity} title="No activity yet" /></div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentActivity.map((l: any) => (
                <div key={l.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity size={10} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-700 text-xs font-medium truncate">{l.action?.replace(/_/g, ' ')}</p>
                    <p className="text-slate-400 text-[10px]">{new Date(l.createdAt).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEDIA TAB
// ═══════════════════════════════════════════════════════════════════════════════
function MediaTab({ token }: { token: string }) {
  const [view, setView] = useState<'slots' | 'upload' | 'config'>('slots')
  const [creds, setCreds] = useState(getClds)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Media Management</h2>
          <p className="text-slate-500 text-sm">Manage images and videos across all site sections.</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['slots','upload','config'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {v === 'slots' ? 'Image Slots' : v === 'upload' ? 'Upload' : 'Cloudinary'}
            </button>
          ))}
        </div>
      </div>
      {view === 'slots'  && <SlotsTab  token={token} />}
      {view === 'upload' && <UploadTab creds={creds} />}
      {view === 'config' && <CredentialsTab creds={creds} setCreds={setCreds} onSave={() => { localStorage.setItem(CLD_CLOUD_KEY, creds.cloudName.trim()); localStorage.setItem(CLD_PRESET_KEY, creds.uploadPreset.trim()) }} />}
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
    <Card className="max-w-lg">
      <h3 className="text-slate-900 font-semibold mb-5">Cloudinary Config</h3>
      <div className="space-y-4">
        <FieldGroup label="Cloud Name">
          <Input value={creds.cloudName} onChange={e => setCreds({ ...creds, cloudName: e.target.value })} placeholder="e.g. my-cloud" />
        </FieldGroup>
        <FieldGroup label="Unsigned Upload Preset" hint="Must be set to 'Unsigned' mode in your Cloudinary console">
          <Input value={creds.uploadPreset} onChange={e => setCreds({ ...creds, uploadPreset: e.target.value })} placeholder="e.g. cabhouse_unsigned" />
        </FieldGroup>
        <Btn onClick={save}>{saved ? <><Check size={13} /> Saved</> : 'Save'}</Btn>
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
    if (!creds.cloudName || !creds.uploadPreset) { setError('Configure Cloudinary credentials first.'); return }
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
      } catch { setError(`Upload failed: ${file.name}`) }
      setProgress(Math.round(((i + 1) / arr.length) * 100))
    }
    saveUploads([...results, ...uploads]); setUploading(false)
  }

  return (
    <div className="max-w-3xl">
      <div
        className="border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-2xl p-14 text-center cursor-pointer transition-colors bg-white"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); e.dataTransfer.files.length && uploadFiles(e.dataTransfer.files) }}
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Upload size={20} className="text-slate-400" />
        </div>
        <p className="text-slate-700 font-semibold text-sm">Drop files here or click to browse</p>
        <p className="text-slate-400 text-xs mt-1">Images and videos up to 100MB</p>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && uploadFiles(e.target.files)} />
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Uploading…</span><span>{progress}%</span></div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      {error && <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">{error}</div>}

      {uploads.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-700 text-sm font-semibold">{uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded</p>
            <button onClick={() => saveUploads([])} className="text-xs text-slate-400 hover:text-red-600 transition-colors">Clear all</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {uploads.map(a => (
              <div key={a.publicId} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200">
                <img src={a.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => navigator.clipboard.writeText(a.url)}
                    className="bg-white text-slate-900 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Copy size={9} /> Copy
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

function SlotsTab({ token }: { token: string }) {
  const [uploads] = useState<UploadedAsset[]>(() => {
    try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] }
  })
  const [backendSlots, setBackendSlots] = useState<Record<string, string | null>>({})
  const sections = [...new Set(MEDIA_SLOTS.map(s => s.section))]
  const [openSection, setOpenSection] = useState(sections[0])

  useEffect(() => {
    api.get<{ slotId: string; cloudinaryUrl: string | null }[]>('/content/media-slots', token)
      .then(slots => { const m: Record<string, string | null> = {}; slots.forEach(s => { m[s.slotId] = s.cloudinaryUrl }); setBackendSlots(m) })
      .catch(() => {})
  }, [token])

  async function applySlot(slotId: string, url: string) {
    await api.put(`/content/media-slots/${slotId}`, { cloudinaryUrl: url }, token)
    setBackendSlots(prev => ({ ...prev, [slotId]: url })); applyOverride(slotId, url)
  }
  async function resetSlot(slotId: string) {
    await api.del(`/content/media-slots/${slotId}`, token)
    setBackendSlots(prev => ({ ...prev, [slotId]: null })); clearOverride(slotId)
  }

  return (
    <div className="space-y-2">
      {sections.map(section => {
        const slots = MEDIA_SLOTS.filter(s => s.section === section)
        const liveCount = slots.filter(s => backendSlots[s.id]).length
        const isOpen = openSection === section
        return (
          <Card key={section} padding={false}>
            <button onClick={() => setOpenSection(isOpen ? '' : section)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors rounded-xl text-left">
              <div className="flex items-center gap-3">
                <span className="text-slate-900 font-semibold text-sm">{section}</span>
                <span className="text-slate-400 text-xs">{slots.length} slots</span>
                {liveCount > 0 && <Badge variant="green">{liveCount} live</Badge>}
              </div>
              <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
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
    setSaving(true); try { await onApply(slot.id, url); setManual(''); setShowPicker(false) } finally { setSaving(false) }
  }
  async function reset() { setSaving(true); try { await onReset(slot.id) } finally { setSaving(false) } }

  return (
    <div className="px-5 py-4 flex gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
        {displayUrl
          ? <img src={displayUrl} alt={slot.alt} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center"><Image size={16} className="text-slate-300" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-slate-800 text-sm font-semibold">{slot.label}</p>
          <code className="text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{slot.id}</code>
          {backendUrl && <Badge variant="amber">Live</Badge>}
        </div>
        {displayUrl && <p className="text-slate-400 text-[10px] font-mono truncate mb-2">{displayUrl}</p>}
        {uploads.length > 0 && (
          <div className="mb-2">
            <button onClick={() => setShowPicker(!showPicker)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors">
              Pick from uploads <ChevronDown size={10} className={showPicker ? 'rotate-180' : ''} />
            </button>
            {showPicker && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {uploads.map(u => (
                  <button key={u.publicId} onClick={() => apply(u.url)}
                    className="w-10 h-10 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors">
                    <img src={u.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <input value={manual} onChange={e => setManual(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && manual.trim() && apply(manual.trim())}
            placeholder="Paste URL and press Enter…"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
          <Btn size="sm" disabled={!manual.trim() || saving} onClick={() => apply(manual.trim())}>
            {saving ? <Spinner size={12} /> : 'Apply'}
          </Btn>
          {backendUrl && <Btn size="sm" variant="secondary" onClick={reset} disabled={saving}><RefreshCw size={11} /></Btn>}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATRONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface PatronRow { id: string; name: string; phone: string; couponBalance: number; createdAt: string; active: boolean }
interface TxRow { id: string; amount: number; couponsAwarded: number; note: string | null; createdAt: string }
interface RedRow { id: string; couponsRedeemed: number; valueRedeemed: number; note: string | null; createdAt: string }
interface PatronDetail extends PatronRow {
  recentTransactions: TxRow[]
  recentRedemptions: RedRow[]
}

function PatronDetailModal({ patronId, token, onClose, onBalanceChanged }: {
  patronId: string; token: string; onClose: () => void; onBalanceChanged: (id: string, newBalance: number) => void
}) {
  const [detail, setDetail] = useState<PatronDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [adjustDelta, setAdjustDelta] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [adjustError, setAdjustError] = useState('')
  const [adjustDone, setAdjustDone] = useState(false)

  useEffect(() => {
    api.get<PatronDetail>(`/patrons/${patronId}`, token)
      .then(setDetail).catch(() => {}).finally(() => setLoading(false))
  }, [patronId, token])

  async function submitAdjust() {
    if (!adjustDelta || !adjustReason.trim()) return
    const delta = parseInt(adjustDelta)
    if (isNaN(delta) || delta === 0) { setAdjustError('Enter a non-zero number'); return }
    setAdjustError(''); setAdjusting(true)
    try {
      const updated = await api.post<PatronRow>(`/patrons/${patronId}/adjust`, { delta, reason: adjustReason }, token)
      setDetail(prev => prev ? { ...prev, couponBalance: updated.couponBalance } : prev)
      onBalanceChanged(patronId, updated.couponBalance)
      setAdjustDelta(''); setAdjustReason(''); setAdjustDone(true)
      setTimeout(() => setAdjustDone(false), 2500)
    } catch (e: any) { setAdjustError(e.message ?? 'Adjustment failed') } finally { setAdjusting(false) }
  }

  return (
    <Modal title="Patron Detail" onClose={onClose} width="max-w-2xl">
      {loading ? (
        <div className="py-10 flex justify-center"><Spinner size={20} /></div>
      ) : !detail ? (
        <EmptyState icon={Users} title="Failed to load patron" />
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <Avatar name={detail.name} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 font-bold">{detail.name}</p>
              <p className="text-slate-500 text-xs font-mono">{detail.phone}</p>
              <p className="text-slate-400 text-xs mt-0.5">Enrolled {new Date(detail.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{detail.couponBalance}</p>
              <p className="text-slate-400 text-xs">coupons</p>
              <div className="mt-1"><Badge variant={detail.active ? 'green' : 'red'}>{detail.active ? 'Active' : 'Inactive'}</Badge></div>
            </div>
          </div>

          {/* Adjust balance */}
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-slate-800 font-semibold text-sm mb-3">Manual Balance Adjustment</p>
            <div className="flex gap-2 mb-2">
              <div className="w-32 flex-shrink-0">
                <Input
                  type="number" value={adjustDelta}
                  onChange={e => { setAdjustDelta(e.target.value); setAdjustError('') }}
                  placeholder="+5 or −3"
                />
              </div>
              <Input
                value={adjustReason} onChange={e => setAdjustReason(e.target.value)}
                placeholder="Reason for adjustment (required)"
              />
              <Btn disabled={!adjustDelta || !adjustReason.trim() || adjusting} onClick={submitAdjust}>
                {adjusting ? <Spinner size={13} /> : adjustDone ? <><Check size={13} /> Done</> : 'Apply'}
              </Btn>
            </div>
            {adjustError && <p className="text-red-600 text-xs">{adjustError}</p>}
            <p className="text-slate-400 text-xs">Use positive numbers to add coupons, negative to deduct. Logged to Activity.</p>
          </div>

          {/* Transaction history */}
          <div>
            <p className="text-slate-700 font-semibold text-sm mb-2">Recent Spend Transactions</p>
            {detail.recentTransactions.length === 0 ? (
              <p className="text-slate-400 text-xs py-3">No transactions yet.</p>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Amount</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Coupons</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Note</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {detail.recentTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium text-slate-800">KES {Number(tx.amount).toLocaleString()}</td>
                        <td className="px-4 py-2.5"><span className="font-bold text-amber-700">+{tx.couponsAwarded}</span></td>
                        <td className="px-4 py-2.5 text-slate-400 max-w-[140px] truncate">{tx.note ?? '—'}</td>
                        <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Redemption history */}
          <div>
            <p className="text-slate-700 font-semibold text-sm mb-2">Recent Redemptions</p>
            {detail.recentRedemptions.length === 0 ? (
              <p className="text-slate-400 text-xs py-3">No redemptions yet.</p>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Coupons</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Value</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Note</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {detail.recentRedemptions.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5"><span className="font-bold text-blue-700">−{r.couponsRedeemed}</span></td>
                        <td className="px-4 py-2.5 font-medium text-emerald-700">KES {Number(r.valueRedeemed).toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-slate-400 max-w-[140px] truncate">{r.note ?? '—'}</td>
                        <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

function PatronsTab({ token }: { token: string }) {
  const [patrons, setPatrons] = useState<PatronRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const qs = query ? `&search=${encodeURIComponent(query)}` : ''
    api.get<{ content: PatronRow[]; totalElements: number }>(`/patrons?page=${page}&size=20${qs}`, token)
      .then(d => { setPatrons(d.content); setTotal(d.totalElements) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [page, query, token])

  function doSearch() { setPage(0); setQuery(search) }

  function handleBalanceChanged(id: string, newBalance: number) {
    setPatrons(prev => prev.map(p => p.id === id ? { ...p, couponBalance: newBalance } : p))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Patrons</h2>
          <p className="text-slate-500 text-sm">{total} enrolled member{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 max-w-sm">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="Search by name…" className="pl-8" />
        </div>
        <Btn onClick={doSearch}>Search</Btn>
        {query && <Btn variant="ghost" onClick={() => { setSearch(''); setQuery(''); setPage(0) }}>Clear</Btn>}
      </div>

      <Card padding={false}>
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-slate-400">
            <Spinner size={16} /> <span className="text-sm">Loading patrons…</span>
          </div>
        ) : patrons.length === 0 ? (
          <EmptyState icon={Users} title="No patrons found" sub={query ? 'Try a different search term' : 'Enroll your first patron via the POS terminal'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">Patron</th>
                  <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">Coupons</th>
                  <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">Enrolled</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patrons.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedId(p.id)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size="sm" />
                        <span className="text-slate-800 font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{p.phone}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 font-bold text-base">{p.couponBalance}</span>
                        <span className="text-slate-400 text-xs">coupons</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant={p.active ? 'green' : 'red'}>{p.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <ChevronRight size={13} className="text-slate-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 20 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-slate-400 text-xs">Showing {page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}</p>
            <div className="flex gap-1">
              <Btn size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Btn>
              <Btn size="sm" variant="secondary" disabled={(page + 1) * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Btn>
            </div>
          </div>
        )}
      </Card>
      {selectedId && (
        <PatronDetailModal patronId={selectedId} token={token}
          onClose={() => setSelectedId(null)} onBalanceChanged={handleBalanceChanged} />
      )}
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
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-slate-900 font-bold text-lg">Coupon Settings</h2>
        <p className="text-slate-500 text-sm">Control how patrons earn and redeem coupons.</p>
      </div>

      <Card>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-slate-900 font-semibold">Earning Rate</h3>
            {current && <p className="text-slate-400 text-xs mt-0.5">Currently: KES {Number(current.baseAmount).toLocaleString()} = 1 coupon · 1 coupon = KES {Number(current.couponValue).toLocaleString()}</p>}
          </div>
          {saved && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <FieldGroup label="Spend per coupon (KES)" hint="Earn 1 coupon for every this amount spent">
            <Input type="number" min="1" value={base} onChange={e => { setBase(e.target.value); setSaved(false) }} placeholder="e.g. 500" />
          </FieldGroup>
          <FieldGroup label="Coupon value (KES)" hint="KES discount when 1 coupon is redeemed">
            <Input type="number" min="1" value={value} onChange={e => { setValue(e.target.value); setSaved(false) }} placeholder="e.g. 50" />
          </FieldGroup>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs mb-4">{error}</div>}
        <Btn onClick={save} disabled={!base || !value || saving}>
          {saving ? <><Spinner size={13} /> Saving…</> : 'Save Settings'}
        </Btn>
      </Card>

      {preview.length > 0 && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-900 font-semibold text-sm">Earning Preview</h3>
            <p className="text-slate-400 text-xs mt-0.5">What patrons earn at common spend amounts</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold">Spend</th>
                <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold">Coupons Earned</th>
                <th className="text-left px-5 py-3 text-slate-500 text-xs font-semibold">Discount Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {preview.map(p => (
                <tr key={p.spend} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-600 font-medium">KES {p.spend.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-slate-900">{p.coupons}</span>
                    <span className="text-slate-400 text-xs ml-1">coupon{p.coupons !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-5 py-3 text-emerald-700 font-semibold">KES {p.discount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    if (!editing) return; setSaving(true)
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
      <div className="mb-6">
        <h2 className="text-slate-900 font-bold text-lg">CMS Services</h2>
        <p className="text-slate-500 text-sm">Edit service titles, descriptions, and visibility.</p>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-2">
          {services.map(s => (
            <button key={s.id} onClick={() => { setEditing({ ...s }); setSaved(false) }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                editing?.id === s.id ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-800 font-semibold text-sm">{s.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={s.visible ? 'green' : 'gray'}>{s.visible ? 'Visible' : 'Hidden'}</Badge>
                  <Pencil size={12} className="text-slate-400" />
                </div>
              </div>
              <p className="text-slate-400 text-xs line-clamp-2">{s.description}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {editing ? (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-slate-900 font-semibold">Edit Service</h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">{editing.serviceKey}</p>
                </div>
                {saved && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
              </div>
              <div className="space-y-4">
                <FieldGroup label="Title">
                  <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                </FieldGroup>
                <FieldGroup label="Description">
                  <Textarea rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Display Order">
                    <Input type="number" min="0" value={editing.displayOrder}
                      onChange={e => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })} />
                  </FieldGroup>
                  <FieldGroup label="Visibility">
                    <button onClick={() => setEditing({ ...editing, visible: !editing.visible })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        editing.visible ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                      {editing.visible ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {editing.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </FieldGroup>
                </div>
                <div className="flex gap-2 pt-1">
                  <Btn onClick={save} disabled={saving}>{saving ? <><Spinner size={13} /> Saving…</> : 'Save Changes'}</Btn>
                  <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon={Pencil} title="Select a service to edit" sub="Click any service on the left to start editing" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface UserRow { id: string; email: string; username: string; role: string; active: boolean; createdAt: string }

function UsersTab({ token }: { token: string }) {
  const [roleFilter, setRoleFilter] = useState<'ADMIN' | 'STAFF'>('STAFF')
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

  const roleVariant: Record<string, 'amber' | 'blue' | 'purple'> = { SUPERADMIN: 'amber', ADMIN: 'blue', STAFF: 'purple' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Users</h2>
          <p className="text-slate-500 text-sm">Manage admin and staff accounts.</p>
        </div>
        <Btn onClick={() => setShowCreate(true)}><Plus size={14} /> Add User</Btn>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-5 w-fit">
        {(['STAFF', 'ADMIN'] as const).map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${roleFilter === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {r}s
          </button>
        ))}
      </div>

      <Card padding={false}>
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-slate-400">
            <Spinner size={16} /> <span className="text-sm">Loading users…</span>
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title={`No ${roleFilter.toLowerCase()}s yet`} sub={`Create the first ${roleFilter.toLowerCase()} account using the button above`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['User','Email','Role','Status','Created',''].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.username} size="sm" />
                        <span className="text-slate-800 font-semibold">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{u.email}</td>
                    <td className="px-5 py-3.5"><Badge variant={roleVariant[u.role] ?? 'gray'}>{u.role}</Badge></td>
                    <td className="px-5 py-3.5"><Badge variant={u.active ? 'green' : 'red'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Btn size="sm" variant="ghost" onClick={() => setResetTarget(u)}>Reset PW</Btn>
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
    try { await api.post('/users', form, token); onDone() }
    catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <Modal title="Add User" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <FieldGroup label="Email">
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" required />
        </FieldGroup>
        <FieldGroup label="Username">
          <Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" required />
        </FieldGroup>
        <FieldGroup label="Password">
          <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="min 8 characters" required />
        </FieldGroup>
        <FieldGroup label="Role">
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="STAFF">Staff — POS access only</option>
            <option value="ADMIN">Admin — Full panel access</option>
          </select>
        </FieldGroup>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">{error}</div>}
        <div className="flex gap-2 pt-1">
          <Btn type="submit" disabled={loading} className="flex-1 justify-center">
            {loading ? <><Spinner size={13} /> Creating…</> : 'Create User'}
          </Btn>
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </form>
    </Modal>
  )
}

function ResetPasswordModal({ token, user, onDone, onClose }: { token: string; user: UserRow; onDone: () => void; onClose: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try { await api.patch(`/users/${user.id}/password`, { newPassword: pw }, token); setDone(true); setTimeout(onDone, 1500) }
    catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <Modal title="Reset Password" onClose={onClose}>
      <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-xl">
        <Avatar name={user.username} />
        <div>
          <p className="text-slate-800 font-semibold text-sm">{user.username}</p>
          <p className="text-slate-400 text-xs">{user.role}</p>
        </div>
      </div>
      {done ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
          <Check size={15} /> Password updated successfully
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <FieldGroup label="New Password">
            <Input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="min 8 characters" required />
          </FieldGroup>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">{error}</div>}
          <div className="flex gap-2 pt-1">
            <Btn type="submit" disabled={loading || pw.length < 8} className="flex-1 justify-center">
              {loading ? <><Spinner size={13} /> Saving…</> : 'Reset Password'}
            </Btn>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface LogRow { id: string; action: string; entityType: string; detail: string | null; createdAt: string }

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

  const actionVariant: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'gray' | 'purple'> = {
    ENROLL_PATRON: 'green', RECORD_SPEND: 'amber', REDEEM_COUPONS: 'blue',
    ADJUST_COUPON_BALANCE: 'purple',
    CREATE_USER: 'green', DEACTIVATE_USER: 'red', UPDATE_COUPON_SETTINGS: 'amber',
    UPDATE_MEDIA_SLOT: 'blue', CLEAR_MEDIA_SLOT: 'gray',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Activity Log</h2>
          <p className="text-slate-500 text-sm">{total} recorded event{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <Card padding={false}>
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-slate-400">
            <Spinner size={16} /> <span className="text-sm">Loading activity…</span>
          </div>
        ) : logs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity recorded yet" sub="Actions performed across the system will appear here" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Action','Entity','Detail','Time'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5"><Badge variant={actionVariant[l.action] ?? 'gray'}>{l.action.replace(/_/g, ' ')}</Badge></td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{l.entityType}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs max-w-[240px] truncate">{l.detail ?? '—'}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 50 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-slate-400 text-xs">Page {page + 1} of {Math.ceil(total / 50)}</p>
            <div className="flex gap-1">
              <Btn size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Btn>
              <Btn size="sm" variant="secondary" disabled={(page + 1) * 50 >= total} onClick={() => setPage(p => p + 1)}>Next</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKINGS TAB
// ═══════════════════════════════════════════════════════════════════════════════
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
type BookingServiceType = 'PARK' | 'APARTMENTS' | 'WATER' | 'EVENTS' | 'RESTAURANT' | 'OTHER'

interface BookingRow {
  id: string; name: string; phone: string; email: string
  service: BookingServiceType; visitDate: string | null; guests: number
  message: string | null; status: BookingStatus; adminNote: string | null; createdAt: string
}

const STATUS_FILTERS: { id: BookingStatus | 'ALL'; label: string }[] = [
  { id: 'ALL',       label: 'All' },
  { id: 'PENDING',   label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'CANCELLED', label: 'Cancelled' },
  { id: 'COMPLETED', label: 'Completed' },
]

const bookingStatusVariant: Record<BookingStatus, 'amber' | 'green' | 'gray' | 'blue'> = {
  PENDING: 'amber', CONFIRMED: 'green', CANCELLED: 'gray', COMPLETED: 'blue',
}

function BookingsTab({ token }: { token: string }) {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [selected, setSelected] = useState<BookingRow | null>(null)
  const [newStatus, setNewStatus] = useState<BookingStatus>('PENDING')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  function load(p = 0) {
    setLoading(true)
    const q = statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''
    api.get<{ content: BookingRow[]; totalElements: number }>(`/bookings?page=${p}&size=20${q}`, token)
      .then(d => { setBookings(d.content); setTotal(d.totalElements) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { setPage(0); load(0) }, [statusFilter, token])

  function openDetail(b: BookingRow) {
    setSelected(b); setNewStatus(b.status); setNote(b.adminNote ?? '')
  }

  async function saveStatus() {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await api.patch<BookingRow>(`/bookings/${selected.id}/status`, { status: newStatus, note }, token)
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b))
      setSelected(updated)
    } catch {} finally { setSaving(false) }
  }

  const fmt = (iso: string | null) => iso
    ? new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Bookings</h2>
          <p className="text-slate-500 text-sm">Manage visitor booking requests from the website.</p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-5 w-fit flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f.id} onClick={() => setStatusFilter(f.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${statusFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-slate-400" /></div>
          ) : bookings.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No bookings yet" sub="Booking requests from the website will appear here" />
          ) : (
            <div className="space-y-2">
              {bookings.map(b => (
                <button key={b.id} onClick={() => openDetail(b)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === b.id ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="text-slate-800 font-semibold text-sm truncate">{b.name}</p>
                      <p className="text-slate-400 text-xs">{b.phone} · {b.service} · {b.guests} guest{b.guests !== 1 ? 's' : ''}</p>
                    </div>
                    <Badge variant={bookingStatusVariant[b.status]}>{b.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-xs">Visit: {fmt(b.visitDate)}</p>
                    <p className="text-slate-400 text-[10px]">{fmt(b.createdAt)}</p>
                  </div>
                  {b.message && <p className="text-slate-400 text-xs mt-1 truncate">{b.message}</p>}
                </button>
              ))}
              <div className="flex justify-between items-center pt-2">
                <p className="text-slate-400 text-xs">{total} total</p>
                <div className="flex gap-2">
                  <Btn size="sm" variant="secondary" disabled={page === 0} onClick={() => { setPage(p => p - 1); load(page - 1) }}>Previous</Btn>
                  <Btn size="sm" variant="secondary" disabled={(page + 1) * 20 >= total} onClick={() => { setPage(p => p + 1); load(page + 1) }}>Next</Btn>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <h3 className="text-slate-900 font-semibold mb-1">{selected.name}</h3>
              <p className="text-slate-400 text-xs font-mono mb-4">{selected.id.slice(0, 8)}…</p>

              <div className="space-y-2 mb-5 text-sm">
                {[
                  ['Phone', selected.phone],
                  ['Email', selected.email || '—'],
                  ['Service', selected.service],
                  ['Visit Date', fmt(selected.visitDate)],
                  ['Guests', String(selected.guests)],
                  ['Submitted', fmt(selected.createdAt)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <span className="text-slate-400 text-xs flex-shrink-0">{k}</span>
                    <span className="text-slate-700 text-xs text-right font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {selected.message && (
                <div className="bg-slate-50 rounded-lg p-3 mb-5">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wide font-semibold mb-1">Message</p>
                  <p className="text-slate-700 text-xs leading-relaxed">{selected.message}</p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <FieldGroup label="Update Status">
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value as BookingStatus)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Admin Note (optional)">
                  <Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Called client, confirmed for Saturday" />
                </FieldGroup>
                <div className="flex gap-2">
                  <Btn onClick={saveStatus} disabled={saving || newStatus === selected.status && note === (selected.adminNote ?? '')}>
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    {saving ? 'Saving…' : 'Save'}
                  </Btn>
                  <Btn variant="ghost" onClick={() => setSelected(null)}>Close</Btn>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon={CalendarDays} title="Select a booking" sub="Click any booking to view details and update status" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface ContentBlock { key: string; value: string; label: string; section: string; updatedAt: string }

const CONTENT_SECTION_LABELS: Record<string, string> = {
  announcement: 'Announcement Bar',
  contact: 'Contact Details',
  hero: 'Hero Headings',
  pricing: 'Pricing',
}

function ContentTab({ token }: { token: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<Record<string, string>>({})

  useEffect(() => {
    api.get<ContentBlock[]>('/content/blocks', token)
      .then(data => {
        setBlocks(data)
        const init: Record<string, string> = {}
        data.forEach(b => { init[b.key] = b.value })
        setDrafts(init)
      }).catch(() => {})
  }, [token])

  async function saveBlock(key: string) {
    setSaving(p => ({ ...p, [key]: true }))
    setError(p => ({ ...p, [key]: '' }))
    try {
      await api.put<ContentBlock>(`/content/blocks/${key}`, { value: drafts[key] ?? '' }, token)
      setBlocks(prev => prev.map(b => b.key === key ? { ...b, value: drafts[key] ?? '' } : b))
      setSaved(p => ({ ...p, [key]: true }))
      setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2000)
      invalidateContentCache()
    } catch {
      setError(p => ({ ...p, [key]: 'Save failed' }))
    } finally {
      setSaving(p => ({ ...p, [key]: false }))
    }
  }

  const sections = Object.entries(
    blocks.reduce<Record<string, ContentBlock[]>>((acc, b) => {
      ;(acc[b.section] = acc[b.section] ?? []).push(b)
      return acc
    }, {})
  )

  const isMultiline = (key: string) => key.includes('.heading') || key.includes('.subheading') || key.includes('.text')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-slate-900 font-bold text-lg">Content Blocks</h2>
        <p className="text-slate-500 text-sm">Edit text displayed on the website. Changes go live after the page cache refreshes (up to 5 minutes).</p>
      </div>
      <div className="space-y-8">
        {sections.map(([section, items]) => (
          <div key={section}>
            <h3 className="text-slate-700 font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              {CONTENT_SECTION_LABELS[section] ?? section}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map(block => {
                const changed = drafts[block.key] !== block.value
                const multi = isMultiline(block.key)
                return (
                  <Card key={block.key}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-slate-800 text-sm font-semibold">{block.label}</p>
                        <p className="text-slate-400 text-[10px] font-mono mt-0.5">{block.key}</p>
                      </div>
                      {saved[block.key] && (
                        <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>
                      )}
                    </div>
                    {multi ? (
                      <Textarea
                        rows={3}
                        value={drafts[block.key] ?? ''}
                        onChange={e => setDrafts(p => ({ ...p, [block.key]: e.target.value }))}
                      />
                    ) : (
                      <Input
                        value={drafts[block.key] ?? ''}
                        onChange={e => setDrafts(p => ({ ...p, [block.key]: e.target.value }))}
                      />
                    )}
                    {error[block.key] && (
                      <p className="text-red-500 text-xs mt-1">{error[block.key]}</p>
                    )}
                    <div className="flex justify-end mt-3">
                      <Btn
                        onClick={() => saveBlock(block.key)}
                        disabled={!changed || saving[block.key]}
                        variant={changed ? 'primary' : 'ghost'}
                      >
                        {saving[block.key] ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        {saving[block.key] ? 'Saving…' : 'Save'}
                      </Btn>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE ITEMS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const SERVICE_CATEGORIES = [
  { value: 'PARK_ACTIVITY', label: 'Park Activities' },
  { value: 'PARK_PACKAGE',  label: 'Park Packages' },
  { value: 'PARK_STAY',     label: 'Park Stays' },
  { value: 'PARK_DINING',   label: 'Park Dining' },
  { value: 'APT_UNIT',      label: 'Apartments' },
  { value: 'WATER_USE',     label: 'Water Uses' },
  { value: 'WATER_FORMAT',  label: 'Water Formats' },
]

interface SItem {
  id: string; category: string; slug: string; title: string; description: string
  price: string | null; tag: string | null; displayOrder: number; visible: boolean
  images: { id: string; cloudinaryUrl: string; label: string; displayOrder: number }[]
}

function ServiceItemsTab({ token }: { token: string }) {
  const { get: getBlock } = useContentBlocks()
  const [category, setCategory] = useState('PARK_ACTIVITY')
  const [items, setItems] = useState<SItem[]>([])
  const [editing, setEditing] = useState<SItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditing(null)
    api.get<SItem[]>(`/service-items?category=${category}`, token).then(setItems).catch(() => {})
  }, [category, token])

  async function save() {
    if (!editing) return; setSaving(true)
    try {
      const updated = await api.put<SItem>(`/service-items/${editing.id}`, {
        title: editing.title, description: editing.description, price: editing.price,
        tag: editing.tag, displayOrder: editing.displayOrder, visible: editing.visible,
      }, token)
      setItems(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditing(updated); setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {} finally { setSaving(false) }
  }

  async function uploadImage(file: File) {
    if (!editing) return
    const cloudName = getBlock('cloudinary.cloud_name', '')
    const uploadPreset = getBlock('cloudinary.upload_preset', '')
    if (!cloudName || !uploadPreset) { alert('Cloudinary credentials not configured in Content tab'); return }
    setUploading(true)
    try {
      const { uploadToCloudinary } = await import('../config/cloudinary')
      const url = await uploadToCloudinary(file, cloudName, uploadPreset, 'service-items')
      const updated = await api.post<SItem>(`/service-items/${editing.id}/images`, { cloudinaryUrl: url, label: file.name.replace(/\.[^.]+$/, '') }, token)
      setItems(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditing(updated)
    } catch (e: any) { alert(e.message ?? 'Upload failed') } finally { setUploading(false) }
  }

  async function deleteImage(imageId: string) {
    if (!editing || !confirm('Delete this image?')) return
    try {
      const updated = await api.del<SItem>(`/service-items/${editing.id}/images/${imageId}`, token)
      setItems(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditing(updated)
    } catch {}
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-slate-900 font-bold text-lg">Service Items</h2>
        <p className="text-slate-500 text-sm">Edit service item details and manage their Cloudinary images.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {SERVICE_CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === c.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-2">
          {items.map(s => (
            <button key={s.id} onClick={() => { setEditing({ ...s }); setSaved(false) }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                editing?.id === s.id ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-800 font-semibold text-sm">{s.title}</span>
                <div className="flex items-center gap-2">
                  {s.price && <span className="text-xs text-slate-500">{s.price}</span>}
                  <Badge variant={s.visible ? 'green' : 'gray'}>{s.visible ? 'On' : 'Off'}</Badge>
                </div>
              </div>
              <p className="text-slate-400 text-xs line-clamp-1">{s.description}</p>
              {s.images.length > 0 && <p className="text-slate-300 text-[10px] mt-1">{s.images.length} image{s.images.length > 1 ? 's' : ''}</p>}
            </button>
          ))}
          {items.length === 0 && <EmptyState icon={FileText} title="No items" sub="No service items in this category" />}
        </div>
        <div className="lg:col-span-3">
          {editing ? (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-slate-900 font-semibold">Edit Item</h3>
                  <p className="text-slate-400 text-xs font-mono">{editing.slug}</p>
                </div>
                {saved && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
              </div>
              <div className="space-y-4">
                <FieldGroup label="Title">
                  <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                </FieldGroup>
                <FieldGroup label="Description">
                  <Textarea rows={3} value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Price">
                    <Input value={editing.price ?? ''} onChange={e => setEditing({ ...editing, price: e.target.value })} placeholder="e.g. KES 500" />
                  </FieldGroup>
                  <FieldGroup label="Tag">
                    <Input value={editing.tag ?? ''} onChange={e => setEditing({ ...editing, tag: e.target.value })} placeholder="e.g. Popular" />
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Display Order">
                    <Input type="number" min="0" value={editing.displayOrder}
                      onChange={e => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })} />
                  </FieldGroup>
                  <FieldGroup label="Visible">
                    <button onClick={() => setEditing({ ...editing, visible: !editing.visible })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        editing.visible ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                      {editing.visible ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {editing.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </FieldGroup>
                </div>
                <div className="flex gap-2 pt-1">
                  <Btn onClick={save} disabled={saving}>{saving ? <><Spinner size={13} /> Saving…</> : 'Save Changes'}</Btn>
                  <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
                </div>

                {/* Images */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-slate-700 font-semibold text-sm">Images</h4>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                    <Btn variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? <><Spinner size={12} /> Uploading…</> : 'Upload Image'}
                    </Btn>
                  </div>
                  {editing.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {editing.images.map(img => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-slate-100">
                          <img src={img.cloudinaryUrl} alt={img.label} className="w-full h-full object-cover" />
                          <button onClick={() => deleteImage(img.id)}
                            className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold">
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">No images yet — upload one above.</p>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon={FileText} title="Select an item to edit" sub="Click any service item on the left" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY TAB
// ═══════════════════════════════════════════════════════════════════════════════
const GALLERY_SECTIONS = [
  { value: 'PARK',       label: 'Park' },
  { value: 'CAMPING',    label: 'Camping' },
  { value: 'APARTMENTS', label: 'Apartments' },
  { value: 'WATER',      label: 'Water' },
  { value: 'EVENTS',     label: 'Events' },
]

interface GalleryImg { id: string; section: string; cloudinaryUrl: string; label: string; displayOrder: number }

function GalleryTab({ token }: { token: string }) {
  const { get: getBlock } = useContentBlocks()
  const [section, setSection] = useState('PARK')
  const [images, setImages] = useState<GalleryImg[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get<GalleryImg[]>(`/gallery?section=${section}`, token).then(setImages).catch(() => {})
  }, [section, token])

  async function uploadImage(file: File) {
    const cloudName = getBlock('cloudinary.cloud_name', '')
    const uploadPreset = getBlock('cloudinary.upload_preset', '')
    if (!cloudName || !uploadPreset) { alert('Cloudinary credentials not configured in Content tab'); return }
    setUploading(true)
    try {
      const { uploadToCloudinary } = await import('../config/cloudinary')
      const url = await uploadToCloudinary(file, cloudName, uploadPreset, `gallery/${section.toLowerCase()}`)
      const added = await api.post<GalleryImg>('/gallery', {
        section, cloudinaryUrl: url, label: file.name.replace(/\.[^.]+$/, ''), displayOrder: images.length,
      }, token)
      setImages(prev => [...prev, added])
      invalidateGalleryCache()
    } catch (e: any) { alert(e.message ?? 'Upload failed') } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this gallery image?')) return
    try {
      await api.del<void>(`/gallery/${id}`, token)
      setImages(prev => prev.filter(img => img.id !== id))
      invalidateGalleryCache()
    } catch {}
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-slate-900 font-bold text-lg">Gallery</h2>
        <p className="text-slate-500 text-sm">Upload and manage gallery images by section. Upload images to replace the static assets on the public site.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {GALLERY_SECTIONS.map(s => (
          <button key={s.value} onClick={() => setSection(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              section === s.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-500 text-sm">{images.length} image{images.length !== 1 ? 's' : ''} in {GALLERY_SECTIONS.find(s => s.value === section)?.label}</p>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => { Array.from(e.target.files ?? []).forEach(f => uploadImage(f)) }} />
          <Btn onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <><Spinner size={13} /> Uploading…</> : 'Upload Images'}
          </Btn>
        </div>
      </div>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100">
              <img src={img.cloudinaryUrl} alt={img.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all">
                <button onClick={() => deleteImage(img.id)}
                  className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete
                </button>
              </div>
              {img.label && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                  <p className="text-white text-[10px] truncate">{img.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Image} title="No images yet" sub="Upload images to populate this gallery section" />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
export default function MdauDev() {
  const [session, setSession] = useState<AdminSession | null>(getSession)
  function handleLogout() { clearSession(); setSession(null) }
  return session
    ? <AdminDashboard session={session} onLogout={handleLogout} />
    : <AdminLogin onLogin={setSession} />
}
