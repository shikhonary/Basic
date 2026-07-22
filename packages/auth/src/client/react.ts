import { createAuthClient } from "better-auth/react"

/**
 * Type-safe browser / React auth client.
 *
 * Use this in React components and hooks to interact with auth:
 *   - authClient.signIn.email(...)
 *   - authClient.signUp.email(...)
 *   - authClient.signOut()
 *   - authClient.useSession()
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export type Session = typeof authClient.$Infer.Session
