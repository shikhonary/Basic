"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import type { User, UserFilterState } from "../types"
import { useUserSearchParams, type UserSortOption } from "../hooks/use-user-search-params"
import { useUsersList, useDeleteUser, useUserStats } from "../services/use-user"
import { UserPageHeader } from "./user-page-header"
import { UserFilterBar } from "./user-filter-bar"
import { UserDataTable } from "./user-data-table"
import { UserStatsCards } from "./user-stats-cards"
import { ChangeRoleModal } from "./change-role-modal"
import { DeleteUserModal } from "./delete-user-modal"
import { useChangeRoleModalStore } from "../store/use-change-role-modal-store"
import { useDeleteUserModalStore } from "../store/use-delete-user-modal-store"
import { toast } from "@workspace/ui/components/sonner"

export function UserManagementView() {
  const router = useRouter()
  const [{ search, role, status, sort, page: currentPage, limit }, setSearchParams] = useUserSearchParams()

  const filters: UserFilterState = useMemo(
    () => ({
      search,
      role,
      status,
      sort,
    }),
    [search, role, status, sort]
  )

  // Fetch users list from backend using trpc query hook
  const { data, isLoading, isError } = useUsersList({
    limit,
    page: currentPage,
    query: search || undefined,
    role: role || undefined,
    status: status || undefined,
  })

  // Fetch dashboard stats from backend
  const { data: statsData, isLoading: isStatsLoading } = useUserStats()

  const deleteMutation = useDeleteUser()

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

  // Map backend users payload to User UI structure
  const mappedUsers = useMemo(() => {
    if (!data?.users) return []
    return data.users.map((u: any): User => {
      // Resolve role
      const roleName = u.roles?.[0]?.name ?? "STUDENT"
      let formattedRole: User["role"] = "Student"
      if (roleName === "SUPER_ADMIN" || roleName === "ADMIN") {
        formattedRole = "Admin"
      } else if (roleName === "TEACHER") {
        formattedRole = "Teacher"
      } else if (roleName === "PARENT") {
        formattedRole = "Parent"
      }

      // Resolve status
      const verificationStatus: User["status"] =
        (u.emailVerified || u.phoneNumberVerified) ? "Verified" : "Pending"

      return {
        id: u.id,
        name: u.name || "N/A",
        email: u.email,
        role: formattedRole,
        status: verificationStatus,
        joinedDate: new Date(u.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        avatarUrl: u.image || undefined,
        initials: u.name
          ? u.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "US",
        avatarBgColor: "bg-primary-fixed",
        avatarTextColor: "text-primary",
        roleIds: u.roles?.map((r: any) => r.id) || [],
      }
    })
  }, [data?.users])

  const totalPages = data?.totalPages ?? 1
  const totalItems = data?.totalItems ?? 0

  const openDeleteModal = useDeleteUserModalStore((state) => state.openModal)
  const openChangeRoleModal = useChangeRoleModalStore((state) => state.openModal)

  const handleAddUser = () => {
    router.push("/users/create")
  }

  const handleEditUser = (user: User) => {
    router.push(`/users/${user.id}/edit`)
  }

  const handleDeleteUser = (user: User) => {
    openDeleteModal(user.id, user.name)
  }

  const handleManageRoles = (user: User) => {
    openChangeRoleModal(user.id, user.name, user.roleIds || [])
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <UserPageHeader onAddUser={handleAddUser} />

      {/* Contextual Stats Cards */}
      <UserStatsCards stats={statsData} isLoading={isStatsLoading} />

      {/* Filter Bar */}
      <UserFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Data Table with Pagination */}
      <UserDataTable
        users={mappedUsers}
        isLoading={isLoading}
        isError={isError}
        isDeleting={deleteMutation.isPending}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onManageRoles={handleManageRoles}
        currentPage={currentPage}
        itemsPerPage={limit}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={(page) => setSearchParams({ page })}
        onLimitChange={(newLimit) => setSearchParams({ limit: newLimit, page: 1 })}
      />

      {/* Change Role & Delete User Modals */}
      <ChangeRoleModal />
      <DeleteUserModal />
    </div>
  )
}
