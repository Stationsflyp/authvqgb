import { NextResponse } from "next/server"

export async function GET() {
  const users = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      hwid: "A1B2C3D4E5",
      ip: "192.168.1.100",
      lastLogin: new Date().toISOString(),
      status: "active" as const,
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      hwid: "F6G7H8I9J0",
      ip: "192.168.1.101",
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      status: "active" as const,
    },
  ]

  return NextResponse.json({ users })
}
