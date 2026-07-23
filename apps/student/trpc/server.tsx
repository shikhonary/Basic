/**
 * Server-side tRPC caller for React Server Components (RSC).
 *
 * tRPC v11 RSC pattern — `createTRPCOptionsProxy` on the server bypasses the
 * HTTP layer entirely: procedures are called in-process while still running
 * all middleware (auth, validation, etc.).
 *
 * Typical usage in a Server Component:
 *
 *   // Prefetch on the server so the client receives hydrated data:
 *   await queryClient.prefetchQuery(trpc.health.ping.queryOptions())
 *
 *   // Or call directly and use the result in RSC:
 *   const result = await trpc.health.ping()
 *
 * The context is built from `next/headers` so cookies (Better Auth session
 * cookie) are forwarded automatically.
 *
 * `cache()` dedups the context across multiple RSC renders in the same request.
 */
import "server-only"

import { createTRPCContext, createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { appRouter, createTRPCContext as createApiContext } from "@workspace/api"
import { headers } from "next/headers"
import { cache } from "react"
import { getQueryClient } from "./query-client"

const getContext = cache(async () => {
  const h = await headers()
  return createApiContext({ headers: h })
})

/** Server-side tRPC proxy — call procedures directly in RSC. */
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: getContext,
  queryClient: getQueryClient,
})

/**
 * Hydrate client — wraps RSC output to stream prefetched query data
 * to Client Components without an extra network round-trip.
 *
 * Usage:
 *   return (
 *     <HydrateClient>
 *       <MyClientComponent />
 *     </HydrateClient>
 *   )
 */
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
