import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function UpcomingEvents() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please sign in to view upcoming events</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fetch upcoming hackathons
  const upcomingHackathons = await prisma.hackathon.findMany({
    where: {
      startDate: {
        gt: new Date(),
      },
    },
    include: {
      registrations: {
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      },
      teams: {
        where: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    take: 5,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingHackathons.map((hackathon) => {
            const isRegistered = hackathon.registrations.length > 0
            const hasTeam = hackathon.teams.length > 0
            const isRegistrationOpen = new Date() < new Date(hackathon.registrationDeadline)
            
            return (
              <div key={hackathon.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{hackathon.title}</h3>
                  <Badge variant={isRegistered ? "default" : isRegistrationOpen ? "secondary" : "destructive"}>
                    {isRegistered ? "Registered" : isRegistrationOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Starts {new Date(hackathon.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Registration deadline: {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                  </div>
                  {isRegistered && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Team status: {hasTeam ? "Team formed" : "Looking for team"}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/hackathons/${hackathon.id}`}>View Details</Link>
                  </Button>
                  {isRegistered && !hasTeam && (
                    <Button size="sm" asChild>
                      <Link href="/teams">Find Team</Link>
                    </Button>
                  )}
                  {!isRegistered && isRegistrationOpen && (
                    <Button size="sm" asChild>
                      <Link href={`/hackathons/${hackathon.id}`}>Register</Link>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
