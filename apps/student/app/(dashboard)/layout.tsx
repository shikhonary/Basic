import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@workspace/auth/server"
import { db } from "@workspace/db/main"
import { AdminShell } from "@/components/layout"
import { ProfileConfirmationModal } from "@/modules/profile/components/ProfileConfirmationModal"

/**
 * Dashboard layout — Server Component auth gate.
 *
 * Runs on the server before any HTML is sent to the browser, so there is
 * no client-side spinner and no extra round-trips from the browser.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Resolve session server-side — zero browser round-trips
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/auth/sign-in")
  }

  // Fetch roles in a single query alongside the session user
  const userWithRoles = await db.user.findUnique({
    where: { id: session.user.id },
    select: { roles: { select: { name: true } } },
  })

  const roles = userWithRoles?.roles ?? []
  const isSuperAdmin = roles.some((r) => r.name === "SUPER_ADMIN")
  const isUserRole =
    roles.some(
      (role) =>
        role.name === "USER" ||
        role.name === "STUDENT" ||
        role.name === "Student"
    ) || (!isSuperAdmin && roles.length > 0)

  if (!isSuperAdmin && !isUserRole) {
    redirect("/auth/sign-in?error=unauthorized")
  }

  // Fetch student profile to check onboarding status
  const studentProfile = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  // If user has a student role, is not a super admin, and has not onboarded -> redirect to onboarding
  if (isUserRole && !isSuperAdmin && !studentProfile) {
    redirect("/onboarding")
  }

  return (
    <AdminShell>
      <ProfileConfirmationModal />
      {children}
    </AdminShell>
  )
}
