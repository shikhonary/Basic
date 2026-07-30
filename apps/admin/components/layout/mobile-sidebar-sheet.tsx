"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@workspace/auth/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import {
  Menu,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Layers,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
} from "lucide-react"

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
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

export function MobileSidebarSheet() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    setOpen(false)
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden rounded-lg text-on-surface-variant hover:bg-surface-container-high cursor-pointer h-9 w-9 shrink-0"
          title="Open Sidebar Navigation"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 sm:w-80 p-0 flex flex-col bg-surface-container-low border-r border-outline-variant/30 text-on-surface">
        <SheetHeader className="sr-only">
          <SheetTitle>Admin Navigation Menu</SheetTitle>
          <SheetDescription>Mobile sidebar navigation drawer</SheetDescription>
        </SheetHeader>

        {/* Brand Header */}
        <div className="flex items-center gap-3 p-4 border-b border-outline-variant/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h2 className="font-extrabold text-base font-headline-md text-on-surface leading-none tracking-tight">
              Basic
            </h2>
            <span className="mt-1 font-label-sm text-[10px] text-outline uppercase tracking-wider">
              Education Care Admin
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <div className="font-label-sm text-[10px] text-outline/70 font-bold uppercase tracking-widest px-3 my-1">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-outline-variant/30 p-3 space-y-1 bg-surface-container-low">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-error hover:bg-error-container/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
