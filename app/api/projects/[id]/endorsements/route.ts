import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if already endorsed
    const existingEndorsement = await prisma.projectEndorsement.findUnique({
      where: {
        projectId_userId: {
          projectId: params.id,
          userId: user.id,
        },
      },
    })

    if (existingEndorsement) {
      return NextResponse.json({ error: "Already endorsed" }, { status: 400 })
    }

    const endorsement = await prisma.projectEndorsement.create({
      data: {
        projectId: params.id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(endorsement, { status: 201 })
  } catch (error) {
    console.error("Error creating endorsement:", error)
    return NextResponse.json({ error: "Failed to create endorsement" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const deletedEndorsement = await prisma.projectEndorsement.delete({
      where: {
        projectId_userId: {
          projectId: params.id,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting endorsement:", error)
    return NextResponse.json({ error: "Failed to delete endorsement" }, { status: 500 })
  }
} 