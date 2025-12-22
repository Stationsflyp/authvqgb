"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Loader2 } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface HWIDReset {
  id: number
  username: string
  old_hwid: string | null
}

interface HwidResetsTabProps {
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

export function HWIDResetsTab({ session, showMessage }: HwidResetsTabProps) {
  const [resets, setResets] = useState<HWIDReset[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    loadResets()
  }, [])

  const loadResets = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/admin/hwid_resets?owner_id=${session.owner_id}&secret=${session.secret}`)
      const data = await response.json()
      if (data.resets) {
        setResets(data.resets)
      }
    } catch (error) {
      showMessage("Error loading resets: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const approveReset = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Approve HWID Reset",
      message: "Are you sure you want to approve this HWID reset? The user will be able to login from a different computer.",
      action: async () => {
        try {
          const response = await fetch(`${API}/admin/approve_hwid_reset/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Reset approved", data.success ? "success" : "error")
          if (data.success) loadResets()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: false,
    })
  }

  const denyReset = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject HWID Reset",
      message: "Reject this HWID reset request? The user will not be able to login from a different computer.",
      action: async () => {
        try {
          const response = await fetch(`${API}/admin/deny_hwid_reset/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Reset rejected", data.success ? "success" : "error")
          if (data.success) loadResets()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
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
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-blue-400" />
            HWID Reset Requests
          </h2>
          <Button
            onClick={loadResets}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shadow-md"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden animate-scale-in backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="p-4 text-left font-semibold">ID</th>
                    <th className="p-4 text-left font-semibold">Username</th>
                    <th className="p-4 text-left font-semibold">Previous HWID</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resets.map((reset, index) => (
                    <tr
                      key={reset.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4 text-slate-100 font-semibold">{reset.id}</td>
                      <td className="p-4 text-slate-100 font-medium">{reset.username}</td>
                      <td className="p-4">
                        <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 blur-sm hover:blur-none transition-all cursor-default">
                          {reset.old_hwid || "N/A"}
                        </code>
                      </td>
                      <td className="p-4 space-x-2">
                        <Button
                          onClick={() => approveReset(reset.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => denyReset(reset.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {resets.length === 0 && <p className="text-center text-slate-400 py-12 font-medium">No pending requests</p>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
