import { create } from 'zustand'

/* ── Monthly Close Tasks — Healthcare Hospital ───────────────── */
export const CLOSE_TASKS_SEED = [
  { id:1,  phase:1, label:'Load Statistical Actuals',                status:'done',     due:'May 19', owner:'IT / Data Ops',  detail:'Patient days, procedures, LOS, census loaded from HIS.' },
  { id:2,  phase:1, label:'Load GL Actuals — Oracle ERP',            status:'done',     due:'May 19', owner:'Finance Ops',    detail:'General ledger extract complete. $8.24M gross revenue posted.' },
  { id:3,  phase:1, label:'Load Payroll Actuals (Kronos)',            status:'done',     due:'May 20', owner:'Payroll Dept',   detail:'1,247 FTEs, $3.84M loaded. All cost centers mapped.' },
  { id:4,  phase:2, label:'Update Rate & Variable Tables',            status:'progress', due:'May 21', owner:'F. Malik',       detail:'Per-diem rates and overhead percentages pending update for Q2.' },
  { id:5,  phase:2, label:'Balance Sheet Reconciliation',             status:'done',     due:'May 20', owner:'Accounting',     detail:'All 48 accounts reconciled. No unexplained variance.' },
  { id:6,  phase:2, label:'Review Variances > 5% Threshold',         status:'pending',  due:'May 22', owner:'FP&A Team',      detail:'Pharmacy (+12%), Radiology (-18%) flagged for commentary.' },
  { id:7,  phase:3, label:'Run Overhead Cost Allocations',           status:'pending',  due:'May 23', owner:'System Auto',    detail:'Admin overhead → 8 service lines via sq. footage & FTE basis.' },
  { id:8,  phase:3, label:'Intercompany Eliminations',               status:'pending',  due:'May 23', owner:'Finance Ops',    detail:'3 inter-entity transfers totaling $240K to eliminate.' },
  { id:9,  phase:3, label:'Management Review & Adjustments',         status:'pending',  due:'May 24', owner:'VP Finance',     detail:'CFO / VP review of preliminary P&L before lock.' },
  { id:10, phase:4, label:'Generate Departmental P&L Reports',       status:'pending',  due:'May 26', owner:'FP&A Team',      detail:'32 cost centers, 8 service lines, with variance commentary.' },
  { id:11, phase:4, label:'Prepare CFO Board Package',               status:'pending',  due:'May 27', owner:'CFO Office',     detail:'Executive summary, slides, budget vs actual narrative.' },
  { id:12, phase:4, label:'Update Rolling 3-Month Forecast',         status:'pending',  due:'May 29', owner:'FP&A Team',      detail:'Jun / Jul / Aug re-forecast based on May actuals + trends.' },
  { id:13, phase:4, label:'Lock Period & CFO Sign-Off',              status:'pending',  due:'Jun 2',  owner:'CFO / Controller',detail:'Final approval locks May actuals. Period becomes read-only.' },
]

export const CLOSE_PHASES = [
  { id:1, name:'Data Loading',    desc:'Load actuals from all source systems' },
  { id:2, name:'Validation',      desc:'Reconcile, validate & investigate' },
  { id:3, name:'Closing',         desc:'Allocations, eliminations & review' },
  { id:4, name:'Reporting',       desc:'Reports, forecasts & period lock' },
]

/* ── Hospital P&L Data ───────────────────────────────────────── */
export const HOSPITAL_PL = {
  period: 'May 2026',
  revenue: [
    { id:'inpatient', dept:'Inpatient Services',   actual:3215,  budget:3000,  note:'Medical/Surgical + ICU'    },
    { id:'outpatient',dept:'Outpatient Clinic',    actual:1089,  budget:1300,  note:'Clinic visits down 8%'     },
    { id:'emergency', dept:'Emergency Department', actual:1024,  budget: 900,  note:'High volume — 12% ↑'       },
    { id:'surgery',   dept:'Surgical Services',    actual: 912,  budget:1000,  note:'Elective procedures low'   },
    { id:'lab',       dept:'Laboratory',           actual: 398,  budget: 350,  note:'Reference lab growth'      },
    { id:'radiology', dept:'Radiology & Imaging',  actual: 212,  budget: 300,  note:'MRI utilization -18%'      },
    { id:'pharmacy',  dept:'Pharmacy',             actual: 390,  budget: 350,  note:'340B program +12%'         },
  ],
  expenses: [
    { id:'salaries',  dept:'Salaries & Benefits',  actual:3840,  budget:3700,  note:'Overtime due to staffing'  },
    { id:'supplies',  dept:'Supplies & Pharmacy',  actual:1240,  budget:1100,  note:'Supply chain inflation'    },
    { id:'contract',  dept:'Contract Services',    actual: 380,  budget: 450,  note:'Agency staff reduced'      },
    { id:'overhead',  dept:'Facilities & Overhead',actual: 598,  budget: 600,  note:'On target'                 },
    { id:'deprec',    dept:'Depreciation',         actual: 218,  budget: 200,  note:'New MRI unit Q1'           },
    { id:'other',     dept:'Other Expenses',       actual: 144,  budget: 150,  note:'Within threshold'          },
  ],
}

/* ── Data Load Sources ───────────────────────────────────────── */
export const DATA_SOURCES = [
  { id:'his',     name:'Hospital Info System',  system:'Epic HIS',       status:'done',    rows:48420, ts:'May 20 · 02:14', color:'#10b981', note:'Patient stats, census, procedures' },
  { id:'gl',      name:'General Ledger',        system:'Oracle ERP',     status:'done',    rows: 8312, ts:'May 19 · 23:58', color:'#10b981', note:'All cost centers, accounts balanced' },
  { id:'payroll', name:'Payroll Actuals',        system:'Kronos WFC',     status:'done',    rows: 1247, ts:'May 20 · 06:30', color:'#10b981', note:'FTE counts, wages, benefits' },
  { id:'fixed',   name:'Fixed Assets',           system:'Oracle Fixed',   status:'done',    rows:  892, ts:'May 19 · 22:00', color:'#10b981', note:'Depreciation schedules loaded' },
  { id:'purch',   name:'Purchase Orders',        system:'Oracle Purch.',  status:'progress',rows: 3104, ts:'Running…',        color:'#0ea5e9', note:'Partial load — 72% complete' },
  { id:'budget',  name:'Budget & Forecast',      system:'CommandAI EPM',  status:'done',    rows:  640, ts:'Apr 30 · 10:00', color:'#10b981', note:'FY2026 approved budget loaded' },
]

/* ── Financial Transactions (for Finance > Transactions tab) ─── */
const SEED_TX = [
  { id:1,  date:'2026-05-01', type:'income',  cat:'SaaS / Subscriptions',  desc:'TechCorp Monthly',       amount:5200,  src:'manual'  },
  { id:2,  date:'2026-05-03', type:'income',  cat:'Consulting',             desc:'GreenPath Advisory',     amount:3500,  src:'manual'  },
  { id:3,  date:'2026-05-05', type:'expense', cat:'Payroll',                desc:'May Payroll Run',         amount:28000, src:'manual'  },
  { id:4,  date:'2026-05-06', type:'expense', cat:'Software & Tools',       desc:'AWS + SaaS Stack',        amount:1840,  src:'csv'     },
  { id:5,  date:'2026-05-08', type:'income',  cat:'Professional Services',  desc:'Nova Studios Project',    amount:12000, src:'invoice' },
  { id:6,  date:'2026-05-10', type:'expense', cat:'Marketing & Ads',        desc:'LinkedIn Campaign',       amount:2200,  src:'manual'  },
  { id:7,  date:'2026-05-12', type:'income',  cat:'SaaS / Subscriptions',   desc:'BlueSky Subscription',    amount:4100,  src:'manual'  },
  { id:8,  date:'2026-05-13', type:'expense', cat:'Rent & Facilities',       desc:'Office Lease — May',      amount:4500,  src:'manual'  },
  { id:9,  date:'2026-05-15', type:'expense', cat:'Legal & Professional',    desc:'Legal Retainer',          amount:1500,  src:'csv'     },
  { id:10, date:'2026-05-16', type:'income',  cat:'Consulting',              desc:'Apex Finance Strategy',   amount:8000,  src:'invoice' },
  { id:11, date:'2026-05-18', type:'expense', cat:'Cost of Revenue',         desc:'Contractor Fees',         amount:6200,  src:'manual'  },
  { id:12, date:'2026-05-19', type:'expense', cat:'Travel',                  desc:'Client Meeting — NYC',    amount:840,   src:'manual'  },
]

/* ── Store ───────────────────────────────────────────────────── */
const useAppStore = create((set) => ({
  // Auth — DEV MODE: auto-logged in
  isAuthenticated: true,
  user: { name:'Faizan', email:'faiz.mnp@gmail.com', plan:'Pro', avatar:'F' },

  // Hospital org context
  org: {
    name:       'City General Hospital',
    entity:     'Main Campus',
    period:     'May 2026',
    fiscal:     'Q2 FY2026',
    closeDate:  'Jun 5, 2026',
    daysLeft:   16,
  },

  // Navigation
  currentScreen: 'home',

  // Toast
  toast: { visible:false, message:'' },

  // Monthly close tasks
  closeTasks: CLOSE_TASKS_SEED,
  updateCloseTask: (id, status) =>
    set(state => ({
      closeTasks: state.closeTasks.map(t => t.id === id ? { ...t, status } : t)
    })),

  // Financial transactions
  transactions: SEED_TX,
  addTransaction:  (tx)  => set(state => ({ transactions: [tx,  ...state.transactions] })),
  addTransactions: (txs) => set(state => ({ transactions: [...txs, ...state.transactions] })),

  // Business metrics
  metrics: {
    revenue:   { value:24800, label:'Monthly Revenue', prefix:'$', suffix:'k', delta:'+12%',  positive:true  },
    tasks:     { value:18,    label:'Open Tasks',       delta:'3 overdue',      positive:false },
    customers: { value:142,   label:'Active Customers', delta:'+8 this week',   positive:true  },
    invoices:  { value:7,     label:'Pending Invoices', delta:'$4.2k overdue',  positive:false },
  },

  activity: [
    { id:1, title:'GL Actuals loaded — Oracle ERP',       sub:'8,312 rows · $8.24M posted',  time:'2h',  dot:'#10b981' },
    { id:2, title:'Rate tables update — in progress',      sub:'F. Malik · Phase 2',          time:'1h',  dot:'#0ea5e9' },
    { id:3, title:'Payroll loaded — Kronos WFC',           sub:'1,247 FTEs · $3.84M',         time:'4h',  dot:'#10b981' },
    { id:4, title:'Variance flagged — Radiology -18%',     sub:'Threshold exceeded · FP&A',   time:'6h',  dot:'#f59e0b' },
    { id:5, title:'Statistical actuals loaded',            sub:'Epic HIS · 48,420 rows',       time:'8h',  dot:'#10b981' },
  ],

  // Chat history
  messages: [
    {
      id:1, role:'ai',
      html:'👋 Hi Faizan! I\'m your EPM AI assistant. I have full visibility into City General Hospital\'s May 2026 monthly close.<br/><br/>Ask me about variances, close status, forecasts, or any financial analysis.',
      time:'Just now',
    },
  ],

  // Actions
  login:  () => set({ isAuthenticated:true,  currentScreen:'home' }),
  logout: () => set({ isAuthenticated:false, currentScreen:'login' }),
  navigate: (screen) => set({ currentScreen: screen }),
  showToast: (message) => {
    set({ toast:{ visible:true, message } })
    setTimeout(() => set({ toast:{ visible:false, message:'' } }), 2600)
  },
  addMessage: (msg) => set(state => ({ messages:[...state.messages, msg] })),
}))

export default useAppStore
