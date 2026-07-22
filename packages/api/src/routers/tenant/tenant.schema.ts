/**
 * Tenant domain — Zod input/output schemas.
 */
import { z } from "zod"
import { idSchema, paginationSchema, slugSchema } from "../../schemas/common"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const listTenantsSchema = paginationSchema

export type ListTenantsInput = z.infer<typeof listTenantsSchema>

export const getTenantSchema = idSchema

export type GetTenantInput = z.infer<typeof getTenantSchema>

export const getTenantBySlugSchema = slugSchema

export type GetTenantBySlugInput = z.infer<typeof getTenantBySlugSchema>

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const createTenantSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  name: z.string().min(1).max(200),
})

export type CreateTenantInput = z.infer<typeof createTenantSchema>

export const updateTenantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
})

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>

export const deleteTenantSchema = idSchema

export type DeleteTenantInput = z.infer<typeof deleteTenantSchema>
