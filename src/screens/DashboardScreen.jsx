import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'
import useCounter from '../hooks/useCounter'

function StatCard({ label, value, prefix = '', suffix = '', delta, color = 'em' }) {
  const count = useCounter(value, 1400)
  const colors = {
    em:  { bg: 'bg-em-50',      text: 'text-em-700',      ring: 'ring-em-200'      },
    sky: { bg: 'bg-sky-50',     text: 'text-sky-700',     ring: 'ring-sky-200'     },
    vio: { bg: 'bg-violet-50',  text: 'text-violet-700',  ring: 'ring-violet-200'  },
    ora: { bg: 'bg-orange-50',  text: 'text-orange-700',  ring: 'ring-orange-200'  },
  }
  const c = colors[color] || colors.em
  return (
    <div className={`${c.bg} ring-1 ${c.ring} rounded-2xl p-4 flex flex-col gap-1`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${c.text}`}>{prefix}{count.toLocaleString()}{suffix}</p>
      {delta && <p className="text-xs text-slate-400">{delta}</p>}
    </div>
  )
}

const QUICK = [
  { icon: '🤖', label: 'Ask AI',   screen: 'chat' },
  { icon: '🧾', label: 'Invoice',  screen: 'finance' },
  { icon: '➕', label: 'Add Lead', screen: 'crm' },
  { icon: '✅', label: 'New Task', screen: 'projects' },
  { icon: '📊', label: 'Reports',  screen: 'finance' },
  { icon: '💸', label: 'Expense',  screen: 'finance' },
]

const ACTIVITY = [
  { icon: '💰', title: 'Invoice #1042 paid by Apex Co.',       sub: '$1,800 received · Finance',      time: '2m' },
  { icon: '👤', title: 'New lead: Sarah Johnson (TechCorp)',    sub: 'Added to pipeline · CRM',         time: '1h' },
  { icon: '✅', title: 'Task "Q2 Report" completed',            sub: 'By Ahmed K. · Projects',          time: '3h' },
  { icon: '📦', title: 'Low stock: Product SKU-204',           sub: '8 units left · Inventory',        time: '5h' },
  { icon: '🤖', title: 'AI sent 3 automated follow-ups',       sub: 'TechCorp, Zara Ltd, BuildCo · CRM', time: '9h' },
]

export default function DashboardScreen() {
  const { navigate, user } = useAppStore()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour  = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <TopHeader title="Dashboard" subtitle={today} />

      {/* Desktop: max-width content wrapper */}
      <div className="flex-1 px-4 pb-24 md:pb-8 md:px-8 md:max-w-5xl md:w-full space-y-5 pt-1">

        {/* Greeting */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-sm font-medium opacity-80">{greeting}, {user?.name?.split(' ')[0] || 'Faizan'} 👋</p>
          <p className="text-lg font-bold mt-1">Here's your business snapshot</p>
          <p className="text-xs opacity-70 mt-1">3 deals need attention · 2 invoices overdue</p>
        </div>

        {/* KPI grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Revenue"        value={68300} prefix="$"  delta="↑ 12% vs last month" color="em"  />
          <StatCard label="Active Tasks"   value={12}               delta="3 due today"           color="sky" />
          <StatCard label="Customers"      value={48}               delta="+8 this week"          color="vio" />
          <StatCard label="Pending Invoices" value={4200} prefix="$" delta="$4.2k overdue"        color="ora" />
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Quick Actions</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {QUICK.map(({ icon, label, screen }) => (
              <button key={label} onClick={() => navigate(screen)}
                className="bg-white border border-slate-200 rounded-2xl py-4 flex flex-col items-center gap-2
                           hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: 2-col layout for activity + AI brief */}
        <div className="md:grid md:grid-cols-2 md:gap-5 space-y-5 md:space-y-0">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">Recent Activity</p>
              <button className="text-xs text-emerald-600 font-semibold">See all</button>
            </div>
            <div className="divide-y divide-slate-100">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="text-xl flex-shrink-0 mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 truncate">{a.sub}</p>
                  </div>
                  <span className="text-xs text-slate-300 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Brief */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-base">🤖</div>
              <div>
                <p className="text-sm font-bold">AI Daily Brief</p>
                <p className="text-[10px] text-slate-400">CommandAI Analysis</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-semibold text-emerald-400 text-xs mb-1">💡 Top Priority</p>
                <p className="text-xs text-slate-300 leading-relaxed">TechCorp proposal is 2 days overdue. Send follow-up now to keep the $12k deal alive.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-semibold text-amber-400 text-xs mb-1">⚠️ Cash Flow Alert</p>
                <p className="text-xs text-slate-300 leading-relaxed">GreenPath invoice ($2.5k) is 5 days overdue. Consider sending a reminder today.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-semibold text-sky-400 text-xs mb-1">📈 Opportunity</p>
                <p className="text-xs text-slate-300 leading-relaxed">Nova Studios deposit received. Kickoff the project to maintain momentum.</p>
              </div>
            </div>
            <button onClick={() => navigate('chat')} className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold transition-colors">
              Ask AI anything →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}