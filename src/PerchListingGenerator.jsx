import { useState, useRef, useEffect } from 'react'

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

function Spinner({ size = 15, light = true }) {
  const border = light ? 'rgba(255,255,255,.4)' : 'rgba(54,101,243,.3)'
  const top    = light ? '#fff' : '#3665F3'
  return (
    <span className="inline-block rounded-full shrink-0" style={{
      width: size, height: size,
      border: `2px solid ${border}`,
      borderTopColor: top,
      animation: 'spin .7s linear infinite',
    }}/>
  )
}

const SHIMMER = {
  background: 'linear-gradient(90deg,#EEF0F4 25%,#F8F9FB 37%,#EEF0F4 63%)',
  backgroundSize: '300% 100%',
  animation: 'shimmer 1.4s ease infinite',
}

function Shimmer({ h = 14, w = '100%', rounded = 8 }) {
  return <div style={{ height: h, width: w, borderRadius: rounded, ...SHIMMER }}/>
}

// ── sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  const link = (icon, label, active) => (
    <div key={label} className="flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] text-[13.5px] cursor-pointer transition-colors"
      style={active ? { background: '#EAF1FF', color: '#3665F3', fontWeight: 600 } : { color: '#5B6470', fontWeight: 500 }}>
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
        {link(<svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/><rect x="10.1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="1.5" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1" opacity=".5"/><rect x="10.1" y="10.1" width="6.4" height="6.4" rx="1.6" fill="#8A93A1"/></svg>, 'Dashboard', false)}
        {link(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>, 'Listings', false)}
        {link(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>, 'Create listing', true)}
        {link(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', false)}
        {link(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', false)}
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

// ── left input panel ──────────────────────────────────────────────────────────

function InputPanel({ onGenerate, phase }) {
  const [note, setNote] = useState("Nike Air Max 90, Infrared colorway, men's US 10. Worn a few times, great condition, comes with the original box.")
  const isGenerating = phase === 'generating'
  const isDone = phase === 'done'

  const label = isGenerating ? 'Generating…' : isDone ? 'Generate again' : 'Generate listing'

  return (
    <div className="flex flex-col gap-4">
      {/* photos */}
      <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-5" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
        <div className="flex items-center gap-[9px] mb-[14px]">
          <span className="w-5 h-5 rounded-[6px] bg-[#16181D] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
          <span className="text-[14px] font-semibold">Photos</span>
          <span className="text-[12px] text-[#A6ADB8]">— first photo becomes the cover</span>
        </div>
        {/* cover slot */}
        <div className="rounded-[12px] overflow-hidden h-[210px] flex flex-col items-center justify-center gap-[6px]"
          style={{ background: 'repeating-linear-gradient(45deg,#EEF1F5,#EEF1F5 9px,#E6EAF0 9px,#E6EAF0 18px)' }}>
          <svg width="30" height="30" viewBox="0 0 18 18" fill="none" stroke="#AEB6C2" strokeWidth="1.3">
            <rect x="2" y="3.5" width="14" height="11" rx="2"/>
            <circle cx="6.4" cy="7.4" r="1.5"/>
            <path d="M2.6 13l3.8-3.7 2.4 2.2 3.2-3 3 2.9"/>
          </svg>
          <span className="font-mono text-[11px] text-[#9aa3b0]">cover photo · 1600×1600</span>
        </div>
        {/* thumbs */}
        <div className="grid grid-cols-4 gap-[10px] mt-[10px]">
          {[2, 3, 4].map(n => (
            <div key={n} className="aspect-square rounded-[10px] flex items-center justify-center"
              style={{ background: 'repeating-linear-gradient(45deg,#EEF1F5,#EEF1F5 7px,#E6EAF0 7px,#E6EAF0 14px)' }}>
              <span className="font-mono text-[9px] text-[#9aa3b0]">{n}</span>
            </div>
          ))}
          <div className="aspect-square rounded-[10px] border-[1.5px] border-dashed border-[#CFD5DE] flex flex-col items-center justify-center gap-[3px] cursor-pointer text-[#8A93A1] hover:border-[#3665F3] hover:text-[#3665F3] transition-colors">
            <span className="text-[18px] leading-none">+</span>
            <span className="text-[9.5px] font-semibold">Add</span>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="bg-white border border-[#EEF0F4] rounded-[16px] p-5" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
        <div className="flex items-center gap-[9px] mb-[14px]">
          <span className="w-5 h-5 rounded-[6px] bg-[#16181D] text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
          <span className="text-[14px] font-semibold">Quick details</span>
          <span className="text-[12px] text-[#A6ADB8]">— a sentence or two is plenty</span>
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full resize-none border border-[#E7E9EE] rounded-[11px] px-[14px] py-[13px] text-[13.5px] leading-[1.5] text-[#16181D] outline-none focus:border-[#3665F3] focus:ring-[3px] focus:ring-[rgba(54,101,243,.12)] transition-all"
          style={{ height: 96, fontFamily: 'inherit' }}
        />

        <div className="grid grid-cols-2 gap-3 mt-[14px]">
          <div>
            <div className="text-[11.5px] text-[#8A93A1] font-semibold mb-[6px]">Condition</div>
            <div className="flex items-center justify-between border border-[#E7E9EE] rounded-[10px] px-3 py-[10px] text-[13px] cursor-pointer">
              Pre-owned — Good <span className="text-[#A6ADB8]">▾</span>
            </div>
          </div>
          <div>
            <div className="text-[11.5px] text-[#8A93A1] font-semibold mb-[6px]">Category</div>
            <div className="flex items-center justify-between border border-[#E7E9EE] rounded-[10px] px-3 py-[10px] text-[13px] cursor-pointer">
              <span className="flex items-center gap-[7px]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#3665F3]"/>Auto-detected
              </span>
              <span className="text-[#8A93A1]">▾</span>
            </div>
          </div>
        </div>

        {/* style match toggle */}
        <div className="flex items-center gap-2 mt-[14px] px-[13px] py-[11px] bg-[#F7F9FC] rounded-[10px]">
          <div className="w-[30px] h-[18px] rounded-full bg-[#3665F3] relative shrink-0">
            <span className="absolute top-[2px] right-[2px] w-[14px] h-[14px] rounded-full bg-white"/>
          </div>
          <span className="text-[12.5px] text-[#5B6470]">
            Match my store's writing style <span className="text-[#16181D] font-semibold">(Jordan's Finds)</span>
          </span>
        </div>

        <button
          onClick={onGenerate}
          className="w-full mt-4 flex items-center justify-center gap-[9px] text-white font-semibold text-[14px] py-[14px] rounded-[12px] cursor-pointer hover:bg-[#2553c9] transition-colors"
          style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.32)' }}
        >
          {isGenerating && <Spinner />}
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 1.8l1.7 4.3L15 7.8l-4.3 1.7L9 13.8 7.3 9.5 3 7.8l4.3-1.7L9 1.8Z"/>
          </svg>
          {label}
        </button>
      </div>
    </div>
  )
}

// ── right output states ───────────────────────────────────────────────────────

function IdleState() {
  return (
    <div className="h-[620px] flex flex-col items-center justify-center text-center px-10">
      <div className="flex items-end gap-[5px] mb-[22px]">
        {[[26,'#E53238'],[40,'#0064D2'],[54,'#F5AF02'],[68,'#86B817']].map(([h,c]) => (
          <span key={c} className="w-[11px] rounded-[3px] opacity-85" style={{ height: h, background: c }}/>
        ))}
      </div>
      <div className="text-[17px] font-bold">Your listing will appear here</div>
      <div className="text-[13.5px] text-[#8A93A1] leading-[1.55] max-w-[340px] mt-2">
        Perch writes an optimized title, full description, item specifics, and a price backed by real sold comps — ready to publish to eBay.
      </div>
      <div className="flex gap-2 mt-[22px] flex-wrap justify-center">
        {['SEO title','Item specifics','Price from comps'].map(t => (
          <span key={t} className="text-[11.5px] text-[#5B6470] bg-[#F1F3F6] px-[11px] py-[5px] rounded-full">{t}</span>
        ))}
      </div>
    </div>
  )
}

function GeneratingState() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-[9px] text-[#3665F3] text-[13px] font-semibold mb-5">
        <Spinner light={false} />
        Writing your listing &amp; pricing from 38 sold comps…
      </div>
      <Shimmer h={30} w="78%" rounded={8}/>
      <div className="mt-[14px]"><Shimmer h={14} w="40%" rounded={6}/></div>
      <div className="grid grid-cols-3 gap-[10px] mt-[22px]">
        <Shimmer h={54} rounded={10}/>
        <Shimmer h={54} rounded={10}/>
        <Shimmer h={54} rounded={10}/>
      </div>
      <div className="mt-[18px]"><Shimmer h={96} rounded={10}/></div>
      <div className="mt-[18px]"><Shimmer h={120} rounded={10}/></div>
    </div>
  )
}

function DoneState({ onRegenerate }) {
  const specifics = [
    ['Brand','Nike'],['Model','Air Max 90'],['US Size','10'],
    ['Colorway','Infrared'],['Dept.','Men\'s'],['Category','Athletic Shoes'],
  ]
  const keywords = ['air max 90','infrared','OG colorway','men\'s sneakers','deadstock']

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[#F1F3F6]">
        <div className="flex items-center gap-[9px]">
          <span className="text-[15px] font-bold">Generated listing</span>
          <span className="text-[11px] font-semibold text-[#5C8A00] bg-[#EEF5DC] px-[9px] py-[3px] rounded-full">✓ Matched store voice</span>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-[6px] bg-white border border-[#E7E9EE] text-[#5B6470] font-semibold text-[12.5px] px-3 py-[7px] rounded-[9px] cursor-pointer hover:border-[#3665F3] hover:text-[#3665F3] transition-colors"
          style={{ fontFamily: 'inherit' }}
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M15 9a6 6 0 1 1-1.8-4.2M15 3v3h-3"/>
          </svg>
          Regenerate
        </button>
      </div>

      <div className="p-[22px] flex flex-col gap-[18px]">
        {/* title */}
        <div>
          <div className="flex items-center justify-between mb-[7px]">
            <span className="text-[11.5px] font-semibold text-[#8A93A1] tracking-[.03em]">TITLE</span>
            <span className="num text-[11px] text-[#5C8A00] font-semibold">71 / 80</span>
          </div>
          <div className="text-[15.5px] font-semibold leading-[1.4] border border-[#E7E9EE] rounded-[11px] px-[14px] py-[13px]">
            Nike Air Max 90 Infrared Men's US 10 OG Colorway Running Shoes — With Box
          </div>
        </div>

        {/* item specifics */}
        <div>
          <span className="text-[11.5px] font-semibold text-[#8A93A1] tracking-[.03em]">ITEM SPECIFICS</span>
          <div className="grid grid-cols-3 gap-2 mt-[9px]">
            {specifics.map(([label, val]) => (
              <div key={label} className="border border-[#EEF0F4] rounded-[10px] px-[11px] py-[9px]">
                <div className="text-[10.5px] text-[#A6ADB8]">{label}</div>
                <div className="text-[13px] font-semibold mt-[2px]">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* suggested price */}
        <div className="rounded-[13px] px-[18px] py-4 flex items-center justify-between" style={{ background: 'linear-gradient(180deg,#F2F6FF,#EAF1FF)', border: '1px solid #D6E3FF' }}>
          <div>
            <div className="text-[11.5px] font-semibold text-[#3665F3] tracking-[.03em]">SUGGESTED PRICE</div>
            <div className="flex items-baseline gap-[9px] mt-1">
              <span className="num text-[30px] font-bold">$148</span>
              <span className="num text-[12.5px] text-[#5B6470]">range $132–$165</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] text-[#5B6470]">from <span className="font-bold text-[#16181D]">38 sold comps</span></div>
            <div className="text-[11.5px] text-[#8A93A1] mt-[2px]">last 90 days · ~9 days to sell</div>
          </div>
        </div>

        {/* description */}
        <div>
          <div className="flex items-center justify-between mb-[7px]">
            <span className="text-[11.5px] font-semibold text-[#8A93A1] tracking-[.03em]">DESCRIPTION</span>
            <button className="text-[11px] text-[#3665F3] font-semibold cursor-pointer bg-transparent border-none" style={{ fontFamily: 'inherit' }}>Copy</button>
          </div>
          <div className="border border-[#E7E9EE] rounded-[11px] px-[15px] py-[15px] text-[13px] leading-[1.6] text-[#3A3F47]">
            <p className="m-0 mb-[10px]">
              Authentic Nike Air Max 90 in the iconic <strong>"Infrared"</strong> colorway, men's US 10. A grail-status classic with the visible Air cushioning that started it all — clean lines, premium materials, and that unmistakable red pop.
            </p>
            <p className="m-0 mb-2 font-semibold text-[#16181D]">Condition &amp; details:</p>
            <ul className="m-0 mb-[10px] pl-[18px]">
              <li className="mb-1">Pre-owned, worn only a handful of times — clean uppers, plenty of life left in the soles.</li>
              <li className="mb-1">Includes original box.</li>
              <li>Ships fast &amp; secure within 1 business day.</li>
            </ul>
            <p className="m-0">Any questions, just message me — happy to send more photos. Thanks for checking out Jordan's Finds! 👟</p>
          </div>
        </div>

        {/* meta row */}
        <div className="flex gap-[10px]">
          <div className="flex-1 border border-[#EEF0F4] rounded-[10px] px-[13px] py-[11px]">
            <div className="text-[10.5px] text-[#A6ADB8]">Suggested shipping</div>
            <div className="text-[12.5px] font-semibold mt-[3px]">USPS Priority · ~$9.20</div>
          </div>
          <div className="flex-1 border border-[#EEF0F4] rounded-[10px] px-[13px] py-[11px]">
            <div className="text-[10.5px] text-[#A6ADB8]">Listing health</div>
            <div className="text-[12.5px] font-semibold mt-[3px] text-[#5C8A00]">Strong — ready to post</div>
          </div>
        </div>

        {/* keywords */}
        <div className="flex flex-wrap gap-[7px]">
          {keywords.map(k => (
            <span key={k} className="text-[11.5px] text-[#5B6470] bg-[#F1F3F6] px-[10px] py-[5px] rounded-full">{k}</span>
          ))}
        </div>

        {/* actions */}
        <div className="flex gap-[10px] pt-1">
          <button className="flex-1 bg-white border border-[#E7E9EE] text-[#5B6470] font-semibold text-[13px] py-3 rounded-[11px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors" style={{ fontFamily: 'inherit' }}>
            Save as draft
          </button>
          <button className="flex-[2] flex items-center justify-center gap-2 text-white font-semibold text-[13px] py-3 rounded-[11px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.32)' }}>
            Publish to eBay
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h10M9.5 4.5L14 9l-4.5 4.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function PerchListingGenerator() {
  const [phase, setPhase] = useState('idle') // idle | generating | done
  const timerRef = useRef(null)

  function handleGenerate() {
    clearTimeout(timerRef.current)
    setPhase('generating')
    timerRef.current = setTimeout(() => setPhase('done'), 1700)
  }
  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:100% 0; } 100% { background-position:-100% 0; } }
      `}</style>

      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-4 border-b border-[#EAEBEF]" style={{ background: 'rgba(246,247,249,.85)', backdropFilter: 'blur(8px)' }}>
          <div>
            <div className="text-[21px] font-bold tracking-[-0.02em]">Create a listing</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">Add photos and a quick note — Perch writes the rest, in your store's voice.</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[12.5px] text-[#8A93A1]">Draft auto-saved</div>
            <div className="w-[34px] h-[34px] rounded-[9px] bg-[#16181D] text-white flex items-center justify-center font-semibold text-[12.5px]">JF</div>
          </div>
        </header>

        <div className="px-[30px] pb-14 pt-6 max-w-[1320px]">
          <div className="grid gap-[18px] items-start" style={{ gridTemplateColumns: '0.92fr 1.12fr' }}>

            <InputPanel onGenerate={handleGenerate} phase={phase} />

            {/* output card */}
            <div className="bg-white border border-[#EEF0F4] rounded-[16px] min-h-[620px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
              {phase === 'idle'       && <IdleState />}
              {phase === 'generating' && <GeneratingState />}
              {phase === 'done'       && <DoneState onRegenerate={handleGenerate} />}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
