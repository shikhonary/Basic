"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@workspace/auth/client"
import Image from "next/image"
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Layers,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/academic-classes", label: "Classes", icon: GraduationCap },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/chapters", label: "Chapters", icon: Layers },
  { href: "/mcqs", label: "MCQs", icon: HelpCircle },
  { href: "/users", label: "Users", icon: Users },
  { href: "/schedule", label: "Batch Schedule", icon: Calendar },
  { href: "/exams", label: "Exams", icon: ClipboardList },
  { href: "/reports", label: "Progress Reports", icon: BarChart3 },
  { href: "/fees", label: "Fees", icon: CreditCard },
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
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-6 py-3 transition-all duration-200 ${isActive
                  ? "sidebar-item-active font-bold text-primary border-r-4 border-primary bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
              >
                <Icon className="h-5 w-5" />
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
          <Settings className="h-5 w-5" />
          <span className="font-label-sm text-label-sm uppercase tracking-wider">
            Settings
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-4 px-6 py-3 text-error transition-all duration-200 hover:bg-error-container/20 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-label-sm text-label-sm uppercase tracking-wider">
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
