import { useState, useEffect, useCallback } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed']
const STAGE_COLORS = {
  Lead:        'bg-slate-100 text-slate-600',
  Qualified:   'bg-sky-100 text-sky-700',
  Proposal:    'bg-violet-100 text-violet-700',
  Negotiation: 'bg-orange-100 text-orange-700',
  Closed:      'bg-emerald-100 text-emerald-700',
}
const STATUS_COLORS = {
  Hot:  'bg-rose-100 text-rose-600',
  Warm: 'bg-amber-100 text-amber-600',
  Cold: 'bg-slate-100 text-slate-500',
  Won:  'bg-emerald-100 text-emerald-700',
}
const PALETTE = ['bg-violet-500','bg-sky-500','bg-fuchsia-500','bg-orange-500','bg-teal-500','bg-emerald-500','bg-rose-500']

function DealCard({ deal, onMoveStage }) {
  const [expanded, setExpanded] = useState(false)
  const stageIdx = STAGES.indexOf(deal.stage)
  return (
    <div onClick={() => setExpanded(e => !e)}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 cursor-pointer active:scale-95 transition-transform">
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 rounded-full ${deal.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{deal.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{deal.name}</p>
          <p className="text-xs text-slate-400 truncate">{deal.contact}</p>
        </div>
        <p className="text-sm font-bold text-emerald-600 whitespace-nowrap">${Number(deal.value).toLocaleString()}</p>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex gap-1.5 flex-wrap">
          {stageIdx > 0 && (
            <button onClick={e => { e.stopPropagation(); onMoveStage(deal.id, -1) }}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
              ← {STAGES[stageIdx - 1]}
            </button>
          )}
          {stageIdx < STAGES.length - 1 && (
            <button onClick={e => { e.stopPropagation(); onMoveStage(deal.id, 1) }}
              className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium">
              {STAGES[stageIdx + 1]} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function PipelineView({ deals, onMoveStage }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
      {STAGES.map(stage => {
        const sd = deals.filter(d => d.stage === stage)
        const total = sd.reduce((s, d) => s + Number(d.value), 0)
        return (
          <div key={stage} className="min-w-[190px] snap-start flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
              <span className="text-xs text-slate-400">${(total/1000).toFixed(0)}k</span>
            </div>
            <div className="flex flex-col gap-2">
              {sd.length === 0 && <div className="h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center"><span className="text-xs text-slate-300">Empty</span></div>}
              {sd.map(deal => <DealCard key={deal.id} deal={deal} onMoveStage={onMoveStage} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ContactsView({ contacts, loading }) {
  const [search, setSearch] = useState('')
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company||'').toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="px-4">
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>
      {loading ? <div className="text-center py-10 text-slate-400 text-sm">Loading…</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 flex items-center gap-3 active:bg-slate-50 cursor-pointer">
              <div className={`w-11 h-11 rounded-full ${c.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">{c.role} · {c.company}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[c.status]}`}>{c.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CRMScreen() {
  const showToast = useAppStore(s => s.showToast)
  const [tab, setTab]         = useState('pipeline')
  const [deals, setDeals]     = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newDeal, setNewDeal] = useState({ name: '', contact: '', value: '' })

  const loadDeals = useCallback(async () => {
    const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false })
    if (data) setDeals(data)
  }, [])

  const loadContacts = useCallback(async () => {
    const { data } = await supabase.from('contacts').select('*').order('name')
    if (data) setContacts(data)
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadDeals(), loadContacts()]).finally(() => setLoading(false))
  }, [loadDeals, loadContacts])

  async function moveStage(id, dir) {
    const deal = deals.find(d => d.id === id)
    if (!deal) return
    const idx  = STAGES.indexOf(deal.stage)
    const next = STAGES[idx + dir]
    if (!next) return
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: next } : d))
    await supabase.from('deals').update({ stage: next }).eq('id', id)
    showToast(`Moved to ${next}`)
  }

  async function addDeal() {
    if (!newDeal.name.trim()) return
    const initials = newDeal.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const color    = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    const { data, error } = await supabase.from('deals').insert({
      name: newDeal.name.trim(), contact: newDeal.contact.trim(),
      value: parseFloat(newDeal.value) || 0, stage: 'Lead',
      avatar: initials, color, days_ago: 0,
    }).select().single()
    if (!error && data) {
      setDeals(prev => [data, ...prev])
      showToast('Deal added!')
    }
    setNewDeal({ name: '', contact: '', value: '' })
    setShowAdd(false)
  }

  const pipeline = deals.filter(d => d.stage !== 'Closed').reduce((s, d) => s + Number(d.value), 0)
  const won      = deals.filter(d => d.stage === 'Closed').reduce((s, d) => s + Number(d.value), 0)
  const hot      = deals.filter(d => ['Negotiation','Proposal'].includes(d.stage)).length

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <TopHeader title="CRM" subtitle="Pipeline & Contacts" />
      <div className="flex gap-3 px-4 pb-3">
        {[{ label:'Pipeline', value:`$${(pipeline/1000).toFixed(0)}k`, color:'text-slate-800' },
          { label:'Won',      value:`$${(won/1000).toFixed(0)}k`,      color:'text-emerald-600' },
          { label:'Hot',      value:String(hot),                       color:'text-orange-500' }].map(({label,value,color})=>(
          <div key={label} className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex mx-4 mb-4 bg-slate-200 rounded-xl p-1">
        {[['pipeline','📊 Pipeline'],['contacts','👥 Contacts']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab===key?'bg-white text-slate-800 shadow-sm':'text-slate-500'}`}>{label}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? <div className="text-center py-16 text-slate-400 text-sm">Loading…</div>
          : tab==='pipeline' ? <PipelineView deals={deals} onMoveStage={moveStage} />
          : <ContactsView contacts={contacts} loading={false} />}
      </div>
      {tab==='pipeline' && (
        <div className="px-4 pb-4 pt-2">
          <button onClick={()=>setShowAdd(true)} className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm shadow-lg active:bg-emerald-700 transition-colors">+ Add Deal</button>
        </div>
      )}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={()=>setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-slate-800 mb-4">New Deal</h3>
            <div className="flex flex-col gap-3">
              <input className="inp" placeholder="Company name *" value={newDeal.name} onChange={e=>setNewDeal(p=>({...p,name:e.target.value}))} />
              <input className="inp" placeholder="Contact person" value={newDeal.contact} onChange={e=>setNewDeal(p=>({...p,contact:e.target.value}))} />
              <input className="inp" placeholder="Deal value (e.g. 15000)" type="number" value={newDeal.value} onChange={e=>setNewDeal(p=>({...p,value:e.target.value}))} />
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