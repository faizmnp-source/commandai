import { useState, useEffect } from 'react'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const STAGES = ['Lead','Qualified','Proposal','Negotiation','Closed']
const STAGE_META = {
  Lead:        { color:'#94a3b8', accent:'#60a5fa' },
  Qualified:   { color:'#38bdf8', accent:'#38bdf8' },
  Proposal:    { color:'#c084fc', accent:'#c084fc' },
  Negotiation: { color:'#fbbf24', accent:'#fbbf24' },
  Closed:      { color:'#34d399', accent:'#34d399' },
}
const STATUS_META = {
  Hot:  { bg:'rgba(239,68,68,.14)',  color:'#f87171', border:'rgba(239,68,68,.2)'  },
  Warm: { bg:'rgba(251,191,36,.12)', color:'#fbbf24', border:'rgba(251,191,36,.2)' },
  Cold: { bg:'rgba(148,163,184,.1)', color:'#94a3b8', border:'rgba(148,163,184,.2)'},
  Won:  { bg:'rgba(52,211,153,.12)', color:'#34d399', border:'rgba(52,211,153,.2)' },
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

/* ── Deal Card ────────────────────────────────────────────── */
function DealCard({ deal, onMove }) {
  const [open,setOpen]=useState(false)
  const idx=STAGES.indexOf(deal.stage), meta=STAGE_META[deal.stage]
  return (
    <div onClick={()=>setOpen(o=>!o)} className="rounded-xl cursor-pointer active:scale-[.97] transition-all"
      style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', backdropFilter:'blur(12px)', boxShadow:'0 2px 12px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08)' }}>
      {/* Top strip */}
      <div style={{ height:2, borderRadius:'8px 8px 0 0', background:`linear-gradient(90deg,${meta.accent},${meta.accent}44)` }}/>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ fontSize:9, background:avatarBg(deal.avatar) }}>{deal.avatar}</div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize:12, color:'rgba(255,255,255,.88)' }}>{deal.name}</p>
              <p className="truncate" style={{ fontSize:10, color:'rgba(255,255,255,.38)' }}>{deal.contact}</p>
            </div>
          </div>
          <p className="font-bold flex-shrink-0" style={{ fontSize:13, color:meta.accent }}>${(deal.value/1000).toFixed(0)}k</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold rounded-md px-1.5 py-0.5" style={{ fontSize:9, background:`${meta.accent}18`, color:meta.accent, border:`1px solid ${meta.accent}30` }}>{deal.stage}</span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,.22)' }}>{deal.daysAgo===0?'Today':`${deal.daysAgo}d ago`}</span>
        </div>
        {open&&(
          <div className="mt-2 pt-2 flex gap-1.5 flex-wrap" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
            {idx>0&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,-1)}} className="text-white rounded-lg font-semibold" style={{ fontSize:10, background:'rgba(255,255,255,.1)', padding:'4px 8px' }}>← {STAGES[idx-1]}</button>}
            {idx<STAGES.length-1&&<button onClick={e=>{e.stopPropagation();onMove(deal.id,1)}} className="text-white rounded-lg font-semibold" style={{ fontSize:10, background:meta.accent, padding:'4px 8px' }}>{STAGES[idx+1]} →</button>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Pipeline View ────────────────────────────────────────── */
function PipelineView({ deals, onMove }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
      {STAGES.map(stage=>{
        const sd=deals.filter(d=>d.stage===stage), total=sd.reduce((s,d)=>s+Number(d.value),0), meta=STAGE_META[stage]
        return (
          <div key={stage} className="flex-shrink-0" style={{ minWidth:170 }}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background:meta.accent }}/>
                <span className="font-semibold" style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>{stage}</span>
              </div>
              <span className="font-bold" style={{ fontSize:10, color:meta.accent }}>${(total/1000).toFixed(0)}k</span>
            </div>
            <div className="space-y-2">
              {sd.length===0&&<div className="rounded-xl flex items-center justify-center" style={{ height:52, border:'1.5px dashed rgba(255,255,255,.08)' }}><span style={{ fontSize:10, color:'rgba(255,255,255,.2)' }}>Empty</span></div>}
              {sd.map(d=><DealCard key={d.id} deal={d} onMove={onMove}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Contacts View ────────────────────────────────────────── */
function ContactsView({ contacts }) {
  const [q,setQ]=useState('')
  const filtered=contacts.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.company.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="px-4">
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search contacts…"
          className="w-full pl-8 pr-3 py-2.5 rounded-xl outline-none inp-dark" style={{ fontSize:13 }}/>
      </div>
      <div className="space-y-2">
        {filtered.map(c=>{const sm=STATUS_META[c.status]; return (
          <div key={c.id} className="rounded-xl flex items-center gap-3 px-4 py-3"
            style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', backdropFilter:'blur(12px)', boxShadow:'0 2px 12px rgba(0,0,0,.3)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background:avatarBg(c.avatar) }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ fontSize:13, color:'rgba(255,255,255,.88)' }}>{c.name}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,.38)' }}>{c.role} · {c.company}</p>
            </div>
            <span className="font-bold rounded-full flex-shrink-0" style={{ fontSize:10, background:sm.bg, color:sm.color, border:`1px solid ${sm.border}`, padding:'3px 10px' }}>{c.status}</span>
          </div>
        )})}
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
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
    <div className="flex flex-col h-full relative" style={{ background:'transparent' }}>

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="eyebrow mb-1">Sales & Pipeline</p>
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>CRM</p>
      </div>

      {/* KPI strip */}
      <div className="mx-4 mb-4 rounded-2xl px-4 py-3 flex justify-between items-center glass flex-shrink-0">
        {[
          {l:'Pipeline', v:`$${(pipeline/1000).toFixed(0)}k`, c:'#60a5fa'},
          {l:'Won',      v:`$${(won/1000).toFixed(0)}k`,      c:'#34d399'},
          {l:'Hot',      v:String(hot),                       c:'#fb923c'},
          {l:'Deals',   v:String(deals.length),               c:'#94a3b8'},
        ].map(({l,v,c},i,arr)=>(
          <>
            <div key={l} className="flex flex-col items-center">
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
              <span className="eyebrow">{l}</span>
            </div>
            {i<arr.length-1 && <div key={l+'d'} style={{ width:1, height:28, background:'rgba(255,255,255,.07)' }}/>}
          </>
        ))}
      </div>

      {/* Tab toggle */}
      <div className="flex mx-4 mb-3 rounded-xl p-1 flex-shrink-0" style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.07)' }}>
        {[['pipeline','Pipeline'],['contacts','Contacts']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{ fontSize:13, background:tab===k?'rgba(255,255,255,.12)':'transparent', color:tab===k?'#fff':'rgba(255,255,255,.38)', boxShadow:tab===k?'0 1px 4px rgba(0,0,0,.3)':'none' }}>{lbl}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {tab==='pipeline'?<PipelineView deals={deals} onMove={moveStage}/>:<ContactsView contacts={contacts}/>}
      </div>

      {/* Add Deal button */}
      {tab==='pipeline'&&(
        <div className="px-4 pb-5 pt-2">
          <button onClick={()=>setShowAdd(true)} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ fontSize:13, background:'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow:'0 4px 20px rgba(37,99,235,.35)' }}>+ Add Deal</button>
        </div>
      )}

      {/* Add Deal modal */}
      {showAdd&&(
        <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(7,9,14,.75)', backdropFilter:'blur(8px)' }} onClick={()=>setShowAdd(false)}>
          <div className="w-full rounded-t-[24px] p-6" style={{ background:'rgba(12,16,24,.96)', border:'1px solid rgba(255,255,255,.10)', borderBottom:'none', backdropFilter:'blur(32px)', animation:'slide-up .28s cubic-bezier(.16,1,.3,1)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,.15)', margin:'0 auto 20px' }}/>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:16 }}>New Deal</p>
            <div className="space-y-3">
              <input className="inp-dark" placeholder="Company name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              <input className="inp-dark" placeholder="Contact person" value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))}/>
              <input className="inp-dark" placeholder="Deal value (e.g. 15000)" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))}/>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-3 rounded-xl font-semibold" style={{ fontSize:14, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.09)' }}>Cancel</button>
              <button onClick={addDeal} className="flex-1 py-3 rounded-xl font-bold text-white" style={{ fontSize:14, background:'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow:'0 4px 14px rgba(37,99,235,.3)' }}>Add Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
