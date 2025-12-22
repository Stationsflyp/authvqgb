"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Smile, MessageCircle, Clock, Shield, Zap, Heart } from "lucide-react"

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
    <div className="flex flex-col h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl hover:border-cyan-500/40 transition-all">
      {/* ✨ Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-6 py-5 border-b border-cyan-500/30">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 animate-pulse" />
              <MessageCircle className="h-7 w-7 text-white relative z-10" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white drop-shadow-lg">💬 Chat Global</h3>
              <p className="text-xs text-cyan-100 font-semibold">
                {messages.length > 0 ? `${messages.length} 💭 conversaciones` : "🎉 ¡Sin mensajes aún!"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/30">
            <div className={`w-3 h-3 rounded-full ${wsConnected ? "bg-green-300 animate-pulse shadow-lg shadow-green-400" : "bg-red-300 animate-bounce"}`} />
            <span className={`text-xs font-bold ${wsConnected ? "text-green-100" : "text-red-100"}`}>
              {wsConnected ? "🟢 En línea" : "🔴 Conectando..."}
            </span>
          </div>
        </div>
      </div>

      {/* 💬 Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/50 scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-16 h-16">
              <Loader2 className="h-16 w-16 animate-spin text-cyan-400 absolute inset-0" />
              <div className="h-16 w-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse absolute inset-0" />
            </div>
            <p className="text-sm text-slate-400 font-semibold">Cargando historial... ⏳</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 py-12">
            <div className="relative">
              <MessageCircle className="h-16 w-16 opacity-20 relative z-10" />
              <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-2xl" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Sin mensajes 🤫</p>
              <p className="text-xs text-slate-500 mt-2">¡Sé el primero en escribir! 🚀</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="flex gap-3 group hover:bg-slate-800/40 p-4 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/10 animate-fade-in"
            >
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                {msg.avatar_url ? (
                  <img
                    src={msg.avatar_url}
                    alt={msg.username}
                    className="w-12 h-12 rounded-full border-2 border-cyan-500/60 object-cover shadow-md hover:border-cyan-400 hover:shadow-cyan-400/30 transition-all"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/40 to-blue-500/40 border-2 border-cyan-500/60 flex items-center justify-center text-sm font-bold text-cyan-300 shadow-md hover:from-cyan-500/60 hover:to-blue-500/60 transition-all">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer group-hover:underline transition-all">
                    👤 {msg.username}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded-full">
                    <Clock className="h-3 w-3" />
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.email && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 px-2 py-1 bg-green-950/40 rounded-full border border-green-500/20">
                      <Shield className="h-3 w-3 text-green-400" />
                      Discord ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-100 break-words bg-gradient-to-br from-slate-800/60 to-slate-700/60 px-4 py-3 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all shadow-sm group-hover:shadow-md group-hover:shadow-cyan-500/10">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ⚠️ Error Banner */}
      {error && (
        <div className="mx-5 mb-3 px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-300 text-xs rounded-xl animate-pulse flex items-center gap-3 font-semibold shadow-lg shadow-red-500/10">
          <span className="text-lg animate-bounce">⚠️</span>
          {error}
        </div>
      )}

      {/* 📝 Input Section */}
      <div className="p-5 border-t border-cyan-500/20 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm space-y-3">
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-3">
            {/* Text Input */}
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="✍️ Comparte tu mensaje..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700/50 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/50 text-sm transition-all hover:border-slate-600/50 hover:shadow-md hover:shadow-cyan-500/10"
                rows={2}
              />
              {wordCount > 0 && (
                <div className={`absolute bottom-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                  wordCount > 30
                    ? "bg-red-500/30 text-red-300 animate-pulse"
                    : wordCount > 20
                      ? "bg-yellow-500/30 text-yellow-300"
                      : "bg-cyan-500/30 text-cyan-300"
                }`}>
                  📊 {wordCount}/30
                </div>
              )}
            </div>

            {/* Emoji & Controls */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-slate-400 hover:text-cyan-300 hover:bg-slate-800/70 p-2 h-auto rounded-lg transition-all font-semibold"
              title="Abrir selector de emojis"
            >
              <Smile className="h-5 w-5" />
              <span className="ml-2 text-xs">😊 Emojis</span>
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={sendMessage}
            disabled={isSending || !input.trim() || wordCount > 30 || !wsConnected}
            title={!wsConnected ? "🔌 Conectando..." : !input.trim() ? "📝 Escribe algo..." : "📤 Enviar (Enter)"}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed h-12 w-12 p-0 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-500/40 disabled:shadow-none"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* 😊 Emoji Picker Panel */}
        {showEmojiPicker && (
          <div className="bg-slate-800/95 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm space-y-3 animate-slide-up shadow-xl shadow-cyan-500/10">
            <div className="flex gap-2 justify-center flex-wrap">
              {Object.keys(EMOJI_PACK).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveEmojiTab(category as keyof typeof EMOJI_PACK)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeEmojiTab === category
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300 hover:shadow-md"
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
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_PACK[activeEmojiTab].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    handleEmojiClick(emoji)
                  }}
                  className="text-2xl hover:bg-cyan-500/40 p-2 rounded-lg transition-all cursor-pointer hover:scale-150 hover:shadow-lg hover:shadow-cyan-500/30"
                  title={`Agregar: ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connection Status */}
        {!wsConnected && (
          <div className="flex items-center gap-2 text-xs text-slate-400 px-4 py-2 bg-slate-700/30 rounded-lg border border-slate-700/50 font-semibold">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" />
            🔄 Intentando conectar al servidor...
          </div>
        )}
      </div>
    </div>
  )
}
