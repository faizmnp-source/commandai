import { useState } from 'react'
import TopHeader from '../components/layout/TopHeader'

/* ── Micro sparkline ──────────────────────────────────────── */
function Spark({ data, color, w = 80, h = 28 }) {
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - ((v - min) / r) * (h - 4) - 2).toFixed(1)}`).join(' ')
  const [lx, ly] = pts.split(' ').at(-1).split(',')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  )
}

/* ── Model tile data ──────────────────────────────────────── */
const MODELS = [
  {
    id: 'pl',
    accent: '#059669',
    bg: '#f0fdf4',
    label: 'P&L Statement',
    module: 'Income',
    kpi: '$68.3k',
    kpiLabel: 'Revenue MTD',
    kpi2: '79%',
    kpi2Label: 'Net Margin',
    status: 'Profitable',
    ok: true,
    spark: [40,45,42,55,58,54,62,68,65,72],
    detail: {
      kpis: [
        { l: 'Revenue',       v: '$68,300', c: '#059669' },
        { l: 'Gross Profit',  v: '$61,200', c: '#0f172a' },
        { l: 'Operating Exp', v: '$7,300',  c: '#ef4444' },
        { l: 'Net Income',    v: '$54,000', c: '#059669' },
      ],
      tableTitle: 'Income Statement — May 2026',
      rows: [
        { l: 'Revenue',                 v: '$68,300' },
        { l: '  SaaS Subscriptions',    v: '$42,000' },
        { l: '  Consulting',            v: '$18,300' },
        { l: '  Professional Services', v: '$8,000'  },
        { l: 'Cost of Revenue',         v: '($7,100)' },
        { l: 'Gross Profit',            v: '$61,200', h: true },
        { l: 'Operating Expenses',      v: '($7,200)' },
        { l: 'Net Income',              v: '$54,000', h: true },
      ],
    },
  },
  {
    id: 'bs',
    accent: '#2563eb',
    bg: '#eff6ff',
    label: 'Balance Sheet',
    module: 'Assets',
    kpi: '$142k',
    kpiLabel: 'Total Assets',
    kpi2: '$98k',
    kpi2Label: 'Total Equity',
    status: 'Strong',
    ok: true,
    spark: [80,88,92,98,102,108,115,120,132,142],
    detail: {
      kpis: [
        { l: 'Total Assets',      v: '$142,000', c: '#2563eb' },
        { l: 'Current Assets',    v: '$89,000',  c: '#0f172a' },
        { l: 'Total Liabilities', v: '$44,000',  c: '#ef4444' },
        { l: 'Total Equity',      v: '$98,000',  c: '#059669' },
      ],
      tableTitle: 'Balance Sheet — May 2026',
      rows: [
        { l: 'Cash & Equivalents',   v: '$54,000' },
        { l: 'Accounts Receivable',  v: '$28,000' },
        { l: 'Fixed Assets (net)',   v: '$53,000' },
        { l: 'Total Assets',         v: '$142,000', h: true },
        { l: 'Accounts Payable',     v: '$12,000' },
        { l: 'Deferred Revenue',     v: '$18,000' },
        { l: 'Total Liabilities',    v: '$44,000', h: true },
        { l: 'Total Equity',         v: '$98,000', h: true },
      ],
    },
  },
  {
    id: 'cf',
    accent: '#0284c7',
    bg: '#f0f9ff',
    label: 'Cash Flow',
    module: 'Treasury',
    kpi: '$54k',
    kpiLabel: 'Operating CF',
    kpi2: '14 mo',
    kpi2Label: 'Cash Runway',
    status: 'Healthy',
    ok: true,
    spark: [30,38,35,42,40,48,46,52,50,54],
    detail: {
      kpis: [
        { l: 'Operating CF',    v: '$54,000', c: '#0284c7' },
        { l: 'Investing CF',    v: '($6,000)', c: '#ef4444' },
        { l: 'Free Cash Flow',  v: '$48,000', c: '#059669' },
        { l: 'Cash Runway',     v: '14 mo',   c: '#0f172a' },
      ],
      tableTitle: 'Cash Flow — May 2026',
      rows: [
        { l: 'Net Income',              v: '$54,000' },
        { l: 'Depreciation',            v: '$1,200'  },
        { l: 'Net Operating CF',        v: '$54,000', h: true },
        { l: 'Capital Expenditures',    v: '($6,000)' },
        { l: 'Net Investing CF',        v: '($6,000)', h: true },
        { l: 'Loan Repayments',         v: '($2,000)' },
        { l: 'Net Financing CF',        v: '($2,000)', h: true },
        { l: 'Net Change in Cash',      v: '$46,000', h: true },
      ],
    },
  },
  {
    id: 'sales',
    accent: '#ea580c',
    bg: '#fff7ed',
    label: 'Sales Forecast',
    module: 'Revenue',
    kpi: '$82k',
    kpiLabel: 'Active Pipeline',
    kpi2: '38%',
    kpi2Label: 'Win Rate',
    status: 'On Track',
    ok: true,
    spark: [20,28,32,30,38,42,40,48,45,50],
    detail: {
      kpis: [
        { l: 'Active Pipeline', v: '$82,000', c: '#ea580c' },
        { l: 'Won This Quarter',v: '$50,000', c: '#059669' },
        { l: 'Avg Deal Size',   v: '$13,667', c: '#0f172a' },
        { l: 'Win Rate',        v: '38%',     c: '#0f172a' },
      ],
      tableTitle: 'Sales Pipeline — Q2 2026',
      rows: [
        { l: 'TechCorp Ltd',      v: '$12,000' },
        { l: 'GreenPath Inc',     v: '$8,500'  },
        { l: 'Nova Studios',      v: '$22,000' },
        { l: 'BlueSky Retail',    v: '$35,000' },
        { l: 'Vertex Logistics',  v: '$5,000'  },
        { l: 'Total Pipeline',    v: '$82,500', h: true },
        { l: 'Weighted Forecast', v: '$31,350', h: true },
      ],
    },
  },
  {
    id: 'hr',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    label: 'Workforce Plan',
    module: 'HR & People',
    kpi: '12 FTE',
    kpiLabel: 'Total Headcount',
    kpi2: '$28k',
    kpi2Label: 'Monthly Payroll',
    status: 'Growing',
    ok: true,
    spark: [6,7,7,8,8,9,10,10,11,12],
    detail: {
      kpis: [
        { l: 'Headcount',      v: '12 FTE',  c: '#7c3aed' },
        { l: 'Monthly Payroll',v: '$28,000', c: '#ef4444' },
        { l: 'Utilization',    v: '87%',     c: '#059669' },
        { l: 'Cost/Employee',  v: '$2,333',  c: '#0f172a' },
      ],
      tableTitle: 'Workforce by Dept — May 2026',
      rows: [
        { l: 'Engineering',      v: '4 FTE · $12,000/mo' },
        { l: 'Sales & BD',       v: '2 FTE · $7,000/mo'  },
        { l: 'Product & Design', v: '2 FTE · $5,500/mo'  },
        { l: 'Operations',       v: '2 FTE · $4,000/mo'  },
        { l: 'Finance & Admin',  v: '2 FTE · $3,500/mo'  },
        { l: 'Total Headcount',  v: '12 FTE',  h: true },
        { l: 'Total Payroll',    v: '$28,000/mo', h: true },
      ],
    },
  },
  {
    id: 'budget',
    accent: '#475569',
    bg: '#f8fafc',
    label: 'Budget vs Actual',
    module: 'Planning',
    kpi: 'Q2 2026',
    kpiLabel: 'Current Period',
    kpi2: 'Soon',
    kpi2Label: 'In Development',
    status: 'Coming Soon',
    ok: null,
    spark: [50,50,50,50,50,50,50,50,50,50],
    detail: null,
  },
]

/* ── Model Tile ───────────────────────────────────────────── */
function ModelTile({ accent, bg, label, module, kpi, kpiLabel, kpi2, kpi2Label, status, ok, spark, onOpen, detail }) {
  const canOpen = !!detail
  return (
    <button
      onClick={canOpen ? onOpen : undefined}
      className="bg-white text-left rounded-2xl relative overflow-hidden w-full transition-all active:scale-[.97]"
      style={{
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.05)',
        cursor: canOpen ? 'pointer' : 'default',
        opacity: canOpen ? 1 : 0.7,
      }}
    >
      {/* Color top bar */}
      <div className="h-1 w-full" style={{ background: accent }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#94a3b8' }}>{module}</p>
            <p className="font-semibold mt-0.5" style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.2 }}>{label}</p>
          </div>
          {ok !== null && (
            <span
              className="flex-shrink-0 font-bold rounded-full"
              style={{ fontSize: 9, letterSpacing: '0.06em', padding: '2px 8px', background: ok ? '#dcfce7' : '#fef3c7', color: ok ? '#16a34a' : '#d97706' }}
            >
              {status}
            </span>
          )}
        </div>

        {/* Primary KPI */}
        <p className="font-display font-bold" style={{ fontSize: 24, color: accent, letterSpacing: '-0.03em', lineHeight: 1 }}>{kpi}</p>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{kpiLabel}</p>

        {/* Divider */}
        <div className="my-3" style={{ height: 1, background: '#f1f5f9' }} />

        {/* Secondary KPI */}
        <p className="font-bold" style={{ fontSize: 16, color: '#334155', letterSpacing: '-0.02em' }}>{kpi2}</p>
        <p style={{ fontSize: 10, color: '#94a3b8' }}>{kpi2Label}</p>

        {/* Sparkline */}
        {canOpen && (
          <div className="mt-3 flex items-center justify-between">
            <Spark data={spark} color={accent} />
            <span className="font-semibold" style={{ fontSize: 10, color: accent }}>Open →</span>
          </div>
        )}
      </div>
    </button>
  )
}

/* ── Drawer ───────────────────────────────────────────────── */
function Drawer({ card, onClose }) {
  if (!card?.detail) return null
  const { detail, accent, label, module } = card
  return (
    <div className="absolute inset-0 z-50 flex flex-col" onClick={onClose}
      style={{ background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(4px)' }}>
      <div className="flex-1" style={{ minHeight: 60 }} />
      <div className="bg-white rounded-t-[26px] overflow-hidden animate-slide-up" style={{ maxHeight: '84vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1.5 rounded-full" style={{ background: accent }} />
            <div>
              <p className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#94a3b8' }}>{module}</p>
              <p className="font-bold" style={{ fontSize: 14, color: '#0f172a' }}>{label}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center font-bold"
            style={{ background: '#f1f5f9', color: '#64748b', fontSize: 13 }}>✕</button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {detail.kpis.map(({ l, v, c }) => (
              <div key={l} className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{l}</p>
                <p className="font-display font-bold mt-1" style={{ fontSize: 20, color: c, letterSpacing: '-0.03em' }}>{v}</p>
              </div>
            ))}
          </div>
          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-4 py-2" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>{detail.tableTitle}</p>
            </div>
            {detail.rows.map(({ l, v, h }, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: i < detail.rows.length - 1 ? '1px solid #f8fafc' : 'none', background: h ? `${accent}06` : 'white' }}>
                <p style={{ fontSize: 12, fontWeight: h ? 700 : 500, color: h ? '#0f172a' : '#475569' }}>{l}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: h ? accent : '#334155' }}>{v}</p>
              </div>
            ))}
          </div>
          {/* AI button */}
          <button className="w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 text-white"
            style={{ fontSize: 13, background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 14px rgba(0,0,0,.15)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
            </svg>
            Generate AI Report with Claude
          </button>
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function FinanceScreen() {
  const [active, setActive] = useState(null)

  const kpis = [
    { l: 'Revenue',  v: '$68.3k', accent: '#059669', bg: '#f0fdf4' },
    { l: 'Expenses', v: '$14.3k', accent: '#ef4444', bg: '#fef2f2' },
    { l: 'Net',      v: '$54.0k', accent: '#059669', bg: '#f0fdf4' },
    { l: 'Cash',     v: '$54.0k', accent: '#0284c7', bg: '#f0f9ff' },
  ]

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#f0f4f8' }}>
      <TopHeader title="Finance" subtitle="Financial Models & Planning" />

      {/* KPI summary strip */}
      <div className="flex gap-2 px-4 py-3" style={{ background: '#f0f4f8' }}>
        {kpis.map(({ l, v, accent, bg }) => (
          <div key={l} className="flex-1 rounded-[13px] py-2 px-2 text-center"
            style={{ background: bg, border: `1px solid ${accent}22` }}>
            <p className="font-display font-bold" style={{ fontSize: 15, color: accent, letterSpacing: '-0.02em' }}>{v}</p>
            <p className="font-semibold uppercase" style={{ fontSize: 9, letterSpacing: '0.09em', color: '#94a3b8', marginTop: 1 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="px-4 pb-2">
        <p className="font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.09em', color: '#94a3b8' }}>
          Financial Models
        </p>
      </div>

      {/* 2-col tile grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-28">
        <div className="grid grid-cols-2 gap-3">
          {MODELS.map(m => (
            <ModelTile key={m.id} {...m} onOpen={() => setActive(m)} />
          ))}
        </div>
        <div className="h-4" />
      </div>

      {/* Drawer */}
      {active && <Drawer card={active} onClose={() => setActive(null)} />}
    </div>
  )
}
