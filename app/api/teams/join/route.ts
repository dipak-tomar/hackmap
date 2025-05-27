import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { inviteCode } = await request.json()

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find team by invite code
    const team = await prisma.team.findUnique({
      where: { inviteCode },
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
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })
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
        error: "You must be registered for this hackathon to join the team" 
      }, { status: 400 })
    }

    // Add user to team
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            skills: true,
          },
        },
        team: {
          include: {
            hackathon: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    // Create notification for team leader
    await prisma.notification.create({
      data: {
        userId: team.leaderId,
        type: "TEAM_UPDATE",
        title: "New Team Member",
        message: `${user.name} has joined your team "${team.name}"`,
      },
    })

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error("Error joining team:", error)
    return NextResponse.json({ error: "Failed to join team" }, { status: 500 })
  }
} 