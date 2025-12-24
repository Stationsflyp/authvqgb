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
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      startPolling()
    } else {
      cleanup()
    }
    
    return () => cleanup()
  }, [isOpen, userId])

  const startPolling = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    
    setIsConnected(true)
    console.log("Starting screen frame polling for user:", userId)
    
    const pollFrame = async () => {
      try {
        const frameUrl = `${apiUrl}/screen/frame/${userId}`
        const response = await fetch(frameUrl)
        
        if (response.ok && response.status !== 204) {
          const blob = await response.blob()
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob)
            setImageSrc((prev) => {
              if (prev) URL.revokeObjectURL(prev)
              return url
            })
          }
        }
      } catch (error) {
        console.error("Error fetching screen frame:", error)
      }
    }
    
    pollFrame()
    pollingRef.current = setInterval(pollFrame, 100)
  }

  const cleanup = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc)
      setImageSrc(null)
    }
    setIsConnected(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200 p-4">
      <div className={`relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-[90vw] h-[85vh] max-w-7xl'}`}>
        
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
