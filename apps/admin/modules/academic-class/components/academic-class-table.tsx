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
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { MoreVertical, Pen, Trash } from "lucide-react"

export interface AcademicClassItem {
  id: string
  nameEn: string
  nameBn: string
  level: string
  position: number
  createdAt: string | Date
  updatedAt: string | Date
}

interface AcademicClassTableProps {
  items: AcademicClassItem[]
  isLoading: boolean
  isError: boolean
  isDeleting: boolean
  onEdit?: (item: AcademicClassItem) => void
  onDelete: (id: string, name: string) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AcademicClassTable({
  items,
  isLoading,
  isError,
  isDeleting,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: AcademicClassTableProps) {
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>
          <span className="ml-3 font-body-md">Loading academic classes...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="mt-2 font-body-md font-medium">Failed to load academic classes.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline">
            school
          </span>
          <h3 className="mt-4 font-headline-md text-lg font-bold text-on-surface">
            No Academic Classes Found
          </h3>
          <p className="mt-1 font-body-md text-sm text-on-surface-variant">
            Get started by creating your first institutional academic class level.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="inline-flex items-center space-x-2 rounded-lg bg-primary-container px-6 py-2.5 font-bold text-on-primary-container hover:bg-primary hover:text-white h-auto normal-case tracking-normal"
            >
              <Link href="/academic-classes/create">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create New Class</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Table className="w-full text-left font-body-md">
            <TableHeader className="bg-surface-container-low border-b border-outline-variant">
              <TableRow className="border-b border-outline-variant bg-surface-container-low hover:bg-surface-container-low">
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Class Name (EN / BN)
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Academic Level
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Position
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
                  {/* Class Name (EN / BN) */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <div className="flex flex-col">
                      <span className="font-headline-md text-base font-bold text-on-surface">
                        {item.nameEn}
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

                  {/* Position */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-label-sm text-xs font-medium">
                        #{item.position < 10 ? `0${item.position}` : item.position}
                      </span>
                    </div>
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
                          onClick={() => onEdit ? onEdit(item) : (window.location.href = `/academic-classes/${item.id}/edit`)}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                        >
                          <Pen />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(item.id, item.nameEn)}
                          disabled={isDeleting}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20"
                        >
                          <Trash />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
            <p className="font-body-md text-sm text-on-surface-variant">
              Showing <span className="font-bold">{displayStart}-{displayEnd}</span> of <span className="font-bold">{totalItems}</span> classes
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  onClick={() => onPageChange(pageNum)}
                  className={`size-10 rounded-lg font-body-md text-sm transition-colors ${currentPage === pageNum
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
                className="size-10 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container-high disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
