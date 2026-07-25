"use client"

interface QuestionBankStatsCardsProps {
  totalCount: number
  mathCount: number
  nonMathCount: number
  typeCounts?: Record<string, number>
}

export function QuestionBankStatsCards({
  totalCount,
  mathCount,
  nonMathCount,
  typeCounts = {},
}: QuestionBankStatsCardsProps) {
  const typeEntries = Object.entries(typeCounts).slice(0, 2)

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Active MCQs */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-primary">
            library_books
          </span>
          <span className="rounded bg-emerald-50 px-2 py-1 font-label-sm text-xs font-semibold text-emerald-600">
            Active
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Total Questions
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

      {/* Card 3: Non-Math Questions */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-tertiary">
            article
          </span>
          <span className="rounded bg-surface-container px-2 py-1 font-label-sm text-xs font-semibold text-outline">
            Text
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Text Questions
        </p>
        <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
          {nonMathCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 4: Type Breakdown */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="material-symbols-outlined text-3xl text-primary">
            category
          </span>
          <span className="rounded bg-primary/10 px-2 py-1 font-label-sm text-xs font-semibold text-primary">
            Types
          </span>
        </div>
        <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
          Question Types
        </p>
        {typeEntries.length > 0 ? (
          <div className="space-y-1 mt-2">
            {typeEntries.map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between text-xs"
              >
                <span className="truncate text-on-surface-variant">{type}</span>
                <span className="font-bold text-on-surface ml-2">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="font-headline-md text-3xl font-extrabold text-on-surface">
            {Object.keys(typeCounts).length}
          </h3>
        )}
      </div>
    </div>
  )
}
