/**
 * Public barrel for @workspace/api.
 *
 * Only server-safe exports live here. Never import this in a Client Component.
 *
 * IMPORTANT: Procedure builders (publicProcedure, protectedProcedure, etc.)
 * are intentionally NOT exported from this barrel. They are internal to the
 * package and should only be imported within `packages/api/src/routers/`.
 * Consumers should only depend on `AppRouter`, `createTRPCContext`, and types.
 */
export { createTRPCContext } from "./trpc"
export type {
  TRPCContext,
  AuthedTRPCContext,
  SuperAdminTRPCContext,
  TenantTRPCContext,
} from "./trpc"
export { appRouter, createCaller } from "./root"
export type { AppRouter } from "./root"
export type {
  ListUsersInput,
  GetUserInput,
  UpdateUserInput,
  UpdateUserRolesInput,
  DeleteUserInput,
} from "./routers/user/user.schema"
export type { RoleForSelectionInput } from "./routers/role/role.schema"

