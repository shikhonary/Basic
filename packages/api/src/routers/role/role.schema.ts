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
