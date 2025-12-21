"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CreditCard, Plus, Trash2, Copy, Check } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface License {
  id: number
  key: string
  hwid: string | null
  expires: string | null
  status: string
}

interface LicensesTabProps {
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

export function LicensesTab({ session, showMessage }: LicensesTabProps) {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [keyCount, setKeyCount] = useState("1")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [days, setDays] = useState<number>(30)
  const [isLifetime, setIsLifetime] = useState(false)
  const [notes, setNotes] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    loadLicenses()
  }, [])

  const loadLicenses = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/licenses/${session.owner_id}?secret=${session.secret}`)
      const data = await response.json()
      if (data.licenses) {
        setLicenses(data.licenses)
      }
    } catch (error) {
      showMessage("Error loading licenses: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const generateKeys = async () => {
    const count = Number.parseInt(keyCount)
    if (isNaN(count) || count < 1 || count > 100) {
      showMessage("Please enter a number between 1 and 100", "error")
      return
    }

    if (licenses.length + count > 100) {
      showMessage(`Cannot exceed 100 total licenses. Current: ${licenses.length}`, "error")
      return
    }

    setGenerating(true)
    try {
      const newKeys: string[] = []
      for (let i = 0; i < count; i++) {
        const response = await fetch(`${API}/admin/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner_id: session.owner_id,
            secret: session.secret,
            days: isLifetime ? 36500 : days,
            is_lifetime: isLifetime,
            notes: notes,
          }),
        })
        const data = await response.json()
        if (data.success && data.key) {
          newKeys.push(data.key)
        }
      }
      showMessage(`Generated ${newKeys.length} license key(s)`, "success")
      setShowGenerateModal(false)
      setDays(30)
      setIsLifetime(false)
      setNotes("")
      setKeyCount("1")
      loadLicenses()
    } catch (error) {
      showMessage("Error generating keys: " + error, "error")
    } finally {
      setGenerating(false)
    }
  }

  const deleteLicense = async (licenseId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete License",
      message: "Are you sure you want to delete this license? This action cannot be undone.",
      action: async () => {
        try {
          const response = await fetch(`${API}/admin/delete_license/${licenseId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "License deleted", data.success ? "success" : "error")
          if (data.success) loadLicenses()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-green-400" />
          License Management
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">{licenses.length}/100 licenses</span>
          <Button
            onClick={loadLicenses}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shadow-md"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Generate Keys Section */}
      <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl border border-green-500/30 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Generate License Keys
        </h3>
        <div className="flex gap-3">
          <Input
            type="number"
            min="1"
            max="100"
            value={keyCount}
            onChange={(e) => setKeyCount(e.target.value)}
            placeholder="Number of keys (1-100)"
            className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Button
            onClick={() => setShowGenerateModal(true)}
            disabled={generating || licenses.length >= 100}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white shadow-md px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Configure & Generate
          </Button>
        </div>
        <p className="text-slate-400 text-sm mt-3">
          Maximum 100 license keys per application. Current count: {licenses.length}
        </p>
      </div>

      {/* Licenses Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden animate-scale-in backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold">License Key</th>
                  <th className="p-4 text-left font-semibold">HWID</th>
                  <th className="p-4 text-left font-semibold">Expires</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license, index) => (
                  <tr
                    key={license.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4 text-slate-100 font-semibold">{license.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-700/50 px-3 py-1.5 rounded text-green-400 font-mono">
                          {license.key}
                        </code>
                        <button
                          onClick={() => copyKey(license.key)}
                          className="p-1.5 hover:bg-slate-700 rounded transition-smooth"
                        >
                          {copiedKey === license.key ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 blur-sm hover:blur-none transition-all cursor-default">
                        {license.hwid || "Not Activated"}
                      </code>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {license.expires ? new Date(license.expires).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          license.status === "active"
                            ? "bg-green-900/50 text-green-400 border border-green-500/30"
                            : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                        }`}
                      >
                        {license.status === "active" ? "● Active" : "○ Unused"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        onClick={() => deleteLicense(license.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {licenses.length === 0 && (
              <p className="text-center text-slate-400 py-12 font-medium">
                No licenses found. Generate your first license key above.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 animate-fade-in pt-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-green-500/30 p-8 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                Configure License Generation
              </h2>
              <p className="text-slate-400 text-sm">Set expiration and add metadata for {keyCount} {keyCount === "1" ? "license" : "licenses"}</p>
            </div>
            
            <div className="space-y-5">
              {/* Duration Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  disabled={isLifetime}
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white font-semibold focus:outline-none focus:border-green-500/50 focus:bg-slate-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1.5">Choose how long licenses will be valid (1-365 days)</p>
              </div>

              {/* Lifetime Checkbox */}
              <div 
                onClick={() => setIsLifetime(!isLifetime)}
                className={`group rounded-lg p-4 border-2 transition-all cursor-pointer ${
                isLifetime 
                  ? "bg-green-900/30 border-green-500 shadow-lg shadow-green-500/20" 
                  : "bg-slate-700/20 border-slate-600/50 hover:border-green-500/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isLifetime
                      ? "bg-green-500 border-green-400"
                      : "border-slate-500 hover:border-green-500"
                  }`}>
                    {isLifetime && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold transition-colors ${isLifetime ? "text-green-400" : "text-slate-300"}`}>
                      ✨ Lifetime License
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">No expiration - valid forever</p>
                  </div>
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., 'For customer X', 'Premium plan', 'Testing'"
                  className="w-full px-4 py-3 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white text-sm h-24 focus:outline-none focus:border-green-500/50 focus:bg-slate-700/50 transition-all placeholder:text-slate-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-1.5">Add tags or descriptions for license tracking</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-slate-700/50">
                <Button
                  onClick={() => setShowGenerateModal(false)}
                  disabled={generating}
                  className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg transition-all font-medium text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateKeys}
                  disabled={generating}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate {keyCount} {keyCount === "1" ? "License" : "Licenses"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
