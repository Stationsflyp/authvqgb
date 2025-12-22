"use client"

import { useState, useEffect } from "react"
import { Ban, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface BannedItem {
  id: number
  ip: string | null
  hwid: string | null
  reason: string
  date: string
}

interface BannedTabProps {
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

export function BannedTab({ session, showMessage }: BannedTabProps) {
  const [bannedItems, setBannedItems] = useState<BannedItem[]>([])
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
    loadBanned()
  }, [])

  const loadBanned = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/list_banned_ips/${session.owner_id}?secret=${session.secret}`)
      const data = await response.json()
      if (data.banned_ips) {
        setBannedItems(data.banned_ips)
      }
    } catch (error) {
      showMessage("Error loading banned items: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const unbanItem = async (banId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unban Item",
      message: "Are you sure you want to unban this item? It will be allowed again.",
      action: async () => {
        try {
          const response = await fetch(`${API}/client/unban_ip/${banId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Unbanned", data.success ? "success" : "error")
          if (data.success) loadBanned()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: false,
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
            <Ban className="h-8 w-8 text-red-400" />
            Banned Hardware & IPs
          </h2>
          <Button
            onClick={loadBanned}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white shadow-md"
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
                  <tr className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <th className="p-4 text-left font-semibold">ID</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Value</th>
                    <th className="p-4 text-left font-semibold">Reason</th>
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bannedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4 text-slate-100 font-semibold">{item.id}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.hwid
                              ? "bg-purple-900/50 text-purple-400 border border-purple-500/30"
                              : "bg-orange-900/50 text-orange-400 border border-orange-500/30"
                          }`}
                        >
                          {item.hwid ? "HWID" : "IP"}
                        </span>
                      </td>
                      <td className="p-4">
                        <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 blur-sm hover:blur-none transition-all cursor-default">
                          {item.hwid || item.ip}
                        </code>
                      </td>
                      <td className="p-4 text-slate-300">{item.reason}</td>
                      <td className="p-4 text-slate-400 text-sm">{new Date(item.date).toLocaleString("en-US")}</td>
                      <td className="p-4">
                        <Button
                          onClick={() => unbanItem(item.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto shadow-sm flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Unban
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bannedItems.length === 0 && (
                <p className="text-center text-slate-400 py-12 font-medium">No banned items</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
