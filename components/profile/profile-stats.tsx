import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Code, Calendar } from "lucide-react"

export function ProfileStats() {
  const stats = [
    {
      label: "Hackathons Joined",
      value: "12",
      icon: Calendar,
    },
    {
      label: "Teams Formed",
      value: "5",
      icon: Users,
    },
    {
      label: "Projects Created",
      value: "8",
      icon: Code,
    },
    {
      label: "Awards Won",
      value: "3",
      icon: Trophy,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
