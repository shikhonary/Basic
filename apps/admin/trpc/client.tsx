"use client";

import "client-only"

import type { AppRouter } from "@workspace/api"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import {
  createTRPCContext,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import superjson from "superjson"
import { useState } from "react"
import { getQueryClient } from "./query-client"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

function makeTRPCClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          })
        },
        /**
         * superjson must match the transformer set in `packages/api/src/trpc.ts`.
         */
        transformer: superjson,
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// React context — wires tRPC client to TanStack Query
// ---------------------------------------------------------------------------

/**
 * `createTRPCContext` returns { TRPCProvider, useTRPC, useTRPCClient }.
 * We destructure what we need.
 */
const { TRPCProvider } = createTRPCContext<AppRouter>()

// ---------------------------------------------------------------------------
// tRPC options proxy — generates queryOptions / mutationOptions factories
// ---------------------------------------------------------------------------

/**
 * Type-safe tRPC options proxy.
 *
 * Usage example in a Client Component:
 *   import { trpc } from "@/trpc/client"
 *   import { useQuery } from "@tanstack/react-query"
 *   const { data } = useQuery(trpc.health.ping.queryOptions())
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: makeTRPCClient(),
  queryClient: getQueryClient,
})

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Wraps the application with TanStack QueryClientProvider + tRPC context.
 *
 * Mount once at the root layout — do NOT nest.
 */
export function TRPCReactProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  // A single tRPC client instance is created once per component mount and
  // reused for the lifetime of the provider (no duplicate instances).
  const [trpcClient] = useState(makeTRPCClient)

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TRPCProvider>
  )
}
