"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { MoreVertical, Pen, Trash, BookOpen } from "lucide-react"

export interface SubjectItem {
  id: string
  name: string
  nameBn: string
  level: string
  group: string | null
  position: number
  createdAt: string | Date
  updatedAt: string | Date
  academicClasses?: Array<{
    id: string
    academicClassId: string
    academicClass: {
      id: string
      nameEn: string
      nameBn: string
      level: string
      position: number
    }
  }>
  _count?: {
    chapters: number
    academicClasses: number
  }
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

interface SubjectTableProps {
  items: SubjectItem[]
  isLoading: boolean
  isError: boolean
  isDeleting?: boolean
  onEdit?: (item: SubjectItem) => void
  onDelete: (id: string, name: string) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function SubjectTable({
  items,
  isLoading,
  isError,
  isDeleting = false,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
  onLimitChange,
}: SubjectTableProps) {
  const router = useRouter()
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
      {isLoading ? (
        <div className="p-4 md:p-12">
          {/* Mobile Skeleton */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-[180px] w-full rounded-xl bg-surface-container-high"
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
      ) : isError ? (
        <div className="mx-auto max-w-md p-8 sm:p-16 text-center text-error">
          <span className="material-symbols-outlined text-4xl sm:text-5xl">error</span>
          <h3 className="mt-4 font-headline-md text-base sm:text-lg font-bold text-on-surface">
            Connection Failed
          </h3>
          <p className="mt-2 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Failed to retrieve subject records. Check network configurations or try refreshing the dashboard.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-md p-8 sm:p-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-container text-outline">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-headline-md text-lg font-bold text-on-surface">
            No Subjects Found
          </h3>
          <p className="mt-2 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            No subject records matched your search parameters. Establish your first course offering to get started.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-2.5 sm:py-3 font-headline-md text-xs sm:text-sm font-bold text-on-primary-container shadow-xs transition-all active:scale-95 hover:bg-primary hover:text-white h-auto normal-case tracking-normal cursor-pointer"
            >
              <Link href="/subjects/create">
                <span className="material-symbols-outlined text-sm sm:text-base">add</span>
                <span>Add First Subject</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-3 p-3.5 sm:p-4 md:hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 p-3 sm:p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline-md text-base font-extrabold text-on-surface truncate">
                        {item.name}
                      </h4>
                      <p className="font-body-md font-bengali text-xs font-medium text-on-surface-variant truncate">
                        {item.nameBn}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge className="inline-flex items-center rounded-full bg-secondary-container/10 px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-secondary border-0 shadow-none">
                          {item.level}
                        </Badge>
                        {item.group && item.group !== "General" && (
                          <Badge className="inline-flex items-center rounded-full bg-tertiary-container/10 px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-tertiary border-0 shadow-none">
                            {item.group}
                          </Badge>
                        )}
                        <Badge className="inline-flex items-center rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] font-medium text-on-surface hover:bg-surface-container-highest cursor-default shadow-none">
                          Position: #{item.position < 10 ? `0${item.position}` : item.position}
                        </Badge>
                        <Badge className="inline-flex items-center rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] font-medium text-on-surface hover:bg-surface-container-highest cursor-default shadow-none">
                          Chapters: {item._count?.chapters ?? 0}
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
                    <DropdownMenuContent align="end" className="bg-white border border-outline-variant shadow-md rounded-xl p-1.5 min-w-[140px]">
                      <DropdownMenuItem
                        onClick={() => onEdit ? onEdit(item) : router.push(`/subjects/${item.id}/edit`)}
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                      >
                        <Pen className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(item.id, item.name)}
                        disabled={isDeleting}
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 disabled:opacity-50"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mapped Classes if available */}
                {item.academicClasses && item.academicClasses.length > 0 && (
                  <div className="flex flex-col gap-1 border-t border-outline-variant/20 pt-2.5">
                    <span className="font-label-sm text-[9px] font-bold uppercase tracking-wider text-outline">
                      Mapped Academic Classes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.academicClasses.map((ac) => (
                        <Badge
                          key={ac.id}
                          variant="outline"
                          className="rounded-md border-outline-variant/45 bg-surface-container-lowest px-1.5 py-0.5 text-[9px] font-medium text-on-surface-variant"
                        >
                          {ac.academicClass.nameEn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer Info */}
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-[11px] text-outline">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    <span>
                      Added {new Date(item.createdAt).toLocaleDateString("en-US", {
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
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block">
            <Table className="w-full text-left font-body-md">
              <TableHeader className="bg-surface-container-low border-b border-outline-variant">
                <TableRow className="border-b border-outline-variant bg-surface-container-low hover:bg-surface-container-low">
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Subject Name (EN / BN)
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Academic Level
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Group
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Mapped Classes
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Position
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Chapters
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Added Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-outline-variant/30">
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-surface-container-low transition-all duration-200 ease-in-out group border-b border-outline-variant/30"
                  >
                    {/* Subject Name (EN / BN) */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <div className="flex flex-col">
                        <span className="font-headline-md text-base font-bold text-on-surface">
                          {item.name}
                        </span>
                        <span className="font-body-md font-bengali text-sm font-medium text-on-surface-variant">
                          {item.nameBn}
                        </span>
                      </div>
                    </TableCell>

                    {/* Academic Level */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <Badge className="inline-flex items-center rounded-full bg-secondary-container/10 px-3 py-1 font-label-sm text-xs font-bold uppercase text-secondary border-0 shadow-none">
                        {item.level}
                      </Badge>
                    </TableCell>

                    {/* Group */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <Badge className="inline-flex items-center rounded-full bg-tertiary-container/10 px-3 py-1 font-label-sm text-xs font-bold uppercase text-tertiary border-0 shadow-none">
                        {item.group || "General"}
                      </Badge>
                    </TableCell>

                    {/* Mapped Classes */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out max-w-[200px]">
                      {item.academicClasses && item.academicClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.academicClasses.map((ac) => (
                            <Badge
                              key={ac.id}
                              variant="outline"
                              className="rounded-md border-outline-variant/40 bg-surface-container-low/50 px-2 py-0.5 text-[10px] font-medium text-on-surface-variant"
                            >
                              {ac.academicClass.nameEn}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-outline italic">Unmapped</span>
                      )}
                    </TableCell>

                    {/* Position */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <span className="rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-label-sm text-xs font-medium">
                        #{item.position < 10 ? `0${item.position}` : item.position}
                      </span>
                    </TableCell>

                    {/* Chapters */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <span className="font-headline-md text-sm font-bold text-on-surface">
                        {item._count?.chapters ?? 0}
                      </span>
                    </TableCell>

                    {/* Added Date */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <div className="flex flex-col">
                        <span className="font-body-md text-sm text-on-surface">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-[12px] text-outline">
                          Updated {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
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
                        <DropdownMenuContent align="end" className="bg-white border border-outline-variant shadow-md rounded-xl p-1.5 min-w-[140px]">
                          <DropdownMenuItem
                            onClick={() => onEdit ? onEdit(item) : router.push(`/subjects/${item.id}/edit`)}
                            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                          >
                            <Pen className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(item.id, item.name)}
                            disabled={isDeleting}
                            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 disabled:opacity-50"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{displayStart}-{displayEnd}</span> of <span className="font-bold text-on-surface">{totalItems}</span> subjects
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
                className="size-8 sm:size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
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
                className="size-8 sm:size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm sm:text-base">chevron_right</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
