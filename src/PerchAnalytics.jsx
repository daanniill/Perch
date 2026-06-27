import { useState } from 'react'

// ── data ─────────────────────────────────────────────────────────────────────

const PERIODS = {
  '7d':  { label:'the last 7 days',    views:{v:'4,210',  d:'▲ 5.1%',   g:true},  conv:{v:'2.9%', d:'▲ 0.3 pts', g:true},  aov:{v:'$118', d:'▼ 1.2%',   g:false}, watch:{v:'182',   d:'▲ 14',     g:true} },
  '30d': { label:'the last 30 days',   views:{v:'18,640', d:'▲ 9.4%',   g:true},  conv:{v:'3.2%', d:'▲ 0.5 pts', g:true},  aov:{v:'$124', d:'▲ 3.8%',   g:true},  watch:{v:'806',   d:'▲ 62',     g:true} },
  '90d': { label:'the last 90 days',   views:{v:'54,120', d:'▲ 12.1%',  g:true},  conv:{v:'3.0%', d:'▲ 0.2 pts', g:true},  aov:{v:'$121', d:'▲ 2.1%',   g:true},  watch:{v:'2,140', d:'▲ 180',    g:true} },
  '12mo':{ label:'the last 12 months', views:{v:'214K',   d:'▲ 22.4%',  g:true},  conv:{v:'3.1%', d:'▲ 0.6 pts', g:true},  aov:{v:'$119', d:'▲ 5.4%',   g:true},  watch:{v:'8,920', d:'▲ 1,240',  g:true} },
}

const CHART = {
  '7d':  { labels:['M','T','W','T','F','S','S'], orders:[6,8,7,9,11,14,12], visits:[210,260,240,310,420,560,520] },
  '30d': { labels:['W1','W2','W3','W4'],          orders:[42,55,61,56],       visits:[3200,4100,4600,4300] },
  '90d': { labels:['Apr','May','Jun'],             orders:[168,190,214],       visits:[12400,16200,18600] },
  '12mo':{ labels:['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'], orders:[120,138,126,152,178,210,165,172,168,190,205,214], visits:[9000,11000,10200,12800,16800,21000,13800,14600,14200,16200,18200,18600] },
}

const FUNNEL_BASE = [
  { label:'Impressions',      value:142000, color:'#C9DBF8' },
  { label:'Listing views',    value:18640,  color:'#7BA0FF' },
  { label:'Add to watchlist', value:806,    color:'#3665F3' },
  { label:'Orders',           value:214,    color:'#16181D' },
]

const SOURCES = [
  { label:'eBay search',        pct:54, color:'#3665F3' },
  { label:'Promoted listings',  pct:23, color:'#7BA0FF' },
  { label:'Browse / category',  pct:14, color:'#A6BDFF' },
  { label:'External / direct',  pct:9,  color:'#CDD8FF' },
]

const CATEGORIES = [
  { name:'Sneakers',           revenue:'$9,840', raw:9840, sold:84,  sellThrough:'72%' },
  { name:'Electronics',        revenue:'$7,210', raw:7210, sold:52,  sellThrough:'64%' },
  { name:'Apparel',            revenue:'$5,360', raw:5360, sold:118, sellThrough:'68%' },
  { name:'Toys & Collectibles',revenue:'$4,070', raw:4070, sold:36,  sellThrough:'59%' },
]

const TOP = [
  { name:'iPhone 13 128GB — Unlocked',   cat:'Electronics', views:'720', sold:'14', conv:'4.1%' },
  { name:'Pokémon Booster Box (Sealed)', cat:'Toys',        views:'612', sold:'9',  conv:'3.8%' },
  { name:'Nike Air Max 90 Infrared',     cat:'Sneakers',    views:'540', sold:'18', conv:'5.2%' },
  { name:'Nintendo Switch OLED',         cat:'Electronics', views:'410', sold:'11', conv:'3.4%' },
  { name:'Sony WH-1000XM4',             cat:'Electronics', views:'389', sold:'8',  conv:'3.0%' },
]

// ── helpers ───────────────────────────────────────────────────────────────────

function buildPath(visits, w, h) {
  const max = Math.max(...visits) * 1.15
  const n   = visits.length
  const pts = visits.map((v, i) => {
    const x = n === 1 ? w / 2 : (i / (n - 1)) * w
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
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', true)}
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
      <div className="flex items-center gap-[11px] px-2 py-[9px] rounded-[10px] text-[13.5px] font-medium text-[#5B6470] cursor-pointer hover:bg-[#ECEEF1] transition-colors mb-[6px]">
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

export default function PerchAnalytics({ onNavigate }) {
  const [period, setPeriod] = useState('30d')

  const p    = PERIODS[period]
  const c    = CHART[period]
  const path = buildPath(c.visits, 720, 200)
  const maxOrders = Math.max(...c.orders)

  const col = g => g ? '#5C8A00' : '#C8553D'
  const bg  = g => g ? '#EEF5DC' : '#FCEBEC'

  const catMax = Math.max(...CATEGORIES.map(x => x.raw))

  const funnel = FUNNEL_BASE.map((f, i) => ({
    ...f,
    valueStr: f.value.toLocaleString(),
    width: Math.max(6, f.value / FUNNEL_BASE[0].value * 100) + '%',
    rate: i === 0 ? '100%' : (f.value / FUNNEL_BASE[i - 1].value * 100).toFixed(1) + '%',
  }))

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily:"'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">

        {/* ── header ── */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-4 border-b border-[#EAEBEF]"
          style={{ background:'rgba(246,247,249,.85)', backdropFilter:'blur(8px)' }}>
          <div>
            <div className="text-[21px] font-bold tracking-[-0.02em]">Analytics</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">Performance &amp; traffic · {p.label} · Jordan's Finds</div>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[10px]">
              {[['7d','7D'],['30d','30D'],['90d','90D'],['12mo','12M']].map(([key, label]) => {
                const active = key === period
                return (
                  <button key={key} onClick={() => setPeriod(key)}
                    className="px-[13px] py-[7px] rounded-[7px] text-[12px] font-semibold cursor-pointer transition-all"
                    style={{ border:'none', fontFamily:'inherit', background: active ? '#fff' : 'transparent', color: active ? '#16181D' : '#8A93A1', boxShadow: active ? '0 1px 2px rgba(16,24,40,.14)' : 'none' }}>
                    {label}
                  </button>
                )
              })}
            </div>
            <button className="flex items-center gap-[7px] bg-white border border-[#E7E9EE] text-[#5B6470] font-semibold text-[12.5px] px-[13px] py-[9px] rounded-[10px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors"
              style={{ fontFamily:'inherit' }}>
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
            {[
              { label:'Total views',      ...p.views },
              { label:'Conversion rate',  ...p.conv },
              { label:'Avg. sale price',  ...p.aov },
              { label:'Watchers',         ...p.watch },
            ].map(({ label, v, d, g }) => (
              <div key={label} className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
                <div className="text-[12.5px] text-[#8A93A1] font-medium">{label}</div>
                <div className="num text-[27px] font-bold mt-2">{v}</div>
                <div className="mt-[9px] inline-flex items-center gap-1 text-[11.5px] font-semibold px-[7px] py-[3px] rounded-[6px]"
                  style={{ color: col(g), background: bg(g) }}>{d}</div>
              </div>
            ))}
          </div>

          {/* ── sales & visits chart ── */}
          <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px] mt-4" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold">Sales &amp; visits</div>
                <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Orders against store traffic</div>
              </div>
              <div className="flex gap-[18px] text-[11.5px] text-[#8A93A1]">
                <span className="flex items-center gap-[6px]">
                  <span className="w-[10px] h-[10px] rounded-[3px]" style={{ background:'#3665F3' }}/>Orders
                </span>
                <span className="flex items-center gap-[6px]">
                  <span className="w-[10px] h-[3px] rounded-[2px]" style={{ background:'#E0A11B' }}/>Visits
                </span>
              </div>
            </div>

            {/* chart */}
            <div className="relative mt-5" style={{ height:200 }}>
              <svg viewBox="0 0 720 200" preserveAspectRatio="none"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                {[40,90,140,190].map(y => (
                  <line key={y} x1="0" y1={y} x2="720" y2={y} stroke={y === 190 ? '#E7E9EE' : '#F1F3F6'} strokeWidth="1"/>
                ))}
                <path d={path.area} fill="rgba(224,161,27,.10)" stroke="none"/>
                <path d={path.line} fill="none" stroke="#E0A11B" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              {/* order bars */}
              <div className="absolute inset-0 flex items-end" style={{ padding:'0 2px' }}>
                {c.orders.map((o, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                    <div style={{ width:'54%', background:'#3665F3', borderRadius:'4px 4px 0 0', height:(o / maxOrders * 88).toFixed(1) + '%', opacity:.88 }}/>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mt-2">
              {c.labels.map((l, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-[#9aa3b0] font-medium">{l}</div>
              ))}
            </div>
          </div>

          {/* ── funnel + traffic sources ── */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns:'1.4fr 1fr' }}>

            {/* conversion funnel */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Conversion funnel</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">From impression to sale</div>
              <div className="flex flex-col gap-3 mt-5">
                {funnel.map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between items-baseline mb-[6px]">
                      <span className="text-[13px] font-semibold">{f.label}</span>
                      <span className="text-[12px] text-[#8A93A1]">
                        <span className="num font-semibold text-[#16181D]">{f.valueStr}</span> · {f.rate}
                      </span>
                    </div>
                    <div className="h-[30px] bg-[#F1F3F6] rounded-[8px] overflow-hidden">
                      <div className="h-full rounded-[8px]" style={{ width: f.width, background: f.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* traffic sources */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Traffic sources</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Where buyers find you</div>
              <div className="flex flex-col gap-[15px] mt-5">
                {SOURCES.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[12.5px] mb-[6px]">
                      <span className="text-[#5B6470] font-medium">{s.label}</span>
                      <span className="num font-semibold">{s.pct}%</span>
                    </div>
                    <div className="h-[7px] bg-[#F1F3F6] rounded-[5px]">
                      <div className="h-full rounded-[5px]" style={{ width: s.pct + '%', background: s.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── category performance + top products ── */}
          <div className="grid gap-4 mt-4" style={{ gridTemplateColumns:'1fr 1.4fr' }}>

            {/* category performance */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[22px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Category performance</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Revenue &amp; sell-through</div>
              <div className="flex flex-col gap-4 mt-5">
                {CATEGORIES.map(c => (
                  <div key={c.name}>
                    <div className="flex justify-between items-center mb-[7px]">
                      <span className="text-[13px] font-semibold">{c.name}</span>
                      <span className="num text-[12.5px] text-[#5B6470]">{c.revenue}</span>
                    </div>
                    <div className="h-[7px] bg-[#F1F3F6] rounded-[5px]">
                      <div className="h-full rounded-[5px] bg-[#3665F3]" style={{ width: (c.raw / catMax * 100) + '%' }}/>
                    </div>
                    <div className="flex justify-between mt-[6px] text-[11px] text-[#8A93A1]">
                      <span><span className="num">{c.sold}</span> sold</span>
                      <span><span className="num font-semibold text-[#5C8A00]">{c.sellThrough}</span> sell-through</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* top performers */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="px-[22px] pt-5 pb-3 flex items-center justify-between">
                <div className="text-[15px] font-semibold">Top performers</div>
                <span className="text-[12px] text-[#8A93A1]">by revenue</span>
              </div>
              <div className="grid px-[22px] pb-2 text-[10.5px] text-[#A6ADB8] font-semibold tracking-[.03em] uppercase"
                style={{ gridTemplateColumns:'18px 1fr 64px 70px 64px' }}>
                <span>#</span><span>Item</span>
                <span className="text-right">Views</span>
                <span className="text-right">Sold</span>
                <span className="text-right">Conv.</span>
              </div>
              {TOP.map((t, i) => (
                <div key={t.name} className="grid items-center px-[22px] py-[11px] border-t border-[#F4F5F7] hover:bg-[#FAFBFC] transition-colors"
                  style={{ gridTemplateColumns:'18px 1fr 64px 70px 64px' }}>
                  <span className="num text-[12px] font-bold text-[#C4CBD4]">{i + 1}</span>
                  <div className="min-w-0 pr-[10px]">
                    <div className="text-[12.5px] font-semibold truncate">{t.name}</div>
                    <div className="text-[11px] text-[#9aa3b0]">{t.cat}</div>
                  </div>
                  <span className="num text-right text-[12.5px] text-[#5B6470]">{t.views}</span>
                  <span className="num text-right text-[12.5px] font-semibold">{t.sold}</span>
                  <span className="num text-right text-[12.5px] font-semibold text-[#5C8A00]">{t.conv}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
