import useAppStore from '../../store/appStore'

export default function Toast() {
  const { toast } = useAppStore()

  return (
    <div
      className={`absolute top-[18px] left-1/2 -translate-x-1/2 bg-slate-900 text-white
                  px-[18px] py-[10px] rounded-full text-[13px] font-medium z-[9999]
                  whitespace-nowrap max-w-[300px] pointer-events-none
                  transition-transform duration-300`}
      style={{
        transform: `translateX(-50%) translateY(${toast.visible ? '0' : '-80px'})`,
        transitionTimingFunction: toast.visible ? 'cubic-bezier(.34,1.56,.64,1)' : 'ease',
      }}
    >
      {toast.message}
    </div>
  )
}
