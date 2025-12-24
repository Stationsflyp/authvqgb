"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CreateUserTabProps {
  session: {
    owner_id: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

export function CreateUserTab({ session, showMessage }: CreateUserTabProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/createusers")
    }, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-96">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <UserPlus className="h-16 w-16 text-green-400 animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Redirecting to Create Users
        </h2>
        <p className="text-slate-400 max-w-md">
          You're being taken to the dedicated Create Users page where you can easily manage user creation with shared access options.
        </p>
        <Button
          onClick={() => router.push("/dashboard/createusers")}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white shadow-lg mt-4"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Go to Create Users
        </Button>
      </div>
    </div>
  )
}
