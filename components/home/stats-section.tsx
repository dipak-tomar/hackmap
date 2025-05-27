"use client"

import { useState, useEffect } from "react"

interface Stat {
  label: string
  value: string
}

export function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Active Hackathons", value: "3+" },
    { label: "Registered Users", value: "100+" },
    { label: "Teams Formed", value: "25+" },
    { label: "Projects Created", value: "50+" },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Keep fallback stats
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-muted-foreground">Thousands of developers are already building amazing projects</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
