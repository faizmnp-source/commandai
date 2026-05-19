import TopHeader from '../components/layout/TopHeader'
import StatCard from '../components/dashboard/StatCard'
import useAppStore from '../store/appStore'

const QUICK_ACTIONS = [
  { icon: '🤖', label: 'Ask AI',   screen: 'chat' },
  { icon: '📄', label: 'Invoice',  screen: null, toast: 'Invoice creator — Phase 2' },
  { icon: '➕', label: 'Add Lead', screen: 'crm' },
  { icon: '📋', label: 'New Task', screen: 'projects' },
  { icon: '📊', label: 'Reports',  screen: null, toast: 'Analytics — Phase 3' },
  { icon: '💸', label: 'Expense',  screen: null, toast: 'Expense tracking — Phase 2' },
  { icon: '🧑‍💼', label: 'Team',   screen: null, toast: 'Team module — Phase 3' },
]

export default function DashboardScreen() {
  const { user, metrics, activity, navigate, showToast } = useAppStore()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const handleAction = (item) => {
    if (item.screen) navigate(item.screen)
    else if (item.toast) showToast(item.toast)
  }

  return (
    <>
      <TopHeader title="Dashboard" subtitle={today} />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-[84px]">

        {/* Greeting */}
        <div className="px-[18px] pt-[18px] pb-0 animate-fade-up">
          <h2 className="font-display text-[25px] font-bold tracking-tight leading-[1.2]">
            Good morning, <span className="text-em-600">{user.name}</span> 👋
          </h2>
          <p className="text-[13px] text-slate-400 mt-[5px]">Here's your business at a glance</p>
        </div>

        {/* AI Brief */}
        <div
          className="mx-[18px] mt-[14px] rounded-[28px] p-[18px] cursor-pointer relative overflow-hidden
                     transition-transform duration-150 active:scale-[.98] animate-fade-up"
          style={{
            background: 'linear-gradient(145deg, #065f46 0%, #047857 45%, #058757 100%)',
            animationDelay: '.05s',
          }}
          onClick={() => navigate('chat')}
        >
          {/* Glow blobs */}
          <div className="absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(52,211,153,.25) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-8 left-5 w-[90px] h-[90px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(16,185,129,.18) 0%, transparent 70%)' }} />

          <div className="flex items-center gap-[5px] bg-white/[.14] rounded-full px-[10px] py-[3px]
                          w-fit text-[10px] font-bold text-white/90 uppercase tracking-[.6px] mb-[10px]">
            <span className="w-[5px] h-[5px] bg-green-400 rounded-full animate-pulse-dot" />
            AI Daily Brief
          </div>

          <p className="text-[13.5px] text-white/92 leading-relaxed relative z-10">
            Revenue is up <strong className="text-green-400">12%</strong> from last week.
            You have 3 overdue invoices totalling $4,200. Your top lead{' '}
            <strong className="text-white">TechCorp</strong> hasn't been followed up in 5 days — tap to draft a message.
          </p>

          <div className="flex items-center justify-between mt-[13px] relative z-10">
            <span className="text-[12px] text-white/65 font-medium">Tap to ask AI anything →</span>
            <span className="text-[20px]">🧠</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-[10px] px-[18px] mt-[14px] animate-fade-up"
             style={{ animationDelay: '.10s' }}>
          <StatCard
            emoji="💰" target={metrics.revenue.value}
            prefix="$" suffix="k"
            label={metrics.revenue.label}
            delta={metrics.revenue.delta} positive={metrics.revenue.positive}
            onClick={() => showToast('Finance module — Phase 2')}
          />
          <StatCard
            emoji="✅" target={metrics.tasks.value}
            label={metrics.tasks.label}
            delta={metrics.tasks.delta} positive={metrics.tasks.positive}
            onClick={() => navigate('projects')}
          />
          <StatCard
            emoji="👥" target={metrics.customers.value}
            label={metrics.customers.label}
            delta={metrics.customers.delta} positive={metrics.customers.positive}
            onClick={() => navigate('crm')}
          />
          <StatCard
            emoji="📄" target={metrics.invoices.value}
            label={metrics.invoices.label}
            delta={metrics.invoices.delta} positive={metrics.invoices.positive}
            onClick={() => showToast('Finance module — Phase 2')}
          />
        </div>

        {/* Quick Actions */}
        <div className="px-[18px] mt-[18px] mb-[10px] flex items-center justify-between animate-fade-up"
             style={{ animationDelay: '.15s' }}>
          <h3 className="font-display text-[15px] font-bold">Quick Actions</h3>
        </div>
        <div className="flex gap-[9px] px-[18px] overflow-x-auto no-scrollbar pb-1
                        animate-fade-up" style={{ animationDelay: '.15s' }}>
          {QUICK_ACTIONS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleAction(item)}
              className="flex flex-col items-center gap-[6px] min-w-[62px] cursor-pointer
                         flex-shrink-0 bg-transparent border-none outline-none"
            >
              <div className="w-[50px] h-[50px] rounded-[15px] bg-em-50 border-[1.5px] border-em-100
                              flex items-center justify-center text-[20px] transition-all duration-150
                              active:scale-[.91] active:bg-em-100">
                {item.icon}
              </div>
              <span className="text-[10.5px] text-slate-600 font-medium text-center whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="px-[18px] mt-[18px] flex items-center justify-between animate-fade-up"
             style={{ animationDelay: '.20s' }}>
          <h3 className="font-display text-[15px] font-bold">Recent Activity</h3>
          <button className="text-[12px] text-em-600 font-semibold bg-transparent border-none cursor-pointer"
                  onClick={() => showToast('Full activity log — Phase 2')}>
            See all
          </button>
        </div>
        <div className="px-[18px] mt-[10px] flex flex-col animate-fade-up" style={{ animationDelay: '.25s' }}>
          {activity.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-[11px] py-[11px] cursor-pointer
                          ${i < activity.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="w-[34px] h-[34px] rounded-[10px] bg-em-50 flex items-center
                              justify-center text-[15px] flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-900 truncate">{item.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
              </div>
              <span className="text-[10px] text-slate-300 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
