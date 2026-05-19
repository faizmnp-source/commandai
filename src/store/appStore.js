import { create } from 'zustand'

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

  // Business data (mock — will be API-driven in later phases)
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
    { id: 5, icon: '🤖', title: 'AI sent 3 automated follow-ups',       sub: 'TechCorp, Zara Ltd, BuildCo · CRM', time: '9h' },
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
