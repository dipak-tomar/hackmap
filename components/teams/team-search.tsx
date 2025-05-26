"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Users, MessageSquare } from "lucide-react"

interface Team {
  id: string
  name: string
  description: string
  hackathon: {
    title: string
  }
  members: Array<{
    user: {
      name: string
      image: string | null
      skills: string[]
    }
  }>
  _count: {
    members: number
  }
}

export function TeamSearch() {
  const [teams, setTeams] = useState<Team[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
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

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.description.toLowerCase().includes(search.toLowerCase()) ||
      team.hackathon.title.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return <div>Loading teams...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Find Teams</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams by name, description, or hackathon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <Badge variant="outline">{team.hackathon.title}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{team.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{team._count.members} members</span>
                <div className="flex -space-x-2 ml-2">
                  {team.members.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.user.image || ""} />
                      <AvatarFallback className="text-xs">{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{team.members.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {team.members
                  .flatMap((m) => m.user.skills)
                  .slice(0, 3)
                  .map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Request to Join
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teams found</h3>
          <p className="text-muted-foreground">
            {search ? "Try adjusting your search terms" : "Be the first to create a team!"}
          </p>
        </div>
      )}
    </div>
  )
}
