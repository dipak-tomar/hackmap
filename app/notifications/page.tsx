"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bell, Users, Clock, Lightbulb, MessageSquare, Heart, CheckCircle, XCircle, Mail, Calendar, UserPlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "TEAM_INVITE" | "JOIN_REQUEST" | "DEADLINE_REMINDER" | "TEAM_UPDATE" | "PROJECT_COMMENT" | "PROJECT_ENDORSEMENT"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const { toast } = useToast()

  // Mock notifications data - replace with actual API call
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "TEAM_INVITE",
      title: "Team Invitation Received",
      message: "You've been invited to join 'AI Innovators' team for HackMap Challenge 2024",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      type: "JOIN_REQUEST",
      title: "New Join Request",
      message: "Sarah Johnson wants to join your team 'Web Warriors' for HackMap Challenge 2024",
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: "3",
      type: "DEADLINE_REMINDER",
      title: "Registration Deadline Approaching",
      message: "Only 2 days left to register for HackMap Challenge 2024. Don't miss out!",
      read: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      id: "4",
      type: "PROJECT_COMMENT",
      title: "New Comment on Your Project",
      message: "Alex Chen commented on your project 'Smart City Dashboard': Great work on the UI design!",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: "5",
      type: "PROJECT_ENDORSEMENT",
      title: "Project Endorsed",
      message: "Your project 'EcoTracker' received an endorsement from mentor Lisa Wong",
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: "6",
      type: "TEAM_UPDATE",
      title: "Team Member Joined",
      message: "Mike Rodriguez has joined your team 'Code Crusaders'",
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ]

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        
        if (response.ok) {
          setNotifications(data.notifications || [])
        } else {
          // If API fails, use mock data for demonstration
          console.warn("API failed, using mock data:", data.error)
          setTimeout(() => {
            setNotifications(mockNotifications)
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Use mock data as fallback
        setNotifications(mockNotifications)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchNotifications()
    }
  }, [session])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "TEAM_INVITE":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "JOIN_REQUEST":
        return <Users className="h-5 w-5 text-green-500" />
      case "DEADLINE_REMINDER":
        return <Clock className="h-5 w-5 text-red-500" />
      case "TEAM_UPDATE":
        return <Bell className="h-5 w-5 text-purple-500" />
      case "PROJECT_COMMENT":
        return <MessageSquare className="h-5 w-5 text-orange-500" />
      case "PROJECT_ENDORSEMENT":
        return <Heart className="h-5 w-5 text-pink-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "TEAM_INVITE":
        return "bg-blue-50 border-blue-200"
      case "JOIN_REQUEST":
        return "bg-green-50 border-green-200"
      case "DEADLINE_REMINDER":
        return "bg-red-50 border-red-200"
      case "TEAM_UPDATE":
        return "bg-purple-50 border-purple-200"
      case "PROJECT_COMMENT":
        return "bg-orange-50 border-orange-200"
      case "PROJECT_ENDORSEMENT":
        return "bg-pink-50 border-pink-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, { 
        method: "POST" 
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
        
        toast({
          title: "Marked as read",
          description: "Notification has been marked as read",
        })
      } else {
        throw new Error("Failed to mark as read")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", { 
        method: "POST" 
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        )
        
        toast({
          title: "All notifications marked as read",
          description: "All your notifications have been marked as read",
        })
      } else {
        throw new Error("Failed to mark all as read")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, { 
        method: "DELETE" 
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notif => notif.id !== notificationId)
        )
        
        toast({
          title: "Notification deleted",
          description: "Notification has been deleted",
        })
      } else {
        throw new Error("Failed to delete notification")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read
    if (filter === "read") return notif.read
    return true
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to view your notifications.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your hackathon activities
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} unread</Badge>
              )}
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-4">
                <Bell className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Mail className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Users className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {notifications.filter(n => n.type === "TEAM_INVITE" || n.type === "JOIN_REQUEST").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Team Related</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Clock className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {notifications.filter(n => n.type === "DEADLINE_REMINDER").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Deadlines</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      {filter === "unread" ? "You're all caught up!" : "No notifications to show"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${
                      !notification.read ? getNotificationColor(notification.type) : ""
                    } ${!notification.read ? "border-l-4" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  New
                                </Badge>
                              )}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 