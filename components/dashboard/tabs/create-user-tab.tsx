"use client"

import { useState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  const [noHwidCheck, setNoHwidCheck] = useState(false)
  const [loading, setLoading] = useState(false)

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      showMessage("Username and password required", "error")
      return
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters", "error")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API}/client/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          username,
          password,
          no_hwid_check: noHwidCheck ? 1 : 0,
        }),
      })
      const data = await response.json()

      if (data.success) {
        showMessage("User created successfully", "success")
        setUsername("")
        setPassword("")
        setNoHwidCheck(false)
      } else {
        showMessage(data.message || "Error creating user", "error")
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
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
        <form onSubmit={handleCreateUser} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              {password.length > 0 ? (
                <span className={password.length >= 8 ? "text-green-400" : "text-red-400"}>
                  {password.length} characters
                </span>
              ) : (
                "Type password..."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <input
              type="checkbox"
              id="noHwidCheck"
              checked={noHwidCheck}
              onChange={(e) => setNoHwidCheck(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 accent-green-500"
            />
            <label htmlFor="noHwidCheck" className="text-sm text-slate-300 cursor-pointer flex-1">
              <div className="font-medium">Allow Shared Access</div>
              <div className="text-xs text-slate-400">Disable HWID/IP checking - multiple people can use this account</div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 8}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  )
}
