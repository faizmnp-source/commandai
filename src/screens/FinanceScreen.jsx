import { useState } from 'react'
import TopHeader from '../components/layout/TopHeader'

/* ── Sparkline ────────────────────────────────────────────── */
function Spark({ data, color = 'rgba(255,255,255,.8)', w = 110, h = 38 }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const [lx, ly] = pts.split(' ').at(-1).split(',')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx={lx} cy={ly} r="3.5" fill={color} />
    </svg>
  )
}

/* ── Trend Arrow ──────────────────────────────────────────── */
const Up   = () => <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>↑</span>
const Down = () => <span style={{ color: '#f87171', fontSize: 11, fontWeight: 700 }}>↓</span>

/* ── Model Card ───────────────────────────────────────────── */
function ModelCard({ gradient, glow, icon, module, title, badge, badgeBg, kpis, spark, sparkColor, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="rounded-[22px] p-5 cursor-pointer active:scale-[.97] transition-all duration-150 relative overflow-hidden"
      style={{ background: gradient, boxShadow: `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,.12)` }}
    >
      {/* Top-right glow orb */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,.12)', filter: 'blur(20px)' }} />
      {/* Bottom-left subtle gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.1), transparent)' }} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)' }}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,.6)' }}>{module}</p>
            <p className="text-[15px] font-bold text-white leading-tight">{title}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: badgeBg, color: 'white' }}>{badge}</span>
      </div>

      {/* KPI row */}
      <div className="flex gap-4 mb-4 relative z-10">
        {kpis.map(({ label, value, trend }) => (
          <div key={label}>
            <div className="flex items-center gap-1">
              <p className="text-white font-bold" style={{ fontSize: 17, letterSpacing: '-0.02em' }}>{value}</p>
              {trend === 'up' ? <Up /> : trend === 'down' ? <Down /> : null}
            </div>
            <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,.55)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Sparkline + Open button */}
      <div className="flex items-end justify-between relative z-10">
        <Spark data={spark} color={sparkColor} />
        <button
          className="flex items-center gap-1.5 text-[11px] font-bold text-white rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', padding: '6px 12px' }}
        >
          Open Model
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}

/* ── Coming Soon Card ─────────────────────────────────────── */
function ComingSoonCard({ icon, title, module }) {
  return (
    <div className="rounded-[22px] p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,.07)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
          style={{ background: 'rgba(255,255,255,.06)' }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{module}</p>
          <p className="text-[15px] font-bold text-slate-400">{title}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-700 text-slate-400">Coming Soon</span>
      </div>
    </div>
  )
}

/* ── Drawer ───────────────────────────────────────────────── */
function Drawer({ card, onClose }) {
  if (!card) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col" onClick={onClose}
      style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }}>
      <div className="flex-1 min-h-[80px]" />
      <div
        className="bg-white rounded-t-[28px] flex flex-col overflow-hidden animate-slide-up"
        style={{ maxHeight: '82vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(226,232,240,.8)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: card.gradient, boxShadow: `0 4px 12px ${card.glow}` }}>
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{card.module}</p>
              <p className="font-bold text-slate-900 text-[15px] leading-tight">{card.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">✕</button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3">
            {card.detail.kpis.map(({ label, value, sub, color }) => (
              <div key={label} className="rounded-2xl p-3.5" style={{ background: '#f8fafc', border: '1px solid rgba(226,232,240,.8)' }}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="font-bold text-slate-900" style={{ fontSize: 20, letterSpacing: '-0.03em', color: color || '#0f172a' }}>{value}</p>
                {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
              </div>
            ))}
          </div>

          {/* Financial Table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(226,232,240,.8)' }}>
            <div className="px-4 py-2.5 flex-shrink-0" style={{ background: '#f8fafc', borderBottom: '1px solid rgba(226,232,240,.8)' }}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{card.detail.tableTitle}</p>
            </div>
            {card.detail.rows.map(({ label, value, highlight, sub }, i) => (
              <div key={i}
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderBottom: i < card.detail.rows.length - 1 ? '1px solid rgba(226,232,240,.5)' : 'none',
                  background: highlight ? 'rgba(16,185,129,.04)' : 'white',
                }}
              >
                <div>
                  <p className={`text-sm ${highlight ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{label}</p>
                  {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
                </div>
                <p className={`text-sm font-bold tabular-nums ${highlight ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Claude AI Report button */}
          <button
            className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>
            Generate AI Report with Claude
          </button>

          <div className="pb-6" />
        </div>
      </div>
    </div>
  )
}

/* ── Model Data ───────────────────────────────────────────── */
const MODELS = [
  {
    id: 'pl',
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    glow: 'rgba(5,150,105,.35)',
    icon: '📈',
    module: 'Financial Statements',
    title: 'P&L / Income Statement',
    badge: 'Profitable',
    badgeBg: 'rgba(0,0,0,.25)',
    kpis: [
      { label: 'Revenue',    value: '$68.3k', trend: 'up'   },
      { label: 'Net Income', value: '$54.0k', trend: 'up'   },
      { label: 'Margin',     value: '79%',    trend: 'up'   },
    ],
    spark: [40, 45, 42, 55, 58, 54, 62, 68, 65, 72],
    sparkColor: 'rgba(187,247,208,.9)',
    detail: {
      kpis: [
        { label: 'Total Revenue',   value: '$68,300', sub: '↑ 12% vs last month', color: '#059669' },
        { label: 'Gross Profit',    value: '$61,200', sub: 'Gross margin 89.6%',  color: '#0f172a' },
        { label: 'Operating Exp',   value: '$7,300',  sub: 'Payroll + SaaS',      color: '#ef4444' },
        { label: 'Net Income',      value: '$54,000', sub: 'Net margin 79%',      color: '#059669' },
      ],
      tableTitle: 'Income Statement — May 2026',
      rows: [
        { label: 'Revenue',                 value: '$68,300' },
        { label: '  SaaS Subscriptions',    value: '$42,000', sub: 'MRR' },
        { label: '  Consulting',            value: '$18,300' },
        { label: '  Professional Services', value: '$8,000'  },
        { label: 'Cost of Revenue',         value: '($7,100)' },
        { label: 'Gross Profit',            value: '$61,200', highlight: true },
        { label: 'Operating Expenses',      value: '($7,200)' },
        { label: '  Payroll',               value: '($4,800)' },
        { label: '  Software & Tools',      value: '($1,400)' },
        { label: '  Marketing',             value: '($1,000)' },
        { label: 'EBITDA',                  value: '$54,000', highlight: true },
        { label: 'Net Income',              value: '$54,000', highlight: true },
      ],
    },
  },
  {
    id: 'bs',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    glow: 'rgba(37,99,235,.35)',
    icon: '⚖️',
    module: 'Financial Statements',
    title: 'Balance Sheet',
    badge: 'Strong',
    badgeBg: 'rgba(0,0,0,.25)',
    kpis: [
      { label: 'Total Assets',  value: '$142k', trend: 'up' },
      { label: 'Equity',        value: '$98k',  trend: 'up' },
      { label: 'Debt/Equity',   value: '0.45'              },
    ],
    spark: [80, 88, 92, 98, 102, 108, 115, 120, 132, 142],
    sparkColor: 'rgba(199,210,254,.9)',
    detail: {
      kpis: [
        { label: 'Total Assets',      value: '$142,000', sub: '↑ 8% vs Q1',       color: '#2563eb' },
        { label: 'Current Assets',    value: '$89,000',  sub: 'Cash + Receivables', color: '#0f172a' },
        { label: 'Total Liabilities', value: '$44,000',  sub: 'Long-term debt',    color: '#ef4444' },
        { label: 'Total Equity',      value: '$98,000',  sub: 'Retained earnings', color: '#059669' },
      ],
      tableTitle: 'Balance Sheet — May 2026',
      rows: [
        { label: 'ASSETS',                     value: '' },
        { label: '  Cash & Equivalents',       value: '$54,000' },
        { label: '  Accounts Receivable',      value: '$28,000' },
        { label: '  Prepaid Expenses',         value: '$7,000'  },
        { label: '  Fixed Assets (net)',        value: '$53,000' },
        { label: 'Total Assets',               value: '$142,000', highlight: true },
        { label: 'LIABILITIES',                value: '' },
        { label: '  Accounts Payable',         value: '$12,000' },
        { label: '  Deferred Revenue',         value: '$18,000' },
        { label: '  Long-term Debt',           value: '$14,000' },
        { label: 'Total Liabilities',          value: '$44,000',  highlight: true },
        { label: 'Total Equity',               value: '$98,000',  highlight: true },
      ],
    },
  },
  {
    id: 'cf',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
    glow: 'rgba(2,132,199,.35)',
    icon: '💧',
    module: 'Cash Management',
    title: 'Cash Flow Statement',
    badge: 'Healthy',
    badgeBg: 'rgba(0,0,0,.25)',
    kpis: [
      { label: 'Operating CF', value: '$54k',  trend: 'up'   },
      { label: 'Free CF',      value: '$48k',  trend: 'up'   },
      { label: 'Runway',       value: '14 mo'               },
    ],
    spark: [30, 38, 35, 42, 40, 48, 46, 52, 50, 54],
    sparkColor: 'rgba(186,230,253,.9)',
    detail: {
      kpis: [
        { label: 'Operating CF',   value: '$54,000', sub: 'From core ops',       color: '#0284c7' },
        { label: 'Investing CF',   value: '($6,000)',sub: 'Capex & investments',  color: '#ef4444' },
        { label: 'Free Cash Flow', value: '$48,000', sub: 'Operating - Capex',   color: '#059669' },
        { label: 'Cash Runway',    value: '14 mo',   sub: 'At current burn rate', color: '#0f172a' },
      ],
      tableTitle: 'Cash Flow Statement — May 2026',
      rows: [
        { label: 'Operating Activities',       value: '' },
        { label: '  Net Income',               value: '$54,000' },
        { label: '  Depreciation & Amort.',    value: '$1,200'  },
        { label: '  Changes in Working Cap.',  value: '($1,200)' },
        { label: 'Net Operating CF',           value: '$54,000', highlight: true },
        { label: 'Investing Activities',       value: '' },
        { label: '  Capital Expenditures',     value: '($6,000)' },
        { label: 'Net Investing CF',           value: '($6,000)', highlight: true },
        { label: 'Financing Activities',       value: '' },
        { label: '  Loan Repayments',          value: '($2,000)' },
        { label: 'Net Financing CF',           value: '($2,000)', highlight: true },
        { label: 'Net Change in Cash',         value: '$46,000',  highlight: true },
      ],
    },
  },
  {
    id: 'sales',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
    glow: 'rgba(234,88,12,.35)',
    icon: '🎯',
    module: 'Revenue Intelligence',
    title: 'Sales & Forecast',
    badge: 'On Track',
    badgeBg: 'rgba(0,0,0,.25)',
    kpis: [
      { label: 'Pipeline',    value: '$82k', trend: 'up'  },
      { label: 'Won Q2',      value: '$50k', trend: 'up'  },
      { label: 'Conversion',  value: '38%'               },
    ],
    spark: [20, 28, 32, 30, 38, 42, 40, 48, 45, 50],
    sparkColor: 'rgba(254,215,170,.9)',
    detail: {
      kpis: [
        { label: 'Active Pipeline',  value: '$82,000', sub: '6 active deals',     color: '#ea580c' },
        { label: 'Won This Quarter', value: '$50,000', sub: '↑ 24% vs Q1',        color: '#059669' },
        { label: 'Avg Deal Size',    value: '$13,667', sub: 'Across 6 deals',     color: '#0f172a' },
        { label: 'Win Rate',         value: '38%',     sub: 'Industry avg: 27%',  color: '#0f172a' },
      ],
      tableTitle: 'Sales Forecast — Q2 2026',
      rows: [
        { label: 'TechCorp Ltd',      value: '$12,000', sub: 'Negotiation' },
        { label: 'GreenPath Inc',     value: '$8,500',  sub: 'Qualified'   },
        { label: 'Nova Studios',      value: '$22,000', sub: 'Proposal'    },
        { label: 'BlueSky Retail',    value: '$35,000', sub: 'Negotiation' },
        { label: 'Vertex Logistics',  value: '$5,000',  sub: 'Lead'        },
        { label: 'Total Pipeline',    value: '$82,500', highlight: true },
        { label: 'Expected Close (weighted)', value: '$31,350', highlight: true },
        { label: 'Q2 Target',         value: '$75,000' },
        { label: 'Forecast vs Target',value: '42%',     highlight: true },
      ],
    },
  },
  {
    id: 'hr',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
    glow: 'rgba(124,58,237,.35)',
    icon: '👥',
    module: 'HR & People',
    title: 'Workforce Planning',
    badge: 'Growing',
    badgeBg: 'rgba(0,0,0,.25)',
    kpis: [
      { label: 'Headcount', value: '12',    trend: 'up' },
      { label: 'Payroll',   value: '$28k',  trend: 'up' },
      { label: 'Util. Rate',value: '87%'               },
    ],
    spark: [6, 7, 7, 8, 8, 9, 10, 10, 11, 12],
    sparkColor: 'rgba(233,213,255,.9)',
    detail: {
      kpis: [
        { label: 'Total Headcount',    value: '12',     sub: '+2 this quarter',   color: '#7c3aed' },
        { label: 'Monthly Payroll',    value: '$28,000', sub: '↑ 18% vs Q1',      color: '#ef4444' },
        { label: 'Utilization Rate',   value: '87%',    sub: 'Target: 80%+',      color: '#059669' },
        { label: 'Cost per Employee',  value: '$2,333', sub: 'Monthly avg',       color: '#0f172a' },
      ],
      tableTitle: 'Workforce by Department — May 2026',
      rows: [
        { label: 'Engineering',      value: '4 FTE', sub: '$12,000/mo' },
        { label: 'Sales & BD',       value: '2 FTE', sub: '$7,000/mo'  },
        { label: 'Product & Design', value: '2 FTE', sub: '$5,500/mo'  },
        { label: 'Operations',       value: '2 FTE', sub: '$4,000/mo'  },
        { label: 'Finance & Admin',  value: '2 FTE', sub: '$3,500/mo'  },
        { label: 'Total Headcount',  value: '12 FTE', highlight: true  },
        { label: 'Total Payroll',    value: '$28,000/mo', highlight: true },
        { label: 'Planned Q3 Hires', value: '3 FTE' },
        { label: 'Projected Payroll Q3', value: '$34,500/mo', highlight: true },
      ],
    },
  },
]

/* ── Main Screen ──────────────────────────────────────────── */
export default function FinanceScreen() {
  const [activeCard, setActiveCard] = useState(null)

  const revenue  = 68300
  const expenses = 14300
  const net      = revenue - expenses
  const cash     = 54000

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* Dark themed header */}
      <div style={{ background: '#0a0f1e' }}>
        <TopHeader title="Finance" subtitle="Financial Models & EPM" />
      </div>

      {/* Summary strip */}
      <div className="flex gap-2 px-4 py-3" style={{ background: '#0a0f1e' }}>
        {[
          { label: 'Revenue',   value: `$${(revenue/1000).toFixed(1)}k`,  color: '#4ade80' },
          { label: 'Expenses',  value: `$${(expenses/1000).toFixed(1)}k`, color: '#f87171' },
          { label: 'Net',       value: `$${(net/1000).toFixed(0)}k`,      color: '#34d399' },
          { label: 'Cash',      value: `$${(cash/1000).toFixed(0)}k`,     color: '#38bdf8' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex-1 rounded-xl py-2 px-2 text-center"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="text-[15px] font-bold" style={{ color, letterSpacing: '-0.02em' }}>{value}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,.5)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-2" style={{ background: '#0c1018' }}>
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,.4)' }}>
          AI Financial Models
        </p>
      </div>

      {/* Cards scroll */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3" style={{ background: '#0c1018' }}>
        {MODELS.map(card => (
          <ModelCard
            key={card.id}
            {...card}
            onOpen={() => setActiveCard(card)}
          />
        ))}

        {/* Coming soon */}
        <p className="text-[11px] font-bold uppercase tracking-widest pt-2" style={{ color: 'rgba(148,163,184,.3)' }}>
          Coming Soon
        </p>
        <ComingSoonCard icon="📊" module="Planning" title="Budget vs Actual" />
        <ComingSoonCard icon="📦" module="Operations" title="Inventory & COGS" />
        <ComingSoonCard icon="🏦" module="Treasury" title="Scenario Planning" />

        <div className="pb-4" />
      </div>

      {/* Drawer */}
      {activeCard && (
        <Drawer card={activeCard} onClose={() => setActiveCard(null)} />
      )}
    </div>
  )
}
