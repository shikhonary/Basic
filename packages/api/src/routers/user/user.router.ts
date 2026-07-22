/**
 * User sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `user.service.ts`. No raw DB calls here.
 *
 * All procedures require super-admin access (platform-level user management).
 */
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../../trpc"
import {
  deleteUserSchema,
  getUserSchema,
  listUsersSchema,
  updateUserSchema,
  updateUserRolesSchema,
} from "./user.schema"
import {
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
  updateUserRoles,
} from "./user.service"

export const userRouter = createTRPCRouter({
  /**
   * Fetch current user's profile and bound roles.
   */
  me: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.session.user,
      roles: ctx.roles,
    }
  }),
  /**
   * List all users with cursor-based pagination.
   * Returns only safe fields (no passwords, tokens, etc.).
   */
  list: superAdminProcedure
    .input(listUsersSchema)
    .query(({ ctx, input }) => listUsers(ctx.db, input)),

  /**
   * Fetch a single user by id.
   */
  byId: superAdminProcedure
    .input(getUserSchema)
    .query(({ ctx, input }) => getUserById(ctx.db, input)),

  /**
   * Update a user's profile fields.
   */
  update: superAdminProcedure
    .input(updateUserSchema)
    .mutation(({ ctx, input }) => updateUser(ctx.db, input)),

  /**
   * Update a user's assigned roles by role IDs (Super Admin only).
   */
  updateRoles: superAdminProcedure
    .input(updateUserRolesSchema)
    .mutation(({ ctx, input }) => updateUserRoles(ctx.db, input)),

  /**
   * Permanently delete a user and cascade their sessions/accounts.
   */
  delete: superAdminProcedure
    .input(deleteUserSchema)
    .mutation(({ ctx, input }) => deleteUser(ctx.db, input)),
})
