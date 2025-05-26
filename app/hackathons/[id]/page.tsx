import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Trophy, Users, MapPin, Tag } from "lucide-react"
import Link from "next/link"

interface HackathonPageProps {
  params: {
    id: string
  }
}

export default async function HackathonPage({ params }: HackathonPageProps) {
  const session = await getServerSession(authOptions)
  
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: params.id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      teams: {
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              image: true,
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
      registrations: {
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
  })

  if (!hackathon) {
    notFound()
  }

  const isRegistrationOpen = new Date() < new Date(hackathon.registrationDeadline)
  const hasStarted = new Date() >= new Date(hackathon.startDate)
  const hasEnded = new Date() > new Date(hackathon.endDate)
  
  const userRegistration = session?.user?.id 
    ? hackathon.registrations.find(reg => reg.userId === session.user.id)
    : null
  
  const userTeam = session?.user?.id
    ? hackathon.teams.find(team => 
        team.members.some(member => member.userId === session.user.id)
      )
    : null

  const prizes = hackathon.prizes ? JSON.parse(hackathon.prizes) : []
  const tags = hackathon.tags ? JSON.parse(hackathon.tags) : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Hackathon Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{hackathon.title}</CardTitle>
                  <CardDescription className="text-lg">{hackathon.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {hackathon.theme}
                    </Badge>
                    {!isRegistrationOpen && (
                      <Badge variant="destructive">Registration Closed</Badge>
                    )}
                    {hasStarted && !hasEnded && (
                      <Badge variant="default">In Progress</Badge>
                    )}
                    {hasEnded && (
                      <Badge variant="outline">Completed</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Organized by</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={hackathon.organizer.image || ""} />
                      <AvatarFallback>
                        {hackathon.organizer.name?.charAt(0).toUpperCase() || "O"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{hackathon.organizer.name}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(hackathon.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(hackathon.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Registration Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Max Team Size</p>
                    <p className="text-sm text-muted-foreground">
                      {hackathon.maxTeamSize} members
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prizes */}
          {prizes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Prizes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prizes.map((prize: string, index: number) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                      <p className="font-medium">
                        {index === 0 ? "1st Place" : index === 1 ? "2nd Place" : "3rd Place"}
                      </p>
                      <p className="text-sm text-muted-foreground">{prize}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session?.user ? (
                  <>
                    {userRegistration ? (
                      <div className="space-y-2">
                        <Badge variant="default">✓ Registered</Badge>
                        <p className="text-sm text-muted-foreground">
                          You registered on {new Date(userRegistration.registeredAt).toLocaleDateString()}
                        </p>
                        {userTeam ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Your Team:</p>
                            <Link href={`/teams/${userTeam.id}`}>
                              <Button variant="outline" size="sm">
                                View Team: {userTeam.name}
                              </Button>
                            </Link>
                          </div>
                        ) : isRegistrationOpen ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              You're registered but not on a team yet.
                            </p>
                            <Link href="/teams">
                              <Button size="sm">Find or Create Team</Button>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    ) : isRegistrationOpen ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Registration is open until {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                        </p>
                        <Button>Register Now</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="destructive">Registration Closed</Badge>
                        <p className="text-sm text-muted-foreground">
                          Registration closed on {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please sign in to register for this hackathon
                    </p>
                    <Link href="/auth/signin">
                      <Button>Sign In</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{hackathon.registrations.length}</div>
                    <p className="text-sm text-muted-foreground">Registered</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{hackathon.teams.length}</div>
                    <p className="text-sm text-muted-foreground">Teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teams ({hackathon.teams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hackathon.teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hackathon.teams.map((team) => (
                    <Link key={team.id} href={`/teams/${team.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {team.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={team.leader.image || ""} />
                                <AvatarFallback className="text-xs">
                                  {team.leader.name?.charAt(0).toUpperCase() || "L"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {team.leader.name}
                              </span>
                            </div>
                            <Badge variant="outline">
                              {team.members.length}/{hackathon.maxTeamSize}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No teams have been created yet for this hackathon.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 