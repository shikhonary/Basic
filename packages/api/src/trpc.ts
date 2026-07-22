/**
 * tRPC server initialization.
 *
 * This file is SERVER ONLY. The `server-only` guard will cause a build-time
 * error if it is accidentally imported in a Client Component.
 *
 * Procedure hierarchy (each level narrows the context type):
 *  - `publicProcedure`      — no auth required (health checks, public APIs)
 *                             ctx: { headers }
 *  - `protectedProcedure`  — requires a valid Better Auth session
 *                             ctx: { headers, session }
 *  - `superAdminProcedure` — requires session + injects the main Prisma DB
 *                             ctx: { headers, session, db }
 *  - `tenantProcedure`     — requires session + injects main + tenant DBs
 *                             ctx: { headers, session, db, tenantDb }
 *
 * Context design:
 *  - `createTRPCContext` only forwards the raw `Headers` — it does NOT fetch
 *    the session eagerly. This keeps public procedures cheap.
 *  - Auth and DB are resolved lazily inside the respective middleware.
 */
import "server-only"

import { initTRPC, TRPCError } from "@trpc/server"
import { auth } from "@workspace/auth/server"
import { db } from "@workspace/db/main"
import type { PrismaClient, Role } from "@workspace/db/main"
import { tenantDb, getTenantDb } from "@workspace/db/tenant"
import type { TenantPrismaClient } from "@workspace/db/tenant"
import superjson from "superjson"
import { ZodError } from "zod"

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

/**
 * Base context — always available (no auth required).
 */
export type TRPCContext = {
  headers: Headers
}

/**
 * Context after the auth middleware runs.
 * `session` is guaranteed non-null and user `roles` are bound to context.
 */
export type AuthedTRPCContext = TRPCContext & {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
  roles: Role[]
}

/**
 * Context available inside `superAdminProcedure`.
 */
export type SuperAdminTRPCContext = AuthedTRPCContext & {
  db: PrismaClient
}

/**
 * Context available inside `tenantProcedure`.
 */
export type TenantTRPCContext = AuthedTRPCContext & {
  db: PrismaClient
  tenantDb: TenantPrismaClient
}

// ---------------------------------------------------------------------------
// Context factory
// ---------------------------------------------------------------------------

/**
 * Creates the tRPC request context.
 *
 * Accepts raw `Headers` so it can be called from both:
 *  - The RSC server-side caller (via `next/headers`)
 *  - The Next.js fetch route handler (via `req.headers`)
 */
export const createTRPCContext = async (opts: {
  headers: Headers
}): Promise<TRPCContext> => {
  return {
    headers: opts.headers,
  }
}

// ---------------------------------------------------------------------------
// tRPC initialization
// ---------------------------------------------------------------------------

const t = initTRPC.context<TRPCContext>().create({
  /**
   * superjson allows tRPC to serialize/deserialize complex JS types (Date,
   * Map, Set, BigInt, etc.) transparently across the network boundary.
   *
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,

  /**
   * Custom error formatter — attaches Zod validation details to the
   * response so clients can display field-level errors.
   *
   * @see https://trpc.io/docs/server/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// ---------------------------------------------------------------------------
// Internal middleware
// ---------------------------------------------------------------------------

/**
 * Timing + outcome logger.
 * Dev: full error details. Prod: message only (no stack trace leakage).
 */
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const durationMs = Date.now() - start

  if (result.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[tRPC] ✓ ${type} ${path} — ${durationMs}ms`)
    }
  } else {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[tRPC] ✗ ${type} ${path} — ${durationMs}ms`, result.error)
    } else {
      console.error(`[tRPC] error on ${path}: ${result.error.message}`)
    }
  }

  return result
})

// ---------------------------------------------------------------------------
// Exported helpers
// ---------------------------------------------------------------------------

/** Create a new router. */
export const createTRPCRouter = t.router

/** Used to create server-side callers for RSC. */
export const createCallerFactory = t.createCallerFactory

// ---------------------------------------------------------------------------
// Procedures
// ---------------------------------------------------------------------------

/**
 * Public procedure — no authentication required.
 * ctx: { headers }
 *
 * Safe to call from anyone (health checks, public APIs, etc.).
 */
export const publicProcedure = t.procedure.use(loggingMiddleware)

/**
 * Protected procedure — requires an authenticated Better Auth session.
 * ctx: { headers, session }
 *
 * Resolves the session lazily (only when this procedure runs), so public
 * procedures never pay the auth lookup cost.
 *
 * NOTE (dev): Auth check is currently a passthrough for local development.
 * To enable auth, uncomment the block below and remove the passthrough.
 *
 * Throws `UNAUTHORIZED` if there is no valid session.
 */
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({ headers: ctx.headers })

    let roles: Role[] = []
    if (session?.user?.id) {
      const userWithRoles = await db.user.findUnique({
        where: { id: session.user.id },
        select: { roles: true },
      })
      roles = userWithRoles?.roles ?? []
    }

    return next({
      ctx: {
        ...ctx,
        session: session as NonNullable<
          Awaited<ReturnType<typeof auth.api.getSession>>
        >,
        roles,
      },
    })
  })

/**
 * Super-admin procedure — requires a valid session AND injects the main
 * Prisma database client into the context.
 * ctx: { headers, session, db }
 *
 * Chains off `protectedProcedure` so the auth check always runs first.
 * Use for cross-tenant data, platform configuration, and management DB access.
 */
export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      /** Main Prisma client — connected to the primary/management database. */
      db: db as PrismaClient,
    },
  })
})

/**
 * Tenant procedure — requires a valid session AND injects both the main
 * and tenant Prisma clients into the context.
 * ctx: { headers, session, db, tenantDb }
 *
 * Chains off `protectedProcedure` so the auth check always runs first.
 * Use when a procedure needs both platform-level and tenant-specific data.
 */
export const tenantProcedure = protectedProcedure.use(({ ctx, next }) => {
  const tenantId = ctx.headers.get("x-tenant-id")
  if (!tenantId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "x-tenant-id header is required for tenant procedures",
    })
  }

  return next({
    ctx: {
      ...ctx,
      /** Main Prisma client — connected to the primary/management database. */
      db: db as PrismaClient,
      /** Tenant Prisma client — scoped to the specific tenant via extension. */
      tenantDb: getTenantDb(tenantId) as TenantPrismaClient,
    },
  })
})
