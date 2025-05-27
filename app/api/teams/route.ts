import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const hackathonId = searchParams.get("hackathonId")
    const search = searchParams.get("search")

    const where: any = {}
    
    if (hackathonId) {
      where.hackathonId = hackathonId
    }

    // Add search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          hackathon: {
            title: { contains: search, mode: "insensitive" }
          }
        }
      ]
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                skills: true,
              },
            },
          },
        },
        hackathon: {
          select: {
            id: true,
            title: true,
            maxTeamSize: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
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
    if (!data.name || !data.hackathonId) {
      return NextResponse.json({ error: "Name and hackathonId are required" }, { status: 400 })
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      console.error("User not found in database:", session.user.id)
      return NextResponse.json({ error: "User not found. Please sign out and sign in again." }, { status: 404 })
    }

    // Check if hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: data.hackathonId },
    })
    console.log("hackathon", hackathon,data)
    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
    }

    const team = await prisma.team.create({
      data: {
        ...data,
        leaderId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "LEADER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                skills: true,
              },
            },
          },
        },
        hackathon: {
          select: {
            id: true,
            title: true,
            maxTeamSize: true,
          },
        },
      },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error: any) {
    console.error("Error creating team:", error)
    if (error?.code === 'P2003') {
      return NextResponse.json({ 
        error: "Database constraint violation. Please sign out and sign in again." 
      }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
