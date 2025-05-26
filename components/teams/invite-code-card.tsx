"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InviteCodeCardProps {
  inviteCode: string
}

export function InviteCodeCard({ inviteCode }: InviteCodeCardProps) {
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Invite Code</CardTitle>
        <CardDescription>
          Share this code with others to invite them to your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="bg-muted px-3 py-2 rounded font-mono text-sm flex-1">
            {inviteCode}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 