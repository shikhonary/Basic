"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Eye,
  Pen,
  Trash,
  Calculator,
  Layers,
  CheckCircle2,
  XCircle,
  MoreVertical,
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
  createdAt?: string | Date | null
  group?: string | null
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l > 2) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

interface ExamGroupTableProps {
  items: ExamGroupItemData[]
  isLoading: boolean
  isError: boolean
  isDeleting?: boolean
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
  onLimitChange?: (limit: number) => void
}

export function ExamGroupTable({
  items,
  isLoading,
  isError,
  isDeleting = false,
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
  onLimitChange,
}: ExamGroupTableProps) {
  const router = useRouter()
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "MODEL_TEST":
        return "bg-indigo-500/10 text-indigo-700 border-indigo-200/50"
      case "TERM_EXAM":
        return "bg-purple-500/10 text-purple-700 border-purple-200/50"
      case "WEEKLY_SERIES":
        return "bg-blue-500/10 text-blue-700 border-blue-200/50"
      case "SUBJECT_COMBO":
        return "bg-teal-500/10 text-teal-700 border-teal-200/50"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200/50"
    }
  }

  const getCalcBadgeClass = (calcType: string) => {
    switch (calcType) {
      case "BEST_OF_N":
        return "bg-amber-500/10 text-amber-700 border-amber-200/50"
      case "WEIGHTED_AVERAGE":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-200/50"
      case "AVERAGE":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200/50"
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-200/50"
    }
  }

  const getGroupBadgeClass = (group: string | null | undefined) => {
    switch (group) {
      case "Science":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200/50"
      case "Commerce":
        return "bg-blue-500/10 text-blue-700 border-blue-200/50"
      case "Arts":
        return "bg-amber-500/10 text-amber-700 border-amber-200/50"
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-200/50"
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs p-4 md:p-12">
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-[156px] w-full rounded-xl bg-surface-container-high"
            />
          ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:block space-y-4">
          <div className="h-10 animate-pulse rounded-lg bg-surface-container-low" />
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 animate-pulse rounded-lg bg-surface-container-low/40"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs mx-auto max-w-md p-8 sm:p-16 text-center text-error">
        <span className="material-symbols-outlined text-4xl sm:text-5xl">error</span>
        <h3 className="mt-4 font-headline-md text-base sm:text-lg font-bold text-on-surface">
          Connection Failed
        </h3>
        <p className="mt-2 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Failed to retrieve exam group records. Check network configurations or try refreshing the dashboard.
        </p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs mx-auto max-w-md p-8 sm:p-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-container text-outline">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-headline-md text-lg font-bold text-on-surface">
          No Exam Groups Found
        </h3>
        <p className="mt-2 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Establish your first evaluation series or exam group to bundle individual tests.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-2.5 sm:py-3 font-headline-md text-xs sm:text-sm font-bold text-on-primary-container shadow-xs transition-all active:scale-95 hover:bg-primary hover:text-white h-auto normal-case tracking-normal cursor-pointer"
          >
            <Link href="/exam-groups/create">
              <span className="material-symbols-outlined text-sm sm:text-base">add</span>
              <span>Create Exam Group</span>
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
      {/* Mobile Card List View (< md) */}
      <div className="grid grid-cols-1 gap-3 p-3.5 sm:p-4 md:hidden">
        {items.map((item) => {
          const examsCount = item._count?.items ?? item.items?.length ?? 0
          const resultsCount = item._count?.groupResults ?? 0

          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 p-3 sm:p-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-headline-md text-base font-extrabold text-on-surface truncate">
                      {item.title}
                    </h4>
                    {item.code && (
                      <p className="font-mono text-xs font-medium text-outline mt-0.5 truncate">
                        Code: {item.code}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge className="inline-flex items-center rounded-full bg-secondary-container/10 px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-secondary border-0 shadow-none">
                        {item.academicClass ? item.academicClass.nameEn : "Global"}
                      </Badge>
                      {item.group && (
                        <Badge variant="outline" className={`inline-flex items-center px-2 py-0.5 font-label-sm text-[10px] font-medium border uppercase ${getGroupBadgeClass(item.group)}`}>
                          {item.group}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`inline-flex items-center px-2 py-0.5 font-label-sm text-[10px] font-medium border uppercase ${getTypeBadgeClass(item.type)}`}>
                        {item.type.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className={`inline-flex items-center px-2 py-0.5 font-label-sm text-[10px] font-medium border uppercase ${getCalcBadgeClass(item.calculationType)}`}>
                        {item.calculationType === "BEST_OF_N"
                          ? `BEST OF ${item.bestOfNCount || "N"}`
                          : item.calculationType.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high cursor-pointer h-8 w-8 shrink-0"
                      title="Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-outline-variant shadow-md rounded-xl p-1.5 min-w-[150px]">
                    <DropdownMenuItem
                      onClick={() => onCalculateResults && onCalculateResults(item.id)}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                    >
                      <Calculator className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Calculate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onViewDetails ? onViewDetails(item) : router.push(`/exam-groups/${item.id}`)}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>View Items</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit ? onEdit(item) : router.push(`/exam-groups/${item.id}/edit`)}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                    >
                      <Pen className="h-3.5 w-3.5 text-secondary" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete && onDelete(item.id, item.title)}
                      disabled={isDeleting}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 disabled:opacity-50"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignments Count Summary */}
              <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-xs text-on-surface-variant font-medium">
                <span>Exams: <span className="font-bold text-primary">{examsCount}</span></span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {resultsCount} Evaluated
                </span>
                <button
                  type="button"
                  onClick={() => onTogglePublish && onTogglePublish(item.id, !item.isPublished)}
                  className="cursor-pointer outline-hidden hover:opacity-85"
                >
                  {item.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                      Draft
                    </span>
                  )}
                </button>
              </div>

              {/* Card Footer Info */}
              <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-[11px] text-outline">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  <span>
                    Added {new Date((item.startDate || item.createdAt) ?? new Date()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-[10px] text-outline/80">
                  ID: {item.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block">
        <Table className="w-full text-left font-body-md">
          <TableHeader className="bg-surface-container-low border-b border-outline-variant">
            <TableRow className="border-b border-outline-variant bg-surface-container-low hover:bg-surface-container-low">
              <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Title & Code
              </TableHead>
              <TableHead className="px-4 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Class
              </TableHead>
              <TableHead className="px-4 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Group
              </TableHead>
              <TableHead className="px-4 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Type
              </TableHead>
              <TableHead className="px-4 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Calculation Mode
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Exams Included
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Results
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-outline-variant/30">
            {items.map((item) => {
              const examsCount = item._count?.items ?? item.items?.length ?? 0
              const resultsCount = item._count?.groupResults ?? 0

              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-surface-container-low transition-all duration-200 ease-in-out group border-b border-outline-variant/30"
                >
                  {/* Title & Code */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <div className="flex flex-col">
                      <Link
                        href={`/exam-groups/${item.id}`}
                        className="font-headline-md text-base font-bold text-on-surface hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                      {item.code && (
                        <span className="font-mono text-xs text-outline mt-0.5">
                          Code: {item.code}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Class */}
                  <TableCell className="py-5 group-hover:py-6 px-4 transition-all duration-200 ease-in-out">
                    {item.academicClass ? (
                      <Badge className="inline-flex items-center rounded-full bg-secondary-container/10 px-3 py-1 font-label-sm text-xs font-bold uppercase text-secondary border-0 shadow-none">
                        {item.academicClass.nameEn}
                      </Badge>
                    ) : (
                      <span className="text-xs text-outline italic">Global / All</span>
                    )}
                  </TableCell>
                  
                  {/* Group */}
                  <TableCell className="py-5 group-hover:py-6 px-4 transition-all duration-200 ease-in-out">
                    {item.group ? (
                      <Badge variant="outline" className={`text-xs font-medium border uppercase ${getGroupBadgeClass(item.group)}`}>
                        {item.group}
                      </Badge>
                    ) : (
                      <span className="text-xs text-outline italic">Common</span>
                    )}
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-5 group-hover:py-6 px-4 transition-all duration-200 ease-in-out">
                    <Badge variant="outline" className={`text-xs font-medium border ${getTypeBadgeClass(item.type)}`}>
                      {item.type.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  {/* Calculation Mode */}
                  <TableCell className="py-5 group-hover:py-6 px-4 transition-all duration-200 ease-in-out">
                    <Badge variant="outline" className={`text-xs font-medium border ${getCalcBadgeClass(item.calculationType)}`}>
                      {item.calculationType === "BEST_OF_N"
                        ? `BEST OF ${item.bestOfNCount || "N"}`
                        : item.calculationType.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  {/* Exams Included */}
                  <TableCell className="py-5 group-hover:py-6 px-4 text-center transition-all duration-200 ease-in-out">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {examsCount}
                    </span>
                  </TableCell>

                  {/* Results Count */}
                  <TableCell className="py-5 group-hover:py-6 px-4 text-center transition-all duration-200 ease-in-out">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {resultsCount} evaluated
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-5 group-hover:py-6 px-4 text-center transition-all duration-200 ease-in-out">
                    <button
                      onClick={() =>
                        onTogglePublish && onTogglePublish(item.id, !item.isPublished)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer hover:opacity-85 outline-hidden"
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
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-5 group-hover:py-6 px-6 text-right transition-all duration-200 ease-in-out">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high cursor-pointer h-auto w-auto"
                          title="Actions"
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-outline-variant shadow-md rounded-xl p-1.5 min-w-[150px]">
                        <DropdownMenuItem
                          onClick={() => onCalculateResults && onCalculateResults(item.id)}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                        >
                          <Calculator className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Calculate Results</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewDetails ? onViewDetails(item) : router.push(`/exam-groups/${item.id}`)}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit ? onEdit(item) : router.push(`/exam-groups/${item.id}/edit`)}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                        >
                          <Pen className="h-3.5 w-3.5 text-secondary" />
                          <span>Edit Metadata</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete && onDelete(item.id, item.title)}
                          disabled={isDeleting}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 disabled:opacity-50"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          <span>Delete Group</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{displayStart}-{displayEnd}</span> of <span className="font-bold text-on-surface">{totalItems}</span> exam groups
          </p>
          {onLimitChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-outline font-medium">Rows per page:</span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(val) => onLimitChange(Number(val) || 5)}
              >
                <SelectTrigger className="h-8 rounded-lg border border-outline-variant bg-white px-2.5 font-body-md text-xs outline-hidden focus:ring-2 focus:ring-primary/10 w-auto gap-1">
                  <SelectValue placeholder="Per Page" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg min-w-[80px]">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="size-8 sm:size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30 cursor-pointer bg-white"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">chevron_left</span>
          </Button>
          {getPageNumbers(currentPage, totalPages).map((pageNum, idx) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="inline-flex size-8 sm:size-10 items-center justify-center font-body-md text-xs sm:text-sm text-outline select-none"
                >
                  ...
                </span>
              )
            }
            return (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "ghost"}
                onClick={() => onPageChange(Number(pageNum))}
                className={`size-8 sm:size-10 rounded-lg font-body-md text-xs sm:text-sm transition-colors cursor-pointer ${currentPage === pageNum
                  ? "bg-primary font-bold text-on-primary hover:bg-primary"
                  : "hover:bg-surface-container-high text-on-surface"
                  }`}
              >
                {pageNum}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="size-8 sm:size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30 cursor-pointer bg-white"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">chevron_right</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
