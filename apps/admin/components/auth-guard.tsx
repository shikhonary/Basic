"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@workspace/auth/client"
import { UnauthorizedScreen } from "@/components/unauthorized-screen"
import { useCurrentUser } from "@/modules/user/services/use-user"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { session, roles, isSuperAdmin, isLoading } = useCurrentUser()

  const isAuthRoute = pathname?.startsWith("/auth")

  useEffect(() => {
    if (!isAuthRoute && !isLoading && !session) {
      router.push("/auth/sign-in")
    }
  }, [isAuthRoute, session, isLoading, router])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  // Bypass auth checks for public authentication routes (e.g. /auth/sign-in)
  if (isAuthRoute) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
            sync
          </span>
          <span className="text-sm font-medium text-on-surface-variant">
            Checking authorization...
          </span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!isSuperAdmin) {
    return (
      <UnauthorizedScreen
        email={session.user.email}
        roles={roles.map((r) => r.name)}
        onSignOut={handleSignOut}
      />
    )
  }

  return <>{children}</>
}
