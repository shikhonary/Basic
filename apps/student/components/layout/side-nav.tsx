"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@workspace/auth/client"
import Image from "next/image"

const navItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/users", label: "Users", icon: "group" },
  { href: "/schedule", label: "Batch Schedule", icon: "calendar_month" },
  { href: "/exams", label: "Exams", icon: "quiz" },
  { href: "/reports", label: "Progress Reports", icon: "analytics" },
  { href: "/fees", label: "Fees", icon: "payments" },
]

export function SideNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant/30 bg-surface-container-low md:flex">
      {/* Header Section */}
      <div className="flex flex-col gap-1 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded text-on-primary-container">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="font-extrabold text-headline-md font-headline-md text-on-surface leading-none tracking-tight">
              Basic
            </h2>
            <span className="mt-1 font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Education Care
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="mt-4 flex-1">
        <div className="flex flex-col">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-6 py-3 transition-all duration-200 ${isActive
                  ? "sidebar-item-active font-bold text-primary border-r-4 border-primary bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="border-t border-outline-variant/30 py-4">
        <Link
          href="/settings"
          className="group flex items-center gap-4 px-6 py-3 text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider">
            Settings
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-4 px-6 py-3 text-error transition-all duration-200 hover:bg-error-container/20 cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider">
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
