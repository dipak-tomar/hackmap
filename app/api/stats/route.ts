import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get current date for filtering active hackathons
    const now = new Date()

    // Fetch all statistics in parallel
    const [
      activeHackathons,
      totalUsers,
      totalTeams,
      totalProjects
    ] = await Promise.all([
      prisma.hackathon.count({
        where: {
          registrationDeadline: {
            gte: now
          }
        }
      }),
      prisma.user.count(),
      prisma.team.count(),
      prisma.project.count()
    ])

    const stats = [
      { label: "Active Hackathons", value: `${activeHackathons}+` },
      { label: "Registered Users", value: `${Math.floor(totalUsers / 100) * 100}+` },
      { label: "Teams Formed", value: `${totalTeams}+` },
      { label: "Projects Created", value: `${totalProjects}+` },
    ]

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    
    // Return fallback stats if database query fails
    const fallbackStats = [
      { label: "Active Hackathons", value: "3+" },
      { label: "Registered Users", value: "100+" },
      { label: "Teams Formed", value: "25+" },
      { label: "Projects Created", value: "50+" },
    ]
    
    return NextResponse.json(fallbackStats)
  }
} 