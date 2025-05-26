import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { ProjectFilters } from "@/components/projects/project-filters"
import { ProjectGrid } from "@/components/projects/project-grid"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ProjectsPage() {
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
              <h1 className="text-3xl font-bold">Project Ideas</h1>
              <p className="text-muted-foreground">Share your project ideas and get feedback from the community</p>
            </div>
            <CreateProjectDialog>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Idea
              </Button>
            </CreateProjectDialog>
          </div>

          <ProjectFilters />
          <ProjectGrid />
        </div>
      </main>
    </div>
  )
}
