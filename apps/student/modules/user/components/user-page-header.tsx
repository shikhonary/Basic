"use client"

import { Button } from "@workspace/ui/components/button"

interface UserPageHeaderProps {
  onAddUser?: () => void
}

export function UserPageHeader({ onAddUser }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-10 md:flex-row md:items-center justify-between">
      <div>
        <h2 className="font-display-lg text-[32px] md:text-display-lg text-on-surface font-headline font-extrabold tracking-tight">
          User Management
        </h2>
        <p className="font-body-md text-body-md text-outline">
          Manage institutional access, roles, and user verification status.
        </p>
      </div>

      <Button
        onClick={onAddUser}
        type="button"
        className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-body-md font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/10 cursor-pointer w-fit border-0 h-auto normal-case tracking-normal"
      >
        <span className="material-symbols-outlined text-[20px]" data-icon="add">
          add
        </span>
        <span>Add New User</span>
      </Button>
    </div>
  )
}
