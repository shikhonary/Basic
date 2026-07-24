"use client"

interface McqStatsCardsProps {
  totalCount: number
  activeCount: number
  inactiveCount: number
  mathCount: number
  typeCounts?: Record<string, number>
}

export function McqStatsCards({
  totalCount,
  activeCount,
  inactiveCount,
  mathCount,
}: McqStatsCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total MCQs */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-primary">
            fact_check
          </span>
          <span className="rounded bg-emerald-50 px-2 py-1 font-label-sm text-xs font-semibold text-emerald-600">
            Total
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Total MCQs
        </p>
        <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
          {totalCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 2: Math Questions */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-secondary">
            functions
          </span>
          <span className="rounded bg-surface-container px-2 py-1 font-label-sm text-xs font-semibold text-outline">
            Math / LaTeX
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Math Questions
        </p>
        <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
          {mathCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 3: Active MCQs */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-emerald-600">
            check_circle
          </span>
          <span className="rounded bg-emerald-100 px-2 py-1 font-label-sm text-xs font-semibold text-emerald-800">
            Active
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Active Questions
        </p>
        <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
          {activeCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 4: Inactive / Action Needed */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-error">
            contact_support
          </span>
          <span className="rounded bg-error-container/40 px-2 py-1 font-label-sm text-xs font-semibold text-error">
            Inactive
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Inactive / Drafts
        </p>
        <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
          {inactiveCount.toLocaleString()}
        </h3>
      </div>
    </div>
  )
}
