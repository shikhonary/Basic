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
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query"

function isUnauthorizedError(error: unknown): boolean {
  if (error && typeof error === "object") {
    if ("code" in error && (error as any).code === "UNAUTHORIZED") return true
    if (
      "message" in error &&
      typeof (error as any).message === "string" &&
      ((error as any).message.includes("signed in") ||
        (error as any).message.includes("UNAUTHORIZED"))
    ) {
      return true
    }
  }
  return false
}

function handleUnauthorized(error: unknown) {
  if (!isServer && typeof window !== "undefined" && isUnauthorizedError(error)) {
    const currentPath = window.location.pathname
    if (!currentPath.startsWith("/auth/sign-in")) {
      window.location.href = `/auth/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`
    }
  }
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleUnauthorized(error),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleUnauthorized(error),
    }),
    defaultOptions: {
      queries: {
        /**
         * 30 s stale time prevents refetches on window focus for data
         * that was just fetched on the server.
         */
        staleTime: 30 * 1_000,
        retry: (failureCount, error) => {
          if (isUnauthorizedError(error)) return false
          return failureCount < 3
        },
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
