import { NextResponse } from "next/server"

export async function GET() {
  const licenses = [
    {
      id: 1,
      key: "AGRD-1A2B-3C4D-5E6F",
      hwid: "A1B2C3D4E5",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      key: "AGRD-7G8H-9I0J-1K2L",
      hwid: null,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
  ]

  return NextResponse.json({ licenses })
}
