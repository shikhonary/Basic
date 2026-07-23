import { auth } from "@workspace/auth/server"
import { toNextJsHandler } from "better-auth/next-js"

/**
 * Catch-all route handler that delegates all /api/auth/* requests
 * to Better Auth. This handles sign-in, sign-up, sign-out, session
 * retrieval, CSRF, and callback endpoints automatically.
 */
export const { GET, POST } = toNextJsHandler(auth)
