import { useState, useEffect } from 'react'
import { supabase, apiFetch } from './lib/supabase'

// ── formatters ────────────────────────────────────────────────────────────────

const fmt$ = (n) => n == null ? '—' : '$' + Math.round(n).toLocaleString()
const fmtPct = (n) => n == null ? '—' : n.toFixed(1) + '%'

function fmtDelta(val, type = 'pct') {
  if (val == null) return { text: '—', up: true }
  if (type === 'count') {
    const up = val >= 0
    return { text: (up ? '▲ ' : '▼ ') + Math.abs(val), up }
  }
  const up = val >= 0
  return { text: (up ? '▲ ' : '▼ ') + Math.abs(val).toFixed(1) + '%', up }
}

function ageDays(iso) {
  if (!iso) return null
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  return d === 0 ? 'Today' : `${d}d ago`
}

function statusStyle(st) {
  const s = (st || '').toLowerCase()
  if (s === 'fulfilled')   return { color: '#3665F3', background: '#EAF1FF' }
  if (s === 'in_progress') return { color: '#5C8A00', background: '#EEF5DC' }
  return                          { color: '#5C8A00', background: '#EEF5DC' }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function deltaStyle(up) {
  return up
    ? { color: '#5C8A00', background: '#EEF5DC' }
    : { color: '#E53238', background: '#FCEBEC' }
}

function segBtn(active, onClick, label) {
  return (
    <button
      key={label}
      onClick={onClick}
      className="px-[14px] py-[7px] rounded-[7px] text-[12px] font-semibold transition-all"
      style={active
        ? { background: '#fff', color: '#16181D', boxShadow: '0 1px 2px rgba(16,24,40,.14)' }
        : { background: 'transparent', color: '#8A93A1' }}
    >
      {label}
    </button>
  )
}

// ── sub-components ────────────────────────────────────────────────────────────

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

function Sparkline({ bars }) {
  return (
    <div className="flex items-end gap-[2px] h-[18px]">
      {bars.map((h, i) => (
        <span key={i} className="w-[3px] rounded-[1px]" style={{ height: h, background: i < bars.length - 1 ? (i < bars.length - 2 ? '#C9DBF8' : '#9CC0F5') : '#3665F3' }} />
      ))}
    </div>
  )
}

function KpiCard({ label, value, delta, up, sparkBars }) {
  const ds = deltaStyle(up)
  return (
    <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-[#8A93A1] font-medium">{label}</span>
        <Sparkline bars={sparkBars} />
      </div>
      <div className="num text-[30px] font-bold mt-[10px]">{value}</div>
      <div className="mt-[10px]">
        <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-[7px] py-[3px] rounded-[6px]" style={ds}>{delta}</span>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }) {
  async function handleLogout() {
    window.location.hash = ''
    await supabase.auth.signOut()
  }

  const navItem = (icon, label, active, onClick) => (
    <div
      onClick={onClick}
      className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] text-[13.5px] cursor-pointer transition-colors"
      style={active ? { background: '#EAF1FF', color: '#3665F3', fontWeight: 600 } : { color: '#5B6470', fontWeight: 500 }}
    >
      {icon}
      {label}
    </div>
  )

  return (
    <aside className="w-[244px] shrink-0 flex flex-col border-r border-[#EAEBEF] bg-[#F4F5F7] p-[18px_14px]">
      <div className="flex items-center gap-[11px] px-[8px] pb-[18px] pt-[6px]">
        <PerchLogo />
        <span className="font-bold text-[21px] tracking-[-0.02em]">Perch</span>
      </div>

      <div className="text-[10.5px] font-semibold tracking-[.09em] text-[#A6ADB8] px-[10px] py-[6px]">MENU</div>
      <nav className="flex flex-col gap-[2px]">
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#3665F3"/><rect x="10.1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#3665F3" opacity=".45"/><rect x="1.5" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#3665F3" opacity=".45"/><rect x="10.1" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#3665F3"/></svg>,
          'Dashboard', true
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>,
          'Listings', false, () => onNavigate?.('listings')
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>,
          'Create listing', false, () => onNavigate?.('listing-generator')
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>,
          'Analytics', false, () => onNavigate?.('analytics')
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>,
          'Finances', false, () => onNavigate?.('finances')
        )}
      </nav>

      <div className="flex-1" />

      <div className="bg-[#16181D] rounded-[13px] p-[14px] mb-[10px] cursor-pointer hover:bg-[#22252D] transition-colors" onClick={() => onNavigate?.('pricing')}>
        <div className="flex items-center gap-[7px]">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          <span className="text-[12.5px] font-bold text-white">Upgrade to Pro</span>
        </div>
        <div className="text-[11px] text-[#A6ADB8] leading-[1.4] mt-[6px]">Unlock profit analytics &amp; unlimited AI listings.</div>
      </div>

      <div onClick={() => onNavigate?.('settings')} className="flex items-center gap-[11px] px-[8px] py-[9px] rounded-[10px] text-[13.5px] font-medium text-[#5B6470] cursor-pointer hover:bg-[#ECEEF1] transition-colors mb-[6px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6"><circle cx="9" cy="9" r="2.6"/><circle cx="9" cy="9" r="7"/></svg>
        Settings
      </div>

      <div className="border-t border-[#E7E9EE] pt-[12px] flex items-center gap-[10px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#16181D] text-white flex items-center justify-center font-semibold text-[13px] shrink-0">JF</div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold truncate">Jordan Fields</div>
          <div className="text-[11.5px] text-[#8A93A1] truncate">Jordan's Finds</div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="shrink-0 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#A6ADB8] hover:text-[#E53238] hover:bg-[#FCEBEC] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3H3.5A1.5 1.5 0 0 0 2 4.5v9A1.5 1.5 0 0 0 3.5 15H7" />
            <path d="M12 13l4-4-4-4" />
            <line x1="16" y1="9" x2="7" y2="9" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-[16px] border-b border-[#EAEBEF]" style={{ background: 'rgba(246,247,249,.85)', backdropFilter: 'blur(8px)' }}>
      <div>
        <div className="text-[21px] font-bold tracking-[-0.02em]">Overview</div>
        <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">
          Your eBay store · <span className="text-[#5C8A00] font-semibold">● Connected</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E7E9EE] rounded-[9px] px-[11px] py-[8px] w-[210px]">
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.7" strokeLinecap="round"><circle cx="8" cy="8" r="5.4"/><line x1="12.2" y1="12.2" x2="15.5" y2="15.5"/></svg>
          <span className="text-[12.5px] text-[#A6ADB8]">Search listings…</span>
        </div>
        <button className="flex items-center gap-[7px] bg-[#3665F3] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ boxShadow: '0 1px 2px rgba(54,101,243,.4)' }}>
          <span className="text-[16px] leading-none -mt-[1px]">+</span> New listing
        </button>
      </div>
    </header>
  )
}

function ProfitChart({ gran, setGran, chartData, loading }) {
  const labels      = chartData?.labels ?? []
  const revenue     = chartData?.revenue ?? []
  const grossProfit = chartData?.gross_profit ?? []
  const costs       = revenue.map((r, i) => Math.max(0, r - (grossProfit[i] ?? 0)))

  const max     = Math.max(...grossProfit.map((v, i) => v + costs[i]), 1)
  const sum     = a => a.reduce((x, y) => x + y, 0)
  const fmtK    = n => '$' + (n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n))
  const bestIdx = grossProfit.indexOf(Math.max(...grossProfit))

  const placeholder = Array(6).fill(0)

  return (
    <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold">Profit &amp; costs</div>
          <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Gross profit after eBay fees &amp; shipping</div>
        </div>
        <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[9px]">
          {segBtn(gran === 'monthly', () => setGran('monthly'), 'Monthly')}
          {segBtn(gran === 'yearly',  () => setGran('yearly'),  'Yearly')}
        </div>
      </div>

      <div className="flex gap-[18px] mt-[14px] text-[11.5px] text-[#8A93A1]">
        <span className="flex items-center gap-[6px]"><span className="w-[10px] h-[10px] rounded-[3px] bg-[#3665F3]" />Gross profit</span>
        <span className="flex items-center gap-[6px]"><span className="w-[10px] h-[10px] rounded-[3px] bg-[#DCE1E8]" />Fees &amp; shipping</span>
      </div>

      <div className="flex items-end gap-4 h-[208px] mt-[18px]">
        {(loading || labels.length === 0 ? placeholder : labels).map((_, i) => {
          const gp   = grossProfit[i] ?? 0
          const cost = costs[i] ?? 0
          return (
            <div key={i} className="flex-1 flex flex-col justify-end h-full gap-[3px]">
              <div className="bg-[#3665F3] rounded-t-[5px]" style={{ height: loading ? '20%' : `${(gp / max * 100).toFixed(1)}%`, opacity: loading ? 0.2 : 1, transition: 'height .3s' }} />
              <div className="bg-[#DCE1E8] rounded-b-[5px]" style={{ height: loading ? '10%' : `${(cost / max * 100).toFixed(1)}%`, opacity: loading ? 0.2 : 1, transition: 'height .3s' }} />
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 mt-[10px]">
        {(loading || labels.length === 0 ? placeholder : labels).map((l, i) => (
          <div key={i} className="flex-1 text-center text-[10.5px] text-[#9aa3b0] font-medium">{l ?? ''}</div>
        ))}
      </div>

      <div className="flex gap-[14px] mt-[18px] pt-[18px] border-t border-[#EEF0F4]">
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Gross profit · this range</div>
          <div className="num text-[18px] font-bold mt-[3px]">{loading ? '—' : fmtK(sum(grossProfit))}</div>
        </div>
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Fees &amp; shipping · this range</div>
          <div className="num text-[18px] font-bold mt-[3px] text-[#5B6470]">{loading ? '—' : fmtK(sum(costs))}</div>
        </div>
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Best period</div>
          <div className="num text-[18px] font-bold mt-[3px]">{loading || labels.length === 0 ? '—' : labels[bestIdx] ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}

function BestTimeHeatmap() {
  return (
    <div className="relative bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-[22px]" style={{ background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(4px)' }}>
        <div className="w-[38px] h-[38px] rounded-[11px] bg-[#16181D] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.6"><rect x="3.5" y="8" width="11" height="7" rx="1.5"/><path d="M5.5 8V6a3.5 3.5 0 0 1 7 0v2"/></svg>
        </div>
        <div className="text-[14px] font-bold mt-3">Best time to list</div>
        <div className="text-[12px] text-[#5B6470] leading-[1.45] mt-1 max-w-[240px]">See exactly when your buyers are most active. Available on Perch Pro.</div>
        <button className="inline-flex items-center gap-[6px] mt-[14px] bg-[#3665F3] text-white font-semibold text-[12.5px] px-[15px] py-[9px] rounded-[10px] hover:bg-[#2553c9] transition-colors" style={{ boxShadow: '0 2px 6px rgba(54,101,243,.3)' }}>
          <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          Unlock with Pro
        </button>
      </div>
      {/* Decorative blurred grid beneath overlay */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold">Best time to list</div>
          <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">When your buyers are most active</div>
        </div>
      </div>
      <div className="mt-[18px] grid gap-[6px] items-center" style={{ gridTemplateColumns: 'auto repeat(7,1fr)' }}>
        <div />
        {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-center text-[10px] text-[#9aa3b0] font-semibold">{d}</div>)}
        {[['AM',[.12,.20,.15,.28,.22,.40,.50]],['MID',[.18,.30,.25,.42,.38,.58,.68]],['PM',[.30,.45,.38,.55,.66,.82,1.0]]].map(([label, opacities]) => (
          <>
            <div key={label} className="text-[10px] text-[#9aa3b0] font-semibold">{label}</div>
            {opacities.map((o, i) => (
              <div key={i} className="h-[26px] rounded-[6px]" style={{ background: o === 1 ? '#3665F3' : `rgba(54,101,243,${o})` }} />
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

function RecentSales({ sales, loading }) {
  const statusLabel = (st) => {
    const s = (st || '').toLowerCase()
    if (s === 'fulfilled') return { label: 'Shipped', kind: 'shipped' }
    return { label: 'Sold', kind: 'sold' }
  }

  const ssKind = (kind) => {
    if (kind === 'sold')    return { color: '#5C8A00', background: '#EEF5DC' }
    if (kind === 'shipped') return { color: '#3665F3', background: '#EAF1FF' }
    return                         { color: '#E53238', background: '#FCEBEC' }
  }

  return (
    <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="px-[22px] py-[20px] pb-[14px] flex items-center justify-between">
        <div className="text-[15px] font-semibold">Recent sales</div>
        <span className="text-[12.5px] text-[#3665F3] font-semibold cursor-pointer">View all →</span>
      </div>
      <div className="grid px-[22px] pb-[6px] text-[11px] text-[#A6ADB8] font-semibold tracking-[.03em] uppercase" style={{ gridTemplateColumns: '1fr 92px 92px 80px 96px' }}>
        <span>Item</span><span className="text-right">Sold for</span><span className="text-right">Gross profit</span><span className="text-right">Margin</span><span className="text-right">Status</span>
      </div>

      {loading && (
        <div className="px-[22px] py-[32px] text-center text-[13px] text-[#A6ADB8]">Loading…</div>
      )}

      {!loading && sales.length === 0 && (
        <div className="px-[22px] py-[32px] text-center text-[13px] text-[#A6ADB8]">No sales yet — trigger a sync to load your orders.</div>
      )}

      {!loading && sales.map((row, i) => {
        const { label, kind } = statusLabel(row.status)
        const ss = ssKind(kind)
        const gpColor = row.gross_profit >= 0 ? '#5C8A00' : '#E53238'
        return (
          <div key={i} className="grid items-center px-[22px] py-[10px] border-t border-[#F1F3F6] hover:bg-[#FAFBFC] transition-colors" style={{ gridTemplateColumns: '1fr 92px 92px 80px 96px' }}>
            <div className="flex items-center gap-[11px] min-w-0">
              <div className="w-[38px] h-[38px] rounded-[9px] bg-[#F1F3F6] shrink-0 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C4CBD4" strokeWidth="1.4"><rect x="2" y="3" width="14" height="12" rx="2"/><circle cx="6.4" cy="7" r="1.4"/><path d="M3 13l3.5-3.4 2.3 2.1 3-2.8 3.2 3"/></svg>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{row.title}</div>
                <div className="text-[11.5px] text-[#9aa3b0]">
                  {[row.category, row.ordered_at ? ageDays(row.ordered_at) : null].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
            <div className="num text-right text-[13px] font-semibold">{fmt$(row.total)}</div>
            <div className="num text-right text-[13px] font-semibold" style={{ color: gpColor }}>
              {row.gross_profit >= 0 ? '+' : ''}{fmt$(row.gross_profit)}
            </div>
            <div className="num text-right text-[13px] text-[#5B6470]">{row.margin != null ? row.margin + '%' : '—'}</div>
            <div className="text-right">
              <span className="text-[11px] font-semibold px-[9px] py-[3px] rounded-[6px]" style={ss}>{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

const PERIOD_LABELS = { today: 'today', '7d': 'the last 7 days', '30d': 'the last 30 days', '12mo': 'the last 12 months' }

export default function PerchDashboard({ onNavigate }) {
  const [period, setPeriod] = useState('30d')
  const [gran,   setGran]   = useState('monthly')

  const [summary,    setSummary]    = useState(null)
  const [chartData,  setChartData]  = useState(null)
  const [sales,      setSales]      = useState([])
  const [categories, setCategories] = useState([])
  const [loadingSum, setLoadingSum] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)

  // Fetch summary + chart when period/gran changes
  useEffect(() => {
    setLoadingSum(true)
    apiFetch(`/api/dashboard/summary?period=${period}`)
      .then(r => r.json())
      .then(d => { setSummary(d); setLoadingSum(false) })
      .catch(() => setLoadingSum(false))
  }, [period])

  useEffect(() => {
    setLoadingChart(true)
    apiFetch(`/api/dashboard/chart?gran=${gran}`)
      .then(r => r.json())
      .then(d => { setChartData(d); setLoadingChart(false) })
      .catch(() => setLoadingChart(false))
  }, [gran])

  // Fetch recent sales + categories once on mount
  useEffect(() => {
    apiFetch('/api/dashboard/recent-sales')
      .then(r => r.json())
      .then(d => setSales(Array.isArray(d) ? d : []))
      .catch(() => {})

    apiFetch('/api/dashboard/categories')
      .then(r => r.json())
      .then(d => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const s = summary ?? {}
  const gpDelta  = fmtDelta(s.deltas?.gross_profit)
  const revDelta = fmtDelta(s.deltas?.revenue)
  const ordDelta = fmtDelta(s.deltas?.orders, 'count')

  const catMax = Math.max(...categories.map(c => c.max ?? c.value ?? 0), 1)

  const periodTabs = [['today','Today'],['7d','7D'],['30d','30D'],['12mo','12M']]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        <TopBar />

        <div className="px-[30px] pb-12 pt-6 max-w-[1320px]">

          {/* period selector */}
          <div className="flex items-center justify-between mb-[18px]">
            <div className="text-[14px] text-[#5B6470]">
              Showing <span className="text-[#16181D] font-semibold">{PERIOD_LABELS[period]}</span>
            </div>
            <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[10px]">
              {periodTabs.map(([key, label]) => segBtn(period === key, () => setPeriod(key), label))}
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            <KpiCard
              label="Gross profit"
              value={loadingSum ? '—' : fmt$(s.gross_profit)}
              delta={loadingSum ? '—' : gpDelta.text}
              up={gpDelta.up}
              sparkBars={['30%','55%','42%','70%','85%']}
            />
            <KpiCard
              label="Gross margin"
              value={loadingSum ? '—' : fmtPct(s.gross_margin)}
              delta={loadingSum ? '—' : gpDelta.text}
              up={gpDelta.up}
              sparkBars={['50%','45%','62%','58%','78%']}
            />
            <KpiCard
              label="Revenue"
              value={loadingSum ? '—' : fmt$(s.revenue)}
              delta={loadingSum ? '—' : revDelta.text}
              up={revDelta.up}
              sparkBars={['40%','52%','48%','66%','80%']}
            />
            <KpiCard
              label="Orders"
              value={loadingSum ? '—' : (s.orders ?? 0).toLocaleString()}
              delta={loadingSum ? '—' : ordDelta.text}
              up={ordDelta.up}
              sparkBars={['35%','48%','60%','54%','72%']}
            />
          </div>

          {/* chart + right column */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1.85fr 1fr' }}>
            <ProfitChart gran={gran} setGran={setGran} chartData={chartData} loading={loadingChart} />

            <div className="flex flex-col gap-4">
              {/* avg order value */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <span className="text-[13px] font-semibold">Avg. order value</span>
                <div className="num text-[30px] font-bold mt-3">{loadingSum ? '—' : fmt$(s.avg_order_value)}</div>
                <div className="text-[11.5px] text-[#8A93A1] mt-2">Per completed order this period</div>
              </div>

              {/* fees breakdown */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">Fees &amp; shipping</span>
                  <span className="num text-[12px] text-[#8A93A1]">{loadingSum ? '—' : fmt$(s.fees + s.shipping)} total</span>
                </div>
                <div className="flex flex-col gap-[13px] mt-[14px]">
                  {[['eBay fees', s.fees, '#3665F3'], ['Shipping', s.shipping, '#7BA0FF']].map(([label, val, color]) => {
                    const total = (s.fees ?? 0) + (s.shipping ?? 0)
                    const pct = total > 0 && val != null ? Math.round(val / total * 100) : 0
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-[12.5px] mb-[6px]">
                          <span className="text-[#5B6470]">{label}</span>
                          <span className="num font-semibold">{loadingSum ? '—' : fmt$(val)}</span>
                        </div>
                        <div className="h-[8px] bg-[#F1F3F6] rounded-[5px]">
                          <div className="h-full rounded-[5px]" style={{ width: pct + '%', background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* total orders */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">Orders</span>
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="num text-[30px] font-bold">{loadingSum ? '—' : (s.orders ?? 0).toLocaleString()}</div>
                  <span
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-[7px] py-[3px] rounded-[6px]"
                    style={deltaStyle(ordDelta.up)}
                  >
                    {loadingSum ? '—' : ordDelta.text}
                  </span>
                </div>
                <div className="text-[11.5px] text-[#8A93A1] mt-2">vs. prior equivalent period</div>
              </div>
            </div>
          </div>

          {/* heatmap */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr 1.25fr' }}>
            {/* placeholder left card */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Revenue breakdown</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">This period</div>
              <div className="mt-[18px] flex flex-col gap-[14px]">
                {[['Revenue', s.revenue, '#3665F3'], ['eBay fees', s.fees, '#C8553D'], ['Shipping', s.shipping, '#E0A11B'], ['Gross profit', s.gross_profit, '#5C8A00']].map(([label, val, color]) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-[8px] h-[8px] rounded-[3px] shrink-0" style={{ background: color }} />
                      <span className="text-[12.5px] text-[#5B6470]">{label}</span>
                    </div>
                    <span className="num text-[12.5px] font-semibold">{loadingSum ? '—' : fmt$(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <BestTimeHeatmap />
          </div>

          {/* recent sales + categories */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1.85fr 1fr' }}>
            <RecentSales sales={sales} loading={false} />

            <div className="flex flex-col gap-4">
              {/* insight */}
              <div className="rounded-[16px] border border-[#D6E3FF] p-[20px]" style={{ background: 'linear-gradient(180deg,#F2F6FF,#EAF1FF)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-[26px] h-[26px] rounded-[8px] bg-[#3665F3] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><path d="M9 1.8v2M3.2 3.2l1.4 1.4M1.8 9h2M14.2 3.2l-1.4 1.4M16.2 9h-2M9 6.2a2.8 2.8 0 0 0-1.6 5.1c.5.4.7.7.7 1.3v.4h1.8v-.4c0-.6.2-.9.7-1.3A2.8 2.8 0 0 0 9 6.2Z"/><line x1="7.7" y1="15.4" x2="10.3" y2="15.4"/></svg>
                  </div>
                  <span className="text-[12.5px] font-bold text-[#3665F3] tracking-[.02em]">PERCH INSIGHT</span>
                </div>
                <div className="text-[14px] leading-[1.5] text-[#16181D] mt-3 font-medium">
                  Keep syncing regularly to get AI-powered insights about your best-performing categories and ideal listing times.
                </div>
                <button className="inline-block mt-[14px] bg-[#3665F3] text-white font-semibold text-[12.5px] px-[14px] py-[9px] rounded-[9px] cursor-pointer hover:bg-[#2553c9] transition-colors">
                  Sync now →
                </button>
              </div>

              {/* top categories */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[20px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="text-[15px] font-semibold mb-[14px]">
                  {categories[0]?.type === 'revenue' ? 'Top categories · revenue' : 'Inventory by category'}
                </div>
                {categories.length === 0 ? (
                  <div className="text-[12.5px] text-[#A6ADB8] py-[8px]">No category data yet — sync your eBay store to see this.</div>
                ) : (
                  <div className="flex flex-col gap-[14px]">
                    {categories.map(cat => (
                      <div key={cat.name}>
                        <div className="flex justify-between items-center text-[12.5px] mb-[6px]">
                          <span className="font-semibold">{cat.name}</span>
                          <span className="num text-[#5B6470]">
                            {cat.type === 'revenue' ? fmt$(cat.value) : cat.value + ' listings'}
                          </span>
                        </div>
                        <div className="h-[7px] bg-[#F1F3F6] rounded-[5px]">
                          <div className="h-full bg-[#3665F3] rounded-[5px]" style={{ width: `${Math.round(cat.value / (cat.max ?? catMax) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
