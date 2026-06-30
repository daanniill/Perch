import { supabase } from './lib/supabase'

function CheckIcon({ color = '#5C8A00' }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 6.2l2.2 2.3 4.8-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M9.5 4.5L14 9l-4.5 4.5" />
    </svg>
  );
}

function PerchLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="6" y="28" width="7" height="12" rx="2.5" fill="#E53238" />
      <rect x="16" y="22" width="7" height="18" rx="2.5" fill="#0064D2" />
      <rect x="26" y="15" width="7" height="25" rx="2.5" fill="#F5AF02" />
      <rect x="36" y="8" width="7" height="32" rx="2.5" fill="#86B817" />
    </svg>
  );
}

function Bullet({ color = '#5C8A00', bg = '#EEF5DC', children }) {
  return (
    <div className="flex items-center gap-[11px]">
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
        <CheckIcon color={color} />
      </span>
      <span className="text-[14.5px] text-[#16181D]">{children}</span>
    </div>
  );
}

function Nav({ onSignIn }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#EEF0F4]" style={{ background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-[1140px] mx-auto px-7 py-[15px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <PerchLogo />
          <span className="font-bold text-[20px] tracking-[-0.02em]">Perch</span>
        </div>
        <nav className="flex items-center gap-[30px]">
          <a href="#features" className="text-[13.5px] font-medium text-[#5B6470] hover:text-[#16181D] transition-colors">Features</a>
          <a href="#how" className="text-[13.5px] font-medium text-[#5B6470] hover:text-[#16181D] transition-colors">How it works</a>
          <a href="#pricing" className="text-[13.5px] font-medium text-[#5B6470] hover:text-[#16181D] transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-[14px]">
          <button onClick={onSignIn} className="text-[13.5px] font-semibold text-[#16181D] hover:text-[#3665F3] transition-colors">Sign in</button>
          <button onClick={onSignIn} className="text-[13.5px] font-semibold text-white bg-[#3665F3] px-4 py-[9px] rounded-[10px] hover:bg-[#2553c9] transition-colors" style={{ boxShadow: '0 1px 2px rgba(54,101,243,.4)' }}>
            Start free
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardMock() {
  return (
    <div className="mt-12 relative">
      <div className="absolute left-1/2 top-9 -translate-x-1/2 w-[78%] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(54,101,243,.16), transparent 70%)', filter: 'blur(40px)' }} />
      <div className="relative bg-white border border-[#E7ECF4] rounded-[18px_18px_0_0] overflow-hidden max-w-[1000px] mx-auto" style={{ boxShadow: '0 40px 80px -40px rgba(16,24,40,.45)' }}>
        {/* window chrome */}
        <div className="flex items-center gap-[7px] px-[18px] py-[14px] border-b border-[#F1F3F6]">
          <span className="w-[11px] h-[11px] rounded-full bg-[#E5E8EE]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#E5E8EE]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#E5E8EE]" />
          <span className="ml-[14px] text-[12px] text-[#A6ADB8]">app.perch.co/dashboard</span>
        </div>
        {/* dashboard body */}
        <div className="p-[22px] bg-[#F6F7F9]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <div className="text-[16px] font-bold">Good morning, Jordan</div>
              <div className="text-[12px] text-[#8A93A1]">Here's how the store's running today.</div>
            </div>
            <div className="flex gap-2">
              <span className="text-[12px] font-semibold text-[#16181D] bg-white border border-[#E7E9EE] px-3 py-2 rounded-[9px]">Last 30 days ▾</span>
              <span className="text-[12px] font-semibold text-white bg-[#3665F3] px-[13px] py-2 rounded-[9px]">+ New listing</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-[15px] text-left">
              <div className="text-[11.5px] text-[#8A93A1]">Net profit</div>
              <div className="num text-[24px] font-bold mt-[6px]">$8,420</div>
              <span className="inline-block text-[11px] font-semibold text-[#5C8A00] bg-[#EEF5DC] px-[7px] py-[2px] rounded-[6px] mt-[7px]">▲ 12.4%</span>
            </div>
            <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-[15px] text-left">
              <div className="text-[11.5px] text-[#8A93A1]">Profit margin</div>
              <div className="num text-[24px] font-bold mt-[6px]">31.8%</div>
              <span className="inline-block text-[11px] font-semibold text-[#5C8A00] bg-[#EEF5DC] px-[7px] py-[2px] rounded-[6px] mt-[7px]">▲ 2.1 pts</span>
            </div>
            <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-[15px] text-left">
              <div className="text-[11.5px] text-[#8A93A1]">Sell-through</div>
              <div className="num text-[24px] font-bold mt-[6px]">68%</div>
              <span className="inline-block text-[11px] font-semibold text-[#8A93A1] bg-[#F1F3F6] px-[7px] py-[2px] rounded-[6px] mt-[7px]">214 sold</span>
            </div>
            <div className="bg-[#16181D] rounded-[13px] p-[15px] text-left">
              <div className="text-[11.5px] text-[#A6ADB8]">Avg. days to sell</div>
              <div className="num text-[24px] font-bold mt-[6px] text-white">9.3</div>
              <div className="text-[11px] font-semibold text-[#86E0A8] mt-[7px]">▼ 1.2 days</div>
            </div>
          </div>
          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: '1.7fr 1fr' }}>
            <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-4 text-left">
              <div className="text-[13px] font-semibold">Profit &amp; costs</div>
              <div className="flex items-end gap-3 h-[104px] mt-[14px]">
                {[46, 54, 50, 66, 74, 86].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-[2px] h-full">
                    <div className="bg-[#3665F3] rounded-t-[3px]" style={{ height: `${h}%` }} />
                    <div className="bg-[#DCE1E8]" style={{ height: `${Math.round(h * 0.38)}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-4 text-left">
              <div className="text-[13px] font-semibold">Where fees go</div>
              <div className="flex flex-col gap-[10px] mt-[14px]">
                {[['Final value', 58, '#3665F3'], ['Promoted', 22, '#7BA0FF'], ['Shipping', 14, '#A6BDFF']].map(([label, pct, color]) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] text-[#5B6470] mb-1">
                      <span>{label}</span><span className="num">{pct}%</span>
                    </div>
                    <div className="h-[6px] bg-[#F1F3F6] rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onSignIn }) {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#F7FAFF 0%,#fff 70%)' }}>
      <div className="max-w-[1140px] mx-auto px-7 pt-16 pb-0 text-center">
        <a href="#pricing" className="inline-flex items-center gap-2 bg-white border border-[#E2E8F5] px-[7px] pl-[14px] py-[6px] rounded-full" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}>
          <span className="text-[12.5px] font-semibold text-[#16181D]">New · AI listings in your store's voice</span>
          <span className="text-[11px] font-bold text-white bg-[#3665F3] px-[9px] py-[3px] rounded-full">See more →</span>
        </a>
        <h1 className="text-[60px] leading-[1.04] font-extrabold tracking-[-0.035em] mt-6 mx-auto max-w-[840px]">
          A better eBay seller<br />dashboard.
        </h1>
        <p className="text-[18px] leading-[1.55] text-[#5B6470] max-w-[560px] mx-auto mt-5">
          eBay's seller hub is cluttered and hides what matters. Perch gives you a clear view of your whole store — real profit, sharp insights, and AI listings in seconds.
        </p>
        <div className="flex items-center justify-center gap-3 mt-[30px]">
          <button onClick={onSignIn} className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#3665F3] px-[26px] py-[14px] rounded-[13px] hover:bg-[#2553c9] transition-colors" style={{ boxShadow: '0 4px 14px -4px rgba(54,101,243,.55)' }}>
            Start free <ArrowIcon />
          </button>
          <a href="#features" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#16181D] bg-white border border-[#E2E8F5] px-6 py-[14px] rounded-[13px] hover:border-[#16181D] transition-colors">
            See how it works
          </a>
        </div>
        <div className="text-[12.5px] text-[#8A93A1] mt-4">Free to start · No card required · Connect eBay in 2 minutes</div>
        <DashboardMock />
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-t border-b border-[#F1F3F6] bg-[#FAFBFC]">
      <div className="max-w-[1140px] mx-auto px-7 py-[26px] flex items-center justify-center gap-[42px] flex-wrap">
        <span className="text-[13px] text-[#8A93A1] font-medium">Trusted by sellers moving</span>
        <span className="num text-[20px] font-extrabold tracking-[-0.02em] text-[#16181D]">$48M+ <span className="text-[13px] font-medium text-[#8A93A1]">in annual GMV</span></span>
        <span className="w-px h-6 bg-[#E7E9EE]" />
        <span className="num text-[20px] font-extrabold tracking-[-0.02em] text-[#16181D]">12,000+ <span className="text-[13px] font-medium text-[#8A93A1]">stores connected</span></span>
        <span className="w-px h-6 bg-[#E7E9EE]" />
        <span className="num text-[20px] font-extrabold tracking-[-0.02em] text-[#16181D]">4.9★ <span className="text-[13px] font-medium text-[#8A93A1]">avg. rating</span></span>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="max-w-[880px] mx-auto px-7 pt-24 text-center">
      <div className="text-[12.5px] font-bold tracking-[.08em] text-[#3665F3]">THE PROBLEM</div>
      <h2 className="text-[38px] font-extrabold tracking-[-0.03em] leading-[1.15] mt-[14px] mx-auto max-w-[680px]">
        You can't run a business on a dashboard you can't read.
      </h2>
      <p className="text-[17px] leading-[1.6] text-[#5B6470] mt-[18px] mx-auto max-w-[600px]">
        eBay's Seller Hub buries your real numbers under tabs and jargon. Fees are scattered. Profit is a guess. Knowing what to list next? Good luck. Perch fixes that.
      </p>
    </section>
  );
}

function ProfitCard() {
  const rows = [
    ['Gross revenue', '$26,480', 'text-[#16181D]', 'font-semibold'],
    ['− Cost of goods', '−$11,120', 'text-[#C8553D]', ''],
    ['− eBay fees', '−$2,890', 'text-[#C8553D]', ''],
    ['− Shipping', '−$1,590', 'text-[#C8553D]', ''],
  ];
  return (
    <div className="rounded-[18px] border border-[#E2E8F5] p-[26px]" style={{ background: 'linear-gradient(160deg,#F4F8FF,#EAF1FF)' }}>
      <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-[18px]">
        {rows.map(([label, val, valColor, labelWeight]) => (
          <div key={label} className="flex justify-between py-[9px] border-b border-[#F4F5F7]">
            <span className={`text-[13px] ${labelWeight || 'text-[#5B6470]'}`}>{label}</span>
            <span className={`num text-[13px] ${valColor} ${labelWeight}`}>{val}</span>
          </div>
        ))}
        <div className="flex justify-between pt-[13px] pb-[2px]">
          <span className="text-[14px] font-bold">Net profit</span>
          <span className="num text-[16px] font-bold text-[#5C8A00]">$8,420</span>
        </div>
        <div className="text-right text-[11.5px] text-[#8A93A1]">31.8% net margin</div>
      </div>
    </div>
  );
}

function AiListingCard() {
  return (
    <div className="rounded-[18px] border border-[#F6E2D2] p-[26px]" style={{ background: 'linear-gradient(160deg,#FFF8F1,#FFF0E4)' }}>
      <div className="bg-white border border-[#EEF0F4] rounded-[13px] p-[18px]">
        <div className="flex items-center gap-2 mb-[14px]">
          <span className="w-[22px] h-[22px] rounded-[7px] bg-[#3665F3] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2l1.7 4.3L15 8l-4.3 1.7L9 14l-1.7-4.3L3 8l4.3-1.7L9 2Z" />
            </svg>
          </span>
          <span className="text-[12px] font-bold text-[#3665F3]">DRAFTED BY PERCH</span>
        </div>
        <div className="text-[11px] text-[#A6ADB8] font-semibold">TITLE · 71/80</div>
        <div className="text-[13.5px] font-semibold leading-[1.4] mt-[5px] p-[10px] border border-[#EEF0F4] rounded-[9px]">
          Nike Air Max 90 Infrared Men's US 10 OG Colorway Running Shoes — With Box
        </div>
        <div className="flex gap-[7px] mt-3">
          <div className="flex-1 bg-[#F4F8FF] rounded-[9px] p-[9px_10px]">
            <div className="text-[10px] text-[#8A93A1]">Suggested price</div>
            <div className="num text-[15px] font-bold text-[#3665F3]">$148</div>
          </div>
          <div className="flex-1 bg-[#F6F7F9] rounded-[9px] p-[9px_10px]">
            <div className="text-[10px] text-[#8A93A1]">From comps</div>
            <div className="text-[15px] font-bold">38 sold</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-[1140px] mx-auto px-7 pt-[72px]">
      {/* Feature 1 */}
      <div className="grid grid-cols-2 gap-14 items-center py-8">
        <div>
          <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-[#5C8A00] bg-[#EEF5DC] px-3 py-[5px] rounded-full">PROFIT, NOT GUESSWORK</div>
          <h3 className="text-[30px] font-extrabold tracking-[-0.025em] leading-[1.18] mt-4">Know your real profit, after every fee.</h3>
          <p className="text-[16px] leading-[1.6] text-[#5B6470] mt-[14px]">
            Perch pulls final-value fees, promoted-listing spend, shipping labels, and cost of goods automatically — so every sale shows true profit and margin. No spreadsheets.
          </p>
          <div className="flex flex-col gap-[11px] mt-[22px]">
            <Bullet>Live profit margin &amp; net profit</Bullet>
            <Bullet>Full P&amp;L statement &amp; CSV export</Bullet>
            <Bullet>Monthly &amp; yearly profit trends</Bullet>
          </div>
        </div>
        <ProfitCard />
      </div>

      {/* Feature 2 */}
      <div className="grid grid-cols-2 gap-14 items-center py-8">
        <AiListingCard />
        <div>
          <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-[#3665F3] bg-[#EAF1FF] px-3 py-[5px] rounded-full">AI LISTINGS</div>
          <h3 className="text-[30px] font-extrabold tracking-[-0.025em] leading-[1.18] mt-4">List in seconds, in your store's voice.</h3>
          <p className="text-[16px] leading-[1.6] text-[#5B6470] mt-[14px]">
            Drop in a few photos and a quick note. Perch writes an SEO-optimized title, full description, item specifics, and a price backed by real sold comps — matched to how your store already writes.
          </p>
          <div className="flex flex-col gap-[11px] mt-[22px]">
            <Bullet color="#3665F3" bg="#EAF1FF">Titles, specifics &amp; descriptions, instantly</Bullet>
            <Bullet color="#3665F3" bg="#EAF1FF">Pricing from recent sold listings</Bullet>
            <Bullet color="#3665F3" bg="#EAF1FF">Publish straight to eBay</Bullet>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Connect your store', body: 'Securely link eBay over OAuth. Perch syncs your listings, orders, fees, and 12 months of history.' },
    { n: '02', title: 'See the full picture', body: 'Your real profit, margins, fees, and best-selling categories — clear on one calm dashboard.' },
    { n: '03', title: 'List & grow', body: 'Generate listings in seconds and act on insights about what to post next — and exactly when.' },
  ];
  return (
    <section id="how" className="bg-[#16181D] mt-20">
      <div className="max-w-[1140px] mx-auto px-7 py-20">
        <div className="text-center">
          <div className="text-[12.5px] font-bold tracking-[.08em] text-[#7BA0FF]">HOW IT WORKS</div>
          <h2 className="text-[36px] font-extrabold tracking-[-0.03em] text-white mt-[14px]">Live in three minutes.</h2>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-12">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="bg-[#1E212A] border border-[#2C2F38] rounded-[16px] p-[26px]">
              <div className="num text-[13px] font-bold text-[#7BA0FF]">{n}</div>
              <div className="text-[18px] font-bold text-white mt-3">{title}</div>
              <p className="text-[14px] leading-[1.55] text-[#A6ADB8] mt-2">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="max-w-[820px] mx-auto px-7 py-[88px] text-center">
      <div className="text-[26px] leading-[1.4] font-semibold tracking-[-0.015em]">
        "I finally know which items actually make money. Perch paid for itself the first week — and listing now takes me{' '}
        <span className="text-[#3665F3]">minutes, not hours.</span>"
      </div>
      <div className="flex items-center justify-center gap-3 mt-[26px]">
        <div className="w-[42px] h-[42px] rounded-[12px] bg-[#16181D] text-white flex items-center justify-center font-bold text-[15px]">MR</div>
        <div className="text-left">
          <div className="text-[14px] font-bold">Maya Rivera</div>
          <div className="text-[12.5px] text-[#8A93A1]">Full-time reseller · 4,200+ sales</div>
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const plans = [
    { name: 'Free', price: '$0', desc: 'Basic dashboard, 25 listings, 3 AI listings / month.', highlight: false },
    { name: 'Pro', price: '$15', desc: 'Full profit analytics, unlimited AI listings, best-time insights.', highlight: true },
    { name: 'Business', price: '$39', desc: 'Up to 5 stores, bulk tools, team seats, accounting export.', highlight: false },
  ];
  return (
    <section id="pricing" className="bg-[#FAFBFC] border-t border-[#F1F3F6]">
      <div className="max-w-[1140px] mx-auto px-7 py-20 text-center">
        <h2 className="text-[36px] font-extrabold tracking-[-0.03em]">Start free. Upgrade when it pays off.</h2>
        <p className="text-[16px] text-[#5B6470] mt-[14px] mx-auto max-w-[480px]">Every plan includes a 14-day Pro trial. Cancel anytime.</p>
        <div className="grid grid-cols-3 gap-[18px] mt-10 text-left max-w-[920px] mx-auto">
          {plans.map(({ name, price, desc, highlight }) => (
            <div
              key={name}
              className="bg-white rounded-[16px] p-6"
              style={{
                border: highlight ? '2px solid #3665F3' : '1px solid #EEF0F4',
                boxShadow: highlight ? '0 14px 40px -20px rgba(54,101,243,.5)' : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold">{name}</span>
                {highlight && <span className="text-[10.5px] font-bold text-white bg-[#3665F3] px-2 py-[2px] rounded-full">POPULAR</span>}
              </div>
              <div className="flex items-baseline gap-[3px] mt-[10px]">
                <span className="num text-[32px] font-extrabold">{price}</span>
                <span className="text-[13px] text-[#8A93A1]">/mo</span>
              </div>
              <p className="text-[13px] text-[#5B6470] mt-[10px] leading-[1.5]">{desc}</p>
            </div>
          ))}
        </div>
        <a href="#pricing" className="inline-flex items-center gap-[7px] mt-[30px] text-[14px] font-semibold text-[#3665F3]">
          Compare all features <span>→</span>
        </a>
      </div>
    </section>
  );
}

function FinalCTA({ onSignIn }) {
  return (
    <section className="max-w-[1140px] mx-auto px-7 py-[88px]">
      <div className="relative rounded-[24px] p-16 text-center overflow-hidden" style={{ background: 'linear-gradient(140deg,#2553c9,#3665F3)' }}>
        {/* decorative bars */}
        <div className="absolute right-[-40px] bottom-[-50px] flex items-end gap-3 opacity-[.22] pointer-events-none">
          {[110, 170, 240, 320].map((h, i) => (
            <div key={i} className="w-[30px] rounded-[9px] bg-white" style={{ height: h }} />
          ))}
        </div>
        <h2 className="relative text-[40px] font-extrabold tracking-[-0.03em] text-white leading-[1.12]">See your whole store clearly.</h2>
        <p className="relative text-[17px] text-white/85 mt-4 mx-auto max-w-[480px]">Connect eBay in two minutes and watch your real numbers appear.</p>
        <div className="relative flex items-center justify-center gap-3 mt-[30px]">
          <button onClick={onSignIn} className="inline-flex items-center gap-2 text-[15px] font-bold text-[#16181D] bg-white px-7 py-[14px] rounded-[13px] hover:bg-[#EAEBEF] transition-colors">
            Start free
          </button>
          <a href="#pricing" className="inline-flex items-center text-[15px] font-semibold text-white border border-white/50 px-6 py-[14px] rounded-[13px] hover:bg-white/10 transition-colors">
            View pricing
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ onSignIn }) {
  return (
    <footer className="border-t border-[#F1F3F6]">
      <div className="max-w-[1140px] mx-auto px-7 py-10 flex items-center justify-between flex-wrap gap-5">
        <div className="flex items-center gap-[10px]">
          <PerchLogo size={22} />
          <span className="font-bold text-[17px]">Perch</span>
          <span className="text-[12.5px] text-[#A6ADB8] ml-[6px]">A better eBay seller dashboard</span>
        </div>
        <div className="flex gap-[26px]">
          <a href="#features" className="text-[13px] text-[#5B6470] hover:text-[#16181D] transition-colors">Features</a>
          <a href="#pricing" className="text-[13px] text-[#5B6470] hover:text-[#16181D] transition-colors">Pricing</a>
          <button onClick={onSignIn} className="text-[13px] text-[#5B6470] hover:text-[#16181D] transition-colors">Sign up</button>
          <button onClick={onSignIn} className="text-[13px] text-[#5B6470] hover:text-[#16181D] transition-colors">Sign in</button>
        </div>
        <div className="text-[12px] text-[#A6ADB8]">© 2026 Perch · Not affiliated with eBay Inc.</div>
      </div>
    </footer>
  );
}

export default function PerchLanding({ onNavigate }) {
  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="bg-white overflow-x-hidden">
      <Nav onSignIn={handleSignIn} />
      <Hero onSignIn={handleSignIn} />
      <TrustStrip />
      <Problem />
      <Features />
      <HowItWorks />
      <Testimonial />
      <PricingTeaser />
      <FinalCTA onSignIn={handleSignIn} />
      <Footer onSignIn={handleSignIn} />
    </div>
  );
}
