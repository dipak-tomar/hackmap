"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Code, Calendar } from "lucide-react"

interface Stat {
  label: string
  value: string
  icon: string
}

export function ProfileStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Hackathons Joined",
      value: "0",
      icon: "Calendar",
    },
    {
      label: "Teams Formed",
      value: "0",
      icon: "Users",
    },
    {
      label: "Projects Created",
      value: "0",
      icon: "Code",
    },
    {
      label: "Project Endorsements",
      value: "0",
      icon: "Trophy",
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/profile/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching profile stats:", error)
        // Keep fallback stats
      }
    }

    fetchStats()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Calendar": return Calendar
      case "Users": return Users
      case "Code": return Code
      case "Trophy": return Trophy
      default: return Calendar
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const IconComponent = getIcon(stat.icon)
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                              <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )
          })}
          </div>
      </CardContent>
    </Card>
  )
}
