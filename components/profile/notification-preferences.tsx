"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bell, Mail, Users, Clock, AlertTriangle } from "lucide-react"

interface NotificationPreferences {
  emailNotifications: boolean
  preferences: {
    teamInvites: boolean
    joinRequests: boolean
    deadlineReminders: boolean
    teamUpdates: boolean
  }
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    preferences: {
      teamInvites: true,
      joinRequests: true,
      deadlineReminders: true,
      teamUpdates: true,
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/profile/notifications")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification preferences updated successfully",
        })
      } else {
        throw new Error("Failed to update preferences")
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateEmailNotifications = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      emailNotifications: enabled,
    }))
  }

  const updatePreference = (key: keyof NotificationPreferences['preferences'], enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: enabled,
      },
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading preferences...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications about team activities and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Email Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications" className="text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={preferences.emailNotifications}
            onCheckedChange={updateEmailNotifications}
          />
        </div>

        {/* Individual Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Email Types</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="team-invites" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Invitations
                </Label>
                <p className="text-xs text-muted-foreground">
                  When someone invites you to join their team
                </p>
              </div>
              <Switch
                id="team-invites"
                checked={preferences.preferences.teamInvites}
                onCheckedChange={(checked) => updatePreference('teamInvites', checked)}
                disabled={!preferences.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="join-requests" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Join Requests
                </Label>
                <p className="text-xs text-muted-foreground">
                  When someone wants to join your team
                </p>
              </div>
              <Switch
                id="join-requests"
                checked={preferences.preferences.joinRequests}
                onCheckedChange={(checked) => updatePreference('joinRequests', checked)}
                disabled={!preferences.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="deadline-reminders" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Deadline Reminders
                </Label>
                <p className="text-xs text-muted-foreground">
                  Reminders about upcoming registration and submission deadlines
                </p>
              </div>
              <Switch
                id="deadline-reminders"
                checked={preferences.preferences.deadlineReminders}
                onCheckedChange={(checked) => updatePreference('deadlineReminders', checked)}
                disabled={!preferences.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="team-updates" className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Team Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Important updates about your teams and projects
                </p>
              </div>
              <Switch
                id="team-updates"
                checked={preferences.preferences.teamUpdates}
                onCheckedChange={(checked) => updatePreference('teamUpdates', checked)}
                disabled={!preferences.emailNotifications}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 