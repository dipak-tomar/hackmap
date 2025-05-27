import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { withRetry } from "@/lib/db-utils"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists with retry logic
    const existingUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email },
      })
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
    })

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    // Provide more specific error messages
    if (error.code === 'P2024') {
      return NextResponse.json({ 
        error: "Database connection timeout. Please try again." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
