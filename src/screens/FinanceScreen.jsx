import { useState } from 'react'

/* ── Sparkline ────────────────────────────────────────────── */
function Spark({ data, color, w=80, h=26 }) {
  const max=Math.max(...data), min=Math.min(...data), r=max-min||1
  const pts=data.map((v,i)=>`${((i/(data.length-1))*w).toFixed(1)},${(h-((v-min)/r)*(h-4)-2).toFixed(1)}`).join(' ')
  const [lx,ly]=pts.split(' ').at(-1).split(',')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
      <circle cx={lx} cy={ly} r="2.5" fill={color}/>
    </svg>
  )
}

/* ── Finance models
     NOTE: Revenue & Expenses are line items inside P&L detail.
           Workforce Planning & Sales Forecasting are dedicated tiles.
   ────────────────────────────────────────────────────────────── */
const MODELS = [
  {
    id:'pl', accent:'#059669', glow:'#059669',
    grad:'linear-gradient(145deg,#059669,#10b981)',
    label:'P&L Statement', module:'Income',
    kpi:'$68.3k', kpiLabel:'Revenue MTD',
    kpi2:'79%', kpi2Label:'Net Margin',
    status:'Profitable', ok:true,
    spark:[40,45,42,55,58,54,62,68,65,72],
    detail:{
      kpis:[
        { l:'Revenue',       v:'$68,300', c:'#059669' },
        { l:'Gross Profit',  v:'$61,200', c:'#0f172a' },
        { l:'Expenses',      v:'$14,300', c:'#ef4444' },
        { l:'Net Income',    v:'$54,000', c:'#059669' },
      ],
      tableTitle:'Income Statement — May 2026',
      rows:[
        { l:'Revenue',                  v:'$68,300' },
        { l:'  SaaS Subscriptions',     v:'$42,000' },
        { l:'  Consulting',             v:'$18,300' },
        { l:'  Professional Services',  v:'$8,000'  },
        { l:'Cost of Revenue',          v:'($7,100)' },
        { l:'Gross Profit',             v:'$61,200', h:true },
        { l:'Salaries & Benefits',      v:'($8,200)' },
        { l:'Software & Tools',         v:'($2,100)' },
        { l:'Marketing',                v:'($2,800)' },
        { l:'G&A',                      v:'($1,200)' },
        { l:'Total Operating Expenses', v:'($14,300)', h:true },
        { l:'Net Income',               v:'$54,000',  h:true },
      ],
    },
  },
  {
    id:'bs', accent:'#2563eb', glow:'#2563eb',
    grad:'linear-gradient(145deg,#1d4ed8,#60a5fa)',
    label:'Balance Sheet', module:'Assets',
    kpi:'$142k', kpiLabel:'Total Assets',
    kpi2:'$98k', kpi2Label:'Total Equity',
    status:'Strong', ok:true,
    spark:[80,88,92,98,102,108,115,120,132,142],
    detail:{
      kpis:[
        { l:'Total Assets',      v:'$142,000', c:'#2563eb' },
        { l:'Current Assets',    v:'$89,000',  c:'#0f172a' },
        { l:'Total Liabilities', v:'$44,000',  c:'#ef4444' },
        { l:'Total Equity',      v:'$98,000',  c:'#059669' },
      ],
      tableTitle:'Balance Sheet — May 2026',
      rows:[
        { l:'Cash & Equivalents',  v:'$54,000' },
        { l:'Accounts Receivable', v:'$28,000' },
        { l:'Fixed Assets (net)',  v:'$53,000' },
        { l:'Other Assets',        v:'$7,000'  },
        { l:'Total Assets',        v:'$142,000', h:true },
        { l:'Accounts Payable',    v:'$12,000' },
        { l:'Deferred Revenue',    v:'$18,000' },
        { l:'Long-term Debt',      v:'$14,000' },
        { l:'Total Liabilities',   v:'$44,000',  h:true },
        { l:'Total Equity',        v:'$98,000',  h:true },
      ],
    },
  },
  {
    id:'cf', accent:'#0284c7', glow:'#0284c7',
    grad:'linear-gradient(145deg,#0369a1,#38bdf8)',
    label:'Cash Flow', module:'Treasury',
    kpi:'$54k', kpiLabel:'Operating CF',
    kpi2:'14 mo', kpi2Label:'Cash Runway',
    status:'Healthy', ok:true,
    spark:[30,38,35,42,40,48,46,52,50,54],
    detail:{
      kpis:[
        { l:'Operating CF',   v:'$54,000',  c:'#0284c7' },
        { l:'Investing CF',   v:'($6,000)', c:'#ef4444' },
        { l:'Free Cash Flow', v:'$48,000',  c:'#059669' },
        { l:'Cash Runway',    v:'14 mo',    c:'#0f172a' },
      ],
      tableTitle:'Cash Flow — May 2026',
      rows:[
        { l:'Net Income',            v:'$54,000' },
        { l:'Depreciation',          v:'$1,200'  },
        { l:'Working Capital Chg',   v:'($1,200)' },
        { l:'Net Operating CF',      v:'$54,000',  h:true },
        { l:'Capital Expenditures',  v:'($6,000)' },
        { l:'Net Investing CF',      v:'($6,000)', h:true },
        { l:'Loan Repayments',       v:'($2,000)' },
        { l:'Net Financing CF',      v:'($2,000)', h:true },
        { l:'Net Change in Cash',    v:'$46,000',  h:true },
      ],
    },
  },
  {
    id:'workforce', accent:'#7c3aed', glow:'#7c3aed',
    grad:'linear-gradient(145deg,#6d28d9,#a78bfa)',
    label:'Workforce Planning', module:'HR & People',
    kpi:'12 FTE', kpiLabel:'Total Headcount',
    kpi2:'$28k', kpi2Label:'Monthly Payroll',
    status:'Growing', ok:true,
    spark:[6,7,7,8,8,9,10,10,11,12],
    detail:{
      kpis:[
        { l:'Headcount',       v:'12 FTE',  c:'#7c3aed' },
        { l:'Monthly Payroll', v:'$28,000', c:'#ef4444' },
        { l:'Utilization',     v:'87%',     c:'#059669' },
        { l:'Cost/Employee',   v:'$2,333',  c:'#0f172a' },
      ],
      tableTitle:'Workforce by Department — May 2026',
      rows:[
        { l:'Engineering',       v:'4 FTE · $12,000/mo' },
        { l:'Sales & BD',        v:'2 FTE · $7,000/mo'  },
        { l:'Product & Design',  v:'2 FTE · $5,500/mo'  },
        { l:'Operations',        v:'2 FTE · $4,000/mo'  },
        { l:'Finance & Admin',   v:'2 FTE · $3,500/mo'  },
        { l:'Total Headcount',   v:'12 FTE',     h:true  },
        { l:'Total Payroll',     v:'$28,000/mo', h:true  },
        { l:'Projected Q3',      v:'14 FTE',     h:true  },
      ],
    },
  },
  {
    id:'sales', accent:'#ea580c', glow:'#ea580c',
    grad:'linear-gradient(145deg,#c2410c,#fb923c)',
    label:'Sales Forecasting', module:'Revenue',
    kpi:'$82k', kpiLabel:'Active Pipeline',
    kpi2:'38%', kpi2Label:'Win Rate',
    status:'On Track', ok:true,
    spark:[20,28,32,30,38,42,40,48,45,50],
    detail:{
      kpis:[
        { l:'Active Pipeline',   v:'$82,000', c:'#ea580c' },
        { l:'Won This Quarter',  v:'$50,000', c:'#059669' },
        { l:'Avg Deal Size',     v:'$13,667', c:'#0f172a' },
        { l:'Win Rate',          v:'38%',     c:'#0f172a' },
      ],
      tableTitle:'Sales Pipeline — Q2 2026',
      rows:[
        { l:'TechCorp Ltd',       v:'$12,000' },
        { l:'GreenPath Inc',      v:'$8,500'  },
        { l:'Nova Studios',       v:'$22,000' },
        { l:'BlueSky Retail',     v:'$35,000' },
        { l:'Vertex Logistics',   v:'$5,000'  },
        { l:'Total Pipeline',     v:'$82,500', h:true },
        { l:'Weighted (×38%)',    v:'$31,350', h:true },
        { l:'Q3 Target',          v:'$120,000',h:true },
      ],
    },
  },
  {
    id:'budget', accent:'#64748b', glow:'#64748b',
    grad:'linear-gradient(145deg,#334155,#64748b)',
    label:'Budget vs Actual', module:'Planning',
    kpi:'Q2 2026', kpiLabel:'Current Period',
    kpi2:'Soon', kpi2Label:'In Development',
    status:'Coming Soon', ok:null,
    spark:[50,50,50,50,50,50,50,50,50,50],
    detail:null,
  },
]

/* ── Glass Model Tile ─────────────────────────────────────── */
function ModelTile({ accent, glow, grad, label, module, kpi, kpiLabel, kpi2, kpi2Label, status, ok, spark, detail, onOpen }) {
  const canOpen = !!detail
  return (
    <button
      onClick={canOpen ? onOpen : undefined}
      className="text-left rounded-2xl relative overflow-hidden w-full transition-all active:scale-[.97]"
      style={{
        cursor: canOpen ? 'pointer' : 'default',
        opacity: canOpen ? 1 : 0.6,
        background: 'rgba(255,255,255,.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,.95)',
        boxShadow: `0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04), inset 0 1px 0 #fff`,
      }}
    >
      {/* Colored accent top strip */}
      <div style={{ height:3, background:`linear-gradient(90deg,${accent},${accent}66)` }}/>

      {/* Subtle tint overlay */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:64, background:`linear-gradient(180deg,${glow}0d 0%,transparent 100%)`, pointerEvents:'none' }}/>

      <div className="p-4" style={{ position:'relative', zIndex:1 }}>
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="eyebrow">{module}</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginTop:3, lineHeight:1.2 }}>{label}</p>
          </div>
          {ok !== null && (
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:'0.06em', padding:'3px 8px', borderRadius:99,
              background: ok ? 'rgba(5,150,105,.10)' : 'rgba(251,191,36,.12)',
              color: ok ? '#059669' : '#d97706',
              border: `1px solid ${ok ? 'rgba(5,150,105,.20)' : 'rgba(251,191,36,.25)'}`,
            }}>{status}</span>
          )}
        </div>

        {/* Primary KPI */}
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800, color:accent, letterSpacing:'-0.04em', lineHeight:1 }}>{kpi}</p>
        <p style={{ fontSize:10, color:'#94a3b8', marginTop:3 }}>{kpiLabel}</p>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(0,0,0,.05)', margin:'12px 0' }}/>

        {/* Secondary KPI */}
        <p style={{ fontSize:17, fontWeight:700, color:'#334155', letterSpacing:'-0.02em' }}>{kpi2}</p>
        <p style={{ fontSize:10, color:'#94a3b8' }}>{kpi2Label}</p>

        {/* Sparkline + open */}
        {canOpen && (
          <div className="flex items-center justify-between mt-3">
            <Spark data={spark} color={accent}/>
            <span style={{ fontSize:10, fontWeight:700, color:accent }}>Open →</span>
          </div>
        )}
      </div>
    </button>
  )
}

/* ── Detail Drawer ────────────────────────────────────────── */
function Drawer({ card, onClose }) {
  if (!card?.detail) return null
  const { detail, accent, glow, label, module } = card
  return (
    <div className="absolute inset-0 z-50 flex flex-col" onClick={onClose}
      style={{ background:'rgba(15,23,42,.45)', backdropFilter:'blur(6px)' }}>
      <div className="flex-1" style={{ minHeight:60 }}/>
      <div
        className="rounded-t-[26px] overflow-hidden no-scrollbar"
        style={{
          maxHeight:'86vh', display:'flex', flexDirection:'column',
          background:'rgba(255,255,255,.96)',
          backdropFilter:'blur(28px)',
          borderTop:'1px solid rgba(255,255,255,.9)',
          boxShadow:'0 -8px 40px rgba(0,0,0,.15), 0 -1px 0 rgba(0,0,0,.06)',
          animation:'slide-up .26s cubic-bezier(.16,1,.3,1)',
        }}
        onClick={e=>e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div style={{ width:36, height:4, borderRadius:99, background:'#e2e8f0' }}/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom:'1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3">
            <div style={{ width:24, height:3, borderRadius:2, background:`linear-gradient(90deg,${accent},${accent}55)` }}/>
            <div>
              <p className="eyebrow">{module}</p>
              <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', letterSpacing:'-0.01em' }}>{label}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, background:'#f1f5f9', border:'1px solid #e2e8f0', color:'#64748b', fontSize:13, fontWeight:700, cursor:'pointer' }}>✕</button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 no-scrollbar">
          {/* KPI 2×2 grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {detail.kpis.map(({ l, v, c }) => (
              <div key={l} className="rounded-xl p-3" style={{ background:'#f8fafc', border:'1px solid #e2e8f0' }}>
                <p className="eyebrow mb-1">{l}</p>
                <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:800, color:c, letterSpacing:'-0.03em' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Detail table */}
          <div className="rounded-xl overflow-hidden" style={{ border:'1px solid #e2e8f0' }}>
            <div className="px-4 py-2.5" style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              <p className="eyebrow">{detail.tableTitle}</p>
            </div>
            {detail.rows.map(({ l, v, h }, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: i<detail.rows.length-1 ? '1px solid #f8fafc' : 'none', background: h ? `${glow}08` : 'white' }}>
                <p style={{ fontSize:12, fontWeight:h?700:500, color:h?'#0f172a':'#64748b' }}>{l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:h?accent:'#334155' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* AI report button */}
          <button className="w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 text-white"
            style={{ fontSize:13, background:'linear-gradient(135deg,#0f172a,#1e293b)', boxShadow:'0 4px 16px rgba(0,0,0,.18)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
            </svg>
            Generate AI Report with Claude
          </button>
          <div style={{ height:12 }}/>
        </div>
      </div>
    </div>
  )
}

/* ── Main Screen ──────────────────────────────────────────── */
export default function FinanceScreen() {
  const [active, setActive] = useState(null)
  const kpis = [
    { l:'Revenue',  v:'$68.3k', c:'#059669' },
    { l:'Expenses', v:'$14.3k', c:'#ef4444' },
    { l:'Net',      v:'$54.0k', c:'#059669' },
    { l:'Cash',     v:'$54.0k', c:'#0284c7' },
  ]

  return (
    <div className="flex flex-col h-full relative">

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="eyebrow mb-1">Enterprise Planning</p>
        <p className="screen-title">Finance</p>
      </div>

      {/* KPI strip */}
      <div className="mx-4 mb-4 rounded-2xl px-5 py-3 flex justify-between items-center glass flex-shrink-0">
        {kpis.map(({ l, v, c }, i, arr) => (
          <div key={l} className="flex flex-col items-center">
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
            <span className="eyebrow">{l}</span>
          </div>
        ))}
      </div>

      {/* Models label */}
      <div className="px-5 mb-3 flex-shrink-0">
        <p className="eyebrow">Financial Models</p>
      </div>

      {/* 2-col glass tile grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-28">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {MODELS.map(m => (
            <ModelTile key={m.id} {...m} onOpen={() => setActive(m)}/>
          ))}
        </div>
        <div style={{ height:16 }}/>
      </div>

      {active && <Drawer card={active} onClose={() => setActive(null)}/>}
    </div>
  )
}
