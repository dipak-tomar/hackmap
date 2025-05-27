import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        skills: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse skills from JSON string
    const userWithParsedSkills = {
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : [],
    }

    return NextResponse.json(userWithParsedSkills)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name, bio, skills } = data

    // Validate skills array
    if (skills && !Array.isArray(skills)) {
      return NextResponse.json({ error: "Skills must be an array" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        skills: skills ? JSON.stringify(skills) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        skills: true,
        createdAt: true,
      },
    })

    // Parse skills from JSON string
    const userWithParsedSkills = {
      ...updatedUser,
      skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : [],
    }

    return NextResponse.json(userWithParsedSkills)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
} 