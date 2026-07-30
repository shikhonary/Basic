"use client"

import type { User } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
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
import { MoreVertical, Pen, Trash, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

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

interface UserDataTableProps {
  users: User[]
  isLoading: boolean
  isError: boolean
  isDeleting: boolean
  onEditUser?: (user: User) => void
  onDeleteUser: (user: User) => void
  onManageRoles?: (user: User) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function UserDataTable({
  users,
  isLoading,
  isError,
  isDeleting,
  onEditUser,
  onDeleteUser,
  onManageRoles,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
  onLimitChange,
}: UserDataTableProps) {
  const displayStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const displayEnd = Math.min(currentPage * itemsPerPage, totalItems)

  const getRoleBadgeStyle = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "bg-tertiary-fixed text-on-tertiary-fixed border-0 shadow-none font-bold uppercase text-[10px]"
      case "Teacher":
        return "bg-primary-fixed-dim text-on-primary-fixed-variant border-0 shadow-none font-bold uppercase text-[10px]"
      case "Student":
        return "bg-surface-container-highest text-on-surface-variant border-0 shadow-none font-bold uppercase text-[10px]"
      case "Parent":
        return "bg-secondary-fixed text-on-secondary-fixed border-0 shadow-none font-bold uppercase text-[10px]"
      default:
        return "bg-surface-container-high text-on-surface border-0 shadow-none font-bold uppercase text-[10px]"
    }
  }

  const renderStatus = (status: User["status"]) => {
    switch (status) {
      case "Verified":
        return (
          <div className="flex items-center gap-2 text-emerald-600">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-body-md text-[14px] font-medium">Verified</span>
          </div>
        )
      case "Pending":
        return (
          <div className="flex items-center gap-2 text-amber-600">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pending
            </span>
            <span className="font-body-md text-[14px] font-medium">Pending</span>
          </div>
        )
      case "Blocked":
        return (
          <div className="flex items-center gap-2 text-error">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              block
            </span>
            <span className="font-body-md text-[14px] font-medium">Blocked</span>
          </div>
        )
    }
  }

  const renderStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-label-sm text-[10px] font-bold uppercase text-emerald-600 border-0 shadow-none">
            Verified
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 font-label-sm text-[10px] font-bold uppercase text-amber-600 border-0 shadow-none">
            Pending
          </Badge>
        )
      case "Blocked":
        return (
          <Badge className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 font-label-sm text-[10px] font-bold uppercase text-red-600 border-0 shadow-none">
            Blocked
          </Badge>
        )
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
      {isLoading ? (
        <div className="p-4 md:p-12">
          {/* Mobile Skeleton */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full rounded-xl bg-surface-container-high animate-pulse" />
            ))}
          </div>
          {/* Desktop Skeleton */}
          <div className="hidden md:flex items-center justify-center p-8 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">
              progress_activity
            </span>
            <span className="ml-3 font-body-md">Loading system users...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-error">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="mt-2 font-body-md font-medium">Failed to load system users.</p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 sm:p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline">
            person_search
          </span>
          <h3 className="mt-4 font-headline-md text-lg font-bold text-on-surface">
            No Users Found
          </h3>
          <p className="mt-1 font-body-md text-sm text-on-surface-variant">
            Try adjusting your search criteria or register a new user.
          </p>
        </div>
      ) : (
        <div>
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 md:hidden">
            {users.map((user) => (
              <div
                key={user.id}
                className="group relative flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                {/* Header Row: Avatar + Name + Email + Role badge + Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="w-10 h-10 size-10 rounded-full border border-outline-variant/30 shrink-0">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />}
                      <AvatarFallback
                        className={`w-full h-full rounded-full ${user.avatarBgColor ?? "bg-primary-fixed"
                          } ${user.avatarTextColor ?? "text-primary"
                          } flex items-center justify-center font-bold font-headline text-sm`}
                      >
                        {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline-md text-base font-extrabold text-on-surface truncate">
                        {user.name}
                      </h4>
                      <p className="font-body-md text-xs font-mono text-outline truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          onClick={() => onManageRoles && onManageRoles(user)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-label-sm cursor-pointer hover:opacity-85 transition-opacity ${getRoleBadgeStyle(user.role)}`}
                        >
                          {user.role}
                        </Badge>
                        {renderStatusBadge(user.status)}
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
                        onClick={() => onEditUser && onEditUser(user)}
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                      >
                        <Pen className="h-3.5 w-3.5" />
                        <span>Edit Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onManageRoles && onManageRoles(user)}
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                      >
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        <span>Manage Roles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDeleteUser(user)}
                        disabled={isDeleting}
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Delete User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card Footer Info */}
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-[11px] text-outline">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    <span>Joined {user.joinedDate}</span>
                  </div>
                  <span className="text-[10px] text-outline/80">
                    ID: {user.id.slice(0, 8)}...
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
                    User Details
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Role
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Joined Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right font-label-sm font-semibold tracking-wider text-outline uppercase h-auto">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-outline-variant/30">
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-surface-container-low transition-all duration-200 ease-in-out group border-b border-outline-variant/30"
                  >
                    {/* User Details */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 size-10 rounded-full border border-outline-variant/30">
                          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />}
                          <AvatarFallback
                            className={`w-full h-full rounded-full ${user.avatarBgColor ?? "bg-primary-fixed"
                              } ${user.avatarTextColor ?? "text-primary"
                              } flex items-center justify-center font-bold font-headline text-sm`}
                          >
                            {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-body-md text-body-md font-semibold text-on-surface">
                            {user.name}
                          </p>
                          <p className="font-label-sm text-[13px] text-outline font-mono">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <Badge
                        onClick={() => onManageRoles && onManageRoles(user)}
                        className={`inline-flex items-center rounded-full px-3 py-1 font-label-sm text-xs cursor-pointer hover:opacity-85 transition-opacity ${getRoleBadgeStyle(user.role)}`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      {renderStatus(user.status)}
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
                      <span className="font-body-md text-sm text-on-surface">
                        {user.joinedDate}
                      </span>
                    </TableCell>

                    {/* Actions dropdown */}
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
                            onClick={() => onEditUser && onEditUser(user)}
                            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                          >
                            <Pen />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onManageRoles && onManageRoles(user)}
                            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high"
                          >
                            <Shield className="h-3.5 w-3.5 text-primary" />
                            <span>Manage Roles</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDeleteUser(user)}
                            disabled={isDeleting}
                            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20"
                          >
                            <Trash />
                            <span>Delete User</span>
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
                Showing <span className="font-bold">{displayStart}-{displayEnd}</span> of <span className="font-bold">{totalItems}</span> users
              </p>
              {onLimitChange && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-outline font-medium">Rows per page:</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(val) => onLimitChange(Number(val) || 10)}
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
