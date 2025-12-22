"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skull, Loader2, AlertTriangle } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface KillSessionTabProps {
  session: {
    owner_id: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

interface ConfirmDialog {
  isOpen: boolean
  title: string
  message: string
  action: (() => void) | null
  isDangerous: boolean
}

export function KillSessionTab({ session, showMessage }: KillSessionTabProps) {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  const handleKillSession = async () => {
    if (!username.trim()) {
      showMessage("Enter username", "error")
      return
    }

    setConfirmDialog({
      isOpen: true,
      title: "Force Logout",
      message: `Kill session for ${username}? They will be immediately logged out and unable to login until approved.`,
      action: performKillSession,
      isDangerous: true,
    })
  }

  const performKillSession = async () => {

    setLoading(true)
    try {
      const usersResponse = await fetch(`${API}/client/users/${session.owner_id}?secret=${session.secret}`)
      const usersData = await usersResponse.json()
      const user = usersData.users?.find((u: any) => u.username === username)

      if (!user) {
        showMessage("User not found", "error")
        setLoading(false)
        return
      }

      const response = await fetch(`${API}/client/block_user/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "Kill session sent", data.success ? "success" : "error")
      if (data.success) {
        setUsername("")
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={() => confirmDialog.action?.()}
        onCancel={() =>
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      />
      <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
        <Skull className="h-8 w-8 text-red-400" />
        Force Logout
      </h2>

      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 shadow-lg animate-scale-in backdrop-blur-xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <Input
              type="text"
              placeholder="Enter username to kill"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <Button
            onClick={handleKillSession}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 text-white font-semibold py-6 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Skull className="h-5 w-5 mr-2" />
                Kill Session
              </>
            )}
          </Button>

          <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">
                This will block the user and close all their open sessions immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
