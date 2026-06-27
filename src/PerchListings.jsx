import { useState } from 'react'

// ── data ─────────────────────────────────────────────────────────────────────

const LISTINGS = [
  { id:'1',  name:'Nike Air Max 90 Infrared',       cat:'Sneakers',    sku:'SNK-1042', price:'$148', status:'active', views:312, watchers:24, age:'7d'      },
  { id:'2',  name:'Sony WH-1000XM4 Headphones',     cat:'Electronics', sku:'ELC-0388', price:'$189', status:'active', views:540, watchers:31, age:'12d'     },
  { id:'3',  name:"Vintage Levi's 501 — W34",       cat:'Apparel',     sku:'APP-0211', price:'$72',  status:'sold',   views:198, watchers:12, age:'sold 3d' },
  { id:'4',  name:'Lego Star Wars 75192 (Sealed)',   cat:'Toys',        sku:'TOY-0907', price:'$640', status:'active', views:88,  watchers:41, age:'21d'     },
  { id:'5',  name:'Carhartt Detroit Jacket — L',     cat:'Apparel',     sku:'APP-0233', price:'$96',  status:'unsold', views:64,  watchers:3,  age:'30d'     },
  { id:'6',  name:'iPhone 13 128GB — Unlocked',      cat:'Electronics', sku:'ELC-0401', price:'$415', status:'active', views:720, watchers:58, age:'2d'      },
  { id:'7',  name:'Patagonia Better Sweater — M',    cat:'Apparel',     sku:'APP-0240', price:'$58',  status:'draft',  views:0,   watchers:0,  age:'—'       },
  { id:'8',  name:'Nintendo Switch OLED',            cat:'Electronics', sku:'ELC-0415', price:'$268', status:'active', views:410, watchers:36, age:'5d'      },
  { id:'9',  name:'Air Jordan 1 Mid — Black/White',  cat:'Sneakers',    sku:'SNK-1051', price:'$132', status:'sold',   views:256, watchers:19, age:'sold 6d' },
  { id:'10', name:'Polaroid OneStep Camera',         cat:'Electronics', sku:'ELC-0420', price:'$74',  status:'active', views:120, watchers:9,  age:'9d'      },
  { id:'11', name:'Vintage Band Tee — XL',           cat:'Apparel',     sku:'APP-0251', price:'$45',  status:'draft',  views:0,   watchers:0,  age:'—'       },
  { id:'12', name:'Pokémon Booster Box (Sealed)',    cat:'Toys',        sku:'TOY-0912', price:'$390', status:'active', views:612, watchers:73, age:'4d'      },
]

const STATUS = {
  active: { label:'Active', color:'#3665F3', bg:'#EAF1FF' },
  sold:   { label:'Sold',   color:'#5C8A00', bg:'#EEF5DC' },
  draft:  { label:'Draft',  color:'#8A93A1', bg:'#F1F3F6' },
  unsold: { label:'Ended',  color:'#B45309', bg:'#FBEDD9' },
}

const TAB_DEFS = [['all','All'],['active','Active'],['sold','Sold'],['draft','Drafts'],['unsold','Ended']]

// ── sidebar ───────────────────────────────────────────────────────────────────

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
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3665F3" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="3" width="14" height="3.2" rx="1"/><rect x="2" y="9" width="14" height="3.2" rx="1"/><line x1="2" y1="15" x2="10" y2="15"/></svg>, 'Listings', true)}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><line x1="9" y1="5.6" x2="9" y2="12.4"/><line x1="5.6" y1="9" x2="12.4" y2="9"/></svg>, 'Create listing', false, () => onNavigate?.('listing-generator'))}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="15" x2="3" y2="9"/><line x1="9" y1="15" x2="9" y2="4"/><line x1="15" y1="15" x2="15" y2="11"/></svg>, 'Analytics', false)}
        {item(<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.2"/><path d="M9 5.4v7.2M11 6.6c-.6-.7-1.4-1-2.2-1-1 0-1.9.6-1.9 1.6 0 2.3 4.2 1.2 4.2 3.5 0 1-.9 1.7-2.1 1.7-.9 0-1.7-.3-2.3-1"/></svg>, 'Finances', false)}
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

// ── checkbox ──────────────────────────────────────────────────────────────────

function Checkbox({ checked, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="w-[17px] h-[17px] rounded-[5px] flex items-center justify-center"
        style={checked ? { background:'#3665F3', border:'1px solid #3665F3' } : { background:'#fff', border:'1px solid #CFD5DE' }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
          </svg>
        )}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

const COL = '28px minmax(150px,1fr) 80px 90px 110px 74px 30px'

export default function PerchListings({ onNavigate }) {
  const [tab, setTab]           = useState('all')
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState({})

  const toggle = (id) => setSelected(s => {
    const n = { ...s }
    if (n[id]) delete n[id]; else n[id] = true
    return n
  })
  const clearSel = () => setSelected({})

  const visible = LISTINGS.filter(l =>
    (tab === 'all' || l.status === tab) &&
    (query === '' || l.name.toLowerCase().includes(query) ||
      l.cat.toLowerCase().includes(query) || l.sku.toLowerCase().includes(query))
  )

  const allChecked = visible.length > 0 && visible.every(l => selected[l.id])
  const toggleAll  = () => setSelected(s => {
    const n = { ...s }
    if (allChecked) visible.forEach(l => delete n[l.id])
    else            visible.forEach(l => n[l.id] = true)
    return n
  })

  const selectedCount = Object.keys(selected).length
  const counts = { all: LISTINGS.length }
  for (const l of LISTINGS) counts[l.status] = (counts[l.status] || 0) + 1

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily:"'Libre Franklin', sans-serif" }}>
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        {/* header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 px-[30px] py-4 border-b border-[#EAEBEF]"
          style={{ background:'rgba(246,247,249,.85)', backdropFilter:'blur(8px)' }}>
          <div>
            <div className="text-[21px] font-bold tracking-[-0.02em]">Listings</div>
            <div className="text-[12.5px] text-[#8A93A1] mt-[1px]">
              7 active · <span className="num">$1,733</span> inventory value · 251 watchers ·{' '}
              <span className="text-[#B45309] font-semibold">2 ending soon</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('listing-generator')}
            className="flex items-center gap-[7px] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] cursor-pointer hover:bg-[#2553c9] transition-colors"
            style={{ background:'#3665F3', border:'none', fontFamily:'inherit', boxShadow:'0 1px 2px rgba(54,101,243,.4)' }}
          >
            <span className="text-[16px] leading-none" style={{ marginTop:-1 }}>+</span> New listing
          </button>
        </header>

        <div className="px-[30px] pb-12 pt-[22px] max-w-[1320px]">
          {/* toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* tabs */}
            <div className="inline-flex gap-1 bg-[#ECEEF1] p-1 rounded-[11px]">
              {TAB_DEFS.map(([key, label]) => {
                const active = tab === key
                return (
                  <button key={key} onClick={() => setTab(key)}
                    className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-[8px] text-[12.5px] font-semibold cursor-pointer transition-all"
                    style={{
                      border: 'none', fontFamily: 'inherit',
                      background: active ? '#fff' : 'transparent',
                      color: active ? '#16181D' : '#8A93A1',
                      boxShadow: active ? '0 1px 2px rgba(16,24,40,.14)' : 'none',
                    }}>
                    {label} <span style={{ opacity:.6 }}>{counts[key] || 0}</span>
                  </button>
                )
              })}
            </div>

            {/* search + sort */}
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center gap-2 bg-white border border-[#E7E9EE] rounded-[9px] px-[11px] py-2" style={{ width:230 }}>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="8" cy="8" r="5.4"/><line x1="12.2" y1="12.2" x2="15.5" y2="15.5"/>
                </svg>
                <input
                  placeholder="Search listings…"
                  value={query}
                  onChange={e => setQuery(e.target.value.toLowerCase())}
                  className="border-none outline-none text-[12.5px] w-full text-[#16181D] bg-transparent"
                  style={{ fontFamily:'inherit' }}
                />
              </div>
              <div className="flex items-center gap-[7px] bg-white border border-[#E7E9EE] rounded-[9px] px-3 py-2 text-[12.5px] text-[#5B6470] cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#8A93A1" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M2 4h14M5 9h8M7 14h4"/>
                </svg>
                Sort: Newest
              </div>
            </div>
          </div>

          {/* table card */}
          <div className="bg-white border border-[#EEF0F4] rounded-[16px] overflow-hidden" style={{ boxShadow:'0 1px 2px rgba(16,24,40,.03)' }}>

            {/* bulk bar */}
            {selectedCount > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#D6E3FF]" style={{ background:'#EAF1FF' }}>
                <div className="flex items-center gap-[14px]">
                  <span className="text-[13px] font-semibold text-[#3665F3]">{selectedCount} selected</span>
                  <span className="text-[12.5px] text-[#3665F3] opacity-55">|</span>
                  {['Promote','Edit price','End listing'].map(a => (
                    <button key={a} className="bg-transparent border-none font-semibold text-[12.5px] text-[#3665F3] cursor-pointer p-0" style={{ fontFamily:'inherit' }}>{a}</button>
                  ))}
                  <button className="bg-transparent border-none font-semibold text-[12.5px] text-[#E53238] cursor-pointer p-0" style={{ fontFamily:'inherit' }}>Delete</button>
                </div>
                <button onClick={clearSel} className="bg-transparent border-none font-semibold text-[12.5px] text-[#5B6470] cursor-pointer" style={{ fontFamily:'inherit' }}>Clear</button>
              </div>
            )}

            {/* column headers */}
            <div className="grid items-center px-5 py-[11px] border-b border-[#F1F3F6] text-[11px] text-[#A6ADB8] font-semibold tracking-[.04em] uppercase"
              style={{ gridTemplateColumns: COL }}>
              <Checkbox checked={allChecked} onClick={toggleAll} />
              <span>Item</span>
              <span className="text-right">Price</span>
              <span className="pl-[14px]">Status</span>
              <span className="text-right">Engagement</span>
              <span className="text-right">Listed</span>
              <span/>
            </div>

            {/* rows */}
            {visible.map(l => {
              const checked = !!selected[l.id]
              const st = STATUS[l.status]
              return (
                <div key={l.id}
                  className="grid items-center px-5 py-3 border-b border-[#F1F3F6] hover:bg-[#FAFBFC] transition-colors"
                  style={{ gridTemplateColumns: COL }}>

                  <Checkbox checked={checked} onClick={() => toggle(l.id)} />

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-[42px] h-[42px] rounded-[9px] shrink-0 flex items-center justify-center"
                      style={{ background:'repeating-linear-gradient(45deg,#EEF1F5,#EEF1F5 6px,#E6EAF0 6px,#E6EAF0 12px)' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C4CBD4" strokeWidth="1.4">
                        <rect x="2" y="3" width="14" height="12" rx="2"/>
                        <circle cx="6.4" cy="7" r="1.4"/>
                        <path d="M3 13l3.5-3.4 2.3 2.1 3-2.8 3.2 3"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold truncate">{l.name}</div>
                      <div className="text-[11.5px] text-[#9aa3b0]">
                        <span className="num">{l.sku}</span> · {l.cat}
                      </div>
                    </div>
                  </div>

                  <div className="num text-right text-[13px] font-semibold">{l.price}</div>

                  <div className="pl-[14px]">
                    <span className="text-[11px] font-semibold px-[9px] py-[3px] rounded-[6px]"
                      style={{ color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#5B6470]">
                    {l.views > 0 ? (
                      <div className="flex gap-3 justify-end items-center">
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.5">
                            <path d="M1.5 9S4 4 9 4s7.5 5 7.5 5-2.5 5-7.5 5S1.5 9 1.5 9Z"/><circle cx="9" cy="9" r="2.1"/>
                          </svg>
                          <span className="num">{l.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.5">
                            <path d="M9 15S2.5 11 2.5 6.6A3.1 3.1 0 0 1 9 5a3.1 3.1 0 0 1 6.5 1.6C15.5 11 9 15 9 15Z"/>
                          </svg>
                          <span className="num">{l.watchers}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-right text-[#C4CBD4]">—</div>
                    )}
                  </div>

                  <div className="num text-right text-[12.5px] text-[#8A93A1]">{l.age}</div>

                  <div className="text-right text-[#B6BCC6] font-bold cursor-pointer tracking-[1px]">···</div>
                </div>
              )
            })}

            {/* empty state */}
            {visible.length === 0 && (
              <div className="py-[54px] text-center text-[#8A93A1]">
                <div className="text-[14px] font-semibold text-[#5B6470]">No listings match</div>
                <div className="text-[12.5px] mt-1">Try a different tab or search term.</div>
              </div>
            )}

            {/* footer */}
            <div className="flex items-center justify-between px-5 py-[13px] bg-[#FAFBFC]">
              <span className="text-[12px] text-[#8A93A1]">
                Showing <span className="num font-semibold text-[#16181D]">{visible.length}</span> of <span className="num">12</span> listings
              </span>
              <div className="flex gap-[6px]">
                {['‹','›'].map(ch => (
                  <div key={ch} className="w-[30px] h-[30px] rounded-[8px] border border-[#E7E9EE] flex items-center justify-center text-[13px] text-[#C4CBD4] bg-white cursor-pointer">
                    {ch}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
