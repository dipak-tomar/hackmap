import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export async function FeaturedHackathons() {
  // Fetch featured hackathons (upcoming ones with registration open)
  const featuredHackathons = await prisma.hackathon.findMany({
    where: {
      registrationDeadline: {
        gt: new Date(),
      },
    },
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
    },
    orderBy: {
      startDate: 'asc',
    },
    take: 3,
  })
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
          {featuredHackathons.map((hackathon) => {
            const prizes = hackathon.prizes ? JSON.parse(hackathon.prizes) : []
            
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
                      {hackathon.registrations.length} registered
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Organized by {hackathon.organizer.name}
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/hackathons/${hackathon.id}`}>Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
