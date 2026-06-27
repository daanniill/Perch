import { useState, useEffect, useRef } from 'react'

// ── constants ─────────────────────────────────────────────────────────────────

const STEP_NAMES = { 1: 'Create account', 2: 'Connect eBay', 3: 'Sync', 4: 'Preferences', 5: 'All set' }

const CATS = ['Sneakers', 'Electronics', 'Apparel', 'Toys & Games', 'Home', 'Collectibles']

const VOICES = [
  { key: 'friendly',     label: 'Friendly',     desc: 'Warm, casual' },
  { key: 'professional', label: 'Professional', desc: 'Clean, factual' },
  { key: 'punchy',       label: 'Punchy',       desc: 'Short, bold' },
]

const SYNC_ITEMS = [
  { label: 'Importing 315 listings',           threshold: 26 },
  { label: 'Pulling 1,240 orders & sales',     threshold: 55 },
  { label: 'Calculating fees & payouts',        threshold: 82 },
  { label: 'Crunching returns & metrics',       threshold: 100 },
]

// ── small helpers ─────────────────────────────────────────────────────────────

function PerchLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="6"  y="28" width="7" height="12" rx="2.5" fill="#E53238"/>
      <rect x="16" y="22" width="7" height="18" rx="2.5" fill="#0064D2"/>
      <rect x="26" y="15" width="7" height="25" rx="2.5" fill="#F5AF02"/>
      <rect x="36" y="8"  width="7" height="32" rx="2.5" fill="#86B817"/>
    </svg>
  )
}

function CheckCircle({ color = '#5C8A00', bg = '#EEF5DC', size = 20 }) {
  return (
    <span className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: bg }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
      </svg>
    </span>
  )
}

function Spinner({ size = 16, borderColor = 'rgba(255,255,255,.4)', topColor = '#fff' }) {
  return (
    <span className="inline-block rounded-full shrink-0" style={{
      width: size, height: size,
      border: `2px solid ${borderColor}`,
      borderTopColor: topColor,
      animation: 'spin .7s linear infinite',
    }}/>
  )
}

// ── left brand panel ──────────────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div
      className="w-[42%] max-w-[560px] shrink-0 relative overflow-hidden flex flex-col p-[44px_48px]"
      style={{ background: 'linear-gradient(165deg,#F4F8FF 0%,#EAF1FF 100%)' }}
    >
      {/* decorative bars */}
      <div className="absolute right-[-60px] bottom-[-50px] flex items-end gap-[14px] opacity-50 pointer-events-none">
        {[{ h: 130, c: '#E53238' }, { h: 200, c: '#0064D2' }, { h: 280, c: '#F5AF02' }, { h: 360, c: '#86B817' }].map(({ h, c }) => (
          <div key={c} className="w-[34px] rounded-[10px] opacity-50" style={{ height: h, background: c }}/>
        ))}
      </div>

      {/* logo */}
      <div className="flex items-center gap-[11px] relative">
        <PerchLogo />
        <span className="font-bold text-[24px] tracking-[-0.02em]">Perch</span>
      </div>

      {/* copy */}
      <div className="flex-1 flex flex-col justify-center relative max-w-[380px]">
        <div className="text-[34px] font-bold leading-[1.15] tracking-[-0.025em]">
          See your whole store from one calm place.
        </div>
        <div className="text-[15px] text-[#5B6470] leading-[1.55] mt-4">
          A better eBay seller dashboard — real profit after every fee, AI listings in seconds, and insights on what to list next.
        </div>

        <div className="flex flex-col gap-[14px] mt-8">
          {['Know your real profit, after every fee', 'Generate eBay-ready listings in seconds', 'Spot what to list, and exactly when'].map(t => (
            <div key={t} className="flex items-center gap-[11px]">
              <span className="w-[22px] h-[22px] rounded-full bg-[#3665F3] flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
                </svg>
              </span>
              <span className="text-[14px] text-[#16181D] font-medium">{t}</span>
            </div>
          ))}
        </div>

        {/* testimonial */}
        <div className="mt-9 rounded-[14px] p-[16px_18px] border border-white" style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(4px)' }}>
          <div className="text-[13.5px] text-[#3A3F47] leading-[1.5] italic">
            "I finally know which items actually make money. Listing takes me minutes now."
          </div>
          <div className="text-[12.5px] text-[#8A93A1] mt-2 font-semibold">— Maya R. · 4,200+ sales</div>
        </div>
      </div>
    </div>
  )
}

// ── step 1: create account ────────────────────────────────────────────────────

function Step1({ onNext }) {
  const [form, setForm] = useState({ name: 'Jordan Fields', email: 'jordan@example.com', pw: '................', pw2: '................' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>
      <div className="text-[23px] font-bold tracking-[-0.02em]">Create your account</div>
      <div className="text-[13px] text-[#8A93A1] mt-[3px]">Free to start — no card required.</div>

      {/* Google */}
      <button className="w-full mt-[13px] flex items-center justify-center gap-[10px] bg-white border border-[#E0E3E9] font-semibold text-[14px] py-[9px] rounded-[11px] cursor-pointer text-[#16181D] hover:bg-[#FAFBFC] hover:border-[#CFD5DE] transition-colors" style={{ fontFamily: 'inherit' }}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z"/>
          <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18Z"/>
          <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3Z"/>
          <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6Z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-[10px] text-[#B6BCC6] text-[12px]">
        <div className="flex-1 h-px bg-[#EEF0F4]"/>or<div className="flex-1 h-px bg-[#EEF0F4]"/>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: 'Full name',         key: 'name', type: 'text' },
          { label: 'Email',             key: 'email', type: 'email' },
          { label: 'Password',          key: 'pw',   type: 'password' },
          { label: 'Confirm password',  key: 'pw2',  type: 'password' },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <div className="text-[12px] font-semibold text-[#5B6470] mb-1">{label}</div>
            <input
              type={type}
              value={form[key]}
              onChange={set(key)}
              className="w-full border border-[#E0E3E9] rounded-[10px] px-[13px] py-[10px] text-[14px] outline-none focus:border-[#3665F3] focus:ring-[3px] focus:ring-[rgba(54,101,243,.12)] transition-all"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        ))}
      </div>

      <button onClick={onNext} className="w-full mt-[14px] text-white font-semibold text-[14.5px] py-3 rounded-[12px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.3)' }}>
        Create account
      </button>
      <div className="text-center text-[12.5px] text-[#A6ADB8] mt-[10px]">
        Already have an account? <span className="text-[#3665F3] font-semibold cursor-pointer">Sign in</span>
      </div>
    </div>
  )
}

// ── step 2: connect ebay ──────────────────────────────────────────────────────

function Step2({ onNext, onBack }) {
  const [connecting, setConnecting] = useState(false)
  const timerRef = useRef(null)

  function handleConnect() {
    if (connecting) return
    setConnecting(true)
    timerRef.current = setTimeout(() => { setConnecting(false); onNext() }, 1300)
  }
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const perms = [
    { label: 'View your active & sold listings',      bg: '#EEF5DC', color: '#5C8A00', plus: false },
    { label: 'Read order, shipping & return details', bg: '#EEF5DC', color: '#5C8A00', plus: false },
    { label: 'Read fees & payouts to calculate profit', bg: '#EEF5DC', color: '#5C8A00', plus: false },
    { label: 'Create & manage listings on your behalf', bg: '#EAF1FF', color: '#3665F3', plus: true },
  ]

  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>
      <div className="text-[26px] font-bold tracking-[-0.02em]">Connect your eBay store</div>
      <div className="text-[14px] text-[#8A93A1] mt-[6px] leading-[1.5]">Perch reads your store data through eBay's secure connection. We never see your password.</div>

      <div className="border border-[#EEF0F4] rounded-[14px] p-[20px] mt-[22px]" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
        <div className="text-[12px] font-semibold text-[#8A93A1] tracking-[.03em]">PERCH WILL BE ABLE TO</div>
        <div className="flex flex-col gap-[13px] mt-[14px]">
          {perms.map(({ label, bg, color, plus }) => (
            <div key={label} className="flex items-center gap-[11px]">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
                {plus
                  ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><path d="M6 2.5v7M2.5 6h7"/></svg>
                  : <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.2 2.3 4.8-5"/></svg>
                }
              </span>
              <span className="text-[13.5px] text-[#16181D]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleConnect} className="w-full mt-5 flex items-center justify-center gap-[11px] text-white font-semibold text-[14.5px] py-[14px] rounded-[12px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.3)' }}>
        {connecting && <Spinner />}
        <span className="flex gap-[3px] items-center">
          {[['#E53238'], ['#fff'], ['#F5AF02'], ['#86B817']].map(([c], i) => (
            <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: c }}/>
          ))}
        </span>
        {connecting ? 'Connecting…' : 'Connect eBay account'}
      </button>

      <div className="flex items-center justify-center gap-[6px] mt-[14px] text-[#A6ADB8] text-[12px]">
        <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#A6ADB8" strokeWidth="1.5"><rect x="3.5" y="8" width="11" height="7" rx="1.5"/><path d="M5.5 8V6a3.5 3.5 0 0 1 7 0v2"/></svg>
        Secured by eBay OAuth · disconnect anytime
      </div>
      <div className="text-center mt-[18px]">
        <span onClick={onBack} className="text-[12.5px] text-[#8A93A1] cursor-pointer">← Back</span>
      </div>
    </div>
  )
}

// ── step 3: syncing ───────────────────────────────────────────────────────────

function Step3({ onDone }) {
  const [pct, setPct] = useState(0)
  const ivRef = useRef(null)
  const tRef  = useRef(null)

  useEffect(() => {
    let done = false
    ivRef.current = setInterval(() => {
      setPct(p => {
        const next = p + 3
        if (next >= 100) {
          clearInterval(ivRef.current)
          if (!done) { done = true; tRef.current = setTimeout(onDone, 700) }
          return 100
        }
        return next
      })
    }, 80)
    return () => { clearInterval(ivRef.current); clearTimeout(tRef.current) }
  // onDone is stable: it closes over setStep which React guarantees is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let prev = 0
  const items = SYNC_ITEMS.map(it => {
    const done   = pct >= it.threshold
    const active = !done && pct >= prev
    const pending = !done && !active
    prev = it.threshold
    return { ...it, done, active, pending, color: pending ? '#A6ADB8' : '#16181D', bg: active ? '#F7F9FC' : 'transparent' }
  })

  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#5C8A00] bg-[#EEF5DC] px-[9px] py-1 rounded-full flex items-center gap-[5px]">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#5C8A00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.2 2.3 4.8-5"/></svg>
          Connected · Jordan's Finds
        </span>
      </div>
      <div className="text-[26px] font-bold tracking-[-0.02em] mt-[14px]">Syncing your store…</div>
      <div className="text-[14px] text-[#8A93A1] mt-[6px]">This usually takes under a minute. Hang tight.</div>

      <div className="flex items-center gap-[14px] mt-[26px]">
        <div className="num text-[34px] font-bold w-[74px]">{pct}%</div>
        <div className="flex-1 h-[8px] bg-[#EEF0F4] rounded-full overflow-hidden">
          <div className="h-full bg-[#3665F3] rounded-full transition-all duration-100" style={{ width: `${pct}%` }}/>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-6">
        {items.map(({ label, done, active, pending, color, bg }) => (
          <div key={label} className="flex items-center gap-3 px-[13px] py-[11px] rounded-[11px] transition-colors" style={{ background: bg }}>
            {done    && <CheckCircle color="#fff" bg="#5C8A00" />}
            {active  && <Spinner borderColor="rgba(54,101,243,.3)" topColor="#3665F3" />}
            {pending && <span className="w-5 h-5 rounded-full border-2 border-[#DDE2E9] shrink-0"/>}
            <span className="text-[13.5px] font-medium" style={{ color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── step 4: preferences ───────────────────────────────────────────────────────

function Step4({ onNext, onBack }) {
  const [cats,  setCats]  = useState({ Sneakers: true, Electronics: true })
  const [voice, setVoice] = useState('friendly')
  const [goal,  setGoal]  = useState(5000)

  function toggleCat(name) {
    setCats(c => { const n = { ...c }; n[name] ? delete n[name] : (n[name] = true); return n })
  }

  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>
      <div className="text-[26px] font-bold tracking-[-0.02em]">A few quick preferences</div>
      <div className="text-[14px] text-[#8A93A1] mt-[6px]">So Perch tailors insights and writes in your voice.</div>

      {/* categories */}
      <div className="mt-[22px]">
        <div className="text-[12.5px] font-semibold text-[#5B6470] mb-2">What do you mostly sell?</div>
        <div className="flex flex-wrap gap-2">
          {CATS.map(name => {
            const active = !!cats[name]
            return (
              <button
                key={name}
                onClick={() => toggleCat(name)}
                className="px-[15px] py-[9px] rounded-full text-[13px] font-semibold cursor-pointer transition-all"
                style={{
                  fontFamily: 'inherit',
                  background: active ? '#EAF1FF' : '#fff',
                  border: `1.5px solid ${active ? '#3665F3' : '#E7E9EE'}`,
                  color: active ? '#3665F3' : '#5B6470',
                }}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {/* goal slider */}
      <div className="mt-[22px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12.5px] font-semibold text-[#5B6470]">Monthly profit goal</span>
          <span className="num text-[14px] font-bold text-[#3665F3]">${goal.toLocaleString()}/mo</span>
        </div>
        <input
          type="range" min="500" max="20000" step="500"
          value={goal}
          onChange={e => setGoal(+e.target.value)}
          className="w-full accent-[#3665F3]"
        />
      </div>

      {/* voice */}
      <div className="mt-[22px]">
        <div className="text-[12.5px] font-semibold text-[#5B6470] mb-2">Listing writing style</div>
        <div className="flex gap-2">
          {VOICES.map(({ key, label, desc }) => {
            const active = voice === key
            return (
              <button
                key={key}
                onClick={() => setVoice(key)}
                className="flex-1 text-left px-[14px] py-3 rounded-[12px] cursor-pointer transition-all"
                style={{
                  fontFamily: 'inherit',
                  background: active ? '#EAF1FF' : '#fff',
                  border: `1.5px solid ${active ? '#3665F3' : '#E7E9EE'}`,
                  color: active ? '#16181D' : '#5B6470',
                }}
              >
                <div className="text-[13px] font-semibold">{label}</div>
                <div className="text-[11px] opacity-70 mt-[2px]">{desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-[10px] mt-[26px]">
        <button onClick={onBack} className="bg-white border border-[#E0E3E9] text-[#5B6470] font-semibold text-[14px] px-5 py-[13px] rounded-[12px] cursor-pointer hover:border-[#16181D] hover:text-[#16181D] transition-colors" style={{ fontFamily: 'inherit' }}>Back</button>
        <button onClick={onNext} className="flex-1 text-white font-semibold text-[14.5px] py-[13px] rounded-[12px] cursor-pointer hover:bg-[#2553c9] transition-colors" style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.3)' }}>Continue</button>
      </div>
    </div>
  )
}

// ── step 5: done ──────────────────────────────────────────────────────────────

function Step5({ onGoToDashboard }) {
  return (
    <div className="text-center" style={{ animation: 'fadeUp .35s ease' }}>
      <div className="w-16 h-16 rounded-full bg-[#EEF5DC] flex items-center justify-center mx-auto">
        <svg width="32" height="32" viewBox="0 0 12 12" fill="none" stroke="#5C8A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
        </svg>
      </div>
      <div className="text-[27px] font-bold tracking-[-0.02em] mt-5">You're all set, Jordan</div>
      <div className="text-[14px] text-[#8A93A1] mt-2 leading-[1.55] max-w-[380px] mx-auto">
        Jordan's Finds is connected and synced. Your dashboard is ready with real numbers.
      </div>

      <div className="grid grid-cols-3 gap-[10px] mt-[26px]">
        {[['315', 'listings'], ['1,240', 'orders synced'], ['12mo', 'of history']].map(([val, label]) => (
          <div key={label} className="border border-[#EEF0F4] rounded-[12px] p-[14px]">
            <div className="num text-[22px] font-bold">{val}</div>
            <div className="text-[11.5px] text-[#8A93A1] mt-[2px]">{label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onGoToDashboard}
        className="w-full mt-[26px] flex items-center justify-center gap-2 text-white font-semibold text-[14.5px] py-[14px] rounded-[12px] cursor-pointer hover:bg-[#2553c9] transition-colors"
        style={{ background: '#3665F3', border: 'none', fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(54,101,243,.3)' }}
      >
        Go to my dashboard
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9h10M9.5 4.5L14 9l-4.5 4.5"/>
        </svg>
      </button>
    </div>
  )
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function PerchOnboarding({ onNavigate }) {
  const [step, setStep] = useState(1)

  const next = () => setStep(s => Math.min(5, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))
  const toDashboard = () => onNavigate?.('dashboard') ?? (window.location.hash = '#/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-white" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>

      <BrandPanel />

      {/* right panel */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* progress */}
        <div className="px-12 pt-[30px]">
          <div className="flex items-center justify-between">
            <div className="text-[12.5px] font-semibold text-[#8A93A1]">
              Step {step} of 5 · <span className="text-[#3665F3]">{STEP_NAMES[step]}</span>
            </div>
            <div className="text-[12.5px] text-[#A6ADB8] cursor-pointer">Need help?</div>
          </div>
          <div className="h-[5px] bg-[#EEF0F4] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#3665F3] rounded-full transition-all duration-400"
              style={{ width: `${step / 5 * 100}%` }}
            />
          </div>
        </div>

        {/* step content */}
        <div className="flex-1 flex flex-col justify-start px-12 py-[14px] pb-6 max-w-[520px] w-full mx-auto">
          {step === 1 && <Step1 onNext={next} />}
          {step === 2 && <Step2 onNext={next} onBack={back} />}
          {step === 3 && <Step3 onDone={next} />}
          {step === 4 && <Step4 onNext={next} onBack={back} />}
          {step === 5 && <Step5 onGoToDashboard={toDashboard} />}
        </div>
      </div>
    </div>
  )
}
