import { create } from 'zustand'

/* ── Seed financial transactions ─────────────────────────────── */
const SEED_TX = [
  { id:1,  date:'2026-05-01', type:'income',  cat:'SaaS / Subscriptions',  desc:'TechCorp Monthly',        amount:5200,  src:'manual'  },
  { id:2,  date:'2026-05-03', type:'income',  cat:'Consulting',             desc:'GreenPath Advisory',      amount:3500,  src:'manual'  },
  { id:3,  date:'2026-05-05', type:'expense', cat:'Payroll',                desc:'May Payroll Run',          amount:28000, src:'manual'  },
  { id:4,  date:'2026-05-06', type:'expense', cat:'Software & Tools',       desc:'AWS + SaaS Stack',         amount:1840,  src:'csv'     },
  { id:5,  date:'2026-05-08', type:'income',  cat:'Professional Services',  desc:'Nova Studios Project',     amount:12000, src:'invoice' },
  { id:6,  date:'2026-05-10', type:'expense', cat:'Marketing & Ads',        desc:'LinkedIn Campaign',        amount:2200,  src:'manual'  },
  { id:7,  date:'2026-05-12', type:'income',  cat:'SaaS / Subscriptions',   desc:'BlueSky Subscription',     amount:4100,  src:'manual'  },
  { id:8,  date:'2026-05-13', type:'expense', cat:'Rent & Facilities',       desc:'Office Lease — May',       amount:4500,  src:'manual'  },
  { id:9,  date:'2026-05-15', type:'expense', cat:'Legal & Professional',    desc:'Legal Retainer',           amount:1500,  src:'csv'     },
  { id:10, date:'2026-05-16', type:'income',  cat:'Consulting',              desc:'Apex Finance Strategy',    amount:8000,  src:'invoice' },
  { id:11, date:'2026-05-18', type:'expense', cat:'Cost of Revenue',         desc:'Contractor Fees',          amount:6200,  src:'manual'  },
  { id:12, date:'2026-05-19', type:'expense', cat:'Travel',                  desc:'Client Meeting — NYC',     amount:840,   src:'manual'  },
]

const useAppStore = create((set) => ({
  // Auth — DEV MODE: auto-logged in
  isAuthenticated: true,
  user: {
    name: 'Faizan',
    email: 'faiz.mnp@gmail.com',
    plan: 'Pro',
    avatar: 'F',
  },

  // Navigation — start on home
  currentScreen: 'home',

  // Toast
  toast: { visible: false, message: '' },

  // ── Financial transactions (shared between FinanceScreen & RightPanel)
  transactions: SEED_TX,
  addTransaction: (tx) => set(state => ({ transactions: [tx, ...state.transactions] })),
  addTransactions: (txs) => set(state => ({ transactions: [...txs, ...state.transactions] })),

  // Business metrics
  metrics: {
    revenue:   { value: 24800, label: 'Monthly Revenue', prefix: '$', suffix: 'k', delta: '+12%', positive: true },
    tasks:     { value: 18,    label: 'Open Tasks',      delta: '3 overdue',  positive: false },
    customers: { value: 142,   label: 'Active Customers', delta: '+8 this week', positive: true },
    invoices:  { value: 7,     label: 'Pending Invoices', delta: '$4.2k overdue', positive: false },
  },

  activity: [
    { id: 1, icon: '💰', title: 'Invoice #1042 paid by Apex Co.',      sub: '$1,800 received · Finance',     time: '2m' },
    { id: 2, icon: '👤', title: 'New lead: Sarah Johnson (TechCorp)',  sub: 'Added to pipeline · CRM',        time: '1h' },
    { id: 3, icon: '✅', title: 'Task "Q2 Report" completed',           sub: 'By Ahmed K. · Projects',         time: '3h' },
    { id: 4, icon: '📦', title: 'Low stock: Product SKU-204',           sub: '8 units left · Inventory',       time: '5h' },
    { id: 5, icon: '🤖', title: 'AI sent 3 automated follow-ups',       sub: 'TechCorp, Zara Ltd, BuildCo',    time: '9h' },
  ],

  // Chat history
  messages: [
    {
      id: 1,
      role: 'ai',
      html: '👋 Hi Faizan! I\'m your AI business assistant. I know your revenue, customers, tasks, and team.<br/><br/>Ask me anything — I can draft emails, analyse your data, flag risks, or run automations.',
      time: 'Just now',
    },
  ],

  // Actions
  login:  () => set({ isAuthenticated: true, currentScreen: 'home' }),
  logout: () => set({ isAuthenticated: false, currentScreen: 'login' }),

  navigate: (screen) => set({ currentScreen: screen }),

  showToast: (message) => {
    set({ toast: { visible: true, message } })
    setTimeout(() => set({ toast: { visible: false, message: '' } }), 2600)
  },

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}))

export default useAppStore
