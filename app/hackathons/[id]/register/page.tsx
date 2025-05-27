import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { HackathonRegistration } from "@/components/hackathons/hackathon-registration"
import { prisma } from "@/lib/prisma"

async function getHackathon(id: string) {
  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        registrations: {
          select: {
            id: true,
            userId: true,
            registeredAt: true,
          },
        },
        _count: {
          select: {
            registrations: true,
            teams: true,
          },
        },
      },
    })

    return hackathon
  } catch (error) {
    console.error('Error fetching hackathon:', error)
    return null
  }
}

export default async function HackathonRegisterPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const hackathon = await getHackathon(params.id)

  if (!hackathon) {
    notFound()
  }

  // Check if user is already registered
  const userRegistration = hackathon.registrations.find(
    reg => reg.userId === session.user.id
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <HackathonRegistration 
          hackathon={hackathon} 
          currentUser={session.user}
          userRegistration={userRegistration}
        />
      </main>
    </div>
  )
} 