/**
 * Role sub-router.
 *
 * Thin tRPC layer — delegates business logic to `role.service.ts`.
 * No raw DB calls here.
 */
import { z } from "zod"
import { createTRPCRouter, superAdminProcedure } from "../../trpc"
import {
  roleForSelectionSchema,
  listRolesSchema,
  createRoleSchema,
  updateRoleSchema,
} from "./role.schema"
import {
  getRolesForSelection,
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./role.service"

export const roleRouter = createTRPCRouter({
  /**
   * Fetch all roles for selection inputs, with optional name filter.
   */
  forSelection: superAdminProcedure
    .input(roleForSelectionSchema)
    .query(({ ctx, input }) => getRolesForSelection(ctx.db, input)),

  /**
   * List all roles with query search and cursor-based pagination.
   */
  list: superAdminProcedure
    .input(listRolesSchema)
    .query(({ ctx, input }) => listRoles(ctx.db, input)),

  /**
   * Get single role by ID.
   */
  byId: superAdminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => getRoleById(ctx.db, input)),

  /**
   * Create a new system role.
   */
  create: superAdminProcedure
    .input(createRoleSchema)
    .mutation(({ ctx, input }) => createRole(ctx.db, input)),

  /**
   * Update an existing system role.
   */
  update: superAdminProcedure
    .input(updateRoleSchema)
    .mutation(({ ctx, input }) => updateRole(ctx.db, input)),

  /**
   * Delete a system role.
   */
  delete: superAdminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => deleteRole(ctx.db, input)),
})
