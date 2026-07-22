/**
 * Logging middleware for tRPC procedures.
 *
 * Logs every procedure call with timing and outcome.
 * In production: no stack traces are emitted to stdout.
 * In development: full error details are logged.
 *
 * Wired into all procedures via `t.procedure.use(loggingMiddleware)` in trpc.ts.
 */
export function createLoggingMiddleware() {
  return async function loggingMiddleware<T>({
    path,
    type,
    next,
  }: {
    path: string
    type: string
    next: () => Promise<T>
  }): Promise<T> {
    const start = Date.now()
    try {
      const result = await next()
      const durationMs = Date.now() - start
      if (process.env.NODE_ENV !== "production") {
        console.log(`[tRPC] ✓ ${type} ${path} — ${durationMs}ms`)
      }
      return result
    } catch (err) {
      const durationMs = Date.now() - start
      const message = err instanceof Error ? err.message : String(err)
      if (process.env.NODE_ENV !== "production") {
        console.error(`[tRPC] ✗ ${type} ${path} — ${durationMs}ms`, err)
      } else {
        // Production: log message only, never the stack trace
        console.error(`[tRPC] error on ${path}: ${message}`)
      }
      throw err
    }
  }
}
