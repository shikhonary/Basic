"use client"

import { cn } from "@workspace/ui/lib/utils"
import { RenderMath } from "@workspace/ui/components/render-math"
import "katex/dist/katex.min.css"
import { Button } from "@workspace/ui/components/button"

const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"]
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"]

export interface QuestionBankMcqItem {
  id: string
  question: string
  answer: string
  options: string[]
  statements: string[]
  type: string
  isMath: boolean
  reference: string[]
  explanation?: string | null
  questionUrl?: string | null
  context?: string | null
  contextUrl?: string | null
  subjectId: string
  chapterId: string
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
  subject: {
    id: string
    name: string
    nameBn: string
    level: string
    group?: string | null
  }
  chapter: {
    id: string
    name: string
    nameBn: string
    position: number
  }
}

interface QuestionBankTableProps {
  items: QuestionBankMcqItem[]
  isLoading: boolean
  isError: boolean
  onViewDetail: (id: string) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

function MathContent({
  content,
  isMath,
}: {
  content: string
  isMath: boolean
}) {
  return <RenderMath text={content} isMath={isMath} />
}

export function QuestionBankTable({
  items,
  isLoading,
  isError,
  onViewDetail,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: QuestionBankTableProps) {
  return (
    <div className="w-full space-y-6">
      {/* Result count bar */}
      <div className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
        <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-outline">
          {isLoading
            ? "Loading…"
            : `${totalItems.toLocaleString()} question${totalItems !== 1 ? "s" : ""} found`}
        </span>
        {totalPages > 1 && (
          <span className="font-label-sm text-xs text-outline">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center text-on-surface-variant rounded-xl border border-outline-variant bg-white">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
            <span className="font-body-md text-sm font-medium">
              Loading question bank…
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="py-16 text-center text-error rounded-xl border border-error/30 bg-error-container/20">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl">error</span>
            <span className="font-body-md text-sm font-medium">
              Error loading questions. Please try refreshing the page.
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && items.length === 0 && (
        <div className="py-20 text-center text-on-surface-variant rounded-xl border border-outline-variant bg-white">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline">
              quiz
            </span>
            <p className="font-headline-md text-xl font-bold text-on-surface">
              No Questions Found
            </p>
            <p className="font-body-md text-sm text-outline max-w-sm">
              Try adjusting your filters or search query to find relevant
              questions.
            </p>
          </div>
        </div>
      )}

      {/* MCQ Card List */}
      {!isLoading && !isError && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5">
          {items.map((item, idx) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1
            const correctAnswerIndex = optionLetters.indexOf(item.answer)

            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 transition-all hover:border-primary/40 hover:shadow-md group"
              >
                <div className="flex flex-col gap-4">
                  {/* Top badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Index */}
                    <span className="px-2 py-0.5 bg-surface-container-high font-mono text-[11px] font-bold text-on-surface-variant rounded">
                      #{globalIndex}
                    </span>

                    {/* Subject */}
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded font-label-sm text-xs font-bold border border-primary/20">
                      {item.subject.nameBn || item.subject.name}
                    </span>

                    {/* Chapter */}
                    <span className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-label-sm text-xs font-semibold">
                      {item.chapter.nameBn || item.chapter.name}
                    </span>

                    {/* Type */}
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded font-label-sm text-[11px] font-bold border border-blue-100 uppercase">
                      {item.type}
                    </span>

                    {/* Math badge */}
                    {item.isMath && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded font-label-sm text-[11px] font-bold border border-amber-200">
                        <span className="material-symbols-outlined text-[14px]">
                          functions
                        </span>
                        <span>Math</span>
                      </div>
                    )}
                  </div>

                  {/* Context/Passage */}
                  {item.context && (
                    <div className="rounded-xl border border-secondary/20 bg-secondary-container/10 p-3.5 text-xs text-on-surface-variant leading-relaxed">
                      <div className="font-bold text-secondary flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">
                          article
                        </span>
                        Context / Passage:
                      </div>
                      <MathContent content={item.context} isMath={item.isMath} />
                    </div>
                  )}

                  {/* Question */}
                  <div className="font-semibold text-sm text-on-surface leading-relaxed">
                    <MathContent content={item.question} isMath={item.isMath} />
                  </div>

                  {/* Statements (for statement-based MCQs) */}
                  {item.statements && item.statements.length > 0 && (
                    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-2">
                        Statements:
                      </p>
                      {item.statements.map((stmt, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2 text-xs text-on-surface-variant"
                        >
                          <span className="font-mono font-bold text-outline shrink-0">
                            {romanNumerals[sIdx]}.
                          </span>
                          <MathContent content={stmt} isMath={item.isMath} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((option, optIdx) => {
                      const letter = optionLetters[optIdx] ?? String(optIdx + 1)
                      const isCorrect = letter === item.answer

                      return (
                        <div
                          key={optIdx}
                          className={cn(
                            "flex items-start gap-2.5 rounded-lg border px-3 py-2 text-xs transition-all",
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant",
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 font-mono font-bold w-4",
                              isCorrect ? "text-emerald-700" : "text-outline",
                            )}
                          >
                            {letter}.
                          </span>
                          <span className="leading-relaxed flex-1">
                            <MathContent content={option} isMath={item.isMath} />
                          </span>
                          {isCorrect && (
                            <span className="material-symbols-outlined text-sm shrink-0 text-emerald-600">
                              check_circle
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2 text-[11px] text-outline">
                      {item.explanation && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            info
                          </span>
                          Has explanation
                        </span>
                      )}
                      {item.reference && item.reference.length > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            book
                          </span>
                          {item.reference.length} ref
                          {item.reference.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(item.id)}
                      className="h-7 rounded-lg px-3 text-xs font-bold text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm mr-1">
                        open_in_new
                      </span>
                      View Detail
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 rounded-lg px-3 text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
            Prev
          </Button>

          <span className="font-label-sm text-xs text-outline px-2">
            {currentPage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 rounded-lg px-3 text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            Next
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
