"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogIn, LogOut, Key, UserPlus } from "lucide-react"

interface Activity {
  id: number
  type: "login" | "logout" | "license" | "register"
  user: string
  timestamp: string
}

const activityIcons = {
  login: LogIn,
  logout: LogOut,
  license: Key,
  register: UserPlus,
}

const activityLabels = {
  login: "Signed in",
  logout: "Signed out",
  license: "Generated license",
  register: "Registered",
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/dashboard/recent-activity")
        const data = await response.json()
        setActivities(data.activities)
      } catch (error) {
        console.error("[v0] Failed to fetch activities:", error)
      }
    }

    fetchActivities()
  }, [])

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type]
        return (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9 bg-secondary">
              <AvatarFallback>
                <Icon className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.user}</p>
              <p className="text-xs text-muted-foreground">{activityLabels[activity.type]}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
          </div>
        )
      })}
    </div>
  )
}
