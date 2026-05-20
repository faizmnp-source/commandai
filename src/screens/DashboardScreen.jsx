import { useState, useEffect, useRef } from 'react'
import useAppStore, { CLOSE_TASKS_SEED, CLOSE_PHASES, HOSPITAL_PL } from '../store/appStore'

/* ── Helpers ─────────────────────────────────────────────────── */
const fmtK = n => n >= 1000 ? `$${(n/1000).toFixed(1)}M` : `$${n}K`

/* ── Animated counter ────────────────────────────────────────── */
function useCount(target, duration = 1100) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - pct, 3)
      setVal(Math.round(ease * target))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

/* ── Module tile icons ───────────────────────────────────────── */
function TileIcon({ name }) {
  const p = { stroke:'white', strokeWidth:1.9, strokeLinecap:'round', strokeLinejoin:'round', fill:'none' }
  const map = {
    finance:   <svg width="20" height="20" viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    crm:       <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    projects:  <svg width="20" height="20" viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/></svg>,
    chat:      <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>,
  }
  return map[name] || null
}

/* ── Status badge ────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    done:     { label:'Done',       cls:'status-done'     },
    progress: { label:'In Progress',cls:'status-progress' },
    pending:  { label:'Pending',    cls:'status-pending'  },
    overdue:  { label:'Overdue',    cls:'status-overdue'  },
  }
  const s = map[status] || map.pending
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>
}

/* ── Progress ring ───────────────────────────────────────────── */
function ProgressRing({ pct, size = 52, stroke = 4 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [offset, setOffset] = useState(circ)
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct / 100)), 120)
    return () => clearTimeout(t)
  }, [pct, circ])
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition:'stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)' }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#0ea5e9"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Close Hero Card ─────────────────────────────────────────── */
function CloseHeroCard({ org, tasks, onTaskClick }) {
  const total   = tasks.length
  const done    = tasks.filter(t => t.status === 'done').length
  const inProg  = tasks.filter(t => t.status === 'progress').length
  const pct     = Math.round((done / total) * 100)
  const animPct = useCount(pct)

  // Progress bar fill animation
  const [barW, setBarW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarW(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  // Next 3 actionable tasks
  const next = tasks.filter(t => t.status !== 'done').slice(0, 3)

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden flex-shrink-0"
      style={{ background:'linear-gradient(145deg,rgba(14,30,58,.9) 0%,rgba(7,16,30,.95) 100%)', border:'1px solid rgba(255,255,255,.07)', boxShadow:'0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07)' }}>

      {/* Top accent line */}
      <div style={{ height:2, background:'linear-gradient(90deg,#10b981,#0ea5e9,transparent)' }}/>

      {/* Header row */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px rgba(16,185,129,.6)', animation:'pulse-dot 2s ease-in-out infinite' }}/>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(16,185,129,.8)', textTransform:'uppercase' }}>Live · May 2026 Close</span>
          </div>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:17, fontWeight:800, color:'rgba(248,250,252,.95)', letterSpacing:'-0.02em', lineHeight:1.2 }}>
            {org.name}
          </h2>
          <p style={{ fontSize:11, color:'rgba(148,163,184,.55)', marginTop:2 }}>
            {org.entity} · {org.fiscal} · Close {org.closeDate}
          </p>
        </div>

        {/* Ring + pct */}
        <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width:52, height:52 }}>
          <ProgressRing pct={pct} size={52} stroke={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:13, fontWeight:800, color:'#34d399', lineHeight:1 }}>{animPct}%</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9.5, color:'rgba(100,116,139,.6)', letterSpacing:'0.08em' }}>CLOSE PROGRESS</span>
          <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9.5, color:'rgba(148,163,184,.5)' }}>{done} / {total} tasks · {org.daysLeft}d remaining</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width:`${barW}%` }}/>
        </div>

        {/* Phase pills */}
        <div className="flex gap-1.5 mt-2.5">
          {CLOSE_PHASES.map(ph => {
            const phTasks = tasks.filter(t => t.phase === ph.id)
            const phDone  = phTasks.filter(t => t.status === 'done').length
            const allDone = phDone === phTasks.length
            const hasActive = phTasks.some(t => t.status === 'progress')
            return (
              <div key={ph.id} className="flex-1 rounded-lg px-2 py-1.5 text-center"
                style={{ background: allDone ? 'rgba(16,185,129,.1)' : hasActive ? 'rgba(14,165,233,.1)' : 'rgba(255,255,255,.04)', border:`1px solid ${allDone ? 'rgba(16,185,129,.2)' : hasActive ? 'rgba(14,165,233,.2)' : 'rgba(255,255,255,.06)'}` }}>
                <p style={{ fontFamily:'ui-monospace,monospace', fontSize:8, letterSpacing:'0.08em', color: allDone ? '#10b981' : hasActive ? '#0ea5e9' : 'rgba(100,116,139,.5)', textTransform:'uppercase' }}>Ph {ph.id}</p>
                <p style={{ fontSize:9, fontWeight:700, color: allDone ? '#34d399' : hasActive ? '#38bdf8' : 'rgba(148,163,184,.35)', marginTop:1 }}>{phDone}/{phTasks.length}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Next tasks strip */}
      {next.length > 0 && (
        <div style={{ borderTop:'1px solid rgba(255,255,255,.05)' }}>
          <div className="px-5 pt-3 pb-1">
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.14em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>Next Actions</span>
          </div>
          {next.map((task, i) => (
            <button key={task.id} onClick={() => onTaskClick(task)}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all"
              style={{ borderBottom: i < next.length - 1 ? '1px solid rgba(255,255,255,.03)' : 'none', background:'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background: task.status === 'progress' ? '#0ea5e9' : 'rgba(100,116,139,.3)', boxShadow: task.status === 'progress' ? '0 0 8px rgba(14,165,233,.5)' : 'none' }}/>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize:12, fontWeight:600, color:'rgba(226,232,240,.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.label}</p>
                <p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontFamily:'ui-monospace,monospace', marginTop:1 }}>{task.owner} · Due {task.due}</p>
              </div>
              <StatusBadge status={task.status} />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.4)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="px-5 pb-4 pt-3 flex gap-2" style={{ borderTop:'1px solid rgba(255,255,255,.04)' }}>
        <button className="flex-1 py-2 rounded-xl font-semibold text-center"
          style={{ fontSize:11, background:'rgba(16,185,129,.1)', color:'#34d399', border:'1px solid rgba(16,185,129,.2)' }}>
          {inProg > 0 ? `${inProg} In Progress` : `${total - done} Remaining`}
        </button>
        <button className="flex-1 py-2 rounded-xl font-semibold text-center"
          style={{ fontSize:11, background:'rgba(14,165,233,.1)', color:'#38bdf8', border:'1px solid rgba(14,165,233,.2)' }}>
          Close {org.closeDate}
        </button>
      </div>
    </div>
  )
}

/* ── Hospital KPI strip ──────────────────────────────────────── */
function HospitalKPIs() {
  const revenue  = HOSPITAL_PL.revenue.reduce((s, r) => s + r.actual, 0)
  const expenses = HOSPITAL_PL.expenses.reduce((s, r) => s + r.actual, 0)

  const animRev = useCount(revenue)
  const animExp = useCount(expenses)
  const animNet = useCount(revenue - expenses)

  const kpis = [
    { label:'Gross Revenue', val:`$${(animRev/1000).toFixed(2)}M`, sub:'+8.2% vs budget', c:'#34d399', pos:true },
    { label:'Total Expenses', val:`$${(animExp/1000).toFixed(2)}M`, sub:'+3.1% vs budget', c:'#fb7185', pos:false },
    { label:'Net Income', val:`$${(animNet/1000).toFixed(2)}M`, sub:'Operating margin 4.4%', c: revenue - expenses >= 0 ? '#34d399' : '#fb7185', pos: revenue - expenses >= 0 },
    { label:'FTEs', val:'1,247', sub:'Kronos · $3.84M payroll', c:'#a78bfa', pos:true },
  ]

  return (
    <div className="mx-4 mb-4 grid grid-cols-4 gap-2 flex-shrink-0" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
      {kpis.map(k => (
        <div key={k.label} className="rounded-xl p-3"
          style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)', backdropFilter:'blur(16px)', boxShadow:'0 2px 12px rgba(0,0,0,.3)' }}>
          <p style={{ fontFamily:'ui-monospace,monospace', fontSize:8, letterSpacing:'0.12em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:4 }}>{k.label}</p>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:k.c, letterSpacing:'-0.02em', lineHeight:1 }}>{k.val}</p>
          <p style={{ fontSize:9, color: k.pos ? 'rgba(52,211,153,.6)' : 'rgba(251,113,133,.6)', marginTop:3, fontFamily:'ui-monospace,monospace' }}>{k.sub}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Activity Feed ───────────────────────────────────────────── */
function ActivityFeed({ activity }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)', backdropFilter:'blur(16px)', boxShadow:'0 4px 20px rgba(0,0,0,.35)' }}>
      <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>Recent Activity</span>
        <div className="flex items-center gap-1.5">
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', animation:'pulse-dot 2s ease-in-out infinite' }}/>
          <span style={{ fontFamily:'ui-monospace,monospace', fontSize:8, color:'rgba(16,185,129,.6)' }}>LIVE</span>
        </div>
      </div>
      <div>
        {activity.map((a, i) => (
          <div key={a.id} className="flex items-start gap-3 px-4 py-3"
            style={{ borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,.03)' : 'none' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:a.dot, flexShrink:0, marginTop:3, boxShadow:`0 0 8px ${a.dot}60` }}/>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11.5, fontWeight:600, color:'rgba(226,232,240,.78)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
              <p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontFamily:'ui-monospace,monospace', marginTop:1 }}>{a.sub}</p>
            </div>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, color:'rgba(100,116,139,.35)', flexShrink:0, marginTop:1 }}>{a.time} ago</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Module tiles ────────────────────────────────────────────── */
const MODULE_TILES = [
  { id:'finance',  label:'Financial Plan',  grad:'linear-gradient(145deg,#059669,#10b981)', glow:'rgba(5,150,105,.4)',  icon:'finance',  nav:'finance' },
  { id:'crm',      label:'CRM Pipeline',    grad:'linear-gradient(145deg,#2563eb,#60a5fa)', glow:'rgba(37,99,235,.4)',  icon:'crm',      nav:'crm'     },
  { id:'projects', label:'Projects',        grad:'linear-gradient(145deg,#0891b2,#22d3ee)', glow:'rgba(8,145,178,.4)',  icon:'projects', nav:'projects'},
  { id:'chat',     label:'AI Assistant',    grad:'linear-gradient(145deg,#be123c,#fb7185)', glow:'rgba(190,18,60,.4)',  icon:'chat',     nav:'chat'    },
]

function ModuleTile({ label, grad, glow, icon, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex flex-col items-center gap-2 p-0 border-none bg-transparent cursor-pointer outline-none">
      <div className="icon-tile w-[52px] h-[52px] flex items-center justify-center"
        style={{ background: grad, boxShadow: hov ? `0 8px 24px ${glow}, inset 0 1px 0 rgba(255,255,255,.28)` : `0 4px 14px ${glow}, inset 0 1px 0 rgba(255,255,255,.2)`, transform: hov ? 'translateY(-2px)' : 'none', transition:'all .18s ease' }}>
        <TileIcon name={icon} />
      </div>
      <span style={{ fontSize:9.5, color:'rgba(148,163,184,.65)', fontWeight:600, textAlign:'center', maxWidth:64, lineHeight:1.3, letterSpacing:'0.01em' }}>{label}</span>
    </button>
  )
}

/* ── Task Detail Modal ───────────────────────────────────────── */
function TaskModal({ task, onClose, onStatusChange }) {
  if (!task) return null
  const phase = CLOSE_PHASES.find(p => p.id === task.phase)

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }} onClick={onClose}>
      <div className="w-full rounded-t-[24px] overflow-hidden" style={{ background:'rgba(10,18,35,.97)', border:'1px solid rgba(255,255,255,.08)', boxShadow:'0 -12px 48px rgba(0,0,0,.7)', animation:'slide-up .26s cubic-bezier(.16,1,.3,1)', maxHeight:'80vh' }}
        onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,.1)', margin:'14px auto 0' }}/>

        {/* Header */}
        <div className="px-6 pt-4 pb-4" style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-md px-2 py-0.5" style={{ fontSize:9, fontFamily:'ui-monospace,monospace', letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(14,165,233,.1)', color:'#0ea5e9', border:'1px solid rgba(14,165,233,.15)' }}>Phase {task.phase} · {phase?.name}</span>
            <StatusBadge status={task.status} />
          </div>
          <h3 style={{ fontSize:17, fontWeight:800, color:'rgba(248,250,252,.95)', letterSpacing:'-0.01em', lineHeight:1.25 }}>{task.label}</h3>
          <p style={{ fontSize:11, color:'rgba(148,163,184,.55)', marginTop:4, fontFamily:'ui-monospace,monospace' }}>{task.owner} · Due {task.due}</p>
        </div>

        {/* Detail */}
        <div className="px-6 py-4">
          <p style={{ fontSize:12, color:'rgba(148,163,184,.7)', lineHeight:1.65 }}>{task.detail}</p>
        </div>

        {/* Status actions */}
        <div className="px-6 pb-8">
          <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.14em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:10 }}>Update Status</p>
          <div className="flex gap-2">
            {['done','progress','pending'].map(s => (
              <button key={s} onClick={() => { onStatusChange(task.id, s); onClose() }}
                className="flex-1 py-2.5 rounded-xl font-bold transition-all"
                style={{ fontSize:11, background: task.status === s ? (s==='done'?'rgba(16,185,129,.15)':s==='progress'?'rgba(14,165,233,.15)':'rgba(100,116,139,.15)') : 'rgba(255,255,255,.04)', color: task.status === s ? (s==='done'?'#34d399':s==='progress'?'#38bdf8':'#94a3b8') : 'rgba(100,116,139,.5)', border:`1px solid ${task.status === s ? (s==='done'?'rgba(16,185,129,.25)':s==='progress'?'rgba(14,165,233,.25)':'rgba(100,116,139,.2)') : 'rgba(255,255,255,.06)'}` }}>
                {s === 'done' ? '✓ Done' : s === 'progress' ? '↻ In Progress' : '○ Pending'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Screen ─────────────────────────────────────────────── */
export default function DashboardScreen() {
  const { navigate, org, closeTasks, activity, updateCloseTask } = useAppStore()
  const [selectedTask, setSelectedTask] = useState(null)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative">

      {/* ── Page header ── */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:4 }}>
          {org.name} · {org.fiscal}
        </p>
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:900, color:'rgba(248,250,252,.95)', letterSpacing:'-0.03em', lineHeight:1 }}>
            Monthly Close
          </h1>
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.15)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse-dot 2s ease-in-out infinite' }}/>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.12em', color:'rgba(16,185,129,.8)', textTransform:'uppercase' }}>
              {org.daysLeft}d left
            </span>
          </div>
        </div>
        <p style={{ fontSize:11, color:'rgba(100,116,139,.5)', marginTop:2 }}>{greeting} — close due {org.closeDate}</p>
      </div>

      {/* ── Hospital KPI strip ── */}
      <HospitalKPIs />

      {/* ── Monthly close hero card ── */}
      <CloseHeroCard org={org} tasks={closeTasks} onTaskClick={setSelectedTask} />

      {/* ── Bottom two-col ── */}
      <div className="px-4 pb-28 md:pb-10 flex flex-col gap-4">

        {/* Activity + Modules side-by-side on desktop */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* Activity feed */}
          <div className="flex-1">
            <ActivityFeed activity={activity} />
          </div>

          {/* Quick navigation modules */}
          <div className="md:w-52 flex-shrink-0">
            <div className="rounded-2xl p-4"
              style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)', backdropFilter:'blur(16px)', boxShadow:'0 4px 20px rgba(0,0,0,.35)' }}>
              <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:14 }}>Modules</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px 4px' }} className="md:grid-cols-2">
                {MODULE_TILES.map(t => (
                  <ModuleTile key={t.id} {...t} onClick={() => navigate(t.nav)} />
                ))}
              </div>
              <button onClick={() => navigate('chat')} className="w-full mt-4 py-2.5 rounded-xl font-bold"
                style={{ fontSize:11, background:'linear-gradient(135deg,rgba(14,165,233,.12),rgba(16,185,129,.12))', color:'rgba(148,163,184,.8)', border:'1px solid rgba(255,255,255,.07)' }}>
                Ask AI Assistant →
              </button>
            </div>
          </div>
        </div>

        {/* Dept P&L revenue preview */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)', backdropFilter:'blur(16px)', boxShadow:'0 4px 20px rgba(0,0,0,.35)' }}>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom:'1px solid rgba(255,255,255,.05)' }}>
            <div>
              <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>Revenue by Service Line</span>
              <p style={{ fontSize:11, color:'rgba(100,116,139,.4)', marginTop:1 }}>{HOSPITAL_PL.period} · Actual vs Budget</p>
            </div>
            <button onClick={() => navigate('finance')} style={{ fontSize:10, color:'rgba(14,165,233,.7)', fontFamily:'ui-monospace,monospace', background:'none', border:'none', cursor:'pointer', letterSpacing:'0.05em' }}>View P&L →</button>
          </div>
          <div className="px-4 pb-2">
            {HOSPITAL_PL.revenue.map((r, i) => {
              const varPct = r.budget > 0 ? ((r.actual - r.budget) / r.budget * 100) : 0
              const pos = varPct >= 0
              const barMax = Math.max(...HOSPITAL_PL.revenue.map(x => x.budget))
              return (
                <div key={r.id} className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: i < HOSPITAL_PL.revenue.length - 1 ? '1px solid rgba(255,255,255,.03)' : 'none' }}>
                  <span style={{ fontSize:11, color:'rgba(148,163,184,.65)', width:120, flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.dept}</span>
                  <div className="flex-1 flex items-center gap-1.5">
                    {/* Budget bar (background) */}
                    <div className="flex-1 relative" style={{ height:5, borderRadius:3, background:'rgba(255,255,255,.05)' }}>
                      <div style={{ position:'absolute', left:0, top:0, height:'100%', borderRadius:3, width:`${(r.budget/barMax)*100}%`, background:'rgba(255,255,255,.07)' }}/>
                      <div style={{ position:'absolute', left:0, top:0, height:'100%', borderRadius:3, width:`${(r.actual/barMax)*100}%`, background: pos ? 'rgba(52,211,153,.5)' : 'rgba(251,113,133,.5)', transition:'width .8s ease' }}/>
                    </div>
                  </div>
                  <span style={{ fontFamily:'ui-monospace,monospace', fontSize:10.5, fontWeight:700, color:'rgba(226,232,240,.7)', width:46, textAlign:'right', flexShrink:0 }}>${(r.actual).toLocaleString()}K</span>
                  <span style={{ fontFamily:'ui-monospace,monospace', fontSize:10, fontWeight:700, color: pos ? '#34d399' : '#fb7185', width:40, textAlign:'right', flexShrink:0 }}>
                    {pos ? '+' : ''}{varPct.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={(id, status) => { updateCloseTask(id, status) }}
        />
      )}
    </div>
  )
}
