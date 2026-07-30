"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"
import { School, GraduationCap, CheckCircle2 } from "lucide-react"

interface AcademicClassStatsCardsProps {
  totalClassesCount?: number
  activeLevelsCount?: number
  isLoading?: boolean
}

export function AcademicClassStatsCards({
  totalClassesCount = 0,
  activeLevelsCount = 0,
  isLoading = false,
}: AcademicClassStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 sm:hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-md bg-surface-container-high" />
          ))}
        </div>
        <div className="hidden sm:grid grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-surface-container-high" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      {/* Mobile View (< sm): Direct Shadcn UI Badges */}
      <div className="flex flex-wrap items-center gap-2 sm:hidden">
        <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary normal-case tracking-normal">
          Total Classes: {totalClassesCount ?? 0}
        </Badge>
        <Badge variant="outline" className="rounded-md border-secondary/20 bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary normal-case tracking-normal">
          Active Levels: {activeLevelsCount ?? 0}
        </Badge>
        <Badge variant="outline" className="rounded-md border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 normal-case tracking-normal">
          Status: Optimal
        </Badge>
      </div>

      {/* Desktop & Tablet View (>= sm): Full Cards */}
      <div className="hidden sm:grid grid-cols-3 gap-4 sm:gap-6">
        {/* Total Classes */}
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <School className="h-6 w-6" />
          </div>
          <div>
            <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
              Total Classes
            </p>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">
              {totalClassesCount ?? 0}
            </h3>
            <p className="mt-0.5 text-xs text-outline">
              All System Classes
            </p>
          </div>
        </div>

        {/* Active Levels */}
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
              Active Levels
            </p>
            <h3 className="font-headline-md text-2xl font-bold text-secondary">
              {activeLevelsCount ?? 0}
            </h3>
            <p className="mt-0.5 text-xs text-outline">
              Academic Divisions
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
              System Status
            </p>
            <h3 className="font-headline-md text-2xl font-bold text-emerald-600">
              Optimal
            </h3>
            <p className="mt-0.5 text-xs text-outline">
              Operational
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
