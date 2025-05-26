import { Suspense } from "react"
import { HackathonFilters } from "@/components/hackathons/hackathon-filters"
import { HackathonGrid } from "@/components/hackathons/hackathon-grid"
import { HackathonGridSkeleton } from "@/components/hackathons/hackathon-grid-skeleton"
import { Navbar } from "@/components/layout/navbar"

interface SearchParams {
  search?: string
  theme?: string
  status?: string
  page?: string
}

export default function HackathonsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">Discover Hackathons</h1>
            <p className="text-muted-foreground">
              Find the perfect hackathon to showcase your skills and build amazing projects
            </p>
          </div>

          <Suspense fallback={<div className="h-16 bg-muted animate-pulse rounded-lg" />}>
            <HackathonFilters />
          </Suspense>

          <Suspense fallback={<HackathonGridSkeleton />}>
            <HackathonGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
