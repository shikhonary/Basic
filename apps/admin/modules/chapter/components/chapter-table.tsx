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
import { MoreVertical, Pen, Trash } from "lucide-react"

export interface ChapterItem {
  id: string
  name: string
  nameBn: string
  position: number
  subjectId: string
  createdAt: string | Date
  updatedAt: string | Date
  subject: {
    id: string
    name: string
    nameBn: string
    level: string
    group: string | null
  }
}

interface ChapterTableProps {
  items: ChapterItem[]
  isLoading: boolean
  isError: boolean
  onDelete: (id: string, name: string) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ChapterTable({
  items,
  isLoading,
  isError,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: ChapterTableProps) {
  const router = useRouter()
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>
          <span className="ml-3 font-body-md">Loading chapters...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="mt-2 font-body-md font-medium">Failed to load chapters.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline">
            auto_stories
          </span>
          <h3 className="mt-4 font-headline-md text-lg font-bold text-on-surface">
            No Chapters Found
          </h3>
          <p className="mt-1 font-body-md text-sm text-on-surface-variant">
            Get started by creating your first chapter for a subject.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="inline-flex items-center space-x-2 rounded-lg bg-primary-container px-6 py-2.5 font-bold text-on-primary-container hover:bg-primary hover:text-white h-auto normal-case tracking-normal cursor-pointer"
            >
              <Link href="/chapters/create">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create New Chapter</span>
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
                  Position
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Chapter Name (EN / BN)
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Parent Subject
                </TableHead>
                <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                  Level & Group
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
                  {/* Position */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <span className="rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-label-sm text-xs font-medium">
                      #{item.position < 10 ? `0${item.position}` : item.position}
                    </span>
                  </TableCell>

                  {/* Chapter Name (EN / BN) */}
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

                  {/* Parent Subject */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <div className="flex flex-col">
                      <span className="font-headline-md text-sm font-bold text-on-surface">
                        {item.subject.name}
                      </span>
                      <span className="font-body-md font-bengali text-xs font-medium text-on-surface-variant">
                        {item.subject.nameBn}
                      </span>
                    </div>
                  </TableCell>

                  {/* Level & Group */}
                  <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge className="inline-flex items-center rounded-full bg-secondary-container/10 px-3 py-1 font-label-sm text-xs font-bold uppercase text-secondary border-0 shadow-none">
                        {item.subject.level}
                      </Badge>
                      {item.subject.group && (
                        <Badge className="inline-flex items-center rounded-full bg-tertiary-container/10 px-3 py-1 font-label-sm text-xs font-bold uppercase text-tertiary border-0 shadow-none">
                          {item.subject.group}
                        </Badge>
                      )}
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
                          onClick={() => router.push(`/chapters/${item.id}/edit`)}
                          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                        >
                          <Pen />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(item.id, item.name)}
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

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
            <p className="font-body-md text-xs text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{displayStart}</span> to{" "}
              <span className="font-bold text-on-surface">{displayEnd}</span> of{" "}
              <span className="font-bold text-on-surface">{totalItems}</span> chapters
            </p>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-8 rounded-lg border border-outline-variant bg-white px-3 text-xs font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50 cursor-pointer"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1 text-xs font-bold">
                <span className="rounded-md bg-primary px-2.5 py-1 text-on-primary">
                  {currentPage}
                </span>
                <span className="text-outline">/</span>
                <span className="px-1 text-on-surface-variant">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-8 rounded-lg border border-outline-variant bg-white px-3 text-xs font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50 cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
