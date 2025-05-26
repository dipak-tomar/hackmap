"use client"

import type React from "react"

import { useState } from "react"
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

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [teamId, setTeamId] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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
                <SelectValue placeholder="Select your team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">AI Innovators</SelectItem>
                <SelectItem value="2">Green Tech Warriors</SelectItem>
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
