"use client"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CredentialsTabProps {
  session: {
    owner_id: string
    app_name: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

export function CredentialsTab({ session, showMessage }: CredentialsTabProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    if (!text || text === "-") {
      showMessage("No data to copy", "error")
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showMessage(`${label} copied to clipboard!`, "success")
        setCopiedField(label)
        setTimeout(() => setCopiedField(null), 2000)
      })
      .catch(() => {
        showMessage("Failed to copy", "error")
      })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        My Credentials
      </h2>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm animate-scale-in">
        <div className="grid grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block mb-2 font-bold text-sm text-blue-400 uppercase tracking-wider">Username</label>
            <div className="flex gap-3 items-center">
              <code className="flex-1 p-3 bg-slate-950/70 border border-slate-700/50 rounded-lg text-slate-200 text-sm font-mono">
                Admin
              </code>
              <Button
                onClick={() => copyToClipboard("Admin", "Username")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shrink-0"
                size="sm"
              >
                {copiedField === "Username" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* App Name */}
          <div>
            <label className="block mb-2 font-bold text-sm text-blue-400 uppercase tracking-wider">App Name</label>
            <div className="flex gap-3 items-center">
              <code className="flex-1 p-3 bg-slate-950/70 border border-slate-700/50 rounded-lg text-slate-200 text-sm font-mono break-all">
                {session.app_name}
              </code>
              <Button
                onClick={() => copyToClipboard(session.app_name, "App Name")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shrink-0"
                size="sm"
              >
                {copiedField === "App Name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Owner ID */}
          <div className="col-span-2">
            <label className="block mb-2 font-bold text-sm text-green-400 uppercase tracking-wider">Owner ID</label>
            <div className="flex gap-3 items-center">
              <code className="flex-1 p-3 bg-slate-950/70 border border-slate-700/50 rounded-lg text-slate-200 text-sm font-mono break-all">
                {session.owner_id}
              </code>
              <Button
                onClick={() => copyToClipboard(session.owner_id, "Owner ID")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white shrink-0"
                size="sm"
              >
                {copiedField === "Owner ID" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Secret */}
          <div className="col-span-2">
            <label className="block mb-2 font-bold text-sm text-red-400 uppercase tracking-wider">Secret</label>
            <div className="flex gap-3 items-center">
              <code className="flex-1 p-3 bg-slate-950/70 border border-slate-700/50 rounded-lg text-slate-200 text-sm font-mono break-all">
                {session.secret}
              </code>
              <Button
                onClick={() => copyToClipboard(session.secret, "Secret")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 text-white shrink-0"
                size="sm"
              >
                {copiedField === "Secret" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-blue-300 text-sm leading-relaxed">
          <strong className="text-blue-200">Security Note:</strong> Keep your credentials safe. The secret key is used
          to authenticate API requests.
        </p>
      </div>
    </div>
  )
}
