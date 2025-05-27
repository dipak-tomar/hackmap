import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendTeamInviteEmail } from "@/lib/email"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find the team and verify user is the leader
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
            maxTeamSize: true,
            registrationDeadline: true,
          },
        },
        members: true,
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    if (team.leaderId !== user.id) {
      return NextResponse.json({ error: "Only team leaders can send invites" }, { status: 403 })
    }

    // Check if registration is still open
    const now = new Date()
    if (now > new Date(team.hackathon.registrationDeadline)) {
      return NextResponse.json({ error: "Registration deadline has passed for this hackathon" }, { status: 400 })
    }

    // Check if team is full
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 400 })
    }

    // Check if the email is already a team member
    const existingMember = await prisma.user.findUnique({
      where: { email },
      include: {
        teamMemberships: {
          where: { teamId: team.id },
        },
      },
    })

    if (existingMember?.teamMemberships && existingMember.teamMemberships.length > 0) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 })
    }

    // Send email invitation
    try {
      await sendTeamInviteEmail(email, {
        teamName: team.name,
        hackathonTitle: team.hackathon.title,
        inviteCode: team.inviteCode,
        inviterName: user.name || user.email,
      })

      return NextResponse.json({ 
        success: true, 
        message: "Invitation sent successfully" 
      }, { status: 200 })
    } catch (emailError) {
      console.error('Failed to send team invite email:', emailError)
      return NextResponse.json({ 
        error: "Failed to send invitation email" 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending team invite:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
} 