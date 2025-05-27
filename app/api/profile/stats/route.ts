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

    // Fetch user statistics in parallel
    const [
      hackathonsJoined,
      teamsFormed,
      projectsCreated,
      awardsWon // This would need additional schema for awards/achievements
    ] = await Promise.all([
      prisma.hackathonRegistration.count({
        where: { userId: user.id }
      }),
      prisma.team.count({
        where: { leaderId: user.id }
      }),
      prisma.project.count({
        where: {
          team: {
            members: {
              some: {
                userId: user.id
              }
            }
          }
        }
      }),
      // For now, calculate awards based on project endorsements
      prisma.projectEndorsement.count({
        where: {
          project: {
            team: {
              members: {
                some: {
                  userId: user.id
                }
              }
            }
          }
        }
      })
    ])

    const stats = [
      {
        label: "Hackathons Joined",
        value: hackathonsJoined.toString(),
        icon: "Calendar",
      },
      {
        label: "Teams Formed",
        value: teamsFormed.toString(),
        icon: "Users",
      },
      {
        label: "Projects Created",
        value: projectsCreated.toString(),
        icon: "Code",
      },
      {
        label: "Project Endorsements",
        value: Math.floor(awardsWon / 5).toString(), // Convert endorsements to "awards"
        icon: "Trophy",
      },
    ]

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json({ error: "Failed to fetch profile stats" }, { status: 500 })
  }
} 