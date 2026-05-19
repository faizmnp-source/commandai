import useAppStore from '../store/appStore'
import TopHeader from '../components/layout/TopHeader'
import { useCounter } from '../hooks/useCounter'

/* ── Module tiles ─────────────────────────────────────────── */
const MODULES = [
  {
    id: 'finance',
    label: 'Financial Planning',
    accent: '#059669',
    bg: '#ecfdf5',
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    metric: '$68.3k', sub: 'Monthly Revenue', status: 'Profitable', ok: true,
  },
  {
    id: 'crm',
    label: 'CRM & Sales',
    accent: '#2563eb',
    bg: '#eff6ff',
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    metric: '$82k', sub: 'Active Pipeline', status: 'On Track', ok: true,
  },
  {
    id: 'projects',
    label: 'Project Management',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18M15 3v12"/>
      </svg>
    ),
    metric: '12', sub: 'Open Tasks', status: '3 Overdue', ok: false,
  },
  {
    id: 'chat',
    label: 'AI Assistant',
    accent: '#d97706',
    bg: '#fffbeb',
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
      </svg>
    ),
    metric: 'Ask AI', sub: 'Powered by Claude', status: 'Active', ok: true,
  },
]

const ACTIVITY = [
  { accent: '#059669', title: 'Invoice #1042 paid by Apex Co.',      sub: '$1,800 · Finance',    time: '2m' },
  { accent: '#2563eb', title: 'New lead: Sarah Johnson (TechCorp)',  sub: '$12k · CRM Pipeline', time: '1h' },
  { accent: '#7c3aed', title: 'Task "Q2 Report" marked complete',    sub: 'Projects · Ahmed K.', time: '3h' },
  { accent: '#d97706', title: 'AI sent 3 automated follow-ups',      sub: 'TechCorp, Zara Ltd',  time: '9h' },
  { accent: '#059669', title: 'Nova Studios deposit received',        sub: '$5,000 · Finance',    time: '1d' },
]

/* ── KPI Tile ─────────────────────────────────────────────── */
function KpiTile({ label, value, prefix = '', suffix = '', accent, bg }) {
  const n = useCounter(value, 1400)
  return (
    <div className="flex-1 rounded-[14px] p-3 text-center" style={{ background: bg, border: `1px solid ${accent}22` }}>
      <p className="font-display font-bold" style={{ fontSize: 17, color: accent, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        {prefix}{typeof value === 'number' ? n.toLocaleString() : value}{suffix}
      </p>
      <p className="mt-0.5 font-semibold uppercase" style={{ fontSize: 9, letterSpacing: '0.09em', color: '#94a3b8' }}>{label}</p>
    </div>
  )
}

/* ── Module Tile ──────────────────────────────────────────── */
function ModuleTile({ id, label, accent, bg, Icon, metric, sub, status, ok, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-left rounded-2xl p-4 w-full active:scale-[.97] transition-all relative overflow-hidden group"
      style={{
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.05)',
      }}
    >
      {/* Color top strip — shows on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl transition-opacity duration-200 opacity-0 group-hover:opacity-100"
        style={{ background: accent }} />

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
        style={{ background: bg, color: accent }}>
        <Icon />
      </div>

      {/* Label */}
      <p className="font-semibold leading-tight mb-1" style={{ fontSize: 11, color: '#64748b' }}>{label}</p>

      {/* Metric */}
      <p className="font-display font-bold leading-none" style={{ fontSize: 20, color: '#0f172a', letterSpacing: '-0.03em' }}>{metric}</p>
      <p className="mt-1" style={{ fontSize: 10, color: '#94a3b8' }}>{sub}</p>

      {/* Status */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ok ? '#22c55e' : '#f59e0b' }} />
        <span className="font-semibold" style={{ fontSize: 10, color: ok ? '#16a34a' : '#d97706' }}>{status}</span>
      </div>
    </button>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function DashboardScreen() {
  const { navigate, user } = useAppStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ background: '#f0f4f8' }}>
      <TopHeader title="Home" subtitle="Business overview" />

      <div className="px-4 pb-28 md:pb-10 md:px-8 md:max-w-5xl md:w-full space-y-5 pt-2">

        {/* Greeting banner */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(120deg, #0c1220 0%, #1a2645 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,.15)',
          }}>
          <div className="absolute -right-4 -top-4 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,.12), transparent 70%)' }} />
          <p style={{ fontSize: 13, color: 'rgba(148,163,184,.75)', fontWeight: 500 }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Faizan'}
          </p>
          <p className="font-display font-bold mt-1" style={{ fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
            Here's your business snapshot
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['3 deals need attention', '2 invoices overdue', '5 tasks due today'].map(t => (
              <span key={t} className="font-semibold"
                style={{ fontSize: 10, background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', padding: '4px 10px', borderRadius: 8 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* KPI strip */}
        <div className="flex gap-2">
          <KpiTile label="Revenue"  value={68300}  prefix="$" accent="#059669" bg="#f0fdf4" />
          <KpiTile label="Pipeline" value="$82k"              accent="#2563eb" bg="#eff6ff" />
          <KpiTile label="Tasks"    value={12}                accent="#7c3aed" bg="#f5f3ff" />
          <KpiTile label="Cash"     value="$54k"              accent="#0284c7" bg="#f0f9ff" />
        </div>

        {/* Planning Modules grid */}
        <div>
          <p className="mb-3 font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.09em', color: '#94a3b8' }}>
            Planning Modules
          </p>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.map(m => (
              <ModuleTile key={m.id} {...m} onClick={() => navigate(m.id)} />
            ))}
          </div>
        </div>

        {/* Desktop 2-col for activity + AI */}
        <div className="md:grid md:grid-cols-2 md:gap-5 space-y-5 md:space-y-0">

          {/* Activity feed */}
          <div>
            <p className="mb-3 font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.09em', color: '#94a3b8' }}>
              Recent Activity
            </p>
            <div className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < ACTIVITY.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.accent }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ fontSize: 12, color: '#1e293b' }}>{a.title}</p>
                    <p className="truncate" style={{ fontSize: 10, color: '#94a3b8' }}>{a.sub}</p>
                  </div>
                  <span className="flex-shrink-0 font-medium" style={{ fontSize: 10, color: '#cbd5e1' }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Brief */}
          <div>
            <p className="mb-3 font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.09em', color: '#94a3b8' }}>
              AI Daily Brief
            </p>
            <div className="bg-white rounded-2xl p-4 space-y-2"
              style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              {[
                { accent: '#059669', label: 'Top Priority',    text: 'TechCorp proposal is 2 days overdue. Follow-up to keep the $12k deal alive.' },
                { accent: '#d97706', label: 'Cash Alert',      text: 'GreenPath invoice ($2.5k) is 5 days overdue. Send reminder today.' },
                { accent: '#2563eb', label: 'Opportunity',     text: 'Nova Studios deposit received — kick off the project now.' },
              ].map(({ accent, label, text }) => (
                <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: `${accent}09` }}>
                  <div className="w-[3px] rounded-full flex-shrink-0 self-stretch" style={{ background: accent }} />
                  <div>
                    <p className="font-bold uppercase mb-0.5" style={{ fontSize: 9, letterSpacing: '0.1em', color: accent }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{text}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('chat')}
                className="w-full py-2.5 rounded-xl font-bold text-white mt-1"
                style={{ fontSize: 13, background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 2px 10px rgba(5,150,105,.25)' }}>
                Ask AI anything →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
