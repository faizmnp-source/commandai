import { useState, useEffect } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const STAGES = ['Lead','Qualified','Proposal','Negotiation','Closed']
const STAGE_META = {
  Lead:        { color:'#64748b', bg:'#f1f5f9' },
  Qualified:   { color:'#0284c7', bg:'#f0f9ff' },
  Proposal:    { color:'#7c3aed', bg:'#f5f3ff' },
  Negotiation: { color:'#d97706', bg:'#fffbeb' },
  Closed:      { color:'#059669', bg:'#f0fdf4' },
}
const STATUS_META = {
  Hot:  { bg:'#fef2f2', color:'#dc2626' },
  Warm: { bg:'#fffbeb', color:'#d97706' },
  Cold: { bg:'#f1f5f9', color:'#64748b' },
  Won:  { bg:'#f0fdf4', color:'#059669' },
}
const AVATAR_COLORS = ['#059669','#2563eb','#7c3aed','#d97706','#db2777','#0284c7','#ea580c']
function avatarBg(s) { let h=0; for(const c of s) h=(h*31+c.charCodeAt(0))&0xFFFFFF; return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] }

const SEED_DEALS = [
  {id:1,stage:'Lead',        name:'TechCorp Ltd',     contact:'Sarah Johnson',value:12000,avatar:'TC',daysAgo:2 },
  {id:2,stage:'Qualified',   name:'GreenPath Inc',    contact:'Mark Reeves',  value:8500, avatar:'GP',daysAgo:5 },
  {id:3,stage:'Proposal',    name:'Nova Studios',     contact:'Anya Patel',   value:22000,avatar:'NS',daysAgo:1 },
  {id:4,stage:'Negotiation', name:'BlueSky Retail',   contact:'Tom Walsh',    value:35000,avatar:'BR',daysAgo:7 },
  {id:5,stage:'Lead',        name:'Vertex Logistics', contact:'Chen Li',      value:5000, avatar:'VL',daysAgo:0 },
  {id:6,stage:'Closed',      name:'Apex Finance',     contact:'Diana Ross',   value:50000,avatar:'AF',daysAgo:12},
]
const SEED_CONTACTS = [
  {id:1,name:'Sarah Johnson',company:'TechCorp Ltd',    role:'CTO',     avatar:'SJ',status:'Hot' },
  {id:2,name:'Mark Reeves',  company:'GreenPath Inc',   role:'CEO',     avatar:'MR',status:'Warm'},
  {id:3,name:'Anya Patel',   company:'Nova Studios',    role:'Director',avatar:'AP',status:'Hot' },
  {id:4,name:'Tom Walsh',    company:'BlueSky Retail',  role:'VP Sales',avatar:'TW',status:'Cold'},
  {id:5,name:'Chen Li',      company:'Vertex Logistics',role:'Founder', avatar:'CL',status:'Warm'},
  {id:6,name:'Diana Ross',   company:'Apex Finance',    role:'CFO',     avatar:'DR',status:'Won' },
]

function DealCard({ deal, onMove }) {
  const [open,setOpen] = useState(false)
  const idx=STAGES.indexOf(deal.stage), meta=STAGE_META[deal.stage]
  return (
    <div onClick={()=>setOpen(o=>!o)} className="bg-white rounded-xl cursor-pointer active:scale-[.97] transition-all" style={{border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
      <div className="h-[3px] rounded-t-xl" style={{background:meta.color}}/>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0" style={{fontSize:9,background:avatarBg(deal.avatar)}}>{deal.avatar}</div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{fontSize:12,color:'#1e293b'}}>{deal.name}</p>
              <p className="truncate" style={{fontSize:10,color:'#94a3b8'}}>{deal.contact}</p>
            </div>
          </div>
          <p className="font-bold flex-shrink-0" style={{fontSize:13,color:meta.color}}>${(deal.value/1000).toFixed(0)}k</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold rounded-md px-1.5 py-0.5" style={{fontSize:9,background:meta.bg,color:meta.color}}>{deal.stage}</span>
          <span style={{fontSize:9,color:'#cbd5e1'}}>{deal.daysAgo===0?'Today':`${deal.daysAgo}d ago`}</span>
        </div>
        {open&&(
          <div className="mt-2 pt-2 flex gap-1.5 flex-wrap animate-fade-up" style={{borderTop:'1px solid #f1f5f9'}}>
            {idx>0&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,-1)}} className="text-white rounded-lg font-semibold" style={{fontSize:10,background:'#64748b',padding:'4px 8px'}}>← {STAGES[idx-1]}</button>}
            {idx<STAGES.length-1&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,1)}} className="text-white rounded-lg font-semibold" style={{fontSize:10,background:meta.color,padding:'4px 8px'}}>{STAGES[idx+1]} →</button>}
          </div>
        )}
      </div>
    </div>
  )
}

function PipelineView({ deals, onMove }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
      {STAGES.map(stage=>{
        const sd=deals.filter(d=>d.stage===stage), total=sd.reduce((s,d)=>s+Number(d.value),0), meta=STAGE_META[stage]
        return (
          <div key={stage} className="flex-shrink-0" style={{minWidth:170}}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{background:meta.color}}/>
                <span className="font-semibold" style={{fontSize:11,color:'#475569'}}>{stage}</span>
              </div>
              <span className="font-bold" style={{fontSize:10,color:meta.color}}>${(total/1000).toFixed(0)}k</span>
            </div>
            <div className="space-y-2">
              {sd.length===0&&<div className="rounded-xl flex items-center justify-center" style={{height:56,border:'1.5px dashed #e2e8f0'}}><span style={{fontSize:10,color:'#cbd5e1'}}>Empty</span></div>}
              {sd.map(d=><DealCard key={d.id} deal={d} onMove={onMove}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ContactsView({ contacts }) {
  const [q,setQ]=useState('')
  const filtered=contacts.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.company.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="px-4">
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search contacts…" className="w-full pl-8 pr-3 py-2.5 bg-white rounded-xl outline-none" style={{border:'1px solid #e2e8f0',fontSize:13,color:'#1e293b',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}/>
      </div>
      <div className="space-y-2">
        {filtered.map(c=>{const sm=STATUS_META[c.status]; return (
          <div key={c.id} className="bg-white rounded-xl flex items-center gap-3 px-4 py-3" style={{border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:avatarBg(c.avatar)}}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{fontSize:13,color:'#1e293b'}}>{c.name}</p>
              <p style={{fontSize:11,color:'#94a3b8'}}>{c.role} · {c.company}</p>
            </div>
            <span className="font-bold rounded-full flex-shrink-0" style={{fontSize:10,background:sm.bg,color:sm.color,padding:'3px 10px'}}>{c.status}</span>
          </div>
        )})}
      </div>
    </div>
  )
}

export default function CRMScreen() {
  const showToast=useAppStore(s=>s.showToast)
  const [tab,setTab]=useState('pipeline')
  const [deals,setDeals]=useState(SEED_DEALS)
  const [contacts]=useState(SEED_CONTACTS)
  const [showAdd,setShowAdd]=useState(false)
  const [form,setForm]=useState({name:'',contact:'',value:''})

  useEffect(()=>{
    supabase.from('deals').select('*').order('created_at',{ascending:false}).then(({data})=>{if(data?.length)setDeals(data.map(d=>({...d,daysAgo:d.days_ago||0})))})
  },[])

  function moveStage(id,dir){
    setDeals(prev=>prev.map(d=>{
      if(d.id!==id)return d
      const next=STAGES[STAGES.indexOf(d.stage)+dir]; if(!next)return d
      showToast(`Moved to ${next}`); supabase.from('deals').update({stage:next}).eq('id',id)
      return{...d,stage:next}
    }))
  }

  function addDeal(){
    if(!form.name.trim())return
    const init=form.name.trim().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    const nd={id:Date.now(),stage:'Lead',name:form.name.trim(),contact:form.contact,value:parseFloat(form.value)||0,avatar:init,daysAgo:0}
    setDeals(p=>[nd,...p]); supabase.from('deals').insert({...nd,days_ago:0})
    setForm({name:'',contact:'',value:''}); setShowAdd(false); showToast('Deal added!')
  }

  const pipeline=deals.filter(d=>d.stage!=='Closed').reduce((s,d)=>s+Number(d.value),0)
  const won=deals.filter(d=>d.stage==='Closed').reduce((s,d)=>s+Number(d.value),0)
  const hot=deals.filter(d=>['Negotiation','Proposal'].includes(d.stage)).length

  return (
    <div className="flex flex-col h-full relative" style={{background:'#f0f4f8'}}>
      <TopHeader title="CRM" subtitle="Pipeline & Contacts"/>
      <div className="flex gap-2 px-4 py-3">
        {[{l:'Pipeline',v:`$${(pipeline/1000).toFixed(0)}k`,accent:'#2563eb',bg:'#eff6ff'},{l:'Won',v:`$${(won/1000).toFixed(0)}k`,accent:'#059669',bg:'#f0fdf4'},{l:'Hot',v:String(hot),accent:'#ea580c',bg:'#fff7ed'},{l:'Deals',v:String(deals.length),accent:'#64748b',bg:'#f8fafc'}].map(({l,v,accent,bg})=>(
          <div key={l} className="flex-1 rounded-[13px] py-2 px-2 text-center" style={{background:bg,border:`1px solid ${accent}22`}}>
            <p className="font-display font-bold" style={{fontSize:17,color:accent,letterSpacing:'-0.02em'}}>{v}</p>
            <p className="font-semibold uppercase" style={{fontSize:9,letterSpacing:'0.09em',color:'#94a3b8',marginTop:1}}>{l}</p>
          </div>
        ))}
      </div>
      <div className="flex mx-4 mb-3 rounded-xl p-1" style={{background:'#e2e8f0'}}>
        {[['pipeline','Pipeline'],['contacts','Contacts']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{fontSize:13,background:tab===k?'white':'transparent',color:tab===k?'#1e293b':'#94a3b8',boxShadow:tab===k?'0 1px 3px rgba(0,0,0,.06)':'none'}}>{lbl}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {tab==='pipeline'?<PipelineView deals={deals} onMove={moveStage}/>:<ContactsView contacts={contacts}/>}
      </div>
      {tab==='pipeline'&&(
        <div className="px-4 pb-5 pt-2">
          <button onClick={()=>setShowAdd(true)} className="w-full py-3 rounded-xl font-bold text-white" style={{fontSize:13,background:'linear-gradient(135deg,#1d4ed8,#2563eb)',boxShadow:'0 4px 14px rgba(37,99,235,.3)'}}>+ Add Deal</button>
        </div>
      )}
      {showAdd&&(
        <div className="absolute inset-0 z-50 flex items-end" style={{background:'rgba(15,23,42,.55)',backdropFilter:'blur(4px)'}} onClick={()=>setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-[24px] p-6" onClick={e=>e.stopPropagation()}>
            <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{background:'#e2e8f0'}}/>
            <p className="font-display font-bold mb-4" style={{fontSize:16,color:'#0f172a'}}>New Deal</p>
            <div className="space-y-3">
              <input className="inp" placeholder="Company name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              <input className="inp" placeholder="Contact person" value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))}/>
              <input className="inp" placeholder="Deal value (e.g. 15000)" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))}/>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={addDeal} className="flex-1 btn-em">Add Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
