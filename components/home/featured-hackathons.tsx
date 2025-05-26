import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy } from "lucide-react"
import Link from "next/link"

const featuredHackathons = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    theme: "Artificial Intelligence",
    startDate: "2024-02-15",
    endDate: "2024-02-17",
    location: "San Francisco, CA",
    prize: "$50,000",
    participants: 500,
  },
  {
    id: "2",
    title: "Green Tech Hackathon",
    theme: "Sustainability",
    startDate: "2024-03-01",
    endDate: "2024-03-03",
    location: "Austin, TX",
    prize: "$25,000",
    participants: 300,
  },
  {
    id: "3",
    title: "FinTech Revolution",
    theme: "Financial Technology",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    location: "New York, NY",
    prize: "$75,000",
    participants: 750,
  },
]

export function FeaturedHackathons() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Hackathons</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join these exciting upcoming hackathons and showcase your skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{hackathon.theme}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1" />
                    {hackathon.prize}
                  </div>
                </div>
                <CardTitle className="text-xl">{hackathon.title}</CardTitle>
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
                  <div className="text-sm text-muted-foreground">{hackathon.participants} participants registered</div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/hackathons/${hackathon.id}`}>Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/hackathons">View All Hackathons</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
