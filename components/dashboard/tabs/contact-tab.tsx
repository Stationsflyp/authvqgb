"use client"

import { MessageCircle, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ContactTabProps {
  session: { owner_id: string; app_name: string; secret: string }
  showMessage: (text: string, type: "success" | "error") => void
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function ContactTab({ session, showMessage }: ContactTabProps) {
  const [copied, setCopied] = useState(false)
  const discordId = "998836610516914236"

  const copyDiscordId = async () => {
    try {
      await navigator.clipboard.writeText(discordId)
      setCopied(true)
      showMessage("Discord ID copied to clipboard!", "success")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showMessage("Failed to copy Discord ID", "error")
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Support</h2>
          <p className="text-slate-400">Get in touch with our development team</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Discord Contact Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-slide-up backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#5865F2] rounded-2xl shadow-lg">
              <DiscordIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Discord Support</h3>
              <p className="text-slate-400 text-sm">Direct message for assistance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Discord User ID</label>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-slate-900 text-blue-400 px-4 py-3 rounded-lg font-mono text-lg border border-slate-700/50">
                  {discordId}
                </code>
                <Button
                  onClick={copyDiscordId}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy ID
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-green-400">●</span>
                How to Contact
              </h4>
              <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                <li>Copy the Discord User ID above</li>
                <li>Open Discord and click "Add Friend"</li>
                <li>Paste the User ID and send a friend request</li>
                <li>Once accepted, send your message with your issue</li>
              </ol>
            </div>

            <div className="bg-blue-950/30 border border-blue-700/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-blue-300 text-sm font-medium flex items-start gap-2">
                <span className="text-blue-400 text-lg">ℹ</span>
                <span>
                  Please include your <strong>App Name</strong> ({session.app_name}) when contacting support for faster
                  assistance.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Join Discord Server */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-slide-up backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg">
              <DiscordIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Join Our Community</h3>
              <p className="text-slate-400 text-sm">Connect with other developers</p>
            </div>
          </div>

          <a href="https://discord.gg/AjW3GRksXX" target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg text-lg py-6 transition-all hover:scale-105">
              <DiscordIcon className="h-5 w-5 mr-3" />
              Join Discord Server
            </Button>
          </a>

          <div className="mt-4 bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-2">Community Benefits</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Get help from other developers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Share your projects and feedback
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Stay updated with latest features
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Access exclusive resources and tutorials
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
