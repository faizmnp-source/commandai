import useAppStore from '../store/appStore'
import { useCounter } from '../hooks/useCounter'

/* ── SVG Icons ──────────────────────────────────────────────── */
const I = {
  finance: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  revenue: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  expenses: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  analysis: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  crm: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  projects: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/>
    </svg>
  ),
  tasks: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  reports: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  workforce: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  contacts: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
    </svg>
  ),
  ai: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
    </svg>
  ),
  forecast: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
}

/* ── Tile definitions ──────────────────────────────────────── */
const TILES = [
  { id:'finance',   label:'Financial Plan',  grad:'linear-gradient(140deg,#059669,#0d9488)', icon:'finance',   nav:'finance'  },
  { id:'revenue',   label:'Revenue',         grad:'linear-gradient(140deg,#e11d48,#f43f5e)', icon:'revenue',   nav:'finance'  },
  { id:'expenses',  label:'Expenses',        grad:'linear-gradient(140deg,#ea580c,#fb923c)', icon:'expenses',  nav:'finance'  },
  { id:'analysis',  label:'Analysis',        grad:'linear-gradient(140deg,#d97706,#f59e0b)', icon:'analysis',  nav:'finance'  },
  { id:'crm',       label:'CRM Pipeline',    grad:'linear-gradient(140deg,#2563eb,#60a5fa)', icon:'crm',       nav:'crm'      },
  { id:'projects',  label:'Projects',        grad:'linear-gradient(140deg,#7c3aed,#a78bfa)', icon:'projects',  nav:'projects' },
  { id:'tasks',     label:'Tasks',           grad:'linear-gradient(140deg,#0891b2,#22d3ee)', icon:'tasks',     nav:'projects' },
  { id:'forecast',  label:'Forecast',        grad:'linear-gradient(140deg,#0369a1,#38bdf8)', icon:'forecast',  nav:'finance'  },
  { id:'workforce', label:'Workforce',       grad:'linear-gradient(140deg,#6d28d9,#c084fc)', icon:'workforce', nav:'finance'  },
  { id:'contacts',  label:'Contacts',        grad:'linear-gradient(140deg,#0e7490,#67e8f9)', icon:'contacts',  nav:'crm'      },
  { id:'ai',        label:'AI Assistant',    grad:'linear-gradient(140deg,#92400e,#fbbf24)', icon:'ai',        nav:'chat'     },
  { id:'reports',   label:'Reports',         grad:'linear-gradient(140deg,#374151,#6b7280)', icon:'reports',   nav:'finance'  },
]

const ALERTS = [
  { color:'#f43f5e', text:'TechCorp proposal is 2 days overdue — $12k at risk.' },
  { color:'#f59e0b', text:'GreenPath invoice ($2.5k) is 5 days overdue.' },
  { color:'#22c55e', text:'Nova Studios deposit received — project can kick off.' },
]

/* ── AppTile ───────────────────────────────────────────────── */
function AppTile({ label, grad, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group" style={{ minWidth: 0 }}>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 group-active:scale-90 group-hover:scale-105"
        style={{ background: grad, boxShadow: '0 4px 14px rgba(0,0,0,.40)' }}
      >
        {I[icon]}
      </div>
      <span className="text-center leading-tight font-medium" style={{ fontSize: 10, color: 'rgba(255,255,255,.65)', maxWidth: 62 }}>
        {label}
      </span>
    </button>
  )
}

/* ── KPI chip ──────────────────────────────────────────────── */
function KpiChip({ label, value, prefix = '', color }) {
  const n = useCounter(typeof value === 'number' ? value : 0, 1200)
  return (
    <div className="flex flex-col items-center">
      <span className="font-display font-bold" style={{ fontSize: 15, color, letterSpacing: '-0.02em' }}>
        {prefix}{typeof value === 'number' ? n.toLocaleString() : value}
      </span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,.32)', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────── */
export default function DashboardScreen() {
  const { navigate, user } = useAppStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ background: '#111318' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', fontSize: 15 }}>
            {user?.avatar || 'F'}
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{greeting}</p>
            <p className="font-display font-bold" style={{ fontSize: 16, color: '#fff', letterSpacing: '-0.01em' }}>
              {user?.name?.split(' ')[0] || 'Faizan'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', fontWeight: 500 }}>{today}</span>
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#f43f5e' }}/>
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="mx-4 mb-4 rounded-2xl px-5 py-3 flex justify-between items-center"
        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
        <KpiChip label="Revenue"  value={68300}  prefix="$" color="#34d399" />
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.08)' }}/>
        <KpiChip label="Pipeline" value="$82k"            color="#60a5fa" />
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.08)' }}/>
        <KpiChip label="Tasks"    value={12}              color="#c084fc" />
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.08)' }}/>
        <KpiChip label="Cash"     value="$54k"            color="#38bdf8" />
      </div>

      {/* ── Main layout ── */}
      <div className="flex-1 px-4 pb-32 md:pb-10 md:flex md:gap-4">

        {/* LEFT: Planning Process + Alerts */}
        <div className="md:w-60 md:flex-shrink-0 mb-4 md:mb-0">
          <div className="rounded-2xl overflow-hidden h-full"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>

            {/* Header */}
            <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <p className="font-display font-bold" style={{ fontSize: 13, color: '#fff' }}>Planning Process</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Q2 2026 fiscal cycle</p>
            </div>

            {/* Key dates */}
            <div className="px-4 py-3 space-y-0.5">
              {[
                { l: 'Sales Plan',         d: 'Jun 15' },
                { l: 'Operating Expenses', d: 'Jun 30' },
                { l: 'Balance Sheet & CF', d: 'Jul 15' },
                { l: 'Board Review',       d: 'Jul 30' },
              ].map(({ l, d }) => (
                <div key={l} className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{l}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="px-4 pt-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <p className="font-bold mb-3" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)' }}>
                AI Alerts — {new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})}
              </p>
              <div className="space-y-2.5">
                {ALERTS.map(({ color, text }) => (
                  <div key={text} className="flex gap-2">
                    <div className="w-0.5 rounded-full flex-shrink-0" style={{ background: color, minHeight: 32 }}/>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.55 }}>{text}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('chat')} className="w-full mt-4 py-2 rounded-xl font-bold text-white"
                style={{ fontSize: 12, background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 2px 10px rgba(5,150,105,.25)' }}>
                Ask AI →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: App tile grid */}
        <div className="flex-1">
          <div className="rounded-2xl p-5 h-full"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-bold mb-5" style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)' }}>
              Planning Modules
            </p>
            {/* 4-column iOS-style icon grid */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-3">
              {TILES.map(t => (
                <AppTile key={t.id} {...t} onClick={() => navigate(t.nav)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
