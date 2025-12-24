"use client"

import { useState } from "react"
import { UserPlus, Loader2, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateUserTabProps {
  session: {
    owner_id: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

export function CreateUserTab({ session, showMessage }: CreateUserTabProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showExpirationModal, setShowExpirationModal] = useState(false)
  const [days, setDays] = useState<number>(30)
  const [isLifetime, setIsLifetime] = useState(false)
  const [noHwidCheck, setNoHwidCheck] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  const handleCreateUserClick = async () => {
    if (!username.trim() || !password.trim()) {
      showMessage("Please fill all fields", "error")
      return
    }

    if (username.length < 3) {
      showMessage("Username must be at least 3 characters", "error")
      return
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters", "error")
      return
    }

    setShowExpirationModal(true)
  }

  const handleConfirmCreate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          owner_id: session.owner_id,
          secret: session.secret,
          days: isLifetime ? 36500 : days,
          is_lifetime: isLifetime,
          no_hwid_check: noHwidCheck ? 1 : 0,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "User created successfully", data.success ? "success" : "error")
      if (data.success) {
        setUsername("")
        setPassword("")
        setDays(30)
        setIsLifetime(false)
        setNoHwidCheck(false)
        setShowExpirationModal(false)
      }
    } catch (error) {
      showMessage("Error creating user: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
        <UserPlus className="h-8 w-8 text-green-400" />
        Create New User
      </h2>

      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 shadow-lg animate-scale-in backdrop-blur-xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <Input
              type="text"
              placeholder="Enter username (minimum 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter password (minimum 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <Button
            onClick={handleCreateUserClick}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white font-semibold py-6 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expiration Modal */}
      {showExpirationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 animate-fade-in pt-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-green-500/30 p-8 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                User Settings
              </h2>
              <p className="text-slate-400 text-sm">Configure user expiration and access options</p>
            </div>

            <div className="space-y-5">
              {/* Duration Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Expiration (days)
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
                <p className="text-xs text-slate-500 mt-1.5">Set how many days this user account will remain valid (1-365 days)</p>
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
                      ✨ Lifetime Access
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">No expiration - account remains active indefinitely</p>
                  </div>
                </div>
              </div>

              {/* Allow Shared Access Checkbox */}
              <div 
                onClick={() => setNoHwidCheck(!noHwidCheck)}
                className={`group rounded-lg p-4 border-2 transition-all cursor-pointer ${
                noHwidCheck
                  ? "bg-purple-900/30 border-purple-500 shadow-lg shadow-purple-500/20"
                  : "bg-slate-700/20 border-slate-600/50 hover:border-purple-500/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    noHwidCheck
                      ? "bg-purple-500 border-purple-400"
                      : "border-slate-500 hover:border-purple-500"
                  }`}>
                    {noHwidCheck && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold transition-colors ${noHwidCheck ? "text-purple-400" : "text-slate-300"}`}>
                      🔓 Shared Access
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow multiple users to use this account from different devices</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-slate-700/50">
                <Button
                  onClick={() => {
                    setShowExpirationModal(false)
                    setDays(30)
                    setIsLifetime(false)
                    setNoHwidCheck(false)
                  }}
                  disabled={loading}
                  className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg transition-all font-medium text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmCreate}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
