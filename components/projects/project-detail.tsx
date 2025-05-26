"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Users, Calendar, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ProjectDetailProps {
  project: {
    id: string
    title: string
    description: string
    techStack: string
    createdAt: string
    team: {
      id: string
      name: string
      hackathon: {
        id: string
        title: string
        description: string
        startDate: string
        endDate: string
      }
      members: Array<{
        role: string
        user: {
          id: string
          name: string
          image: string | null
          email: string
        }
      }>
    }
    comments: Array<{
      id: string
      content: string
      createdAt: string
      user: {
        id: string
        name: string
        image: string | null
      }
    }>
    endorsements: Array<{
      id: string
      user: {
        id: string
        name: string
        image: string | null
      }
    }>
    _count: {
      comments: number
      endorsements: number
    }
  }
  currentUser: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProjectDetail({ project, currentUser }: ProjectDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState(project.comments)
  const [endorsements, setEndorsements] = useState(project.endorsements)
  const [isEndorsed, setIsEndorsed] = useState(
    project.endorsements.some(e => e.user.id === currentUser.id)
  )

  const techStack = project.techStack ? JSON.parse(project.techStack) : []

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleEndorsement = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/endorsements`, {
        method: isEndorsed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        if (isEndorsed) {
          setEndorsements(endorsements.filter(e => e.user.id !== currentUser.id))
        } else {
          const endorsement = await response.json()
          setEndorsements([...endorsements, endorsement])
        }
        setIsEndorsed(!isEndorsed)
      }
    } catch (error) {
      console.error("Error toggling endorsement:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{project.team.hackathon.title}</Badge>
                <span className="text-sm text-muted-foreground">
                  by {project.team.name}
                </span>
              </div>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(project.createdAt))} ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isEndorsed ? "default" : "outline"}
                size="sm"
                onClick={handleToggleEndorsement}
              >
                <Heart className={`h-4 w-4 mr-1 ${isEndorsed ? "fill-current" : ""}`} />
                {isEndorsed ? "Endorsed" : "Endorse"} ({endorsements.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech: string) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Team Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members ({project.team.members.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.team.members.map((member) => (
                <div key={member.user.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hackathon Info */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hackathon Details
            </h3>
            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-medium">{project.team.hackathon.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{project.team.hackathon.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>Start: {new Date(project.team.hackathon.startDate).toLocaleDateString()}</span>
                <span>End: {new Date(project.team.hackathon.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts or feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || ""} />
                    <AvatarFallback className="text-xs">
                      {comment.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 