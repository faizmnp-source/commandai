import { useState, useEffect } from 'react'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const STAGES = ['Lead','Qualified','Proposal','Negotiation','Closed']
const STAGE_META = {
  Lead:        { color:'#64748b', bg:'rgba(100,116,139,.10)', border:'rgba(100,116,139,.2)'  },
  Qualified:   { color:'#0284c7', bg:'rgba(2,132,199,.10)',   border:'rgba(2,132,199,.2)'    },
  Proposal:    { color:'#7c3aed', bg:'rgba(124,58,237,.10)',  border:'rgba(124,58,237,.2)'   },
  Negotiation: { color:'#d97706', bg:'rgba(217,119,6,.10)',   border:'rgba(217,119,6,.2)'    },
  Closed:      { color:'#059669', bg:'rgba(5,150,105,.10)',   border:'rgba(5,150,105,.2)'    },
}
const STATUS_META = {
  Hot:  { bg:'rgba(239,68,68,.08)',  color:'#dc2626', border:'rgba(239,68,68,.18)'  },
  Warm: { bg:'rgba(217,119,6,.08)',  color:'#d97706', border:'rgba(217,119,6,.18)'  },
  Cold: { bg:'rgba(100,116,139,.08)',color:'#64748b', border:'rgba(100,116,139,.18)'},
  Won:  { bg:'rgba(5,150,105,.08)',  color:'#059669', border:'rgba(5,150,105,.18)'  },
}
const AVATAR_COLORS=['#059669','#2563eb','#7c3aed','#d97706','#db2777','#0284c7','#ea580c']
function avatarBg(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))&0xFFFFFF;return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]}

const SEED_DEALS=[
  {id:1,stage:'Lead',        name:'TechCorp Ltd',     contact:'Sarah Johnson',value:12000,avatar:'TC',daysAgo:2},
  {id:2,stage:'Qualified',   name:'GreenPath Inc',    contact:'Mark Reeves',  value:8500, avatar:'GP',daysAgo:5},
  {id:3,stage:'Proposal',    name:'Nova Studios',     contact:'Anya Patel',   value:22000,avatar:'NS',daysAgo:1},
  {id:4,stage:'Negotiation', name:'BlueSky Retail',   contact:'Tom Walsh',    value:35000,avatar:'BR',daysAgo:7},
  {id:5,stage:'Lead',        name:'Vertex Logistics', contact:'Chen Li',      value:5000, avatar:'VL',daysAgo:0},
  {id:6,stage:'Closed',      name:'Apex Finance',     contact:'Diana Ross',   value:50000,avatar:'AF',daysAgo:12},
]
const SEED_CONTACTS=[
  {id:1,name:'Sarah Johnson',company:'TechCorp Ltd',    role:'CTO',     avatar:'SJ',status:'Hot' },
  {id:2,name:'Mark Reeves',  company:'GreenPath Inc',   role:'CEO',     avatar:'MR',status:'Warm'},
  {id:3,name:'Anya Patel',   company:'Nova Studios',    role:'Director',avatar:'AP',status:'Hot' },
  {id:4,name:'Tom Walsh',    company:'BlueSky Retail',  role:'VP Sales',avatar:'TW',status:'Cold'},
  {id:5,name:'Chen Li',      company:'Vertex Logistics',role:'Founder', avatar:'CL',status:'Warm'},
  {id:6,name:'Diana Ross',   company:'Apex Finance',    role:'CFO',     avatar:'DR',status:'Won' },
]

function DealCard({ deal, onMove }) {
  const [open,setOpen]=useState(false)
  const idx=STAGES.indexOf(deal.stage), meta=STAGE_META[deal.stage]
  return (
    <div onClick={()=>setOpen(o=>!o)} className="rounded-xl cursor-pointer active:scale-[.97] transition-all"
      style={{ background:'rgba(255,255,255,.82)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(16px)', boxShadow:'0 2px 10px rgba(0,0,0,.06), inset 0 1px 0 #fff' }}>
      <div style={{ height:2.5, borderRadius:'8px 8px 0 0', background:`linear-gradient(90deg,${meta.color},${meta.color}55)` }}/>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontSize:9, background:avatarBg(deal.avatar) }}>{deal.avatar}</div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize:12, color:'#1e293b' }}>{deal.name}</p>
              <p className="truncate" style={{ fontSize:10, color:'#94a3b8' }}>{deal.contact}</p>
            </div>
          </div>
          <p className="font-bold flex-shrink-0" style={{ fontSize:13, color:meta.color }}>${(deal.value/1000).toFixed(0)}k</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold rounded-md px-1.5 py-0.5" style={{ fontSize:9, background:meta.bg, color:meta.color, border:`1px solid ${meta.border}` }}>{deal.stage}</span>
          <span style={{ fontSize:9, color:'#cbd5e1' }}>{deal.daysAgo===0?'Today':`${deal.daysAgo}d ago`}</span>
        </div>
        {open&&(
          <div className="mt-2 pt-2 flex gap-1.5 flex-wrap" style={{ borderTop:'1px solid #f1f5f9' }}>
            {idx>0&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,-1)}} className="rounded-lg font-semibold" style={{ fontSize:10, background:'#f1f5f9', color:'#475569', padding:'4px 8px' }}>← {STAGES[idx-1]}</button>}
            {idx<STAGES.length-1&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,1)}} className="text-white rounded-lg font-semibold" style={{ fontSize:10, background:meta.color, padding:'4px 8px' }}>{STAGES[idx+1]} →</button>}
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
          <div key={stage} className="flex-shrink-0" style={{ minWidth:172 }}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background:meta.color }}/>
                <span className="font-semibold" style={{ fontSize:11, color:'#475569' }}>{stage}</span>
              </div>
              <span className="font-bold" style={{ fontSize:10, color:meta.color }}>${(total/1000).toFixed(0)}k</span>
            </div>
            <div className="space-y-2">
              {sd.length===0&&<div className="rounded-xl flex items-center justify-center" style={{ height:52, border:'1.5px dashed #e2e8f0' }}><span style={{ fontSize:10, color:'#cbd5e1' }}>Empty</span></div>}
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
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search contacts…" className="inp w-full pl-8" style={{ fontSize:13 }}/>
      </div>
      <div className="space-y-2">
        {filtered.map(c=>{const sm=STATUS_META[c.status]; return (
          <div key={c.id} className="rounded-xl flex items-center gap-3 px-4 py-3"
            style={{ background:'rgba(255,255,255,.82)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(16px)', boxShadow:'0 2px 10px rgba(0,0,0,.06), inset 0 1px 0 #fff' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background:avatarBg(c.avatar) }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ fontSize:13, color:'#1e293b' }}>{c.name}</p>
              <p style={{ fontSize:11, color:'#94a3b8' }}>{c.role} · {c.company}</p>
            </div>
            <span className="font-bold rounded-full flex-shrink-0" style={{ fontSize:10, background:sm.bg, color:sm.color, border:`1px solid ${sm.border}`, padding:'3px 10px' }}>{c.status}</span>
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

  useEffect(()=>{ supabase.from('deals').select('*').order('created_at',{ascending:false}).then(({data})=>{if(data?.length)setDeals(data.map(d=>({...d,daysAgo:d.days_ago||0})))}) },[])

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
    <div className="flex flex-col h-full relative">
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="eyebrow mb-1">Sales & Pipeline</p>
        <p className="screen-title">CRM</p>
      </div>

      <div className="mx-4 mb-4 rounded-2xl px-5 py-3 flex justify-between items-center glass flex-shrink-0">
        {[{l:'Pipeline',v:`$${(pipeline/1000).toFixed(0)}k`,c:'#2563eb'},{l:'Won',v:`$${(won/1000).toFixed(0)}k`,c:'#059669'},{l:'Hot',v:String(hot),c:'#ea580c'},{l:'Deals',v:String(deals.length),c:'#64748b'}].map(({l,v,c},i,arr)=>(
          <div key={l} className="flex flex-col items-center">
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
            <span className="eyebrow">{l}</span>
          </div>
        ))}
      </div>

      <div className="flex mx-4 mb-3 rounded-xl p-1 flex-shrink-0 glass">
        {[['pipeline','Pipeline'],['contacts','Contacts']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{ fontSize:13, background:tab===k?'white':'transparent', color:tab===k?'#1e293b':'#94a3b8', boxShadow:tab===k?'0 1px 4px rgba(0,0,0,.08)':'none' }}>{lbl}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {tab==='pipeline'?<PipelineView deals={deals} onMove={moveStage}/>:<ContactsView contacts={contacts}/>}
      </div>

      {tab==='pipeline'&&(
        <div className="px-4 pb-5 pt-2">
          <button onClick={()=>setShowAdd(true)} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ fontSize:13, background:'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow:'0 4px 16px rgba(37,99,235,.28)' }}>+ Add Deal</button>
        </div>
      )}

      {showAdd&&(
        <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(15,23,42,.4)', backdropFilter:'blur(6px)' }} onClick={()=>setShowAdd(false)}>
          <div className="w-full rounded-t-[24px] p-6" style={{ background:'rgba(255,255,255,.96)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(255,255,255,.9)', boxShadow:'0 -8px 32px rgba(0,0,0,.12)', animation:'slide-up .26s cubic-bezier(.16,1,.3,1)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:99, background:'#e2e8f0', margin:'0 auto 20px' }}/>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'#0f172a', marginBottom:16 }}>New Deal</p>
            <div className="space-y-3">
              <input className="inp" placeholder="Company name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              <input className="inp" placeholder="Contact person" value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))}/>
              <input className="inp" placeholder="Deal value (e.g. 15000)" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))}/>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={addDeal} className="btn-em flex-1">Add Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
