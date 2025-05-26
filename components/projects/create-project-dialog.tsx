"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateProjectDialogProps {
  children: React.ReactNode
}

interface Team {
  id: string
  name: string
  hackathon: {
    id: string
    title: string
    maxTeamSize: number
  }
  members: Array<{
    user: {
      id: string
      name: string | null
    }
  }>
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [teamId, setTeamId] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch user's teams when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeams()
    }
  }, [open])

  const fetchTeams = async () => {
    setTeamsLoading(true)
    try {
      const response = await fetch("/api/teams")
      if (response.ok) {
        const data = await response.json()
        // Filter teams where the current user is a member
        setTeams(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch teams",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      })
    } finally {
      setTeamsLoading(false)
    }
  }

  const addTech = () => {
    if (newTech && !techStack.includes(newTech)) {
      setTechStack([...techStack, newTech])
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          teamId,
          techStack,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project idea posted successfully",
        })
        setOpen(false)
        // Reset form
        setTitle("")
        setDescription("")
        setTeamId("")
        setTechStack([])
        setTeams([])
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to post project idea",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Post Project Idea</DialogTitle>
          <DialogDescription>Share your project idea with the community and get feedback.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select value={teamId} onValueChange={setTeamId} required>
              <SelectTrigger>
                <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select your team"} />
              </SelectTrigger>
              <SelectContent>
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} - {team.hackathon.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    {teamsLoading ? "Loading..." : "No teams found. Create a team first."}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project idea, goals, and what makes it unique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              />
              <Button type="button" onClick={addTech} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTech(tech)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Idea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
