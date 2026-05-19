import { useState } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'

/* ─── seed data ─────────────────────────────────────────────── */
const COLS = ['To Do', 'In Progress', 'Review', 'Done']

const TASKS_SEED = [
  { id: 1, col: 'To Do',       title: 'Design onboarding flow',       project: 'App Redesign',  priority: 'High',   assignee: 'AP', due: 'May 22' },
  { id: 2, col: 'To Do',       title: 'Set up CI/CD pipeline',        project: 'DevOps',        priority: 'Medium', assignee: 'CL', due: 'May 25' },
  { id: 3, col: 'In Progress', title: 'Build CRM module',             project: 'CommandAI',     priority: 'High',   assignee: 'FZ', due: 'May 20' },
  { id: 4, col: 'In Progress', title: 'Client proposal — TechCorp',   project: 'Sales',         priority: 'High',   assignee: 'SJ', due: 'May 21' },
  { id: 5, col: 'In Progress', title: 'Quarterly financial report',   project: 'Finance',       priority: 'Medium', assignee: 'DR', due: 'May 28' },
  { id: 6, col: 'Review',      title: 'Homepage redesign',            project: 'App Redesign',  priority: 'Low',    assignee: 'NS', due: 'May 19' },
  { id: 7, col: 'Review',      title: 'API documentation',            project: 'DevOps',        priority: 'Low',    assignee: 'FZ', due: 'May 23' },
  { id: 8, col: 'Done',        title: 'Kickoff meeting — GreenPath',  project: 'Sales',         priority: 'Medium', assignee: 'MR', due: 'May 15' },
  { id: 9, col: 'Done',        title: 'Set up Zustand store',         project: 'CommandAI',     priority: 'High',   assignee: 'FZ', due: 'May 14' },
]

const PROJECTS = [...new Set(TASKS_SEED.map(t => t.project))]

const PRIORITY_COLORS = {
  High:   'bg-rose-100 text-rose-600',
  Medium: 'bg-amber-100 text-amber-600',
  Low:    'bg-slate-100 text-slate-500',
}

const COL_COLORS = {
  'To Do':       'bg-slate-100 text-slate-600',
  'In Progress': 'bg-sky-100 text-sky-700',
  'Review':      'bg-violet-100 text-violet-700',
  'Done':        'bg-emerald-100 text-emerald-700',
}

const AVATAR_COLORS = ['bg-violet-500','bg-sky-500','bg-emerald-500','bg-orange-500','bg-fuchsia-500','bg-rose-500','bg-teal-500']
function avatarColor(str) {
  let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

/* ─── TaskCard ────────────────────────────────────────────────── */
function TaskCard({ task, onMove }) {
  const [open, setOpen] = useState(false)
  const colIdx = COLS.indexOf(task.col)

  return (
    <div
      onClick={() => setOpen(o => !o)}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 cursor-pointer active:scale-95 transition-transform"
    >
      <div className="flex items-start gap-2 mb-2">
        <p className="flex-1 text-sm font-semibold text-slate-800 leading-snug">{task.title}</p>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full ${avatarColor(task.assignee)} flex items-center justify-center text-white text-[10px] font-bold`}>
          {task.assignee}
        </div>
        <span className="text-xs text-slate-400 flex-1">{task.project}</span>
        <span className="text-xs text-slate-400">📅 {task.due}</span>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex gap-1.5 flex-wrap">
          {colIdx > 0 && (
            <button
              onClick={e => { e.stopPropagation(); onMove(task.id, -1) }}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium"
            >
              ← {COLS[colIdx - 1]}
            </button>
          )}
          {colIdx < COLS.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); onMove(task.id, 1) }}
              className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium"
            >
              {COLS[colIdx + 1]} →
            </button>
          )}
          {task.col === 'Done' && (
            <span className="text-xs text-emerald-600 font-semibold px-2 py-1">✓ Completed</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── KanbanView ──────────────────────────────────────────────── */
function KanbanView({ tasks, onMove }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
      {COLS.map(col => {
        const colTasks = tasks.filter(t => t.col === col)
        return (
          <div key={col} className="min-w-[200px] snap-start flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COL_COLORS[col]}`}>{col}</span>
              <span className="text-xs text-slate-400">{colTasks.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {colTasks.length === 0 && (
                <div className="h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-slate-300">Empty</span>
                </div>
              )}
              {colTasks.map(t => <TaskCard key={t.id} task={t} onMove={onMove} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── ListView ────────────────────────────────────────────────── */
function ListView({ tasks }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.project === filter)
  const groups = COLS.filter(c => filtered.some(t => t.col === c))

  return (
    <div className="px-4">
      {/* project filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        {['All', ...PROJECTS].map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${filter === p ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {groups.map(col => (
        <div key={col} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COL_COLORS[col]}`}>{col}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="flex flex-col gap-2">
            {filtered.filter(t => t.col === col).map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${t.priority === 'High' ? 'bg-rose-500' : t.priority === 'Medium' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.project} · {t.due}</p>
                </div>
                <div className={`w-7 h-7 rounded-full ${avatarColor(t.assignee)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {t.assignee}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── ProjectsScreen (main) ───────────────────────────────────── */
export default function ProjectsScreen() {
  const showToast = useAppStore(s => s.showToast)
  const [view, setView]     = useState('kanban') // kanban | list
  const [tasks, setTasks]   = useState(TASKS_SEED)
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', project: PROJECTS[0], priority: 'Medium' })

  function moveTask(id, dir) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx  = COLS.indexOf(t.col)
      const next = COLS[idx + dir]
      if (!next) return t
      showToast(`Moved to ${next}`)
      return { ...t, col: next }
    }))
  }

  function addTask() {
    if (!newTask.title.trim()) return
    setTasks(prev => [...prev, {
      id:       Date.now(),
      col:      'To Do',
      title:    newTask.title.trim(),
      project:  newTask.project,
      priority: newTask.priority,
      assignee: 'FZ',
      due:      'TBD',
    }])
    setNewTask({ title: '', project: PROJECTS[0], priority: 'Medium' })
    setShowAdd(false)
    showToast('Task created!')
  }

  /* stats */
  const done    = tasks.filter(t => t.col === 'Done').length
  const total   = tasks.length
  const inProg  = tasks.filter(t => t.col === 'In Progress').length
  const highPri = tasks.filter(t => t.priority === 'High' && t.col !== 'Done').length

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <TopHeader title="Projects" subtitle="Tasks & Kanban" />

      {/* KPI strip */}
      <div className="flex gap-3 px-4 pb-3">
        {[
          { label: 'Done',       value: `${done}/${total}`, color: 'text-emerald-600' },
          { label: 'Active',     value: String(inProg),     color: 'text-sky-600' },
          { label: 'High Pri',   value: String(highPri),    color: 'text-rose-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* view toggle */}
      <div className="flex mx-4 mb-4 bg-slate-200 rounded-xl p-1">
        {[['kanban','📊 Kanban'],['list','📋 List']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'kanban'
          ? <KanbanView tasks={tasks} onMove={moveTask} />
          : <ListView tasks={tasks} />
        }
      </div>

      {/* Add Task FAB */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm shadow-lg active:bg-emerald-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Add Task bottom sheet */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-slate-800 mb-4">New Task</h3>
            <div className="flex flex-col gap-3">
              <input
                className="inp"
                placeholder="Task title *"
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
              />
              <select
                className="inp"
                value={newTask.project}
                onChange={e => setNewTask(p => ({ ...p, project: e.target.value }))}
              >
                {PROJECTS.map(pr => <option key={pr}>{pr}</option>)}
              </select>
              <select
                className="inp"
                value={newTask.priority}
                onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={addTask} className="flex-1 btn-em">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
