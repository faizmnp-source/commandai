import { useState, useMemo, useRef } from 'react'
import useAppStore from '../store/appStore'

/* ── Constants ───────────────────────────────────────────────── */
const INCOME_CATS  = ['SaaS / Subscriptions','Consulting','Professional Services','Product Sales','Investments','Other Income']
const EXPENSE_CATS = ['Cost of Revenue','Payroll','Rent & Facilities','Software & Tools','Marketing & Ads','Travel','Legal & Professional','Hardware','Other Expense']
const PERIODS = [['month','This Month'],['q2','Q2 2026'],['q1','Q1 2026'],['ytd','YTD'],['all','All Time']]

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt     = n => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`
const fmtFull = n => `$${Math.abs(n).toLocaleString()}`
const dateLabel = d => { try { return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) } catch { return d } }
const srcBadge  = s => ({ manual:{bg:'rgba(37,99,235,.1)',color:'#2563eb',label:'Manual'}, csv:{bg:'rgba(5,150,105,.1)',color:'#059669',label:'CSV'}, invoice:{bg:'rgba(124,58,237,.1)',color:'#7c3aed',label:'Invoice'}, connect:{bg:'rgba(234,88,12,.1)',color:'#ea580c',label:'POS'} }[s] || {bg:'rgba(100,116,139,.1)',color:'#64748b',label:s})

function filterByPeriod(txs, period) {
  const now = new Date(); const yr = now.getFullYear(); const mo = now.getMonth()
  return txs.filter(t => {
    const d = new Date(t.date + 'T12:00:00')
    if (period === 'month') return d.getMonth() === mo && d.getFullYear() === yr
    if (period === 'q2')    return d.getMonth() >= 3 && d.getMonth() < 6 && d.getFullYear() === yr
    if (period === 'q1')    return d.getMonth() < 3 && d.getFullYear() === yr
    if (period === 'ytd')   return d.getFullYear() === yr
    return true
  })
}

function parseCSVLine(line) {
  const res = []; let cur = ''; let inQ = false
  for (const ch of line) {
    if (ch === '"') inQ = !inQ
    else if (ch === ',' && !inQ) { res.push(cur.trim()); cur = '' }
    else cur += ch
  }
  res.push(cur.trim()); return res
}

/* ── FinSection / FinLine ────────────────────────────────────── */
function FinSection({ title, children }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5 px-1">
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'#94a3b8', textTransform:'uppercase' }}>{title}</span>
        <div style={{ flex:1, height:1, background:'rgba(0,0,0,.06)' }}/>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,.85)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(16px)', boxShadow:'0 2px 10px rgba(0,0,0,.05), inset 0 1px 0 #fff' }}>
        {children}
      </div>
    </div>
  )
}

function FinLine({ label, amount, indent, bold, total, neg, positive }) {
  const txtColor = total ? (positive ? '#059669' : amount < 0 ? '#dc2626' : '#1e293b') : '#475569'
  const amtColor = positive ? '#059669' : (neg || (total && amount < 0)) ? '#dc2626' : '#1e293b'
  return (
    <div className="flex items-center justify-between" style={{ padding:'9px 16px', borderBottom:'1px solid rgba(0,0,0,.04)', background: total ? 'rgba(99,120,180,.03)' : 'transparent' }}>
      <span style={{ fontSize:12, color:txtColor, fontWeight: bold ? 700 : 500, paddingLeft: indent ? 10 : 0 }}>{label}</span>
      {amount !== undefined && (
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:12, fontWeight: bold ? 700 : 500, color: amtColor }}>
          {neg ? '-' : ''}{fmtFull(Math.abs(amount))}
        </span>
      )}
    </div>
  )
}

/* ── Manual Entry Form ───────────────────────────────────────── */
function ManualForm({ onSave, onCancel }) {
  const today = new Date().toISOString().slice(0,10)
  const [tp, setTp]   = useState('income')
  const [date, setDate] = useState(today)
  const [cat, setCat] = useState(INCOME_CATS[0])
  const [desc, setDesc] = useState('')
  const [amt, setAmt]   = useState('')
  const [notes, setNotes] = useState('')

  const cats = tp === 'income' ? INCOME_CATS : EXPENSE_CATS

  function switchType(v) { setTp(v); setCat(v === 'income' ? INCOME_CATS[0] : EXPENSE_CATS[0]) }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid #e2e8f0' }}>
        {[['income','+ Income'],['expense','- Expense']].map(([v,l]) => (
          <button key={v} onClick={() => switchType(v)} className="flex-1 py-2.5 font-bold transition-all"
            style={{ fontSize:13, background: tp===v ? (v==='income'?'#059669':'#dc2626') : 'white', color: tp===v ? '#fff' : '#94a3b8' }}>{l}</button>
        ))}
      </div>
      <input type="date" className="inp" value={date} onChange={e => setDate(e.target.value)} />
      <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>
        {cats.map(c => <option key={c}>{c}</option>)}
      </select>
      <input className="inp" placeholder="Description / Merchant *" value={desc} onChange={e => setDesc(e.target.value)} />
      <div className="relative">
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#94a3b8' }}>$</span>
        <input className="inp" style={{ paddingLeft:28 }} placeholder="0.00" type="number" step="0.01" min="0" value={amt} onChange={e => setAmt(e.target.value)} />
      </div>
      <input className="inp" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
        <button onClick={() => { if (!desc.trim() || !amt) return; onSave({ date, type:tp, cat, desc, amount:parseFloat(amt), src:'manual', notes }) }} className="btn-em flex-1">Save Entry</button>
      </div>
    </div>
  )
}

/* ── CSV Import ──────────────────────────────────────────────── */
function CSVImport({ onImport, onCancel }) {
  const [preview, setPreview] = useState(null)
  const [colMap, setColMap]   = useState({ date:'', desc:'', amount:'', type:'' })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      const lines = e.target.result.trim().split('\n').filter(l => l.trim())
      if (lines.length < 2) return
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/['"]/g,''))
      const rows = lines.slice(1, 5).map(l => parseCSVLine(l).map(v => v.replace(/['"]/g,'')))
      setPreview({ headers, rows, allLines: lines })
      const autoMap = { date:'', desc:'', amount:'', type:'' }
      headers.forEach(h => {
        const hl = h.toLowerCase()
        if (/date|time/.test(hl)) autoMap.date = h
        if (/desc|name|memo|narr/.test(hl)) autoMap.desc = h
        if (/amount|amt|value|debit|credit/.test(hl)) autoMap.amount = h
        if (/type|kind|categ/.test(hl)) autoMap.type = h
      })
      setColMap(autoMap)
    }
    reader.readAsText(file)
  }

  function doImport() {
    if (!preview || !colMap.date || !colMap.desc || !colMap.amount) return
    const txs = preview.allLines.slice(1).map((l, i) => {
      const vals = parseCSVLine(l).map(v => v.replace(/['"]/g,''))
      const get = col => vals[preview.headers.indexOf(col)] || ''
      const rawAmt = parseFloat(get(colMap.amount).replace(/[$,]/g,''))
      return { id: Date.now()+i, date: get(colMap.date), type: rawAmt < 0 ? 'expense' : 'income', cat: 'Other Income', desc: get(colMap.desc), amount: Math.abs(rawAmt), src: 'csv' }
    }).filter(t => !isNaN(t.amount) && t.amount > 0)
    onImport(txs)
  }

  if (!preview) return (
    <div className="space-y-3 pt-2">
      <div
        className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
        style={{ height:120, border:`2px dashed ${dragging ? '#2563eb' : '#e2e8f0'}`, background: dragging ? 'rgba(37,99,235,.04)' : 'rgba(248,250,252,.8)' }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => fileRef.current?.click()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        <span style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Drop CSV or click to browse</span>
        <span style={{ fontSize:11, color:'#94a3b8' }}>Bank statements · QuickBooks · Xero exports</span>
      </div>
      <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
      <button onClick={onCancel} className="btn-ghost w-full">Cancel</button>
    </div>
  )

  return (
    <div className="space-y-3 pt-2">
      <p style={{ fontSize:12, color:'#059669', fontWeight:600 }}>✓ {preview.allLines.length - 1} rows detected — map your columns:</p>
      <div className="grid grid-cols-2 gap-2">
        {[['date','Date Column'],['desc','Description'],['amount','Amount'],['type','Type (optional)']].map(([k,lbl]) => (
          <div key={k}>
            <p style={{ fontSize:10, color:'#94a3b8', fontWeight:700, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>{lbl}</p>
            <select className="inp" style={{ fontSize:12, padding:'7px 10px' }} value={colMap[k]} onChange={e => setColMap(p => ({...p,[k]:e.target.value}))}>
              <option value="">-- skip --</option>
              {preview.headers.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border:'1px solid #e2e8f0' }}>
        <div className="overflow-x-auto no-scrollbar">
          <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#f8fafc' }}>{preview.headers.map(h => <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'#94a3b8', fontWeight:700, borderBottom:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{preview.rows.slice(0,3).map((row,i) => <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>{row.map((cell,j) => <td key={j} style={{ padding:'6px 10px', color:'#475569', whiteSpace:'nowrap', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis' }}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setPreview(null)} className="btn-ghost flex-1">Back</button>
        <button onClick={doImport} className="btn-em flex-1" disabled={!colMap.date || !colMap.desc || !colMap.amount}>Import {preview.allLines.length - 1} Rows</button>
      </div>
    </div>
  )
}

/* ── Invoice Upload ──────────────────────────────────────────── */
function InvoiceUpload({ onSave, onCancel }) {
  const [state, setState]   = useState('idle')
  const [fields, setFields] = useState(null)
  const fileRef = useRef()

  function handleFile(file) {
    if (!file) return
    setState('extracting')
    setTimeout(() => {
      setFields({ date: new Date().toISOString().slice(0,10), desc: file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '), amount:'', cat:'Professional Services', type:'income', invoiceNo:`INV-${Math.floor(Math.random()*9000)+1000}` })
      setState('done')
    }, 2200)
  }

  if (state === 'idle') return (
    <div className="space-y-3 pt-2">
      <div className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ height:120, border:'2px dashed #e2e8f0', background:'rgba(248,250,252,.8)' }} onClick={() => fileRef.current?.click()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
        <span style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Upload invoice or receipt</span>
        <span style={{ fontSize:11, color:'#94a3b8' }}>PDF, JPG, PNG — AI extracts the data</span>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
      <button onClick={onCancel} className="btn-ghost w-full">Cancel</button>
    </div>
  )

  if (state === 'extracting') return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(124,58,237,.2)', borderTopColor:'#7c3aed', animation:'spin .8s linear infinite' }}/>
      <div className="text-center">
        <p style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>Extracting data…</p>
        <p style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>AI is reading your invoice fields</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-3 pt-2">
      <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ background:'rgba(5,150,105,.06)', border:'1px solid rgba(5,150,105,.15)' }}>
        <span style={{ fontSize:16 }}>✓</span>
        <span style={{ fontSize:12, color:'#059669', fontWeight:600 }}>Extracted — confirm the details below</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><p style={{ fontSize:10, color:'#94a3b8', marginBottom:4 }}>INVOICE NO.</p><input className="inp" style={{ fontSize:12 }} value={fields.invoiceNo} onChange={e => setFields(p => ({...p,invoiceNo:e.target.value}))} /></div>
        <div><p style={{ fontSize:10, color:'#94a3b8', marginBottom:4 }}>DATE</p><input type="date" className="inp" style={{ fontSize:12 }} value={fields.date} onChange={e => setFields(p => ({...p,date:e.target.value}))} /></div>
      </div>
      <div><p style={{ fontSize:10, color:'#94a3b8', marginBottom:4 }}>DESCRIPTION</p><input className="inp" style={{ fontSize:12 }} value={fields.desc} onChange={e => setFields(p => ({...p,desc:e.target.value}))} /></div>
      <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid #e2e8f0' }}>
        {[['income','Income'],['expense','Expense']].map(([v,l]) => (
          <button key={v} onClick={() => setFields(p => ({...p,type:v}))} className="flex-1 py-2 font-bold transition-all"
            style={{ fontSize:12, background: fields.type===v ? (v==='income'?'#059669':'#dc2626') : 'white', color: fields.type===v ? '#fff' : '#94a3b8' }}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><p style={{ fontSize:10, color:'#94a3b8', marginBottom:4 }}>CATEGORY</p>
          <select className="inp" style={{ fontSize:12 }} value={fields.cat} onChange={e => setFields(p => ({...p,cat:e.target.value}))}>
            {[...INCOME_CATS,...EXPENSE_CATS].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><p style={{ fontSize:10, color:'#94a3b8', marginBottom:4 }}>AMOUNT</p>
          <div className="relative"><span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#94a3b8' }}>$</span>
          <input className="inp" style={{ fontSize:12, paddingLeft:24 }} placeholder="0.00" type="number" value={fields.amount} onChange={e => setFields(p => ({...p,amount:e.target.value}))} /></div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
        <button onClick={() => { if (!fields.amount) return; onSave({ date:fields.date, type:fields.type, cat:fields.cat, desc:fields.desc, amount:parseFloat(fields.amount), src:'invoice' }) }} className="btn-em flex-1">Confirm & Save</button>
      </div>
    </div>
  )
}

/* ── Connect Sources ─────────────────────────────────────────── */
function ConnectSources({ onCancel }) {
  const SRC = [
    { name:'Square',     logo:'SQ', color:'#059669', bg:'rgba(5,150,105,.1)',  status:'connect', desc:'POS & payments'   },
    { name:'Stripe',     logo:'ST', color:'#6d28d9', bg:'rgba(109,40,217,.1)',status:'connect', desc:'Online payments'  },
    { name:'Plaid',      logo:'PL', color:'#0d9488', bg:'rgba(13,148,136,.1)', status:'connect', desc:'Bank connection'  },
    { name:'QuickBooks', logo:'QB', color:'#2563eb', bg:'rgba(37,99,235,.1)',  status:'soon',    desc:'Accounting'       },
    { name:'Xero',       logo:'XE', color:'#0284c7', bg:'rgba(2,132,199,.1)',  status:'soon',    desc:'Accounting'       },
    { name:'Shopify',    logo:'SH', color:'#d97706', bg:'rgba(217,119,6,.1)',  status:'soon',    desc:'eCommerce & POS'  },
  ]
  return (
    <div className="space-y-2 pt-2">
      <p style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>Connect your financial data sources for automatic sync and real-time reporting.</p>
      {SRC.map(s => (
        <div key={s.name} className="rounded-xl flex items-center gap-3 px-4 py-3" style={{ background:'rgba(255,255,255,.85)', border:'1px solid rgba(226,232,240,.9)', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background:s.bg, color:s.color }}>{s.logo}</div>
          <div className="flex-1"><p style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{s.name}</p><p style={{ fontSize:11, color:'#94a3b8' }}>{s.desc}</p></div>
          {s.status === 'connect'
            ? <button className="font-bold rounded-lg px-3 py-1.5" style={{ fontSize:11, background:s.bg, color:s.color, border:`1px solid ${s.color}20` }} onClick={() => alert(`OAuth flow for ${s.name} — coming soon!`)}>Connect</button>
            : <span className="font-semibold rounded-lg px-3 py-1.5" style={{ fontSize:11, background:'rgba(100,116,139,.08)', color:'#94a3b8' }}>Soon</span>
          }
        </div>
      ))}
      <div className="pt-2"><button onClick={onCancel} className="btn-ghost w-full">Close</button></div>
    </div>
  )
}

/* ── P&L View ────────────────────────────────────────────────── */
function PLView({ filtered }) {
  const inc = filtered.filter(t => t.type === 'income')
  const exp = filtered.filter(t => t.type === 'expense')

  const revenue = INCOME_CATS.map(cat => ({ cat, amount: inc.filter(t => t.cat === cat).reduce((s,t) => s+t.amount, 0) })).filter(r => r.amount > 0)
  const totalRevenue  = revenue.reduce((s,r) => s+r.amount, 0)
  const cogs          = exp.filter(t => t.cat === 'Cost of Revenue').reduce((s,t) => s+t.amount, 0)
  const gp            = totalRevenue - cogs
  const gpPct         = totalRevenue > 0 ? (gp/totalRevenue*100).toFixed(1) : 0
  const opex          = EXPENSE_CATS.filter(c => c !== 'Cost of Revenue').map(cat => ({ cat, amount: exp.filter(t => t.cat === cat).reduce((s,t) => s+t.amount, 0) })).filter(r => r.amount > 0)
  const totalOpex     = opex.reduce((s,r) => s+r.amount, 0)
  const net           = gp - totalOpex
  const netPct        = totalRevenue > 0 ? (net/totalRevenue*100).toFixed(1) : 0

  if (totalRevenue === 0 && totalOpex === 0) return (
    <div className="flex flex-col items-center gap-3 py-12">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      <p style={{ fontSize:13, color:'#94a3b8', fontWeight:600 }}>No transactions in this period</p>
      <p style={{ fontSize:11, color:'#cbd5e1' }}>Add entries or import a CSV to see your P&L</p>
    </div>
  )

  return (
    <div className="px-4 pb-4">
      <FinSection title="Revenue">
        {revenue.map(r => <FinLine key={r.cat} label={r.cat} amount={r.amount} indent />)}
        <FinLine label="Total Revenue" amount={totalRevenue} bold total positive />
      </FinSection>

      {cogs > 0 && (
        <FinSection title="Cost of Revenue">
          <FinLine label="Cost of Revenue" amount={cogs} indent neg />
          <FinLine label={`Gross Profit · ${gpPct}% margin`} amount={gp} bold total positive={gp >= 0} />
        </FinSection>
      )}

      {opex.length > 0 && (
        <FinSection title="Operating Expenses">
          {opex.map(r => <FinLine key={r.cat} label={r.cat} amount={r.amount} indent neg />)}
          <FinLine label="Total Operating Expenses" amount={totalOpex} bold total />
        </FinSection>
      )}

      {/* Net Income card */}
      <div className="rounded-xl px-4 py-4 mt-1" style={{ background: net >= 0 ? 'rgba(5,150,105,.06)' : 'rgba(220,38,38,.06)', border:`1px solid ${net >= 0 ? 'rgba(5,150,105,.18)' : 'rgba(220,38,38,.18)'}` }}>
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'#94a3b8', textTransform:'uppercase', marginBottom:4 }}>Net Income</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, letterSpacing:'-0.03em', color: net >= 0 ? '#059669' : '#dc2626', lineHeight:1 }}>
              {net >= 0 ? '+' : '-'}{fmtFull(net)}
            </p>
          </div>
          <div className="text-right">
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'#94a3b8', textTransform:'uppercase', marginBottom:4 }}>Net Margin</p>
            <p style={{ fontSize:18, fontWeight:800, color: net >= 0 ? '#059669' : '#dc2626' }}>{netPct}%</p>
          </div>
        </div>
        <div className="flex gap-5 mt-3" style={{ borderTop:'1px solid rgba(0,0,0,.06)', paddingTop:10 }}>
          <div><p style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>Revenue</p><p style={{ fontSize:13, fontWeight:700, color:'#059669' }}>{fmt(totalRevenue)}</p></div>
          <div><p style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>Expenses</p><p style={{ fontSize:13, fontWeight:700, color:'#dc2626' }}>{fmt(cogs + totalOpex)}</p></div>
          <div><p style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>Gross Margin</p><p style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{gpPct > 0 ? gpPct : '—'}%</p></div>
        </div>
      </div>
    </div>
  )
}

/* ── Transactions View ───────────────────────────────────────── */
function TxView({ filtered }) {
  const [search, setSearch]   = useState('')
  const [tpf, setTpf]         = useState('all')

  const shown = [...filtered]
    .filter(t => tpf === 'all' || t.type === tpf)
    .filter(t => !search || t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="px-4">
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…" className="inp w-full pl-8" style={{ fontSize:13 }}/>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {[['all','All'],['income','Income'],['expense','Expenses']].map(([v,l]) => (
          <button key={v} onClick={() => setTpf(v)} className="font-semibold rounded-lg px-3 py-1.5 transition-all"
            style={{ fontSize:11, background: tpf===v ? '#0f172a' : 'rgba(255,255,255,.8)', color: tpf===v ? '#fff' : '#64748b', border: tpf===v ? '1px solid #0f172a' : '1px solid rgba(226,232,240,.9)' }}>{l}</button>
        ))}
        <span style={{ fontSize:11, color:'#94a3b8', marginLeft:'auto' }}>{shown.length} entries</span>
      </div>
      <div className="space-y-2">
        {shown.length === 0 && <div className="text-center py-8"><p style={{ fontSize:13, color:'#94a3b8' }}>No transactions found</p></div>}
        {shown.map(t => {
          const badge = srcBadge(t.src)
          return (
            <div key={t.id} className="rounded-xl flex items-center gap-3 px-4 py-3" style={{ background:'rgba(255,255,255,.85)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(12px)', boxShadow:'0 1px 6px rgba(0,0,0,.05), inset 0 1px 0 #fff' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.type==='income' ? '#059669' : '#dc2626' }}/>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ fontSize:13, color:'#1e293b' }}>{t.desc}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span style={{ fontSize:10, color:'#94a3b8' }}>{dateLabel(t.date)}</span>
                  <span style={{ fontSize:10, color:'#cbd5e1' }}>·</span>
                  <span style={{ fontSize:10, color:'#94a3b8' }}>{t.cat}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p style={{ fontSize:13, fontWeight:700, fontFamily:'ui-monospace,monospace', color: t.type==='income' ? '#059669' : '#dc2626' }}>
                  {t.type==='income' ? '+' : '-'}{fmtFull(t.amount)}
                </p>
                <span className="rounded-md font-semibold" style={{ fontSize:9, background:badge.bg, color:badge.color, padding:'1px 5px' }}>{badge.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main Screen ─────────────────────────────────────────────── */
export default function FinanceScreen() {
  const { transactions, addTransaction, addTransactions, showToast } = useAppStore()
  const [tab, setTab]             = useState('pl')
  const [period, setPeriod]       = useState('month')
  const [showEntry, setShowEntry] = useState(false)
  const [entryTab, setEntryTab]   = useState('manual')
  const [showPeriod, setShowPeriod] = useState(false)

  const filtered = useMemo(() => filterByPeriod(transactions, period), [transactions, period])

  const totalRevenue  = useMemo(() => filtered.filter(t => t.type==='income').reduce((s,t) => s+t.amount, 0), [filtered])
  const totalExpenses = useMemo(() => filtered.filter(t => t.type==='expense').reduce((s,t) => s+t.amount, 0), [filtered])
  const netIncome     = totalRevenue - totalExpenses
  const periodLabel   = PERIODS.find(([v]) => v === period)?.[1] || 'This Month'

  function saveManual(data)    { addTransaction({ id:Date.now(), ...data }); setShowEntry(false); showToast('Entry saved!') }
  function handleCSVImport(rows) { addTransactions(rows); setShowEntry(false); showToast(`Imported ${rows.length} transactions!`) }
  function handleInvoiceSave(data) { addTransaction({ id:Date.now(), ...data }); setShowEntry(false); showToast('Invoice saved!') }

  return (
    <div className="flex flex-col h-full relative">

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p className="eyebrow mb-1">Financial Planning</p>
        <div className="flex items-center justify-between">
          <p className="screen-title">Finance</p>
          <div className="relative">
            <button onClick={() => setShowPeriod(p => !p)} className="flex items-center gap-1.5 rounded-xl font-semibold"
              style={{ fontSize:12, padding:'6px 12px', background:'rgba(255,255,255,.85)', border:'1px solid rgba(226,232,240,.9)', color:'#475569', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
              {periodLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showPeriod && (
              <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30"
                style={{ background:'rgba(255,255,255,.97)', border:'1px solid rgba(226,232,240,.9)', backdropFilter:'blur(24px)', boxShadow:'0 8px 32px rgba(0,0,0,.12)', minWidth:140 }}
                onMouseLeave={() => setShowPeriod(false)}>
                {PERIODS.map(([v,l]) => (
                  <button key={v} onClick={() => { setPeriod(v); setShowPeriod(false) }}
                    style={{ display:'block', width:'100%', textAlign:'left', fontSize:12, padding:'9px 14px', fontWeight:600, color: period===v ? '#0f172a' : '#64748b', background: period===v ? 'rgba(5,150,105,.07)' : 'transparent', border:'none', cursor:'pointer' }}>{l}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mx-4 mb-3 rounded-2xl px-5 py-3 flex justify-between items-center glass flex-shrink-0">
        {[
          { l:'Revenue',  v:fmt(totalRevenue),                                              c:'#059669' },
          { l:'Expenses', v:fmt(totalExpenses),                                             c:'#dc2626' },
          { l:'Net',      v:(netIncome>=0?'+':'')+fmt(netIncome),                          c: netIncome>=0?'#059669':'#dc2626' },
          { l:'Entries',  v:String(filtered.length),                                        c:'#64748b' },
        ].map(({ l, v, c }) => (
          <div key={l} className="flex flex-col items-center">
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
            <span className="eyebrow">{l}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mb-3 rounded-xl p-1 flex-shrink-0 glass">
        {[['pl','P&L'],['tx','Transactions'],['bs','Balance Sheet'],['budget','Budget']].map(([k,lbl]) => (
          <button key={k} onClick={() => setTab(k)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{ fontSize:11, background:tab===k?'white':'transparent', color:tab===k?'#1e293b':'#94a3b8', boxShadow:tab===k?'0 1px 4px rgba(0,0,0,.08)':'none', whiteSpace:'nowrap' }}>{lbl}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {tab === 'pl'     && <PLView filtered={filtered} />}
        {tab === 'tx'     && <TxView filtered={filtered} />}
        {(tab === 'bs' || tab === 'budget') && (
          <div className="px-4 py-8">
            <div className="rounded-2xl p-6 text-center" style={{ background:'rgba(255,255,255,.82)', border:'1px solid rgba(255,255,255,.95)', backdropFilter:'blur(12px)' }}>
              <p style={{ fontSize:28 }}>🔜</p>
              <p style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginTop:8 }}>{tab==='bs' ? 'Balance Sheet' : 'Budget vs Actual'}</p>
              <p style={{ fontSize:12, color:'#94a3b8', marginTop:4, lineHeight:1.6 }}>Coming next release — populate your transactions first to generate this view automatically.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Entry button */}
      <div className="px-4 pb-5 pt-2 flex-shrink-0">
        <button onClick={() => { setShowEntry(true); setEntryTab('manual') }}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{ fontSize:13, background:'linear-gradient(135deg,#0369a1,#2563eb)', boxShadow:'0 4px 16px rgba(37,99,235,.28)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Financial Data
        </button>
      </div>

      {/* Data Entry Modal */}
      {showEntry && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(15,23,42,.4)', backdropFilter:'blur(6px)' }} onClick={() => setShowEntry(false)}>
          <div className="w-full rounded-t-[24px] overflow-hidden" style={{ background:'rgba(255,255,255,.98)', backdropFilter:'blur(32px)', borderTop:'1px solid rgba(255,255,255,.9)', boxShadow:'0 -8px 40px rgba(0,0,0,.14)', animation:'slide-up .26s cubic-bezier(.16,1,.3,1)', maxHeight:'92vh' }} onClick={e => e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:99, background:'#e2e8f0', margin:'14px auto 0' }}/>
            <div className="px-6 pt-3 pb-3" style={{ borderBottom:'1px solid #f1f5f9' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'#0f172a' }}>Add Financial Data</p>
              <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Manual entry · CSV import · Invoice scan · Live connection</p>
            </div>
            <div className="flex gap-2 px-5 pt-3 pb-1 overflow-x-auto no-scrollbar">
              {[['manual','Manual'],['csv','Import CSV'],['invoice','Invoice'],['connect','Connect']].map(([k,lbl]) => (
                <button key={k} onClick={() => setEntryTab(k)}
                  className="whitespace-nowrap font-semibold rounded-xl flex-shrink-0 transition-all"
                  style={{ fontSize:12, padding:'6px 14px', background:entryTab===k?'#0f172a':'#f8fafc', color:entryTab===k?'#fff':'#64748b', border:entryTab===k?'1px solid #0f172a':'1px solid #e2e8f0' }}>{lbl}</button>
              ))}
            </div>
            <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight:'calc(92vh - 160px)' }}>
              {entryTab === 'manual'  && <ManualForm      onSave={saveManual}        onCancel={() => setShowEntry(false)} />}
              {entryTab === 'csv'     && <CSVImport        onImport={handleCSVImport} onCancel={() => setShowEntry(false)} />}
              {entryTab === 'invoice' && <InvoiceUpload    onSave={handleInvoiceSave} onCancel={() => setShowEntry(false)} />}
              {entryTab === 'connect' && <ConnectSources   onCancel={() => setShowEntry(false)} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
