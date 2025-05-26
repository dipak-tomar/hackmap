import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Users, Clock, Trophy } from "lucide-react"

const notifications = [
  {
    id: "1",
    type: "team_invite",
    title: "Team Invitation",
    message: 'You have been invited to join "Web3 Warriors"',
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    type: "deadline",
    title: "Registration Deadline",
    message: "AI Innovation Challenge registration closes in 2 days",
    time: "1 day ago",
    unread: true,
  },
  {
    id: "3",
    type: "team_update",
    title: "Team Update",
    message: 'New member joined your team "AI Innovators"',
    time: "3 days ago",
    unread: false,
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case "team_invite":
    case "team_update":
      return Users
    case "deadline":
      return Clock
    case "achievement":
      return Trophy
    default:
      return Bell
  }
}

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </div>
          <Badge variant="secondary">{notifications.filter((n) => n.unread).length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type)
            return (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${notification.unread ? "bg-muted/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}
