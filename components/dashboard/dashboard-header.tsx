"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <>
      <Navbar />
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name || "Developer"}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your hackathons and teams</p>
        </div>
      </div>
    </>
  )
}
