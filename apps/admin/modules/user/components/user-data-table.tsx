"use client"

import type { User } from "../types"
import { UserTableRow } from "./user-table-row"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface UserDataTableProps {
  users: User[]
  onEditUser?: (user: User) => void
  onDeleteUser?: (user: User) => void
}

export function UserDataTable({ users, onEditUser, onDeleteUser }: UserDataTableProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto custom-scrollbar">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-surface-container border-b border-outline-variant hover:bg-surface-container">
              <TableHead className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-widest font-semibold h-auto">
                User Details
              </TableHead>
              <TableHead className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-widest font-semibold h-auto">
                Role
              </TableHead>
              <TableHead className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-widest font-semibold h-auto">
                Status
              </TableHead>
              <TableHead className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-widest font-semibold h-auto">
                Joined Date
              </TableHead>
              <TableHead className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-widest text-right font-semibold h-auto">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-outline-variant/30">
            {users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-outline font-body-md">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[36px]">search_off</span>
                    <p className="font-semibold text-on-surface">No users match your criteria</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
