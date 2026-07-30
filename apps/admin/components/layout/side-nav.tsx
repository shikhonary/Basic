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
  ClipboardList,
  Settings,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"

const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Academic Setup",
    items: [
      { href: "/academic-classes", label: "Classes", icon: GraduationCap },
      { href: "/subjects", label: "Subjects", icon: BookOpen },
      { href: "/chapters", label: "Chapters", icon: Layers },
      { href: "/mcqs", label: "MCQs", icon: HelpCircle },
    ],
  },
  {
    title: "Exams & Grading",
    items: [
      { href: "/exams", label: "Exams", icon: ClipboardList },
      { href: "/exam-groups", label: "Exam Groups", icon: Layers },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/users", label: "Users", icon: Users },
      { href: "/students", label: "Students", icon: Users },
      { href: "/roles", label: "Roles", icon: Shield },
    ],
  },
]

interface SideNavProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function SideNav({ isCollapsed = false, onToggle }: SideNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-outline-variant/30 bg-surface-container-low transition-all duration-300 md:flex ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header Section */}
      <div
        className={`flex items-center p-4 border-b border-outline-variant/20 ${
          isCollapsed ? "flex-col justify-center gap-2" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded text-on-primary-container">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <h2 className="font-extrabold text-headline-md font-headline-md text-on-surface leading-none tracking-tight">
                Basic
              </h2>
              <span className="mt-1 font-label-sm text-[10px] text-outline uppercase tracking-wider">
                Education Care
              </span>
            </div>
          )}
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="mt-4 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-4 px-2">
          {navGroups.map((group, groupIdx) => (
            <div key={group.title} className="flex flex-col gap-1">
              {/* Group Header */}
              {isCollapsed ? (
                groupIdx > 0 && <div className="border-t border-outline-variant/30 my-2 mx-2" />
              ) : (
                <div className="font-label-sm text-[10px] text-outline/65 font-bold uppercase tracking-widest px-4 mt-2 mb-1">
                  {group.title}
                </div>
              )}

              {/* Items */}
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`group flex items-center gap-4 rounded-xl transition-all duration-200 ${
                      isCollapsed ? "justify-center p-3" : "px-4 py-3"
                    } ${
                      isActive
                        ? "sidebar-item-active font-bold text-primary bg-primary/10 border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="font-label-sm text-xs uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="border-t border-outline-variant/30 p-2 space-y-1">
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`group flex items-center gap-4 rounded-xl text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high ${
            isCollapsed ? "justify-center p-3" : "px-4 py-3"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-label-sm text-xs uppercase tracking-wider whitespace-nowrap">
              Settings
            </span>
          )}
        </Link>
        <button
          onClick={handleSignOut}
          title={isCollapsed ? "Logout" : undefined}
          className={`group flex w-full items-center gap-4 rounded-xl text-error transition-all duration-200 hover:bg-error-container/20 cursor-pointer ${
            isCollapsed ? "justify-center p-3" : "px-4 py-3"
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-label-sm text-xs uppercase tracking-wider whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
