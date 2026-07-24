/**
 * tRPC HTTP route handler.
 *
 * Exposes all tRPC procedures over HTTP at `/api/trpc/*`.
 * This is the endpoint the browser client hits (via httpBatchLink).
 *
 * Both GET (for queries) and POST (for mutations) are exported so the
 * tRPC batch link can use either method depending on payload size.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter, createTRPCContext } from "@workspace/api"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    /**
     * Security headers added to every tRPC response.
     */
    responseMeta: () => ({
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`tRPC error on [${path ?? "<no-path>"}]:`, error)
          }
        : ({ path, error }) => {
            // Production: log message only — never emit stack traces to stdout
            // which could leak internal file paths or sensitive data.
            console.error(`tRPC error on [${path ?? "<no-path>"}]: ${error.message}`)
          },
  })

export { handler as GET, handler as POST }
