"use client"

import { authClient } from "@workspace/auth/client"
import Image from "next/image"
import { Search, Bell, HelpCircle } from "lucide-react"

export function TopNav() {
  const { data: session } = authClient.useSession()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/95 backdrop-blur-md px-4 sm:px-6 md:px-12 shadow-xs">
      {/* Left: Product Identity / Mobile Brand Logo & Search */}
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {/* Mobile View: Brand Logo & Name */}
        <div className="flex items-center gap-2.5 md:hidden">
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
        </div>

        {/* Desktop View: Portal Title */}
        <h1 className="hidden md:block font-extrabold text-headline-md font-headline-md text-primary whitespace-nowrap text-xl">
          Student Portal
        </h1>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant/40 rounded px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="text-outline h-4 w-4" />
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md w-full ml-3 placeholder:text-outline/60 text-on-surface text-sm"
            placeholder="Search questions, exams, or subjects..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-on-surface-variant" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error"></span>
        </button>
        <div className="mx-1 sm:mx-2 h-8 w-px bg-outline-variant/30"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-bold text-sm text-on-surface">
              {session?.user?.name || "Student User"}
            </span>
            <span className="text-[10px] text-outline uppercase tracking-widest">
              Basic Student
            </span>
          </div>
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant/40 bg-secondary-container text-on-secondary-container font-semibold text-xs sm:text-sm">
            {session?.user?.image ? (
              <Image
                src="/logo.jpg"
                alt={session.user.name || "User Avatar"}
                className="h-full w-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <span>{(session?.user?.name?.[0] || "S").toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
