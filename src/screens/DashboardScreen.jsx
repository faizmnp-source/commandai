import useAppStore from '../store/appStore'
import { useCounter } from '../hooks/useCounter'

/* ── Color-keyed glow per tile ─────────────────────────────── */
const TILES = [
  { id:'finance',   label:'Financial Plan',  grad:'linear-gradient(145deg,#059669,#0d9488)', glow:'#059669', icon:'finance',   nav:'finance'  },
  { id:'revenue',   label:'Revenue',         grad:'linear-gradient(145deg,#e11d48,#fb7185)', glow:'#e11d48', icon:'revenue',   nav:'finance'  },
  { id:'expenses',  label:'Expenses',        grad:'linear-gradient(145deg,#c2410c,#fb923c)', glow:'#ea580c', icon:'expenses',  nav:'finance'  },
  { id:'analysis',  label:'Analysis',        grad:'linear-gradient(145deg,#b45309,#fbbf24)', glow:'#d97706', icon:'analysis',  nav:'finance'  },
  { id:'crm',       label:'CRM Pipeline',    grad:'linear-gradient(145deg,#1d4ed8,#60a5fa)', glow:'#2563eb', icon:'crm',       nav:'crm'      },
  { id:'projects',  label:'Projects',        grad:'linear-gradient(145deg,#6d28d9,#a78bfa)', glow:'#7c3aed', icon:'projects',  nav:'projects' },
  { id:'tasks',     label:'Tasks',           grad:'linear-gradient(145deg,#0e7490,#22d3ee)', glow:'#0891b2', icon:'tasks',     nav:'projects' },
  { id:'forecast',  label:'Forecast',        grad:'linear-gradient(145deg,#0369a1,#7dd3fc)', glow:'#0284c7', icon:'forecast',  nav:'finance'  },
  { id:'workforce', label:'Workforce',       grad:'linear-gradient(145deg,#5b21b6,#c084fc)', glow:'#7c3aed', icon:'workforce', nav:'finance'  },
  { id:'contacts',  label:'Contacts',        grad:'linear-gradient(145deg,#115e59,#2dd4bf)', glow:'#0d9488', icon:'contacts',  nav:'crm'      },
  { id:'ai',        label:'AI Assistant',    grad:'linear-gradient(145deg,#78350f,#fde68a)', glow:'#d97706', icon:'ai',        nav:'chat'     },
  { id:'reports',   label:'Reports',         grad:'linear-gradient(145deg,#1e293b,#475569)', glow:'#64748b', icon:'reports',   nav:'finance'  },
]

/* ── Inline SVG icons ──────────────────────────────────────── */
function Icon({ name }) {
  const s = { stroke:'white', strokeWidth:1.9, strokeLinecap:'round', strokeLinejoin:'round', fill:'none' }
  const icons = {
    finance:   <svg width="22" height="22" viewBox="0 0 24 24" {...s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    revenue:   <svg width="22" height="22" viewBox="0 0 24 24" {...s}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    expenses:  <svg width="22" height="22" viewBox="0 0 24 24" {...s}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    analysis:  <svg width="22" height="22" viewBox="0 0 24 24" {...s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    crm:       <svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    projects:  <svg width="22" height="22" viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/></svg>,
    tasks:     <svg width="22" height="22" viewBox="0 0 24 24" {...s}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    forecast:  <svg width="22" height="22" viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    workforce: <svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    contacts:  <svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>,
    ai:        <svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>,
    reports:   <svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  }
  return icons[name] || null
}

/* ── Glass Icon Tile ───────────────────────────────────────── */
function AppTile({ label, grad, glow, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 group outline-none">
      {/* Tile with glass shine via CSS classes */}
      <div
        className="icon-tile w-14 h-14 flex items-center justify-center"
        style={{
          background: grad,
          boxShadow: `0 6px 20px ${glow}55, 0 2px 8px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.22)`,
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Icon name={icon} />
        </div>
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.6)', fontWeight: 500, textAlign: 'center', maxWidth: 64, lineHeight: 1.3 }}>
        {label}
      </span>
    </button>
  )
}

/* ── Animated KPI counter ──────────────────────────────────── */
function KpiNum({ value, prefix = '', color, label }) {
  const n = useCounter(typeof value === 'number' ? value : 0, 1400)
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.03em' }}>
        {prefix}{typeof value === 'number' ? n.toLocaleString() : value}
      </span>
      <span className="eyebrow">{label}</span>
    </div>
  )
}

/* ── Main Screen ───────────────────────────────────────────── */
export default function DashboardScreen() {
  const { navigate, user } = useAppStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div
      className="flex flex-col h-full overflow-y-auto no-scrollbar relative"
      style={{ background: 'transparent' }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', fontSize: 15, boxShadow: '0 0 0 2px rgba(16,185,129,.3)' }}
          >
            {user?.avatar || 'F'}
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', fontWeight: 500 }}>{greeting}</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {user?.name?.split(' ')[0] || 'Faizan'}
            </p>
          </div>
        </div>
        {/* Date + notification */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', fontWeight: 600 }}>{dateStr}</span>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#f43f5e', border:'1.5px solid #07090e' }}/>
          </div>
        </div>
      </div>

      {/* ── KPI glass strip ── */}
      <div
        className="mx-4 mb-5 rounded-2xl px-4 py-3.5 flex justify-between items-center glass"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <KpiNum label="Revenue"  value={68300}  prefix="$" color="#34d399" />
        <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,.07)' }} />
        <KpiNum label="Pipeline" value="$82k"            color="#60a5fa" />
        <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,.07)' }} />
        <KpiNum label="Tasks"    value={12}              color="#c084fc" />
        <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,.07)' }} />
        <KpiNum label="Cash"     value="$54k"            color="#38bdf8" />
      </div>

      {/* ── Body: mobile stacked / desktop 2-col ── */}
      <div className="flex-1 px-4 pb-32 md:pb-10 md:flex md:gap-4" style={{ position: 'relative', zIndex: 1 }}>

        {/* LEFT — Planning Process panel */}
        <div className="mb-4 md:mb-0 md:w-56 md:flex-shrink-0">
          <div className="rounded-2xl overflow-hidden glass" style={{ height: '100%' }}>

            {/* Header */}
            <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                Planning Process
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>Q2 2026 cycle active</p>
            </div>

            {/* Submission deadlines */}
            <div className="px-4 py-3">
              {[
                { l:'Sales Plan',          d:'Jun 15', done: false },
                { l:'Operating Expenses',  d:'Jun 30', done: false },
                { l:'Balance Sheet & CF',  d:'Jul 15', done: false },
                { l:'Board Review',        d:'Jul 30', done: false },
              ].map(({ l, d }) => (
                <div key={l} className="glass-row flex items-center justify-between py-2 px-0">
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.48)', fontWeight: 500 }}>{l}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.22)', fontWeight: 600 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* AI Alerts */}
            <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 12 }}>
              <p className="eyebrow mb-3">AI Alerts</p>
              {[
                { c:'#f43f5e', t:'TechCorp proposal 2 days overdue — $12k.' },
                { c:'#fbbf24', t:'GreenPath invoice $2.5k, 5 days overdue.' },
                { c:'#34d399', t:'Nova Studios deposit received. Kick off.' },
              ].map(({ c, t }) => (
                <div key={t} className="flex gap-2 mb-2.5">
                  <div style={{ width: 2, borderRadius: 2, background: c, flexShrink: 0, minHeight: 32 }} />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', lineHeight: 1.55 }}>{t}</p>
                </div>
              ))}
              <button
                onClick={() => navigate('chat')}
                className="w-full mt-3 py-2.5 rounded-xl font-bold text-white"
                style={{ fontSize: 12, background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 2px 14px rgba(5,150,105,.3)' }}
              >
                Ask AI →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Icon tile grid */}
        <div className="flex-1">
          <div className="rounded-2xl p-5 glass">
            <p className="eyebrow mb-5">Planning Modules</p>
            {/* 4-col iOS-style grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px 8px' }}>
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
