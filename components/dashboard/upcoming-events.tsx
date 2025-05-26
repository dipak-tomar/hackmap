import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"

const upcomingEvents = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    startDate: "2024-02-15",
    registrationDeadline: "2024-02-10",
    status: "registered",
    teamStatus: "looking",
  },
  {
    id: "2",
    title: "Green Tech Hackathon",
    startDate: "2024-03-01",
    registrationDeadline: "2024-02-25",
    status: "not_registered",
    teamStatus: null,
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge variant={event.status === "registered" ? "default" : "secondary"}>
                  {event.status === "registered" ? "Registered" : "Open"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Starts {new Date(event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                </div>
                {event.teamStatus && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Team status: {event.teamStatus === "looking" ? "Looking for team" : "Team formed"}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/hackathons/${event.id}`}>View Details</Link>
                </Button>
                {event.status === "registered" && event.teamStatus === "looking" && (
                  <Button size="sm" asChild>
                    <Link href="/teams">Find Team</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
