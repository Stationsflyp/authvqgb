"use client"

import { useEffect, useState, useRef } from "react"
import { X, Maximize2, Minimize2, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScreenViewerProps {
  isOpen: boolean
  onClose: () => void
  userId: number | string
  username: string
}

export function ScreenViewer({ isOpen, onClose, userId, username }: ScreenViewerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      connect()
    } else {
      cleanup()
    }
    
    return () => cleanup()
  }, [isOpen, userId])

  const connect = () => {
    // Determine the base API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    
    // Convert http(s) to ws(s)
    let wsBase = apiUrl.replace(/^http/, "ws")
    
    // Construct full WebSocket URL
    // The server endpoint is /api/ws/screen/view/{client_id}
    // Note: if apiUrl already ends with /api, we should be careful not to double it if the server logic expects otherwise.
    // However, looking at server.py, the route is defined as @app.websocket("/api/ws/screen/view/{client_id}")
    // If NEXT_PUBLIC_API_URL is "http://localhost:8000/api", then wsBase is "ws://localhost:8000/api"
    // So we append "/ws/screen/view/${userId}". 
    // Wait, the route in server.py INCLUDES /api prefix?
    // Line 3358: @app.websocket("/api/ws/screen/view/{client_id}")
    // If apiUrl is http://localhost:8000/api, then wsBase is ws://localhost:8000/api
    // If we append /ws/screen/view/..., we get ws://localhost:8000/api/ws/screen/view/...
    // This matches the server route structure assuming the router handles /api prefix correctly.
    // In FastAPI, if you mount the app, prefixes matter. Here `app` is the main app.
    // So the full path is indeed /api/ws/screen/view/...
    
    // BUT, if NEXT_PUBLIC_API_URL includes /api, we need to be careful. 
    // Usually it does. Let's assume it does.
    
    // If wsBase ends with /api, we strip it if we want to construct from root, OR we just use it if the route is relative to that.
    // The route in server.py is absolute: /api/ws/screen/...
    // So we want the host + /api/ws/screen/...
    
    // Let's parse the URL to be safe.
    let wsUrl = ""
    try {
        const urlObj = new URL(apiUrl)
        const protocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:'
        wsUrl = `${protocol}//${urlObj.host}/api/ws/screen/view/${userId}`
    } catch (e) {
        // Fallback for simple strings or relative paths (unlikely)
        wsUrl = `ws://localhost:8000/api/ws/screen/view/${userId}`
    }
    
    console.log("Connecting to Screen Share:", wsUrl)

    const ws = new WebSocket(wsUrl)
    ws.binaryType = "arraybuffer"

    ws.onopen = () => {
      setIsConnected(true)
      console.log("Connected to screen stream")
    }

    ws.onmessage = (event) => {
      const arrayBuffer = event.data
      const blob = new Blob([arrayBuffer], { type: "image/jpeg" })
      const url = URL.createObjectURL(blob)
      
      setImageSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev) // Clean up old URL
        return url
      })
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log("Disconnected from screen stream")
    }

    ws.onerror = (err) => {
      console.error("WebSocket error:", err)
      setIsConnected(false)
    }

    wsRef.current = ws
  }

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc)
      setImageSrc(null)
    }
    setIsConnected(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className={`relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-[90vw] h-[80vh] max-w-6xl'}`}>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900/90 backdrop-blur flex items-center justify-between px-4 z-10 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-semibold text-white">Screen: {username}</span>
            {isConnected ? 
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1"><Wifi className="h-3 w-3" /> Live</span> : 
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1"><WifiOff className="h-3 w-3" /> Offline</span>
            }
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-400 hover:text-white">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-red-400">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-full flex items-center justify-center bg-black pt-12">
          {isConnected && imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Screen Share" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Waiting for stream...</p>
              <p className="text-xs text-slate-500 mt-2">Make sure the client is running and streaming.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
