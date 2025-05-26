import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { TeamSearch } from "@/components/teams/team-search"
import { MyTeams } from "@/components/teams/my-teams"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function TeamsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Teams</h1>
              <p className="text-muted-foreground">Find teammates or create your own team for upcoming hackathons</p>
            </div>
            <CreateTeamDialog>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </CreateTeamDialog>
          </div>

          <MyTeams />
          <TeamSearch />
        </div>
      </main>
    </div>
  )
}
