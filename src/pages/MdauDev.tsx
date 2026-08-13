import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Check, Image, RefreshCw,
  Users, TicketPercent, FileText, Activity,
  LogOut, Menu, X, Plus, Eye, EyeOff, Search, Loader2,
  TrendingUp, ShieldCheck, LayoutGrid,
  ChevronRight, ArrowUpRight,
  Pencil, ToggleLeft, ToggleRight, CalendarDays, Megaphone, Tag, Trash2,
} from 'lucide-react'
import { MEDIA_SLOTS, type MediaSlot, getSlotUrl } from '../config/media'
import { applyOverride, clearOverride } from '../hooks/useMedia'
import { useContentBlocks, invalidateContentCache } from '../hooks/useContentBlocks'
import { invalidateGalleryCache } from '../hooks/useGalleryImages'
import { invalidatePromotionsCache, type PromotionTag, type PromotionData } from '../hooks/usePromotions'
import { api, staffAuth, UNAUTHORIZED_EVENT } from '../lib/api'

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

// Module-level reactive uploads list — shared between SlotsTab and UploadTab
let _uploads: UploadedAsset[] = (() => { try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] } })()
let _uploadListeners: Array<(list: UploadedAsset[]) => void> = []
function notifyUploadListeners() { _uploadListeners.forEach(fn => fn([..._uploads])) }
function pushUploads(assets: UploadedAsset[]) {
  _uploads = [...assets, ..._uploads]
  localStorage.setItem('cld_uploads', JSON.stringify(_uploads))
  notifyUploadListeners()
}
function clearUploads() {
  _uploads = []
  localStorage.removeItem('cld_uploads')
  notifyUploadListeners()
}
function useUploadsList(): UploadedAsset[] {
  const [list, setList] = useState<UploadedAsset[]>(() => [..._uploads])
  useEffect(() => {
    _uploadListeners.push(setList)
    return () => { _uploadListeners = _uploadListeners.filter(fn => fn !== setList) }
  }, [])
  return list
}

async function uploadToCloudinary(
  file: File,
  creds: { cloudName: string; uploadPreset: string }
): Promise<UploadedAsset> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', creds.uploadPreset)
  fd.append('folder', 'cabhouse')
  const rt = file.type.startsWith('video') ? 'video' : 'image'
  const res = await fetch(`https://api.cloudinary.com/v1_1/${creds.cloudName}/${rt}/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(res.statusText)
  const d = await res.json()
  return { url: d.secure_url, publicId: d.public_id, type: rt, bytes: d.bytes, format: d.format }
}

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
// DASHBOARD SHELL
// ═══════════════════════════════════════════════════════════════════════════════
type Tab = 'overview' | 'media' | 'patrons' | 'coupons' | 'bookings' | 'reservations' | 'promotions' | 'packages' | 'services' | 'sitems' | 'gallery' | 'content' | 'users' | 'activity'

const NAV: { id: Tab; label: string; Icon: any; group: string }[] = [
  { id: 'overview',  label: 'Overview',     Icon: LayoutGrid,    group: 'main' },
  { id: 'patrons',   label: 'Patrons',      Icon: Users,         group: 'main' },
  { id: 'coupons',   label: 'Coupons',      Icon: TicketPercent, group: 'main' },
  { id: 'bookings',      label: 'Enquiries',     Icon: CalendarDays,  group: 'main' },
  { id: 'reservations',  label: 'Reservations',  Icon: CalendarDays,  group: 'main' },
  { id: 'promotions',label: 'Promotions',   Icon: Megaphone,     group: 'main' },
  { id: 'media',     label: 'Media',        Icon: Image,         group: 'content' },
  { id: 'packages',  label: 'Park Packages', Icon: TicketPercent, group: 'content' },
  { id: 'services',  label: 'Services',     Icon: FileText,      group: 'content' },
  { id: 'sitems',    label: 'Service Items', Icon: LayoutGrid,   group: 'content' },
  { id: 'gallery',   label: 'Gallery',      Icon: Image,         group: 'content' },
  { id: 'content',   label: 'Content',      Icon: Pencil,        group: 'content' },
  { id: 'users',     label: 'Users',        Icon: ShieldCheck,   group: 'system' },
  { id: 'activity',  label: 'Activity',     Icon: Activity,      group: 'system' },
]

const PAGE_TITLES: Record<Tab, string> = {
  overview: 'Overview', media: 'Media', patrons: 'Patrons',
  coupons: 'Coupons', bookings: 'Enquiries', reservations: 'Reservations', promotions: 'Promotions', packages: 'Park Packages',
  services: 'Services', sitems: 'Service Items', gallery: 'Gallery', content: 'Content Blocks', users: 'Users', activity: 'Activity Log',
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
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
          active
            ? 'font-semibold'
            : 'text-white/40 hover:text-white/80 hover:bg-white/5 font-medium'
        }`}
        style={active ? {
          background: 'linear-gradient(135deg, rgba(200,135,58,0.18), rgba(200,135,58,0.08))',
          color: '#E8A85C',
          border: '1px solid rgba(200,135,58,0.20)',
        } : {}}
      >
        <item.Icon size={14} style={active ? { color: '#C8873A' } : {}} />
        {item.label}
      </button>
    )
  }

  const inner = (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: '#0d1117' }}>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C8873A, #a06020)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">CabHouse</p>
            <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/30 hover:text-white/70 transition-colors"><X size={16} /></button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-5 mt-1">
        {groups.map(g => (
          <div key={g.label}>
            <p className="px-3 mb-1.5 text-[9px] font-bold text-white/20 uppercase tracking-[0.18em]">{g.label}</p>
            <div className="space-y-0.5">
              {g.items.map(item => <NavItem key={item.id} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <a
          href="/"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all mb-0.5"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent' }}
        >
          <ChevronRight size={14} /> View site
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all mb-2"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.85)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={14} /> Sign out
        </button>
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Avatar name={session.username} size="sm" />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{session.username}</p>
            <p className="text-white/30 text-[10px]">{session.role}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static z-30 inset-y-0 left-0 w-56 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {inner}
      </aside>
    </>
  )
}

function TopBar({ title, session, onMenuOpen }: { title: string; session: AdminSession; onMenuOpen: () => void }) {
  return (
    <div
      className="h-14 px-5 flex items-center justify-between flex-shrink-0"
      style={{ background: '#fff', borderBottom: '1px solid #e9ecef' }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors p-1">
          <Menu size={18} />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <a href="/" className="text-slate-400 hover:text-slate-600 transition-colors font-medium">cabhouse.site</a>
          <ChevronRight size={11} className="text-slate-300" />
          <span className="text-slate-800 font-semibold">{title}</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-xs font-body hidden sm:block">{session.role}</span>
        <Avatar name={session.username} />
      </div>
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
          {tab === 'overview'  && <OverviewTab  token={token} onNav={setTab} username={session.username} />}
          {tab === 'media'     && <MediaTab     token={token} />}
          {tab === 'patrons'   && <PatronsTab   token={token} />}
          {tab === 'coupons'   && <CouponsTab   token={token} />}
          {tab === 'bookings'      && <BookingsTab       token={token} />}
          {tab === 'reservations'  && <ReservationsTab   token={token} />}
          {tab === 'promotions' && <PromotionsTab  token={token} />}
          {tab === 'packages'  && <PackagesTab    token={token} />}
          {tab === 'services'   && <ServicesTab    token={token} />}
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
function OverviewTab({ token, onNav, username }: { token: string; onNav: (t: Tab) => void; username: string }) {
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
        <h1 className="text-slate-900 text-xl font-bold">Good day, {username.split('@')[0]}</h1>
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
// ─── shared page sidebar ──────────────────────────────────────────────────────
function PageSidebar({ activePage, onSelect, pages }: {
  activePage: string
  onSelect: (id: string) => void
  pages: readonly { id: string; label: string }[]
}) {
  return (
    <nav className="flex flex-col gap-0.5 w-36 flex-shrink-0">
      {pages.map(p => (
        <button key={p.id} onClick={() => onSelect(p.id)}
          className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activePage === p.id
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}>
          {p.label}
        </button>
      ))}
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEDIA TAB — per-page image management with large previews
// ═══════════════════════════════════════════════════════════════════════════════

function MediaTab({ token }: { token: string }) {
  const [creds, setCreds] = useState(getClds)
  const [activePage, setActivePage] = useState<string>('home')
  const [backendSlots, setBackendSlots] = useState<Record<string, string | null>>({})
  const uploads = useUploadsList()

  // Auto-load Cloudinary creds from DB
  useEffect(() => {
    const stored = getClds()
    if (stored.cloudName && stored.uploadPreset) return
    api.get<{ key: string; value: string }[]>('/content/public/blocks', token)
      .then(blocks => {
        const cloud = blocks.find((b: any) => b.key === 'cloudinary.cloud_name')?.value ?? ''
        const preset = blocks.find((b: any) => b.key === 'cloudinary.upload_preset')?.value ?? ''
        if (cloud) { localStorage.setItem(CLD_CLOUD_KEY, cloud); setCreds(c => ({ ...c, cloudName: cloud })) }
        if (preset) { localStorage.setItem(CLD_PRESET_KEY, preset); setCreds(c => ({ ...c, uploadPreset: preset })) }
      }).catch(() => {})
  }, [token])

  // Load all backend slot overrides
  useEffect(() => {
    api.get<{ slotId: string; cloudinaryUrl: string | null }[]>('/content/media-slots', token)
      .then(slots => {
        const m: Record<string, string | null> = {}
        slots.forEach(s => { m[s.slotId] = s.cloudinaryUrl })
        setBackendSlots(m)
        slots.forEach(s => {
          if (s.cloudinaryUrl) { applyOverride(s.slotId, s.cloudinaryUrl) } else { clearOverride(s.slotId) }
        })
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

  const mediaPages = SITE_PAGES.filter(p => p.mediaSections.length > 0)
  const page = SITE_PAGES.find(p => p.id === activePage) ?? SITE_PAGES[0]
  const pageSlots = MEDIA_SLOTS.filter(s => (page.mediaSections as readonly string[]).includes(s.section))
  const liveCount = pageSlots.filter(s => backendSlots[s.id]).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-slate-900 font-bold text-lg">Images</h2>
        <p className="text-slate-500 text-sm">Upload and assign images per page. Each slot shows a live preview.</p>
      </div>
      {!creds.cloudName && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm flex items-center gap-2">
          <span className="font-semibold">Cloudinary not configured.</span>
          <span>Go to Settings in the Content tab to set it up.</span>
        </div>
      )}
      <div className="flex gap-6">
        <PageSidebar activePage={activePage} onSelect={setActivePage}
          pages={mediaPages.map(p => ({ id: p.id, label: p.label }))} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-slate-900 font-bold">{page.label}</h3>
            <span className="text-slate-400 text-xs">{pageSlots.length} image{pageSlots.length !== 1 ? 's' : ''}</span>
            {liveCount > 0 && <Badge variant="green">{liveCount} live</Badge>}
          </div>

          {pageSlots.length === 0 ? (
            <p className="text-slate-400 text-sm">No image slots on this page.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageSlots.map(slot => (
                <SlotCard key={slot.id} slot={slot} uploads={uploads} creds={creds}
                  backendUrl={backendSlots[slot.id] ?? null}
                  onApply={applySlot} onReset={resetSlot} />
              ))}
            </div>
          )}

          {/* Upload library strip */}
          {uploads.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Upload library ({uploads.length})</p>
                <button onClick={clearUploads} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Clear</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {uploads.map(a => (
                  <div key={a.publicId} className="group relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    {a.type === 'video'
                      ? <video src={a.url} className="w-full h-full object-cover" muted />
                      : <img src={a.url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => navigator.clipboard.writeText(a.url)}
                        className="bg-white text-slate-900 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Slot card — large image preview card ─────────────────────────────────────
function SlotCard({ slot, uploads, creds, backendUrl, onApply, onReset }: {
  slot: MediaSlot
  uploads: UploadedAsset[]
  creds: { cloudName: string; uploadPreset: string }
  backendUrl: string | null
  onApply: (id: string, url: string) => Promise<void>
  onReset: (id: string) => Promise<void>
}) {
  const currentUrl = backendUrl ?? getSlotUrl(slot.id)
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState<'upload' | 'apply' | 'reset' | null>(null)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function apply(url: string) {
    setSaving('apply')
    try { await onApply(slot.id, url); setShowPicker(false) }
    finally { setSaving(null) }
  }
  async function reset() {
    setSaving('reset')
    try { await onReset(slot.id) }
    finally { setSaving(null) }
  }
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    if (!creds.cloudName || !creds.uploadPreset) { setUploadErr('Cloudinary not configured'); return }
    setUploadErr(null); setSaving('upload')
    try {
      const asset = await uploadToCloudinary(file, creds)
      pushUploads([asset])
      await onApply(slot.id, asset.url)
      setShowPicker(false)
    } catch { setUploadErr('Upload failed') }
    finally { setSaving(null); e.target.value = '' }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Large image preview */}
      <div className="relative aspect-[4/3] bg-slate-100">
        {currentUrl
          ? (slot.type === 'video'
              ? <video src={currentUrl} className="w-full h-full object-cover" muted loop />
              : <img src={currentUrl} alt={slot.alt} className="w-full h-full object-cover" loading="lazy" />)
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Image size={28} className="text-slate-300" />
              <span className="text-slate-400 text-xs">No image set</span>
            </div>}
        {backendUrl && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">Live</div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3">
        <p className="text-slate-800 text-sm font-semibold mb-0.5">{slot.label}</p>
        <p className="text-slate-400 text-[10px] font-mono mb-3">{slot.id}</p>

        <div className="flex gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept={slot.type === 'video' ? 'video/*' : 'image/*'} className="hidden" onChange={handleFileChange} />
          <Btn size="sm" onClick={() => fileRef.current?.click()} disabled={saving !== null}>
            {saving === 'upload' ? <><Spinner size={11} /> Uploading…</> : <><Upload size={11} /> Upload</>}
          </Btn>
          {uploads.length > 0 && (
            <Btn size="sm" variant="secondary" onClick={() => setShowPicker(p => !p)} disabled={saving !== null}>
              <Image size={11} /> Pick ({uploads.length})
            </Btn>
          )}
          {backendUrl && (
            <Btn size="sm" variant="secondary" onClick={reset} disabled={saving !== null}>
              {saving === 'reset' ? <Spinner size={11} /> : <RefreshCw size={11} />}
            </Btn>
          )}
        </div>

        {showPicker && uploads.length > 0 && (
          <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-slate-400 text-[10px] mb-2">Pick from library:</p>
            <div className="flex flex-wrap gap-1.5">
              {uploads.map(u => (
                <button key={u.publicId} onClick={() => apply(u.url)} disabled={saving !== null}
                  className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors disabled:opacity-50">
                  {u.type === 'video'
                    ? <video src={u.url} className="w-full h-full object-cover" muted />
                    : <img src={u.url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {uploadErr && <p className="text-red-500 text-[10px] mt-2">{uploadErr}</p>}
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
  const [toggling, setToggling] = useState(false)
  const [toggleError, setToggleError] = useState('')
  const [spendAmount, setSpendAmount] = useState('')
  const [spendNote, setSpendNote] = useState('')
  const [spending, setSpending] = useState(false)
  const [spendError, setSpendError] = useState('')
  const [spendDone, setSpendDone] = useState<{ coupons: number } | null>(null)

  async function toggleActive() {
    if (!detail) return
    setToggling(true); setToggleError('')
    try {
      const updated = await api.patch<PatronRow>(`/patrons/${patronId}/toggle`, {}, token)
      setDetail(prev => prev ? { ...prev, active: updated.active } : prev)
    } catch (e: any) { setToggleError(e.message ?? 'Failed to update status') }
    finally { setToggling(false) }
  }

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

  async function submitSpend() {
    const amount = parseFloat(spendAmount)
    if (isNaN(amount) || amount <= 0) { setSpendError('Enter a valid amount'); return }
    setSpendError(''); setSpending(true); setSpendDone(null)
    try {
      const result = await api.post<{ couponsAwarded: number; patronCouponBalance: number }>(
        '/coupons/spend', { patronId, amount, note: spendNote || null }, token
      )
      setDetail(prev => prev ? { ...prev, couponBalance: result.patronCouponBalance } : prev)
      onBalanceChanged(patronId, result.patronCouponBalance)
      setSpendAmount(''); setSpendNote('')
      setSpendDone({ coupons: result.couponsAwarded })
      setTimeout(() => setSpendDone(null), 4000)
    } catch (e: any) { setSpendError(e.message ?? 'Failed to record spend') } finally { setSpending(false) }
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
              <div className="mt-1 flex flex-col items-end gap-1.5">
                <Badge variant={detail.active ? 'green' : 'red'}>{detail.active ? 'Active' : 'Inactive'}</Badge>
                <Btn size="sm" variant={detail.active ? 'danger' : 'secondary'} disabled={toggling} onClick={toggleActive}>
                  {toggling ? <Spinner size={11} /> : detail.active ? 'Deactivate' : 'Activate'}
                </Btn>
                {toggleError && <p className="text-red-500 text-[10px]">{toggleError}</p>}
              </div>
            </div>
          </div>

          {/* Record spend */}
          <div className="border border-amber-100 bg-amber-50/40 rounded-xl p-4">
            <p className="text-slate-800 font-semibold text-sm mb-1">Record Spend &amp; Award Coupons</p>
            <p className="text-slate-500 text-xs mb-3">Enter the receipt amount — coupons are calculated and added automatically.</p>
            <div className="flex gap-2 mb-2">
              <div className="w-40 flex-shrink-0">
                <Input
                  type="number" value={spendAmount}
                  onChange={e => { setSpendAmount(e.target.value); setSpendError('') }}
                  placeholder="Amount (KES)"
                />
              </div>
              <Input value={spendNote} onChange={e => setSpendNote(e.target.value)} placeholder="Note / receipt ref (optional)" />
              <Btn disabled={!spendAmount || spending} onClick={submitSpend}>
                {spending ? <Spinner size={13} /> : spendDone ? <><Check size={13} /> +{spendDone.coupons} coupons!</> : 'Record'}
              </Btn>
            </div>
            {spendError && <p className="text-red-600 text-xs">{spendError}</p>}
            {spendDone && <p className="text-amber-700 text-xs font-semibold">{spendDone.coupons} coupon{spendDone.coupons !== 1 ? 's' : ''} added — new balance: {detail?.couponBalance}</p>}
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

function EnrollPatronModal({ token, onClose, onEnrolled }: {
  token: string; onClose: () => void; onEnrolled: () => void
}) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setError('PIN must be exactly 4 digits'); return }
    setSaving(true); setError('')
    try {
      await api.post('/patrons/enroll', { phone, name, pin }, token)
      onEnrolled()
      onClose()
    } catch (e: any) { setError(e.message ?? 'Enrollment failed') } finally { setSaving(false) }
  }

  return (
    <Modal title="Enroll Patron" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
          <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jane Wanjiru" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
          <Input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +254712345678" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">4-Digit PIN *</label>
          <Input required value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4 digits — patron uses this to log in" maxLength={4} inputMode="numeric" />
          <p className="text-slate-400 text-xs mt-1">The patron will use their phone number + this PIN to access their portal.</p>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving}>{saving ? <Spinner size={13} /> : 'Enroll Patron'}</Btn>
        </div>
      </form>
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
  const [enrollOpen, setEnrollOpen] = useState(false)

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

  function reload() { setPage(0); setQuery(''); setSearch('') }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Patrons</h2>
          <p className="text-slate-500 text-sm">{total} enrolled member{total !== 1 ? 's' : ''}</p>
        </div>
        <Btn onClick={() => setEnrollOpen(true)}><Plus size={14} /> Enroll Patron</Btn>
      </div>
      {enrollOpen && (
        <EnrollPatronModal token={token} onClose={() => setEnrollOpen(false)} onEnrolled={reload} />
      )}

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
// PROMOTIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const PROMO_TAG_CONFIG: Record<PromotionTag, { label: string; color: string; bg: string }> = {
  DEAL:       { label: 'Deal',        color: '#92400e', bg: '#fef3c7' },
  DISCOUNT:   { label: 'Discount',    color: '#991b1b', bg: '#fee2e2' },
  NEW:        { label: 'New',         color: '#075985', bg: '#e0f2fe' },
  EXPERIENCE: { label: 'Experience',  color: '#5b21b6', bg: '#ede9fe' },
  EVENT:      { label: 'Event',       color: '#065f46', bg: '#d1fae5' },
  SEASONAL:   { label: 'Seasonal',    color: '#9a3412', bg: '#ffedd5' },
}

const BLANK_PROMO = (): Partial<PromotionData> & { tag: PromotionTag } => ({
  title: '', subtitle: '', tag: 'DEAL', ctaLabel: '', ctaUrl: '',
  imageUrl: '', active: true, expiresAt: null, displayOrder: 0,
})

function PromotionsTab({ token }: { token: string }) {
  const [promos, setPromos] = useState<PromotionData[]>([])
  const [editing, setEditing] = useState<Partial<PromotionData> & { tag: PromotionTag } | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const promoImgRef = useRef<HTMLInputElement>(null)
  const { get: getBlock } = useContentBlocks()

  useEffect(() => {
    api.get<PromotionData[]>('/promotions', token).then(setPromos).catch(() => {})
  }, [token])

  function startNew() { setEditing(BLANK_PROMO()); setIsNew(true); setSaved(false); setSaveError('') }
  function startEdit(p: PromotionData) { setEditing({ ...p }); setIsNew(false); setSaved(false); setSaveError('') }
  function cancel() { setEditing(null); setIsNew(false); setSaveError(''); setUploadError('') }

  async function save() {
    if (!editing || !editing.title?.trim()) return
    setSaving(true)
    try {
      const body = {
        title: editing.title, subtitle: editing.subtitle || null,
        tag: editing.tag, ctaLabel: editing.ctaLabel || null,
        ctaUrl: editing.ctaUrl || null, imageUrl: editing.imageUrl || null,
        active: editing.active ?? true,
        expiresAt: editing.expiresAt || null,
        displayOrder: editing.displayOrder ?? 0,
      }
      if (isNew) {
        const created = await api.post<PromotionData>('/promotions', body, token)
        setPromos(prev => [created, ...prev])
      } else {
        const updated = await api.put<PromotionData>(`/promotions/${editing.id}`, body, token)
        setPromos(prev => prev.map(p => p.id === updated.id ? updated : p))
      }
      invalidatePromotionsCache()
      setSaved(true); setTimeout(() => { setSaved(false); cancel() }, 1200)
    } catch (e: any) { setSaveError(e.message ?? 'Save failed') } finally { setSaving(false) }
  }

  async function uploadPromoImage(file: File) {
    if (!editing) return
    const cloudName = getBlock('cloudinary.cloud_name', '')
    const uploadPreset = getBlock('cloudinary.upload_preset', '')
    if (!cloudName || !uploadPreset) { setUploadError('Cloudinary credentials not configured in Content tab'); return }
    setUploading(true); setUploadError('')
    try {
      const { uploadToCloudinary } = await import('../config/cloudinary')
      const url = await uploadToCloudinary(file, cloudName, uploadPreset, 'promotions')
      setEditing(prev => prev ? { ...prev, imageUrl: url } : prev)
    } catch { setUploadError('Image upload failed') } finally { setUploading(false) }
  }

  async function toggle(p: PromotionData) {
    try {
      const updated = await api.patch<PromotionData>(`/promotions/${p.id}/toggle`, {}, token)
      setPromos(prev => prev.map(x => x.id === updated.id ? updated : x))
      invalidatePromotionsCache()
    } catch {}
  }

  async function remove(p: PromotionData) {
    if (!confirm(`Delete "${p.title}"?`)) return
    try {
      await api.del<void>(`/promotions/${p.id}`, token)
      setPromos(prev => prev.filter(x => x.id !== p.id))
      if (editing?.id === p.id) cancel()
      invalidatePromotionsCache()
    } catch {}
  }

  const tc = editing ? PROMO_TAG_CONFIG[editing.tag] : null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Promotions</h2>
          <p className="text-slate-500 text-sm">Manage the homepage banner strip and the <a href="/promotions" target="_blank" className="text-blue-600 hover:underline">/promotions</a> marketing page — both are driven by this list.</p>
        </div>
        {!editing && (
          <Btn onClick={startNew}><Plus size={14} className="mr-1.5" />New Promotion</Btn>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {promos.length === 0 && !editing && (
            <EmptyState icon={Megaphone} title="No promotions yet" sub="Click New Promotion to add your first deal or announcement" />
          )}
          {promos.map(p => {
            const tc = PROMO_TAG_CONFIG[p.tag]
            return (
              <div key={p.id}
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  editing?.id === p.id ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => startEdit(p)}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-slate-800 font-semibold text-sm leading-snug flex-1">{p.title}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: tc.color, backgroundColor: tc.bg }}>{tc.label}</span>
                    <Badge variant={p.active ? 'green' : 'gray'}>{p.active ? 'Live' : 'Off'}</Badge>
                  </div>
                </div>
                {p.subtitle && <p className="text-slate-400 text-xs line-clamp-2">{p.subtitle}</p>}
                <div className="flex items-center justify-between mt-2">
                  {p.expiresAt && <span className="text-slate-400 text-[10px]">Expires {p.expiresAt}</span>}
                  <div className="flex items-center gap-1 ml-auto" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggle(p)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title={p.active ? 'Deactivate' : 'Activate'}>
                      {p.active ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button onClick={() => remove(p)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {editing ? (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-slate-900 font-semibold">{isNew ? 'New Promotion' : 'Edit Promotion'}</h3>
                {saved && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
              </div>
              <div className="space-y-4">
                <FieldGroup label="Tag / Type">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(PROMO_TAG_CONFIG) as PromotionTag[]).map(t => {
                      const c = PROMO_TAG_CONFIG[t]
                      return (
                        <button key={t} onClick={() => setEditing({ ...editing, tag: t })}
                          className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                          style={editing.tag === t
                            ? { color: c.color, backgroundColor: c.bg, borderColor: c.color }
                            : { color: '#94a3b8', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
                          }>
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                </FieldGroup>

                <FieldGroup label="Headline *">
                  <Input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Weekend Family Package — Special Rate" />
                </FieldGroup>

                <FieldGroup label="Description" hint="Shown below the headline on the strip">
                  <Textarea rows={3} value={editing.subtitle ?? ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} placeholder="Short description of the offer..." />
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="CTA Button Label" hint="Defaults to 'Claim Offer'">
                    <Input value={editing.ctaLabel ?? ''} onChange={e => setEditing({ ...editing, ctaLabel: e.target.value })} placeholder="Book Now" />
                  </FieldGroup>
                  <FieldGroup label="CTA URL" hint="Leave blank to auto-link to WhatsApp">
                    <Input value={editing.ctaUrl ?? ''} onChange={e => setEditing({ ...editing, ctaUrl: e.target.value })} placeholder="https://... or /park" />
                  </FieldGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Expires On" hint="Leave blank to never expire">
                    <Input type="date" value={editing.expiresAt ?? ''} onChange={e => setEditing({ ...editing, expiresAt: e.target.value || null })} />
                  </FieldGroup>
                  <FieldGroup label="Display Order" hint="Lower = shown first">
                    <Input type="number" min="0" value={editing.displayOrder ?? 0} onChange={e => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })} />
                  </FieldGroup>
                </div>

                <FieldGroup label="Banner Image" hint="Upload from device or paste a Cloudinary URL">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={editing.imageUrl ?? ''}
                        onChange={e => setEditing({ ...editing, imageUrl: e.target.value })}
                        placeholder="https://res.cloudinary.com/…"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => promoImgRef.current?.click()}
                        disabled={uploading}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all disabled:opacity-40"
                      >
                        {uploading ? <Spinner size={12} /> : <Upload size={12} />}
                        {uploading ? 'Uploading…' : 'Upload'}
                      </button>
                      <input
                        ref={promoImgRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadPromoImage(f); e.target.value = '' }}
                      />
                    </div>
                    {uploadError && <p className="text-red-600 text-xs mt-1">{uploadError}</p>}
                    {editing.imageUrl && (
                      <div className="relative rounded-lg overflow-hidden h-24 bg-slate-100">
                        <img src={editing.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, imageUrl: '' })}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-md px-2 py-0.5 text-[10px] font-semibold hover:bg-black/80 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </FieldGroup>

                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button onClick={() => setEditing({ ...editing, active: !editing.active })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        editing.active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                      {editing.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {editing.active ? 'Live on site' : 'Hidden'}
                    </button>
                  </label>
                </div>

                {/* Live preview chip */}
                {editing.title && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 mt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 pt-3 pb-1">Preview</p>
                    <div className="px-4 pb-4 flex items-center gap-3"
                      style={{ backgroundColor: '#1a0f0f' }}>
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ backgroundColor: tc?.color, minHeight: 36 }}
                      />
                      <div className="flex-1 min-w-0 py-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white mb-1.5 inline-block"
                          style={{ backgroundColor: tc?.color }}>{tc?.label}</span>
                        <p className="text-white font-bold text-sm leading-snug">{editing.title}</p>
                        {editing.subtitle && <p className="text-white/50 text-xs mt-0.5 line-clamp-1">{editing.subtitle}</p>}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full text-white flex-shrink-0"
                        style={{ backgroundColor: tc?.color }}>
                        {editing.ctaLabel || 'Find Out More'}
                      </span>
                    </div>
                  </div>
                )}

                {saveError && <p className="text-red-600 text-xs">{saveError}</p>}
                {uploadError && <p className="text-red-600 text-xs">{uploadError}</p>}
                <div className="flex gap-2 pt-1">
                  <Btn onClick={save} disabled={saving || !editing.title?.trim()}>
                    {saving ? <><Spinner size={13} /> Saving…</> : saved ? <><Check size={13} /> Saved</> : isNew ? 'Create Promotion' : 'Save Changes'}
                  </Btn>
                  <Btn variant="ghost" onClick={cancel}>Cancel</Btn>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon={Tag} title="Select a promotion to edit" sub="Or click New Promotion to create one" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PACKAGES TAB
// ═══════════════════════════════════════════════════════════════════════════════
interface PackageItem {
  id: string; slug: string; title: string; description: string
  price: string; tag: string; accentColor: string | null; solidBg: boolean
  ctaLabel: string; features: string[]; displayOrder: number; visible: boolean
}

function PackageCard({ pkg, selected, onClick }: { pkg: PackageItem; selected: boolean; onClick: () => void }) {
  const accent = pkg.accentColor ?? '#C8873A'
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 border-2 transition-all"
      style={{
        borderColor: selected ? accent : 'transparent',
        background: selected ? `${accent}10` : 'rgba(255,255,255,0.5)',
        boxShadow: selected ? `0 0 0 1px ${accent}40` : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-black text-xs"
          style={{ background: pkg.solidBg ? accent : `linear-gradient(135deg, ${accent}cc, ${accent}66)` }}>
          {pkg.title.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{pkg.title}</p>
          <p className="font-mono text-slate-500 text-xs">{pkg.price}</p>
        </div>
        {pkg.tag && (
          <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: `${accent}18`, color: accent }}>{pkg.tag}</span>
        )}
      </div>
    </button>
  )
}

function PackagesTab({ token }: { token: string }) {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PackageItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const [newFeature, setNewFeature] = useState('')

  // Editable draft
  const [draft, setDraft] = useState<PackageItem | null>(null)

  useEffect(() => {
    api.get<PackageItem[]>('/service-items?category=PARK_PACKAGE', token)
      .then(data => { setPackages(data); if (data.length > 0) selectPkg(data[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  function selectPkg(pkg: PackageItem) {
    setSelected(pkg)
    setDraft({ ...pkg, features: [...pkg.features] })
    setSaveError(''); setSaved(false); setNewFeature('')
  }

  function set<K extends keyof PackageItem>(key: K, val: PackageItem[K]) {
    setDraft(prev => prev ? { ...prev, [key]: val } : prev)
    setSaved(false)
  }

  function addFeature() {
    if (!newFeature.trim() || !draft) return
    set('features', [...draft.features, newFeature.trim()])
    setNewFeature('')
  }

  function removeFeature(i: number) {
    if (!draft) return
    set('features', draft.features.filter((_, idx) => idx !== i))
  }

  function moveFeature(i: number, dir: -1 | 1) {
    if (!draft) return
    const f = [...draft.features]
    const j = i + dir
    if (j < 0 || j >= f.length) return
    ;[f[i], f[j]] = [f[j], f[i]]
    set('features', f)
  }

  async function save() {
    if (!draft || !selected) return
    setSaving(true); setSaveError('')
    try {
      const updated = await api.put<PackageItem>(`/service-items/${selected.id}`, {
        title: draft.title,
        description: draft.description,
        price: draft.price,
        tag: draft.tag || null,
        accentColor: draft.accentColor || null,
        solidBg: draft.solidBg,
        ctaLabel: draft.ctaLabel || null,
        features: draft.features,
        visible: draft.visible,
        displayOrder: draft.displayOrder,
      }, token)
      setPackages(prev => prev.map(p => p.id === updated.id ? updated : p))
      setSelected(updated)
      setDraft({ ...updated, features: [...updated.features] })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (e: any) { setSaveError(e.message ?? 'Save failed') } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-slate-900 font-bold text-lg">Park Packages</h2>
        <p className="text-slate-500 text-sm">Edit each package's price, colour, inclusions, and CTA label. Changes reflect live on the website.</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size={20} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Left: package list */}
          <div className="space-y-2">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} selected={selected?.id === pkg.id} onClick={() => selectPkg(pkg)} />
            ))}
            <p className="text-slate-400 text-[10px] px-1 pt-2">Packages are sorted by Display Order. Edit via Service Items tab to reorder.</p>
          </div>

          {/* Right: editor */}
          {draft ? (
            <Card>
              <div className="space-y-5">
                {/* Preview strip */}
                <div className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: draft.solidBg ? (draft.accentColor ?? '#C8873A') : `${draft.accentColor ?? '#C8873A'}15`, border: `1px solid ${draft.accentColor ?? '#C8873A'}40` }}>
                  <div>
                    <p className="font-display font-black text-lg" style={{ color: draft.solidBg ? '#fff' : (draft.accentColor ?? '#C8873A') }}>
                      {draft.title}
                    </p>
                    <p className="font-mono text-sm" style={{ color: draft.solidBg ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.45)' }}>
                      {draft.price || 'No price set'}
                    </p>
                  </div>
                  {draft.tag && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                      style={{ background: draft.solidBg ? 'rgba(255,255,255,0.25)' : `${draft.accentColor}28`, color: draft.solidBg ? '#fff' : draft.accentColor ?? '#C8873A' }}>
                      {draft.tag}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Package Name</label>
                    <Input value={draft.title} onChange={e => set('title', e.target.value)} />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Price Label</label>
                    <Input value={draft.price ?? ''} onChange={e => set('price', e.target.value)} placeholder="e.g. KES 1,000/pax" />
                  </div>
                  {/* Tag badge */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Badge / Tag</label>
                    <Input value={draft.tag ?? ''} onChange={e => set('tag', e.target.value)} placeholder="e.g. Popular, All-In (leave blank for none)" />
                  </div>
                  {/* CTA label */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">CTA Button Label</label>
                    <Input value={draft.ctaLabel ?? ''} onChange={e => set('ctaLabel', e.target.value)} placeholder="e.g. Secure Platinum Now" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    value={draft.description ?? ''}
                    onChange={e => set('description', e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none font-body"
                    placeholder="Short description shown on the packages tab"
                  />
                </div>

                {/* Colour palette */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Colour Palette</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Accent colour</label>
                      <input
                        type="color"
                        value={draft.accentColor ?? '#C8873A'}
                        onChange={e => set('accentColor', e.target.value)}
                        className="w-9 h-9 rounded cursor-pointer border border-slate-200"
                        title="Package accent / highlight colour"
                      />
                      <span className="font-mono text-xs text-slate-400">{draft.accentColor ?? '#C8873A'}</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={draft.solidBg}
                        onChange={e => set('solidBg', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs text-slate-600">Solid colour card background (use accent as fill)</span>
                    </label>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-1.5">
                    Unchecked → card uses a derived dark background with the accent for text & dots.<br />
                    Checked → card background = accent colour (like the Platinum gold card).
                  </p>
                </div>

                {/* Features / inclusions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Package Inclusions</label>
                  <div className="space-y-1.5 mb-3">
                    {draft.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: draft.accentColor ?? '#C8873A' }} />
                        <span className="flex-1 text-sm text-slate-700 font-body">{f}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveFeature(i, -1)} disabled={i === 0}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-all text-xs">↑</button>
                          <button onClick={() => moveFeature(i, 1)} disabled={i === draft.features.length - 1}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-all text-xs">↓</button>
                          <button onClick={() => removeFeature(i)}
                            className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {draft.features.length === 0 && (
                      <p className="text-slate-400 text-xs py-2">No inclusions yet — add some below.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addFeature()}
                      placeholder="Add inclusion (e.g. Zipline, Swimming)"
                    />
                    <Btn onClick={addFeature} disabled={!newFeature.trim()}><Plus size={13} /> Add</Btn>
                  </div>
                </div>

                {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
                <div className="flex items-center gap-3 pt-1">
                  <Btn onClick={save} disabled={saving}>
                    {saving ? <><Spinner size={13} /> Saving…</> : saved ? <><Check size={13} /> Saved</> : 'Save Changes'}
                  </Btn>
                  <Btn variant="ghost" onClick={() => selectPkg(selected!)}>Reset</Btn>
                  {saved && <p className="text-emerald-600 text-xs">Changes saved — live on the website.</p>}
                </div>
              </div>
            </Card>
          ) : (
            <EmptyState icon={TicketPercent} title="Select a package to edit" />
          )}
        </div>
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
  const [deactivating, setDeactivating] = useState<string | null>(null)

  async function deactivate(u: UserRow) {
    if (!confirm(`Deactivate ${u.username}? They will no longer be able to log in.`)) return
    setDeactivating(u.id)
    try { await api.del(`/users/${u.id}`, token); load() }
    catch (e: any) { alert(e.message ?? 'Deactivation failed') }
    finally { setDeactivating(null) }
  }

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
        {([{ role: 'STAFF', label: 'Staff' }, { role: 'ADMIN', label: 'Admins' }] as const).map(({ role, label }) => (
          <button key={role} onClick={() => setRoleFilter(role)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${roleFilter === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
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
                      <div className="flex items-center gap-2">
                        <Btn size="sm" variant="ghost" onClick={() => setResetTarget(u)}>Reset PW</Btn>
                        {u.active && (
                          <Btn size="sm" variant="danger" disabled={deactivating === u.id} onClick={() => deactivate(u)}>
                            {deactivating === u.id ? <Spinner size={11} /> : 'Deactivate'}
                          </Btn>
                        )}
                      </div>
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
interface LogRow { id: string; actorUsername: string; action: string; entityType: string; detail: string | null; createdAt: string }

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
                  {['Action','By','Entity','Detail','Time'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5"><Badge variant={actionVariant[l.action] ?? 'gray'}>{l.action.replace(/_/g, ' ')}</Badge></td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">{l.actorUsername}</td>
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
type BookingServiceType = 'PARK' | 'APARTMENTS' | 'WATER' | 'EVENTS' | 'RESTAURANT' | 'OTHER' | 'CORPORATE'

interface BookingRow {
  id: string; name: string; phone: string; email: string
  service: BookingServiceType; visitDate: string | null; guests: number
  company: string | null; message: string | null; status: BookingStatus; adminNote: string | null; createdAt: string
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
  const [saveError, setSaveError] = useState('')
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
    setSelected(b); setNewStatus(b.status); setNote(b.adminNote ?? ''); setSaveError('')
  }

  async function saveStatus() {
    if (!selected) return
    setSaving(true); setSaveError('')
    try {
      const updated = await api.patch<BookingRow>(`/bookings/${selected.id}/status`, { status: newStatus, note }, token)
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b))
      setSelected(updated)
    } catch (e: any) { setSaveError(e.message ?? 'Save failed') }
    finally { setSaving(false) }
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
                      <p className="text-slate-800 font-semibold text-sm truncate">{b.name}{b.company ? ` · ${b.company}` : ''}</p>
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
                  ['Organisation', selected.company || '—'],
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
                {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
                <div className="flex gap-2">
                  <Btn onClick={saveStatus} disabled={saving || (newStatus === selected.status && note === (selected.adminNote ?? ''))}>
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
  home: 'Home Page Content',
  events: 'Events Page',
  footer: 'Footer',
  cloudinary: 'Cloudinary Config',
  booking: 'M-Pesa Payment Settings',
}

// ── Page definitions for per-page media & content editing ─────────────────────
const SITE_PAGES = [
  { id: 'home',       label: 'Home',        mediaSections: ['Hero', 'Experience Cards', 'Featured'], contentSections: ['announcement', 'hero', 'home'] },
  { id: 'park',       label: 'Park',        mediaSections: ['Park Playground'],                       contentSections: ['pricing'] },
  { id: 'gallery',    label: 'Gallery',     mediaSections: ['Gallery'],                               contentSections: [] },
  { id: 'events',     label: 'Events',      mediaSections: [],                                        contentSections: ['events'] },
  { id: 'contact',    label: 'Contact',     mediaSections: [],                                        contentSections: ['contact'] },
  { id: 'footer',     label: 'Footer',      mediaSections: [],                                        contentSections: ['footer'] },
  { id: 'booking',    label: 'Booking',     mediaSections: [],                                        contentSections: ['booking'] },
  { id: 'settings',   label: 'Settings',    mediaSections: [],                                        contentSections: ['cloudinary'] },
] as const

function ContentTab({ token }: { token: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<Record<string, string>>({})
  const [activePage, setActivePage] = useState<string>('home')
  const [credDraft, setCredDraft] = useState({ cloudName: getClds().cloudName, uploadPreset: getClds().uploadPreset })
  const [credSaved, setCredSaved] = useState(false)

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
      setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2500)
      invalidateContentCache()
    } catch {
      setError(p => ({ ...p, [key]: 'Save failed' }))
    } finally {
      setSaving(p => ({ ...p, [key]: false }))
    }
  }

  function saveCredentials() {
    localStorage.setItem(CLD_CLOUD_KEY, credDraft.cloudName.trim())
    localStorage.setItem(CLD_PRESET_KEY, credDraft.uploadPreset.trim())
    setCredSaved(true)
    setTimeout(() => setCredSaved(false), 2500)
  }

  const isMultiline = (key: string) =>
    key.includes('.heading') || key.includes('.subheading') || key.includes('.text') ||
    key.includes('.desc') || key.includes('.sub') || key.includes('.tagline') ||
    key.includes('announcement.text') || key.includes('footer.tagline') ||
    key.includes('.instructions')

  const page = SITE_PAGES.find(p => p.id === activePage) ?? SITE_PAGES[0]
  const pageBlocks = blocks.filter(b => (page.contentSections as readonly string[]).includes(b.section))

  const blocksBySection = pageBlocks.reduce<Record<string, ContentBlock[]>>((acc, b) => {
    ;(acc[b.section] = acc[b.section] ?? []).push(b)
    return acc
  }, {})

  const isSettingsPage = activePage === 'settings'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-slate-900 font-bold text-lg">Text Content</h2>
        <p className="text-slate-500 text-sm">Edit text per page. Changes go live within 5 minutes. Defaults fall back to built-in static text if not set.</p>
      </div>
      <div className="flex gap-6">
        <PageSidebar activePage={activePage} onSelect={setActivePage}
          pages={SITE_PAGES.map(p => ({ id: p.id, label: p.label }))} />

        <div className="flex-1 min-w-0">
          {isSettingsPage ? (
            /* Cloudinary credentials */
            <Card className="max-w-lg">
              <h3 className="text-slate-900 font-semibold mb-1">Cloudinary Setup</h3>
              <p className="text-slate-400 text-xs mb-5">Stored in browser only. Pre-filled from the database when available.</p>
              <div className="space-y-4">
                <FieldGroup label="Cloud Name">
                  <Input value={credDraft.cloudName} onChange={e => setCredDraft(d => ({ ...d, cloudName: e.target.value }))} placeholder="e.g. j47mpkup" />
                </FieldGroup>
                <FieldGroup label="Upload Preset" hint="Must be 'Unsigned' in Cloudinary console">
                  <Input value={credDraft.uploadPreset} onChange={e => setCredDraft(d => ({ ...d, uploadPreset: e.target.value }))} placeholder="e.g. CabHouse" />
                </FieldGroup>
                <Btn onClick={saveCredentials}>{credSaved ? <><Check size={13} /> Saved</> : 'Save to Browser'}</Btn>
              </div>
            </Card>
          ) : pageBlocks.length === 0 ? (
            <p className="text-slate-400 text-sm">No text blocks for this page yet.</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(blocksBySection).map(([section, items]) => (
                <div key={section}>
                  <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
                    {CONTENT_SECTION_LABELS[section] ?? section}
                  </h4>
                  <div className="space-y-4">
                    {items.map(block => {
                      const draft = drafts[block.key] ?? ''
                      const changed = draft !== block.value
                      const multi = isMultiline(block.key)
                      return (
                        <div key={block.key} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-slate-800 text-sm font-semibold">{block.label}</p>
                              <p className="text-slate-400 text-[10px] font-mono mt-0.5">{block.key}</p>
                            </div>
                            {saved[block.key] && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
                          </div>

                          {/* Edit field */}
                          {multi ? (
                            <Textarea rows={3} value={draft}
                              onChange={e => setDrafts(p => ({ ...p, [block.key]: e.target.value }))} />
                          ) : (
                            <Input value={draft}
                              onChange={e => setDrafts(p => ({ ...p, [block.key]: e.target.value }))} />
                          )}

                          {/* Live preview strip */}
                          {draft && (
                            <div className="mt-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                              <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Preview</p>
                              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{draft}</p>
                            </div>
                          )}

                          {error[block.key] && <p className="text-red-500 text-xs mt-2">{error[block.key]}</p>}

                          <div className="flex items-center justify-between mt-3">
                            {changed && (
                              <button onClick={() => setDrafts(p => ({ ...p, [block.key]: block.value }))}
                                className="text-slate-400 text-xs hover:text-slate-600 transition-colors">
                                Discard
                              </button>
                            )}
                            <div className="ml-auto">
                              <Btn onClick={() => saveBlock(block.key)} disabled={!changed || saving[block.key]}
                                variant={changed ? 'primary' : 'ghost'}>
                                {saving[block.key] ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                {saving[block.key] ? 'Saving…' : 'Save'}
                              </Btn>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

const BLANK_SITEM = (category: string): Omit<SItem, 'id' | 'images'> => ({
  category, slug: '', title: '', description: '', price: '', tag: '', displayOrder: 0, visible: true,
})

function ServiceItemsTab({ token }: { token: string }) {
  const { get: getBlock } = useContentBlocks()
  const [category, setCategory] = useState('PARK_ACTIVITY')
  const [items, setItems] = useState<SItem[]>([])
  const [editing, setEditing] = useState<SItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditing(null); setIsNew(false)
    api.get<SItem[]>(`/service-items?category=${category}`, token).then(setItems).catch(() => {})
  }, [category, token])

  async function save() {
    if (!editing) return; setSaving(true)
    try {
      const body = {
        title: editing.title, description: editing.description, price: editing.price || null,
        tag: editing.tag || null, displayOrder: editing.displayOrder, visible: editing.visible,
      }
      if (isNew) {
        const created = await api.post<SItem>('/service-items', { ...body, category, slug: editing.slug || editing.title.toLowerCase().replace(/\s+/g, '-') }, token)
        setItems(prev => [...prev, created])
        setEditing(created); setIsNew(false)
      } else {
        const updated = await api.put<SItem>(`/service-items/${editing.id}`, body, token)
        setItems(prev => prev.map(s => s.id === updated.id ? updated : s))
        setEditing(updated)
      }
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {} finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this service item?')) return
    try {
      await api.del<void>(`/service-items/${id}`, token)
      setItems(prev => prev.filter(s => s.id !== id))
      if (editing?.id === id) { setEditing(null); setIsNew(false) }
    } catch {}
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Service Items</h2>
          <p className="text-slate-500 text-sm">Edit service item details and manage their Cloudinary images.</p>
        </div>
        <Btn onClick={() => { setEditing({ ...BLANK_SITEM(category), id: '', images: [] } as SItem); setIsNew(true); setSaved(false) }}>
          <Plus size={14} /> New Item
        </Btn>
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
            <div key={s.id}
              className={`p-4 rounded-xl border transition-all ${
                editing?.id === s.id && !isNew ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}>
              <button className="w-full text-left" onClick={() => { setEditing({ ...s }); setIsNew(false); setSaved(false) }}>
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
              <div className="flex justify-end mt-1.5">
                <button onClick={() => deleteItem(s.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <EmptyState icon={FileText} title="No items" sub="No service items in this category" />}
        </div>
        <div className="lg:col-span-3">
          {editing ? (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-slate-900 font-semibold">{isNew ? 'New Service Item' : 'Edit Item'}</h3>
                  {!isNew && <p className="text-slate-400 text-xs font-mono">{editing.slug}</p>}
                </div>
                {saved && <Badge variant="green"><Check size={10} className="mr-1" />Saved</Badge>}
              </div>
              <div className="space-y-4">
                {isNew && (
                  <FieldGroup label="Slug" hint="URL-safe identifier, lowercase with hyphens">
                    <Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="e.g. archery-range" />
                  </FieldGroup>
                )}
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
                  <Btn onClick={save} disabled={saving || !editing.title.trim()}>
                    {saving ? <><Spinner size={13} /> Saving…</> : isNew ? 'Create Item' : 'Save Changes'}
                  </Btn>
                  <Btn variant="ghost" onClick={() => { setEditing(null); setIsNew(false) }}>Cancel</Btn>
                </div>

                {/* Images — only for existing items */}
                {!isNew && (
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
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon={FileText} title="Select an item to edit" sub="Click any service item on the left, or New Item to add one" />
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
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get<GalleryImg[]>(`/gallery?section=${section}`, token).then(setImages).catch(() => {})
  }, [section, token])

  async function uploadImage(file: File) {
    const cloudName = getBlock('cloudinary.cloud_name', '')
    const uploadPreset = getBlock('cloudinary.upload_preset', '')
    if (!cloudName || !uploadPreset) { alert('Cloudinary credentials not configured in Content tab'); return }
    setUploadingCount(n => n + 1)
    try {
      const { uploadToCloudinary } = await import('../config/cloudinary')
      const url = await uploadToCloudinary(file, cloudName, uploadPreset, `gallery/${section.toLowerCase()}`)
      const added = await api.post<GalleryImg>('/gallery', {
        section, cloudinaryUrl: url, label: file.name.replace(/\.[^.]+$/, ''), displayOrder: images.length,
      }, token)
      setImages(prev => [...prev, added])
      invalidateGalleryCache()
    } catch (e: any) { alert(e.message ?? 'Upload failed') } finally {
      setUploadingCount(n => n - 1)
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
          <Btn onClick={() => fileRef.current?.click()} disabled={uploadingCount > 0}>
            {uploadingCount > 0 ? <><Spinner size={13} /> Uploading {uploadingCount}…</> : 'Upload Images'}
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
// RESERVATIONS
// ═══════════════════════════════════════════════════════════════════════════════

type ReservationStatus = 'PENDING_PAYMENT' | 'PAYMENT_RECORDED' | 'CONFIRMED' | 'CANCELLED'

interface BookableResource {
  id: string
  name: string
  slug: string
  type: string
  pricingUnit: string
  basePrice: number
  units: number
  depositType: string
  depositValue: number | null
  dailyVisitorCap: number | null
  bookingNote: string | null
  displayOrder: number
  visible: boolean
}

interface Reservation {
  id: string
  referenceCode: string
  resourceName: string
  resourceId: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  guests: number
  checkIn: string | null
  checkOut: string | null
  depositAmount: number | null
  paymentReference: string | null
  paymentName: string | null
  status: ReservationStatus
  adminNote: string | null
  createdAt: string
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAYMENT_RECORDED: 'Payment Recorded',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT:  'bg-yellow-100 text-yellow-800',
  PAYMENT_RECORDED: 'bg-blue-100 text-blue-800',
  CONFIRMED:        'bg-green-100 text-green-800',
  CANCELLED:        'bg-red-100 text-red-800',
}

function ReservationDetailModal({ reservation: r, token, onClose, onUpdated }: {
  reservation: Reservation; token: string; onClose: () => void; onUpdated: (r: Reservation) => void
}) {
  const [payRef, setPayRef] = useState(r.paymentReference ?? '')
  const [payName, setPayName] = useState(r.paymentName ?? '')
  const [note, setNote] = useState(r.adminNote ?? '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function doAction(action: string) {
    setSaving(true); setErr('')
    try {
      let res: Reservation
      if (action === 'record-payment') {
        res = await api.post<Reservation>(`/reservations/${r.id}/record-payment`, { paymentReference: payRef, paymentName: payName }, token)
      } else if (action === 'note') {
        res = await api.patch<Reservation>(`/reservations/${r.id}/note`, { note }, token)
      } else {
        res = await api.post<Reservation>(`/reservations/${r.id}/${action}`, {}, token)
      }
      onUpdated(res)
    } catch (e: any) {
      setErr(e.message ?? 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#C8873A] uppercase">Reservation</p>
            <h2 className="text-lg font-bold text-gray-900">{r.referenceCode}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {[
                ['Package', r.resourceName],
                ['Customer', r.customerName],
                ['Phone', r.customerPhone],
                ['Email', r.customerEmail ?? '—'],
                ['Guests', String(r.guests)],
                ['Check-in', r.checkIn ?? '—'],
                ['Check-out', r.checkOut ?? '—'],
                ['Deposit', r.depositAmount != null ? `KES ${Number(r.depositAmount).toLocaleString()}` : '—'],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="py-2 pr-4 text-gray-500 w-28">{label}</td>
                  <td className="py-2 font-medium text-gray-900">{val}</td>
                </tr>
              ))}
              {r.paymentReference && (
                <>
                  <tr><td className="py-2 pr-4 text-gray-500">M-Pesa Ref</td><td className="py-2 font-medium">{r.paymentReference}</td></tr>
                  <tr><td className="py-2 pr-4 text-gray-500">Paid by</td><td className="py-2 font-medium">{r.paymentName}</td></tr>
                </>
              )}
            </tbody>
          </table>

          {r.status === 'PENDING_PAYMENT' && (
            <div className="border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Record M-Pesa Payment</p>
              <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="M-Pesa reference (e.g. QBC1234XYZ)" className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input value={payName} onChange={e => setPayName(e.target.value)} placeholder="Name used to pay" className="w-full border rounded-lg px-3 py-2 text-sm" />
              <button onClick={() => doAction('record-payment')} disabled={saving || !payRef.trim() || !payName.trim()} className="w-full bg-[#C8873A] hover:bg-[#b07530] text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : 'Mark as Payment Received'}
              </button>
            </div>
          )}

          {r.status === 'PAYMENT_RECORDED' && (
            <button onClick={() => doAction('confirm')} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
              {saving ? 'Confirming…' : 'Confirm Reservation'}
            </button>
          )}

          {(r.status === 'PENDING_PAYMENT' || r.status === 'PAYMENT_RECORDED') && (
            <button onClick={() => doAction('cancel')} disabled={saving} className="w-full border border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
              Cancel Reservation
            </button>
          )}

          <div className="border rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Admin Note</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" placeholder="Internal note…" />
            <button onClick={() => doAction('note')} disabled={saving} className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
              Save Note
            </button>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  )
}

function ReservationsTab({ token }: { token: string }) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [resources, setResources] = useState<BookableResource[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [showResources, setShowResources] = useState(false)

  async function load(p = 0) {
    setLoading(true); setErr('')
    try {
      const params = new URLSearchParams({ page: String(p), size: '20' })
      if (statusFilter) params.set('status', statusFilter)
      if (resourceFilter) params.set('resourceId', resourceFilter)
      if (search.trim()) params.set('search', search.trim())
      const data = await api.get<{ content: Reservation[]; totalPages: number }>(`/reservations?${params}`, token)
      setReservations(data.content)
      setTotalPages(data.totalPages)
      setPage(p)
    } catch (e: any) {
      setErr(e.message ?? 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function loadResources() {
    try {
      const data = await api.get<BookableResource[]>('/reservations/resources', token)
      setResources(data)
    } catch {}
  }

  useEffect(() => { load(0); loadResources() }, [])

  function onUpdated(r: Reservation) {
    setReservations(prev => prev.map(x => x.id === r.id ? r : x))
    setSelected(r)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
        <button onClick={() => setShowResources(v => !v)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50">
          {showResources ? 'Hide' : 'Manage'} Bookable Resources
        </button>
      </div>

      {showResources && <ResourcesManager resources={resources} token={token} onUpdated={setResources} />}

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(0)}
          placeholder="Search name, ref, phone…" className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-48" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); }} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={resourceFilter} onChange={e => setResourceFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All packages</option>
          {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button onClick={() => load(0)} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold">Search</button>
      </div>

      {err && <p className="text-red-600 text-sm">{err}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#C8873A] border-t-transparent rounded-full animate-spin" /></div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No reservations found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Ref', 'Package', 'Customer', 'Guests', 'Check-in', 'Deposit', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {reservations.map(r => (
                <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#C8873A]">{r.referenceCode}</td>
                  <td className="px-4 py-3">{r.resourceName}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.customerName}</div>
                    <div className="text-gray-400 text-xs">{r.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">{r.guests}</td>
                  <td className="px-4 py-3">{r.checkIn ?? '—'}</td>
                  <td className="px-4 py-3">{r.depositAmount != null ? `KES ${Number(r.depositAmount).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 0} onClick={() => load(page - 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Prev</button>
          <span className="px-3 py-1 text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => load(page + 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
        </div>
      )}

      {selected && (
        <ReservationDetailModal reservation={selected} token={token} onClose={() => setSelected(null)} onUpdated={onUpdated} />
      )}
    </div>
  )
}

function ResourcesManager({ resources, token, onUpdated }: {
  resources: BookableResource[]; token: string; onUpdated: (r: BookableResource[]) => void
}) {
  const [editing, setEditing] = useState<BookableResource | null>(null)
  const [form, setForm] = useState<Partial<BookableResource>>({})
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function startEdit(r: BookableResource) {
    setEditing(r)
    setForm({ ...r })
    setErr('')
  }

  async function save() {
    if (!editing) return
    setSaving(true); setErr('')
    try {
      const updated = await api.put<BookableResource>(`/reservations/resources/${editing.id}`, {
        name: form.name,
        pricingUnit: form.pricingUnit,
        basePrice: form.basePrice,
        units: form.units ?? 1,
        depositType: form.depositType,
        depositValue: form.depositValue,
        maxCapacityPerSlot: null,
        dailyVisitorCap: form.dailyVisitorCap,
        bookingNote: form.bookingNote,
        displayOrder: form.displayOrder ?? 0,
        visible: form.visible ?? true,
      }, token)
      onUpdated(resources.map(r => r.id === updated.id ? updated : r))
      setEditing(null)
    } catch (e: any) {
      setErr(e.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
          <tr>
            {['Name', 'Type', 'Price', 'Deposit', 'Daily Cap', 'Visible', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {resources.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{r.name}</td>
              <td className="px-4 py-3 text-gray-500">{r.type}</td>
              <td className="px-4 py-3">KES {Number(r.basePrice).toLocaleString()}</td>
              <td className="px-4 py-3">{r.depositType === 'FREE' ? 'Free' : r.depositType === 'FLAT' ? `KES ${r.depositValue}` : `${r.depositValue}%`}</td>
              <td className="px-4 py-3">{r.dailyVisitorCap ?? '—'}</td>
              <td className="px-4 py-3">{r.visible ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3"><button onClick={() => startEdit(r)} className="text-[#C8873A] hover:underline text-xs font-semibold">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Edit Resource</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
            </div>
            {([
              ['name', 'Name', 'text'],
              ['basePrice', 'Base Price (KES)', 'number'],
              ['dailyVisitorCap', 'Daily Visitor Cap', 'number'],
              ['bookingNote', 'Booking Note', 'text'],
              ['displayOrder', 'Display Order', 'number'],
            ] as [keyof BookableResource, string, string][]).map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input type={type} value={String(form[key] ?? '')}
                  onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rvis" checked={!!form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} />
              <label htmlFor="rvis" className="text-sm">Visible on public booking form</label>
            </div>
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <div className="flex gap-3">
              <button onClick={save} disabled={saving} className="flex-1 bg-[#C8873A] hover:bg-[#b07530] text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
export default function MdauDev() {
  const navigate = useNavigate()
  const [session, setSession] = useState<AdminSession | null>(getSession)
  const [validating, setValidating] = useState(!!getSession())

  useEffect(() => {
    const s = getSession()
    if (!s) {
      navigate('/login?next=/ch/admin', { replace: true })
      return
    }
    // Validate token is still accepted by the backend
    api.get('/dashboard/stats', s.accessToken)
      .catch(() => {
        clearSession()
        setSession(null)
        navigate('/login?next=/ch/admin', { replace: true })
      })
      .finally(() => setValidating(false))
  }, [])

  // Instant logout when any in-session API call returns 401 and refresh fails
  useEffect(() => {
    function onUnauthorized() {
      clearSession()
      setSession(null)
      navigate('/login?next=/ch/admin', { replace: true })
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [navigate])

  function handleLogout() { clearSession(); setSession(null) }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f9fa' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-slate-200 border-t-slate-600 animate-spin" />
          <p className="text-slate-400 text-sm font-body">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!session) return null
  return <AdminDashboard session={session} onLogout={handleLogout} />
}
