import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ClientProtection } from "@/components/client-protection"

export const metadata: Metadata = {
  title: "AuthGuard - Secure Authentication Platform",
  description: "Professional authentication and license management system for modern applications",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#1E293B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ClientProtection />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
