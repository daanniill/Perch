import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, apiFetch } from './lib/supabase'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

function timeAgo(iso) {
  if (!iso) return 'Never'
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (secs < 60) return 'Just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

// ── toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle}
      className="relative cursor-pointer shrink-0 transition-colors duration-200"
      style={{ width:42, height:24, borderRadius:99, background: on ? '#3665F3' : '#D7DBE2' }}>
      <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200"
        style={{ left: on ? 21 : 3 }}/>
    </div>
  )
}

// ── shared ────────────────────────────────────────────────────────────────────

function PerchLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="6"  y="28" width="7" height="12" rx="2.5" fill="#E53238"/>
      <rect x="16" y="22" width="7" height="18" rx="2.5" fill="#0064D2"/>
      <rect x="26" y="15" width="7" height="25" rx="2.5" fill="#F5AF02"/>
      <rect x="36" y="8"  width="7" height="32" rx="2.5" fill="#86B817"/>
    </svg>
  )
}

function Sidebar({ onNavigate, name, storeName }) {
  const item = (icon, label, active, onClick) => (
    <div key={label} onClick={onClick}
      className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] text-[13.5px] cursor-pointer transition-colors"
      style={active ? { background:'#EAF1FF', color:'#3665F3', fontWeight:600 } : { color:'#5B6470', fontWeight:500 }}>
      {icon}{label}
    </div>
  )
  return (
    <aside className="w-[244px] shrink-0 flex flex-col border-r border-[#EAEBEF] bg-[#F4F5F7] p-[18px_14px] overflow-y-auto">
      <div className="flex items-center gap-[11px] px-2 pb-[18px] pt-[6px]">
        <PerchLogo /><span className="font-bold text-[21px] tracking-[-0.02em]">Perch</span>
      </div>
      <div className="text-[10.5px] font-semibold tracking-[.09em] text-[#A6ADB8] px-[10px] py-[6px]">MENU</div>
      <nav className="flex flex-col gap-[2px]">
        {item(<svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/><rect x="10.1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="1.5" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="10.1" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/></svg>, 'Dashboard', false, () => onNavigate?.('dashboard'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>, 'Listings', false, () => onNavigate?.('listings'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>, 'Create listing', false, () => onNavigate?.('listing-generator'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', false, () => onNavigate?.('analytics'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', false, () => onNavigate?.('finances'))}
      </nav>
      <div className="flex-1" style={{ minHeight:18 }}/>
      <div onClick={() => onNavigate?.('pricing')}
        className="bg-[#16181D] rounded-[13px] p-[14px] mb-[10px] cursor-pointer hover:bg-[#22252D] transition-colors">
        <div className="flex items-center gap-[7px]">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          <span className="text-[12.5px] font-bold text-white">Upgrade to Pro</span>
        </div>
        <div className="text-[11px] text-[#A6ADB8] leading-[1.4] mt-[6px]">Unlock profit analytics &amp; unlimited AI listings.</div>
      </div>
      {/* Settings — active */}
      <div className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] bg-[#EAF1FF] text-[#3665F3] font-semibold text-[13.5px] cursor-pointer mb-[6px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7"><circle cx="9" cy="9" r="2.6"/><circle cx="9" cy="9" r="7"/></svg>
        Settings
      </div>
      <div className="border-t border-[#E7E9EE] pt-3 flex items-center gap-[10px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#16181D] text-white flex items-center justify-center font-semibold text-[13px] shrink-0">{initials(name)}</div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate">{name || '—'}</div>
          <div className="text-[11.5px] text-[#8A93A1] truncate">{storeName || 'No store connected'}</div>
        </div>
      </div>
    </aside>
  )
}

// ── section panels ────────────────────────────────────────────────────────────

function Card({ children, red }) {
  return (
    <div className="bg-white rounded-[16px] p-[24px]"
      style={{ border: `1px solid ${red ? '#F4D9D9' : '#EEF0F4'}`, boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
      {children}
    </div>
  )
}

function FieldInput({ label, ...props }) {
  return (
    <div>
      <div className="text-[12px] font-semibold text-[#5B6470] mb-[6px]">{label}</div>
      <input className="w-full border border-[#E0E3E9] rounded-[10px] px-[13px] py-[11px] text-[13.5px] outline-none focus:border-[#3665F3]"
        style={{ fontFamily:'inherit' }} {...props}/>
    </div>
  )
}

function AccountSection({ account, setAccount, currentPassword, setCurrentPassword, newPassword, setNewPassword, onDeleteAccount }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="text-[16px] font-bold">Profile</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">This is how you appear inside Perch.</div>
        <div className="flex items-center gap-4 mt-5">
          <div className="w-[64px] h-[64px] rounded-[16px] bg-[#16181D] text-white flex items-center justify-center font-bold text-[24px] shrink-0">{initials(account.name)}</div>
          <div className="flex gap-[9px]">
            <button className="bg-white border border-[#E0E3E9] text-[#16181D] font-semibold text-[12.5px] px-[14px] py-[9px] rounded-[9px] cursor-pointer hover:border-[#16181D] transition-colors" style={{ fontFamily:'inherit' }}>Upload photo</button>
            <button className="bg-none border-none text-[#8A93A1] font-semibold text-[12.5px] px-[6px] py-[9px] rounded-[9px] cursor-pointer" style={{ fontFamily:'inherit', background:'none' }}>Remove</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[14px] mt-[22px]">
          <FieldInput label="Full name" value={account.name} onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}/>
          <FieldInput label="Email" type="email" value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))}/>
        </div>
      </Card>

      <Card>
        <div className="text-[16px] font-bold">Password</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">Use a strong, unique password.</div>
        <div className="grid grid-cols-2 gap-[14px] mt-[18px]">
          <FieldInput label="Current password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
          <FieldInput label="New password" type="password" placeholder="••••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
        </div>
      </Card>

      <Card red>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-bold text-[#C8553D]">Delete account</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">Permanently remove your account and all synced data. This can't be undone.</div>
          </div>
          <button onClick={onDeleteAccount} className="shrink-0 bg-white border border-[#E5B5AD] text-[#C8553D] font-semibold text-[12.5px] px-[16px] py-[10px] rounded-[10px] cursor-pointer hover:bg-[#FCEBEC] transition-colors" style={{ fontFamily:'inherit' }}>Delete</button>
        </div>
      </Card>
    </div>
  )
}

function StoreSection({ store, onSync, onDisconnect }) {
  if (!store.connected) {
    return (
      <Card>
        <div className="text-[16px] font-bold">Connected store</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">No eBay store connected.</div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="text-[16px] font-bold">Connected store</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">Perch syncs securely with eBay over OAuth.</div>
        <div className="flex items-center gap-[14px] mt-[18px] p-4 border border-[#EEF0F4] rounded-[13px] bg-[#FAFBFC]">
          <span className="flex gap-[3px] items-center shrink-0">
            {['#E53238','#0064D2','#F5AF02','#86B817'].map(c => (
              <span key={c} className="w-[9px] h-[9px] rounded-full" style={{ background:c }}/>
            ))}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold">{store.storeName || 'eBay store'}</div>
            <div className="text-[12px] text-[#8A93A1]">eBay.com</div>
          </div>
          <span className="text-[11.5px] font-semibold text-[#5C8A00] bg-[#EEF5DC] px-[10px] py-1 rounded-full flex items-center gap-[6px] shrink-0">
            <span className="w-[6px] h-[6px] rounded-full bg-[#5C8A00]"/>Connected
          </span>
          <button onClick={onDisconnect} className="bg-white border border-[#E0E3E9] text-[#5B6470] font-semibold text-[12.5px] px-[13px] py-2 rounded-[9px] cursor-pointer hover:border-[#C8553D] hover:text-[#C8553D] transition-colors shrink-0" style={{ fontFamily:'inherit' }}>Disconnect</button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-[14px]">
          {[['Listings synced', store.listingCount ?? 0, true],['Orders synced', store.orderCount ?? 0, true],['Last sync', timeAgo(store.lastSyncedAt), false]].map(([label, val, isNum]) => (
            <div key={label} className="border border-[#EEF0F4] rounded-[11px] p-[13px]">
              <div className="text-[11px] text-[#A6ADB8]">{label}</div>
              <div className={`${isNum ? 'num' : ''} text-[18px] font-bold mt-[3px]`}>{val}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-[16px] font-bold">Sync</div>
        <div className="flex items-center justify-between mt-[14px] pb-[14px] border-b border-[#F4F5F7]">
          <div>
            <div className="text-[13.5px] font-semibold">Auto-sync frequency</div>
            <div className="text-[12px] text-[#8A93A1] mt-[2px]">How often Perch pulls new orders &amp; fees.</div>
          </div>
          <div className="flex items-center gap-2 border border-[#E0E3E9] rounded-[10px] px-[13px] py-[9px] text-[13px] font-semibold cursor-pointer">
            Every 15 minutes <span className="text-[#A6ADB8]">▾</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[14px]">
          <div>
            <div className="text-[13.5px] font-semibold">Re-sync now</div>
            <div className="text-[12px] text-[#8A93A1] mt-[2px]">
              {store.syncing ? `Syncing… ${store.progress ?? 0}%` : 'Force a full refresh of store data.'}
            </div>
          </div>
          <button onClick={onSync} disabled={store.syncing} className="bg-[#3665F3] text-white border-none font-semibold text-[12.5px] px-[15px] py-[9px] rounded-[10px] cursor-pointer hover:bg-[#2553c9] transition-colors disabled:opacity-50" style={{ fontFamily:'inherit' }}>
            {store.syncing ? 'Syncing…' : 'Sync now'}
          </button>
        </div>
      </Card>
    </div>
  )
}

function BillingSection({ onNavigate, billing }) {
  const aiUsed  = billing.usage.aiListings
  const aiLimit = billing.limits.aiListings
  const aiPct   = Math.min(100, aiLimit ? (aiUsed / aiLimit) * 100 : 0)
  const lstUsed  = billing.usage.listingsTracked
  const lstLimit = billing.limits.listingsTracked
  const lstPct   = Math.min(100, lstLimit ? (lstUsed / lstLimit) * 100 : 0)

  return (
    <div className="flex flex-col gap-4">
      {/* plan card */}
      <div className="rounded-[16px] p-[24px] text-white" style={{ background:'linear-gradient(120deg,#16181D,#23262F)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[12px] text-[#A6ADB8] font-semibold tracking-[.03em]">CURRENT PLAN</div>
            <div className="flex items-center gap-[9px] mt-2">
              <span className="text-[24px] font-bold">{billing.plan}</span>
              <span className="text-[11px] font-bold text-[#F5AF02] px-[9px] py-[3px] rounded-full" style={{ background:'rgba(245,175,2,.16)' }}>
                {billing.trialDaysLeft > 0 ? `TRIAL · ${billing.trialDaysLeft} day${billing.trialDaysLeft === 1 ? '' : 's'} left` : 'TRIAL ENDED'}
              </span>
            </div>
            <div className="text-[13px] text-[#A6ADB8] mt-2 max-w-[340px] leading-[1.5]">You're on the free plan. Upgrade to unlock profit analytics, fee tracking &amp; unlimited AI listings.</div>
          </div>
          <button onClick={() => onNavigate?.('pricing')}
            className="shrink-0 bg-white text-[#16181D] font-semibold text-[13px] px-[18px] py-[11px] rounded-[11px] cursor-pointer hover:bg-[#EAEBEF] transition-colors" style={{ border:'none', fontFamily:'inherit' }}>
            Upgrade plan
          </button>
        </div>
      </div>

      <Card>
        <div className="text-[16px] font-bold">This month's usage</div>
        <div className="flex flex-col gap-[18px] mt-[18px]">
          <div>
            <div className="flex justify-between text-[13px] mb-[7px]">
              <span className="text-[#5B6470] font-medium">AI listings generated</span>
              <span className="num font-semibold">{aiUsed} / {aiLimit}</span>
            </div>
            <div className="h-2 bg-[#F1F3F6] rounded-[5px]"><div className="h-full rounded-[5px] bg-[#E0A11B]" style={{ width:`${aiPct}%` }}/></div>
            {aiUsed >= aiLimit && <div className="text-[11.5px] text-[#C8553D] mt-[6px] font-semibold">You've hit your free limit — upgrade for unlimited.</div>}
          </div>
          <div>
            <div className="flex justify-between text-[13px] mb-[7px]">
              <span className="text-[#5B6470] font-medium">Listings tracked</span>
              <span className="num font-semibold">{lstUsed} / {lstLimit}</span>
            </div>
            <div className="h-2 bg-[#F1F3F6] rounded-[5px]"><div className="h-full rounded-[5px] bg-[#E0A11B]" style={{ width:`${lstPct}%` }}/></div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-bold">Payment method</div>
          <button className="bg-none border-none text-[#3665F3] font-semibold text-[12.5px] cursor-pointer" style={{ fontFamily:'inherit', background:'none' }}>Add card</button>
        </div>
        <div className="mt-[14px] p-4 border border-dashed border-[#DDE2E9] rounded-[12px] text-center text-[#8A93A1] text-[13px]">
          No payment method on file — added when you upgrade.
        </div>
      </Card>

      <Card>
        <div className="text-[16px] font-bold">Billing history</div>
        <div className="mt-3">
          <div className="p-4 text-center text-[#8A93A1] text-[13px]">No invoices yet.</div>
        </div>
      </Card>
    </div>
  )
}

const VOICES = [
  { key:'friendly',     label:'Friendly',     desc:'Warm, casual' },
  { key:'professional', label:'Professional',  desc:'Clean, factual' },
  { key:'punchy',       label:'Punchy',        desc:'Short, bold' },
]

const CONDITIONS = ['New', 'New other', 'Pre-owned — Excellent', 'Pre-owned — Good', 'Pre-owned — Fair']
const SHIPPING_OPTIONS = ['USPS Priority', 'USPS Ground Advantage', 'UPS Ground', 'FedEx Ground', 'Local pickup']

function PrefsSection({ prefs, updatePrefs }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="text-[16px] font-bold">AI writing style</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">The voice Perch uses for titles &amp; descriptions.</div>
        <div className="flex gap-[10px] mt-[18px]">
          {VOICES.map(v => {
            const active = prefs.ai_voice === v.key
            return (
              <button key={v.key} onClick={() => updatePrefs({ ai_voice: v.key })}
                className="flex-1 text-left px-[15px] py-[13px] rounded-[12px] cursor-pointer transition-all"
                style={{ fontFamily:'inherit', border: `1.5px solid ${active ? '#3665F3' : '#E7E9EE'}`, background: active ? '#EAF1FF' : '#fff', color: active ? '#16181D' : '#5B6470' }}>
                <div className="text-[13.5px] font-semibold">{v.label}</div>
                <div className="text-[11.5px] mt-[2px] opacity-70">{v.desc}</div>
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="text-[16px] font-bold">Listing defaults</div>
        <div className="grid grid-cols-2 gap-[14px] mt-[18px]">
          <div>
            <div className="text-[12px] font-semibold text-[#5B6470] mb-[6px]">Default condition</div>
            <select value={prefs.default_condition} onChange={e => updatePrefs({ default_condition: e.target.value })}
              className="w-full border border-[#E0E3E9] rounded-[10px] px-[13px] py-[11px] text-[13px] cursor-pointer outline-none"
              style={{ fontFamily:'inherit' }}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-[#5B6470] mb-[6px]">Default shipping</div>
            <select value={prefs.default_shipping} onChange={e => updatePrefs({ default_shipping: e.target.value })}
              className="w-full border border-[#E0E3E9] rounded-[10px] px-[13px] py-[11px] text-[13px] cursor-pointer outline-none"
              style={{ fontFamily:'inherit' }}>
              {SHIPPING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 pt-[18px] border-t border-[#F4F5F7]">
          <div>
            <div className="text-[13.5px] font-semibold">Auto-detect category</div>
            <div className="text-[12px] text-[#8A93A1] mt-[2px]">Let Perch pick the best eBay category from photos.</div>
          </div>
          <Toggle on={prefs.auto_categorize} onToggle={() => updatePrefs({ auto_categorize: !prefs.auto_categorize })}/>
        </div>
        <div className="flex items-center justify-between mt-[18px] pt-[18px] border-t border-[#F4F5F7]">
          <div>
            <div className="text-[13.5px] font-semibold">Suggest pricing from comps</div>
            <div className="text-[12px] text-[#8A93A1] mt-[2px]">Recommend a price from recent sold listings.</div>
          </div>
          <Toggle on={prefs.suggest_pricing} onToggle={() => updatePrefs({ suggest_pricing: !prefs.suggest_pricing })}/>
        </div>
      </Card>
    </div>
  )
}

const NOTIF_DEFS = [
  { key:'notif_sale',     label:'Item sold',         desc:'When one of your listings sells.' },
  { key:'notif_returns',  label:'Returns & refunds',  desc:'When a buyer opens a return.' },
  { key:'notif_weekly',   label:'Weekly summary',     desc:'A Monday recap of sales & profit.' },
  { key:'notif_insights', label:'Perch insights',     desc:'Tips on what to list and when.' },
  { key:'notif_price',    label:'Price drop alerts',  desc:'When comps for your items move.' },
]

function NotifSection({ prefs, updatePrefs }) {
  return (
    <Card>
      <div className="text-[16px] font-bold">Notifications</div>
      <div className="text-[12.5px] text-[#8A93A1] mt-[3px]">Choose what Perch emails you about.</div>
      <div className="mt-[14px] flex flex-col">
        {NOTIF_DEFS.map(n => (
          <div key={n.key} className="flex items-center justify-between py-[14px] border-t border-[#F4F5F7]">
            <div className="pr-5">
              <div className="text-[13.5px] font-semibold">{n.label}</div>
              <div className="text-[12px] text-[#8A93A1] mt-[2px]">{n.desc}</div>
            </div>
            <Toggle on={prefs[n.key]} onToggle={() => updatePrefs({ [n.key]: !prefs[n.key] })}/>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── section nav ───────────────────────────────────────────────────────────────

const SECTIONS = [
  ['account', 'Account'],
  ['store',   'Store & eBay'],
  ['billing', 'Subscription'],
  ['prefs',   'Listing preferences'],
  ['notif',   'Notifications'],
]

// ── main ──────────────────────────────────────────────────────────────────────

const PREF_DEFAULTS = {
  ai_voice: 'friendly',
  default_condition: 'Pre-owned — Good',
  default_shipping: 'USPS Priority',
  auto_categorize: true,
  suggest_pricing: true,
  notif_sale: true,
  notif_returns: true,
  notif_weekly: true,
  notif_insights: true,
  notif_price: false,
}

const BILLING_DEFAULTS = {
  plan: 'Free',
  trialDaysLeft: 0,
  limits: { aiListings: 3, listingsTracked: 25 },
  usage: { aiListings: 0, listingsTracked: 0 },
}

const STORE_DEFAULTS = { connected: false, storeName: null, listingCount: 0, orderCount: 0, lastSyncedAt: null, syncing: false, progress: 0 }

export default function PerchSettings({ onNavigate }) {
  const [section, setSection] = useState('account')

  const [account, setAccount]                 = useState({ name: '', email: '' })
  const [accountOriginal, setAccountOriginal]  = useState({ name: '', email: '' })
  const [currentPassword, setCurrentPassword]  = useState('')
  const [newPassword, setNewPassword]          = useState('')

  const [store, setStore]     = useState(STORE_DEFAULTS)
  const [billing, setBilling] = useState(BILLING_DEFAULTS)

  const [prefs, setPrefs]                 = useState(PREF_DEFAULTS)
  const [prefsOriginal, setPrefsOriginal] = useState(PREF_DEFAULTS)

  const [saveStatus, setSaveStatus] = useState(null) // null | 'saving' | 'saved' | 'error'
  const syncIntervalRef = useRef(null)

  const fetchAccount = useCallback(() => {
    apiFetch('/api/user/me').then(r => r.json()).then(d => {
      const a = { name: d.name ?? '', email: d.email ?? '' }
      setAccount(a)
      setAccountOriginal(a)
    }).catch(() => {})
  }, [])

  const fetchStore = useCallback(() => {
    apiFetch('/api/ebay/sync-status').then(r => r.json()).then(setStore).catch(() => {})
  }, [])

  const fetchBilling = useCallback(() => {
    apiFetch('/api/user/billing').then(r => r.json()).then(setBilling).catch(() => {})
  }, [])

  const fetchPrefs = useCallback(() => {
    apiFetch('/api/user/preferences').then(r => r.json()).then(d => {
      setPrefs(d)
      setPrefsOriginal(d)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetchAccount(); fetchStore(); fetchBilling(); fetchPrefs()
    return () => clearInterval(syncIntervalRef.current)
  }, [fetchAccount, fetchStore, fetchBilling, fetchPrefs])

  const updatePrefs = useCallback(patch => setPrefs(p => ({ ...p, ...patch })), [])

  const startSync = useCallback(() => {
    apiFetch('/api/ebay/sync', { method: 'POST' })
    setStore(s => ({ ...s, syncing: true, progress: 0 }))
    clearInterval(syncIntervalRef.current)
    syncIntervalRef.current = setInterval(async () => {
      const res = await apiFetch('/api/ebay/sync-status')
      if (!res.ok) return
      const data = await res.json()
      setStore(data)
      if (!data.syncing) clearInterval(syncIntervalRef.current)
    }, 2000)
  }, [])

  const disconnectStore = useCallback(() => {
    if (!window.confirm("Disconnect your eBay store? This removes synced listings and orders.")) return
    apiFetch('/api/ebay/disconnect', { method: 'DELETE' }).then(fetchStore)
  }, [fetchStore])

  const deleteAccount = useCallback(async () => {
    if (!window.confirm('Permanently delete your account and all data? This cannot be undone.')) return
    const res = await apiFetch('/api/user/me', { method: 'DELETE' })
    if (res.ok) {
      await supabase.auth.signOut()
      onNavigate?.('landing')
    }
  }, [onNavigate])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      if (section === 'account') {
        const updates = {}
        if (account.email !== accountOriginal.email) updates.email = account.email
        if (account.name !== accountOriginal.name) updates.data = { full_name: account.name }
        if (Object.keys(updates).length) {
          const { error } = await supabase.auth.updateUser(updates)
          if (error) throw error
        }
        if (newPassword) {
          const { error } = await supabase.auth.updateUser({ password: newPassword })
          if (error) throw error
          setCurrentPassword('')
          setNewPassword('')
        }
        fetchAccount()
      } else if (section === 'prefs' || section === 'notif') {
        const res = await apiFetch('/api/user/preferences', { method: 'PUT', body: JSON.stringify(prefs) })
        if (!res.ok) throw new Error('Save failed')
        setPrefsOriginal(prefs)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch {
      setSaveStatus('error')
    }
  }, [section, account, accountOriginal, newPassword, prefs, fetchAccount])

  const handleCancel = useCallback(() => {
    if (section === 'account') {
      setAccount(accountOriginal)
      setCurrentPassword('')
      setNewPassword('')
    } else if (section === 'prefs' || section === 'notif') {
      setPrefs(prefsOriginal)
    }
    setSaveStatus(null)
  }, [section, accountOriginal, prefsOriginal])

  const showSaveBar = section === 'account' || section === 'prefs' || section === 'notif'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily:"'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} name={account.name} storeName={store.storeName}/>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 px-[30px] py-4 border-b border-[#EAEBEF]"
          style={{ background:'rgba(246,247,249,.85)', backdropFilter:'blur(8px)' }}>
          <div className="text-[21px] font-bold tracking-[-0.02em]">Settings</div>
          <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">Manage your account, store connection &amp; subscription.</div>
        </header>

        <div className="px-[30px] pt-6 pb-12 max-w-[1080px] grid gap-[26px] items-start"
          style={{ gridTemplateColumns:'208px 1fr' }}>

          {/* section nav */}
          <nav className="flex flex-col gap-[3px] sticky top-[96px]">
            {SECTIONS.map(([key, label]) => {
              const active = section === key
              return (
                <button key={key} onClick={() => setSection(key)}
                  className="text-left px-[13px] py-[10px] rounded-[10px] text-[13.5px] font-semibold cursor-pointer transition-all"
                  style={{ border:'none', fontFamily:'inherit', background: active ? '#EAF1FF' : 'transparent', color: active ? '#3665F3' : '#5B6470' }}>
                  {label}
                </button>
              )
            })}
          </nav>

          {/* panel */}
          <div>
            {section === 'account' && (
              <AccountSection account={account} setAccount={setAccount}
                currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                newPassword={newPassword} setNewPassword={setNewPassword}
                onDeleteAccount={deleteAccount}/>
            )}
            {section === 'store'   && <StoreSection store={store} onSync={startSync} onDisconnect={disconnectStore}/>}
            {section === 'billing' && <BillingSection onNavigate={onNavigate} billing={billing}/>}
            {section === 'prefs'   && <PrefsSection prefs={prefs} updatePrefs={updatePrefs}/>}
            {section === 'notif'   && <NotifSection prefs={prefs} updatePrefs={updatePrefs}/>}

            {/* save bar */}
            {showSaveBar && (
              <div className="flex items-center justify-end gap-[10px] mt-[18px]">
                {saveStatus === 'saved' && <span className="text-[12.5px] font-semibold text-[#5C8A00] mr-auto">Saved</span>}
                {saveStatus === 'error' && <span className="text-[12.5px] font-semibold text-[#C8553D] mr-auto">Couldn't save — try again</span>}
                <button onClick={handleCancel} className="bg-white border border-[#E0E3E9] text-[#5B6470] font-semibold text-[13px] px-[18px] py-[11px] rounded-[11px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors" style={{ fontFamily:'inherit' }}>Cancel</button>
                <button onClick={handleSave} disabled={saveStatus === 'saving'} className="bg-[#3665F3] text-white border-none font-semibold text-[13px] px-[20px] py-[11px] rounded-[11px] cursor-pointer hover:bg-[#2553c9] transition-colors disabled:opacity-60" style={{ fontFamily:'inherit', boxShadow:'0 2px 6px rgba(54,101,243,.3)' }}>
                  {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
