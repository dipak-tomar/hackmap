import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Users, Lightbulb } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Find Hackathons",
      description: "Discover new events to join",
      icon: Search,
      href: "/hackathons",
      variant: "default" as const,
    },
    {
      title: "Create Team",
      description: "Start building your dream team",
      icon: Plus,
      href: "/teams",
      variant: "outline" as const,
    },
    {
      title: "Join Team",
      description: "Find teams looking for members",
      icon: Users,
      href: "/teams",
      variant: "outline" as const,
    },
    {
      title: "Post Project Idea",
      description: "Share your innovative concepts",
      icon: Lightbulb,
      href: "/projects",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant} className="w-full justify-start h-auto p-4" asChild>
              <Link href={action.href}>
                <action.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
