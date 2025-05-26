import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface SearchParams {
  search?: string
  theme?: string
  status?: string
  page?: string
}

export async function HackathonGrid({ searchParams }: { searchParams: SearchParams }) {
  // Fetch hackathons from database
  const hackathons = await prisma.hackathon.findMany({
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
      registrations: {
        select: {
          id: true,
        },
      },
      teams: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  })

  // Apply filters based on search params
  let filteredHackathons = hackathons

  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredHackathons = filteredHackathons.filter(
      (hackathon) =>
        hackathon.title.toLowerCase().includes(searchTerm) ||
        hackathon.description.toLowerCase().includes(searchTerm) ||
        hackathon.theme.toLowerCase().includes(searchTerm)
    )
  }

  if (searchParams.theme) {
    filteredHackathons = filteredHackathons.filter(
      (hackathon) => hackathon.theme.toLowerCase() === searchParams.theme?.toLowerCase()
    )
  }

  if (searchParams.status) {
    const now = new Date()
    filteredHackathons = filteredHackathons.filter((hackathon) => {
      const registrationDeadline = new Date(hackathon.registrationDeadline)
      const startDate = new Date(hackathon.startDate)
      const endDate = new Date(hackathon.endDate)

      switch (searchParams.status) {
        case 'registration_open':
          return now < registrationDeadline
        case 'in_progress':
          return now >= startDate && now <= endDate
        case 'completed':
          return now > endDate
        default:
          return true
      }
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredHackathons.map((hackathon) => {
        const prizes = hackathon.prizes ? JSON.parse(hackathon.prizes) : []
        const tags = hackathon.tags ? JSON.parse(hackathon.tags) : []
        
        return (
          <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="capitalize">{hackathon.theme}</Badge>
                {prizes.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1" />
                    {prizes[0]}
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">{hackathon.title}</CardTitle>
              <p className="text-muted-foreground text-sm line-clamp-2">{hackathon.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
                  {new Date(hackathon.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {hackathon.registrations.length} registered • Max team size: {hackathon.maxTeamSize}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4 mr-2" />
                  Organized by {hackathon.organizer.name}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/hackathons/${hackathon.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/hackathons/${hackathon.id}/register`}>Register</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
