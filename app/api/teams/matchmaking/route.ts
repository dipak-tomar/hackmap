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

    // Parse user skills
    const userSkills = user.skills ? JSON.parse(user.skills) : []
    
    if (userSkills.length === 0) {
      return NextResponse.json({ 
        message: "Add skills to your profile to get better team recommendations",
        teams: []
      })
    }

    // Get teams that are looking for members and have open registration
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                skills: true,
              },
            },
          },
        },
        hackathon: {
          select: {
            id: true,
            title: true,
            maxTeamSize: true,
            registrationDeadline: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      where: {
        hackathon: {
          registrationDeadline: {
            gt: new Date(),
          },
        },
        // Exclude teams user is already a member of
        members: {
          none: {
            userId: user.id,
          },
        },
      },
    })

    // Calculate skill match scores for each team
    const teamsWithScores = teams.map(team => {
      // Get all skills from team members
      const teamSkills = team.members.flatMap(member => {
        const skills = member.user.skills ? JSON.parse(member.user.skills) : []
        return skills
      })

      // Calculate skill overlap
      const commonSkills = userSkills.filter((skill: string) => 
        teamSkills.some((teamSkill: string) => 
          teamSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(teamSkill.toLowerCase())
        )
      )

      // Calculate complementary skills (skills the team doesn't have)
      const complementarySkills = userSkills.filter((skill: string) => 
        !teamSkills.some((teamSkill: string) => 
          teamSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(teamSkill.toLowerCase())
        )
      )

      // Score based on team needs (teams with fewer members get higher priority)
      const teamSizeScore = (team.hackathon.maxTeamSize - team.members.length) / team.hackathon.maxTeamSize

      // Combined score: common skills + complementary skills + team size needs
      const matchScore = (commonSkills.length * 2) + (complementarySkills.length * 3) + (teamSizeScore * 5)

      return {
        ...team,
        matchScore,
        commonSkills,
        complementarySkills,
        teamSkills: [...new Set(teamSkills)], // Remove duplicates
      }
    })

    // Sort by match score (highest first) and filter teams that need members
    const recommendedTeams = teamsWithScores
      .filter(team => team.members.length < team.hackathon.maxTeamSize)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10) // Return top 10 matches

    return NextResponse.json({
      message: `Found ${recommendedTeams.length} recommended teams based on your skills`,
      userSkills,
      teams: recommendedTeams,
    })
  } catch (error) {
    console.error("Error in skill-based matchmaking:", error)
    return NextResponse.json({ error: "Failed to find team matches" }, { status: 500 })
  }
} 