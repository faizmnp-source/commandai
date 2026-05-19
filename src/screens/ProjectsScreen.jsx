import { useState, useEffect } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const COLS=['To Do','In Progress','Review','Done']
const COL_META={'To Do':{color:'#64748b',bg:'#f1f5f9'},'In Progress':{color:'#2563eb',bg:'#eff6ff'},Review:{color:'#7c3aed',bg:'#f5f3ff'},Done:{color:'#059669',bg:'#f0fdf4'}}
const PRI_META={High:{bg:'#fef2f2',color:'#dc2626'},Medium:{bg:'#fffbeb',color:'#d97706'},Low:{bg:'#f1f5f9',color:'#64748b'}}
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

function TaskCard({task,onMove}){
  const [open,setOpen]=useState(false)
  const idx=COLS.indexOf(task.col),meta=COL_META[task.col],pm=PRI_META[task.priority]
  return(
    <div onClick={()=>setOpen(o=>!o)} className="bg-white rounded-xl cursor-pointer active:scale-[.97] transition-all" style={{border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
      <div className="h-[3px] rounded-t-xl" style={{background:meta.color}}/>
      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <p className="flex-1 font-semibold leading-snug" style={{fontSize:12,color:'#1e293b'}}>{task.title}</p>
          <span className="font-bold rounded-md flex-shrink-0" style={{fontSize:9,background:pm.bg,color:pm.color,padding:'2px 6px'}}>{task.priority}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0" style={{fontSize:9,background:avatarBg(task.assignee)}}>{task.assignee}</div>
          <span className="flex-1 truncate" style={{fontSize:10,color:'#94a3b8'}}>{task.project}</span>
          <span style={{fontSize:9,color:'#cbd5e1'}}>📅 {task.due}</span>
        </div>
        {open&&(
          <div className="mt-2 pt-2 flex gap-1.5 flex-wrap animate-fade-up" style={{borderTop:'1px solid #f1f5f9'}}>
            {idx>0&&<button onClick={e=>{e.stopPropagation();onMove(task.id,-1)}} className="font-semibold rounded-lg text-white" style={{fontSize:10,background:'#64748b',padding:'4px 8px'}}>← {COLS[idx-1]}</button>}
            {idx<COLS.length-1&&<button onClick={e=>{e.stopPropagation();onMove(task.id,1)}} className="font-semibold rounded-lg text-white" style={{fontSize:10,background:meta.color,padding:'4px 8px'}}>{COLS[idx+1]} →</button>}
            {task.col==='Done'&&<span className="font-semibold" style={{fontSize:10,color:'#059669',padding:'4px 0'}}>✓ Completed</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanView({tasks,onMove}){
  return(
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
      {COLS.map(col=>{
        const ct=tasks.filter(t=>t.col===col),meta=COL_META[col]
        return(
          <div key={col} className="flex-shrink-0" style={{minWidth:175}}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:meta.color}}/><span className="font-semibold" style={{fontSize:11,color:'#475569'}}>{col}</span></div>
              <span className="font-bold" style={{fontSize:10,color:meta.color}}>{ct.length}</span>
            </div>
            <div className="space-y-2">
              {ct.length===0&&<div className="rounded-xl flex items-center justify-center" style={{height:52,border:'1.5px dashed #e2e8f0'}}><span style={{fontSize:10,color:'#cbd5e1'}}>Empty</span></div>}
              {ct.map(t=><TaskCard key={t.id} task={t} onMove={onMove}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ListView({tasks}){
  const [filter,setFilter]=useState('All')
  const filtered=filter==='All'?tasks:tasks.filter(t=>t.project===filter)
  return(
    <div className="px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {['All',...PROJECTS].map(p=>(
          <button key={p} onClick={()=>setFilter(p)} className="whitespace-nowrap font-semibold rounded-full transition-all"
            style={{fontSize:11,padding:'5px 12px',background:filter===p?'#7c3aed':'white',color:filter===p?'white':'#64748b',border:'1px solid #e2e8f0'}}>{p}</button>
        ))}
      </div>
      <div>
        {COLS.filter(c=>filtered.some(t=>t.col===c)).map(col=>(
          <div key={col} className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:COL_META[col].color}}/>
              <span className="font-bold uppercase" style={{fontSize:10,letterSpacing:'0.08em',color:'#94a3b8'}}>{col}</span>
              <div className="flex-1 h-px" style={{background:'#e2e8f0'}}/>
            </div>
            <div className="space-y-2">
              {filtered.filter(t=>t.col===col).map(t=>{const pm=PRI_META[t.priority];return(
                <div key={t.id} className="bg-white rounded-xl flex items-center gap-3 px-4 py-3" style={{border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:pm.color}}/>
                  <div className="flex-1 min-w-0"><p className="font-medium truncate" style={{fontSize:12,color:'#1e293b'}}>{t.title}</p><p style={{fontSize:10,color:'#94a3b8'}}>{t.project} · {t.due}</p></div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0" style={{fontSize:9,background:avatarBg(t.assignee)}}>{t.assignee}</div>
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectsScreen(){
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
      const next=COLS[COLS.indexOf(t.col)+dir];if(!next)return t
      showToast(`Moved to ${next}`);supabase.from('tasks').update({col:next}).eq('id',id)
      return{...t,col:next}
    }))
  }

  function addTask(){
    if(!form.title.trim())return
    const nt={id:Date.now(),col:'To Do',title:form.title.trim(),project:form.project,priority:form.priority,assignee:'FZ',due:'TBD'}
    setTasks(p=>[...p,nt]);supabase.from('tasks').insert({...nt,due_date:'TBD'})
    setForm({title:'',project:PROJECTS[0],priority:'Medium'});setShowAdd(false);showToast('Task created!')
  }

  const done=tasks.filter(t=>t.col==='Done').length,total=tasks.length,active=tasks.filter(t=>t.col==='In Progress').length,highPri=tasks.filter(t=>t.priority==='High'&&t.col!=='Done').length

  return(
    <div className="flex flex-col h-full relative" style={{background:'#f0f4f8'}}>
      <TopHeader title="Projects" subtitle="Tasks & Kanban"/>
      <div className="flex gap-2 px-4 py-3">
        {[{l:'Done',v:`${done}/${total}`,accent:'#059669',bg:'#f0fdf4'},{l:'Active',v:String(active),accent:'#2563eb',bg:'#eff6ff'},{l:'High Pri',v:String(highPri),accent:'#dc2626',bg:'#fef2f2'},{l:'Total',v:String(total),accent:'#64748b',bg:'#f8fafc'}].map(({l,v,accent,bg})=>(
          <div key={l} className="flex-1 rounded-[13px] py-2 px-2 text-center" style={{background:bg,border:`1px solid ${accent}22`}}>
            <p className="font-display font-bold" style={{fontSize:17,color:accent,letterSpacing:'-0.02em'}}>{v}</p>
            <p className="font-semibold uppercase" style={{fontSize:9,letterSpacing:'0.09em',color:'#94a3b8',marginTop:1}}>{l}</p>
          </div>
        ))}
      </div>
      <div className="flex mx-4 mb-3 rounded-xl p-1" style={{background:'#e2e8f0'}}>
        {[['kanban','Kanban'],['list','List']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setView(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{fontSize:13,background:view===k?'white':'transparent',color:view===k?'#1e293b':'#94a3b8',boxShadow:view===k?'0 1px 3px rgba(0,0,0,.06)':'none'}}>{lbl}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {view==='kanban'?<KanbanView tasks={tasks} onMove={moveTask}/>:<ListView tasks={tasks}/>}
      </div>
      <div className="px-4 pb-5 pt-2">
        <button onClick={()=>setShowAdd(true)} className="w-full py-3 rounded-xl font-bold text-white" style={{fontSize:13,background:'linear-gradient(135deg,#6d28d9,#7c3aed)',boxShadow:'0 4px 14px rgba(124,58,237,.3)'}}>+ Add Task</button>
      </div>
      {showAdd&&(
        <div className="absolute inset-0 z-50 flex items-end" style={{background:'rgba(15,23,42,.55)',backdropFilter:'blur(4px)'}} onClick={()=>setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-[24px] p-6" onClick={e=>e.stopPropagation()}>
            <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{background:'#e2e8f0'}}/>
            <p className="font-display font-bold mb-4" style={{fontSize:16,color:'#0f172a'}}>New Task</p>
            <div className="space-y-3">
              <input className="inp" placeholder="Task title *" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
              <select className="inp" value={form.project} onChange={e=>setForm(p=>({...p,project:e.target.value}))}>{PROJECTS.map(pr=><option key={pr}>{pr}</option>)}</select>
              <select className="inp" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}><option>High</option><option>Medium</option><option>Low</option></select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={addTask} className="flex-1 btn-em">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
