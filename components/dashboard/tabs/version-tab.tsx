"use client"

import { useState, useEffect } from "react"
import { Package, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface VersionTabProps {
  session: {
    owner_id: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

export function VersionTab({ session, showMessage }: VersionTabProps) {
  const [version, setVersion] = useState("1.1")
  const [currentVersion, setCurrentVersion] = useState("1.1")
  const [loading, setLoading] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadVersion()
  }, [session.owner_id, session.secret])

  const loadVersion = async () => {
    try {
      const response = await fetch(`${API}/client/get_version/${session.owner_id}?secret=${session.secret}`)
      const data = await response.json()
      if (data.success) {
        setCurrentVersion(data.version || "1.1")
        setVersion(data.version || "1.1")
      } else {
        setCurrentVersion("1.1")
        setVersion("1.1")
      }
    } catch (error) {
      showMessage("Error loading version: " + error, "error")
      setCurrentVersion("1.1")
      setVersion("1.1")
    }
  }

  const handleUpdateVersion = async () => {
    if (!version.trim() || !version.match(/^\d+(\.\d+)*$/)) {
      showMessage("Invalid version format", "error")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API}/client/set_version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          owner_id: session.owner_id,
          secret: session.secret,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "Version updated", data.success ? "success" : "error")
      if (data.success) {
        loadVersion()
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
        <Package className="h-8 w-8 text-blue-500" />
        Client Version
      </h2>

      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-8 border border-slate-700/50 shadow-2xl animate-scale-in backdrop-blur-sm">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Required Version</label>
            <Input
              type="text"
              placeholder="e.g., 1.1 or 1.2.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={handleUpdateVersion}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white font-semibold py-6 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Package className="h-5 w-5 mr-2" />
                Update Version
              </>
            )}
          </Button>

          <div className="bg-blue-950/50 border-l-4 border-blue-600 p-4 rounded-r-lg backdrop-blur-sm">
            <h3 className="text-blue-300 font-semibold mb-2">Current Version</h3>
            <p className="text-blue-200 text-lg font-mono">{currentVersion}</p>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            When you change the required version, all users must update to that version to use their accounts.
          </p>
        </div>
      </div>
    </div>
  )
}
