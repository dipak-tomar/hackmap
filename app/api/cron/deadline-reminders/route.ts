import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDeadlineReminderEmail } from "@/lib/email"

export async function GET() {
  try {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

    // Find hackathons with upcoming deadlines (1 day and 3 days)
    const upcomingDeadlines = await prisma.hackathon.findMany({
      where: {
        registrationDeadline: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    let emailsSent = 0
    const errors: string[] = []

    for (const hackathon of upcomingDeadlines) {
      // Check registration deadline
      if (hackathon.registrationDeadline) {
        const regDeadline = new Date(hackathon.registrationDeadline)
        const daysUntilRegDeadline = Math.ceil((regDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysUntilRegDeadline <= 3 && daysUntilRegDeadline > 0) {
          // Send reminders to users who haven't formed teams yet
          const usersWithoutTeams = await prisma.user.findMany({
            where: {
              registrations: {
                some: {
                  hackathonId: hackathon.id,
                },
              },
              teamMemberships: {
                none: {
                  team: {
                    hackathonId: hackathon.id,
                  },
                },
              },
            },
            select: {
              id: true,
              name: true,
              email: true,
            },
          })

          for (const user of usersWithoutTeams) {
            if (user.email) {
              try {
                await sendDeadlineReminderEmail(user.email, {
                  userName: user.name || user.email,
                  hackathonTitle: hackathon.title,
                  deadlineType: "Team Formation",
                  deadline: regDeadline.toLocaleDateString(),
                  daysLeft: daysUntilRegDeadline,
                  hackathonId: hackathon.id,
                })
                emailsSent++
              } catch (error) {
                errors.push(`Failed to send registration reminder to ${user.email}: ${error}`)
              }
            }
          }
        }
      }

      // Note: Submission deadline reminders can be added when submissionDeadline field is available
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
      message: `Sent ${emailsSent} deadline reminder emails`,
    })
  } catch (error) {
    console.error("Error in deadline reminder cron job:", error)
    return NextResponse.json(
      { error: "Failed to process deadline reminders" },
      { status: 500 }
    )
  }
}

// Verify cron job authorization (optional security measure)
export async function POST(request: Request) {
  try {
    const { authorization } = await request.json()
    
    // Simple authorization check - in production, use a proper secret
    if (authorization !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the GET method to run the cron job
    return GET()
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
} 