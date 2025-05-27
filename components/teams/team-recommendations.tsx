"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RecommendedTeam {
  id: string
  name: string
  description: string
  matchScore: number
  commonSkills: string[]
  complementarySkills: string[]
  teamSkills: string[]
  hackathon: {
    id: string
    title: string
    maxTeamSize: number
  }
  members: Array<{
    user: {
      id: string
      name: string
      image: string | null
      skills: string | null
    }
  }>
  _count: {
    members: number
  }
}

interface MatchmakingResponse {
  message: string
  userSkills: string[]
  teams: RecommendedTeam[]
}

export function TeamRecommendations() {
  const [recommendations, setRecommendations] = useState<MatchmakingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestingTeams, setRequestingTeams] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/teams/matchmaking")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRequest = async (teamId: string) => {
    setRequestingTeams(prev => new Set(prev).add(teamId))
    
    try {
      const response = await fetch(`/api/teams/${teamId}/join-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        toast({
          title: "Request Sent!",
          description: "Your join request has been sent to the team leader.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to send join request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setRequestingTeams(prev => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
    }
  }

  if (loading) {
    return <div>Loading recommendations...</div>
  }

  if (!recommendations || recommendations.teams.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground mb-4">
            {recommendations?.userSkills?.length === 0 
              ? "Add skills to your profile to get personalized team recommendations"
              : "No matching teams found at the moment"
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Recommended Teams</h2>
        <p className="text-muted-foreground mb-4">{recommendations.message}</p>
        {recommendations.userSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            <span className="text-sm text-muted-foreground mr-2">Your skills:</span>
            {recommendations.userSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                  <Star className="h-4 w-4" />
                  {Math.round(team.matchScore)}% match
                </div>
              </div>
              <Badge variant="outline">{team.hackathon.title}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{team.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {team._count.members}/{team.hackathon.maxTeamSize} members
                </span>
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

              {team.commonSkills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Common skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {team.commonSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {team.complementarySkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">You bring:</p>
                  <div className="flex flex-wrap gap-1">
                    {team.complementarySkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleJoinRequest(team.id)}
                  disabled={requestingTeams.has(team.id)}
                >
                  {requestingTeams.has(team.id) ? "Sending..." : "Request to Join"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 