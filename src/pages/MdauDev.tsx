import { useState, useRef } from 'react'
import { Upload, Check, Settings, Image, RefreshCw, Copy, ExternalLink, ChevronDown } from 'lucide-react'
import { MEDIA_SLOTS, type MediaSlot, getSlotUrl } from '../config/media'
import { applyOverride, clearOverride } from '../hooks/useMedia'

// ── Cloudinary config stored in localStorage ────────────────────────────────
const CLD_CLOUD_KEY = 'cld_cloud_name'
const CLD_PRESET_KEY = 'cld_upload_preset'

function getCreds() {
  return {
    cloudName: localStorage.getItem(CLD_CLOUD_KEY) ?? '',
    uploadPreset: localStorage.getItem(CLD_PRESET_KEY) ?? '',
  }
}

// ── Types ────────────────────────────────────────────────────────────────────
interface UploadedAsset {
  url: string
  publicId: string
  type: 'image' | 'video'
  bytes: number
  format: string
  uploadedAt: string
}

// ────────────────────────────────────────────────────────────────────────────
export default function MdauDev() {
  const [tab, setTab] = useState<'credentials' | 'upload' | 'slots'>('credentials')
  const [creds, setCreds] = useState(getCreds)
  const [saved, setSaved] = useState(!!getCreds().cloudName)

  function saveCreds() {
    localStorage.setItem(CLD_CLOUD_KEY, creds.cloudName.trim())
    localStorage.setItem(CLD_PRESET_KEY, creds.uploadPreset.trim())
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-body">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">CabHouse Dev Panel</p>
          <h1 className="font-display font-bold text-xl text-white">Media Manager</h1>
        </div>
        <a href="/" className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors">
          <ExternalLink size={12} /> View Site
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6 flex gap-1">
        {([
          { id: 'credentials', label: 'Credentials', icon: Settings },
          { id: 'upload',      label: 'Upload Assets', icon: Upload },
          { id: 'slots',       label: 'Apply to Slots', icon: Image },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
              tab === t.id ? 'border-brand-gold text-brand-gold' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {tab === 'credentials' && <CredentialsTab creds={creds} setCreds={setCreds} onSave={saveCreds} saved={saved} />}
        {tab === 'upload'      && <UploadTab creds={creds} />}
        {tab === 'slots'       && <SlotsTab creds={creds} />}
      </div>
    </div>
  )
}

// ── Credentials Tab ──────────────────────────────────────────────────────────
function CredentialsTab({
  creds, setCreds, onSave, saved
}: {
  creds: { cloudName: string; uploadPreset: string }
  setCreds: (c: { cloudName: string; uploadPreset: string }) => void
  onSave: () => void
  saved: boolean
}) {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold text-white mb-2">Cloudinary Credentials</h2>
      <p className="text-white/50 text-sm mb-8 leading-relaxed">
        Enter your Cloudinary cloud name and an unsigned upload preset. These are stored in your browser localStorage and never sent anywhere except Cloudinary's API during uploads.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Cloud Name</label>
          <input
            type="text"
            value={creds.cloudName}
            onChange={e => setCreds({ ...creds, cloudName: e.target.value })}
            placeholder="e.g. my-cloud"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-gold transition-colors"
          />
          <p className="text-white/30 text-xs mt-1.5">Found in your Cloudinary dashboard under Account Details</p>
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Unsigned Upload Preset</label>
          <input
            type="text"
            value={creds.uploadPreset}
            onChange={e => setCreds({ ...creds, uploadPreset: e.target.value })}
            placeholder="e.g. cabhouse_unsigned"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-gold transition-colors"
          />
          <p className="text-white/30 text-xs mt-1.5">Create in Cloudinary: Settings &rarr; Upload &rarr; Upload Presets &rarr; Add unsigned preset</p>
        </div>

        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {saved ? <><Check size={16} /> Saved</> : 'Save Credentials'}
        </button>

        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
            Credentials saved. You can now upload assets in the Upload tab.
          </div>
        )}
      </div>

      <div className="mt-12 bg-white/3 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Setup Guide</h3>
        <ol className="space-y-2 text-xs text-white/50 list-decimal list-inside leading-relaxed">
          <li>Create a free Cloudinary account at cloudinary.com</li>
          <li>Copy your Cloud Name from the Dashboard home page</li>
          <li>Go to Settings &rarr; Upload tab &rarr; Upload Presets</li>
          <li>Click "Add upload preset", set signing mode to "Unsigned"</li>
          <li>Give it a name (e.g. cabhouse_unsigned), save</li>
          <li>Paste both values above and click Save</li>
        </ol>
      </div>
    </div>
  )
}

// ── Upload Tab ───────────────────────────────────────────────────────────────
function UploadTab({ creds }: { creds: { cloudName: string; uploadPreset: string } }) {
  const [uploads, setUploads] = useState<UploadedAsset[]>(() => {
    try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] }
  })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function saveUploads(list: UploadedAsset[]) {
    setUploads(list)
    localStorage.setItem('cld_uploads', JSON.stringify(list))
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!creds.cloudName || !creds.uploadPreset) {
      setError('Set your Cloudinary credentials in the Credentials tab first.')
      return
    }
    setError(null)
    setUploading(true)
    setProgress(0)

    const fileArr = Array.from(files)
    const results: UploadedAsset[] = []

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i]
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', creds.uploadPreset)
      fd.append('folder', 'cabhouse')

      const resourceType = file.type.startsWith('video') ? 'video' : 'image'

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${creds.cloudName}/${resourceType}/upload`,
          { method: 'POST', body: fd }
        )
        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
        const data = await res.json()
        results.push({
          url: data.secure_url,
          publicId: data.public_id,
          type: resourceType,
          bytes: data.bytes,
          format: data.format,
          uploadedAt: new Date().toISOString(),
        })
      } catch (err) {
        setError(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      setProgress(Math.round(((i + 1) / fileArr.length) * 100))
    }

    saveUploads([...results, ...uploads])
    setUploading(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
  }

  function removeUpload(publicId: string) {
    saveUploads(uploads.filter(u => u.publicId !== publicId))
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">Upload Assets to Cloudinary</h2>
      <p className="text-white/50 text-sm mb-8">Upload images and videos directly to your Cloudinary account. They'll be stored in the <code className="text-brand-gold">cabhouse/</code> folder.</p>

      {!creds.cloudName && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm mb-6">
          Set your Cloudinary credentials first in the Credentials tab.
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/30'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={32} className="mx-auto text-white/30 mb-4" />
        <p className="text-white/60 text-sm">Drag & drop images or videos here</p>
        <p className="text-white/30 text-xs mt-1">or click to browse — supports JPG, PNG, WebP, MP4, MOV</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Uploading...</span><span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      {/* Uploaded assets */}
      {uploads.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{uploads.length} Uploaded Asset{uploads.length !== 1 ? 's' : ''}</h3>
            <button onClick={() => saveUploads([])} className="text-xs text-white/30 hover:text-red-400 transition-colors">Clear all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {uploads.map(asset => (
              <div key={asset.publicId} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {asset.type === 'video' ? (
                  <video src={asset.url} className="w-full aspect-square object-cover" muted />
                ) : (
                  <img src={asset.url} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                )}
                <div className="p-3">
                  <p className="text-xs text-white/40 truncate">{asset.publicId.split('/').pop()}</p>
                  <p className="text-xs text-white/30">{(asset.bytes / 1024).toFixed(0)} KB · {asset.format}</p>
                </div>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => copyUrl(asset.url)}
                    className="flex items-center gap-1.5 bg-brand-gold text-white text-xs font-semibold px-3 py-2 rounded-lg w-full justify-center"
                  >
                    <Copy size={12} /> Copy URL
                  </button>
                  <button
                    onClick={() => removeUpload(asset.publicId)}
                    className="text-xs text-white/50 hover:text-red-400 transition-colors"
                  >
                    Remove from list
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

// ── Slots Tab ─────────────────────────────────────────────────────────────────
function SlotsTab({ creds: _creds }: { creds: { cloudName: string; uploadPreset: string } }) {
  const [uploads] = useState<UploadedAsset[]>(() => {
    try { return JSON.parse(localStorage.getItem('cld_uploads') ?? '[]') } catch { return [] }
  })

  const sections = [...new Set(MEDIA_SLOTS.map(s => s.section))]
  const [openSection, setOpenSection] = useState<string>(sections[0])
  const [, forceUpdate] = useState(0)

  function apply(slotId: string, url: string) {
    applyOverride(slotId, url)
    forceUpdate(n => n + 1)
  }

  function reset(slotId: string) {
    clearOverride(slotId)
    forceUpdate(n => n + 1)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">Apply Assets to Website Slots</h2>
      <p className="text-white/50 text-sm mb-8 leading-relaxed">
        Each slot below maps to a specific section on the website. Apply any uploaded Cloudinary URL or paste one manually. Changes are live immediately — no page reload needed.
      </p>

      {uploads.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-white/40 text-sm mb-8">
          No uploads yet. Go to the Upload tab to add assets, then come back here to apply them.
        </div>
      )}

      <div className="space-y-3">
        {sections.map(section => {
          const slots = MEDIA_SLOTS.filter(s => s.section === section)
          const isOpen = openSection === section

          return (
            <div key={section} className="border border-white/10 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpenSection(isOpen ? '' : section)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-sm">{section}</span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{slots.length} slot{slots.length !== 1 ? 's' : ''}</span>
                </div>
                <ChevronDown size={16} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="border-t border-white/10 divide-y divide-white/5">
                  {slots.map(slot => (
                    <SlotRow
                      key={slot.id}
                      slot={slot}
                      uploads={uploads}
                      onApply={apply}
                      onReset={reset}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SlotRow({
  slot, uploads, onApply, onReset
}: {
  slot: MediaSlot
  uploads: UploadedAsset[]
  onApply: (id: string, url: string) => void
  onReset: (id: string) => void
}) {
  const currentUrl = getSlotUrl(slot.id)
  const override = localStorage.getItem(`media_override_${slot.id}`)
  const [manualUrl, setManualUrl] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [copied, setCopied] = useState(false)

  function applyManual() {
    if (manualUrl.trim()) {
      onApply(slot.id, manualUrl.trim())
      setManualUrl('')
    }
  }

  function copyConfig() {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-6 py-5 flex flex-col sm:flex-row gap-4">
      {/* Preview */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
          {currentUrl && slot.type === 'image' ? (
            <img src={currentUrl} alt={slot.alt} className="w-full h-full object-cover" loading="lazy" />
          ) : currentUrl && slot.type === 'video' ? (
            <video src={currentUrl} className="w-full h-full object-cover" muted />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              {slot.type === 'video' ? '▶' : <Image size={20} />}
            </div>
          )}
        </div>
      </div>

      {/* Info + controls */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-white text-sm font-semibold">{slot.label}</p>
            <p className="text-white/30 text-xs">{slot.id} · {slot.type}</p>
          </div>
          <div className="flex items-center gap-2">
            {override && (
              <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full">Override active</span>
            )}
            {currentUrl && (
              <button onClick={copyConfig} className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1">
                {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> URL</>}
              </button>
            )}
          </div>
        </div>

        {/* Current URL */}
        {currentUrl && (
          <p className="text-xs text-white/30 truncate mb-3 font-mono">{currentUrl}</p>
        )}

        {/* From uploaded assets */}
        {uploads.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-xs text-brand-gold hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              {showPicker ? 'Hide' : 'Pick from uploads'} <ChevronDown size={10} className={showPicker ? 'rotate-180' : ''} />
            </button>
            {showPicker && (
              <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uploads.filter(u => u.type === slot.type || slot.type === 'image').map(u => (
                  <button
                    key={u.publicId}
                    onClick={() => { onApply(slot.id, u.url); setShowPicker(false) }}
                    className="relative group rounded-lg overflow-hidden aspect-square border-2 border-transparent hover:border-brand-gold transition-colors"
                  >
                    {u.type === 'video' ? (
                      <video src={u.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={u.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Manual URL input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="Paste Cloudinary URL..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-brand-gold transition-colors font-mono"
            onKeyDown={e => e.key === 'Enter' && applyManual()}
          />
          <button
            onClick={applyManual}
            disabled={!manualUrl.trim()}
            className="bg-brand-green hover:bg-green-700 disabled:opacity-30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Apply
          </button>
          {override && (
            <button
              onClick={() => onReset(slot.id)}
              className="text-white/30 hover:text-red-400 transition-colors px-2"
              title="Reset to default"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
