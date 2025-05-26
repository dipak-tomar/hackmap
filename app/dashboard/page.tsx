import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { TeamStatus } from "@/components/dashboard/team-status"
import { Notifications } from "@/components/dashboard/notifications"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UpcomingEvents />
            <TeamStatus />
          </div>
          <div className="space-y-8">
            <QuickActions />
            <Notifications />
          </div>
        </div>
      </main>
    </div>
  )
}
