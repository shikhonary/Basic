"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@workspace/auth/client"
import { useCurrentUser } from "@/modules/user/services/use-user"
import { useStudentProfile } from "@/modules/profile/services/use-profile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  Search,
  Bell,
  User,
  GraduationCap,
  Trophy,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
  BadgeCheck,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react"

export function TopNav() {
  const router = useRouter()
  const { session, user, isVerified } = useCurrentUser()
  const { data: studentProfile } = useStudentProfile()

  const displayName = studentProfile?.nameBn || studentProfile?.name || user?.name || "শিক্ষার্থী"
  const studentId = studentProfile?.studentId ? `#${studentProfile.studentId}` : ""
  const className = studentProfile?.academicClass?.nameBn || "স্টুডেন্ট পোর্টাল"
  const userImage = studentProfile?.imageUrl || user?.image || ""

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Sign out failed:", error)
      router.push("/auth/sign-in")
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/95 backdrop-blur-md px-4 sm:px-6 md:px-12 shadow-xs">
      {/* Left: Product Identity / Mobile Brand Logo & Search */}
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {/* Mobile View: Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 md:hidden">
          <Image
            src="/logo.jpg"
            alt="Basic Education Care"
            width={34}
            height={34}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base font-headline-md text-on-surface leading-none tracking-tight">
              Basic
            </span>
            <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mt-0.5">
              Education Care
            </span>
          </div>
        </Link>

        {/* Desktop View: Portal Title */}
        <Link href="/" className="hidden md:block">
          <h1 className="font-extrabold text-headline-md font-headline-md text-primary whitespace-nowrap text-xl hover:opacity-90 transition-opacity">
            Student Portal
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant/40 rounded px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="text-outline h-4 w-4 shrink-0" />
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md w-full ml-3 placeholder:text-outline/60 text-on-surface text-sm"
            placeholder="পরীক্ষা, বিষয় বা প্রশ্ন খুঁজুন..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant"
          title="নোটিফিকেশন"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error animate-pulse"></span>
        </button>

        <div className="mx-1 sm:mx-2 h-8 w-px bg-outline-variant/30"></div>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full p-1 pl-1.5 sm:pr-2.5 hover:bg-surface-container-low transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {/* User Avatar with online badge */}
              <div className="relative">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-outline-variant/50 shadow-xs">
                  <AvatarImage src={userImage} alt={displayName} className="object-cover" />
                  <AvatarFallback className="bg-primary text-white font-bold text-xs sm:text-sm">
                    {initials || "S"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
              </div>

              {/* User Name & Class Label (Desktop) */}
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="font-bold text-sm text-on-surface leading-tight truncate max-w-[140px]">
                  {displayName}
                </span>
                <span className="text-[11px] text-on-surface-variant/80 font-medium truncate max-w-[140px]">
                  {className} {studentId}
                </span>
              </div>

              <ChevronDown className="h-4 w-4 text-on-surface-variant/70 shrink-0 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 p-2 bg-surface text-on-surface border-outline-variant/60 rounded-2xl shadow-xl space-y-1"
          >
            {/* Header info inside dropdown */}
            <div className="p-3 bg-surface-container-low rounded-xl space-y-2 mb-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 rounded-xl border border-outline-variant/40 shrink-0">
                  <AvatarImage src={userImage} alt={displayName} />
                  <AvatarFallback className="bg-primary text-white font-bold text-sm">
                    {initials || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-on-surface truncate">
                    {displayName}
                  </h4>
                  <p className="text-xs text-on-surface-variant truncate">
                    {user?.email && !user.email.endsWith("@phone.bec.local")
                      ? user.email
                      : user?.phoneNumber || "শিক্ষার্থী"}
                  </p>
                </div>
              </div>

              {/* Class & Verification Badges */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/30">
                <span className="text-xs font-semibold text-primary">
                  {className}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ভেরিফাইড
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    আনভেরিফাইড
                  </span>
                )}
              </div>
            </div>

            <DropdownMenuSeparator className="bg-outline-variant/30" />

            {/* Navigation Options */}
            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>ড্যাশবোর্ড</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <User className="h-4 w-4 text-sky-600" />
                  <span>আমার প্রোফাইল</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/exams" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  <span>পরীক্ষাসমূহ</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/leaderboard" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <Trophy className="h-4 w-4 text-purple-600" />
                  <span>লিডারবোর্ড</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/question-bank" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  <span>প্রশ্ন ব্যাংক</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium">
                  <Settings className="h-4 w-4 text-on-surface-variant" />
                  <span>সেটিংস</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-outline-variant/30" />

            {/* Logout Action */}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30 flex items-center gap-2.5 px-3 py-2 text-sm font-bold"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span>লগআউট (Sign Out)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
