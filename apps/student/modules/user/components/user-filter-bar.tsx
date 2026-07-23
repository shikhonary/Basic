"use client"

import type { UserFilterState } from "../types"
import { useRolesForSelection } from "../services/use-user"
import { SORT_OPTIONS } from "@workspace/utils"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"

interface UserFilterBarProps {
  filters: UserFilterState
  onFilterChange: (filters: Partial<UserFilterState>) => void
  onResetFilters?: () => void
}

export function UserFilterBar({ filters, onFilterChange, onResetFilters }: UserFilterBarProps) {
  const { data: roles, isLoading: isRolesLoading } = useRolesForSelection()

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] z-10"
          data-icon="search"
        >
          search
        </span>
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Filter by name, email or ID..."
          className="w-full pl-10 pr-4 py-2.5 h-auto bg-transparent border-primary-container/40 rounded-lg focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-hidden"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Role Select */}
        <div className="relative min-w-[140px] flex-1 md:flex-initial">
          <Select
            value={filters.role}
            onValueChange={(val) => onFilterChange({ role: val ?? "All" })}
            disabled={isRolesLoading}
          >
            <SelectTrigger className="w-full bg-surface border border-outline-variant border-b-outline-variant rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 focus:outline-hidden cursor-pointer h-auto">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-surface border border-outline-variant rounded-lg shadow-md">
              <SelectItem value="All">All Roles</SelectItem>
              {roles?.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status Select */}
        <div className="relative min-w-[160px] flex-1 md:flex-initial">
          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange({ status: val ?? "All" })}
          >
            <SelectTrigger className="w-full bg-surface border border-outline-variant border-b-outline-variant rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 focus:outline-hidden cursor-pointer h-auto">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface border border-outline-variant rounded-lg shadow-md">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="relative min-w-[150px] flex-1 md:flex-initial">
          <Select
            value={filters.sort ?? "desc"}
            onValueChange={(val) => onFilterChange({ sort: val ?? "desc" })}
          >
            <SelectTrigger className="w-full bg-surface border border-outline-variant border-b-outline-variant rounded-lg px-4 py-2.5 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 focus:outline-hidden cursor-pointer h-auto">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-surface border border-outline-variant rounded-lg shadow-md">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter List Action Button */}
        <Button
          onClick={onResetFilters}
          type="button"
          title="Reset Filters"
          className="p-2.5 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer text-outline hover:text-on-surface bg-transparent h-auto normal-case"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="filter_list">
            filter_list
          </span>
        </Button>
      </div>
    </div>
  )
}
