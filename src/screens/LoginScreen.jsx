import { useState } from 'react'
import useAppStore from '../store/appStore'

export default function LoginScreen() {
  const { login } = useAppStore()
  const [tab, setTab] = useState('in')

  return (
    <div className="flex flex-col items-center justify-center px-7 py-10 overflow-y-auto"
         style={{ background: 'linear-gradient(160deg, #ecfdf5 0%, #ffffff 55%, #f0fdf4 100%)' }}>

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-[76px] h-[76px] rounded-[22px] flex items-center justify-center text-[34px]
                     mb-[14px] animate-float"
          style={{
            background: 'linear-gradient(135deg, #047857, #34d399)',
            boxShadow: '0 8px 30px rgba(5,150,105,.38)',
          }}
        >
          ⚡
        </div>
        <h1 className="font-display text-[30px] font-extrabold tracking-[-0.6px] text-slate-900">
          CommandAI
        </h1>
        <p className="text-[12.5px] text-slate-400 mt-1">Your AI Business Operating System</p>
      </div>

      {/* Card */}
      <div
        className="w-full bg-white rounded-[28px] p-[26px]"
        style={{ boxShadow: '0 12px 40px rgba(5,150,105,.18), 0 4px 12px rgba(0,0,0,.06)', border: '1px solid #d1fae5' }}
      >
        {/* Tabs */}
        <div className="flex bg-em-50 rounded-[10px] p-[3px] mb-[22px]">
          {['in', 'up'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-[13px] rounded-[8px] cursor-pointer transition-all duration-200
                          ${tab === t
                            ? 'bg-white text-em-700 font-bold shadow-sm'
                            : 'text-slate-400 font-medium bg-transparent border-none'}`}
            >
              {t === 'in' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {tab === 'in' ? (
          <>
            <Field label="Email"    type="email"    placeholder="you@business.com" defaultValue="faiz.mnp@gmail.com" />
            <Field label="Password" type="password" placeholder="••••••••"          defaultValue="password" />
          </>
        ) : (
          <>
            <Field label="Full Name"      type="text"     placeholder="Your name" />
            <Field label="Business Name"  type="text"     placeholder="Your company" />
            <Field label="Email"          type="email"    placeholder="you@business.com" />
            <Field label="Password"       type="password" placeholder="Create a strong password" />
          </>
        )}

        <button className="btn-em mt-1.5" onClick={login}>
          {tab === 'in' ? 'Sign In →' : 'Create Account →'}
        </button>

        <div className="text-center text-[12px] text-slate-300 my-[18px] relative">
          <span className="bg-white px-3 relative z-10">or continue as demo</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100" />
        </div>

        <button className="btn-ghost" onClick={login}>
          🎯 &nbsp; Try Demo Mode
        </button>
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, defaultValue }) {
  return (
    <div className="mb-[13px]">
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-[.5px] mb-[5px]">
        {label}
      </label>
      <input className="inp" type={type} placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  )
}
