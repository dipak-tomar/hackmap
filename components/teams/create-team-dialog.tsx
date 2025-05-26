"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"

interface Hackathon {
  id: string
  title: string
  theme: string
  startDate: string
  endDate: string
  registrationDeadline: string
}

interface CreateTeamDialogProps {
  children: React.ReactNode
}

export function CreateTeamDialog({ children }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [hackathonId, setHackathonId] = useState("")
  const [loading, setLoading] = useState(false)
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loadingHackathons, setLoadingHackathons] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch hackathons when dialog opens
  useEffect(() => {
    if (open) {
      fetchHackathons()
    }
  }, [open])

  const fetchHackathons = async () => {
    setLoadingHackathons(true)
    try {
      const response = await fetch("/api/hackathons?status=registration_open")
      if (response.ok) {
        const data = await response.json()
        // The API returns { hackathons: [...], pagination: {...} }
        // API already filters for hackathons with open registration
        setHackathons(data.hackathons || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load hackathons",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hackathons",
        variant: "destructive",
      })
    } finally {
      setLoadingHackathons(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          hackathonId,
        }),
      })

      if (response.ok) {
        const team = await response.json()
        toast({
          title: "Success",
          description: "Team created successfully",
        })
        setOpen(false)
        router.push(`/teams/${team.id}`)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create team",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>Create a team for an upcoming hackathon and start recruiting members.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hackathon">Hackathon</Label>
            <Select value={hackathonId} onValueChange={setHackathonId} required>
              <SelectTrigger>
                <SelectValue placeholder={loadingHackathons ? "Loading hackathons..." : "Select a hackathon"} />
              </SelectTrigger>
              <SelectContent>
                {hackathons.length === 0 && !loadingHackathons ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No hackathons with open registration
                  </div>
                ) : (
                  hackathons.map((hackathon) => (
                    <SelectItem key={hackathon.id} value={hackathon.id}>
                      {hackathon.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your team's goals and what you're looking for in teammates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
