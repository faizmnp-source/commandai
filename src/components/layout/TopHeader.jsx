import useAppStore from '../../store/appStore'

export default function TopHeader({ title, subtitle }) {
  const { user } = useAppStore()
  const initials = (user?.name || 'F')[0].toUpperCase()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header className="flex items-center justify-between px-5 pt-safe pb-4 pt-5 bg-white
                       md:px-8 md:pt-6 md:pb-5 md:border-b md:border-slate-200 flex-shrink-0">
      <div>
        <h1 className="text-[22px] md:text-2xl font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {/* Desktop: hide avatar (sidebar shows it) | Mobile: show avatar */}
      <div className="flex items-center gap-2 md:hidden">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100">
          <span className="text-xl">🔔</span>
        </button>
        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
      </div>
      {/* Desktop: show date */}
      <p className="hidden md:block text-sm text-slate-400">{today}</p>
    </header>
  )
}