"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { Layers, CheckCircle2, Calculator, FileCheck } from "lucide-react"

interface ExamGroupStatsCardsProps {
  totalCount?: number
  typeCounts?: Record<string, number>
  publishedCount?: number
  draftCount?: number
  isLoading?: boolean
}

export function ExamGroupStatsCards({
  totalCount = 0,
  typeCounts = {},
  publishedCount = 0,
  draftCount = 0,
  isLoading = false,
}: ExamGroupStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl bg-surface-container-high" />
        ))}
      </div>
    )
  }

  const modelTestsCount = typeCounts["MODEL_TEST"] ?? 0
  const termExamsCount = typeCounts["TERM_EXAM"] ?? 0
  const weeklySeriesCount = typeCounts["WEEKLY_SERIES"] ?? 0

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Groups */}
      <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
            Total Groups
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            {totalCount}
          </h3>
          <p className="mt-0.5 text-xs text-outline">
            All Evaluation Series
          </p>
        </div>
      </div>

      {/* Published & Active */}
      <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
            Published Groups
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-emerald-600">
            {publishedCount}
          </h3>
          <p className="mt-0.5 text-xs text-outline">
            Active for Students
          </p>
        </div>
      </div>

      {/* Draft Groups */}
      <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <FileCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
            Draft Groups
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-amber-600">
            {draftCount}
          </h3>
          <p className="mt-0.5 text-xs text-outline">
            In Preparation
          </p>
        </div>
      </div>

      {/* Model Tests Count */}
      <div className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <p className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
            Model Tests
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-indigo-600">
            {modelTestsCount}
          </h3>
          <p className="mt-0.5 text-xs text-outline">
            {termExamsCount} Term Exams, {weeklySeriesCount} Weekly
          </p>
        </div>
      </div>
    </div>
  )
}
