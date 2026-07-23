"use client"

import type { User } from "../types"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"

interface UserTableRowProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
}

export function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  // Role badge style mapper
  const getRoleBadgeStyle = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "bg-tertiary-fixed text-on-tertiary-fixed"
      case "Teacher":
        return "bg-primary-fixed-dim text-on-primary-fixed-variant"
      case "Student":
        return "bg-surface-container-highest text-on-surface-variant"
      case "Parent":
        return "bg-secondary-fixed text-on-secondary-fixed"
      default:
        return "bg-surface-container-high text-on-surface"
    }
  }

  // Status indicator mapper
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

  return (
    <TableRow className="hover:bg-surface-container-low transition-all duration-200 ease-in-out group">
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
          className={`px-3 py-1 rounded-full font-label-sm text-[11px] uppercase tracking-wider font-bold h-auto border-0 ${getRoleBadgeStyle(
            user.role
          )}`}
        >
          {user.role}
        </Badge>
      </TableCell>

      {/* Verification Status */}
      <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
        {renderStatus(user.status)}
      </TableCell>

      {/* Joined Date */}
      <TableCell className="py-5 group-hover:py-6 px-6 transition-all duration-200 ease-in-out">
        <p className="font-body-md text-[14px] text-on-surface-variant font-mono">
          {user.joinedDate}
        </p>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-5 group-hover:py-6 px-6 text-right transition-all duration-200 ease-in-out">
        <div className="relative inline-flex items-center justify-end h-9 min-w-[72px]">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => onEdit?.(user)}
              type="button"
              className="p-2 h-9 w-9 hover:bg-surface-container-high rounded-lg text-primary transition-colors cursor-pointer bg-transparent border-0 normal-case shadow-none"
              title="Edit User"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="edit">
                edit
              </span>
            </Button>
            <Button
              onClick={() => onDelete?.(user)}
              type="button"
              className="p-2 h-9 w-9 hover:bg-error-container rounded-lg text-error transition-colors cursor-pointer bg-transparent border-0 normal-case shadow-none"
              title="Delete User"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="delete">
                delete
              </span>
            </Button>
          </div>
          <div className="absolute inset-0 flex items-center justify-end pointer-events-none group-hover:opacity-0 transition-opacity">
            <span className="material-symbols-outlined p-2 text-outline" data-icon="more_horiz">
              more_horiz
            </span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
