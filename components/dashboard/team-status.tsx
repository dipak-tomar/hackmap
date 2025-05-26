import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"

const myTeams = [
  {
    id: "1",
    name: "AI Innovators",
    hackathon: "AI Innovation Challenge",
    role: "Leader",
    members: [
      { name: "John Doe", avatar: "/placeholder.svg" },
      { name: "Jane Smith", avatar: "/placeholder.svg" },
      { name: "Mike Johnson", avatar: "/placeholder.svg" },
    ],
    status: "active",
  },
]

export function TeamStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          My Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {myTeams.map((team) => (
            <div key={team.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.hackathon}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{team.role}</Badge>
                  <Badge variant="default">{team.status}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">Members:</span>
                <div className="flex -space-x-2">
                  {team.members.map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{team.members.length} members</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/teams/${team.id}`}>View Team</Link>
                </Button>
              </div>
            </div>
          ))}

          {myTeams.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No teams yet</h3>
              <p className="text-muted-foreground mb-4">Join a team or create your own to get started</p>
              <Button asChild>
                <Link href="/teams">Browse Teams</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
