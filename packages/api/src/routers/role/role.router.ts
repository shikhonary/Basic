/**
 * Role sub-router.
 *
 * Thin tRPC layer — delegates business logic to `role.service.ts`.
 * No raw DB calls here.
 */
import { createTRPCRouter, superAdminProcedure } from "../../trpc"
import { roleForSelectionSchema } from "./role.schema"
import { getRolesForSelection } from "./role.service"

export const roleRouter = createTRPCRouter({
  /**
   * Fetch all roles for selection inputs, with optional name filter.
   */
  forSelection: superAdminProcedure
    .input(roleForSelectionSchema)
    .query(({ ctx, input }) => getRolesForSelection(ctx.db, input)),
})
