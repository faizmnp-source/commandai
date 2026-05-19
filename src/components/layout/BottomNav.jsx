import useAppStore from '../../store/appStore'

const TABS = [
  { id: 'home',     icon: '🏠', label: 'Home'     },
  { id: 'crm',      icon: '👥', label: 'CRM'      },
  { id: 'chat',     icon: '🤖', label: 'AI',       elevated: true },
  { id: 'finance',  icon: '💰', label: 'Finance'  },
  { id: 'projects', icon: '📋', label: 'Projects' },
]

export default function BottomNav() {
  const { currentScreen, navigate } = useAppStore()
  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]
                    bg-white/90 backdrop-blur border-t border-slate-200 z-40
                    flex items-end justify-around px-2 pt-2"
         style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      {TABS.map(tab => {
        const active = currentScreen === tab.id
        if (tab.elevated) return (
          <button key={tab.id} onClick={() => navigate(tab.id)}
            className="-mt-5 w-14 h-14 rounded-full bg-emerald-600 shadow-lg
                       flex flex-col items-center justify-center
                       active:scale-95 transition-transform">
            <span className="text-2xl">{tab.icon}</span>
          </button>
        )
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl
                       active:bg-slate-100 transition-colors min-w-[52px]">
            <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span className={`text-[10px] font-semibold ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}