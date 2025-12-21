import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log("[v0] Deleting user:", params.id)

  return NextResponse.json({
    success: true,
    message: "User deleted successfully",
  })
}
