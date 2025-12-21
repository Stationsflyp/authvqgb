import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username && password) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: 1,
          username,
          email: `${username}@example.com`,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      { status: 500 },
    )
  }
}
