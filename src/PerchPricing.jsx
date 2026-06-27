import { useState } from 'react'

// ── data ─────────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  'Connect 1 eBay store',
  'Basic dashboard (revenue & orders)',
  'Up to 25 active listings tracked',
  '3 AI listings per month',
  'Last 30 days of history',
]
const PRO_FEATURES = [
  'Full profit analytics & margins',
  'Fee breakdown & payout tracking',
  'Best-time-to-list insights',
  'Unlimited AI listings in your voice',
  'Sell-through & returns analytics',
  '24 months of history & exports',
]
const BIZ_FEATURES = [
  'Connect up to 5 stores',
  'Bulk listing & repricing tools',
  'Team seats & roles',
  'Tax-ready CSV / accounting export',
  'Priority support',
]

const COMPARE_ROWS = [
  { label:'eBay stores connected',   free:'1',       pro:'1',         biz:'5'        },
  { label:'AI listings / month',     free:'3',       pro:'∞',         biz:'∞'        },
  { label:'Active listings tracked', free:'25',      pro:'∞',         biz:'∞'        },
  { label:'History & trends',        free:'30 days', pro:'24 months', biz:'24 months'},
  { label:'Profit & margin analytics',free:'no',     pro:'yes',       biz:'yes'      },
  { label:'Fee & payout breakdown',  free:'no',      pro:'yes',       biz:'yes'      },
  { label:'Best-time-to-list',       free:'no',      pro:'yes',       biz:'yes'      },
  { label:'Store-voice AI writing',  free:'no',      pro:'yes',       biz:'yes'      },
  { label:'Bulk tools & repricing',  free:'no',      pro:'no',        biz:'yes'      },
  { label:'Accounting export',       free:'no',      pro:'no',        biz:'yes'      },
  { label:'Team seats',              free:'no',      pro:'no',        biz:'yes'      },
]

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
  const item = (icon, label, onClick) => (
    <div key={label} onClick={onClick}
      className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] text-[13.5px] font-medium text-[#5B6470] cursor-pointer hover:bg-[#ECEEF1] transition-colors">
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
        {item(<svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/><rect x="10.1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="1.5" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="10.1" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/></svg>, 'Dashboard', () => onNavigate?.('dashboard'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>, 'Listings', () => onNavigate?.('listings'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>, 'Create listing', () => onNavigate?.('listing-generator'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', () => onNavigate?.('analytics'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', () => onNavigate?.('finances'))}
      </nav>
      <div className="flex-1"/>
      {/* upgrade nudge — special for pricing page */}
      <div className="bg-[#16181D] rounded-[14px] p-[15px] mb-3">
        <div className="flex items-center gap-[7px]">
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#F5AF02" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/></svg>
          <span className="text-[12.5px] font-bold text-white">You're on Free</span>
        </div>
        <div className="text-[11.5px] text-[#A6ADB8] leading-[1.45] mt-[7px]">Unlock profit analytics, unlimited AI listings &amp; more.</div>
        <div className="text-[11px] text-[#8A93A1] mt-[9px]">Trial ends in <span className="text-white font-semibold">9 days</span></div>
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

// ── feature check / dash / text cell ─────────────────────────────────────────

function Cell({ v, accent }) {
  if (v === 'yes') {
    return (
      <div className="flex justify-center">
        <span className="inline-flex w-5 h-5 rounded-full items-center justify-center"
          style={{ background: accent ? '#EAF1FF' : '#EEF5DC' }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            stroke={accent ? '#3665F3' : '#5C8A00'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
          </svg>
        </span>
      </div>
    )
  }
  if (v === 'no') {
    return <div className="flex justify-center text-[#C4CBD4] text-[16px] font-semibold">–</div>
  }
  return (
    <div className="flex justify-center">
      <span className="num text-[13px] font-semibold" style={{ color: accent ? '#3665F3' : '#16181D' }}>{v}</span>
    </div>
  )
}

// ── feature list item ─────────────────────────────────────────────────────────

function Feature({ text, accent = false, dark = false }) {
  const bg     = dark ? 'rgba(245,175,2,.16)' : accent ? '#EAF1FF' : '#EEF5DC'
  const stroke = dark ? '#F5AF02' : accent ? '#3665F3' : '#5C8A00'
  return (
    <div className="flex items-start gap-[10px]">
      <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[1px]" style={{ background: bg }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
        </svg>
      </span>
      <span className="text-[13px] leading-[1.4]" style={{ color: dark ? '#EAEBEF' : accent ? '#16181D' : '#3A3F47' }}>{text}</span>
    </div>
  )
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function PerchPricing({ onNavigate }) {
  const [billing, setBilling] = useState('yearly')
  const yearly = billing === 'yearly'

  const proPrice = yearly ? '$15' : '$19'
  const proSub   = yearly ? 'billed $180/year' : 'billed monthly'
  const bizPrice = yearly ? '$39' : '$49'
  const bizSub   = yearly ? 'billed $468/year' : 'billed monthly'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily:"'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-[30px] py-[40px] pb-[56px] max-w-[1180px] mx-auto">

          {/* ── hero ── */}
          <div className="text-center">
            <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[#3665F3] bg-[#EAF1FF] px-3 py-[5px] rounded-full">
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/>
              </svg>
              Plans &amp; pricing
            </div>
            <div className="text-[32px] font-bold tracking-[-0.025em] mt-4">Run your store like a business</div>
            <div className="text-[15px] text-[#5B6470] mt-2 max-w-[520px] mx-auto leading-[1.5]">
              Start free. Upgrade when you want the full picture — real profit, deeper insights, and unlimited AI listings.
            </div>

            {/* billing toggle */}
            <div className="inline-flex items-center gap-3 mt-6">
              <span className="text-[13.5px] font-semibold" style={{ color: yearly ? '#A6ADB8' : '#16181D' }}>Monthly</span>
              <div
                onClick={() => setBilling(b => b === 'yearly' ? 'monthly' : 'yearly')}
                className="relative cursor-pointer rounded-full"
                style={{ width:48, height:27, background:'#3665F3' }}>
                <span className="absolute top-[3px] w-[21px] h-[21px] rounded-full bg-white transition-all duration-200"
                  style={{ left: yearly ? 24 : 3 }}/>
              </div>
              <span className="text-[13.5px] font-semibold" style={{ color: yearly ? '#16181D' : '#A6ADB8' }}>Yearly</span>
              <span className="text-[11.5px] font-bold text-[#5C8A00] bg-[#EEF5DC] px-[9px] py-1 rounded-full">Save 20%</span>
            </div>
          </div>

          {/* ── plan cards ── */}
          <div className="grid gap-[18px] mt-[34px] items-start" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>

            {/* Free */}
            <div className="bg-white border border-[#EEF0F4] rounded-[18px] p-[26px]" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="text-[16px] font-bold">Free</div>
              <div className="text-[13px] text-[#8A93A1] mt-1" style={{ minHeight:36 }}>For trying Perch and casual selling.</div>
              <div className="flex items-baseline gap-1 mt-[14px]">
                <span className="num text-[38px] font-bold">$0</span>
                <span className="text-[13px] text-[#8A93A1]">/mo</span>
              </div>
              <div style={{ height:18 }}/>
              <div className="w-full bg-white border border-[#E0E3E9] text-[#5B6470] font-semibold text-[13.5px] py-3 rounded-[11px] text-center">
                Your current plan
              </div>
              <div className="h-px bg-[#EEF0F4] my-[22px]"/>
              <div className="flex flex-col gap-3">
                {FREE_FEATURES.map(f => <Feature key={f} text={f} />)}
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-[18px] p-[26px] relative" style={{ border:'2px solid #3665F3', boxShadow:'0 14px 40px -18px rgba(54,101,243,.45)' }}>
              <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#3665F3] text-white text-[11px] font-bold tracking-[.04em] px-[14px] py-[5px] rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[16px] font-bold">Pro</div>
                <span className="text-[10.5px] font-bold text-[#3665F3] bg-[#EAF1FF] px-[7px] py-[2px] rounded-[5px]">FOR SELLERS</span>
              </div>
              <div className="text-[13px] text-[#8A93A1] mt-1" style={{ minHeight:36 }}>For active sellers who want real numbers.</div>
              <div className="flex items-baseline gap-1 mt-[14px]">
                <span className="num text-[38px] font-bold">{proPrice}</span>
                <span className="text-[13px] text-[#8A93A1]">/mo</span>
              </div>
              <div className="text-[12px] text-[#8A93A1]" style={{ height:18 }}>{proSub}</div>
              <button className="w-full mt-[2px] text-white font-semibold text-[13.5px] py-3 rounded-[11px] cursor-pointer hover:bg-[#2553c9] transition-colors"
                style={{ background:'#3665F3', border:'none', fontFamily:'inherit', boxShadow:'0 2px 6px rgba(54,101,243,.32)' }}>
                Upgrade to Pro
              </button>
              <div className="h-px bg-[#EEF0F4] my-[22px]"/>
              <div className="text-[11.5px] font-semibold text-[#8A93A1] mb-3">Everything in Free, plus:</div>
              <div className="flex flex-col gap-3">
                {PRO_FEATURES.map(f => <Feature key={f} text={f} accent />)}
              </div>
            </div>

            {/* Business */}
            <div className="rounded-[18px] p-[26px]" style={{ background:'#16181D', border:'1px solid #16181D', boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
              <div className="flex items-center gap-2">
                <div className="text-[16px] font-bold text-white">Business</div>
                <span className="text-[10.5px] font-bold text-[#F5AF02] px-[7px] py-[2px] rounded-[5px]" style={{ background:'rgba(245,175,2,.14)' }}>SCALE</span>
              </div>
              <div className="text-[13px] text-[#9aa3b0] mt-1" style={{ minHeight:36 }}>For full-time resellers &amp; brands.</div>
              <div className="flex items-baseline gap-1 mt-[14px]">
                <span className="num text-[38px] font-bold text-white">{bizPrice}</span>
                <span className="text-[13px] text-[#9aa3b0]">/mo</span>
              </div>
              <div className="text-[12px] text-[#8A93A1]" style={{ height:18 }}>{bizSub}</div>
              <button className="w-full mt-[2px] bg-white text-[#16181D] font-semibold text-[13.5px] py-3 rounded-[11px] cursor-pointer hover:bg-[#EAEBEF] transition-colors"
                style={{ border:'none', fontFamily:'inherit' }}>
                Upgrade to Business
              </button>
              <div className="h-px my-[22px]" style={{ background:'#2C2F36' }}/>
              <div className="text-[11.5px] font-semibold text-[#8A93A1] mb-3">Everything in Pro, plus:</div>
              <div className="flex flex-col gap-3">
                {BIZ_FEATURES.map(f => <Feature key={f} text={f} dark />)}
              </div>
            </div>
          </div>

          {/* ── comparison table ── */}
          <div className="mt-[44px] bg-white border border-[#EEF0F4] rounded-[18px] overflow-hidden" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>
            <div className="px-[26px] py-[22px] border-b border-[#F1F3F6]">
              <div className="text-[17px] font-bold">Compare every feature</div>
            </div>
            {/* col headers */}
            <div className="grid items-center px-[26px] py-[13px] border-b border-[#F1F3F6] bg-[#FAFBFC]"
              style={{ gridTemplateColumns:'1.6fr 1fr 1fr 1fr' }}>
              <span className="text-[12px] font-semibold text-[#8A93A1]">Feature</span>
              <span className="text-center text-[13px] font-bold">Free</span>
              <span className="text-center text-[13px] font-bold text-[#3665F3]">Pro</span>
              <span className="text-center text-[13px] font-bold">Business</span>
            </div>
            {COMPARE_ROWS.map(row => (
              <div key={row.label} className="grid items-center px-[26px] py-[13px] border-b border-[#F4F5F7] hover:bg-[#FAFBFC] transition-colors"
                style={{ gridTemplateColumns:'1.6fr 1fr 1fr 1fr' }}>
                <span className="text-[13px] text-[#3A3F47] font-medium">{row.label}</span>
                <Cell v={row.free} />
                <Cell v={row.pro} accent />
                <Cell v={row.biz} />
              </div>
            ))}
          </div>

          {/* footer note */}
          <div className="text-center mt-7 text-[12.5px] text-[#A6ADB8]">
            All plans include a 14-day Pro trial · Cancel anytime · Prices in USD
          </div>

        </div>
      </main>
    </div>
  )
}
