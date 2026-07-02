import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Lock } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    text: 'Hallo! Ich bin dein persönlicher KI-Finanzberater. Wie kann ich dir heute helfen? 💰',
    time: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 2,
    role: 'user',
    text: 'Wie kann ich mehr sparen?',
    time: new Date(Date.now() - 4 * 60 * 1000),
  },
  {
    id: 3,
    role: 'ai',
    text: 'Basierend auf deinen Ausgaben sehe ich einiges Sparpotenzial:\n\n📊 **Deine Top-Ausgaben:**\n- Miete: €800 (43%) — Schwer zu reduzieren\n- Lebensmittel: €350 (19%) — Hier könntest du €50-80/Monat sparen durch Meal-Prep\n- Shopping: €200 (11%) — Versuche die 48h-Regel: Warte 48h vor jedem Kauf\n\n💡 **Mein Tipp:** Setze dir ein Wochenlimit von €80 für variable Ausgaben. Das allein könnte dir €150/Monat sparen!',
    time: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: 4,
    role: 'user',
    text: 'Was ist die 48h-Regel?',
    time: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: 5,
    role: 'ai',
    text: 'Die **48-Stunden-Regel** ist eine bewährte Methode gegen Impulskäufe:\n\n⏰ **So funktioniert\'s:**\n1. Du willst etwas kaufen (das kein Grundbedürfnis ist)\n2. Warte 48 Stunden\n3. Wenn du es nach 48h immer noch willst → kaufe es\n4. Oft merkst du: Du brauchst es gar nicht!\n\n📈 Studien zeigen: 70% der Impulskäufe werden so vermieden. Das spart durchschnittlich €100-200/Monat!',
    time: new Date(Date.now() - 1 * 60 * 1000),
  },
]

const FREE_LIMIT = 2

const AI_RESPONSES = [
  'Guter Punkt! Basierend auf deinen Daten empfehle ich dir, ein Notfallpolster von 3 Monatsgehältern aufzubauen. Das wären bei dir €9.750. Starte mit €200/Monat!',
  'Die 50/30/20 Regel könnte dir helfen: 50% für Bedürfnisse, 30% für Wünsche, 20% für Sparen. Bei deinem Einkommen wären das: €1.625 Bedürfnisse, €975 Wünsche, €650 Sparen.',
  'Tipp: Überprüfe deine Abos! Die meisten Menschen zahlen für 3-4 Abos die sie kaum nutzen. Das sind schnell €30-50/Monat Ersparnis.',
  'Hast du schon mal an einen Nebenverdienst gedacht? Mit deinen Skills könntest du Freelancing versuchen. Schon 5h/Woche können €200-500 extra bringen!',
]

let _nextResponseIdx = 0

function nextAiResponse() {
  const msg = AI_RESPONSES[_nextResponseIdx % AI_RESPONSES.length]
  _nextResponseIdx++
  return msg
}

let _nextId = 100

function makeId() {
  return ++_nextId
}

// ─── MessageBubble ─────────────────────────────────────────────────────────────

function renderText(text) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ))
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] sm:max-w-[65%]">
          <div className="bg-primary-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
            {renderText(message.text)}
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right pr-1">{formatTime(message.time)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-2">
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1 text-base">
        🤖
      </div>
      <div className="max-w-[80%] sm:max-w-[65%]">
        <p className="text-xs font-semibold text-primary-600 mb-1">MoneyAI</p>
        <div className="bg-white border border-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed">
          {renderText(message.text)}
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-1">{formatTime(message.time)}</p>
      </div>
    </div>
  )
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2">
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-base">
        🤖
      </div>
      <div>
        <p className="text-xs font-semibold text-primary-600 mb-1">MoneyAI</p>
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, typing, scrollToBottom])

  function resizeTextarea() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const lineHeight = 24 // px per line (text-sm leading-6)
    const maxHeight = lineHeight * 4 + 24 // max 4 lines + vertical padding
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
  }

  function handleInputChange(e) {
    setInput(e.target.value)
    resizeTextarea()
  }

  function sendMessage() {
    const text = input.trim()
    if (!text || typing) return

    const userMsg = { id: makeId(), role: 'user', text, time: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setUserMsgCount((c) => c + 1)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setTyping(true)
    // Simulate 1-2 second AI response time for a realistic typing indicator
    const delay = 1000 + Math.random() * 1000

    setTimeout(() => {
      const aiMsg = { id: makeId(), role: 'ai', text: nextAiResponse(), time: new Date() }
      setMessages((prev) => [...prev, aiMsg])
      setTyping(false)
    }, delay)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isLimitReached = userMsgCount >= FREE_LIMIT

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-4rem)] -m-6 bg-gray-50">

        {/* Premium banner */}
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Free-Nutzer:</strong> {FREE_LIMIT} Nachrichten/Woche
              {' '}| <strong className="text-primary-600">Upgrade für unbegrenzt</strong>
            </span>
          </div>
          <span className="text-xs text-amber-600 flex-shrink-0">
            {userMsgCount}/{FREE_LIMIT} genutzt
          </span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
          {isLimitReached && (
            <div className="mb-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Wochenlimit erreicht. Upgrade für unbegrenzte Nachrichten.</span>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLimitReached || typing}
              placeholder="Frag mich etwas über deine Finanzen..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all resize-none leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLimitReached || typing}
              className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Senden"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter = Senden · Shift+Enter = Neue Zeile
          </p>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default AIChat
