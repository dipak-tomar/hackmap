"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ProjectFiltersProps {
  onFiltersChange: (filters: {
    search: string
    category: string
    sortBy: string
  }) => void
}

export function ProjectFilters({ onFiltersChange }: ProjectFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Memoize the callback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback(() => {
    onFiltersChange({ search, category, sortBy })
  }, [search, category, sortBy, onFiltersChange])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFiltersChange()
    }, 300)

    return () => clearTimeout(timer)
  }, [handleFiltersChange])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ai">AI & ML</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile Apps</SelectItem>
            <SelectItem value="blockchain">Blockchain</SelectItem>
            <SelectItem value="iot">IoT</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="endorsed">Most Endorsed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
