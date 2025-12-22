"use client"

import { useState } from "react"
import { Shield, RefreshCw, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { Footer } from "@/components/footer"
import { CredentialsTab } from "./tabs/credentials-tab"
import { UsersTab } from "./tabs/users-tab"
import { KillSessionTab } from "./tabs/kill-session-tab"
import { CreateUserTab } from "./tabs/create-user-tab"
import { BannedTab } from "./tabs/banned-tab"
import { HWIDResetsTab } from "./tabs/hwid-resets-tab"
import { VersionTab } from "./tabs/version-tab"
import { Chat } from "./chat"
import type { SessionData } from "@/lib/api-client"
import { type Language, useTranslation } from "@/lib/i18n"

interface DashboardTabsProps {
  session: SessionData
  onLogout: () => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function DashboardTabs({ session, onLogout, language, onLanguageChange }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("credentials")
  const { t } = useTranslation(language)

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <div className="bg-[#1a1a1a] border-b-2 border-[#667eea] p-5 mb-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#667eea]" />
            <h1 className="text-xl font-bold text-[#667eea] animate-glow">
              {session.app_name} - {t("dashboard.title")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector currentLang={language} onLanguageChange={onLanguageChange} />
            <Button onClick={handleRefresh} className="bg-[#667eea] hover:bg-[#5568d3]">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("dashboard.refresh")}
            </Button>
            <Button onClick={onLogout} className="bg-[#c33] hover:bg-[#a22]">
              <LogOut className="h-4 w-4 mr-2" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b-2 border-[#333] mb-6 w-full justify-start flex-wrap h-auto p-0 gap-2">
            <TabsTrigger
              value="credentials"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              🔑 {t("dashboard.myCredentials")}
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              👥 {t("dashboard.users")}
            </TabsTrigger>
            <TabsTrigger
              value="kill"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              ⚔️ {t("dashboard.killSession")}
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              ➕ {t("dashboard.createUser")}
            </TabsTrigger>
            <TabsTrigger
              value="banned"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              🚫 {t("dashboard.banned")}
            </TabsTrigger>
            <TabsTrigger
              value="hwid"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              ⚙️ {t("dashboard.hwidResets")}
            </TabsTrigger>
            <TabsTrigger
              value="version"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              📦 {t("dashboard.version")}
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-[#667eea] data-[state=inactive]:bg-[#1a1a1a] rounded-t-lg rounded-b-none"
            >
              💬 Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="mt-0">
            <CredentialsTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <UsersTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="kill" className="mt-0">
            <KillSessionTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="create" className="mt-0">
            <CreateUserTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="banned" className="mt-0">
            <BannedTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="hwid" className="mt-0">
            <HWIDResetsTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="version" className="mt-0">
            <VersionTab session={session} language={language} />
          </TabsContent>
          <TabsContent value="chat" className="mt-0 h-[500px]">
            <Chat 
              username={session.app_name} 
              avatar_url={session.avatar}
              email={session.email}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Footer lang={language} />
    </div>
  )
}
