# ⚡ CommandAI — AI Business Operating System

A mobile-first Progressive Web App (PWA) that serves as a complete AI-powered business operating system. Built with React + Vite + Tailwind CSS.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Routing | React Router 6 |
| PWA | vite-plugin-pwa |

## 📱 Features (Phase 1)

- **Login / Sign Up** — Auth screens with demo mode
- **Dashboard** — Animated KPI cards, AI Daily Brief, quick actions, activity feed
- **AI Assistant Chat** — Context-aware business AI with suggested prompts
- **Bottom Navigation** — Mobile-first nav with all module access
- **PWA** — Installable on Android & iOS, offline-ready

## 🗂 Project Structure

```
commandai/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── favicon.svg
│   └── icons/              # App icons (192px, 512px)
├── src/
│   ├── App.jsx             # Root component + screen router
│   ├── main.jsx            # Entry point
│   ├── index.css           # Tailwind + global styles
│   ├── screens/
│   │   ├── LoginScreen.jsx
│   │   ├── DashboardScreen.jsx
│   │   ├── ChatScreen.jsx
│   │   ├── CRMScreen.jsx
│   │   ├── ProjectsScreen.jsx
│   │   └── MoreScreen.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   └── TopHeader.jsx
│   │   ├── ui/
│   │   │   └── Toast.jsx
│   │   ├── dashboard/
│   │   │   └── StatCard.jsx
│   │   └── chat/
│   │       └── TypingIndicator.jsx
│   ├── hooks/
│   │   └── useCounter.js   # Animated number counter
│   ├── store/
│   │   └── appStore.js     # Zustand global state
│   └── lib/
│       └── aiResponses.js  # AI response engine (mock → real API in Phase 2)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🛠 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Roadmap

### ✅ Phase 1 — Core Shell (Done)
- [x] PWA setup + manifest
- [x] Login / Sign Up screens
- [x] Dashboard with animated KPIs
- [x] AI Assistant chat
- [x] Bottom navigation
- [x] Global state (Zustand)

### 🔨 Phase 2 — Revenue Core
- [ ] CRM — leads, pipeline, contacts
- [ ] Finance — invoices, expenses, P&L
- [ ] Projects — kanban, tasks, deadlines
- [ ] Real API integration

### 🔨 Phase 3 — Operations
- [ ] Team / HR — scheduling, attendance, payroll
- [ ] Inventory — stock, suppliers, orders
- [ ] Analytics — KPI dashboards, reports

### 🔨 Phase 4 — Automation + APK
- [ ] Workflow automation engine
- [ ] Trigger-based actions
- [ ] Capacitor/TWA APK packaging
- [ ] Push notifications

## 📲 PWA Install

On Android: open in Chrome → tap "Add to Home Screen"  
On iOS: open in Safari → Share → "Add to Home Screen"

## 🤝 Contributing

This is an active project. Each phase adds new modules. Feel free to open issues or PRs.

---

Built with ❤️ using Claude AI + React + Vite
