export type UserRole = "Admin" | "Teacher" | "Student" | "Parent"

export type UserVerificationStatus = "Verified" | "Pending" | "Blocked"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserVerificationStatus
  joinedDate: string
  avatarUrl?: string
  initials?: string
  avatarBgColor?: string
  avatarTextColor?: string
  roleIds?: string[]
}

export interface UserStats {
  totalUsers: number
  totalUsersChange: string
  verifiedTeachers: number
  pendingRequests: number
  systemHealth: number
}

export interface UserFilterState {
  search: string
  role: string
  status: string
  sort?: string
}
