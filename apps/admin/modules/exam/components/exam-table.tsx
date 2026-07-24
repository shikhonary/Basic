"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  MoreVertical,
  Pen,
  Trash,
  Eye,
  Clock,
  HelpCircle,
  Award,
  Calendar,
  CheckCircle,
  Archive,
  AlertCircle,
  GraduationCap,
} from "lucide-react"

export interface ExamSubjectItem {
  id: string
  subjectId: string
  subject: {
    id: string
    name: string
    nameBn?: string | null
    level?: string | null
    group?: string | null
  }
}

export interface ExamItem {
  id: string
  title: string
  total: number
  duration: number
  totalMcq: number
  startDate: string | Date
  endDate: string | Date
  hasSuffle: boolean
  hasRandom: boolean
  hasNegativeMark: boolean
  negativeMark: number
  type: string
  status: string
  academicClassId: string
  academicClass?: {
    id: string
    nameEn: string
    nameBn: string
    level: string
    position: number
  }
  createdAt: string | Date
  updatedAt: string | Date
  examSubjects?: ExamSubjectItem[]
  _count?: {
    examAttempts?: number
  }
}

interface ExamTableProps {
  items: ExamItem[]
  isLoading: boolean
  isError: boolean
  onEdit?: (item: ExamItem) => void
  onDelete: (id: string, title: string) => void
  onToggleStatus?: (id: string, newStatus: string) => void
  onViewDetails?: (item: ExamItem) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ExamTable({
  items,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: ExamTableProps) {
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-0 font-bold px-2.5 py-0.5 rounded-full text-xs inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Published
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-0 font-bold px-2.5 py-0.5 rounded-full text-xs inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending / Draft
          </Badge>
        )
      case "Archived":
        return (
          <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-0 font-medium px-2.5 py-0.5 rounded-full text-xs inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Archived
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs">
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>
          <span className="ml-3 font-body-md text-sm font-medium">
            Loading exam catalog...
          </span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="mt-2 font-body-md text-sm font-medium">
            Failed to load exams list.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            No Exams Found
          </h3>
          <p className="mt-1 font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
            Get started by setting up your first exam assessment module.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-on-primary hover:bg-primary/90 shadow-sm h-auto text-sm normal-case tracking-normal"
            >
              <Link href="/exams/create">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create Exam</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Table className="w-full text-left font-body-md">
            <TableHeader className="bg-surface-container-low border-b border-outline-variant/30">
              <TableRow className="hover:bg-surface-container-low border-b border-outline-variant/30">
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Exam & Type
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Class
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Linked Subjects
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Marks & Duration
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Schedule
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right font-label-sm font-semibold tracking-wider text-outline uppercase text-xs h-auto">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-outline-variant/30">
              {items.map((item) => {
                const subjects = item.examSubjects ?? []
                const startDateStr = new Date(item.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                const endDateStr = new Date(item.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-surface-container-low/60 transition-all duration-150 group border-b border-outline-variant/30"
                  >
                    {/* Exam Title & Type */}
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <Link
                          href={`/exams/${item.id}`}
                          className="font-headline-md text-base font-bold text-on-surface hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded-md bg-secondary-container/20 px-2 py-0.5 font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider">
                            {item.type}
                          </span>
                          {item._count?.examAttempts !== undefined && (
                            <span className="text-[12px] text-outline flex items-center gap-1">
                              • {item._count.examAttempts} attempt{item._count.examAttempts === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Academic Class */}
                    <TableCell className="py-4 px-6">
                      {item.academicClass ? (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold rounded-md px-2.5 py-1 inline-flex items-center gap-1"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>{item.academicClass.nameEn}</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-outline italic">Unassigned</span>
                      )}
                    </TableCell>

                    {/* Linked Subjects */}
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {subjects.length > 0 ? (
                          subjects.map((s) => (
                            <Badge
                              key={s.id}
                              variant="outline"
                              className="bg-surface-container-high/80 text-[11px] font-medium text-on-surface-variant border-outline-variant/40 rounded-md px-2 py-0.5"
                            >
                              {s.subject?.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-outline italic">No subjects</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Marks & MCQ Count & Duration */}
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                          <Award className="h-3.5 w-3.5 text-primary" />
                          <span>{item.total} Marks</span>
                          <span className="text-outline">({item.totalMcq} MCQs)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          <span>{item.duration} Mins</span>
                          {item.hasNegativeMark && (
                            <span className="text-[11px] font-medium text-error ml-1">
                              (-{item.negativeMark})
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col text-xs text-on-surface-variant">
                        <div className="flex items-center gap-1 font-medium text-on-surface">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{startDateStr}</span>
                        </div>
                        <span className="text-[11px] text-outline pl-4">to {endDateStr}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4 px-6">
                      {getStatusBadge(item.status)}
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high cursor-pointer h-8 w-8"
                            title="Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-outline-variant shadow-md rounded-xl p-1.5 min-w-[160px]">
                          <DropdownMenuItem
                            onClick={() => onViewDetails ? onViewDetails(item) : (window.location.href = `/exams/${item.id}`)}
                            className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                          >
                            <Eye className="h-3.5 w-3.5 text-outline" />
                            <span>View Details</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEdit ? onEdit(item) : (window.location.href = `/exams/${item.id}/edit`)}
                            className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                          >
                            <Pen className="h-3.5 w-3.5 text-outline" />
                            <span>Edit Exam</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => window.location.href = `/exams/${item.id}/mcq`}
                            className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-primary" />
                            <span>Assign MCQs</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1 border-outline-variant/30" />

                          {/* Quick Status Toggles */}
                          {item.status !== "Published" && onToggleStatus && (
                            <DropdownMenuItem
                              onClick={() => onToggleStatus(item.id, "Published")}
                              className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-500/10"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Publish Exam</span>
                            </DropdownMenuItem>
                          )}

                          {item.status !== "Pending" && onToggleStatus && (
                            <DropdownMenuItem
                              onClick={() => onToggleStatus(item.id, "Pending")}
                              className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-500/10"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span>Move to Draft</span>
                            </DropdownMenuItem>
                          )}

                          {item.status !== "Archived" && onToggleStatus && (
                            <DropdownMenuItem
                              onClick={() => onToggleStatus(item.id, "Archived")}
                              className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-500/10"
                            >
                              <Archive className="h-3.5 w-3.5" />
                              <span>Archive Exam</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="my-1 border-outline-variant/30" />

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(item.id, item.title)}
                            className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span>Delete Exam</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-low px-6 py-4">
            <p className="font-body-md text-xs text-on-surface-variant">
              Showing <span className="font-bold">{displayStart}-{displayEnd}</span> of <span className="font-bold">{totalItems}</span> exams
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="h-8 w-8 rounded-lg border border-outline-variant bg-white transition-colors hover:bg-surface-container-high disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  onClick={() => onPageChange(pageNum)}
                  className={`h-8 w-8 rounded-lg font-body-md text-xs transition-colors ${
                    currentPage === pageNum
                      ? "bg-primary font-bold text-on-primary hover:bg-primary"
                      : "hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className="h-8 w-8 rounded-lg border border-outline-variant bg-white transition-colors hover:bg-surface-container-high disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
