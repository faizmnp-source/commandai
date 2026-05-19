@echo off
echo.
echo  ⚡ CommandAI — Project Setup
echo  ─────────────────────────────────────────
echo.

REM ── Step 1: Install dependencies ──────────────
echo  [1/4] Installing npm packages...
npm install
if %errorlevel% neq 0 (
  echo  ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)
echo  ✓ Packages installed
echo.

REM ── Step 2: Initialize git ────────────────────
echo  [2/4] Initializing git repository...
git init
git config user.email "faiz.mnp@gmail.com"
git config user.name "Faizan"
git branch -M main
git add -A
git commit -m "feat: Phase 1 — CommandAI PWA shell

- React 18 + Vite 5 + Tailwind CSS 3
- Login/signup screens with demo mode
- Dashboard with animated KPI cards + AI daily brief
- AI assistant chat with context-aware responses
- Bottom navigation (Home, CRM, AI, Projects, More)
- Zustand global state management
- PWA manifest + vite-plugin-pwa setup
- Modular component architecture"
echo  ✓ Git initialized with initial commit
echo.

REM ── Step 3: GitHub remote ─────────────────────
echo  [3/4] Setting up GitHub remote...
echo.
echo  ACTION NEEDED:
echo  1. Go to https://github.com/new
echo  2. Create repo named: commandai
echo  3. Set it to Public or Private
echo  4. Do NOT initialize with README (we have one)
echo  5. Copy the repo URL and paste it below:
echo.
set /p REPO_URL="  Paste your GitHub repo URL: "
git remote add origin %REPO_URL%
git push -u origin main
echo  ✓ Code pushed to GitHub
echo.

REM ── Step 4: Start dev server ──────────────────
echo  [4/4] Starting development server...
echo.
echo  ─────────────────────────────────────────
echo   App running at: http://localhost:5173
echo   On mobile:      http://YOUR_LOCAL_IP:5173
echo  ─────────────────────────────────────────
echo.
npm run dev
