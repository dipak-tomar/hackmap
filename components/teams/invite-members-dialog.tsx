"use client"

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
import { Copy, Check, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InviteMembersDialogProps {
  children: React.ReactNode
  teamName: string
  inviteCode: string
  hackathonTitle: string
}

export function InviteMembersDialog({ 
  children, 
  teamName, 
  inviteCode, 
  hackathonTitle 
}: InviteMembersDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const inviteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/teams/join?code=${inviteCode}`
    : `/teams/join?code=${inviteCode}`
  
  const inviteMessage = `🚀 Join my team "${teamName}" for ${hackathonTitle}!

Use invite code: ${inviteCode}

Or join directly: ${inviteUrl}

Let's build something amazing together! 💻✨`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join team ${teamName}`,
          text: inviteMessage,
          url: inviteUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback to copying
      copyToClipboard(inviteMessage, "Invite message")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Share your team invite code or link with potential members for "{teamName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Invite Code */}
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <div className="flex gap-2">
              <Input
                id="invite-code"
                value={inviteCode}
                readOnly
                className="font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(inviteCode, "Invite code")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Members can use this code to join your team
            </p>
          </div>

          {/* Invite Link */}
          <div className="space-y-2">
            <Label htmlFor="invite-link">Direct Link</Label>
            <div className="flex gap-2">
              <Input
                id="invite-link"
                value={inviteUrl}
                readOnly
                className="text-xs"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(inviteUrl, "Invite link")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Direct link for easy joining
            </p>
          </div>

          {/* Share Options */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => copyToClipboard(inviteMessage, "Invite message")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Message
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={shareNatively}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>How to invite:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Share the invite code or link</li>
              <li>• Members go to Teams → Join Team</li>
              <li>• They enter the code or use the direct link</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 