/**
 * User domain — Zod input/output schemas.
 *
 * These are the single source of truth for user procedure types.
 * Both the server (procedure `.input()`) and client (form validation)
 * should import from here rather than re-declaring shapes.
 */
import { z } from "zod"
import { idSchema, paginationSchema } from "../../schemas/common"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const listUsersSchema = paginationSchema

export type ListUsersInput = z.infer<typeof listUsersSchema>

export const getUserSchema = idSchema

export type GetUserInput = z.infer<typeof getUserSchema>

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  image: z.string().url().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const deleteUserSchema = idSchema

export type DeleteUserInput = z.infer<typeof deleteUserSchema>

export const updateUserRolesSchema = z.object({
  userId: z.string().min(1),
  roleIds: z.array(z.string()).min(1, "At least one role ID must be assigned"),
})

export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>

export const updateContactSchema = z.object({
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
})

export type UpdateContactInput = z.infer<typeof updateContactSchema>

// ---------------------------------------------------------------------------
// Output shapes (safe fields only — never include password hashes etc.)
// ---------------------------------------------------------------------------

/** Columns safe to return from any user query. */
export const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  image: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  createdAt: true,
  updatedAt: true,
} as const
