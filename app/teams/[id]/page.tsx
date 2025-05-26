import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InviteCodeCard } from "@/components/teams/invite-code-card"
import { Users, Calendar, Trophy } from "lucide-react"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please sign in to view this team</h1>
          </div>
        </main>
      </div>
    )
  }

  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      members: {
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
        },
      },
      hackathon: {
        select: {
          id: true,
          title: true,
          theme: true,
          startDate: true,
          endDate: true,
          maxTeamSize: true,
        },
      },
      leader: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!team) {
    notFound()
  }

  const isLeader = team.leaderId === session.user.id
  const isMember = team.members.some(member => member.userId === session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Team Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{team.name}</CardTitle>
                  <CardDescription className="mt-2">{team.description}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-4">
                  {team.members.length}/{team.hackathon.maxTeamSize} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{team.hackathon.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span className="capitalize">{team.hackathon.theme}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Code */}
          {(isLeader || isMember) && (
            <InviteCodeCard inviteCode={team.inviteCode} />
          )}

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({team.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => {
                  const skills = member.user.skills ? JSON.parse(member.user.skills) : []
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.user.image || ""} />
                          <AvatarFallback>
                            {member.user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.user.name}</span>
                            {member.role === "LEADER" && (
                              <Badge variant="secondary">Leader</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {skills.slice(0, 3).map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Hackathon Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Event Dates</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(team.hackathon.startDate).toLocaleDateString()} - {" "}
                    {new Date(team.hackathon.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Max Team Size</h4>
                  <p className="text-sm text-muted-foreground">
                    {team.hackathon.maxTeamSize} members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 