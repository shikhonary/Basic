/**
 * Auth middleware.
 *
 * Provides a reusable middleware factory for tRPC procedures.
 * Extracted from trpc.ts so each concern lives in its own file.
 *
 * NOTE (dev): The session check is intentionally left as a passthrough
 * during development. Re-enable before shipping to production.
 */
import "server-only"

import { TRPCError } from "@trpc/server"
import { auth } from "@workspace/auth/server"
import type { Role } from "@workspace/db/main"
import type { TRPCContext } from "../trpc"

/**
 * Validates the incoming request has a live Better Auth session.
 * Throws `UNAUTHORIZED` if not.
 *
 * @example
 *   export const protectedProcedure = t.procedure.use(requireSession)
 */
export async function requireSession(ctx: TRPCContext) {
  // DEV: Passthrough — swap for the block below when going to production.
  // const session = await auth.api.getSession({ headers: ctx.headers })
  // if (!session) {
  //   throw new TRPCError({ code: "UNAUTHORIZED", message: "Session required." })
  // }
  // return session
  return null as Awaited<ReturnType<typeof auth.api.getSession>>
}

/**
 * Validates the session user has the `SUPER_ADMIN` role.
 */
export function requireSuperAdmin(roles: Role[]) {
  const hasSuperAdmin = roles.some((role) => role.name === "SUPER_ADMIN")
  if (!hasSuperAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Super admin access required.",
    })
  }
}
