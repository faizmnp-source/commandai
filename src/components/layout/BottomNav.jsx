import useAppStore from '../../store/appStore'

const NAV_ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Home'     },
  { id: 'crm',      icon: '👥', label: 'CRM'      },
  { id: 'chat',     icon: null,  label: 'AI', isAI: true },
  { id: 'projects', icon: '📋', label: 'Projects' },
  { id: 'more',     icon: '⋯',  label: 'More'     },
]

export default function BottomNav() {
  const { currentScreen, navigate } = useAppStore()

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-white border-t border-slate-100
                    flex items-center justify-around px-1.5 z-[100] safe-bottom"
         style={{ boxShadow: '0 -4px 22px rgba(0,0,0,.07)' }}>
      {NAV_ITEMS.map((item) =>
        item.isAI ? (
          <button
            key={item.id}
            onClick={() => navigate('chat')}
            className="flex flex-col items-center gap-[3px] cursor-pointer bg-transparent border-none outline-none"
          >
            <div
              className="w-[46px] h-[46px] rounded-[16px] flex items-center justify-center text-[20px]
                         -mt-[10px] transition-transform duration-150 active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #065f46, #10b981)',
                boxShadow: '0 4px 16px rgba(5,150,105,.38)',
              }}
            >
              🧠
            </div>
            <span className="text-[10px] font-bold text-em-600">AI</span>
          </button>
        ) : (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-[3px] px-[14px] py-[7px] rounded-xl
                       cursor-pointer relative min-w-[52px] transition-all duration-150
                       bg-transparent border-none outline-none"
          >
            {currentScreen === item.id && (
              <span className="absolute top-[2px] w-[5px] h-[5px] bg-em-500 rounded-full" />
            )}
            <span className={`text-[20px] leading-none transition-transform duration-150
                              ${currentScreen === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold transition-colors duration-150
                              ${currentScreen === item.id ? 'text-em-600' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        )
      )}
    </div>
  )
}
