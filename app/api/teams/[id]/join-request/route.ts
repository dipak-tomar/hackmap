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

    // Find the team
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: true,
        hackathon: {
          select: {
            id: true,
            title: true,
            maxTeamSize: true,
            registrationDeadline: true,
          },
        },
        leader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Check if registration is still open
    const now = new Date()
    if (now > new Date(team.hackathon.registrationDeadline)) {
      return NextResponse.json({ error: "Registration deadline has passed for this hackathon" }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = team.members.find(member => member.userId === user.id)
    if (existingMember) {
      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
    }

    // Check if team is full
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 400 })
    }

    // Check if user is registered for the hackathon
    const userRegistration = await prisma.hackathonRegistration.findUnique({
      where: {
        userId_hackathonId: {
          userId: user.id,
          hackathonId: team.hackathonId,
        },
      },
    })

    if (!userRegistration) {
      return NextResponse.json({ 
        error: "You must be registered for this hackathon to request to join the team" 
      }, { status: 400 })
    }

    // Check if user already sent a join request
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId: team.leaderId,
        type: "JOIN_REQUEST",
        AND: [
          {
            message: {
              contains: user.name || user.email,
            },
          },
          {
            message: {
              contains: team.name,
            },
          },
        ],
      },
    })

    if (existingNotification) {
      return NextResponse.json({ error: "Join request already sent" }, { status: 400 })
    }

    // Create notification for team leader
    const notification = await prisma.notification.create({
      data: {
        userId: team.leaderId,
        type: "JOIN_REQUEST",
        title: "Team Join Request",
        message: `${user.name} wants to join your team "${team.name}" for ${team.hackathon.title}`,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Join request sent successfully",
      notification 
    }, { status: 201 })
  } catch (error) {
    console.error("Error sending join request:", error)
    return NextResponse.json({ error: "Failed to send join request" }, { status: 500 })
  }
} 