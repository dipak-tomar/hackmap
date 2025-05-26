import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Users, Clock, Trophy } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

const getIcon = (type: string) => {
  switch (type) {
    case "TEAM_INVITE":
    case "TEAM_UPDATE":
      return Users
    case "DEADLINE_REMINDER":
      return Clock
    case "PROJECT_ENDORSEMENT":
      return Trophy
    default:
      return Bell
  }
}

export async function Notifications() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </div>
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please sign in to view notifications</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fetch user's notifications
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </div>
          <Badge variant="secondary">{notifications.filter((n) => !n.read).length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type)
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${!notification.read ? "bg-muted/50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}
