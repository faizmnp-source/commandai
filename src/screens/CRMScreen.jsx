import { useState } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'

/* ─── seed data ─────────────────────────────────────────────── */
const PIPELINE_SEED = [
  { id: 1, stage: 'Lead',        name: 'TechCorp Ltd',     contact: 'Sarah Johnson', value: '$12,000', avatar: 'TC', color: 'bg-violet-500', daysAgo: 2 },
  { id: 2, stage: 'Qualified',   name: 'GreenPath Inc',    contact: 'Mark Reeves',   value: '$8,500',  avatar: 'GP', color: 'bg-sky-500',    daysAgo: 5 },
  { id: 3, stage: 'Proposal',    name: 'Nova Studios',     contact: 'Anya Patel',    value: '$22,000', avatar: 'NS', color: 'bg-fuchsia-500',daysAgo: 1 },
  { id: 4, stage: 'Negotiation', name: 'BlueSky Retail',   contact: 'Tom Walsh',     value: '$35,000', avatar: 'BR', color: 'bg-orange-500', daysAgo: 7 },
  { id: 5, stage: 'Lead',        name: 'Vertex Logistics', contact: 'Chen Li',       value: '$5,000',  avatar: 'VL', color: 'bg-emerald-500',daysAgo: 0 },
  { id: 6, stage: 'Closed',      name: 'Apex Finance',     contact: 'Diana Ross',    value: '$50,000', avatar: 'AF', color: 'bg-rose-500',   daysAgo: 12 },
]

const CONTACTS = [
  { id: 1, name: 'Sarah Johnson', company: 'TechCorp Ltd',     role: 'CTO',      avatar: 'SJ', color: 'bg-violet-500',  status: 'Hot'  },
  { id: 2, name: 'Mark Reeves',   company: 'GreenPath Inc',    role: 'CEO',      avatar: 'MR', color: 'bg-sky-500',     status: 'Warm' },
  { id: 3, name: 'Anya Patel',    company: 'Nova Studios',     role: 'Director', avatar: 'AP', color: 'bg-fuchsia-500', status: 'Hot'  },
  { id: 4, name: 'Tom Walsh',     company: 'BlueSky Retail',   role: 'VP Sales', avatar: 'TW', color: 'bg-orange-500',  status: 'Cold' },
  { id: 5, name: 'Chen Li',       company: 'Vertex Logistics', role: 'Founder',  avatar: 'CL', color: 'bg-emerald-500', status: 'Warm' },
  { id: 6, name: 'Diana Ross',    company: 'Apex Finance',     role: 'CFO',      avatar: 'DR', color: 'bg-rose-500',    status: 'Won'  },
]

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

/* ─── DealCard ────────────────────────────────────────────────── */
function DealCard({ deal, onMoveStage }) {
  const [expanded, setExpanded] = useState(false)
  const stageIdx = STAGES.indexOf(deal.stage)

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 active:scale-95 transition-transform cursor-pointer"
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 rounded-full ${deal.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {deal.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{deal.name}</p>
          <p className="text-xs text-slate-400 truncate">{deal.contact}</p>
        </div>
        <p className="text-sm font-bold text-emerald-600 whitespace-nowrap">{deal.value}</p>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 animate-fade-up">
          <p className="text-xs text-slate-400 mb-2">
            {deal.daysAgo === 0 ? 'Added today' : `${deal.daysAgo}d ago`}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {stageIdx > 0 && (
              <button
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium active:bg-slate-200"
                onClick={e => { e.stopPropagation(); onMoveStage(deal.id, -1) }}
              >
                ← {STAGES[stageIdx - 1]}
              </button>
            )}
            {stageIdx < STAGES.length - 1 && (
              <button
                className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium active:bg-emerald-100"
                onClick={e => { e.stopPropagation(); onMoveStage(deal.id, 1) }}
              >
                {STAGES[stageIdx + 1]} →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── PipelineView ────────────────────────────────────────────── */
function PipelineView({ deals, onMoveStage }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
      {STAGES.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage)
        const total = stageDeals.reduce((s, d) => s + parseInt(d.value.replace(/\D/g, ''), 10), 0)
        return (
          <div key={stage} className="min-w-[190px] snap-start flex-shrink-0">
            {/* column header */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
              <span className="text-xs text-slate-400">${(total / 1000).toFixed(0)}k</span>
            </div>
            {/* cards */}
            <div className="flex flex-col gap-2">
              {stageDeals.length === 0 && (
                <div className="h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-slate-300">Empty</span>
                </div>
              )}
              {stageDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} onMoveStage={onMoveStage} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── ContactsView ────────────────────────────────────────────── */
function ContactsView() {
  const [search, setSearch] = useState('')
  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4">
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 flex items-center gap-3 active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full ${c.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-400">{c.role} · {c.company}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[c.status]}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── CRMScreen (main) ────────────────────────────────────────── */
export default function CRMScreen() {
  const showToast = useAppStore(s => s.showToast)
  const [tab, setTab]         = useState('pipeline')
  const [deals, setDeals]     = useState(PIPELINE_SEED)
  const [showAdd, setShowAdd] = useState(false)
  const [newDeal, setNewDeal] = useState({ name: '', contact: '', value: '' })

  function moveStage(id, dir) {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d
      const idx  = STAGES.indexOf(d.stage)
      const next = STAGES[idx + dir]
      if (!next) return d
      showToast(`Moved to ${next}`)
      return { ...d, stage: next }
    }))
  }

  function addDeal() {
    if (!newDeal.name.trim()) return
    const palette  = ['bg-violet-500','bg-sky-500','bg-fuchsia-500','bg-orange-500','bg-teal-500']
    const initials = newDeal.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    setDeals(prev => [...prev, {
      id:      Date.now(),
      stage:   'Lead',
      name:    newDeal.name.trim(),
      contact: newDeal.contact.trim(),
      value:   newDeal.value ? `$${parseInt(newDeal.value, 10).toLocaleString()}` : '$0',
      avatar:  initials,
      color:   palette[Math.floor(Math.random() * palette.length)],
      daysAgo: 0,
    }])
    setNewDeal({ name: '', contact: '', value: '' })
    setShowAdd(false)
    showToast('Deal added to pipeline!')
  }

  /* KPI values */
  const pipeline = deals.filter(d => d.stage !== 'Closed').reduce((s, d) => s + parseInt(d.value.replace(/\D/g, ''), 10), 0)
  const won      = deals.filter(d => d.stage === 'Closed').reduce((s, d) => s + parseInt(d.value.replace(/\D/g, ''), 10), 0)
  const hot      = deals.filter(d => ['Negotiation', 'Proposal'].includes(d.stage)).length

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <TopHeader title="CRM" subtitle="Pipeline & Contacts" />

      {/* KPI strip */}
      <div className="flex gap-3 px-4 pb-3">
        {[
          { label: 'Pipeline', value: `$${(pipeline / 1000).toFixed(0)}k`, color: 'text-slate-800' },
          { label: 'Won',      value: `$${(won / 1000).toFixed(0)}k`,      color: 'text-emerald-600' },
          { label: 'Hot',      value: String(hot),                         color: 'text-orange-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* tab bar */}
      <div className="flex mx-4 mb-4 bg-slate-200 rounded-xl p-1">
        {[['pipeline','📊 Pipeline'],['contacts','👥 Contacts']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'pipeline'
          ? <PipelineView deals={deals} onMoveStage={moveStage} />
          : <ContactsView />
        }
      </div>

      {/* Add Deal FAB */}
      {tab === 'pipeline' && (
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm shadow-lg active:bg-emerald-700 transition-colors"
          >
            + Add Deal
          </button>
        </div>
      )}

      {/* Add Deal bottom sheet */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-slate-800 mb-4">New Deal</h3>
            <div className="flex flex-col gap-3">
              <input
                className="inp"
                placeholder="Company name *"
                value={newDeal.name}
                onChange={e => setNewDeal(p => ({ ...p, name: e.target.value }))}
              />
              <input
                className="inp"
                placeholder="Contact person"
                value={newDeal.contact}
                onChange={e => setNewDeal(p => ({ ...p, contact: e.target.value }))}
              />
              <input
                className="inp"
                placeholder="Deal value (e.g. 15000)"
                type="number"
                value={newDeal.value}
                onChange={e => setNewDeal(p => ({ ...p, value: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={addDeal} className="flex-1 btn-em">Add Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
