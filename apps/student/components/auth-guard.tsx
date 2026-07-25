"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@workspace/auth/client"
import { trpc } from "@/trpc/client"
import { UnauthorizedScreen } from "@/components/unauthorized-screen"
import { useCurrentUser } from "@/modules/user/services/use-user"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { session, roles, isSuperAdmin, isLoading: isUserLoading } = useCurrentUser()

  const isAuthRoute = pathname?.startsWith("/auth")
  const isOnboardingRoute = pathname === "/onboarding"

  // Check if user has USER, STUDENT, or Student role
  const isUserRole =
    roles.some(
      (role) =>
        role.name === "USER" ||
        role.name === "STUDENT" ||
        role.name === "Student"
    ) || (!isSuperAdmin && roles.length > 0)

  // Fetch student profile for authenticated user
  const studentProfileQuery = useQuery({
    ...trpc.student.getProfile.queryOptions(),
    enabled: !!session && isUserRole,
    staleTime: 5 * 60 * 1000,
  })

  const isProfileFetching =
    studentProfileQuery.isLoading || studentProfileQuery.isFetching

  useEffect(() => {
    // 1. Unauthenticated -> redirect to sign-in
    if (!isAuthRoute && !isUserLoading && !session) {
      router.push("/auth/sign-in")
      return
    }

    // 2. Authenticated user with USER role who hasn't completed onboarding -> redirect to /onboarding
    if (
      session &&
      !isUserLoading &&
      !isProfileFetching &&
      isUserRole &&
      !isSuperAdmin &&
      !studentProfileQuery.data &&
      !isOnboardingRoute
    ) {
      router.push("/onboarding")
      return
    }

    // 3. Authenticated user who HAS completed onboarding but is on /onboarding -> redirect to /
    if (
      session &&
      !isUserLoading &&
      !isProfileFetching &&
      studentProfileQuery.data &&
      isOnboardingRoute
    ) {
      router.push("/")
    }
  }, [
    isAuthRoute,
    isOnboardingRoute,
    session,
    isUserLoading,
    isProfileFetching,
    studentProfileQuery.data,
    isUserRole,
    isSuperAdmin,
    router,
  ])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  // Bypass auth checks for public authentication routes (e.g. /auth/sign-in)
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Loading state for session or student profile check
  if (
    isUserLoading ||
    (!!session && isUserRole && isProfileFetching)
  ) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
            sync
          </span>
          <span className="text-sm font-medium text-on-surface-variant">
            Checking authorization & onboarding status...
          </span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // If not super admin and not a standard user role, show unauthorized screen
  if (!isSuperAdmin && !isUserRole) {
    return (
      <UnauthorizedScreen
        email={session.user.email}
        roles={roles.map((r) => r.name)}
        onSignOut={handleSignOut}
      />
    )
  }

  // Prevent rendering protected children if user has not completed onboarding and is not yet on /onboarding
  if (!isSuperAdmin && !studentProfileQuery.data && !isOnboardingRoute) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
            sync
          </span>
          <span className="text-sm font-medium text-on-surface-variant">
            Redirecting to onboarding...
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

