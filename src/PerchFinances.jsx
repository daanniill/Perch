import { useState } from 'react'

// ── data ─────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const DATA = {
  '2026': { netK:[5.2,6.1,5.6,7.4,7.9,8.4,0,0,0,0,0,0], cogsR:0.42,  feesR:0.108, shipR:0.06,  refundR:0.022, label:'2026 · YTD', revDelta:'▲ on track',         partial:true  },
  '2025': { netK:[4.1,3.8,4.6,5.2,5.0,6.1,6.8,7.2,6.4,7.9,9.1,8.3],  cogsR:0.44,  feesR:0.112, shipR:0.063, refundR:0.025, label:'2025',       revDelta:'▲ 19.4% vs 2024', partial:false },
  '2024': { netK:[2.8,3.1,2.9,3.4,3.6,3.9,4.2,4.0,3.8,4.6,5.4,4.7],  cogsR:0.46,  feesR:0.115, shipR:0.066, refundR:0.028, label:'2024',       revDelta:'first full year', partial:false },
}

function derive(year) {
  const d = DATA[year]
  const netByMonth = d.netK.map(k => k * 1000)
  const totalNet   = netByMonth.reduce((a, b) => a + b, 0)
  const costRatio  = d.cogsR + d.feesR + d.shipR + d.refundR
  const revenue    = totalNet / (1 - costRatio)
  const cogs       = revenue * d.cogsR
  const fees       = revenue * d.feesR
  const shipping   = revenue * d.shipR
  const refunds    = revenue * d.refundR
  const margin     = totalNet / revenue * 100
  const activeMonths = d.partial ? d.netK.filter(k => k > 0).length : 12
  const maxNet     = Math.max(...netByMonth, 1)
  const peakIdx    = netByMonth.indexOf(maxNet)

  const fmt = (n) => '$' + Math.round(n).toLocaleString()
  const pct = (p) => p.toFixed(1) + '%'

  const months = MONTH_NAMES.map((label, i) => {
    const v = netByMonth[i]
    const future = d.partial && i >= activeMonths
    return { label, height: future ? '0%' : (v / maxNet * 100).toFixed(1) + '%', color: i === peakIdx ? '#3665F3' : '#A6BDFF' }
  })

  const tableRows = MONTH_NAMES.slice(0, activeMonths).map((label, i) => {
    const net = netByMonth[i]
    const rev = net / (1 - costRatio)
    return { month: label, revenue: fmt(rev), cogs: fmt(rev * d.cogsR), fees: fmt(rev * d.feesR), net: fmt(net), margin: (net / rev * 100).toFixed(0) + '%' }
  })

  return {
    label: d.label, revDelta: d.revDelta, months, tableRows,
    pl: {
      revenue: fmt(revenue), cogs: fmt(cogs), fees: fmt(fees), shipping: fmt(shipping),
      cogsNeg: '−' + fmt(cogs), feesNeg: '−' + fmt(fees), shippingNeg: '−' + fmt(shipping), refundsNeg: '−' + fmt(refunds),
      cogsPct: (d.cogsR*100).toFixed(0) + '%', feesPct: (d.feesR*100).toFixed(1) + '%', shipPct: (d.shipR*100).toFixed(1) + '%',
      net: fmt(totalNet), margin: pct(margin),
    },
    comp: {
      cogsW: pct(cogs/revenue*100), feesW: pct(fees/revenue*100), shipW: pct(shipping/revenue*100), refundW: pct(refunds/revenue*100), profitW: pct(margin),
      cogsPct: pct(cogs/revenue*100), feesPct: pct(fees/revenue*100), shipPct: pct(shipping/revenue*100), refundPct: pct(refunds/revenue*100), profitPct: pct(margin),
    },
  }
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
    <aside className="w-[244px] shrink-0 flex flex-col border-r border-[#EAEBEF] bg-[#F4F5F7] p-[18px_14px]">
      <div className="flex items-center gap-[11px] px-2 pb-[18px] pt-[6px]">
        <PerchLogo /><span className="font-bold text-[21px] tracking-[-0.02em]">Perch</span>
      </div>
      <div className="text-[10.5px] font-semibold tracking-[.09em] text-[#A6ADB8] px-[10px] py-[6px]">MENU</div>
      <nav className="flex flex-col gap-[2px]">
        {item(<svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/><rect x="10.1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="1.5" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="10.1" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/></svg>, 'Dashboard', false, () => onNavigate?.('dashboard'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>, 'Listings', false, () => onNavigate?.('listings'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>, 'Create listing', false, () => onNavigate?.('listing-generator'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', false)}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', true)}
      </nav>
      <div className="flex-1"/>
      <div className="bg-[#16181D] rounded-[13px] p-[14px] mb-[10px] cursor-pointer hover:bg-[#22252D] transition-colors">
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

const CARD_COL = '0.8fr 1fr 1fr 1fr 1fr 0.8fr'

export default function PerchFinances({ onNavigate }) {
  const [year, setYear] = useState('2026')
  const { label, revDelta, months, tableRows, pl, comp } = derive(year)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily:"'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">

        {/* ── header ── */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-4 border-b border-[#EAEBEF]"
          style={{ background:'rgba(246,247,249,.85)', backdropFilter:'blur(8px)' }}>
          <div>
            <div className="text-[21px] font-bold tracking-[-0.02em]">Finances</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">Profit &amp; loss · {label} · Jordan's Finds</div>
          </div>
          <div className="flex items-center gap-[10px]">
            {/* year switcher */}
            <div className="inline-flex gap-[2px] bg-[#ECEEF1] p-[3px] rounded-[10px]">
              {['2026','2025','2024'].map(y => {
                const active = y === year
                return (
                  <button key={y} onClick={() => setYear(y)}
                    className="px-[13px] py-[7px] rounded-[7px] text-[12.5px] font-semibold cursor-pointer transition-all"
                    style={{ border:'none', fontFamily:'inherit', background: active ? '#fff' : 'transparent', color: active ? '#16181D' : '#8A93A1', boxShadow: active ? '0 1px 2px rgba(16,24,40,.14)' : 'none' }}>
                    {y}
                  </button>
                )
              })}
            </div>
            <button className="flex items-center gap-[7px] bg-white border border-[#E7E9EE] text-[#5B6470] font-semibold text-[12.5px] px-[13px] py-[9px] rounded-[10px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors"
              style={{ fontFamily:'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 1.5v10M5 7.5L9 11.5l4-4M3 14.5h12"/>
              </svg>
              Export CSV
            </button>
          </div>
        </header>

        <div className="px-[30px] pb-6 pt-[18px] max-w-[1320px]">

          {/* ── row 1: 5 KPI cards ── */}
          <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(5,1fr)' }}>
            {/* Revenue */}
            <div className="bg-white border border-[#EEF0F4] rounded-[14px] p-[13px_14px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[12px] text-[#8A93A1] font-medium">Revenue</div>
              <div className="num text-[21px] font-bold mt-[5px]">{pl.revenue}</div>
              <div className="text-[11px] font-semibold mt-[6px] text-[#5C8A00]">{revDelta}</div>
            </div>
            {/* COGS */}
            <div className="bg-white border border-[#EEF0F4] rounded-[14px] p-[13px_14px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[12px] text-[#8A93A1] font-medium">Cost of goods</div>
              <div className="num text-[21px] font-bold mt-[5px] text-[#5B6470]">{pl.cogs}</div>
              <div className="text-[11px] text-[#8A93A1] mt-[6px]">{pl.cogsPct} of revenue</div>
            </div>
            {/* Fees */}
            <div className="bg-white border border-[#EEF0F4] rounded-[14px] p-[13px_14px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[12px] text-[#8A93A1] font-medium">eBay fees</div>
              <div className="num text-[21px] font-bold mt-[5px] text-[#5B6470]">{pl.fees}</div>
              <div className="text-[11px] text-[#8A93A1] mt-[6px]">{pl.feesPct} of revenue</div>
            </div>
            {/* Shipping */}
            <div className="bg-white border border-[#EEF0F4] rounded-[14px] p-[13px_14px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[12px] text-[#8A93A1] font-medium">Shipping</div>
              <div className="num text-[21px] font-bold mt-[5px] text-[#5B6470]">{pl.shipping}</div>
              <div className="text-[11px] text-[#8A93A1] mt-[6px]">{pl.shipPct} of revenue</div>
            </div>
            {/* Net profit — dark card */}
            <div className="rounded-[14px] p-[13px_14px]" style={{ background:'#16181D', border:'1px solid #16181D' }}>
              <div className="text-[12px] text-[#A6ADB8] font-medium">Net profit</div>
              <div className="num text-[21px] font-bold mt-[5px] text-white">{pl.net}</div>
              <div className="text-[11px] font-semibold mt-[6px]" style={{ color:'#86E0A8' }}>{pl.margin} margin</div>
            </div>
          </div>

          {/* ── row 2: bar chart + P&L statement ── */}
          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns:'1.7fr 1fr' }}>

            {/* monthly net profit bar chart */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[15px] font-semibold">Monthly net profit</div>
                  <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">{label} · after all fees &amp; costs</div>
                </div>
                <div className="text-right">
                  <div className="num text-[20px] font-bold">{pl.net}</div>
                  <div className="text-[11.5px] text-[#8A93A1]">total net</div>
                </div>
              </div>
              <div className="flex items-end gap-[9px] mt-[14px]" style={{ height:128 }}>
                {months.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-[6px]">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div style={{ background: m.color, borderRadius:'4px 4px 0 0', height: m.height, minHeight: m.height === '0%' ? 0 : 3 }}/>
                    </div>
                    <span className="text-[9.5px] font-medium text-[#9aa3b0]">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* P&L statement */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">P&amp;L statement</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">{label} summary</div>
              <div className="flex flex-col mt-[18px]">
                {[
                  { label:'Gross revenue',     val: pl.revenue,     valClass:'font-semibold text-[#16181D]',  rowClass:'font-semibold' },
                  { label:'− Cost of goods',   val: pl.cogsNeg,     valClass:'text-[#C8553D]' },
                  { label:'− eBay fees',       val: pl.feesNeg,     valClass:'text-[#C8553D]' },
                  { label:'− Shipping',        val: pl.shippingNeg, valClass:'text-[#C8553D]' },
                  { label:'− Refunds & returns', val: pl.refundsNeg, valClass:'text-[#C8553D]' },
                ].map(({ label: l, val, valClass, rowClass }) => (
                  <div key={l} className="flex justify-between py-[7px] border-b border-[#F4F5F7]">
                    <span className={`text-[13px] text-[#5B6470] ${rowClass || ''}`}>{l}</span>
                    <span className={`num text-[13px] ${valClass || ''}`}>{val}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-[14px] pb-1 mt-1">
                  <span className="text-[14px] font-bold">Net profit</span>
                  <span className="num text-[16px] font-bold text-[#5C8A00]">{pl.net}</span>
                </div>
                <div className="flex justify-end">
                  <span className="text-[11.5px] text-[#8A93A1]">{pl.margin} net margin</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── row 3: cost breakdown + monthly table ── */}
          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns:'1fr 1.7fr' }}>

            {/* cost composition */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-[18px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[15px] font-semibold">Where the money goes</div>
              <div className="text-[12.5px] text-[#8A93A1] mt-[2px]">Per $100 of revenue</div>
              {/* stacked bar */}
              <div className="flex h-[14px] rounded-[7px] overflow-hidden mt-[18px]">
                <div style={{ width: comp.cogsW,   background:'#3665F3' }}/>
                <div style={{ width: comp.feesW,   background:'#7BA0FF' }}/>
                <div style={{ width: comp.shipW,   background:'#A6BDFF' }}/>
                <div style={{ width: comp.refundW, background:'#E0A11B' }}/>
                <div style={{ width: comp.profitW, background:'#5C8A00' }}/>
              </div>
              {/* legend */}
              <div className="flex flex-col gap-2 mt-[14px]">
                {[
                  { color:'#3665F3', label:'Cost of goods', val: comp.cogsPct   },
                  { color:'#7BA0FF', label:'eBay fees',     val: comp.feesPct   },
                  { color:'#A6BDFF', label:'Shipping',      val: comp.shipPct   },
                  { color:'#E0A11B', label:'Refunds',       val: comp.refundPct },
                ].map(({ color, label: l, val }) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12.5px] text-[#5B6470]">
                      <span className="w-[10px] h-[10px] rounded-[3px] shrink-0" style={{ background: color }}/>
                      {l}
                    </span>
                    <span className="num text-[12.5px] font-semibold">{val}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-[11px] border-t border-[#F1F3F6]">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#16181D]">
                    <span className="w-[10px] h-[10px] rounded-[3px] shrink-0" style={{ background:'#5C8A00' }}/>
                    Net profit
                  </span>
                  <span className="num text-[13px] font-bold text-[#5C8A00]">{comp.profitPct}</span>
                </div>
              </div>
            </div>

            {/* monthly breakdown table */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="px-[22px] pt-5 pb-3 flex items-center justify-between">
                <div className="text-[15px] font-semibold">Monthly breakdown</div>
                <span className="text-[12px] text-[#8A93A1]">{label}</span>
              </div>
              {/* col headers */}
              <div className="grid px-[22px] pb-2 text-[10.5px] text-[#A6ADB8] font-semibold tracking-[.03em] uppercase"
                style={{ gridTemplateColumns: CARD_COL }}>
                <span>Month</span>
                <span className="text-right">Revenue</span>
                <span className="text-right">COGS</span>
                <span className="text-right">Fees</span>
                <span className="text-right">Net</span>
                <span className="text-right">Margin</span>
              </div>
              {/* rows */}
              <div style={{ maxHeight:194, overflowY:'auto' }}>
                {tableRows.map(r => (
                  <div key={r.month} className="grid items-center px-[22px] py-[10px] border-t border-[#F4F5F7] hover:bg-[#FAFBFC] transition-colors"
                    style={{ gridTemplateColumns: CARD_COL }}>
                    <span className="text-[12.5px] font-semibold">{r.month}</span>
                    <span className="num text-right text-[12.5px] text-[#5B6470]">{r.revenue}</span>
                    <span className="num text-right text-[12.5px] text-[#5B6470]">{r.cogs}</span>
                    <span className="num text-right text-[12.5px] text-[#5B6470]">{r.fees}</span>
                    <span className="num text-right text-[12.5px] font-semibold text-[#5C8A00]">{r.net}</span>
                    <span className="num text-right text-[12.5px] text-[#5B6470]">{r.margin}</span>
                  </div>
                ))}
              </div>
              {/* totals row */}
              <div className="grid items-center px-[22px] py-3 bg-[#FAFBFC]"
                style={{ gridTemplateColumns: CARD_COL, borderTop:'1.5px solid #EEF0F4' }}>
                <span className="text-[12.5px] font-bold">Total</span>
                <span className="num text-right text-[12.5px] font-bold">{pl.revenue}</span>
                <span className="num text-right text-[12.5px] font-bold">{pl.cogs}</span>
                <span className="num text-right text-[12.5px] font-bold">{pl.fees}</span>
                <span className="num text-right text-[12.5px] font-bold text-[#5C8A00]">{pl.net}</span>
                <span className="num text-right text-[12.5px] font-bold">{pl.margin}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
