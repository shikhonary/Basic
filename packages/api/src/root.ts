/**
 * Root application router.
 *
 * Merges all sub-routers into a single `appRouter` that is consumed by:
 *  - The Next.js HTTP fetch handler (`app/api/trpc/[trpc]/route.ts`)
 *  - The RSC server-side caller (`trpc/server.ts` in each app)
 *
 * Add new sub-routers here as the API grows.
 */
import { createTRPCRouter, createCallerFactory } from "./trpc"
import { healthRouter } from "./routers/health"
import { userRouter } from "./routers/user/user.router"
import { roleRouter } from "./routers/role/role.router"
import { tenantRouter } from "./routers/tenant/tenant.router"

export const appRouter = createTRPCRouter({
  health: healthRouter,
  user: userRouter,
  role: roleRouter,
  tenant: tenantRouter,
})

/** Type used by the client to infer procedure types end-to-end. */
export type AppRouter = typeof appRouter

/** Factory used in `trpc/server.ts` to build the RSC caller. */
export const createCaller = createCallerFactory(appRouter)
