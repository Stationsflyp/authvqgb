import { NextResponse } from "next/server"

function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const segments = 4
  const segmentLength = 4

  let key = "AGRD"
  for (let i = 0; i < segments; i++) {
    key += "-"
    for (let j = 0; j < segmentLength; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return key
}

export async function POST() {
  const key = generateLicenseKey()

  return NextResponse.json({
    success: true,
    key,
    message: "License generated successfully",
  })
}
