import useAppStore from '../../store/appStore'

export default function TopHeader({ title, subtitle, children }) {
  const { user, navigate, showToast } = useAppStore()

  return (
    <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-50
                    bg-white flex-shrink-0 z-10">
      <div>
        <h2 className="font-display text-[21px] font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11.5px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex gap-2 items-center">
        {children}
        <button
          onClick={() => showToast('3 new notifications')}
          className="w-9 h-9 rounded-[11px] bg-slate-50 border border-slate-100
                     flex items-center justify-center text-[17px] cursor-pointer relative
                     transition-all active:scale-95"
        >
          🔔
          <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-em-500 rounded-full border-2 border-white" />
        </button>
        <button
          onClick={() => navigate('more')}
          className="w-9 h-9 rounded-[11px] flex items-center justify-center text-[14px]
                     font-bold text-white font-display cursor-pointer transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #047857, #34d399)' }}
        >
          {user.avatar}
        </button>
      </div>
    </div>
  )
}
