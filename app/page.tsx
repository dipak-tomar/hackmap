import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedHackathons } from "@/components/home/featured-hackathons"
import { StatsSection } from "@/components/home/stats-section"
import { Navbar } from "@/components/layout/navbar"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedHackathons />
        <StatsSection />
      </main>
    </div>
  )
}
