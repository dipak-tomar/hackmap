import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: params.id },
    })

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
    }

    // Check if registration is still open
    const now = new Date()
    if (now > new Date(hackathon.registrationDeadline)) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 400 })
    }

    // Check if user is already registered
    const existingRegistration = await prisma.hackathonRegistration.findUnique({
      where: {
        userId_hackathonId: {
          userId: user.id,
          hackathonId: params.id,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this hackathon" }, { status: 400 })
    }

    // Create registration
    const registration = await prisma.hackathonRegistration.create({
      data: {
        userId: user.id,
        hackathonId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        hackathon: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("Error registering for hackathon:", error)
    return NextResponse.json({ error: "Failed to register for hackathon" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: params.id },
    })

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
    }

    // Check if hackathon has started (can't unregister after it starts)
    const now = new Date()
    if (now >= new Date(hackathon.startDate)) {
      return NextResponse.json({ error: "Cannot unregister after hackathon has started" }, { status: 400 })
    }

    // Delete registration
    await prisma.hackathonRegistration.delete({
      where: {
        userId_hackathonId: {
          userId: user.id,
          hackathonId: params.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unregistering from hackathon:", error)
    return NextResponse.json({ error: "Failed to unregister from hackathon" }, { status: 500 })
  }
} 