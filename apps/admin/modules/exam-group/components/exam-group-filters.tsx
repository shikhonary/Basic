"use client"

import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { useAcademicClassesForSelection } from "../../academic-class/services/use-academic-class"
import { X, RotateCcw, SlidersHorizontal, ArrowUpDown, Filter, BookOpen, Layers, Calculator, CheckSquare } from "lucide-react"

interface ExamGroupFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  selectedCalculationType: string
  onCalculationTypeChange: (value: string) => void
  selectedAcademicClassId: string
  onAcademicClassChange: (value: string) => void
  selectedIsPublished: string
  onIsPublishedChange: (value: string) => void
  selectedSort: string
  onSortChange: (value: string) => void
  onResetAll?: () => void
}

const typeOptions = [
  { label: "All Types", value: "All" },
  { label: "Model Test", value: "MODEL_TEST" },
  { label: "Term Exam", value: "TERM_EXAM" },
  { label: "Weekly Series", value: "WEEKLY_SERIES" },
  { label: "Subject Combo", value: "SUBJECT_COMBO" },
]

const calculationTypeOptions = [
  { label: "All Calc Modes", value: "All" },
  { label: "Sum (Total)", value: "SUM" },
  { label: "Average", value: "AVERAGE" },
  { label: "Weighted Avg", value: "WEIGHTED_AVERAGE" },
  { label: "Best of N", value: "BEST_OF_N" },
]

const publishOptions = [
  { label: "All Statuses", value: "All" },
  { label: "Published Only", value: "true" },
  { label: "Draft Only", value: "false" },
]

const sortOptions = [
  { label: "Default Sort", value: "All" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title (A-Z)", value: "title_asc" },
  { label: "Title (Z-A)", value: "title_desc" },
]

export function ExamGroupFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCalculationType,
  onCalculationTypeChange,
  selectedAcademicClassId,
  onAcademicClassChange,
  selectedIsPublished,
  onIsPublishedChange,
  selectedSort,
  onSortChange,
  onResetAll,
}: ExamGroupFiltersProps) {
  const { data: classesData } = useAcademicClassesForSelection()
  const academicClasses = classesData ?? []

  const hasActiveQuery = Boolean(searchQuery && searchQuery.trim() !== "")
  const hasActiveType = Boolean(selectedType && selectedType !== "All")
  const hasActiveCalculationType = Boolean(selectedCalculationType && selectedCalculationType !== "All")
  const hasActiveAcademicClassId = Boolean(selectedAcademicClassId && selectedAcademicClassId !== "All")
  const hasActiveIsPublished = Boolean(selectedIsPublished && selectedIsPublished !== "All")
  const hasActiveSort = Boolean(selectedSort && selectedSort !== "All")

  const hasAnyFilter =
    hasActiveQuery ||
    hasActiveType ||
    hasActiveCalculationType ||
    hasActiveAcademicClassId ||
    hasActiveIsPublished ||
    hasActiveSort

  const activeFilterCount =
    (hasActiveType ? 1 : 0) +
    (hasActiveCalculationType ? 1 : 0) +
    (hasActiveAcademicClassId ? 1 : 0) +
    (hasActiveIsPublished ? 1 : 0) +
    (hasActiveSort ? 1 : 0)

  const handleResetAll = () => {
    onSearchChange("")
    onTypeChange("All")
    onCalculationTypeChange("All")
    onAcademicClassChange("All")
    onIsPublishedChange("All")
    onSortChange("All")
    if (onResetAll) onResetAll()
  }

  const getSortLabel = (sort: string) => {
    return sortOptions.find(o => o.value === sort)?.label || sort
  }

  const getTypeLabel = (type: string) => {
    return typeOptions.find(o => o.value === type)?.label || type
  }

  const getCalculationTypeLabel = (calc: string) => {
    return calculationTypeOptions.find(o => o.value === calc)?.label || calc
  }

  const getPublishLabel = (pub: string) => {
    return publishOptions.find(o => o.value === pub)?.label || pub
  }

  const getAcademicClassName = (classId: string) => {
    const found = academicClasses.find((ac) => ac.id === classId)
    return found ? found.nameEn : classId
  }

  const renderSelectFilters = (isMobile = false) => (
    <>
      {/* Class Filter */}
      <div className={isMobile ? "space-y-1.5" : "min-w-[150px] flex-1 xl:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Academic Class
          </label>
        )}
        <Select
          value={selectedAcademicClassId}
          onValueChange={(val) => onAcademicClassChange(val ?? "All")}
        >
          <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between cursor-pointer">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
            <SelectItem value="All">All Classes</SelectItem>
            {academicClasses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className={isMobile ? "space-y-1.5" : "min-w-[140px] flex-1 xl:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Group Type
          </label>
        )}
        <Select
          value={selectedType}
          onValueChange={(val) => onTypeChange(val ?? "All")}
        >
          <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between cursor-pointer">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calculation Mode Filter */}
      <div className={isMobile ? "space-y-1.5" : "min-w-[140px] flex-1 xl:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Calculator className="h-3.5 w-3.5 text-primary" />
            Calculation Mode
          </label>
        )}
        <Select
          value={selectedCalculationType}
          onValueChange={(val) => onCalculationTypeChange(val ?? "All")}
        >
          <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between cursor-pointer">
            <SelectValue placeholder="Calc Mode" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
            {calculationTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Publish Status Filter */}
      <div className={isMobile ? "space-y-1.5" : "min-w-[140px] flex-1 xl:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <CheckSquare className="h-3.5 w-3.5 text-primary" />
            Publish Status
          </label>
        )}
        <Select
          value={selectedIsPublished}
          onValueChange={(val) => onIsPublishedChange(val ?? "All")}
        >
          <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between cursor-pointer">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
            {publishOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Filter */}
      <div className={isMobile ? "space-y-1.5" : "min-w-[140px] flex-1 xl:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            Sort Order
          </label>
        )}
        <Select
          value={selectedSort}
          onValueChange={(val) => onSortChange(val ?? "All")}
        >
          <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 px-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto justify-between cursor-pointer">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )

  return (
    <div className="mb-6 space-y-3">
      {/* Primary Filter Toolbar */}
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 sm:p-4">
        {/* Search Input Filter */}
        <div className="relative flex-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            filter_list
          </span>
          <Input
            type="text"
            placeholder="Search Exam Groups..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white py-2.5 pl-10 pr-4 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto"
          />
        </div>

        {/* Mobile Filter Drawer Button (Visible ONLY on mobile: xl:hidden) */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="xl:hidden flex items-center gap-2 h-10 px-3.5 bg-white border-outline-variant/40 text-sm font-medium shrink-0 rounded-lg cursor-pointer"
              type="button"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-6 space-y-5 bg-white border-t border-outline-variant/40 max-h-[90vh] overflow-y-auto">
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle className="text-base font-bold text-on-surface flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filter Exam Groups
              </DrawerTitle>
              <DrawerDescription className="text-xs text-on-surface-variant">
                Select class, configuration mode, status, and sorting options to refine exam groups.
              </DrawerDescription>
            </DrawerHeader>

            {/* Stacked Filter Selects */}
            <div className="space-y-4 pt-1">
              {renderSelectFilters(true)}
            </div>

            <DrawerFooter className="p-0 pt-3 flex flex-row items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleResetAll}
                className="flex-1 h-10 text-xs font-bold border-outline-variant/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
              <DrawerClose asChild>
                <Button className="flex-1 h-10 text-xs font-bold bg-primary text-white cursor-pointer" type="button">
                  Apply Filters
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Desktop Filter Selects (Visible ONLY on desktop: hidden xl:flex) */}
        <div className="hidden xl:flex flex-wrap items-center gap-3">
          {renderSelectFilters(false)}
        </div>
      </div>

      {/* Active Filter Badges & Reset Row */}
      {hasAnyFilter && (
        <div className="flex flex-col gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:border-0 sm:p-0 sm:px-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-outline text-[11px] sm:text-xs uppercase tracking-wider">
              Active Filters:
            </span>

            {/* Search Query Badge */}
            {hasActiveQuery && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal max-w-[200px] truncate"
              >
                <span className="truncate">Search: &quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Academic Class Badge */}
            {hasActiveAcademicClassId && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal shrink-0"
              >
                <span>Class: {getAcademicClassName(selectedAcademicClassId)}</span>
                <button
                  type="button"
                  onClick={() => onAcademicClassChange("All")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove class filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Group Type Badge */}
            {hasActiveType && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal shrink-0"
              >
                <span>Type: {getTypeLabel(selectedType)}</span>
                <button
                  type="button"
                  onClick={() => onTypeChange("All")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove type filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Calculation Mode Badge */}
            {hasActiveCalculationType && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal shrink-0"
              >
                <span>Calc Mode: {getCalculationTypeLabel(selectedCalculationType)}</span>
                <button
                  type="button"
                  onClick={() => onCalculationTypeChange("All")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove calculation mode filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Publication Status Badge */}
            {hasActiveIsPublished && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal shrink-0"
              >
                <span>Status: {getPublishLabel(selectedIsPublished)}</span>
                <button
                  type="button"
                  onClick={() => onIsPublishedChange("All")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove status filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Sort Badge */}
            {hasActiveSort && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-1 text-[11px] sm:text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal shrink-0"
              >
                <span>Sort: {getSortLabel(selectedSort)}</span>
                <button
                  type="button"
                  onClick={() => onSortChange("newest")}
                  className="rounded-full p-0.5 hover:bg-outline-variant/30 transition-colors cursor-pointer shrink-0"
                  title="Remove sort filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Reset All Badge */}
          <div className="flex justify-end border-t border-outline-variant/20 pt-2 sm:border-0 sm:pt-0">
            <button
              type="button"
              onClick={handleResetAll}
              className="cursor-pointer focus:outline-hidden"
              title="Reset all active filters"
            >
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 rounded-md border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] sm:text-xs font-bold text-primary hover:bg-primary/20 transition-colors normal-case tracking-normal"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All</span>
              </Badge>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
