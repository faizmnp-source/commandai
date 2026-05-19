import useAppStore from '../store/appStore'

const MODULES = [
  { icon: '🏠', label: 'Dashboard',  screen: 'home' },
  { icon: '👥', label: 'CRM',        screen: 'crm' },
  { icon: '💰', label: 'Finance',    toast: 'Finance — Phase 2' },
  { icon: '📋', label: 'Projects',   screen: 'projects' },
  { icon: '🧑‍💼', label: 'Team / HR', toast: 'Team / HR — Phase 3' },
  { icon: '📦', label: 'Inventory',  toast: 'Inventory — Phase 3' },
  { icon: '📊', label: 'Analytics',  toast: 'Analytics — Phase 3' },
  { icon: '💬', label: 'Comms',      toast: 'Comms — Phase 3' },
  { icon: '⚡', label: 'Automations', toast: 'Automations — Phase 4' },
]

const SETTINGS = [
  { icon: '👤', label: 'Account & Profile',   toast: 'Account settings' },
  { icon: '🏢', label: 'Business Settings',   toast: 'Business settings' },
  { icon: '🔔', label: 'Notifications',        toast: 'Notification preferences' },
  { icon: '🔗', label: 'Integrations',         toast: 'Integrations — Phase 2' },
]

export default function MoreScreen() {
  const { user, navigate, showToast, logout } = useAppStore()

  const handleModule = (mod) => {
    if (mod.screen) navigate(mod.screen)
    else if (mod.toast) showToast(mod.toast)
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-[84px]">

      {/* Profile banner */}
      <div className="flex items-center gap-[14px] px-[18px] py-[18px] border-b border-em-100"
           style={{ background: 'linear-gradient(135deg, #ecfdf5, white)' }}>
        <div
          className="w-[54px] h-[54px] rounded-[17px] flex items-center justify-center
                     text-[21px] font-bold text-white font-display"
          style={{ background: 'linear-gradient(135deg, #047857, #34d399)' }}
        >
          {user.avatar}
        </div>
        <div>
          <div className="font-display text-[17px] font-bold">{user.name}</div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">{user.email}</div>
          <div className="inline-block mt-[5px] px-2 py-0.5 bg-em-100 rounded-[6px]
                          text-[10px] font-bold text-em-700 uppercase tracking-[.5px]">
            {user.plan} Plan
          </div>
        </div>
      </div>

      {/* All modules */}
      <div className="px-[18px] pt-[14px] pb-[8px] text-[10.5px] font-bold text-slate-300
                      uppercase tracking-[.6px]">
        All Modules
      </div>
      <div className="grid grid-cols-3 gap-[10px] px-[18px]">
        {MODULES.map((mod) => (
          <button
            key={mod.label}
            onClick={() => handleModule(mod)}
            className="flex flex-col items-center gap-[7px] py-[14px] px-2 bg-slate-50
                       border-[1.5px] border-slate-100 rounded-[14px] cursor-pointer
                       transition-all active:scale-[.95] active:bg-em-50 active:border-em-200
                       bg-transparent outline-none"
          >
            <span className="text-[24px]">{mod.icon}</span>
            <span className="text-[11px] font-semibold text-slate-600 text-center">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="px-[18px] pt-[16px] pb-[8px] text-[10.5px] font-bold text-slate-300
                      uppercase tracking-[.6px]">
        Settings
      </div>
      <div className="px-[18px] flex flex-col gap-[2px]">
        {SETTINGS.map((item) => (
          <button
            key={item.label}
            onClick={() => showToast(item.toast)}
            className="flex items-center gap-[12px] px-[14px] py-[13px] bg-slate-50
                       rounded-[14px] cursor-pointer transition-all active:bg-em-50
                       w-full text-left border-none outline-none"
          >
            <span className="text-[18px]">{item.icon}</span>
            <span className="flex-1 text-[13.5px] font-medium text-slate-900">{item.label}</span>
            <span className="text-[11px] text-slate-300">›</span>
          </button>
        ))}
        <button
          onClick={() => { showToast('Signed out'); setTimeout(logout, 800) }}
          className="flex items-center gap-[12px] px-[14px] py-[13px] bg-slate-50
                     rounded-[14px] cursor-pointer transition-all active:bg-red-50
                     w-full text-left border-none outline-none"
        >
          <span className="text-[18px]">🚪</span>
          <span className="flex-1 text-[13.5px] font-medium text-red-500">Sign Out</span>
          <span className="text-[11px] text-slate-300">›</span>
        </button>
      </div>

    </div>
  )
}
