"use client"

import { ClipboardList, CheckCircle2, Clock, Archive } from "lucide-react"

interface ExamStatsCardsProps {
  totalCount?: number
  statusCounts?: Record<string, number>
  typeCounts?: Record<string, number>
  isLoading?: boolean
}

export function ExamStatsCards({
  totalCount = 0,
  statusCounts = {},
  typeCounts = {},
  isLoading = false,
}: ExamStatsCardsProps) {
  const publishedCount = statusCounts["Published"] ?? 0
  const pendingCount = statusCounts["Pending"] ?? 0
  const archivedCount = statusCounts["Archived"] ?? 0

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-outline-variant/40 bg-surface-container-low"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Exams */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-sm text-xs font-semibold uppercase tracking-wider text-outline">
              Total Exams
            </p>
            <h3 className="mt-2 font-headline-md text-3xl font-extrabold text-on-surface">
              {totalCount}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-3 font-body-md text-xs text-on-surface-variant">
          Configured in system
        </p>
      </div>

      {/* Published Exams */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-sm text-xs font-semibold uppercase tracking-wider text-outline">
              Published & Active
            </p>
            <h3 className="mt-2 font-headline-md text-3xl font-extrabold text-emerald-600">
              {publishedCount}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-3 font-body-md text-xs text-on-surface-variant">
          Available to students
        </p>
      </div>

      {/* Pending Exams */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-sm text-xs font-semibold uppercase tracking-wider text-outline">
              Draft / Pending
            </p>
            <h3 className="mt-2 font-headline-md text-3xl font-extrabold text-amber-600">
              {pendingCount}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-3 font-body-md text-xs text-on-surface-variant">
          In prep or scheduled
        </p>
      </div>

      {/* Archived Exams */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-sm text-xs font-semibold uppercase tracking-wider text-outline">
              Archived
            </p>
            <h3 className="mt-2 font-headline-md text-3xl font-extrabold text-on-surface-variant">
              {archivedCount}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
            <Archive className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-3 font-body-md text-xs text-on-surface-variant">
          Past assessments
        </p>
      </div>
    </div>
  )
}
