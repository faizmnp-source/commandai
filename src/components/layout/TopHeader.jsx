import useAppStore from '../../store/appStore'

/* ── Icons ─────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

export default function TopHeader({ title, subtitle, action }) {
  const { user } = useAppStore()
  const initials = (user?.name || 'F')[0].toUpperCase()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 bg-white"
      style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(226,232,240,.8)',
      }}
    >
      {/* Left: Title + subtitle */}
      <div>
        <h1
          className="font-display font-bold leading-tight tracking-tight text-slate-900"
          style={{ fontSize: 19 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          className="icon-btn text-slate-400 hover:text-slate-700 rounded-xl"
          style={{ width: 34, height: 34 }}
        >
          <SearchIcon />
        </button>

        {/* Notifications */}
        <button
          className="icon-btn relative text-slate-400 hover:text-slate-700 rounded-xl"
          style={{ width: 34, height: 34 }}
        >
          <BellIcon />
          {/* Notification dot */}
          <span
            className="absolute rounded-full border-2 border-white"
            style={{ width: 7, height: 7, background: '#f43f5e', top: 7, right: 7 }}
          />
        </button>

        {/* Desktop: date chip */}
        <div
          className="hidden md:flex items-center ml-2 px-3 py-1.5 rounded-lg"
          style={{ background: '#f8fafc', border: '1px solid rgba(226,232,240,.8)' }}
        >
          <p className="text-xs font-medium" style={{ color: '#64748b' }}>{today}</p>
        </div>

        {/* Mobile: avatar */}
        <div
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ml-1 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #059669, #34d399)',
            boxShadow: '0 2px 8px rgba(16,185,129,.3)',
          }}
        >
          {initials}
        </div>

        {/* Optional right action slot */}
        {action && action}
      </div>
    </header>
  )
}
