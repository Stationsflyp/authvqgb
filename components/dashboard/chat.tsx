"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Smile } from "lucide-react"

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

export function Chat({ username, avatar_url, email }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const websocketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

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
          setMessages(data.messages)
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
    const baseUrl = apiUrl.replace(/\/api$/, "")
    const wsProtocol = baseUrl.includes("https") ? "wss" : "ws"
    const wsUrl = baseUrl.replace(/^https?/, wsProtocol) + "/ws/chat"

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.error) {
        setError(data.error)
        setTimeout(() => setError(""), 3000)
      } else {
        setMessages((prev) => [...prev, data])
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setError("Error en la conexión del chat")
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

  const commonEmojis = ["😀", "😂", "❤️", "👍", "🔥", "✨", "🎉", "😍", "🤔", "😎"]

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji)
    updateWordCount(input + emoji)
    setShowEmojiPicker(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || isSending) return

    if (wordCount > 30) {
      setError("Máximo 30 palabras por mensaje")
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
          })
        )
        setInput("")
        setWordCount(0)
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Error al enviar el mensaje")
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
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-[#667eea]/30">
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#667eea]/20 bg-[#1a1a1a]/80 backdrop-blur-sm">
        <div>
          <h3 className="font-bold text-lg text-[#667eea] flex items-center gap-2">
            💬 Chat Global
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {messages.length > 0 ? `${messages.length} mensaje${messages.length !== 1 ? "s" : ""}` : "Sin mensajes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">En línea</span>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-[#667eea]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Smile className="h-8 w-8 opacity-50" />
            <p className="text-sm">No hay mensajes. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="flex gap-3 hover:bg-[#1a1a1a]/50 p-2 rounded-lg transition-colors">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {msg.avatar_url ? (
                  <img
                    src={msg.avatar_url}
                    alt={msg.username}
                    className="w-10 h-10 rounded-full border border-[#667eea]/50 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#667eea]/20 border border-[#667eea]/50 flex items-center justify-center text-sm font-bold text-[#667eea]">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#667eea] hover:underline cursor-pointer">
                    {msg.username}
                  </span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                  {msg.email && (
                    <span className="text-xs text-gray-600 ml-auto">Discord ✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-100 break-words bg-[#2a2a2a]/60 px-3 py-2 rounded-lg border border-[#667eea]/10 hover:border-[#667eea]/30 transition-colors">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-[#667eea]/20 bg-[#1a1a1a]/50 backdrop-blur-sm space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje (máx 30 palabras)..."
                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a]/80 border border-[#667eea]/20 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent text-sm"
                rows={3}
              />
              {wordCount > 0 && (
                <div className={`absolute bottom-2 right-3 text-xs font-semibold ${wordCount > 30 ? "text-red-400" : "text-[#667eea]"}`}>
                  {wordCount}/30
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-[#667eea] p-1 h-auto"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={isSending || !input.trim() || wordCount > 30}
            className="bg-[#667eea] hover:bg-[#5568d3] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 p-0"
          >
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="bg-[#2a2a2a]/90 border border-[#667eea]/20 rounded-lg p-3 flex gap-2 flex-wrap">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-[#667eea]/20 p-2 rounded-lg transition-all cursor-pointer hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
