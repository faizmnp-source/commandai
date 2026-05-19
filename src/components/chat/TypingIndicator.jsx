export default function TypingIndicator() {
  return (
    <div className="self-start flex gap-1 px-[14px] py-[11px] bg-em-50 border border-slate-100
                    rounded-[17px] rounded-bl-[4px] w-fit animate-msg-in">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] bg-em-400 rounded-full animate-bounce-dot"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  )
}
