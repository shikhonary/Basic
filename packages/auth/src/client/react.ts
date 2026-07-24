import { createAuthClient } from "better-auth/react"
import { phoneNumberClient } from "better-auth/client/plugins"

/**
 * Type-safe browser / React auth client.
 *
 * Use this in React components and hooks to interact with auth:
 *   - authClient.signIn.email(...)
 *   - authClient.signUp.email(...)
 *   - authClient.signIn.phoneNumber(...)
 *   - authClient.signOut()
 *   - authClient.useSession()
 */
export const authClient = createAuthClient({
  plugins: [phoneNumberClient()],
})

export type Session = typeof authClient.$Infer.Session

