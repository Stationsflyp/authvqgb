import { NextResponse } from "next/server"

export async function GET() {
  const data = [
    { date: "Mon", users: 120 },
    { date: "Tue", users: 145 },
    { date: "Wed", users: 167 },
    { date: "Thu", users: 158 },
    { date: "Fri", users: 189 },
    { date: "Sat", users: 201 },
    { date: "Sun", users: 178 },
  ]

  return NextResponse.json({ data })
}
