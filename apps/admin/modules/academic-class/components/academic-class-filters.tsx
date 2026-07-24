"use client"

import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

interface AcademicClassFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedLevel: string
  onLevelChange: (value: string) => void
  selectedSort: string
  onSortChange: (value: string) => void
  selectedLimit: number
  onLimitChange: (value: number) => void
}

export function AcademicClassFilters({
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedSort,
  onSortChange,
  selectedLimit,
  onLimitChange,
}: AcademicClassFiltersProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 md:flex-row">
      <div className="flex w-full flex-1 flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            filter_list
          </span>
          <Input
            type="text"
            placeholder="Filter by English Name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white py-2.5 pl-10 pr-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto"
          />
        </div>

        <div className="min-w-[180px]">
          <Select
            value={selectedLevel}
            onValueChange={(val) => onLevelChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Secondary">Secondary</SelectItem>
              <SelectItem value="Higher Secondary (HSC)">
                Higher Secondary (HSC)
              </SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[180px]">
          <Select
            value={selectedSort}
            onValueChange={(val) => onSortChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Sorts" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">All Sorts</SelectItem>
              <SelectItem value="position_asc">Position (Low to High)</SelectItem>
              <SelectItem value="position_desc">Position (High to Low)</SelectItem>
              <SelectItem value="name_asc">Name (A to Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z to A)</SelectItem>
              <SelectItem value="newest">Newest Added</SelectItem>
              <SelectItem value="oldest">Oldest Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <Select
            value={String(selectedLimit)}
            onValueChange={(val) => onLimitChange(Number(val) || 5)}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="Items Per Page" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
