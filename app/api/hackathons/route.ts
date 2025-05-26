import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const theme = searchParams.get("theme")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 12

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (theme) {
      where.theme = theme
    }

    if (status === "upcoming") {
      where.startDate = { gt: new Date() }
    } else if (status === "ongoing") {
      where.AND = [{ startDate: { lte: new Date() } }, { endDate: { gte: new Date() } }]
    } else if (status === "registration_open") {
      where.registrationDeadline = { gt: new Date() }
    }

    const hackathons = await prisma.hackathon.findMany({
      where,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.hackathon.count({ where })

    return NextResponse.json({
      hackathons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching hackathons:", error)
    return NextResponse.json({ error: "Failed to fetch hackathons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const hackathon = await prisma.hackathon.create({
      data: {
        ...data,
        organizerId: session.user.id,
      },
    })

    return NextResponse.json(hackathon, { status: 201 })
  } catch (error) {
    console.error("Error creating hackathon:", error)
    return NextResponse.json({ error: "Failed to create hackathon" }, { status: 500 })
  }
}
