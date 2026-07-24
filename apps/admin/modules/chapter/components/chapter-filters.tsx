"use client"

import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

interface SubjectOption {
  id: string
  name: string
  nameBn: string
  level?: string
  group?: string | null
}

interface ChapterFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedSubjectId: string
  onSubjectChange: (value: string) => void
  subjects?: SubjectOption[]
  selectedSort: string
  onSortChange: (value: string) => void
  selectedLimit: number
  onLimitChange: (value: number) => void
}

export function ChapterFilters({
  searchQuery,
  onSearchChange,
  selectedSubjectId,
  onSubjectChange,
  subjects = [],
  selectedSort,
  onSortChange,
  selectedLimit,
  onLimitChange,
}: ChapterFiltersProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 md:flex-row">
      <div className="flex w-full flex-1 flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <Input
            type="text"
            placeholder="Search Chapter Name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white py-2.5 pl-10 pr-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto"
          />
        </div>

        {/* Subject Filter */}
        <div className="min-w-[220px]">
          <Select
            value={selectedSubjectId}
            onValueChange={(val) => onSubjectChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
              <SelectItem value="All" label="All Subjects">All Subjects</SelectItem>
              {subjects.map((sub) => (
                <SelectItem
                  key={sub.id}
                  value={sub.id}
                  label={`${sub.name} (${sub.nameBn})`}
                >
                  {sub.name} ({sub.nameBn})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="min-w-[170px]">
          <Select
            value={selectedSort}
            onValueChange={(val) => onSortChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Sorts" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All" label="Default Order">Default Order</SelectItem>
              <SelectItem value="position_asc" label="Position (Low to High)">Position (Low to High)</SelectItem>
              <SelectItem value="position_desc" label="Position (High to Low)">Position (High to Low)</SelectItem>
              <SelectItem value="name_asc" label="Name (A to Z)">Name (A to Z)</SelectItem>
              <SelectItem value="name_desc" label="Name (Z to A)">Name (Z to A)</SelectItem>
              <SelectItem value="newest" label="Newest Added">Newest Added</SelectItem>
              <SelectItem value="oldest" label="Oldest Added">Oldest Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Limit Select */}
        <div className="min-w-[130px]">
          <Select
            value={String(selectedLimit)}
            onValueChange={(val) => onLimitChange(Number(val) || 10)}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="Items Per Page" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="5" label="5 per page">5 per page</SelectItem>
              <SelectItem value="10" label="10 per page">10 per page</SelectItem>
              <SelectItem value="20" label="20 per page">20 per page</SelectItem>
              <SelectItem value="50" label="50 per page">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
