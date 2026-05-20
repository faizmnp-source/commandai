import { useState, useMemo, useRef } from 'react'
import useAppStore, { CLOSE_TASKS_SEED, CLOSE_PHASES, HOSPITAL_PL, DATA_SOURCES } from '../store/appStore'

/* ── Constants ───────────────────────────────────────────────── */
const INCOME_CATS  = ['SaaS / Subscriptions','Consulting','Professional Services','Product Sales','Investments','Other Income']
const EXPENSE_CATS = ['Cost of Revenue','Payroll','Rent & Facilities','Software & Tools','Marketing & Ads','Travel','Legal & Professional','Hardware','Other Expense']
const PERIODS = [['month','This Month'],['q2','Q2 2026'],['q1','Q1 2026'],['ytd','YTD'],['all','All Time']]

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt     = n => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`
const fmtFull = n => `$${Math.abs(n).toLocaleString()}`
const fmtK    = n => `$${n.toLocaleString()}K`
const dateLabel = d => { try { return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) } catch { return d } }
const srcBadge  = s => ({ manual:{bg:'rgba(37,99,235,.12)',color:'#60a5fa',label:'Manual'}, csv:{bg:'rgba(16,185,129,.12)',color:'#34d399',label:'CSV'}, invoice:{bg:'rgba(124,58,237,.12)',color:'#a78bfa',label:'Invoice'}, connect:{bg:'rgba(234,88,12,.12)',color:'#fb923c',label:'POS'} }[s] || {bg:'rgba(100,116,139,.1)',color:'#64748b',label:s})

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

/* ── Section label ───────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span style={{ fontFamily:'ui-monospace,monospace', fontSize:8.5, letterSpacing:'0.2em', color:'rgba(100,116,139,.45)', textTransform:'uppercase' }}>{children}</span>
      <div style={{ flex:1, height:1, background:'rgba(255,255,255,.04)' }}/>
    </div>
  )
}

/* ── Manual Entry Form ───────────────────────────────────────── */
function ManualForm({ onSave, onCancel }) {
  const today = new Date().toISOString().slice(0,10)
  const [tp, setTp]     = useState('income')
  const [date, setDate] = useState(today)
  const [cat, setCat]   = useState(INCOME_CATS[0])
  const [desc, setDesc] = useState('')
  const [amt, setAmt]   = useState('')

  const cats = tp === 'income' ? INCOME_CATS : EXPENSE_CATS

  return (
    <div className="space-y-3 pt-2">
      <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,.08)' }}>
        {[['income','+ Income'],['expense','- Expense']].map(([v,l]) => (
          <button key={v} onClick={() => { setTp(v); setCat(v==='income'?INCOME_CATS[0]:EXPENSE_CATS[0]) }} className="flex-1 py-2.5 font-bold transition-all"
            style={{ fontSize:13, background: tp===v ? (v==='income'?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)') : 'rgba(255,255,255,.04)', color: tp===v ? (v==='income'?'#34d399':'#fb7185') : 'rgba(100,116,139,.5)', border:'none' }}>{l}</button>
        ))}
      </div>
      <input type="date" className="inp" value={date} onChange={e => setDate(e.target.value)} />
      <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>
        {cats.map(c => <option key={c}>{c}</option>)}
      </select>
      <input className="inp" placeholder="Description / Merchant *" value={desc} onChange={e => setDesc(e.target.value)} />
      <div className="relative">
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'rgba(100,116,139,.5)' }}>$</span>
        <input className="inp" style={{ paddingLeft:28 }} placeholder="0.00" type="number" step="0.01" min="0" value={amt} onChange={e => setAmt(e.target.value)} />
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
        <button onClick={() => { if (!desc.trim() || !amt) return; onSave({ date, type:tp, cat, desc, amount:parseFloat(amt), src:'manual' }) }} className="btn-em flex-1">Save Entry</button>
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
        style={{ height:120, border:`2px dashed ${dragging ? '#0ea5e9' : 'rgba(255,255,255,.1)'}`, background: dragging ? 'rgba(14,165,233,.04)' : 'rgba(255,255,255,.03)' }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => fileRef.current?.click()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.5)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        <span style={{ fontSize:13, color:'rgba(148,163,184,.6)', fontWeight:600 }}>Drop CSV or click to browse</span>
        <span style={{ fontSize:11, color:'rgba(100,116,139,.4)' }}>Bank statements · QuickBooks · Xero</span>
      </div>
      <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
      <button onClick={onCancel} className="btn-ghost w-full">Cancel</button>
    </div>
  )

  return (
    <div className="space-y-3 pt-2">
      <p style={{ fontSize:12, color:'#34d399', fontWeight:600 }}>✓ {preview.allLines.length - 1} rows detected — map your columns:</p>
      <div className="grid grid-cols-2 gap-2">
        {[['date','Date Column'],['desc','Description'],['amount','Amount'],['type','Type (optional)']].map(([k,lbl]) => (
          <div key={k}>
            <p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontWeight:700, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>{lbl}</p>
            <select className="inp" style={{ fontSize:12, padding:'7px 10px' }} value={colMap[k]} onChange={e => setColMap(p => ({...p,[k]:e.target.value}))}>
              <option value="">-- skip --</option>
              {preview.headers.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,.08)' }}>
        <div className="overflow-x-auto no-scrollbar">
          <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'rgba(255,255,255,.04)' }}>{preview.headers.map(h => <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'rgba(100,116,139,.5)', fontWeight:700, borderBottom:'1px solid rgba(255,255,255,.06)', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{preview.rows.slice(0,3).map((row,i) => <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,.04)' }}>{row.map((cell,j) => <td key={j} style={{ padding:'6px 10px', color:'rgba(148,163,184,.7)', whiteSpace:'nowrap', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis' }}>{cell}</td>)}</tr>)}</tbody>
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
      <div className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ height:120, border:'2px dashed rgba(255,255,255,.1)', background:'rgba(255,255,255,.03)' }} onClick={() => fileRef.current?.click()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.5)" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
        <span style={{ fontSize:13, color:'rgba(148,163,184,.6)', fontWeight:600 }}>Upload invoice or receipt</span>
        <span style={{ fontSize:11, color:'rgba(100,116,139,.4)' }}>PDF, JPG, PNG — AI extracts the data</span>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
      <button onClick={onCancel} className="btn-ghost w-full">Cancel</button>
    </div>
  )

  if (state === 'extracting') return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(14,165,233,.15)', borderTopColor:'#0ea5e9', animation:'spin .8s linear infinite' }}/>
      <div className="text-center">
        <p style={{ fontSize:13, fontWeight:700, color:'rgba(226,232,240,.9)' }}>Extracting data…</p>
        <p style={{ fontSize:11, color:'rgba(100,116,139,.5)', marginTop:4 }}>AI is reading your invoice fields</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-3 pt-2">
      <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.15)' }}>
        <span style={{ fontSize:16, color:'#34d399' }}>✓</span>
        <span style={{ fontSize:12, color:'#34d399', fontWeight:600 }}>Extracted — confirm details below</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', marginBottom:4 }}>INVOICE NO.</p><input className="inp" style={{ fontSize:12 }} value={fields.invoiceNo} onChange={e => setFields(p => ({...p,invoiceNo:e.target.value}))} /></div>
        <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', marginBottom:4 }}>DATE</p><input type="date" className="inp" style={{ fontSize:12 }} value={fields.date} onChange={e => setFields(p => ({...p,date:e.target.value}))} /></div>
      </div>
      <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', marginBottom:4 }}>DESCRIPTION</p><input className="inp" style={{ fontSize:12 }} value={fields.desc} onChange={e => setFields(p => ({...p,desc:e.target.value}))} /></div>
      <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,.08)' }}>
        {[['income','Income'],['expense','Expense']].map(([v,l]) => (
          <button key={v} onClick={() => setFields(p => ({...p,type:v}))} className="flex-1 py-2 font-bold transition-all"
            style={{ fontSize:12, background: fields.type===v ? (v==='income'?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)') : 'rgba(255,255,255,.04)', color: fields.type===v ? (v==='income'?'#34d399':'#fb7185') : 'rgba(100,116,139,.5)', border:'none' }}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', marginBottom:4 }}>CATEGORY</p>
          <select className="inp" style={{ fontSize:12 }} value={fields.cat} onChange={e => setFields(p => ({...p,cat:e.target.value}))}>
            {[...INCOME_CATS,...EXPENSE_CATS].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', marginBottom:4 }}>AMOUNT</p>
          <div className="relative"><span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'rgba(100,116,139,.4)' }}>$</span>
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
    { name:'Epic HIS',    logo:'EP', color:'#10b981', bg:'rgba(16,185,129,.1)',  status:'connected', desc:'Hospital Info System' },
    { name:'Oracle ERP',  logo:'OR', color:'#0ea5e9', bg:'rgba(14,165,233,.1)', status:'connected', desc:'General Ledger'       },
    { name:'Kronos WFC',  logo:'KR', color:'#a78bfa', bg:'rgba(167,139,250,.1)',status:'connected', desc:'Payroll & Workforce'  },
    { name:'Plaid',       logo:'PL', color:'#34d399', bg:'rgba(52,211,153,.1)', status:'connect',   desc:'Bank connection'      },
    { name:'QuickBooks',  logo:'QB', color:'#60a5fa', bg:'rgba(96,165,250,.1)', status:'soon',      desc:'Accounting'           },
    { name:'Stripe',      logo:'ST', color:'#c084fc', bg:'rgba(192,132,252,.1)',status:'soon',      desc:'Online payments'      },
  ]
  return (
    <div className="space-y-2 pt-2">
      <p style={{ fontSize:12, color:'rgba(148,163,184,.6)', marginBottom:8 }}>Connect your financial data sources for automatic sync and real-time reporting.</p>
      {SRC.map(s => (
        <div key={s.name} className="rounded-xl flex items-center gap-3 px-4 py-3" style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background:s.bg, color:s.color }}>{s.logo}</div>
          <div className="flex-1"><p style={{ fontSize:13, fontWeight:700, color:'rgba(226,232,240,.85)' }}>{s.name}</p><p style={{ fontSize:11, color:'rgba(100,116,139,.5)' }}>{s.desc}</p></div>
          {s.status === 'connected'
            ? <span className="font-semibold rounded-lg px-3 py-1.5" style={{ fontSize:10, background:'rgba(16,185,129,.1)', color:'#34d399', border:'1px solid rgba(16,185,129,.2)' }}>● Connected</span>
            : s.status === 'connect'
            ? <button className="font-bold rounded-lg px-3 py-1.5" style={{ fontSize:11, background:s.bg, color:s.color, border:`1px solid ${s.color}30` }} onClick={() => alert(`OAuth flow for ${s.name} — coming soon!`)}>Connect</button>
            : <span className="font-semibold rounded-lg px-3 py-1.5" style={{ fontSize:11, background:'rgba(100,116,139,.06)', color:'rgba(100,116,139,.4)' }}>Soon</span>
          }
        </div>
      ))}
      <div className="pt-2"><button onClick={onCancel} className="btn-ghost w-full">Close</button></div>
    </div>
  )
}

/* ── P&L View (transaction-based) ───────────────────────────── */
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
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.3)" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      <p style={{ fontSize:13, color:'rgba(100,116,139,.5)', fontWeight:600 }}>No transactions in this period</p>
      <p style={{ fontSize:11, color:'rgba(100,116,139,.35)' }}>Add entries or import a CSV to see your P&L</p>
    </div>
  )

  const Row = ({ label, amount, indent, bold, total, neg, positive }) => {
    const amtColor = positive ? '#34d399' : (neg || (total && amount < 0)) ? '#fb7185' : 'rgba(226,232,240,.75)'
    return (
      <div className="flex items-center justify-between" style={{ padding:'9px 16px', borderBottom:'1px solid rgba(255,255,255,.04)', background: total ? 'rgba(255,255,255,.03)' : 'transparent' }}>
        <span style={{ fontSize:12, color: total ? 'rgba(226,232,240,.9)' : 'rgba(148,163,184,.65)', fontWeight: bold ? 700 : 500, paddingLeft: indent ? 10 : 0 }}>{label}</span>
        {amount !== undefined && (
          <span style={{ fontFamily:'ui-monospace,monospace', fontSize:12, fontWeight: bold ? 700 : 500, color: amtColor }}>
            {neg ? '-' : ''}{fmtFull(Math.abs(amount))}
          </span>
        )}
      </div>
    )
  }

  const Card = ({ title, children }) => (
    <div className="mb-3">
      <SectionLabel>{title}</SectionLabel>
      <div className="rounded-xl overflow-hidden" style={{ background:'rgba(14,30,58,.6)', border:'1px solid rgba(255,255,255,.06)' }}>
        {children}
      </div>
    </div>
  )

  return (
    <div className="px-4 pb-4">
      <Card title="Revenue">
        {revenue.map(r => <Row key={r.cat} label={r.cat} amount={r.amount} indent />)}
        <Row label="Total Revenue" amount={totalRevenue} bold total positive />
      </Card>
      {cogs > 0 && (
        <Card title="Cost of Revenue">
          <Row label="Cost of Revenue" amount={cogs} indent neg />
          <Row label={`Gross Profit · ${gpPct}% margin`} amount={gp} bold total positive={gp >= 0} />
        </Card>
      )}
      {opex.length > 0 && (
        <Card title="Operating Expenses">
          {opex.map(r => <Row key={r.cat} label={r.cat} amount={r.amount} indent neg />)}
          <Row label="Total OpEx" amount={totalOpex} bold total />
        </Card>
      )}
      <div className="rounded-xl px-4 py-4 mt-1" style={{ background: net >= 0 ? 'rgba(16,185,129,.06)' : 'rgba(239,68,68,.06)', border:`1px solid ${net >= 0 ? 'rgba(16,185,129,.18)' : 'rgba(239,68,68,.18)'}` }}>
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:4 }}>Net Income</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, letterSpacing:'-0.03em', color: net >= 0 ? '#34d399' : '#fb7185', lineHeight:1 }}>
              {net >= 0 ? '+' : '-'}{fmtFull(net)}
            </p>
          </div>
          <div className="text-right">
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.18em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:4 }}>Net Margin</p>
            <p style={{ fontSize:18, fontWeight:800, color: net >= 0 ? '#34d399' : '#fb7185' }}>{netPct}%</p>
          </div>
        </div>
        <div className="flex gap-5 mt-3" style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:10 }}>
          <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontWeight:600 }}>Revenue</p><p style={{ fontSize:13, fontWeight:700, color:'#34d399' }}>{fmt(totalRevenue)}</p></div>
          <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontWeight:600 }}>Expenses</p><p style={{ fontSize:13, fontWeight:700, color:'#fb7185' }}>{fmt(cogs + totalOpex)}</p></div>
          <div><p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontWeight:600 }}>Gross Margin</p><p style={{ fontSize:13, fontWeight:700, color:'rgba(226,232,240,.8)' }}>{gpPct > 0 ? gpPct : '—'}%</p></div>
        </div>
      </div>
    </div>
  )
}

/* ── Hospital P&L Variance ───────────────────────────────────── */
function HospitalPLView() {
  const [section, setSection] = useState('revenue')
  const rows = section === 'revenue' ? HOSPITAL_PL.revenue : HOSPITAL_PL.expenses
  const totalActual = rows.reduce((s,r) => s + r.actual, 0)
  const totalBudget = rows.reduce((s,r) => s + r.budget, 0)
  const totalVar    = totalActual - totalBudget
  const totalVarPct = totalBudget > 0 ? ((totalVar / totalBudget) * 100) : 0
  const isRevenue   = section === 'revenue'

  return (
    <div className="px-4 pb-4">
      {/* Section toggle */}
      <div className="flex gap-2 mb-3">
        {[['revenue','Revenue'],['expenses','Expenses']].map(([k,l]) => (
          <button key={k} onClick={() => setSection(k)}
            className="rounded-xl px-3 py-1.5 font-semibold transition-all"
            style={{ fontSize:11, background: section===k ? (k==='revenue'?'rgba(16,185,129,.15)':'rgba(251,113,133,.1)') : 'rgba(255,255,255,.04)', color: section===k ? (k==='revenue'?'#34d399':'#fb7185') : 'rgba(100,116,139,.5)', border:`1px solid ${section===k ? (k==='revenue'?'rgba(16,185,129,.25)':'rgba(251,113,133,.2)') : 'rgba(255,255,255,.06)'}` }}>{l}</button>
        ))}
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, color:'rgba(100,116,139,.4)', marginLeft:'auto', alignSelf:'center' }}>{HOSPITAL_PL.period}</span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,.06)', background:'rgba(14,30,58,.5)' }}>
        {/* Header */}
        <div className="flex items-center px-4 py-2.5" style={{ borderBottom:'1px solid rgba(255,255,255,.06)', background:'rgba(255,255,255,.04)' }}>
          <span style={{ flex:1, fontFamily:'ui-monospace,monospace', fontSize:8.5, letterSpacing:'0.12em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>Department</span>
          {['Actual','Budget','Var $','Var %'].map(h => (
            <span key={h} style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:8.5, letterSpacing:'0.12em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {rows.map((r, i) => {
          const varAmt = r.actual - r.budget
          const varPct = r.budget > 0 ? (varAmt / r.budget * 100) : 0
          const favourable = isRevenue ? varAmt >= 0 : varAmt <= 0
          const varColor = favourable ? '#34d399' : '#fb7185'
          return (
            <div key={r.id} className="flex items-center px-4 py-3"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11.5, color:'rgba(148,163,184,.75)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{r.dept}</p>
                <p style={{ fontSize:9.5, color:'rgba(100,116,139,.4)', marginTop:1 }}>{r.note}</p>
              </div>
              <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:600, color:'rgba(226,232,240,.8)' }}>${r.actual.toLocaleString()}</span>
              <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, color:'rgba(100,116,139,.45)' }}>${r.budget.toLocaleString()}</span>
              <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color: varColor }}>
                {varAmt >= 0 ? '+' : ''}${Math.abs(varAmt).toLocaleString()}
              </span>
              <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color: varColor }}>
                {varPct >= 0 ? '+' : ''}{varPct.toFixed(1)}%
              </span>
            </div>
          )
        })}
        {/* Total row */}
        <div className="flex items-center px-4 py-3" style={{ background:'rgba(255,255,255,.04)', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <span style={{ flex:1, fontSize:11.5, fontWeight:800, color:'rgba(226,232,240,.9)', fontFamily:'ui-monospace,monospace', textTransform:'uppercase', letterSpacing:'0.04em' }}>Total {section === 'revenue' ? 'Revenue' : 'Expenses'}</span>
          <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:800, color:'rgba(226,232,240,.9)' }}>${totalActual.toLocaleString()}</span>
          <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color:'rgba(100,116,139,.5)' }}>${totalBudget.toLocaleString()}</span>
          <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:800, color: (isRevenue ? totalVar >= 0 : totalVar <= 0) ? '#34d399' : '#fb7185' }}>
            {totalVar >= 0 ? '+' : ''}${Math.abs(totalVar).toLocaleString()}
          </span>
          <span style={{ width:70, textAlign:'right', fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:800, color: (isRevenue ? totalVarPct >= 0 : totalVarPct <= 0) ? '#34d399' : '#fb7185' }}>
            {totalVarPct >= 0 ? '+' : ''}{totalVarPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label:'Total Actual', val:`$${(totalActual/1000).toFixed(2)}M`, c:'rgba(226,232,240,.9)' },
          { label:'vs Budget', val:`${totalVar >= 0 ? '+' : ''}$${Math.abs(totalVar).toLocaleString()}K`, c: (isRevenue ? totalVar >= 0 : totalVar <= 0) ? '#34d399' : '#fb7185' },
          { label:'Variance %', val:`${totalVarPct >= 0 ? '+' : ''}${totalVarPct.toFixed(1)}%`, c: (isRevenue ? totalVarPct >= 0 : totalVarPct <= 0) ? '#34d399' : '#fb7185' },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-3 text-center" style={{ background:'rgba(14,30,58,.7)', border:'1px solid rgba(255,255,255,.06)' }}>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:8, letterSpacing:'0.12em', color:'rgba(100,116,139,.4)', textTransform:'uppercase', marginBottom:4 }}>{c.label}</p>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:14, fontWeight:800, color:c.c }}>{c.val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Close Tasks View ────────────────────────────────────────── */
function CloseTasksView({ tasks, updateCloseTask, showToast }) {
  const [expandedPhase, setExpandedPhase] = useState(null)

  return (
    <div className="px-4 pb-4">
      {CLOSE_PHASES.map(phase => {
        const phaseTasks = tasks.filter(t => t.phase === phase.id)
        const doneCt     = phaseTasks.filter(t => t.status === 'done').length
        const allDone    = doneCt === phaseTasks.length
        const hasActive  = phaseTasks.some(t => t.status === 'progress')
        const isOpen     = expandedPhase === phase.id || hasActive || (phase.id === 1 && expandedPhase === null)

        return (
          <div key={phase.id} className="mb-3">
            <button
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
              style={{ background: allDone ? 'rgba(16,185,129,.07)' : hasActive ? 'rgba(14,165,233,.07)' : 'rgba(255,255,255,.04)', border:`1px solid ${allDone ? 'rgba(16,185,129,.18)' : hasActive ? 'rgba(14,165,233,.18)' : 'rgba(255,255,255,.06)'}` }}
              onClick={() => setExpandedPhase(isOpen ? -1 : phase.id)}>
              {/* Phase number */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
                style={{ fontSize:11, background: allDone ? 'rgba(16,185,129,.2)' : hasActive ? 'rgba(14,165,233,.2)' : 'rgba(255,255,255,.06)', color: allDone ? '#34d399' : hasActive ? '#38bdf8' : 'rgba(100,116,139,.5)' }}>
                {allDone ? '✓' : phase.id}
              </div>
              <div className="flex-1">
                <p style={{ fontSize:12.5, fontWeight:700, color: allDone ? 'rgba(52,211,153,.9)' : hasActive ? 'rgba(56,189,248,.9)' : 'rgba(148,163,184,.7)', lineHeight:1.2 }}>{phase.name}</p>
                <p style={{ fontSize:10, color:'rgba(100,116,139,.45)', marginTop:1, fontFamily:'ui-monospace,monospace' }}>{phase.desc}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color: allDone ? '#34d399' : 'rgba(148,163,184,.5)' }}>{doneCt}/{phaseTasks.length}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.4)" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition:'transform .2s', flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {isOpen && (
              <div className="mt-1.5 ml-2 space-y-1.5">
                {phaseTasks.map(task => (
                  <div key={task.id} className="close-task rounded-xl px-4 py-3"
                    style={{ background: task.status==='done' ? 'rgba(16,185,129,.05)' : task.status==='progress' ? 'rgba(14,165,233,.05)' : 'rgba(255,255,255,.03)', border:`1px solid ${task.status==='done' ? 'rgba(16,185,129,.12)' : task.status==='progress' ? 'rgba(14,165,233,.12)' : 'rgba(255,255,255,.05)'}` }}>
                    <div className="flex items-start gap-3">
                      {/* Status dot / checkbox */}
                      <button onClick={() => {
                        const next = task.status === 'done' ? 'pending' : task.status === 'progress' ? 'done' : 'progress'
                        updateCloseTask(task.id, next)
                        showToast(`"${task.label}" → ${next}`)
                      }} className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all"
                        style={{ background: task.status==='done' ? 'rgba(16,185,129,.2)' : task.status==='progress' ? 'rgba(14,165,233,.15)' : 'transparent', borderColor: task.status==='done' ? '#10b981' : task.status==='progress' ? '#0ea5e9' : 'rgba(100,116,139,.3)' }}>
                        {task.status === 'done' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {task.status === 'progress' && <div style={{ width:7, height:7, borderRadius:'50%', background:'#0ea5e9', animation:'pulse-dot 1.5s ease-in-out infinite' }}/>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize:12, fontWeight:600, color: task.status==='done' ? 'rgba(100,116,139,.5)' : 'rgba(226,232,240,.85)', textDecoration: task.status==='done' ? 'line-through' : 'none', lineHeight:1.3 }}>{task.label}</p>
                        <p style={{ fontSize:10, color:'rgba(100,116,139,.45)', marginTop:3, lineHeight:1.5 }}>{task.detail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span style={{ fontSize:9.5, color:'rgba(100,116,139,.4)', fontFamily:'ui-monospace,monospace' }}>{task.owner}</span>
                          <span style={{ fontSize:9.5, color:'rgba(100,116,139,.3)' }}>·</span>
                          <span style={{ fontSize:9.5, color:'rgba(100,116,139,.4)', fontFamily:'ui-monospace,monospace' }}>Due {task.due}</span>
                        </div>
                      </div>
                      <span className={`status-badge status-${task.status} flex-shrink-0`}>{task.status === 'done' ? 'Done' : task.status === 'progress' ? 'Active' : 'Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Data Loads View ─────────────────────────────────────────── */
function DataLoadsView() {
  const statusIcon = s => s === 'done'
    ? <span style={{ color:'#34d399', fontSize:12 }}>✓</span>
    : s === 'progress'
    ? <div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid rgba(14,165,233,.3)', borderTopColor:'#0ea5e9', animation:'spin .8s linear infinite' }}/>
    : <span style={{ color:'rgba(100,116,139,.3)', fontSize:12 }}>○</span>

  return (
    <div className="px-4 pb-4">
      <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,.06)', background:'rgba(14,30,58,.5)' }}>
        {/* Header */}
        <div className="flex items-center px-4 py-2.5" style={{ borderBottom:'1px solid rgba(255,255,255,.06)', background:'rgba(255,255,255,.04)' }}>
          {['Source','System','Rows','Loaded','Status'].map((h,i) => (
            <span key={h} style={{ flex: i===0 ? 1.4 : i===1 ? 1 : 0.7, fontFamily:'ui-monospace,monospace', fontSize:8.5, letterSpacing:'0.1em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>{h}</span>
          ))}
        </div>
        {DATA_SOURCES.map((src, i) => (
          <div key={src.id} className="flex items-center px-4 py-3"
            style={{ borderBottom: i < DATA_SOURCES.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
            <div style={{ flex:1.4 }}>
              <p style={{ fontSize:11.5, fontWeight:600, color:'rgba(226,232,240,.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{src.name}</p>
              <p style={{ fontSize:9.5, color:'rgba(100,116,139,.4)', marginTop:1 }}>{src.note}</p>
            </div>
            <span style={{ flex:1, fontSize:10, color:'rgba(100,116,139,.5)', fontFamily:'ui-monospace,monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{src.system}</span>
            <span style={{ flex:0.7, fontFamily:'ui-monospace,monospace', fontSize:10, color:'rgba(148,163,184,.65)', fontWeight:600 }}>{src.rows.toLocaleString()}</span>
            <span style={{ flex:0.7, fontFamily:'ui-monospace,monospace', fontSize:9.5, color:'rgba(100,116,139,.4)' }}>{src.ts}</span>
            <div style={{ flex:0.7, display:'flex', alignItems:'center', gap:6 }}>
              {statusIcon(src.status)}
              <span className={`status-badge status-${src.status}`} style={{ fontSize:8.5 }}>{src.status === 'done' ? 'Loaded' : src.status === 'progress' ? 'Loading' : 'Pending'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label:'Sources', val:`${DATA_SOURCES.filter(s => s.status === 'done').length} / ${DATA_SOURCES.length}`, c:'#34d399' },
          { label:'Total Rows', val:DATA_SOURCES.reduce((s,r) => s+r.rows, 0).toLocaleString(), c:'rgba(226,232,240,.8)' },
          { label:'In Progress', val:`${DATA_SOURCES.filter(s => s.status === 'progress').length}`, c:'#0ea5e9' },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-3 text-center" style={{ background:'rgba(14,30,58,.7)', border:'1px solid rgba(255,255,255,.06)' }}>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:8, letterSpacing:'0.12em', color:'rgba(100,116,139,.4)', textTransform:'uppercase', marginBottom:4 }}>{c.label}</p>
            <p style={{ fontFamily:'ui-monospace,monospace', fontSize:14, fontWeight:800, color:c.c }}>{c.val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Transactions View ───────────────────────────────────────── */
function TxView({ filtered }) {
  const [search, setSearch] = useState('')
  const [tpf, setTpf]       = useState('all')

  const shown = [...filtered]
    .filter(t => tpf === 'all' || t.type === tpf)
    .filter(t => !search || t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="px-4">
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.4)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…" className="inp w-full pl-8" style={{ fontSize:13 }}/>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {[['all','All'],['income','Income'],['expense','Expenses']].map(([v,l]) => (
          <button key={v} onClick={() => setTpf(v)} className="font-semibold rounded-lg px-3 py-1.5 transition-all"
            style={{ fontSize:11, background: tpf===v ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)', color: tpf===v ? 'rgba(226,232,240,.9)' : 'rgba(100,116,139,.5)', border:`1px solid ${tpf===v ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)'}` }}>{l}</button>
        ))}
        <span style={{ fontSize:11, color:'rgba(100,116,139,.4)', marginLeft:'auto', fontFamily:'ui-monospace,monospace' }}>{shown.length} entries</span>
      </div>
      <div className="space-y-2">
        {shown.length === 0 && <div className="text-center py-8"><p style={{ fontSize:13, color:'rgba(100,116,139,.4)' }}>No transactions found</p></div>}
        {shown.map(t => {
          const badge = srcBadge(t.src)
          return (
            <div key={t.id} className="rounded-xl flex items-center gap-3 px-4 py-3"
              style={{ background:'rgba(14,30,58,.7)', border:'1px solid rgba(255,255,255,.06)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.type==='income' ? '#10b981' : '#fb7185' }}/>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ fontSize:13, color:'rgba(226,232,240,.85)' }}>{t.desc}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span style={{ fontSize:10, color:'rgba(100,116,139,.45)' }}>{dateLabel(t.date)}</span>
                  <span style={{ fontSize:10, color:'rgba(100,116,139,.3)' }}>·</span>
                  <span style={{ fontSize:10, color:'rgba(100,116,139,.45)' }}>{t.cat}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p style={{ fontSize:13, fontWeight:700, fontFamily:'ui-monospace,monospace', color: t.type==='income' ? '#34d399' : '#fb7185' }}>
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
  const { transactions, addTransaction, addTransactions, updateCloseTask, closeTasks, showToast, org } = useAppStore()
  const [tab, setTab]             = useState('hospital')
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

  const TABS = [
    { id:'hospital', label:'Hospital P&L' },
    { id:'close',    label:'Close Tasks'  },
    { id:'loads',    label:'Data Loads'   },
    { id:'tx',       label:'Transactions' },
    { id:'pl',       label:'My P&L'       },
  ]

  const doneCt = closeTasks.filter(t => t.status === 'done').length
  const pct    = Math.round((doneCt / closeTasks.length) * 100)

  return (
    <div className="flex flex-col h-full relative">

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex-shrink-0">
        <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(100,116,139,.5)', textTransform:'uppercase', marginBottom:4 }}>{org.name} · {org.fiscal}</p>
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:900, color:'rgba(248,250,252,.95)', letterSpacing:'-0.03em', lineHeight:1 }}>Finance</h1>
          <div className="relative">
            <button onClick={() => setShowPeriod(p => !p)} className="flex items-center gap-1.5 rounded-xl font-semibold"
              style={{ fontSize:11, padding:'6px 12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.09)', color:'rgba(148,163,184,.7)' }}>
              {periodLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showPeriod && (
              <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-30"
                style={{ background:'rgba(10,18,35,.97)', border:'1px solid rgba(255,255,255,.1)', backdropFilter:'blur(24px)', boxShadow:'0 8px 32px rgba(0,0,0,.6)', minWidth:140 }}
                onMouseLeave={() => setShowPeriod(false)}>
                {PERIODS.map(([v,l]) => (
                  <button key={v} onClick={() => { setPeriod(v); setShowPeriod(false) }}
                    style={{ display:'block', width:'100%', textAlign:'left', fontSize:12, padding:'9px 14px', fontWeight:600, color: period===v ? 'rgba(226,232,240,.9)' : 'rgba(100,116,139,.6)', background: period===v ? 'rgba(255,255,255,.06)' : 'transparent', border:'none', cursor:'pointer' }}>{l}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close progress mini-bar */}
      <div className="mx-5 mb-3 rounded-xl px-4 py-2.5 flex items-center gap-3 flex-shrink-0"
        style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', animation:'pulse-dot 2s ease-in-out infinite', flexShrink:0 }}/>
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.1em', color:'rgba(16,185,129,.6)', textTransform:'uppercase' }}>May Close</span>
        <div className="flex-1 prog-track">
          <div className="prog-fill" style={{ width:`${pct}%` }}/>
        </div>
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, color:'rgba(100,116,139,.45)' }}>{doneCt}/{closeTasks.length} · {pct}%</span>
      </div>

      {/* KPI strip — only show for tx/pl tabs */}
      {(tab === 'tx' || tab === 'pl') && (
        <div className="mx-4 mb-3 rounded-2xl px-5 py-3 flex justify-between items-center flex-shrink-0"
          style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)' }}>
          {[
            { l:'Revenue',  v:fmt(totalRevenue),                                     c:'#34d399' },
            { l:'Expenses', v:fmt(totalExpenses),                                    c:'#fb7185' },
            { l:'Net',      v:(netIncome>=0?'+':'')+fmt(netIncome),                  c: netIncome>=0?'#34d399':'#fb7185' },
            { l:'Entries',  v:String(filtered.length),                               c:'rgba(148,163,184,.6)' },
          ].map(({ l, v, c }) => (
            <div key={l} className="flex flex-col items-center">
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:c, letterSpacing:'-0.02em' }}>{v}</span>
              <span style={{ fontFamily:'ui-monospace,monospace', fontSize:8.5, letterSpacing:'0.12em', color:'rgba(100,116,139,.45)', textTransform:'uppercase', marginTop:2 }}>{l}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex mx-4 mb-3 rounded-xl p-1 flex-shrink-0 overflow-x-auto no-scrollbar"
        style={{ background:'rgba(14,30,58,.75)', border:'1px solid rgba(255,255,255,.06)', gap:2 }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 py-1.5 rounded-lg font-semibold transition-all"
            style={{ fontSize:10.5, whiteSpace:'nowrap', background: tab===id ? 'rgba(255,255,255,.1)' : 'transparent', color: tab===id ? 'rgba(226,232,240,.9)' : 'rgba(100,116,139,.5)', boxShadow: tab===id ? '0 1px 4px rgba(0,0,0,.3)' : 'none', border: tab===id ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent' }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {tab === 'hospital' && <HospitalPLView />}
        {tab === 'close'    && <CloseTasksView tasks={closeTasks} updateCloseTask={updateCloseTask} showToast={showToast} />}
        {tab === 'loads'    && <DataLoadsView />}
        {tab === 'tx'       && <TxView filtered={filtered} />}
        {tab === 'pl'       && <PLView filtered={filtered} />}
      </div>

      {/* Add Entry button — only on tx/pl tabs */}
      {(tab === 'tx' || tab === 'pl') && (
        <div className="px-4 pb-5 pt-2 flex-shrink-0">
          <button onClick={() => { setShowEntry(true); setEntryTab('manual') }}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ fontSize:13, background:'linear-gradient(135deg,#0369a1,#0ea5e9)', boxShadow:'0 4px 16px rgba(14,165,233,.28)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Financial Data
          </button>
        </div>
      )}

      {/* Data Entry Modal */}
      {showEntry && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }} onClick={() => setShowEntry(false)}>
          <div className="w-full rounded-t-[24px] overflow-hidden"
            style={{ background:'rgba(10,18,35,.98)', backdropFilter:'blur(32px)', borderTop:'1px solid rgba(255,255,255,.08)', boxShadow:'0 -12px 48px rgba(0,0,0,.7)', animation:'slide-up .26s cubic-bezier(.16,1,.3,1)', maxHeight:'92vh' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,.1)', margin:'14px auto 0' }}/>
            <div className="px-6 pt-3 pb-3" style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'rgba(248,250,252,.95)' }}>Add Financial Data</p>
              <p style={{ fontSize:11, color:'rgba(100,116,139,.5)', marginTop:2 }}>Manual entry · CSV import · Invoice scan · Live connection</p>
            </div>
            <div className="flex gap-2 px-5 pt-3 pb-1 overflow-x-auto no-scrollbar">
              {[['manual','Manual'],['csv','Import CSV'],['invoice','Invoice'],['connect','Connect']].map(([k,lbl]) => (
                <button key={k} onClick={() => setEntryTab(k)}
                  className="whitespace-nowrap font-semibold rounded-xl flex-shrink-0 transition-all"
                  style={{ fontSize:12, padding:'6px 14px', background: entryTab===k ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)', color: entryTab===k ? 'rgba(226,232,240,.9)' : 'rgba(100,116,139,.5)', border: entryTab===k ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(255,255,255,.06)' }}>{lbl}</button>
              ))}
            </div>
            <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight:'calc(92vh - 160px)' }}>
              {entryTab === 'manual'  && <ManualForm      onSave={saveManual}        onCancel={() => setShowEntry(false)} />}
              {entryTab === 'csv'     && <CSVImport       onImport={handleCSVImport} onCancel={() => setShowEntry(false)} />}
              {entryTab === 'invoice' && <InvoiceUpload   onSave={handleInvoiceSave} onCancel={() => setShowEntry(false)} />}
              {entryTab === 'connect' && <ConnectSources  onCancel={() => setShowEntry(false)} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
