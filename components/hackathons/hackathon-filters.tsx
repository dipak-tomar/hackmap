"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export function HackathonFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/hackathons?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/hackathons?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      <div className="flex gap-2">
        <Select
          value={searchParams.get("theme") || "all"}
          onValueChange={(value) => handleFilterChange("theme", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            <SelectItem value="ai">AI & Machine Learning</SelectItem>
            <SelectItem value="web3">Web3 & Blockchain</SelectItem>
            <SelectItem value="fintech">FinTech</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="sustainability">Sustainability</SelectItem>
            <SelectItem value="gaming">Gaming</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="registration_open">Registration Open</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" size="icon" variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
