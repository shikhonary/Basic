/**
 * Student domain — Zod input/output schemas.
 *
 * Single source of truth for student procedure input validation and shapes.
 */
import { z } from "zod"

export const completeStudentOnboardingSchema = z.object({
  // Required fields according to Prisma model
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  institute: z.string().min(1, "Institute is required"),
  academicClassId: z.string().min(1, "Academic class selection is required"),

  // Optional fields
  roll: z.coerce.number().int().optional(),
  isOfflineStudent: z.boolean().optional(),
  group: z.string().optional().nullable(),
  isProfileConfirmed: z.boolean().optional(),
})

export type CompleteStudentOnboardingInput = z.infer<
  typeof completeStudentOnboardingSchema
>

export const updateStudentProfileSchema = completeStudentOnboardingSchema.partial().extend({
  name: z.string().optional(),
  phone: z.string().optional(),
  institute: z.string().optional(),
  academicClassId: z.string().optional(),
  group: z.string().optional().nullable(),
  isProfileConfirmed: z.boolean().optional(),
})

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>

// ---------------------------------------------------------------------------
// Student CRUD API Schemas (Admin)
// ---------------------------------------------------------------------------

export const listStudentsSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(20),
  page: z.number().int().min(1).optional().default(1),
  query: z.string().optional(),
  academicClassId: z.string().optional(),
  isOfflineStudent: z.boolean().optional(),
  isLinkedToUser: z.boolean().optional(),
  sort: z.enum([
    "All",
    "name_asc",
    "name_desc",
    "roll_asc",
    "roll_desc",
    "newest",
    "oldest"
  ]).optional().default("All"),
})

export type ListStudentsInput = z.infer<typeof listStudentsSchema>

export const createStudentSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  phone: z.string().min(1, "Phone number is required"),
  institute: z.string().min(1, "Institute name is required"),
  roll: z.coerce.number().int().optional().nullable(),
  isOfflineStudent: z.boolean(),
  academicClassId: z.string().min(1, "Academic class is required"),
  userId: z.string().optional().nullable(),
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>

export const updateStudentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  institute: z.string().min(1).optional(),
  roll: z.coerce.number().int().optional().nullable(),
  isOfflineStudent: z.boolean().optional(),
  academicClassId: z.string().min(1).optional(),
  userId: z.string().optional().nullable(),
})

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>

export const getStudentSchema = z.object({
  id: z.string().min(1),
})

export type GetStudentInput = z.infer<typeof getStudentSchema>

export const deleteStudentSchema = z.object({
  id: z.string().min(1),
})

export type DeleteStudentInput = z.infer<typeof deleteStudentSchema>

// ---------------------------------------------------------------------------
// Select Shapes
// ---------------------------------------------------------------------------

export const safeStudentSelect = {
  id: true,
  name: true,
  phone: true,
  institute: true,
  roll: true,
  isOfflineStudent: true,
  group: true,
  isProfileConfirmed: true,
  academicClassId: true,
  academicClass: {
    select: {
      id: true,
      nameBn: true,
      nameEn: true,
      level: true,
    },
  },
  userId: true,
  user: {
    select: {
      image: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const

