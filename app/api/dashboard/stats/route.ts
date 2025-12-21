import { NextResponse } from "next/server"

export async function GET() {
  const stats = {
    totalUsers: 1247,
    activeLicenses: 892,
    activeNow: 45,
    pendingResets: 3,
  }

  return NextResponse.json({ stats })
}
