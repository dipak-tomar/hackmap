import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
                  },
                },
              },
            },
            hackathon: {
              select: {
                id: true,
                title: true,
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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.teamId) {
      return NextResponse.json({ error: "Title, description, and teamId are required" }, { status: 400 })
    }

    // Convert techStack array to JSON string
    const projectData = {
      ...data,
      techStack: JSON.stringify(data.techStack || []),
    }

    const project = await prisma.project.create({
      data: projectData,
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
                  },
                },
              },
            },
            hackathon: {
              select: {
                id: true,
                title: true,
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
