import { NextResponse } from "next/server"

export async function GET() {
  const activities = [
    { id: 1, type: "login", user: "john_doe", timestamp: "2m ago" },
    { id: 2, type: "license", user: "admin", timestamp: "15m ago" },
    { id: 3, type: "register", user: "jane_smith", timestamp: "1h ago" },
    { id: 4, type: "logout", user: "mike_wilson", timestamp: "2h ago" },
    { id: 5, type: "login", user: "sarah_jones", timestamp: "3h ago" },
  ]

  return NextResponse.json({ activities })
}
