"use client"

import { Card, CardContent } from "@workspace/ui/components/card"

interface ChapterStatsCardsProps {
  totalChaptersCount: number
  activeSubjectsCount: number
}

export function ChapterStatsCards({
  totalChaptersCount,
  activeSubjectsCount,
}: ChapterStatsCardsProps) {
  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            Total Chapters
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-primary sm:text-4xl">
            {totalChaptersCount}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            Active Subjects
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-secondary sm:text-4xl">
            {activeSubjectsCount}
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            Chapter Coverage
          </p>
          <div className="mt-2 flex items-center gap-2 text-emerald-600">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-headline-md text-base font-bold sm:text-lg">Configured</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
