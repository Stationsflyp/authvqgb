"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Smile, MessageCircle, Clock, Shield } from "lucide-react"

interface Message {
  username: string
  message: string
  timestamp: string
  avatar_url?: string
  email?: string
}

interface ChatProps {
  username: string
  avatar_url?: string
  email?: string
}

const EMOJI_PACK = {
  smileys: ["😀", "😂", "😍", "😎", "🤔", "😜", "😱", "🥳"],
  hands: ["👍", "👌", "✌️", "🙌", "👏", "🤝", "💪", "🤜"],
  objects: ["🎉", "🎊", "🎈", "🎁", "⭐", "✨", "🔥", "💯"],
  nature: ["🌟", "💫", "🌈", "☀️", "🌙", "⚡", "💥", "🎯"],
  activity: ["⚽", "🏀", "🎮", "🎬", "🎵", "🎤", "🎧", "🎪"],
}

export function Chat({ username, avatar_url, email }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [wsConnected, setWsConnected] = useState(false)
  const [activeEmojiTab, setActiveEmojiTab] = useState<keyof typeof EMOJI_PACK>("smileys")
  const websocketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${apiUrl}/chat/history`)
        const data = await response.json()
        if (data.success) {
          setMessages(data.messages || [])
        }
      } catch (err) {
        console.error("Error fetching chat history:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [apiUrl])

  useEffect(() => {
    const constructWsUrl = () => {
      try {
        const url = new URL(apiUrl)
        const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:"
        return `${wsProtocol}//${url.host}/api/ws/chat`
      } catch {
        const baseUrl = apiUrl.replace(/\/api\/?$/, "")
        const wsProtocol = baseUrl.includes("https") ? "wss" : "ws"
        return baseUrl.replace(/^https?/, wsProtocol) + "/api/ws/chat"
      }
    }

    const wsUrl = constructWsUrl()
    console.log("🔌 Conectando a WebSocket:", wsUrl)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("✅ WebSocket conectado:", wsUrl)
      setWsConnected(true)
      setError("")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.error) {
          console.warn("⚠️ Error en mensaje:", data.error)
          setError(data.error)
          setTimeout(() => setError(""), 3000)
        } else if (data.message) {
          setMessages((prev) => [...prev, data])
        }
      } catch (e) {
        console.error("❌ Error parseando mensaje:", e)
      }
    }

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error)
      setWsConnected(false)
      setError("❌ Error en la conexión del chat")
    }

    ws.onclose = () => {
      console.log("🔌 WebSocket desconectado")
      setWsConnected(false)
    }

    websocketRef.current = ws

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [apiUrl])

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    updateWordCount(e.target.value)
  }

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji)
    updateWordCount(input + emoji)
  }

  const sendMessage = async () => {
    if (!input.trim() || isSending) return

    if (wordCount > 30) {
      setError("⚠️ Máximo 30 palabras por mensaje")
      return
    }

    if (!wsConnected) {
      setError("❌ Conectando al servidor...")
      return
    }

    setIsSending(true)
    setError("")

    try {
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            username,
            message: input.trim(),
            avatar_url,
            email,
            timestamp: new Date().toISOString(),
          })
        )
        setInput("")
        setWordCount(0)
      } else {
        setError("❌ Desconectado del servidor")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("❌ Error al enviar el mensaje")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return "..."
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* 💬 Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              💬 Chat Global
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {messages.length > 0 ? `${messages.length} 📝 mensaje${messages.length !== 1 ? "s" : ""}` : "🎉 Sin mensajes aún"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500 animate-bounce"}`} />
          <span className={`text-xs font-semibold ${wsConnected ? "text-green-400" : "text-red-400"}`}>
            {wsConnected ? "✅ En línea" : "🔌 Conectando..."}
          </span>
        </div>
      </div>

      {/* 📝 Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900/30 to-slate-950/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-sm text-slate-400">Cargando historial... ⏳</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <MessageCircle className="h-12 w-12 opacity-30" />
            <p className="text-sm font-semibold">No hay mensajes 🤫</p>
            <p className="text-xs">¡Sé el primero en escribir algo! 🎉</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="flex gap-3 hover:bg-slate-800/40 p-3 rounded-lg transition-all group animate-fade-in">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {msg.avatar_url ? (
                  <img
                    src={msg.avatar_url}
                    alt={msg.username}
                    className="w-10 h-10 rounded-full border-2 border-cyan-500/50 object-cover shadow-md hover:border-cyan-400"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-300 shadow-md">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer">
                    👤 {msg.username}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.email && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-400" />
                      Discord ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-100 break-words bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-3 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-colors shadow-sm group-hover:shadow-md">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ⚠️ Error Message */}
      {error && (
        <div className="mx-4 mt-2 px-4 py-3 bg-red-500/15 border border-red-500/40 text-red-300 text-xs rounded-lg animate-pulse flex items-center gap-2 font-semibold">
          <span className="text-lg">⚠️</span>
          {error}
        </div>
      )}

      {/* 📝 Input Area */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-2">
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="✍️ Escribe un mensaje (máx 30 palabras)..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700/50 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm transition-all hover:border-slate-600/50"
                rows={2}
              />
              {wordCount > 0 && (
                <div className={`absolute bottom-2 right-3 text-xs font-bold px-2 py-1 rounded-lg ${
                  wordCount > 30
                    ? "bg-red-500/20 text-red-300"
                    : wordCount > 20
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-cyan-500/20 text-cyan-300"
                }`}>
                  {wordCount}/30 📊
                </div>
              )}
            </div>

            {/* Emoji Picker Toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-slate-400 hover:text-cyan-300 hover:bg-slate-800 p-2 h-auto transition-all"
                title="Abrir selector de emojis"
              >
                <Smile className="h-5 w-5" />
                <span className="ml-1 text-xs">😊</span>
              </Button>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={sendMessage}
            disabled={isSending || !input.trim() || wordCount > 30 || !wsConnected}
            title={!wsConnected ? "🔌 Conectando al servidor..." : !input.trim() ? "📝 Escribe un mensaje..." : "📤 Enviar (Enter)"}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 p-0 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/30"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* 😊 Emoji Picker */}
        {showEmojiPicker && (
          <div className="bg-slate-800/90 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm space-y-3 animate-slide-up">
            {/* Emoji Category Tabs */}
            <div className="flex gap-2 justify-center flex-wrap">
              {Object.keys(EMOJI_PACK).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveEmojiTab(category as keyof typeof EMOJI_PACK)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    activeEmojiTab === category
                      ? "bg-cyan-600 text-white shadow-md"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                  }`}
                >
                  {category === "smileys" && "😊"}
                  {category === "hands" && "👋"}
                  {category === "objects" && "🎉"}
                  {category === "nature" && "🌟"}
                  {category === "activity" && "⚽"}
                </button>
              ))}
            </div>

            {/* Emojis Grid */}
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_PACK[activeEmojiTab].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    handleEmojiClick(emoji)
                  }}
                  className="text-2xl hover:bg-cyan-500/30 p-2 rounded-lg transition-all cursor-pointer hover:scale-125 hover:shadow-md"
                  title={`Agregar emoji: ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connection Status Helper */}
        {!wsConnected && (
          <div className="flex items-center gap-2 text-xs text-slate-400 px-2 py-1 bg-slate-700/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" />
            Reconectando con el servidor... 🔄
          </div>
        )}
      </div>
    </div>
  )
}
