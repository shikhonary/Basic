"use client"

import { useMemo, useState } from "react"
import { MOCK_USERS, MOCK_USER_STATS } from "../data/mock-users"
import type { User, UserFilterState } from "../types"
import { useUserSearchParams, type UserSortOption } from "../hooks/use-user-search-params"
import { UserPageHeader } from "./user-page-header"
import { UserFilterBar } from "./user-filter-bar"
import { UserDataTable } from "./user-data-table"
import { UserPagination } from "./user-pagination"
import { UserStatsCards } from "./user-stats-cards"
import { Card } from "@workspace/ui/components/card"

const ITEMS_PER_PAGE = 4

export function UserManagementView() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [{ search, role, status, sort, page: currentPage }, setSearchParams] = useUserSearchParams()

  const filters: UserFilterState = useMemo(
    () => ({
      search,
      role,
      status,
      sort,
    }),
    [search, role, status, sort]
  )

  const handleFilterChange = (newFilters: Partial<UserFilterState>) => {
    setSearchParams({
      search: newFilters.search,
      role: newFilters.role,
      status: newFilters.status,
      sort: newFilters.sort as UserSortOption | undefined,
      page: 1,
    })
  }

  const handleResetFilters = () => {
    setSearchParams({
      search: "",
      role: "All",
      status: "All",
      sort: "desc",
      page: 1,
    })
  }

  // Filtered and sorted users calculation
  const filteredUsers = useMemo(() => {
    const result = users.filter((user) => {
      // Search filter (name, email, id)
      const matchesSearch =
        filters.search === "" ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.id.toLowerCase().includes(filters.search.toLowerCase())

      // Role filter
      const matchesRole = filters.role === "All" || user.role === filters.role

      // Status filter
      const matchesStatus = filters.status === "All" || user.status === filters.status

      return matchesSearch && matchesRole && matchesStatus
    })

    // Sort filtering logic matching SORT_OPTIONS values (desc = Newest, asc = Oldest)
    switch (filters.sort) {
      case "asc":
      case "oldest":
        return [...result].sort(
          (a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
        )
      case "name_asc":
        return [...result].sort((a, b) => a.name.localeCompare(b.name))
      case "name_desc":
        return [...result].sort((a, b) => b.name.localeCompare(a.name))
      case "desc":
      case "newest":
      default:
        return [...result].sort(
          (a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        )
    }
  }, [users, filters])

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAddUser = () => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: "New Team Member",
      email: "new.member@bec-edu.org",
      role: "Teacher",
      status: "Pending",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      initials: "NM",
      avatarBgColor: "bg-primary-fixed",
      avatarTextColor: "text-primary",
    }
    setUsers((prev) => [newUser, ...prev])
  }

  const handleEditUser = (user: User) => {
    const updatedName = prompt("Edit User Name:", user.name)
    if (updatedName && updatedName.trim() !== "") {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, name: updatedName.trim() } : u))
      )
    }
  }

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to remove ${user.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    }
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <UserPageHeader onAddUser={handleAddUser} />

      {/* Filter Bar */}
      <UserFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Data Table with Pagination */}
      <Card className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs gap-0 p-0">
        <UserDataTable
          users={paginatedUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={filteredUsers.length > 0 ? startIndex + 1 : 0}
          endIndex={Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}
          totalItems={filteredUsers.length}
          onPageChange={(page) => setSearchParams({ page })}
        />
      </Card>

      {/* Contextual Stats Cards */}
      <UserStatsCards stats={MOCK_USER_STATS} />
    </div>
  )
}
