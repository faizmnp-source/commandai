import { useCounter } from '../../hooks/useCounter'

export default function StatCard({ emoji, target, prefix = '', suffix = '', label, delta, positive, onClick }) {
  const value = useCounter(target, 900)

  return (
    <div
      onClick={onClick}
      className="bg-white border-[1.5px] border-slate-100 rounded-xl p-[14px] cursor-pointer
                 transition-all duration-150 active:scale-[.96] active:border-em-200"
      style={{ boxShadow: '0 2px 8px rgba(5,150,105,.08), 0 1px 3px rgba(0,0,0,.06)' }}
    >
      <span className="text-[20px] mb-2 block">{emoji}</span>
      <div className="font-display text-[21px] font-bold tracking-tight text-slate-900">
        {prefix}{value.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-slate-400 mt-[3px] font-medium">{label}</div>
      <div className={`text-[11px] font-semibold mt-[6px] flex items-center gap-[3px]
                       ${positive ? 'text-em-600' : 'text-red-500'}`}>
        {positive ? '↑' : '↓'} {delta}
      </div>
    </div>
  )
}
