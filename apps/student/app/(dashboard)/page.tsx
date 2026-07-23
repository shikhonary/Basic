"use client"

import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { authClient } from "@workspace/auth/client"
import { useCurrentUser } from "@/modules/user/services/use-user"

export default function DashboardPage() {
  const router = useRouter()
  const { session, roles } = useCurrentUser()
  const { data: pingData } = useQuery(trpc.health.ping.queryOptions())

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/30">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px] text-primary">admin_panel_settings</span>
        </div>
        <div>
          <h1 className="font-headline-md text-2xl font-extrabold text-on-surface">BEC Workstation</h1>
          <p className="font-label-sm text-sm text-on-surface-variant">Admin Console Portal</p>
        </div>
      </div>

      {/* User Profile Card */}
      {session && (
        <div className="flex flex-col gap-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm">
          <h2 className="font-headline-sm text-lg font-bold text-on-surface">User Profile</h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <span className="text-on-surface-variant">Name:</span>
            <span className="col-span-2 font-semibold text-on-surface">{session.user.name}</span>

            <span className="text-on-surface-variant">Email:</span>
            <span className="col-span-2 font-semibold text-on-surface">{session.user.email}</span>

            <span className="text-on-surface-variant">Roles:</span>
            <span className="col-span-2 font-semibold text-primary">
              {roles.map((r) => r.name).join(", ")}
            </span>

            <span className="text-on-surface-variant">Verified:</span>
            <span className="col-span-2 font-semibold text-green-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Yes
            </span>
          </div>
        </div>
      )}

      {/* API connection status card */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm">
        <h2 className="font-headline-sm text-lg font-bold text-on-surface">System Integration Status</h2>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${pingData ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></div>
          <span className="text-sm font-medium">
            {pingData ? `Connected to Backend API: ${pingData}` : 'Checking backend server...'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSignOut}
          className="h-12 bg-error hover:bg-error/90 !text-white font-medium rounded-lg flex items-center gap-2 px-6 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          variant="default"
        >
          <span>Sign Out</span>
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </Button>
      </div>
    </div>
  )
}
