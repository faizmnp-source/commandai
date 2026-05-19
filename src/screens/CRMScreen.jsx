import TopHeader from '../components/layout/TopHeader'

export default function CRMScreen() {
  return (
    <>
      <TopHeader title="CRM" subtitle="Customers & Pipeline" />
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
        <div className="text-[52px] mb-[18px]">👥</div>
        <h2 className="font-display text-[21px] font-bold mb-[10px]">CRM Module</h2>
        <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[240px]">
          Manage leads, deals, and customer relationships with AI-powered insights and pipeline tracking.
        </p>
        <div className="mt-[18px] px-[14px] py-[6px] bg-em-50 border border-em-200
                        rounded-full text-[12px] font-semibold text-em-700">
          🚀 Coming in Phase 2
        </div>
      </div>
    </>
  )
}
