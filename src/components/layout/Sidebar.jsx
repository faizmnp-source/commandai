import useAppStore from '../../store/appStore'

/* ── Inline SVG Icons ─────────────────────────────────────── */
const HomeIcon     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const UsersIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const DollarIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
const KanbanIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/></svg>
const SparklesIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>
const SettingsIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const LogoutIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

/* ── Nav structure ─────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'home', label: 'Dashboard', Icon: HomeIcon },
    ],
  },
  {
    label: 'Modules',
    items: [
      { id: 'crm',      label: 'CRM',       Icon: UsersIcon  },
      { id: 'finance',  label: 'Finance',    Icon: DollarIcon },
      { id: 'projects', label: 'Projects',   Icon: KanbanIcon },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'chat', label: 'AI Assistant', Icon: SparklesIcon },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'more', label: 'Settings', Icon: SettingsIcon },
    ],
  },
]

/* ── Logo ─────────────────────────────────────────────────── */
function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon mark */}
      <div className="relative flex-shrink-0 w-9 h-9">
        <div
          className="absolute inset-0 rounded-[11px]"
          style={{ background: 'linear-gradient(135deg, #059669, #34d399)', boxShadow: '0 4px 14px rgba(16,185,129,.35)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
      </div>
      {/* Wordmark */}
      <div>
        <p className="text-white font-display font-bold text-[15px] leading-tight tracking-tight">CommandAI</p>
        <p style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(148,163,184,.6)' }} className="font-medium uppercase">Enterprise OS</p>
      </div>
    </div>
  )
}

/* ── Main Sidebar ─────────────────────────────────────────── */
export default function Sidebar() {
  const { currentScreen, navigate, user, logout } = useAppStore()

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40"
      style={{
        background: 'linear-gradient(175deg, #0a0f1e 0%, #0f1629 45%, #111831 100%)',
        borderRight: '1px solid rgba(255,255,255,.05)',
      }}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,.35) 50%, transparent 100%)' }}
      />

      {/* Brand */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <BrandLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto no-scrollbar space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            {/* Section label */}
            <p
              className="px-3 mb-1 font-semibold uppercase select-none"
              style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(100,116,139,.55)' }}
            >
              {section.label}
            </p>

            <div className="space-y-0.5">
              {section.items.map(({ id, label, Icon }) => {
                const active = currentScreen === id
                return (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 relative group"
                    style={{
                      padding: '9px 12px',
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      color: active ? '#ffffff' : 'rgba(148,163,184,.75)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(16,185,129,.12), rgba(16,185,129,.06))'
                        : 'transparent',
                      boxShadow: active
                        ? 'inset 0 0 0 1px rgba(16,185,129,.18), 0 1px 8px rgba(16,185,129,.06)'
                        : 'none',
                    }}
                  >
                    {/* Left accent bar on active */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                        style={{ width: 3, height: 20, background: 'linear-gradient(180deg, #34d399, #10b981)' }}
                      />
                    )}

                    {/* Hover background (only when not active) */}
                    {!active && (
                      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(255,255,255,.04)' }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      className="flex-shrink-0 transition-colors"
                      style={{ color: active ? '#34d399' : 'rgba(100,116,139,.7)' }}
                    >
                      <Icon />
                    </span>

                    {/* Label */}
                    <span className="flex-1 leading-none">{label}</span>

                    {/* Active dot */}
                    {active && (
                      <span
                        className="flex-shrink-0 rounded-full"
                        style={{ width: 5, height: 5, background: '#34d399', boxShadow: '0 0 6px rgba(52,211,153,.6)' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,.05)', margin: '0 16px' }} />

      {/* User Profile footer */}
      <div className="p-3">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all cursor-pointer group"
          style={{ ':hover': { background: 'rgba(255,255,255,.05)' } }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Avatar */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)', boxShadow: '0 2px 8px rgba(16,185,129,.3)' }}
          >
            {(user?.name || 'F')[0].toUpperCase()}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-tight truncate" style={{ color: 'rgba(226,232,240,.9)' }}>
              {user?.name || 'Faizan'}
            </p>
            <p className="text-[10px] leading-tight truncate mt-0.5" style={{ color: 'rgba(100,116,139,.6)' }}>
              {user?.email || 'faiz.mnp@gmail.com'}
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center justify-center w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            title="Sign out"
            style={{ color: 'rgba(148,163,184,.6)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,.6)'; }}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  )
}
