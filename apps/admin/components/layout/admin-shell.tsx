"use client"

import { useState, useEffect } from "react"
import { SideNav } from "./side-nav"
import { TopNav } from "./top-nav"
import { MobileNav } from "./mobile-nav"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse on screens less than desktop view (1280px / xl breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      {/* Side Navigation (Desktop & Tablet) */}
      <SideNav
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Wrapper */}
      <div
        className={`flex flex-1 flex-col w-full min-h-screen transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
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
