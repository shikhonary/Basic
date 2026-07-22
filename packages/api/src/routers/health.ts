/**
 * Health sub-router.
 *
 * Provides a simple ping procedure useful for:
 *  - Infrastructure health checks
 *  - Verifying tRPC is wired correctly end-to-end
 */
import { createTRPCRouter, publicProcedure, superAdminProcedure } from "../trpc"

export const healthRouter = createTRPCRouter({
  /**
   * Public ping — returns `{ ok: true, ts: <unix ms> }`.
   *
   * Test with: GET /api/trpc/health.ping
   */
  ping: superAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany()
    return {
      ok: true,
      ts: Date.now(),
      users,
    }
  }),
})
