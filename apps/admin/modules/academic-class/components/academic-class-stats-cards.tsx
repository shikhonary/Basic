"use client"

import { Card, CardContent } from "@workspace/ui/components/card"

interface AcademicClassStatsCardsProps {
  totalClassesCount: number
  activeLevelsCount: number
}

export function AcademicClassStatsCards({
  totalClassesCount,
  activeLevelsCount,
}: AcademicClassStatsCardsProps) {
  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            Total Classes
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-primary sm:text-4xl">
            {totalClassesCount}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            Active Levels
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-secondary sm:text-4xl">
            {activeLevelsCount}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            New Entries (MoM)
          </p>
          <p className="font-headline-md text-3xl font-extrabold text-tertiary sm:text-4xl">+2</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-0 shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <p className="mb-2 font-label-sm text-xs uppercase tracking-wider text-outline">
            System Status
          </p>
          <div className="mt-2 flex items-center gap-2 text-emerald-600">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-headline-md text-base font-bold sm:text-lg">Optimal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
