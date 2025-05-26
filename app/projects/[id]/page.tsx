import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { ProjectDetail } from "@/components/projects/project-detail"

async function getProject(id: string) {
  try {
    const { prisma } = await import("@/lib/prisma")
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                  },
                },
              },
            },
            hackathon: {
              select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        endorsements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            endorsements: true,
          },
        },
      },
    })

    return project
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProjectDetail project={project} currentUser={session.user} />
      </main>
    </div>
  )
} 