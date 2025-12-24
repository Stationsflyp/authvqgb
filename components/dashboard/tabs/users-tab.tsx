"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, UsersIcon, X, AlertTriangle, PauseCircle, Monitor } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { ScreenViewer } from "@/components/dashboard/screen-viewer"

interface User {
  id: number
  username: string
  hwid: string | null
  ip: string | null
  last_login: string | null
  no_hwid_check: number
}

interface UsersTabProps {
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

interface PasswordDialog {
  isOpen: boolean
  userId: number | null
  username: string
  newPassword: string
}

interface ScreenViewerState {
  isOpen: boolean
  userId: number | null
  username: string
}

interface CreateUserDialog {
  isOpen: boolean
  username: string
  password: string
  noHwidCheck: boolean
  loading: boolean
}

export function UsersTab({ session, showMessage }: UsersTabProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDangerous: false,
  })
  const [passwordDialog, setPasswordDialog] = useState<PasswordDialog>({
    isOpen: false,
    userId: null,
    username: "",
    newPassword: "",
  })
  const [screenViewer, setScreenViewer] = useState<ScreenViewerState>({
    isOpen: false,
    userId: null,
    username: "",
  })
  const [createUserDialog, setCreateUserDialog] = useState<CreateUserDialog>({
    isOpen: false,
    username: "",
    password: "",
    noHwidCheck: false,
    loading: false,
  })
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    loadUsers()
  }, [session.owner_id, session.secret])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/client/users/${session.owner_id}?secret=${session.secret}`)
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      showMessage("Error loading users: " + error, "error")
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      action: async () => {
        try {
          const response = await fetch(`${API}/client/delete_user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "User deleted", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const editUserPass = async (userId: number, username: string) => {
    setPasswordDialog({
      isOpen: true,
      userId: userId,
      username: username,
      newPassword: "",
    })
  }

  const handlePasswordChange = async () => {
    if (!passwordDialog.newPassword) return
    if (passwordDialog.newPassword.length < 8) {
      showMessage("Password: minimum 8 characters", "error")
      return
    }
    try {
      const response = await fetch(`${API}/client/update_user/${passwordDialog.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          password: passwordDialog.newPassword,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "Password updated", data.success ? "success" : "error")
      setPasswordDialog({
        isOpen: false,
        userId: null,
        username: "",
        newPassword: "",
      })
    } catch (error) {
      showMessage("Error: " + error, "error")
    }
  }

  const blockUserSession = async (userId: number, username: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Force Logout",
      message: `Kill session for ${username}? They will be forced to logout and cannot login again until administrator approval.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/block_user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "Kill session sent", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const viewUserScreen = (userId: number, username: string) => {
    setScreenViewer({
      isOpen: true,
      userId: userId,
      username: username,
    })
  }

  const banUserHWID = async (hwid: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Ban Hardware",
      message: `Ban HWID: ${hwid}? This hardware will be permanently blocked.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/ban_hwid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
              hwid: hwid,
              reason: "Banned from user",
            }),
          })
          const data = await response.json()
          showMessage(data.message || "HWID banned", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const banUserIP = async (ip: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Ban IP Address",
      message: `Ban IP: ${ip}? All users from this IP will be blocked.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/ban_ip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
              ip: ip,
              reason: "Banned from user",
            }),
          })
          const data = await response.json()
          showMessage(data.message || "IP banned", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const deleteAllUsers = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Users",
      message: `Are you sure you want to delete ALL ${users.length} users? This action cannot be undone.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/delete_all_users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "All users deleted", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const pauseAllUsers = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Pause All Users",
      message: `Pause ALL ${users.length} users? They will be forced to logout.`,
      action: async () => {
        try {
          const response = await fetch(`${API}/client/pause_all_users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              owner_id: session.owner_id,
              secret: session.secret,
            }),
          })
          const data = await response.json()
          showMessage(data.message || "All users paused", data.success ? "success" : "error")
          if (data.success) loadUsers()
        } catch (error) {
          showMessage("Error: " + error, "error")
        }
      },
      isDangerous: true,
    })
  }

  const handleCreateUser = async () => {
    if (!createUserDialog.username || !createUserDialog.password) {
      showMessage("Username and password required", "error")
      return
    }
    if (createUserDialog.password.length < 8) {
      showMessage("Password must be at least 8 characters", "error")
      return
    }

    setCreateUserDialog({ ...createUserDialog, loading: true })
    try {
      const response = await fetch(`${API}/client/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: session.owner_id,
          secret: session.secret,
          username: createUserDialog.username,
          password: createUserDialog.password,
          no_hwid_check: createUserDialog.noHwidCheck ? 1 : 0,
        }),
      })
      const data = await response.json()
      showMessage(data.message || "User created", data.success ? "success" : "error")
      if (data.success) {
        setCreateUserDialog({
          isOpen: false,
          username: "",
          password: "",
          noHwidCheck: false,
          loading: false,
        })
        loadUsers()
      }
    } catch (error) {
      showMessage("Error: " + error, "error")
    } finally {
      setCreateUserDialog({ ...createUserDialog, loading: false })
    }
  }

  return (
    <>
      <ScreenViewer
        isOpen={screenViewer.isOpen}
        onClose={() =>
          setScreenViewer({
            isOpen: false,
            userId: null,
            username: "",
          })
        }
        userId={screenViewer.userId || ""}
        username={screenViewer.username}
      />

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

      {passwordDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6 w-96 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button
                onClick={() =>
                  setPasswordDialog({
                    isOpen: false,
                    userId: null,
                    username: "",
                    newPassword: "",
                  })
                }
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  User: <span className="text-blue-400 font-semibold">{passwordDialog.username}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordDialog.newPassword}
                  onChange={(e) =>
                    setPasswordDialog({
                      ...passwordDialog,
                      newPassword: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePasswordChange()
                  }}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1">
                  {passwordDialog.newPassword.length > 0 ? (
                    <span className={passwordDialog.newPassword.length >= 8 ? "text-green-400" : "text-red-400"}>
                      {passwordDialog.newPassword.length} characters
                    </span>
                  ) : (
                    "Type new password..."
                  )}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordDialog.newPassword.length < 8}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Change Password
                </button>
                <button
                  onClick={() =>
                    setPasswordDialog({
                      isOpen: false,
                      userId: null,
                      username: "",
                      newPassword: "",
                    })
                  }
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {createUserDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6 w-96 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Create New User</h3>
              <button
                onClick={() =>
                  setCreateUserDialog({
                    isOpen: false,
                    username: "",
                    password: "",
                    noHwidCheck: false,
                    loading: false,
                  })
                }
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  value={createUserDialog.username}
                  onChange={(e) =>
                    setCreateUserDialog({
                      ...createUserDialog,
                      username: e.target.value,
                    })
                  }
                  placeholder="Enter username"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={createUserDialog.password}
                  onChange={(e) =>
                    setCreateUserDialog({
                      ...createUserDialog,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {createUserDialog.password.length > 0 ? (
                    <span className={createUserDialog.password.length >= 8 ? "text-green-400" : "text-red-400"}>
                      {createUserDialog.password.length} characters
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
                  checked={createUserDialog.noHwidCheck}
                  onChange={(e) =>
                    setCreateUserDialog({
                      ...createUserDialog,
                      noHwidCheck: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-slate-600 accent-blue-500"
                />
                <label htmlFor="noHwidCheck" className="text-sm text-slate-300 cursor-pointer flex-1">
                  <div className="font-medium">Allow Shared Access</div>
                  <div className="text-xs text-slate-400">Disable HWID/IP checking - multiple people can use this account</div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateUser}
                  disabled={createUserDialog.loading || createUserDialog.password.length < 8}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {createUserDialog.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </button>
                <button
                  onClick={() =>
                    setCreateUserDialog({
                      isOpen: false,
                      username: "",
                      password: "",
                      noHwidCheck: false,
                      loading: false,
                    })
                  }
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-blue-400" />
            Users Management
          </h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                setCreateUserDialog({
                  isOpen: true,
                  username: "",
                  password: "",
                  noHwidCheck: false,
                  loading: false,
                })
              }
              className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white shadow-md"
            >
              Create User
            </Button>
            <Button
              onClick={loadUsers}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
            {users.length > 0 && (
              <>
                <Button
                  onClick={pauseAllUsers}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:opacity-90 text-white shadow-md"
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pause All
                </Button>
                <Button
                  onClick={deleteAllUsers}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 text-white shadow-md"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </>
            )}
          </div>
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
                    <th className="p-4 text-left font-semibold">HWID</th>
                    <th className="p-4 text-left font-semibold">IP</th>
                    <th className="p-4 text-left font-semibold">Last Login</th>
                    <th className="p-4 text-left font-semibold">Shared Access</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-smooth animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4 text-slate-100 font-semibold">{user.id}</td>
                      <td className="p-4 text-slate-100 font-medium">{user.username}</td>
                      <td className="p-4">
                        <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 blur-sm hover:blur-none transition-all cursor-default">
                          {user.hwid || "N/A"}
                        </code>
                      </td>
                      <td className="p-4">
                        <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 blur-sm hover:blur-none transition-all cursor-default">
                          {user.ip || "N/A"}
                        </code>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {user.last_login ? new Date(user.last_login).toLocaleString("en-US") : "Never"}
                      </td>
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
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-semibold border border-green-500/30">
                          ● Active
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <Button
                          onClick={() => viewUserScreen(user.id, user.username)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 h-auto shadow-sm flex items-center gap-1"
                        >
                          <Monitor className="h-3 w-3" />
                          Screen
                        </Button>
                        <Button
                          onClick={() => editUserPass(user.id, user.username)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          Pass
                        </Button>
                        <Button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          Del
                        </Button>
                        <Button
                          onClick={() => blockUserSession(user.id, user.username)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                        >
                          Kill
                        </Button>
                        {user.hwid && (
                          <Button
                            onClick={() => banUserHWID(user.hwid!)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                          >
                            Ban HW
                          </Button>
                        )}
                        {user.ip && (
                          <Button
                            onClick={() => banUserIP(user.ip!)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto shadow-sm"
                          >
                            Ban IP
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-slate-400 py-12 font-medium">No users found</p>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
