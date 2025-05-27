import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "recent"

    const where: any = {}
    const conditions: any[] = []

    // Search filter
    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { techStack: { contains: search, mode: "insensitive" } },
          {
            team: {
              name: { contains: search, mode: "insensitive" }
            }
          }
        ]
      })
    }

    // Category filter (based on tech stack)
    if (category && category !== "all") {
      const categoryMap: { [key: string]: string[] } = {
        ai: ["AI", "ML", "Machine Learning", "TensorFlow", "PyTorch", "OpenAI"],
        web: ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS"],
        mobile: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"],
        blockchain: ["Ethereum", "Solidity", "Web3", "Bitcoin", "Blockchain"],
        iot: ["Arduino", "Raspberry Pi", "IoT", "Sensors"]
      }

      const techKeywords = categoryMap[category] || []
      if (techKeywords.length > 0) {
        conditions.push({
          OR: techKeywords.map(keyword => ({
            techStack: { contains: keyword, mode: "insensitive" }
          }))
        })
      }
    }

    // Combine conditions with AND
    if (conditions.length > 0) {
      where.AND = conditions
    }

    // Determine order by
    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "popular") {
      orderBy = { comments: { _count: "desc" } }
    } else if (sortBy === "endorsed") {
      orderBy = { endorsements: { _count: "desc" } }
    }

    const projects = await prisma.project.findMany({
      where,
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
      orderBy,
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
