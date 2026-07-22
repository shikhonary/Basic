"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const mobileNavItems = [
  { href: "/", label: "Home", icon: "dashboard" },
  { href: "/users", label: "Users", icon: "group" },
  { href: "/schedule", label: "Schedule", icon: "calendar_month" },
  { href: "/exams", label: "Exams", icon: "quiz" },
  { href: "/reports", label: "Reports", icon: "analytics" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant/30 bg-surface md:hidden">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary font-bold" : "text-on-surface-variant font-medium"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[10px] uppercase">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
