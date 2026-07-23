"use client"

import { Button } from "@workspace/ui/components/button"

interface UserPaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function UserPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: UserPaginationProps) {
  if (totalItems === 0) return null

  return (
    <div className="px-6 py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest rounded-b-2xl">
      <p className="font-body-md text-[14px] text-outline">
        Showing{" "}
        <span className="font-semibold text-on-surface">
          {startIndex} - {endIndex}
        </span>{" "}
        of <span className="font-semibold text-on-surface">{totalItems}</span> users
      </p>

      <div className="flex gap-2 items-center">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          type="button"
          className="p-2 h-auto border border-outline-variant rounded-lg text-outline hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-transparent normal-case shadow-none"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="chevron_left">
            chevron_left
          </span>
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
            className={`px-4 py-2 h-auto rounded-lg font-body-md font-medium text-[14px] transition-colors cursor-pointer border-0 normal-case shadow-none ${page === currentPage
                ? "bg-primary-container text-white"
                : "hover:bg-surface-container-high text-on-surface bg-transparent"
              }`}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          type="button"
          className="p-2 h-auto border border-outline-variant rounded-lg text-outline hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-transparent normal-case shadow-none"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">
            chevron_right
          </span>
        </Button>
      </div>
    </div>
  )
}
