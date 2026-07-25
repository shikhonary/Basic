"use client"

import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Eye,
  Edit3,
  Trash2,
  Calculator,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export interface ExamGroupItemData {
  id: string
  title: string
  code?: string | null
  description?: string | null
  type: string
  calculationType: string
  bestOfNCount?: number | null
  totalMarks?: number | null
  passMarks?: number | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  isPublished: boolean
  academicClassId?: string | null
  academicClass?: {
    id: string
    nameEn: string
    nameBn: string
  } | null
  items?: Array<{
    id: string
    examId: string
    position: number
    weightage: number
    isRequired: boolean
    exam?: {
      id: string
      title: string
    }
  }>
  _count?: {
    items: number
    groupResults: number
  }
}

interface ExamGroupTableProps {
  items: ExamGroupItemData[]
  isLoading: boolean
  isError: boolean
  onEdit?: (item: ExamGroupItemData) => void
  onDelete?: (id: string, title: string) => void
  onTogglePublish?: (id: string, isPublished: boolean) => void
  onCalculateResults?: (id: string) => void
  onViewDetails?: (item: ExamGroupItemData) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ExamGroupTable({
  items,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onTogglePublish,
  onCalculateResults,
  onViewDetails,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: ExamGroupTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl bg-surface-container-high" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error-container/10 p-8 text-center">
        <p className="font-semibold text-error text-base">Failed to load Exam Groups.</p>
        <p className="mt-1 text-sm text-outline">Please refresh or try again later.</p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-12 text-center">
        <Layers className="mx-auto h-12 w-12 text-outline" />
        <h3 className="mt-4 font-bold text-lg text-on-surface">No Exam Groups Found</h3>
        <p className="mt-1 text-sm text-outline">
          Get started by creating your first model test series or exam group.
        </p>
        <div className="mt-6">
          <Link href="/exam-groups/create">
            <Button className="bg-primary text-on-primary hover:bg-primary/90">
              Create Exam Group
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const displayStart = (currentPage - 1) * itemsPerPage + 1
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "MODEL_TEST":
        return "bg-indigo-500/10 text-indigo-700 border-indigo-200"
      case "TERM_EXAM":
        return "bg-purple-500/10 text-purple-700 border-purple-200"
      case "WEEKLY_SERIES":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "SUBJECT_COMBO":
        return "bg-teal-500/10 text-teal-700 border-teal-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getCalcBadgeClass = (calcType: string) => {
    switch (calcType) {
      case "BEST_OF_N":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      case "WEIGHTED_AVERAGE":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-200"
      case "AVERAGE":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-outline-variant/30 bg-surface-container-low font-label-md text-xs uppercase tracking-wider text-outline">
              <tr>
                <th className="px-6 py-4">Title & Code</th>
                <th className="px-4 py-4">Class</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Calculation Mode</th>
                <th className="px-4 py-4 text-center">Exams Included</th>
                <th className="px-4 py-4 text-center">Results Evaluated</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {items.map((item) => {
                const examsCount = item._count?.items ?? item.items?.length ?? 0
                const resultsCount = item._count?.groupResults ?? 0

                return (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-surface-container-low/60"
                  >
                    {/* Title & Code */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/exam-groups/${item.id}`}
                          className="font-bold text-on-surface hover:text-primary transition-colors text-base"
                        >
                          {item.title}
                        </Link>
                        {item.code && (
                          <span className="font-mono text-xs text-outline mt-0.5">
                            Code: {item.code}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-4 py-4">
                      {item.academicClass ? (
                        <span className="inline-flex items-center rounded-md bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                          {item.academicClass.nameEn}
                        </span>
                      ) : (
                        <span className="text-xs text-outline font-italic">Global / All</span>
                      )}
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`text-xs font-medium ${getTypeBadgeClass(item.type)}`}>
                        {item.type.replace("_", " ")}
                      </Badge>
                    </td>

                    {/* Calculation Mode */}
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`text-xs font-medium ${getCalcBadgeClass(item.calculationType)}`}>
                        {item.calculationType === "BEST_OF_N"
                          ? `BEST OF ${item.bestOfNCount || "N"}`
                          : item.calculationType.replace("_", " ")}
                      </Badge>
                    </td>

                    {/* Exams Included */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {examsCount}
                      </span>
                    </td>

                    {/* Results Count */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {resultsCount} evaluated
                      </span>
                    </td>

                    {/* Publication Status */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() =>
                          onTogglePublish && onTogglePublish(item.id, !item.isPublished)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer hover:opacity-80"
                        title="Click to toggle publication state"
                      >
                        {item.isPublished ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <XCircle className="h-3.5 w-3.5" /> Draft
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Calculate Results */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onCalculateResults
                              ? onCalculateResults(item.id)
                              : (window.location.href = `/exam-groups/${item.id}`)
                          }
                          className="h-8 w-8 p-0 text-outline hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                          title="Calculate / Recalculate Group Results & Ranks"
                        >
                          <Calculator className="h-4 w-4" />
                        </Button>

                        {/* View Details */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onViewDetails
                              ? onViewDetails(item)
                              : (window.location.href = `/exam-groups/${item.id}`)
                          }
                          className="h-8 w-8 p-0 text-outline hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                          title="View Details & Manage Items"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Edit Group */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onEdit
                              ? onEdit(item)
                              : (window.location.href = `/exam-groups/${item.id}/edit`)
                          }
                          className="h-8 w-8 p-0 text-outline hover:text-secondary hover:bg-secondary/10 rounded-lg cursor-pointer"
                          title="Edit Exam Group Metadata"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete && onDelete(item.id, item.title)}
                          className="h-8 w-8 p-0 text-outline hover:text-error hover:bg-error-container/20 rounded-lg cursor-pointer"
                          title="Delete Exam Group"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 sm:flex-row">
        <p className="text-xs text-outline">
          Showing <span className="font-bold text-on-surface">{displayStart}-{displayEnd}</span> of{" "}
          <span className="font-bold text-on-surface">{totalItems}</span> exam groups
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1 text-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-md border border-outline-variant">
            Page {currentPage} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1 text-xs cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
