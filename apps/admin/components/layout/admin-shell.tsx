"use client"

import { SideNav } from "./side-nav"
import { TopNav } from "./top-nav"
import { MobileNav } from "./mobile-nav"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      {/* Side Navigation (Desktop) */}
      <SideNav />

      {/* Main Wrapper */}
      <div className="flex flex-1 flex-col w-full md:ml-64 min-h-screen">
        {/* Top Navigation (Sticky) */}
        <TopNav />

        {/* Main Content Area Canvas */}
        <main className="flex-1 bg-surface-bright p-6 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
