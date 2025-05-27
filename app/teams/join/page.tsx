"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Calendar, Trophy, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamInfo {
  id: string
  name: string
  description: string
  hackathon: {
    title: string
    theme: string
    startDate: string
    maxTeamSize: number
  }
  members: Array<{
    user: {
      name: string
      image: string | null
    }
  }>
  _count: {
    members: number
  }
}

export default function JoinTeamPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const inviteCode = searchParams.get("code")

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!inviteCode) {
      setError("No invite code provided")
      setLoading(false)
      return
    }

    fetchTeamInfo()
  }, [session, status, inviteCode])

  const fetchTeamInfo = async () => {
    try {
      const response = await fetch(`/api/teams/invite-info?code=${inviteCode}`)
      if (response.ok) {
        const data = await response.json()
        setTeamInfo(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Invalid invite code")
      }
    } catch (error) {
      setError("Failed to load team information")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async () => {
    if (!inviteCode) return
    
    setJoining(true)
    try {
      const response = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      })

      if (response.ok) {
        const teamMember = await response.json()
        toast({
          title: "Success!",
          description: `You have joined the team "${teamMember.team.name}"`,
        })
        router.push(`/teams/${teamMember.team.id}`)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to join team",
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
      setJoining(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <h1 className="text-xl font-semibold mb-2">Invalid Invite</h1>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.push("/teams")}>
                  Browse Teams
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!teamInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">You're Invited!</h1>
            <p className="text-muted-foreground">
              Join this team and start building amazing projects together
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{teamInfo.name}</CardTitle>
                  <p className="text-muted-foreground mt-2">{teamInfo.description}</p>
                </div>
                <Badge variant="outline">
                  {teamInfo._count.members}/{teamInfo.hackathon.maxTeamSize} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hackathon Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{teamInfo.hackathon.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span className="capitalize">{teamInfo.hackathon.theme}</span>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Current Members ({teamInfo._count.members})
                </h3>
                <div className="flex -space-x-2">
                  {teamInfo.members.map((member, index) => (
                    <Avatar key={index} className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={member.user.image || ""} />
                      <AvatarFallback>
                        {member.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={handleJoinTeam}
                  disabled={joining}
                >
                  {joining ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Team"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/teams")}
                >
                  Browse Other Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 