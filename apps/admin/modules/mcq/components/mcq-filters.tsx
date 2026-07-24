"use client"

import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

interface SubjectOption {
  id: string
  name: string
  nameBn: string
}

interface ChapterOption {
  id: string
  name: string
  nameBn: string
  subjectId: string
}

interface McqFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedSubjectId: string
  onSubjectChange: (value: string) => void
  subjects?: SubjectOption[]
  selectedChapterId: string
  onChapterChange: (value: string) => void
  chapters?: ChapterOption[]
  selectedType: string
  onTypeChange: (value: string) => void
  selectedIsMath: string
  onIsMathChange: (value: string) => void
  selectedIsActive: string
  onIsActiveChange: (value: string) => void
  selectedSort: string
  onSortChange: (value: string) => void
  selectedLimit: number
  onLimitChange: (value: number) => void
}

export function McqFilters({
  searchQuery,
  onSearchChange,
  selectedSubjectId,
  onSubjectChange,
  subjects = [],
  selectedChapterId,
  onChapterChange,
  chapters = [],
  selectedType,
  onTypeChange,
  selectedIsMath,
  onIsMathChange,
  selectedIsActive,
  onIsActiveChange,
  selectedSort,
  onSortChange,
  selectedLimit,
  onLimitChange,
}: McqFiltersProps) {
  const filteredChapters = selectedSubjectId !== "All"
    ? chapters.filter((c) => c.subjectId === selectedSubjectId)
    : chapters

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <Input
            type="text"
            placeholder="Search question, explanation, context..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white py-2.5 pl-10 pr-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto"
          />
        </div>

        {/* Subject Filter */}
        <div className="min-w-[180px]">
          <Select
            value={selectedSubjectId}
            onValueChange={(val) => {
              onSubjectChange(val ?? "All")
              onChapterChange("All")
            }}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
              <SelectItem value="All">All Subjects</SelectItem>
              {subjects.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {`${sub.nameBn} (${sub.name})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Filter */}
        <div className="min-w-[180px]">
          <Select
            value={selectedChapterId}
            onValueChange={(val) => onChapterChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Chapters" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
              <SelectItem value="All">All Chapters</SelectItem>
              {filteredChapters.map((ch) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {`${ch.nameBn} (${ch.name})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="min-w-[140px]">
          <Select
            value={selectedType}
            onValueChange={(val) => onTypeChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="SINGLE">SINGLE</SelectItem>
              <SelectItem value="MULTIPLE">MULTIPLE</SelectItem>
              <SelectItem value="COMBINED">COMBINED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Math Filter */}
        <div className="min-w-[130px]">
          <Select
            value={selectedIsMath}
            onValueChange={(val) => onIsMathChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Math Modes" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">All Math Modes</SelectItem>
              <SelectItem value="true">Math / LaTeX</SelectItem>
              <SelectItem value="false">Standard Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Status Filter */}
        <div className="min-w-[130px]">
          <Select
            value={selectedIsActive}
            onValueChange={(val) => onIsActiveChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="min-w-[160px]">
          <Select
            value={selectedSort}
            onValueChange={(val) => onSortChange(val ?? "All")}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="Default Sort" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="All">Default Sort</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="question_asc">Question (A to Z)</SelectItem>
              <SelectItem value="question_desc">Question (Z to A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Limit Select */}
        <div className="min-w-[120px]">
          <Select
            value={String(selectedLimit)}
            onValueChange={(val) => onLimitChange(Number(val) || 10)}
          >
            <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between">
              <SelectValue placeholder="10 per page" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
