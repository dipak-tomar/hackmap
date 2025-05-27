"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Calendar, UserPlus, Eye } from "lucide-react"
import Link from "next/link"
import { InviteMembersDialog } from "./invite-members-dialog"

interface Team {
  id: string
  name: string
  description: string
  inviteCode: string
  leaderId: string
  hackathon: {
    id: string
    title: string
    startDate: string
  }
  members: Array<{
    role: string
    user: {
      id: string
      name: string
      image: string | null
    }
  }>
}

export function MyTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyTeams()
  }, [])

  const fetchMyTeams = async () => {
    try {
      const response = await fetch("/api/teams/my-teams")
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading your teams...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Teams</h2>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{team.hackathon.title}</p>
                  </div>
                  <Badge variant="default">Leader</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{team.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Starts {new Date(team.hackathon.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{team.members.length} members</span>
                  <div className="flex -space-x-2 ml-2">
                    {team.members.map((member, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback className="text-xs">{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <InviteMembersDialog
                    teamName={team.name}
                    inviteCode={team.inviteCode}
                    hackathonTitle={team.hackathon.title}
                  >
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite Members
                    </Button>
                  </InviteMembersDialog>
                  <Button size="sm" asChild>
                    <Link href={`/teams/${team.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Team
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-4">Create your first team or join an existing one to get started</p>
            <div className="flex gap-2 justify-center">
              <Button>Create Team</Button>
              <Button variant="outline">Browse Teams</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
