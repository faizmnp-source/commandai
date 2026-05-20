import useAppStore from '../../store/appStore'

/* ── Helpers ─────────────────────────────────────────────────── */
const fmtFull = n => `$${Math.abs(n).toLocaleString()}`
const fmt     = n => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`
const dateShort = d => { try { return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) } catch { return d } }

/* ── Section header inside panel ─────────────────────────────── */
function PanelSection({ label, children }) {
  return (
    <div style={{ borderBottom:'1px solid rgba(255,255,255,.04)', paddingBottom:4 }}>
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <span style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(100,116,139,.5)', textTransform:'uppercase' }}>{label}</span>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,.04)' }}/>
      </div>
      {children}
    </div>
  )
}

/* ── AI Insights (computed from real data) ───────────────────── */
function Insights({ transactions }) {
  const now = new Date(); const yr = now.getFullYear(); const mo = now.getMonth()
  const thisMonth = transactions.filter(t => { const d = new Date(t.date+'T12:00:00'); return d.getMonth()===mo && d.getFullYear()===yr })
  const rev  = thisMonth.filter(t => t.type==='income').reduce((s,t) => s+t.amount, 0)
  const exp  = thisMonth.filter(t => t.type==='expense').reduce((s,t) => s+t.amount, 0)
  const net  = rev - exp
  const payroll = thisMonth.filter(t => t.cat==='Payroll').reduce((s,t) => s+t.amount, 0)
  const mktg    = thisMonth.filter(t => t.cat==='Marketing & Ads').reduce((s,t) => s+t.amount, 0)

  const insights = []
  if (net < 0) insights.push({ icon:'⚠', color:'#f59e0b', text:`Operating at a ${fmt(Math.abs(net))} loss this month. Review expenses.` })
  if (payroll > 0 && rev > 0 && payroll/rev > 0.6) insights.push({ icon:'↑', color:'#fb7185', text:`Payroll is ${(payroll/rev*100).toFixed(0)}% of revenue — consider optimizing headcount costs.` })
  if (mktg > 0 && rev > 0 && mktg/rev < 0.1) insights.push({ icon:'→', color:'#60a5fa', text:`Marketing spend is only ${(mktg/rev*100).toFixed(0)}% of revenue — room to invest in growth.` })
  if (rev > exp) insights.push({ icon:'✓', color:'#34d399', text:`Revenue exceeds expenses by ${fmt(net)} this month.` })
  if (insights.length === 0) insights.push({ icon:'●', color:'rgba(100,116,139,.5)', text:'Add more transactions to generate AI insights.' })

  return (
    <>
      {insights.slice(0,3).map((ins, i) => (
        <div key={i} className="px-5 py-2 flex gap-2.5 items-start">
          <span style={{ fontSize:11, flexShrink:0, marginTop:1, color:ins.color }}>{ins.icon}</span>
          <p style={{ fontSize:11, color:'rgba(203,213,225,.65)', lineHeight:1.55 }}>{ins.text}</p>
        </div>
      ))}
    </>
  )
}

/* ── Main Panel ──────────────────────────────────────────────── */
export default function RightPanel() {
  const { transactions, navigate, currentScreen } = useAppStore()

  const now = new Date(); const yr = now.getFullYear(); const mo = now.getMonth()
  const thisMonth = transactions.filter(t => { const d = new Date(t.date+'T12:00:00'); return d.getMonth()===mo && d.getFullYear()===yr })
  const rev  = thisMonth.filter(t => t.type==='income').reduce((s,t) => s+t.amount, 0)
  const exp  = thisMonth.filter(t => t.type==='expense').reduce((s,t) => s+t.amount, 0)
  const net  = rev - exp
  const recent = [...transactions].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5)

  const timeStr = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})
  const dateStr = now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}).toUpperCase()

  return (
    <aside className="hidden md:flex flex-col fixed right-0 top-0 h-full z-40 overflow-y-auto no-scrollbar cine-panel" style={{ width:272 }}>

      {/* ── Panel header ── */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,.05)', padding:'20px 20px 16px', flexShrink:0 }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {/* ∞ glyph */}
            <div className="flex items-center justify-center" style={{ width:28, height:28, borderRadius:8, background:'rgba(5,150,105,.12)', border:'1px solid rgba(5,150,105,.2)' }}>
              <span style={{ fontSize:14, fontWeight:900, background:'linear-gradient(135deg,#10b981,#0284c7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>∞</span>
            </div>
            <div>
              <p style={{ fontFamily:'ui-monospace,monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(16,185,129,.7)', textTransform:'uppercase' }}>AI Pulse</p>
              <p style={{ fontSize:10, color:'rgba(148,163,184,.45)', fontFamily:'ui-monospace,monospace' }}>{timeStr} · {dateStr}</p>
            </div>
          </div>
          <div className="pulse-dot"/>
        </div>
      </div>

      {/* ── Finance snapshot ── */}
      <PanelSection label="Finance · This Month">
        <div className="px-5 pb-3 space-y-2 mt-1">
          {[
            { l:'Revenue',  v:fmt(rev),  c:'#34d399', arrow:'↑' },
            { l:'Expenses', v:fmt(exp),  c:'#fb7185', arrow:'↓' },
            { l:'Net Income', v:(net>=0?'+':'')+fmt(net), c: net>=0?'#34d399':'#fb7185', arrow: net>=0?'↑':'↓' },
          ].map(({ l, v, c, arrow }) => (
            <div key={l} className="flex items-center justify-between">
              <span style={{ fontSize:11, color:'rgba(100,116,139,.6)', fontFamily:'ui-monospace,monospace', letterSpacing:'0.05em' }}>{l}</span>
              <div className="flex items-center gap-1">
                <span style={{ fontSize:9, color:c }}>{arrow}</span>
                <span style={{ fontFamily:'ui-monospace,monospace', fontSize:12, fontWeight:700, color:c }}>{v}</span>
              </div>
            </div>
          ))}
          <div style={{ height:1, background:'rgba(255,255,255,.04)', margin:'6px 0' }}/>
          <div className="flex items-center justify-between">
            <span style={{ fontSize:11, color:'rgba(100,116,139,.5)', fontFamily:'ui-monospace,monospace' }}>Entries</span>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:12, fontWeight:700, color:'rgba(226,232,240,.6)' }}>{thisMonth.length}</span>
          </div>
        </div>
      </PanelSection>

      {/* ── Recent transactions ── */}
      <PanelSection label="Recent Activity">
        {recent.map(t => (
          <div key={t.id} className="cine-row flex items-start gap-2.5">
            <div style={{ width:6, height:6, borderRadius:'50%', background: t.type==='income' ? '#34d399' : '#fb7185', flexShrink:0, marginTop:4 }}/>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(226,232,240,.75)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.desc}</p>
              <p style={{ fontSize:10, color:'rgba(100,116,139,.5)', fontFamily:'ui-monospace,monospace', marginTop:1 }}>{dateShort(t.date)} · {t.cat.slice(0,18)}</p>
            </div>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color: t.type==='income' ? '#34d399' : '#fb7185', flexShrink:0 }}>
              {t.type==='income' ? '+' : '-'}{fmtFull(t.amount)}
            </span>
          </div>
        ))}
      </PanelSection>

      {/* ── AI Insights ── */}
      <PanelSection label="AI Insights">
        <Insights transactions={transactions} />
      </PanelSection>

      {/* ── CTA ── */}
      <div className="px-5 py-4 mt-auto flex-shrink-0" style={{ borderTop:'1px solid rgba(255,255,255,.04)' }}>
        <button
          onClick={() => navigate('finance')}
          className="w-full py-2.5 rounded-xl font-bold transition-all"
          style={{ fontSize:12, background: currentScreen==='finance' ? 'rgba(5,150,105,.15)' : 'rgba(255,255,255,.05)', color: currentScreen==='finance' ? '#34d399' : 'rgba(148,163,184,.7)', border: `1px solid ${currentScreen==='finance' ? 'rgba(5,150,105,.25)' : 'rgba(255,255,255,.07)'}` }}
        >
          {currentScreen === 'finance' ? '● Finance Active' : '→ Open Finance'}
        </button>
        <p style={{ fontSize:9, color:'rgba(100,116,139,.35)', textAlign:'center', marginTop:8, fontFamily:'ui-monospace,monospace', letterSpacing:'0.12em' }}>COMMANDAI ∞ ENTERPRISE OS</p>
      </div>
    </aside>
  )
}
