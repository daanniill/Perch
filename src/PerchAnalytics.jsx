import { useState, useEffect } from 'react'
import { apiFetch } from './lib/supabase'

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt$ = (n) => n == null ? '—' : '$' + Math.round(n).toLocaleString()
const fmtNum = (n) => n == null ? '—' : Math.round(n).toLocaleString()

function buildPath(orders, w, h) {
  if (!orders || orders.length < 2) return { line: '', area: '' }
  const max = Math.max(...orders) * 1.15 || 1
  const n   = orders.length
  const pts = orders.map((v, i) => {
    const x = (i / (n - 1)) * w
    const y = h - (v / max) * (h - 12) - 6
    return [x, y]
  })
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z'
  return { line, area }
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

function Sidebar({ onNavigate }) {
  const item = (icon, label, active, onClick) => (
    <div key={label} onClick={onClick}
      className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] text-[13.5px] cursor-pointer transition-colors"
      style={active ? { background: '#EAF1FF', color: '#3665F3', fontWeight: 600 } : { color: '#5B6470', fontWeight: 500 }}>
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
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', true)}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', false, () => onNavigate?.('finances'))}
      </nav>
      <div className="flex-1" style={{ minHeight: 18 }}/>
      <div onClick={() => onNavigate?.('pricing')}
        className="bg-[#16181D] rounded-[13px] p-[14px] mb-[10px] cursor-pointer hover:bg-[#22252D] transition-colors">
        <div className="flex items-center gap-[7px]">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          <span className="text-[12.5px] font-bold text-white">Upgrade to Pro</span>
        </div>
        <div className="text-[11px] text-[#A6ADB8] leading-[1.4] mt-[6px]">Unlock profit analytics &amp; unlimited AI listings.</div>
      </div>
      <div onClick={() => onNavigate?.('settings')} className="flex items-center gap-[11px] px-2 py-[9px] rounded-[10px] text-[13.5px] font-medium text-[#5B6470] cursor-pointer hover:bg-[#ECEEF1] transition-colors mb-[6px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6"><circle cx="9" cy="9" r="2.6"/><circle cx="9" cy="9" r="7"/></svg>Settings
      </div>
      <div className="border-t border-[#E7E9EE] pt-3 flex items-center gap-[10px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#16181D] text-white flex items-center justify-center font-semibold text-[13px] shrink-0">JF</div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate">Jordan Fields</div>
          <div className="text-[11.5px] text-[#8A93A1] truncate">Jordan's Finds</div>
        </div>
      </div>
    </aside>
  )
}

// ── main ──────────────────────────────────────────────────────────────────────

const PERIOD_LABELS = {
  '7d':  'the last 7 days',
  '30d': 'the last 30 days',
  '90d': 'the last 90 days',
  '12mo':'the last 12 months',
}

export default function PerchAnalytics({ onNavigate }) {
  const [period,  setPeriod]  = useState('30d')
  const [summary, setSummary] = useState(null)
  const [chart,   setChart]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiFetch(`/api/analytics/summary?period=${period}`).then(r => r.json()),
      apiFetch(`/api/analytics/chart?period=${period}`).then(r => r.json()),
    ])
      .then(([s, c]) => { setSummary(s); setChart(c); setLoading(false) })
      .catch(() => setLoading(false))
  }, [period])

  const s = summary ?? {}
  const orders    = s.orders ?? null
  const aov       = s.aov    ?? null
  const categories = s.categories ?? []
  const topListings = s.top_listings ?? []
  const catMax    = Math.max(...categories.map(c => c.listing_count ?? 0), 1)

  const chartOrders = chart?.orders ?? []
  const chartLabels = chart?.labels  ?? []
  const maxOrders   = Math.max(...chartOrders, 1)
  const path        = buildPath(chartOrders, 720, 200)

  const col = g => g ? '#5C8A00' : '#C8553D'
  const bg  = g => g ? '#EEF5DC' : '#FCEBEC'

  const kpis = [
    { label: 'Orders',           v: loading ? '—' : fmtNum(orders),  avail: true  },
    { label: 'Avg. order value', v: loading ? '—' : fmt$(aov),       avail: true  },
    { label: 'Listing views',    v: '—',                              avail: false },
    { label: 'Watchers',         v: '—',                              avail: false },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">

        {/* ── header ── */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-4 border-b border-[#EAEBEF]"
          style={{ background: 'rgba(246,247,249,.85)', backdropFilter: 'blur(8px)' }}>
          <div>
            <div className="text-[21px] font-bold tracking-[-0.02em]">Analytics</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">Performance · {PERIOD_LABELS[period]}</div>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[10px]">
              {[['7d','7D'],['30d','30D'],['90d','90D'],['12mo','12M']].map(([key, label]) => {
                const active = key === period
                return (
                  <button key={key} onClick={() => setPeriod(key)}
                    className="px-[13px] py-[7px] rounded-[7px] text-[12px] font-semibold cursor-pointer transition-all"
                    style={{ border: 'none', fontFamily: 'inherit', background: active ? '#fff' : 'transparent', color: active ? '#16181D' : '#8A93A1', boxShadow: active ? '0 1px 2px rgba(16,24,40,.14)' : 'none' }}>
                    {label}
                  </button>
                )
              })}
            </div>
            <button className="flex items-center gap-[7px] bg-white border border-[#E7E9EE] text-[#5B6470] font-semibold text-[12.5px] px-[13px] py-[9px] rounded-[10px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors"
              style={{ fontFamily: 'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 1.5v10M5 7.5L9 11.5l4-4M3 14.5h12"/>
              </svg>
              Export
            </button>
          </div>
        </header>

        <div className="px-[30px] pt-6 pb-12 max-w-[1320px]">

          {/* ── KPI row ── */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map(({ label, v, avail }) => (
              <div key={label} className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-[#8A93A1] font-medium">{label}</span>
                  {!avail && (
                    <span className="text-[10px] text-[#A6ADB8] font-medium bg-[#F1F3F6] px-[7px] py-[2px] rounded-[5px]">eBay Analytics</span>
                  )}
                </div>
                <div className="num text-[27px] font-bold mt-2">{v}</div>
              </div>
            ))}
          </div>

          {/* ── orders chart ── */}
          <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] mt-4" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold">Orders over time</div>
                <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Completed orders per {period === '7d' ? 'day' : period === '12mo' ? 'month' : 'week'}</div>
              </div>
              <div className="flex gap-[18px] text-[11.5px] text-[#8A93A1]">
                <span className="flex items-center gap-[6px]">
                  <span className="w-[10px] h-[10px] rounded-[3px]" style={{ background: '#3665F3' }}/>Orders
                </span>
              </div>
            </div>

            <div className="relative mt-5" style={{ height: 200 }}>
              {loading || chartOrders.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-[13px] text-[#A6ADB8]">
                  {loading ? 'Loading…' : 'No order data for this period'}
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 720 200" preserveAspectRatio="none"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {[40,90,140,190].map(y => (
                      <line key={y} x1="0" y1={y} x2="720" y2={y} stroke={y === 190 ? '#E7E9EE' : '#F1F3F6'} strokeWidth="1"/>
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-end" style={{ padding: '0 2px' }}>
                    {chartOrders.map((o, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                        <div style={{ width: '54%', background: '#3665F3', borderRadius: '4px 4px 0 0', height: (o / maxOrders * 88).toFixed(1) + '%', opacity: .88 }}/>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {!loading && chartLabels.length > 0 && (
              <div className="flex mt-2">
                {chartLabels.map((l, i) => (
                  <div key={i} className="flex-1 text-center text-[10px] text-[#9aa3b0] font-medium">{l}</div>
                ))}
              </div>
            )}
          </div>

          {/* ── traffic / eBay Analytics placeholder ── */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

            {/* placeholder for funnel */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] flex flex-col items-center justify-center text-center" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)', minHeight: 220 }}>
              <div className="w-[42px] h-[42px] rounded-[13px] bg-[#F1F3F6] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3h12l-4 6v4l-4-2V9L3 3Z"/></svg>
              </div>
              <div className="text-[14px] font-semibold text-[#16181D]">Conversion funnel</div>
              <div className="text-[12px] text-[#8A93A1] mt-1 max-w-[260px] leading-[1.5]">
                Impressions, views, and watchlist data require the eBay Analytics API — coming in a future update.
              </div>
            </div>

            {/* placeholder for traffic sources */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] flex flex-col items-center justify-center text-center" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)', minHeight: 220 }}>
              <div className="w-[42px] h-[42px] rounded-[13px] bg-[#F1F3F6] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="7"/><path d="M9 2a7 7 0 0 1 0 14M2 9h14"/><path d="M9 2c-2 2-3 4.5-3 7s1 5 3 7"/></svg>
              </div>
              <div className="text-[14px] font-semibold text-[#16181D]">Traffic sources</div>
              <div className="text-[12px] text-[#8A93A1] mt-1 max-w-[220px] leading-[1.5]">
                Traffic source data requires the eBay Analytics API — coming soon.
              </div>
            </div>
          </div>

          {/* ── category performance + top listings ── */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr 1.4fr' }}>

            {/* category performance */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Category performance</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Inventory by category</div>
              {loading ? (
                <div className="mt-5 text-[13px] text-[#A6ADB8]">Loading…</div>
              ) : categories.length === 0 ? (
                <div className="mt-5 text-[12.5px] text-[#A6ADB8]">No category data — sync your eBay store first.</div>
              ) : (
                <div className="flex flex-col gap-4 mt-5">
                  {categories.map(c => (
                    <div key={c.name}>
                      <div className="flex justify-between items-center mb-[7px]">
                        <span className="text-[13px] font-semibold">{c.name}</span>
                        <span className="num text-[12.5px] text-[#5B6470]">{c.listing_count} listings</span>
                      </div>
                      <div className="h-[7px] bg-[#F1F3F6] rounded-[5px]">
                        <div className="h-full rounded-[5px] bg-[#3665F3]" style={{ width: (c.listing_count / catMax * 100) + '%' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* top listings */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="px-[22px] pt-5 pb-3 flex items-center justify-between">
                <div className="text-[15px] font-semibold">Top listings</div>
                <span className="text-[12px] text-[#8A93A1]">by price</span>
              </div>
              <div className="grid px-[22px] pb-2 text-[10.5px] text-[#A6ADB8] font-semibold tracking-[.03em] uppercase"
                style={{ gridTemplateColumns: '18px 1fr 80px' }}>
                <span>#</span><span>Item</span>
                <span className="text-right">Price</span>
              </div>
              {loading ? (
                <div className="px-[22px] py-[22px] text-[13px] text-[#A6ADB8]">Loading…</div>
              ) : topListings.length === 0 ? (
                <div className="px-[22px] py-[22px] text-[12.5px] text-[#A6ADB8]">No listings yet.</div>
              ) : topListings.map((t, i) => (
                <div key={t.title} className="grid items-center px-[22px] py-[11px] border-t border-[#F4F5F7] hover:bg-[#FAFBFC] transition-colors"
                  style={{ gridTemplateColumns: '18px 1fr 80px' }}>
                  <span className="num text-[12px] font-bold text-[#C4CBD4]">{i + 1}</span>
                  <div className="min-w-0 pr-[10px]">
                    <div className="text-[12.5px] font-semibold truncate">{t.title}</div>
                    <div className="text-[11px] text-[#9aa3b0]">{t.category ?? '—'}</div>
                  </div>
                  <span className="num text-right text-[12.5px] font-semibold">{fmt$(t.price)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
