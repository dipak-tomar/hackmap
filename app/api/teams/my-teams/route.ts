import { NextResponse } from "next/server"
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
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch teams where user is a member
    const teamMemberships = await prisma.teamMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            inviteCode: true,
            leaderId: true,
            createdAt: true,
            hackathon: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
              },
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    })

    // Transform the data to match the expected format
    const teams = teamMemberships.map(membership => ({
      ...membership.team,
      role: membership.role,
    }))

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching user teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
} 