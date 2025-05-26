"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, ExternalLink, Users } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  techStack: string // JSON string, not array
  team: {
    name: string
    hackathon: {
      title: string
    }
    members: Array<{
      user: {
        name: string
        image: string | null
      }
    }>
  }
  _count: {
    comments: number
    endorsements: number
  }
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        // Parse techStack from JSON string to array
        const techStack = project.techStack ? JSON.parse(project.techStack) : []
        
        return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{project.team.hackathon.title}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  {project._count.endorsements}
                </div>
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {project.team.name}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {techStack.slice(0, 3).map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {techStack.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{techStack.length - 3}
                  </Badge>
                )}
              </div>

            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {project.team.members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback className="text-xs">{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{project.team.members.length} members</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {project._count.comments}
                </div>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Heart className="h-4 w-4 mr-1" />
                  Endorse
                </Button>
              </div>
              <Link href={`/projects/${project.id}`}>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )
      })}
    </div>
  )
}
