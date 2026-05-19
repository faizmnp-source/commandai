import useAppStore from '../../store/appStore'

/* ── SVG Icons ────────────────────────────────────────────── */
const HomeIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const UsersIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const DollarIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
const KanbanIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v12"/></svg>
const SparklesIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>

const TABS = [
  { id: 'home',     label: 'Home',    Icon: HomeIcon   },
  { id: 'crm',      label: 'CRM',     Icon: UsersIcon  },
  { id: 'chat',     label: 'AI',      Icon: SparklesIcon, elevated: true },
  { id: 'finance',  label: 'Finance', Icon: DollarIcon },
  { id: 'projects', label: 'Tasks',   Icon: KanbanIcon },
]

export default function BottomNav() {
  const { currentScreen, navigate } = useAppStore()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex items-end justify-around"
      style={{
        background: 'rgba(10, 15, 30, 0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,.06)',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      {TABS.map(({ id, label, Icon, elevated }) => {
        const active = currentScreen === id

        /* ── Elevated center AI button ── */
        if (elevated) {
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="flex flex-col items-center justify-center -mt-6 flex-shrink-0 active:scale-95 transition-transform"
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: active
                  ? 'linear-gradient(135deg, #047857, #10b981)'
                  : 'linear-gradient(135deg, #059669, #34d399)',
                boxShadow: '0 4px 16px rgba(16,185,129,.4), 0 0 0 3px rgba(10,15,30,.97), 0 0 0 4px rgba(16,185,129,.2)',
              }}
            >
              <Icon />
            </button>
          )
        }

        /* ── Regular tab ── */
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="flex flex-col items-center gap-1 rounded-xl active:bg-white/5 transition-all flex-1"
            style={{ padding: '4px 0 2px' }}
          >
            {/* Active indicator line */}
            <span
              className="block rounded-full transition-all duration-200"
              style={{
                width: active ? 20 : 4,
                height: 2,
                marginBottom: 4,
                background: active ? '#10b981' : 'transparent',
                boxShadow: active ? '0 0 8px rgba(16,185,129,.6)' : 'none',
              }}
            />
            {/* Icon */}
            <span style={{ color: active ? '#ffffff' : 'rgba(100,116,139,.7)' }}>
              <Icon />
            </span>
            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: active ? '#34d399' : 'rgba(100,116,139,.6)',
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
