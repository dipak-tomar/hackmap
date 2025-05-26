import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  search?: string
  theme?: string
  status?: string
  page?: string
}

// Mock data - in real app, this would come from API
const hackathons = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    description: "Build the next generation of AI applications that solve real-world problems.",
    theme: "AI & Machine Learning",
    startDate: "2024-02-15T09:00:00Z",
    endDate: "2024-02-17T18:00:00Z",
    registrationDeadline: "2024-02-10T23:59:59Z",
    location: "San Francisco, CA",
    prizes: ["$50,000", "$25,000", "$10,000"],
    maxTeamSize: 4,
    registrations: 450,
    tags: ["AI", "Machine Learning", "Innovation"],
  },
  {
    id: "2",
    title: "Green Tech Hackathon",
    description: "Create sustainable technology solutions for environmental challenges.",
    theme: "Sustainability",
    startDate: "2024-03-01T09:00:00Z",
    endDate: "2024-03-03T18:00:00Z",
    registrationDeadline: "2024-02-25T23:59:59Z",
    location: "Austin, TX",
    prizes: ["$25,000", "$15,000", "$5,000"],
    maxTeamSize: 5,
    registrations: 280,
    tags: ["Sustainability", "CleanTech", "Environment"],
  },
  {
    id: "3",
    title: "FinTech Revolution",
    description: "Revolutionize financial services with cutting-edge technology.",
    theme: "FinTech",
    startDate: "2024-03-15T09:00:00Z",
    endDate: "2024-03-17T18:00:00Z",
    registrationDeadline: "2024-03-10T23:59:59Z",
    location: "New York, NY",
    prizes: ["$75,000", "$35,000", "$15,000"],
    maxTeamSize: 4,
    registrations: 620,
    tags: ["FinTech", "Blockchain", "Payments"],
  },
]

export async function HackathonGrid({ searchParams }: { searchParams: SearchParams }) {
  // In a real app, you would filter based on searchParams
  const filteredHackathons = hackathons

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredHackathons.map((hackathon) => (
        <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="secondary">{hackathon.theme}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 mr-1" />
                {hackathon.prizes[0]}
              </div>
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
                <MapPin className="h-4 w-4 mr-2" />
                {hackathon.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {hackathon.registrations} registered • Max team size: {hackathon.maxTeamSize}
              </div>
              <div className="flex flex-wrap gap-1">
                {hackathon.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
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
      ))}
    </div>
  )
}
