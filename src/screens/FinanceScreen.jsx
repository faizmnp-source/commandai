import { useState, useEffect, useCallback } from 'react'
import TopHeader from '../components/layout/TopHeader'
import useAppStore from '../store/appStore'
import { supabase } from '../lib/supabase'

const TYPE_COLORS = { income: 'text-emerald-600', expense: 'text-rose-500' }
const TYPE_BG     = { income: 'bg-emerald-50',    expense: 'bg-rose-50' }
const TYPE_ICON   = { income: '↑',                expense: '↓' }

const INV_COLORS = {
  paid:    'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-600',
  overdue: 'bg-rose-100 text-rose-600',
}

const CATEGORIES = ['Sales','Consulting','SaaS','Marketing','Payroll','Office','Software','Travel','Other']

function TransactionsView({ txns, loading }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all' ? txns : txns.filter(t=>t.type===filter)
  return (
    <div className="px-4">
      <div className="flex gap-2 mb-4">
        {[['all','All'],['income','Income'],['expense','Expense']].map(([key,label])=>(
          <button key={key} onClick={()=>setFilter(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${filter===key?'bg-emerald-600 text-white':'bg-slate-100 text-slate-500'}`}>{label}</button>
        ))}
      </div>
      {loading ? <div className="text-center py-10 text-slate-400 text-sm">Loading…</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(t=>(
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${TYPE_BG[t.type]} flex items-center justify-center text-lg font-bold ${TYPE_COLORS[t.type]} flex-shrink-0`}>
                {TYPE_ICON[t.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{t.description}</p>
                <p className="text-xs text-slate-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
              </div>
              <p className={`text-sm font-bold whitespace-nowrap ${TYPE_COLORS[t.type]}`}>
                {t.type==='income'?'+':'-'}${Number(t.amount).toLocaleString()}
              </p>
            </div>
          ))}
          {filtered.length===0 && <div className="text-center py-10 text-slate-400 text-sm">No transactions</div>}
        </div>
      )}
    </div>
  )
}

function InvoicesView({ invoices, loading }) {
  return (
    <div className="px-4">
      {loading ? <div className="text-center py-10 text-slate-400 text-sm">Loading…</div> : (
        <div className="flex flex-col gap-2">
          {invoices.map(inv=>(
            <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-bold text-slate-800">{inv.number}</p>
                  <p className="text-xs text-slate-400">{inv.client}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${INV_COLORS[inv.status]}`}>{inv.status}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-400">Due {new Date(inv.due_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                <p className="text-base font-bold text-slate-800">${Number(inv.amount).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {invoices.length===0 && <div className="text-center py-10 text-slate-400 text-sm">No invoices</div>}
        </div>
      )}
    </div>
  )
}

export default function FinanceScreen() {
  const showToast = useAppStore(s=>s.showToast)
  const [tab, setTab]         = useState('overview')
  const [txns, setTxns]       = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState('income')  // 'income' | 'expense' | 'invoice'
  const [form, setForm] = useState({ description:'', amount:'', category:'Sales', client:'', dueDate:'' })

  const load = useCallback(async () => {
    const [{ data: t }, { data: i }] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
    ])
    if (t) setTxns(t)
    if (i) setInvoices(i)
  }, [])

  useEffect(() => { load().finally(()=>setLoading(false)) }, [load])

  /* KPIs */
  const totalIncome  = txns.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const totalExpense = txns.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
  const profit       = totalIncome - totalExpense
  const outstanding  = invoices.filter(i=>i.status!=='paid').reduce((s,i)=>s+Number(i.amount),0)

  async function submit() {
    if (!form.amount) return
    if (addType==='invoice') {
      const num = 'INV-' + (1045 + invoices.length)
      const { data, error } = await supabase.from('invoices').insert({
        number: num, client: form.client||'Unknown', amount: parseFloat(form.amount),
        status: 'pending', due_date: form.dueDate || null,
      }).select().single()
      if (!error && data) { setInvoices(p=>[data,...p]); showToast('Invoice created!') }
    } else {
      const { data, error } = await supabase.from('transactions').insert({
        type: addType, description: form.description||'—', category: form.category,
        amount: parseFloat(form.amount), date: new Date().toISOString().slice(0,10), status:'completed',
      }).select().single()
      if (!error && data) { setTxns(p=>[data,...p]); showToast(`${addType==='income'?'Income':'Expense'} recorded!`) }
    }
    setForm({ description:'', amount:'', category:'Sales', client:'', dueDate:'' })
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <TopHeader title="Finance" subtitle="P&L · Invoices · Cash Flow" />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-3">
        {[
          { label:'Revenue',     value:`$${(totalIncome/1000).toFixed(1)}k`,  color:'text-emerald-600', bg:'bg-emerald-50' },
          { label:'Expenses',    value:`$${(totalExpense/1000).toFixed(1)}k`, color:'text-rose-500',    bg:'bg-rose-50' },
          { label:'Net Profit',  value:`$${(profit/1000).toFixed(1)}k`,       color: profit>=0?'text-emerald-700':'text-rose-600', bg:'bg-white' },
          { label:'Outstanding', value:`$${(outstanding/1000).toFixed(1)}k`,  color:'text-orange-500',  bg:'bg-orange-50' },
        ].map(({label,value,color,bg})=>(
          <div key={label} className={`${bg} rounded-2xl p-3 shadow-sm border border-slate-100 text-center`}>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="flex mx-4 mb-4 bg-slate-200 rounded-xl p-1">
        {[['overview','📊 Transactions'],['invoices','🧾 Invoices']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab===key?'bg-white text-slate-800 shadow-sm':'text-slate-500'}`}>{label}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab==='overview'
          ? <TransactionsView txns={txns} loading={loading}/>
          : <InvoicesView invoices={invoices} loading={loading}/>}
      </div>

      {/* FAB */}
      <div className="px-4 pb-4 pt-2 flex gap-2">
        {[['income','+ Income'],['expense','+ Expense'],['invoice','+ Invoice']].map(([type,label])=>(
          <button key={type} onClick={()=>{ setAddType(type); setShowAdd(true) }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-colors
              ${type==='income'?'bg-emerald-600 text-white active:bg-emerald-700'
               :type==='expense'?'bg-rose-500 text-white active:bg-rose-600'
               :'bg-slate-700 text-white active:bg-slate-800'}`}>{label}</button>
        ))}
      </div>

      {/* Add bottom sheet */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={()=>setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5"/>
            <h3 className="text-lg font-bold text-slate-800 mb-4 capitalize">
              {addType==='invoice'?'New Invoice':`Record ${addType}`}
            </h3>
            <div className="flex flex-col gap-3">
              {addType==='invoice' ? (
                <>
                  <input className="inp" placeholder="Client name *" value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}/>
                  <input className="inp" placeholder="Amount *" type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/>
                  <input className="inp" placeholder="Due date (YYYY-MM-DD)" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/>
                </>
              ) : (
                <>
                  <input className="inp" placeholder="Description *" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/>
                  <input className="inp" placeholder="Amount *" type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/>
                  <select className="inp" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={submit} className="flex-1 btn-em">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}