/**
 * Academic Class domain — Zod input/output schemas.
 *
 * Single source of truth for academic class procedure types.
 */
import { z } from "zod"
import { idSchema, paginationSchema } from "../../schemas/common"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const academicClassSortEnum = z.enum([
  "All",
  "position_asc",
  "position_desc",
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
])
export type AcademicClassSortOption = z.infer<typeof academicClassSortEnum>

export const listAcademicClassesSchema = paginationSchema.extend({
  level: z.string().optional(),
  query: z.string().optional(),
  sort: academicClassSortEnum.optional(),
  page: z.number().int().min(1).optional(),
})

export type ListAcademicClassesInput = z.infer<typeof listAcademicClassesSchema>

export const getAcademicClassSchema = idSchema

export type GetAcademicClassInput = z.infer<typeof getAcademicClassSchema>

export const academicClassForSelectionSchema = z.object({
  level: z.string().optional(),
})

export type AcademicClassForSelectionInput = z.infer<
  typeof academicClassForSelectionSchema
>

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const createAcademicClassSchema = z.object({
  nameBn: z.string().min(1, "Bangla name is required"),
  nameEn: z.string().min(1, "English name is required"),
  level: z.string().min(1, "Level is required"),
  position: z.number().int().default(0),
})

export type CreateAcademicClassInput = z.infer<typeof createAcademicClassSchema>

export const updateAcademicClassSchema = z.object({
  id: z.string().min(1),
  nameBn: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  level: z.string().min(1).optional(),
  position: z.number().int().optional(),
})

export type UpdateAcademicClassInput = z.infer<typeof updateAcademicClassSchema>

export const deleteAcademicClassSchema = idSchema

export type DeleteAcademicClassInput = z.infer<typeof deleteAcademicClassSchema>

// ---------------------------------------------------------------------------
// Select Shape
// ---------------------------------------------------------------------------

export const safeAcademicClassSelect = {
  id: true,
  nameBn: true,
  nameEn: true,
  level: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const
