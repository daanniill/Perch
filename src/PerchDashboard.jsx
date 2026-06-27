import { useState } from 'react'

// ── data ─────────────────────────────────────────────────────────────────────

const PERIODS = {
  today: { label: 'today', net: { v: '$310', d: '▲ 3.1%', up: true }, margin: { v: '29.6%', d: '▼ 0.5 pts', up: false }, revenue: { v: '$980', d: '▲ 1.2%', up: true }, orders: { v: '8', d: '▲ 1', up: true }, sellThrough: 61, avgDays: { v: '8.5', d: '▼ 0.3 days', up: true }, returns: { v: '2.4%', d: '▼ 0.4%', up: true }, fees: '$108' },
  '7d':  { label: 'the last 7 days', net: { v: '$1,980', d: '▲ 6.2%', up: true }, margin: { v: '30.4%', d: '▲ 0.8 pts', up: true }, revenue: { v: '$6,310', d: '▲ 4.0%', up: true }, orders: { v: '52', d: '▲ 5', up: true }, sellThrough: 64, avgDays: { v: '8.8', d: '▼ 0.4 days', up: true }, returns: { v: '2.7%', d: '▼ 0.3%', up: true }, fees: '$690' },
  '30d': { label: 'the last 30 days', net: { v: '$8,420', d: '▲ 12.4%', up: true }, margin: { v: '31.8%', d: '▲ 2.1 pts', up: true }, revenue: { v: '$26,480', d: '▲ 8.1%', up: true }, orders: { v: '214', d: '▲ 18', up: true }, sellThrough: 68, avgDays: { v: '9.3', d: '▼ 1.2 days', up: true }, returns: { v: '3.1%', d: '▼ 0.6%', up: true }, fees: '$2,890' },
  '12mo':{ label: 'the last 12 months', net: { v: '$86,400', d: '▲ 22.5%', up: true }, margin: { v: '32.6%', d: '▲ 3.2 pts', up: true }, revenue: { v: '$271,900', d: '▲ 19.4%', up: true }, orders: { v: '2,480', d: '▲ 410', up: true }, sellThrough: 71, avgDays: { v: '9.9', d: '▼ 2.1 days', up: true }, returns: { v: '3.4%', d: '▲ 0.2%', up: false }, fees: '$31,200' },
}

const CHARTS = {
  monthly: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], profit: [5.2,6.1,5.6,7.4,7.9,8.4], cost: [3.1,3.0,3.4,2.9,2.7,2.6] },
  yearly:  { labels: ['2022','2023','2024','2025','2026'], profit: [28,41,58,72,86], cost: [14,18,22,24,26] },
}

const SALES = [
  { name: 'Nike Air Max 90 — Infrared', meta: 'Sneakers · 7 days listed', price: '$148', profit: '+$64', margin: '43%', status: 'Sold', kind: 'sold' },
  { name: "Vintage Levi's 501 — W34", meta: 'Apparel · 3 days listed', price: '$72', profit: '+$38', margin: '53%', status: 'Shipped', kind: 'shipped' },
  { name: 'Sony WH-1000XM4 Headphones', meta: 'Electronics · 12 days listed', price: '$189', profit: '+$57', margin: '30%', status: 'Sold', kind: 'sold' },
  { name: 'Carhartt Detroit Jacket — L', meta: 'Apparel · 5 days listed', price: '$96', profit: '+$41', margin: '43%', status: 'Returned', kind: 'returned' },
]

const CATEGORIES = [
  { name: 'Sneakers', amount: '$9,840', raw: 9840 },
  { name: 'Electronics', amount: '$7,210', raw: 7210 },
  { name: 'Apparel', amount: '$5,360', raw: 5360 },
  { name: 'Toys & Collectibles', amount: '$4,070', raw: 4070 },
]

// heatmap opacity values [Mon..Sun] per row
const HEATMAP = {
  AM:  [.12, .20, .15, .28, .22, .40, .50],
  MID: [.18, .30, .25, .42, .38, .58, .68],
  PM:  [.30, .45, .38, .55, .66, .82, 1.0],
}

// ── helpers ───────────────────────────────────────────────────────────────────

function deltaStyle(up) {
  return up
    ? { color: '#5C8A00', background: '#EEF5DC' }
    : { color: '#E53238', background: '#FCEBEC' }
}

function statusStyle(kind) {
  if (kind === 'sold')     return { color: '#5C8A00', background: '#EEF5DC' }
  if (kind === 'shipped')  return { color: '#3665F3', background: '#EAF1FF' }
  return                          { color: '#E53238', background: '#FCEBEC' }
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
          'Listings', false
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>,
          'Create listing', false, () => onNavigate?.('listing-generator')
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>,
          'Analytics', false
        )}
        {navItem(
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>,
          'Finances', false
        )}
      </nav>

      <div className="flex-1" />

      <div className="bg-[#16181D] rounded-[13px] p-[14px] mb-[10px] cursor-pointer hover:bg-[#22252D] transition-colors">
        <div className="flex items-center gap-[7px]">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          <span className="text-[12.5px] font-bold text-white">Upgrade to Pro</span>
        </div>
        <div className="text-[11px] text-[#A6ADB8] leading-[1.4] mt-[6px]">Unlock profit analytics &amp; unlimited AI listings.</div>
      </div>

      <div className="flex items-center gap-[11px] px-[8px] py-[9px] rounded-[10px] text-[13.5px] font-medium text-[#5B6470] cursor-pointer hover:bg-[#ECEEF1] transition-colors mb-[6px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6"><circle cx="9" cy="9" r="2.6"/><circle cx="9" cy="9" r="7"/></svg>
        Settings
      </div>

      <div className="border-t border-[#E7E9EE] pt-[12px] flex items-center gap-[10px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#16181D] text-white flex items-center justify-center font-semibold text-[13px] shrink-0">JF</div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate">Jordan Fields</div>
          <div className="text-[11.5px] text-[#8A93A1] truncate">Jordan's Finds</div>
        </div>
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
          Jordan's Finds · synced 2 min ago · <span className="text-[#5C8A00] font-semibold">● Connected to eBay</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E7E9EE] rounded-[9px] px-[11px] py-[8px] w-[210px]">
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.7" strokeLinecap="round"><circle cx="8" cy="8" r="5.4"/><line x1="12.2" y1="12.2" x2="15.5" y2="15.5"/></svg>
          <span className="text-[12.5px] text-[#A6ADB8]">Search listings…</span>
        </div>
        <div className="relative w-[38px] h-[38px] rounded-[10px] bg-white border border-[#E7E9EE] flex items-center justify-center cursor-pointer">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="#5B6470" strokeWidth="1.6" strokeLinecap="round"><path d="M4.5 7.2a4.5 4.5 0 0 1 9 0c0 3.2 1.2 4.3 1.2 4.3H3.3s1.2-1.1 1.2-4.3Z"/><path d="M7.6 14.2a1.6 1.6 0 0 0 2.8 0"/></svg>
          <span className="absolute top-[7px] right-[8px] w-[7px] h-[7px] rounded-full bg-[#E53238] border-[1.5px] border-white" />
        </div>
        <button className="flex items-center gap-[7px] bg-[#3665F3] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ boxShadow: '0 1px 2px rgba(54,101,243,.4)' }}>
          <span className="text-[16px] leading-none -mt-[1px]">+</span> New listing
        </button>
      </div>
    </header>
  )
}

function ProfitChart({ gran, setGran }) {
  const c = CHARTS[gran]
  const max = Math.max(...c.profit.map((v, i) => v + c.cost[i]))
  const sum = a => a.reduce((x, y) => x + y, 0)
  const fmtK = n => '$' + (n >= 100 ? Math.round(n) : n.toFixed(1)) + 'k'
  const bestIdx = c.profit.indexOf(Math.max(...c.profit))

  return (
    <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold">Profit &amp; costs</div>
          <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Net profit after fees, shipping &amp; cost of goods</div>
        </div>
        <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[9px]">
          {segBtn(gran === 'monthly', () => setGran('monthly'), 'Monthly')}
          {segBtn(gran === 'yearly',  () => setGran('yearly'),  'Yearly')}
        </div>
      </div>

      <div className="flex gap-[18px] mt-[14px] text-[11.5px] text-[#8A93A1]">
        <span className="flex items-center gap-[6px]"><span className="w-[10px] h-[10px] rounded-[3px] bg-[#3665F3]" />Profit</span>
        <span className="flex items-center gap-[6px]"><span className="w-[10px] h-[10px] rounded-[3px] bg-[#DCE1E8]" />Costs</span>
      </div>

      <div className="flex items-end gap-4 h-[208px] mt-[18px]">
        {c.labels.map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full gap-[3px]">
            <div className="bg-[#3665F3] rounded-t-[5px]" style={{ height: `${(c.profit[i] / max * 100).toFixed(1)}%` }} />
            <div className="bg-[#DCE1E8] rounded-b-[5px]" style={{ height: `${(c.cost[i]   / max * 100).toFixed(1)}%` }} />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-[10px]">
        {c.labels.map(l => (
          <div key={l} className="flex-1 text-center text-[10.5px] text-[#9aa3b0] font-medium">{l}</div>
        ))}
      </div>

      <div className="flex gap-[14px] mt-[18px] pt-[18px] border-t border-[#EEF0F4]">
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Profit · this range</div>
          <div className="num text-[18px] font-bold mt-[3px]">{fmtK(sum(c.profit))}</div>
        </div>
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Costs · this range</div>
          <div className="num text-[18px] font-bold mt-[3px] text-[#5B6470]">{fmtK(sum(c.cost))}</div>
        </div>
        <div className="flex-1">
          <div className="text-[11.5px] text-[#8A93A1]">Best period</div>
          <div className="num text-[18px] font-bold mt-[3px]">{c.labels[bestIdx]}</div>
        </div>
      </div>
    </div>
  )
}

function BestTimeHeatmap({ locked }) {
  const days = ['M','T','W','T','F','S','S']
  const rows = [['AM', HEATMAP.AM], ['MID', HEATMAP.MID], ['PM', HEATMAP.PM]]

  return (
    <div className="relative bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      {locked && (
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
      )}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold">Best time to list</div>
          <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">When your buyers are most active</div>
        </div>
        <span className="text-[11.5px] text-[#5C8A00] font-semibold bg-[#EEF5DC] px-[9px] py-[4px] rounded-[7px]">Peak · Sun 7–9pm</span>
      </div>
      <div className="mt-[18px] grid gap-[6px] items-center" style={{ gridTemplateColumns: 'auto repeat(7,1fr)' }}>
        <div />
        {days.map((d, i) => <div key={i} className="text-center text-[10px] text-[#9aa3b0] font-semibold">{d}</div>)}
        {rows.map(([label, opacities]) => (
          <>
            <div key={label} className="text-[10px] text-[#9aa3b0] font-semibold">{label}</div>
            {opacities.map((o, i) => (
              <div
                key={i}
                className="h-[26px] rounded-[6px]"
                style={{
                  background: o === 1 ? '#3665F3' : `rgba(54,101,243,${o})`,
                  ...(o === 1 ? { boxShadow: '0 0 0 2px rgba(54,101,243,.25)' } : {}),
                }}
              />
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

function RecentSales() {
  return (
    <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
      <div className="px-[22px] py-[20px] pb-[14px] flex items-center justify-between">
        <div className="text-[15px] font-semibold">Recent sales</div>
        <span className="text-[12.5px] text-[#3665F3] font-semibold cursor-pointer">View all →</span>
      </div>
      <div className="grid px-[22px] pb-[6px] text-[11px] text-[#A6ADB8] font-semibold tracking-[.03em] uppercase" style={{ gridTemplateColumns: '1fr 92px 92px 80px 96px' }}>
        <span>Item</span><span className="text-right">Sold for</span><span className="text-right">Profit</span><span className="text-right">Margin</span><span className="text-right">Status</span>
      </div>
      {SALES.map((row, i) => {
        const ss = statusStyle(row.kind)
        return (
          <div key={i} className="grid items-center px-[22px] py-[10px] border-t border-[#F1F3F6] hover:bg-[#FAFBFC] transition-colors" style={{ gridTemplateColumns: '1fr 92px 92px 80px 96px' }}>
            <div className="flex items-center gap-[11px] min-w-0">
              <div className="w-[38px] h-[38px] rounded-[9px] bg-[#F1F3F6] shrink-0 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C4CBD4" strokeWidth="1.4"><rect x="2" y="3" width="14" height="12" rx="2"/><circle cx="6.4" cy="7" r="1.4"/><path d="M3 13l3.5-3.4 2.3 2.1 3-2.8 3.2 3"/></svg>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{row.name}</div>
                <div className="text-[11.5px] text-[#9aa3b0]">{row.meta}</div>
              </div>
            </div>
            <div className="num text-right text-[13px] font-semibold">{row.price}</div>
            <div className="num text-right text-[13px] font-semibold text-[#5C8A00]">{row.profit}</div>
            <div className="num text-right text-[13px] text-[#5B6470]">{row.margin}</div>
            <div className="text-right">
              <span className="text-[11px] font-semibold px-[9px] py-[3px] rounded-[6px]" style={ss}>{row.status}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

export default function PerchDashboard({ onNavigate }) {
  const [period, setPeriod] = useState('30d')
  const [gran, setGran] = useState('monthly')
  const isPro = false

  const p = PERIODS[period]
  const catMax = Math.max(...CATEGORIES.map(c => c.raw))

  const periodTabs = [['today','Today'],['7d','7D'],['30d','30D'],['12mo','12M']]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        <TopBar />

        <div className="px-[30px] pb-12 pt-6 max-w-[1320px]">

          {/* period selector */}
          <div className="flex items-center justify-between mb-[18px]">
            <div className="text-[14px] text-[#5B6470]">Showing <span className="text-[#16181D] font-semibold">{p.label}</span></div>
            <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[10px]">
              {periodTabs.map(([key, label]) => segBtn(period === key, () => setPeriod(key), label))}
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            <KpiCard label="Net profit"    value={p.net.v}     delta={p.net.d}     up={p.net.up}     sparkBars={['30%','55%','42%','70%','85%']} />
            <KpiCard label="Profit margin" value={p.margin.v}  delta={p.margin.d}  up={p.margin.up}  sparkBars={['50%','45%','62%','58%','78%']} />
            <KpiCard label="Revenue"       value={p.revenue.v} delta={p.revenue.d} up={p.revenue.up} sparkBars={['40%','52%','48%','66%','80%']} />
            <KpiCard label="Orders"        value={p.orders.v}  delta={p.orders.d}  up={p.orders.up}  sparkBars={['35%','48%','60%','54%','72%']} />
          </div>

          {/* chart + right column */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1.85fr 1fr' }}>
            <ProfitChart gran={gran} setGran={setGran} />

            <div className="flex flex-col gap-4">
              {/* sell-through */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">Sell-through rate</span>
                  <span className="text-[11px] text-[#8A93A1]">{Math.round(p.sellThrough * 3.15)} of 315 listed</span>
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <div className="num text-[30px] font-bold">{p.sellThrough}%</div>
                  <div className="text-[12px] text-[#8A93A1]">of listed inventory sold</div>
                </div>
                <div className="h-[8px] bg-[#F1F3F6] rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#3665F3] rounded-full transition-all" style={{ width: `${p.sellThrough}%` }} />
                </div>
              </div>

              {/* avg days */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <span className="text-[13px] font-semibold">Avg. days to sell</span>
                <div className="flex items-end justify-between mt-3">
                  <div className="num text-[30px] font-bold">{p.avgDays.v}</div>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-[7px] py-[3px] rounded-[6px]" style={deltaStyle(p.avgDays.up)}>{p.avgDays.d}</span>
                </div>
                <div className="text-[11.5px] text-[#8A93A1] mt-2">Faster than your 11-day category average</div>
              </div>

              {/* returns */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">Returns</span>
                  <span className="text-[11px] text-[#5C8A00] font-semibold">Healthy</span>
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="num text-[30px] font-bold">{p.returns.v}</div>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-[7px] py-[3px] rounded-[6px]" style={deltaStyle(p.returns.up)}>{p.returns.d}</span>
                </div>
                <div className="text-[11.5px] text-[#8A93A1] mt-2">Top reason: <span className="text-[#16181D] font-semibold">Doesn't fit</span></div>
              </div>
            </div>
          </div>

          {/* fees + heatmap */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr 1.25fr' }}>
            {/* fees */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="flex items-baseline justify-between">
                <div className="text-[15px] font-semibold">Where fees go</div>
                <div className="num text-[13px] text-[#8A93A1]">{p.fees} total</div>
              </div>
              <div className="mt-[18px] flex flex-col gap-[15px]">
                {[['Final value fees','58%','#3665F3'],['Promoted listings','22%','#7BA0FF'],['Shipping labels','14%','#A6BDFF'],['Store subscription','6%','#CDD8FF']].map(([label, pct, color]) => (
                  <div key={label}>
                    <div className="flex justify-between text-[12.5px] mb-[6px]">
                      <span className="text-[#5B6470]">{label}</span>
                      <span className="num font-semibold">{pct}</span>
                    </div>
                    <div className="h-[8px] bg-[#F1F3F6] rounded-[5px]">
                      <div className="h-full rounded-[5px]" style={{ width: pct, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BestTimeHeatmap locked={!isPro} />
          </div>

          {/* recent sales + insights */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1.85fr 1fr' }}>
            <RecentSales />

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
                  Sneakers are your highest-margin category at <strong>44%</strong>. You have <strong>12 unlisted pairs</strong> — posting them this Sunday 7–9pm could add roughly <span className="text-[#3665F3] font-bold">$640</span> this month.
                </div>
                <button className="inline-block mt-[14px] bg-[#3665F3] text-white font-semibold text-[12.5px] px-[14px] py-[9px] rounded-[9px] cursor-pointer hover:bg-[#2553c9] transition-colors">
                  Create these listings →
                </button>
              </div>

              {/* top categories */}
              <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[20px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="text-[15px] font-semibold mb-[14px]">Top categories</div>
                <div className="flex flex-col gap-[14px]">
                  {CATEGORIES.map(cat => (
                    <div key={cat.name}>
                      <div className="flex justify-between items-center text-[12.5px] mb-[6px]">
                        <span className="font-semibold">{cat.name}</span>
                        <span className="num text-[#5B6470]">{cat.amount}</span>
                      </div>
                      <div className="h-[7px] bg-[#F1F3F6] rounded-[5px]">
                        <div className="h-full bg-[#3665F3] rounded-[5px]" style={{ width: `${Math.round(cat.raw / catMax * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
