/**
 * Shared QueryClient factory.
 *
 * - On the server: always creates a fresh QueryClient per request (React
 *   renders on the server are concurrent and must not share state).
 * - On the browser: reuses a single QueryClient instance across renders.
 *
 * The `dehydrate` configuration ensures pending queries are streamed to the
 * client so hydration works correctly with Suspense.
 */
import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * 30 s stale time prevents refetches on window focus for data
         * that was just fetched on the server.
         */
        staleTime: 30 * 1_000,
      },
      dehydrate: {
        // Include pending (in-flight) queries so RSC prefetches are streamed
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always create a new client so concurrent renders don't collide
    return makeQueryClient()
  }
  // Browser: reuse the singleton across renders
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
