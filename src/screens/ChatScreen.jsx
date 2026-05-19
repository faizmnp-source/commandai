import { useState, useRef, useEffect } from 'react'
import useAppStore from '../store/appStore'
import TypingIndicator from '../components/chat/TypingIndicator'
import { getAIResponse, SUGGESTIONS } from '../lib/aiResponses'

export default function ChatScreen() {
  const { messages, addMessage } = useAppStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [usedSuggestions, setUsedSuggestions] = useState(new Set())
  const msgsRef   = useRef(null)
  const inputRef  = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: 'smooth' })
    }, 60)
  }

  useEffect(scrollToBottom, [messages, isTyping])

  const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    addMessage({ id: Date.now(), role: 'user', html: msg, time: now() })
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addMessage({ id: Date.now() + 1, role: 'ai', html: getAIResponse(msg), time: now() })
    }, 1100 + Math.random() * 700)
  }

  const useSuggestion = (sug) => {
    setUsedSuggestions((prev) => new Set([...prev, sug]))
    send(sug)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
  }

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center gap-[11px] px-4 py-[13px] border-b border-slate-100 flex-shrink-0">
        <div
          className="w-10 h-10 rounded-[14px] flex items-center justify-center text-[18px]"
          style={{
            background: 'linear-gradient(135deg, #065f46, #34d399)',
            boxShadow: '0 4px 14px rgba(5,150,105,.28)',
          }}
        >
          🧠
        </div>
        <div>
          <h3 className="font-display text-[15px] font-bold">CommandAI Assistant</h3>
          <p className="text-[11px] text-em-600 font-medium">● Online · Knows your business</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={msgsRef}
        className="flex-1 overflow-y-auto no-scrollbar px-[14px] py-[14px] flex flex-col gap-[10px]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[86%] animate-msg-in
                        ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div
              className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}
              dangerouslySetInnerHTML={{ __html: msg.html }}
            />
            <span className="text-[10px] text-slate-300 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Suggestion chips */}
      <div className="flex gap-[7px] overflow-x-auto no-scrollbar px-[14px] py-2 flex-shrink-0">
        {SUGGESTIONS.filter((s) => !usedSuggestions.has(s)).map((sug) => (
          <button
            key={sug}
            onClick={() => useSuggestion(sug)}
            className="whitespace-nowrap px-[13px] py-[7px] bg-em-50 border border-em-100
                       rounded-full text-[12px] text-em-700 font-medium cursor-pointer
                       flex-shrink-0 transition-all active:bg-em-100 active:border-em-300
                       font-body bg-transparent outline-none"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="px-[14px] pb-[12px] pt-2 border-t border-slate-50 flex-shrink-0">
        <div
          className="flex items-end gap-[9px] bg-slate-50 border-[1.5px] border-slate-200
                     rounded-[22px] px-[14px] py-[7px] transition-all duration-200
                     focus-within:border-em-400 focus-within:bg-white"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={autoResize}
            onKeyDown={handleKey}
            placeholder="Ask about your business…"
            className="flex-1 border-none bg-transparent text-[14px] font-body text-slate-900
                       resize-none outline-none min-h-[22px] max-h-[96px] leading-relaxed
                       placeholder:text-slate-300"
            style={{ WebkitAppearance: 'none' }}
          />
          <button
            onClick={() => send()}
            className="w-[34px] h-[34px] rounded-full border-none flex items-center justify-center
                       text-white text-[14px] cursor-pointer flex-shrink-0 transition-all active:scale-90"
            style={{
              background: 'linear-gradient(135deg, #047857, #10b981)',
              boxShadow: '0 2px 8px rgba(5,150,105,.3)',
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  )
}
