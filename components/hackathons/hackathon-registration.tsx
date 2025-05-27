"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Trophy, Users, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface HackathonRegistrationProps {
  hackathon: {
    id: string
    title: string
    description: string
    theme: string
    startDate: string
    endDate: string
    registrationDeadline: string
    maxTeamSize: number
    prizes: string
    tags: string
    organizer: {
      id: string
      name: string
      email: string
      image: string | null
    }
    _count: {
      registrations: number
      teams: number
    }
  }
  currentUser: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  userRegistration?: {
    id: string
    userId: string
    registeredAt: string
  } | null
}

export function HackathonRegistration({ 
  hackathon, 
  currentUser, 
  userRegistration 
}: HackathonRegistrationProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isUnregistering, setIsUnregistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(!!userRegistration)
  const router = useRouter()
  const { toast } = useToast()

  const isRegistrationOpen = new Date() < new Date(hackathon.registrationDeadline)
  const hasStarted = new Date() >= new Date(hackathon.startDate)
  const hasEnded = new Date() > new Date(hackathon.endDate)

  const prizes = hackathon.prizes ? JSON.parse(hackathon.prizes) : []
  const tags = hackathon.tags ? JSON.parse(hackathon.tags) : []

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const response = await fetch(`/api/hackathons/${hackathon.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setIsRegistered(true)
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered for this hackathon.",
        })
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Registration Failed",
          description: error.error || "Failed to register for hackathon",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleUnregister = async () => {
    setIsUnregistering(true)
    try {
      const response = await fetch(`/api/hackathons/${hackathon.id}/register`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setIsRegistered(false)
        toast({
          title: "Unregistered Successfully",
          description: "You have been unregistered from this hackathon.",
        })
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Unregistration Failed",
          description: error.error || "Failed to unregister from hackathon",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Unregistration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUnregistering(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/hackathons/${hackathon.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hackathon
          </Button>
        </Link>
      </div>

      {/* Registration Status Banner */}
      {isRegistered ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">You're Registered!</h3>
                <p className="text-sm text-green-700">
                  You successfully registered for this hackathon
                  {userRegistration && ` on ${new Date(userRegistration.registeredAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !isRegistrationOpen ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Registration Closed</h3>
                <p className="text-sm text-red-700">
                  Registration deadline was {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Hackathon Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{hackathon.title}</CardTitle>
              <CardDescription className="text-base">{hackathon.description}</CardDescription>
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
        <CardContent className="space-y-6">
          {/* Event Details */}
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

          <Separator />

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Prizes */}
          {prizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Prizes
              </h3>
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
            </div>
          )}

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{hackathon._count.registrations}</div>
              <p className="text-sm text-muted-foreground">Registered Participants</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{hackathon._count.teams}</div>
              <p className="text-sm text-muted-foreground">Teams Formed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegistered ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">You are registered for this hackathon</span>
              </div>
              <div className="flex gap-3">
                <Link href="/teams">
                  <Button>Find or Create Team</Button>
                </Link>
                <Link href={`/hackathons/${hackathon.id}`}>
                  <Button variant="outline">View Hackathon Details</Button>
                </Link>
                {!hasStarted && (
                  <Button 
                    variant="destructive" 
                    onClick={handleUnregister}
                    disabled={isUnregistering}
                  >
                    {isUnregistering ? "Unregistering..." : "Unregister"}
                  </Button>
                )}
              </div>
            </div>
          ) : isRegistrationOpen ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ready to participate?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  By registering, you'll be able to form teams and participate in this hackathon.
                  Registration is open until {new Date(hackathon.registrationDeadline).toLocaleDateString()}.
                </p>
              </div>
              <Button 
                onClick={handleRegister} 
                disabled={isRegistering}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isRegistering ? "Registering..." : "Register for Hackathon"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium">Registration is closed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Registration deadline was {new Date(hackathon.registrationDeadline).toLocaleDateString()}.
                You can no longer register for this hackathon.
              </p>
              <Link href={`/hackathons/${hackathon.id}`}>
                <Button variant="outline">View Hackathon Details</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 