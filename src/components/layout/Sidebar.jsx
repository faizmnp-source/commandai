import useAppStore from '../../store/appStore'

const NAV = [
  { id: 'home',     icon: '🏠', label: 'Dashboard'  },
  { id: 'crm',      icon: '👥', label: 'CRM'         },
  { id: 'finance',  icon: '💰', label: 'Finance'     },
  { id: 'projects', icon: '📋', label: 'Projects'    },
  { id: 'chat',     icon: '🤖', label: 'AI Assistant'},
  { id: 'more',     icon: '⚙️', label: 'Settings'   },
]

export default function Sidebar() {
  const { currentScreen, navigate, user, logout } = useAppStore()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 z-40 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg shadow-sm">⚡</div>
        <div>
          <p className="font-bold text-slate-800 text-sm leading-tight">CommandAI</p>
          <p className="text-[10px] text-slate-400">Business OS</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(item => {
          const active = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${active
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"/>}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(user?.name||'F')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name||'Faizan'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email||'faiz.mnp@gmail.com'}</p>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-rose-500 text-sm transition-colors" title="Sign out">
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}