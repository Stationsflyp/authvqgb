"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  Key,
  Users,
  Skull,
  UserPlus,
  Ban,
  RotateCcw,
  Package,
  LogOut,
  RefreshCw,
  Download,
  BookOpen,
  CreditCard,
  Globe,
  MessageCircle,
  Crown,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import { CredentialsTab } from "./tabs/credentials-tab"
import { UsersTab } from "./tabs/users-tab"
import { KillSessionTab } from "./tabs/kill-session-tab"
import { CreateUserTab } from "./tabs/create-user-tab"
import { BannedTab } from "./tabs/banned-tab"
import { HWIDResetsTab } from "./tabs/hwid-resets-tab"
import { VersionTab } from "./tabs/version-tab"
import { InstallationTab } from "./tabs/installation-tab"
import { DocsTab } from "./tabs/docs-tab"
import { LicensesTab } from "./tabs/licenses-tab"
import { ContactTab } from "./tabs/contact-tab"
import { Chat } from "./chat"
import { PremiumLayout } from "./premium-layout"

interface DashboardLayoutProps {
  session: {
    owner_id: string
    app_name: string
    secret: string
    avatar?: string
    email?: string
    subscription_tier?: string
    subscription_status?: string
  }
}

type TabType =
  | "credentials"
  | "users"
  | "kill"
  | "create"
  | "banned"
  | "hwid_resets"
  | "version"
  | "installation"
  | "docs"
  | "licenses"
  | "contact"
  | "chat"
  | "premium"

export function DashboardLayout({ session }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>("credentials")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("dashSession")
    router.push("/auth/login")
  }

  const blurredEmail = session.email 
    ? session.email.split("").map((char, idx) => {
        const emailLength = session.email.length
        const showStart = Math.ceil(emailLength * 0.2)
        const showEnd = Math.ceil(emailLength * 0.8)
        return idx < showStart || idx >= showEnd ? "•" : char
      }).join("")
    : "••••••••••"

  const tabs = [
    {
      id: "premium" as TabType,
      label: "💰 Premium",
      icon: Crown,
      color: "from-yellow-600 to-yellow-800",
    },
    {
      id: "chat" as TabType,
      label: "💬 Chat",
      icon: MessageCircle,
      color: "from-cyan-600 to-cyan-800",
    },
    {
      id: "credentials" as TabType,
      label: t("dashboard.myCredentials"),
      icon: Key,
      color: "from-blue-600 to-blue-800",
    },
    { id: "docs" as TabType, label: t("dashboard.documentation"), icon: BookOpen, color: "from-blue-500 to-blue-700" },
    {
      id: "installation" as TabType,
      label: t("dashboard.installation"),
      icon: Download,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "licenses" as TabType,
      label: t("dashboard.licenses"),
      icon: CreditCard,
      color: "from-green-600 to-green-800",
    },
    { id: "users" as TabType, label: t("dashboard.users"), icon: Users, color: "from-blue-500 to-blue-700" },
    { id: "kill" as TabType, label: t("dashboard.killSession"), icon: Skull, color: "from-red-600 to-red-800" },
    { id: "create" as TabType, label: t("dashboard.createUser"), icon: UserPlus, color: "from-green-600 to-green-800" },
    { id: "banned" as TabType, label: t("dashboard.banned"), icon: Ban, color: "from-red-500 to-red-700" },
    {
      id: "hwid_resets" as TabType,
      label: t("dashboard.hwidResets"),
      icon: RotateCcw,
      color: "from-blue-400 to-blue-600",
    },
    { id: "version" as TabType, label: t("dashboard.version"), icon: Package, color: "from-green-500 to-green-700" },
    {
      id: "contact" as TabType,
      label: t("dashboard.contact"),
      icon: MessageCircle,
      color: "from-blue-600 to-blue-800",
    },
  ]

  const languages = [
    { code: "en", name: "EN" },
    { code: "es", name: "ES" },
    { code: "ru", name: "RU" },
    { code: "hi", name: "HI" },
    { code: "ar", name: "AR" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950">
      {/* Animated background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-800/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl animate-pulse border border-blue-500/30"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col shadow-2xl z-50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50 animate-slide-right">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Shield className="h-10 w-10 text-blue-500 animate-pulse-glow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              AuthGuard
            </span>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 shadow-lg animate-scale-in border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              {session.avatar ? (
                <img 
                  src={session.avatar} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border border-blue-400/30 shadow-md object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-400 shadow-md border border-blue-500/30">
                  {session.app_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{session.app_name}</div>
                <div className="text-xs text-slate-300 truncate font-mono select-none">{blurredEmail}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-400/20">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white font-medium">System Active</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth group animate-slide-left ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:scale-102"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`p-2 rounded-lg ${activeTab === tab.id ? "bg-white/10" : "bg-slate-800 group-hover:bg-slate-700"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2 animate-slide-up">
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("dashboard.refresh")}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-2 border-red-600/50 text-red-400 hover:bg-red-950/50 hover:border-red-600/70 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("dashboard.logout")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-72 min-h-screen">
        {/* Top Bar */}
        <div className="h-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-8 sticky top-0 z-40 shadow-xl animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {tabs.find((t) => t.id === activeTab)?.label} Panel
              </h1>
              <span className="px-2 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 text-xs font-bold rounded-full shadow-md border border-amber-500/30 uppercase tracking-wider">
                Beta
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700/50">
              <Globe className="h-4 w-4 text-slate-400 ml-2" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold transition-smooth ${
                    language === lang.code
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full text-sm font-semibold shadow-md animate-pulse-glow border border-green-500/30">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 animate-slide-right shadow-lg ${
                message.type === "success"
                  ? "bg-green-950/50 text-green-300 border-green-500 backdrop-blur-sm"
                  : "bg-red-950/50 text-red-300 border-red-500 backdrop-blur-sm"
              }`}
            >
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "premium" ? (
            <PremiumLayout session={session} language={language} onBack={() => setActiveTab("credentials")} />
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-scale-in">
              {activeTab === "chat" && <Chat username={session.app_name || "Usuario"} avatar_url={session.avatar || ""} email={session.email || ""} />}
              {activeTab === "credentials" && <CredentialsTab session={session} showMessage={showMessage} />}
              {activeTab === "docs" && <DocsTab session={session} showMessage={showMessage} />}
              {activeTab === "installation" && <InstallationTab session={session} showMessage={showMessage} />}
              {activeTab === "licenses" && <LicensesTab session={session} showMessage={showMessage} />}
              {activeTab === "users" && <UsersTab session={session} showMessage={showMessage} />}
              {activeTab === "kill" && <KillSessionTab session={session} showMessage={showMessage} />}
              {activeTab === "create" && <CreateUserTab session={session} showMessage={showMessage} />}
              {activeTab === "banned" && <BannedTab session={session} showMessage={showMessage} />}
              {activeTab === "hwid_resets" && <HWIDResetsTab session={session} showMessage={showMessage} />}
              {activeTab === "version" && <VersionTab session={session} showMessage={showMessage} />}
              {activeTab === "contact" && <ContactTab session={session} showMessage={showMessage} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
