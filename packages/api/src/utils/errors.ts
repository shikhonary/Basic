/**
 * Standardized tRPC error helpers.
 *
 * Use these factories instead of throwing raw `TRPCError` inline so that
 * error codes, messages, and shapes stay consistent across all routers.
 */
import { TRPCError } from "@trpc/server"

// ---------------------------------------------------------------------------
// Auth errors
// ---------------------------------------------------------------------------

export function unauthorized(message = "You must be signed in to do that.") {
  return new TRPCError({ code: "UNAUTHORIZED", message })
}

export function forbidden(message = "You do not have permission to do that.") {
  return new TRPCError({ code: "FORBIDDEN", message })
}

// ---------------------------------------------------------------------------
// Resource errors
// ---------------------------------------------------------------------------

export function notFound(resource = "Resource") {
  return new TRPCError({
    code: "NOT_FOUND",
    message: `${resource} not found.`,
  })
}

export function conflict(message: string) {
  return new TRPCError({ code: "CONFLICT", message })
}

// ---------------------------------------------------------------------------
// Input errors
// ---------------------------------------------------------------------------

export function badRequest(message: string) {
  return new TRPCError({ code: "BAD_REQUEST", message })
}

// ---------------------------------------------------------------------------
// Server errors
// ---------------------------------------------------------------------------

export function internalError(message = "An unexpected error occurred.") {
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message })
}
