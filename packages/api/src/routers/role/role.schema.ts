/**
 * Role domain — Zod input/output schemas.
 */
import { z } from "zod"

export const roleForSelectionSchema = z
  .object({
    name: z.string().optional(),
  })
  .optional()

export type RoleForSelectionInput = z.infer<typeof roleForSelectionSchema>

export const listRolesSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  query: z.string().optional(),
})

export type ListRolesInput = z.infer<typeof listRolesSchema>

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>

export const updateRoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
})

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
