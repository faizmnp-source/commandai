import { useState, useEffect } from 'react'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const COLS=['To Do','In Progress','Review','Done']
const COL_META={
  'To Do':      { color:'#64748b', bg:'rgba(100,116,139,.10)', border:'rgba(100,116,139,.2)'  },
  'In Progress':{ color:'#2563eb', bg:'rgba(37,99,235,.10)',   border:'rgba(37,99,235,.2)'    },
  'Review':     { color:'#7c3aed', bg:'rgba(124,58,237,.10)',  border:'rgba(124,58,237,.2)'   },
  'Done':       { color:'#059669', bg:'rgba(5,150,105,.10)',   border:'rgba(5,150,105,.2)'    },
}
const PRI_META={
  High:  { bg:'rgba(239,68,68,.08)',  color:'#dc2626', border:'rgba(239,68,68,.18)'  },
  Medium:{ bg:'rgba(217,119,6,.08)',  color:'#d97706', border:'rgba(217,119,6,.18)'  },
  Low:   { bg:'rgba(100,116,139,.08)',color:'#64748b', border:'rgba(100,116,139,.18)'},
}
const AVATAR_COLORS=['#059669','#2563eb','#7c3aed','#d97706','#db2777','#0284c7','#ea580c']
function avatarBg(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))&0xFFFFFF;return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]}

const SEED=[
  {id:1,col:'To Do',       title:'Design onboarding flow',     project:'App Redesign',priority:'High',  assignee:'AP',due:'May 22'},
  {id:2,col:'To Do',       title:'Set up CI/CD pipeline',      project:'DevOps',      priority:'Medium',assignee:'CL',due:'May 25'},
  {id:3,col:'In Progress', title:'Build CRM module',           project:'CommandAI',   priority:'High',  assignee:'FZ',due:'May 20'},
  {id:4,col:'In Progress', title:'Client proposal — TechCorp', project:'Sales',       priority:'High',  assignee:'SJ',due:'May 21'},
  {id:5,col:'In Progress', title:'Quarterly financial report',  project:'Finance',     priority:'Medium',assignee:'DR',due:'May 28'},
  {id:6,col:'Review',      title:'Homepage redesign',          project:'App Redesign',priority:'Low',   assignee:'NS',due:'May 19'},
  {id:7,col:'Review',      title:'API documentation',          project:'DevOps',      priority:'Low',   assignee:'FZ',due:'May 23'},
  {id:8,col:'Done',        title:'Kickoff meeting — GreenPath',project:'Sales',       priority:'Medium',assignee:'MR',due:'May 15'},
  {id:9,col:'Done',        title:'Set up Zustand store',       project:'CommandAI',   priority:'High',  assignee:'FZ',due:'May 14'},
]
const PROJECTS=[...new Set(SEED.map(t=>t.project))]

/* ── Task Card ────────────────────────────────────────────── */
function TaskCard({ task, onMove }) {
  const [open,setOpen]=useState(false)
  const idx=COLS.indexOf(task.col), meta=COL_META[task.col], pm=PRI_META[task.priority]
  return (
    <div onClick={()=>setOpen(o=>!o)} className="rounded-xl cursor-pointer active:scale-[.97] transition-all"
      style={{ background:'rgba(255,255,255,.82)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(16px)', boxShadow:'0 2px 10px rgba(0,0,0,.06), inset 0 1px 0 #fff' }}>
      <div style={{ height:2.5, borderRadius:'8px 8px 0 0', background:`linear-gradient(90deg,${meta.color},${meta.color}55)` }}/>
      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <p className="flex-1 font-semibold leading-snug" style={{ fontSize:12, color:'#1e293b' }}>{task.title}</p>
          <span className="font-bold rounded-md flex-shrink-0" style={{ fontSize:9, background:pm.bg, color:pm.color, border:`1px solid ${pm.border}`, padding:'2px 6px' }}>{task.priority}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ fontSize:9, background:avatarBg(task.assignee) }}>{task.assignee}</div>
          <span className="flex-1 truncate" style={{ fontSize:10, color:'#94a3b8' }}>{task.project}</span>
          <span style={{ fontSize:9, color:'#cbd5e1' }}>{task.due}</span>
        </div>
        {open&&(
          <div className="mt-2 pt-2 flex gap-1.5 flex-wrap" style={{ borderTop:'1px solid #f1f5f9' }}>
            {idx>0&&<button onClick={e=>{e.stopPropagation();onMove(task.id,-1)}} className="rounded-lg font-semibold" style={{ fontSize:10, background:'#f1f5f9', color:'#475569', padding:'4px 8px' }}>← {COLS[idx-1]}</button>}
            {idx<COLS.length-1&&<button onClick={e=>{e.stopPropagation();onMove(task.id,1)}} className="text-white rounded-lg font-semibold" style={{ fontSize:10, background:meta.color, padding:'4px 8px' }}>{COLS[idx+1]} →</button>}
            {task.col==='Done'&&<span className="font-semibold" style={{ fontSize:10, color:'#059669', padding:'4px 0' }}>✓ Completed</span>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Kanban View ──────────────────────────────────────────── */
function KanbanView({ tasks, onMove }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
      {COLS.map(col=>{
        const ct=tasks.filter(t=>t.col===col), meta=COL_META[col]
        return (
          <div key={col} className="flex-shrink-0" style={{ minWidth:175 }}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background:meta.color }}/>
                <span className="font-semibold" style={{ fontSize:11, color:'#475569' }}>{col}</span>
              </div>
              <span className="font-bold rounded-full px-1.5" style={{ fontSize:10, color:meta.color, background:meta.bg, border:`1px solid ${meta.border}` }}>{ct.length}</span>
            </div>
            <div className="space-y-2">
              {ct.length===0&&<div className="rounded-xl flex items-center justify-center" style={{ height:52, border:'1.5px dashed #e2e8f0' }}><span style={{ fontSize:10, color:'#cbd5e1' }}>Empty</span></div>}
              {ct.map(t=><TaskCard key={t.id} task={t} onMove={onMove}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── List View ────────────────────────────────────────────── */
function ListView({ tasks }) {
  const [filter,setFilter]=useState('All')
  const filtered=filter==='All'?tasks:tasks.filter(t=>t.project===filter)
  return (
    <div className="px-4">
      {/* Project filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {['All',...PROJECTS].map(p=>(
          <button key={p} onClick={()=>setFilter(p)}
            className="whitespace-nowrap font-semibold rounded-full transition-all"
            style={{ fontSize:11, padding:'5px 12px',
              background:filter===p?'rgba(124,58,237,.12)':'rgba(255,255,255,.7)',
              color:filter===p?'#7c3aed':'#64748b',
              border:filter===p?'1px solid rgba(124,58,237,.3)':'1px solid rgba(226,232,240,.9)',
              backdropFilter:'blur(8px)' }}>{p}</button>
        ))}
      </div>
      <div>
        {COLS.filter(c=>filtered.some(t=>t.col===c)).map(col=>(
          <div key={col} className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:COL_META[col].color }}/>
              <span className="font-bold uppercase" style={{ fontSize:10, letterSpacing:'0.08em', color:'#94a3b8' }}>{col}</span>
              <div className="flex-1" style={{ height:1, background:'rgba(0,0,0,.06)' }}/>
            </div>
            <div className="space-y-2">
              {filtered.filter(t=>t.col===col).map(t=>{const pm=PRI_META[t.priority];return(
                <div key={t.id} className="rounded-xl flex items-center gap-3 px-4 py-3"
                  style={{ background:'rgba(255,255,255,.82)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(16px)', boxShadow:'0 2px 10px rgba(0,0,0,.06), inset 0 1px 0 #fff' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:pm.color }}/>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ fontSize:12, color:'#1e293b' }}>{t.title}</p>
                    <p style={{ fontSize:10, color:'#94a3b8' }}>{t.project} · {t.due}</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ fontSize:9, background:avatarBg(t.assignee) }}>{t.assignee}</div>
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function ProjectsScreen() {
  const showToast=useAppStore(s=>s.showToast)
  const [view,setView]=useState('kanban')
  const [tasks,setTasks]=useState(SEED)
  const [showAdd,setShowAdd]=useState(false)
  const [form,setForm]=useState({title:'',project:PROJECTS[0],priority:'Medium'})

  useEffect(()=>{
    supabase.from('tasks').select('*').order('created_at',{ascending:false}).then(({data})=>{if(data?.length)setTasks(data.map(d=>({...d,col:d.col||'To Do',due:d.due_date||'TBD'})))})
  },[])

  function moveTask(id,dir){
    setTasks(prev=>prev.map(t=>{
      if(t.id!==id)return t
      const next=COLS[COLS.indexOf(t.col)+dir]; if(!next)return t
      showToast(`Moved to ${next}`); supabase.from('tasks').update({col:next}).eq('id',id)
      return{...t,col:next}
    }))
  }

  function addTask(){
    if(!form.title.trim())return
    const nt={id:Date.now(),col:'To Do',title:form.title.trim(),project:form.project,priority:form.priority,assignee:'FZ',due:'TBD'}
    setTasks(p=>[...p,nt]); supabase.from('tasks').insert({...nt,due_date:'TBD'})
    setForm({title:'',project:PROJECTS[0],priority:'Medium'}); setShowAdd(false); showToast('Task created!')
  }

  const done=tasks.filter(t=>t.col==='Done').length, total=tasks.length
  const active=tasks.filter(t=>t.col==='In Progress').length
  const highPri=tasks.filter(t=>t.priority==='High'&&t.col!=='Done').length

  return (
    <div className="flex flex-col h-full relative">

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="eyebrow mb-1">Task Management</p>
        <p className="screen-title">Projects</p>
      </div>

      {/* KPI strip */}
      <div className="mx-4 mb-4 rounded-2xl px-5 py-3 flex justify-between items-center glass flex-shrink-0">
        {[
          {l:'Done',     v:`${done}/${total}`, c:'#059669'},
          {l:'Active',   v:String(active),     c:'#2563eb'},
          {l:'High Pri', v:String(highPri),    c:'#dc2626'},
          {l:'Total',    v:String(total),       c:'#64748b'},
        ].map(({l,v,c},i,arr)=>(
          <div key={l} className="flex flex-col items-center">
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
            <span className="eyebrow">{l}</span>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex mx-4 mb-3 rounded-xl p-1 flex-shrink-0 glass">
        {[['kanban','Kanban'],['list','List']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setView(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{ fontSize:13, background:view===k?'white':'transparent', color:view===k?'#1e293b':'#94a3b8', boxShadow:view===k?'0 1px 4px rgba(0,0,0,.08)':'none' }}>{lbl}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {view==='kanban'?<KanbanView tasks={tasks} onMove={moveTask}/>:<ListView tasks={tasks}/>}
      </div>

      {/* Add Task button */}
      <div className="px-4 pb-5 pt-2">
        <button onClick={()=>setShowAdd(true)} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ fontSize:13, background:'linear-gradient(135deg,#6d28d9,#7c3aed)', boxShadow:'0 4px 16px rgba(124,58,237,.28)' }}>+ Add Task</button>
      </div>

      {/* Add Task modal */}
      {showAdd&&(
        <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(15,23,42,.4)', backdropFilter:'blur(6px)' }} onClick={()=>setShowAdd(false)}>
          <div className="w-full rounded-t-[24px] p-6" style={{ background:'rgba(255,255,255,.96)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(255,255,255,.9)', boxShadow:'0 -8px 32px rgba(0,0,0,.12)', animation:'slide-up .26s cubic-bezier(.16,1,.3,1)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:99, background:'#e2e8f0', margin:'0 auto 20px' }}/>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'#0f172a', marginBottom:16 }}>New Task</p>
            <div className="space-y-3">
              <input className="inp" placeholder="Task title *" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
              <select className="inp" value={form.project} onChange={e=>setForm(p=>({...p,project:e.target.value}))}>
                {PROJECTS.map(pr=><option key={pr}>{pr}</option>)}
              </select>
              <select className="inp" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={addTask} className="btn-em flex-1">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
