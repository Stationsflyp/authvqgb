"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Key, Activity, AlertCircle } from "lucide-react"
import { StatsChart } from "./stats-chart"
import { RecentActivity } from "./recent-activity"

interface Stats {
  totalUsers: number
  activeLicenses: number
  activeNow: number
  pendingResets: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeLicenses: 0,
    activeNow: 0,
    pendingResets: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error("[v0] Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      color: "text-primary",
    },
    {
      title: "Active Licenses",
      value: stats.activeLicenses,
      icon: Key,
      description: "Valid licenses",
      color: "text-accent",
    },
    {
      title: "Active Now",
      value: stats.activeNow,
      icon: Activity,
      description: "Currently online",
      color: "text-chart-3",
    },
    {
      title: "Pending Resets",
      value: stats.pendingResets,
      icon: AlertCircle,
      description: "HWID reset requests",
      color: "text-destructive",
    },
  ]

  return (
    <div className="space-y-8 animate-scale-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Monitor your authentication system and user activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
