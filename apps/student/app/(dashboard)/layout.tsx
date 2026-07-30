import { AdminShell } from "@/components/layout"
import { ProfileConfirmationModal } from "@/modules/profile/components/ProfileConfirmationModal"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminShell>
      <ProfileConfirmationModal />
      {children}
    </AdminShell>
  )
}
