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
  createdAt: true,
  updatedAt: true,
} as const
