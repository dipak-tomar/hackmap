import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const inviteCode = searchParams.get("code")

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
    }

    // Find team by invite code
    const team = await prisma.team.findUnique({
      where: { inviteCode },
      include: {
        hackathon: {
          select: {
            title: true,
            theme: true,
            startDate: true,
            maxTeamSize: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })
    }

    // Check if team is full
    if (team._count.members >= team.hackathon.maxTeamSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 400 })
    }

    // Check if user is already a member
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (user) {
      const existingMembership = await prisma.teamMember.findFirst({
        where: {
          teamId: team.id,
          userId: user.id,
        },
      })

      if (existingMembership) {
        return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
      }
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error fetching team info:", error)
    return NextResponse.json({ error: "Failed to fetch team information" }, { status: 500 })
  }
} 