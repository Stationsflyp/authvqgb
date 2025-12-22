"use client"

import { Instagram } from "lucide-react"
import { type Language, useTranslation } from "@/lib/i18n"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

interface FooterProps {
  lang: Language
}

export function Footer({ lang }: FooterProps) {
  const { t } = useTranslation(lang)

  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm mt-auto hover:bg-slate-950/90 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up">
          <div className="flex flex-col items-center md:items-start gap-3 group">
            <div className="flex items-center gap-3 hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                A
              </div>
              <div className="group-hover:text-white transition-colors duration-300">
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium group-hover:text-slate-400 transition-colors duration-300">Developed by</div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Oxcy 6666
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/stories/lunita66666/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/40 shadow-lg font-medium group"
            >
              <Instagram className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm">{t("footer.instagram")}</span>
            </a>

            <a
              href="https://discord.gg/AjW3GRksXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg font-medium group"
            >
              <DiscordIcon className="h-4 w-4 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="text-sm">{t("footer.discord")}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
