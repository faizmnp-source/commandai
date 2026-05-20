import useAppStore from '../store/appStore'
import { useCounter } from '../hooks/useCounter'

/* ── Module tile definitions (EPM PBCS structure) ──────────── */
// Revenue & Expenses are SUB-ITEMS of Financial Plan, NOT separate tiles
// Workforce Planning and Sales Forecasting ARE separate dedicated tiles
const TILES = [
  { id:'finance',   label:'Financial Plan',       grad:'linear-gradient(145deg,#059669,#10b981)', glow:'rgba(5,150,105,.35)',  icon:'finance',    nav:'finance' },
  { id:'workforce', label:'Workforce Planning',   grad:'linear-gradient(145deg,#7c3aed,#a78bfa)', glow:'rgba(124,58,237,.35)', icon:'workforce',  nav:'finance' },
  { id:'sales',     label:'Sales Forecasting',    grad:'linear-gradient(145deg,#ea580c,#fb923c)', glow:'rgba(234,88,12,.35)',  icon:'sales',      nav:'finance' },
  { id:'crm',       label:'CRM Pipeline',         grad:'linear-gradient(145deg,#2563eb,#60a5fa)', glow:'rgba(37,99,235,.35)',  icon:'crm',        nav:'crm'     },
  { id:'projects',  label:'Projects',             grad:'linear-gradient(145deg,#0891b2,#22d3ee)', glow:'rgba(8,145,178,.35)',  icon:'projects',   nav:'projects'},
  { id:'tasks',     label:'Tasks',                grad:'linear-gradient(145deg,#db2777,#f472b6)', glow:'rgba(219,39,119,.35)', icon:'tasks',      nav:'projects'},
  { id:'reports',   label:'Reports',              grad:'linear-gradient(145deg,#0369a1,#38bdf8)', glow:'rgba(3,105,161,.35)',  icon:'reports',    nav:'finance' },
  { id:'dashboards',label:'Dashboards',           grad:'linear-gradient(145deg,#4f46e5,#818cf8)', glow:'rgba(79,70,229,.35)',  icon:'dashboards', nav:'home'    },
  { id:'approvals', label:'Approvals',            grad:'linear-gradient(145deg,#0d9488,#2dd4bf)', glow:'rgba(13,148,136,.35)', icon:'approvals',  nav:'crm'     },
  { id:'analysis',  label:'Analysis',             grad:'linear-gradient(145deg,#b45309,#fbbf24)', glow:'rgba(180,83,9,.35)',   icon:'analysis',   nav:'finance' },
  { id:'ai',        label:'AI Assistant',         grad:'linear-gradient(145deg,#be123c,#fb7185)', glow:'rgba(190,18,60,.35)',  icon:'ai',         nav:'chat'    },
  { id:'dataentry', label:'Data Entry',           grad:'linear-gradient(145deg,#374151,#6b7280)', glow:'rgba(55,65,81,.30)',   icon:'dataentry',  nav:'finance' },
]

/* ── SVG icon map ──────────────────────────────────────────── */
function TileIcon({ name }) {
  const p = { stroke:'white', strokeWidth:1.9, strokeLinecap:'round', strokeLinejoin:'round', fill:'none' }
  const map = {
    finance:    <svg width="24" height="24" viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    workforce:  <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    sales:      <svg width="24" height="24" viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    crm:        <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    projects:   <svg width="24" height="24" viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/></svg>,
    tasks:      <svg width="24" height="24" viewBox="0 0 24 24" {...p}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    reports:    <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    dashboards: <svg width="24" height="24" viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    approvals:  <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    analysis:   <svg width="24" height="24" viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    ai:         <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>,
    dataentry:  <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  }
  return map[name] || null
}

/* ── EPM PBCS App Tile ─────────────────────────────────────── */
function AppTile({ label, grad, glow, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group outline-none border-none bg-transparent p-0 cursor-pointer">
      {/* Gradient icon square with glass shine via CSS */}
      <div
        className="icon-tile w-[60px] h-[60px] flex items-center justify-center"
        style={{ background: grad, boxShadow: `0 6px 18px ${glow}, 0 2px 6px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.28)` }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <TileIcon name={icon} />
        </div>
      </div>
      {/* Label */}
      <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textAlign: 'center', maxWidth: 68, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
        {label}
      </span>
    </button>
  )
}

/* ── Animated KPI number ───────────────────────────────────── */
function KpiNum({ value, prefix = '', color, label }) {
  const n = useCounter(typeof value === 'number' ? value : 0, 1300)
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {prefix}{typeof value === 'number' ? n.toLocaleString() : value}
      </span>
      <span className="eyebrow">{label}</span>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────── */
export default function DashboardScreen() {
  const { navigate, user } = useAppStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">

      {/* ── Top greeting bar ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#059669,#10b981)', fontSize: 15, boxShadow: '0 0 0 3px rgba(16,185,129,.20), 0 2px 8px rgba(5,150,105,.25)' }}>
            {user?.avatar || 'F'}
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{greeting}</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {user?.name || 'Faizan'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{dateStr}</span>
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center glass" style={{ flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span style={{ position:'absolute', top:8, right:8, width:7, height:7, borderRadius:'50%', background:'#ef4444', border:'1.5px solid #eef2f8' }}/>
          </div>
        </div>
      </div>

      {/* ── KPI summary strip ── */}
      <div className="mx-4 mb-5 rounded-2xl px-4 py-3 flex justify-between items-center glass flex-shrink-0">
        <KpiNum label="Revenue"  value={68300}  prefix="$" color="#059669" />
        <div style={{ width:1, height:28, background:'rgba(0,0,0,.06)' }}/>
        <KpiNum label="Pipeline" value="$82k"            color="#2563eb" />
        <div style={{ width:1, height:28, background:'rgba(0,0,0,.06)' }}/>
        <KpiNum label="Tasks"    value={12}              color="#7c3aed" />
        <div style={{ width:1, height:28, background:'rgba(0,0,0,.06)' }}/>
        <KpiNum label="Cash"     value="$54k"            color="#0284c7" />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 px-4 pb-32 md:pb-10 md:flex md:gap-4">

        {/* LEFT — Planning panel */}
        <div className="mb-4 md:mb-0 md:w-56 md:flex-shrink-0">
          <div className="rounded-2xl overflow-hidden glass h-full">

            {/* Header */}
            <div className="px-4 pt-4 pb-3" style={{ borderBottom:'1px solid rgba(0,0,0,.05)' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, color:'#0f172a', letterSpacing:'-0.01em' }}>Planning Process</p>
              <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Q2 2026 fiscal cycle</p>
            </div>

            {/* Key dates */}
            <div className="px-4 py-2">
              {[
                { l:'Sales Plan',           d:'Jun 15' },
                { l:'Operating Expenses',   d:'Jun 30' },
                { l:'Balance Sheet & CF',   d:'Jul 15' },
                { l:'Board Review',         d:'Jul 30' },
              ].map(({ l, d }) => (
                <div key={l} className="glass-row flex items-center justify-between py-2">
                  <span style={{ fontSize:11, color:'#475569', fontWeight:500 }}>{l}</span>
                  <span style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div className="px-4 pt-3 pb-4" style={{ borderTop:'1px solid rgba(0,0,0,.05)', marginTop:4 }}>
              <p className="eyebrow mb-3">Announcements</p>
              {[
                { c:'#ef4444', t:'TechCorp proposal 2 days overdue — $12k deal at risk.' },
                { c:'#f59e0b', t:'GreenPath invoice $2.5k is 5 days overdue.' },
                { c:'#059669', t:'Nova Studios deposit received — project ready.' },
              ].map(({ c, t }) => (
                <div key={t} className="flex gap-2 mb-2.5">
                  <div style={{ width:2.5, borderRadius:2, background:c, flexShrink:0, minHeight:28 }}/>
                  <p style={{ fontSize:11, color:'#475569', lineHeight:1.55 }}>{t}</p>
                </div>
              ))}
              <button onClick={() => navigate('chat')}
                className="w-full mt-3 py-2.5 rounded-xl font-bold text-white"
                style={{ fontSize:12, background:'linear-gradient(135deg,#059669,#10b981)', boxShadow:'0 2px 12px rgba(5,150,105,.28)' }}>
                Ask AI →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — EPM PBCS Icon Grid */}
        <div className="flex-1">
          <div className="rounded-2xl p-5 glass">
            <p className="eyebrow mb-5">Planning Modules</p>
            {/* 4-col icon grid — EPM PBCS style */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'22px 10px' }}>
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
