import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (username && email && password) {
      return NextResponse.json({
        success: true,
        message: "Registration successful",
        user: {
          id: Math.floor(Math.random() * 1000),
          username,
          email,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid registration data",
      },
      { status: 400 },
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
