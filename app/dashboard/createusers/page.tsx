"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  hwid: string | null
  ip: string | null
  last_login: string | null
  no_hwid_check: number
}

interface Session {
  owner_id: string
  secret: string
}

export default function CreateUsersPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [noHwidCheck, setNoHwidCheck] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const API = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

  useEffect(() => {
    const sessionStr = localStorage.getItem("session")
    if (!sessionStr) {
      router.push("/auth/login")
      return
    }

    const sess = JSON.parse(sessionStr)
    setSession(sess)
    loadUsers(sess)
  }, [router])

  const loadUsers = async (sess: Session) => {
    setLoadingUsers(true)
    try {
      const response = await fetch(`${API}/client/users/${sess.owner_id}?secret=${sess.secret}`)
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      showMessage("Error loading users", "error")
    } finally {
      setLoadingUsers(false)
    }
  }

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) return

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
        loadUsers(session)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <Plus className="h-10 w-10 text-green-400" />
              Create Users
            </h1>
            <p className="text-slate-400">Add new users to your application</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateUser} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg p-6 backdrop-blur-xl space-y-4 animate-scale-in">
              <h2 className="text-2xl font-bold text-white">New User</h2>

              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-900/50 text-green-300 border border-green-500/30" : "bg-red-900/50 text-red-300 border border-red-500/30"}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {loading ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden backdrop-blur-xl animate-scale-in">
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-400" />
                  Your Users
                </h2>
                <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold border border-blue-500/30">
                  {users.length} users
                </span>
              </div>

              <div className="overflow-x-auto">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-slate-400">No users created yet. Create your first user to get started!</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <th className="p-4 text-left font-semibold">Username</th>
                        <th className="p-4 text-left font-semibold">Shared Access</th>
                        <th className="p-4 text-left font-semibold">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                          <td className="p-4 text-slate-100 font-medium">{user.username}</td>
                          <td className="p-4">
                            {user.no_hwid_check === 1 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-900/50 text-purple-300 text-xs font-semibold border border-purple-500/30">
                                ✓ Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs font-semibold border border-slate-600/30">
                                ✗ Disabled
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-400 text-sm">
                            {user.last_login ? new Date(user.last_login).toLocaleString("en-US") : "Never"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
