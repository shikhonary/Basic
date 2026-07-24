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

// ---------------------------------------------------------------------------
// Exam System
// ---------------------------------------------------------------------------

export const EXAM_STATUS = {
  PENDING: "Pending",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
} as const

export type ExamStatus = (typeof EXAM_STATUS)[keyof typeof EXAM_STATUS]

export const ATTEMPT_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  AUTO_SUBMITTED: "Auto-Submitted",
  ABANDONED: "Abandoned",
} as const

export type AttemptStatus = (typeof ATTEMPT_STATUS)[keyof typeof ATTEMPT_STATUS]

export const SUBMISSION_TYPE = {
  MANUAL: "Manual",
  AUTO_TIME_UP: "Auto-TimeUp",
  AUTO_TAB_SWITCH: "Auto-TabSwitch",
} as const

export type SubmissionType =
  (typeof SUBMISSION_TYPE)[keyof typeof SUBMISSION_TYPE]

export const FEEDBACK_STATUS = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  RESOLVED: "Resolved",
} as const

export type FeedbackStatus =
  (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS]

export const MCQ_TYPE = {
  SINGLE: "SINGLE",
  MULTIPLE: "MULTIPLE",
  CONTEXTUAL: "CONTEXTUAL",
} as const

export type MCQType = (typeof MCQ_TYPE)[keyof typeof MCQ_TYPE]
