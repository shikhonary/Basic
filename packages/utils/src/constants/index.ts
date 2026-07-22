/**
 * Global application constants.
 */
export const APP_NAME = "BEC Platform"

export const DEFAULT_PAGE_SIZE = 20

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
} as const

export const VERIFICATION_STATUS = {
  VERIFIED: "Verified",
  PENDING: "Pending",
  BLOCKED: "Blocked",
} as const

export const SORT_OPTIONS = [
  {
    label: "Oldest",
    label_bn: "সবচেয়ে পুরানো",
    value: "asc",
  },
  {
    label: "Newest",
    label_bn: "সর্বশেষ",
    value: "desc",
  },
  {
    label: "Name (A - Z)",
    label_bn: "নাম (A - Z)",
    value: "name_asc",
  },
  {
    label: "Name (Z - A)",
    label_bn: "নাম (Z - A)",
    value: "name_desc",
  },
]
