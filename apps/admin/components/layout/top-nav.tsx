"use client"

import { authClient } from "@workspace/auth/client"

export function TopNav() {
  const { data: session } = authClient.useSession()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/95 backdrop-blur-md px-6 md:px-12 shadow-xs">
      {/* Left: Product Identity & Search */}
      <div className="flex items-center gap-8 flex-1">
        <h1 className="font-extrabold text-headline-md font-headline-md text-primary whitespace-nowrap">
          BEC Portal
        </h1>
        <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant/40 rounded px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md w-full ml-3 placeholder:text-outline/60 text-on-surface"
            placeholder="Search for students, batches, or reports..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error"></span>
        </button>
        <button
          className="p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
          title="Help & Support"
        >
          <span className="material-symbols-outlined text-on-surface-variant">help</span>
        </button>
        
        <div className="mx-2 h-8 w-px bg-outline-variant/30"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-bold text-label-sm font-label-sm text-on-surface">
              {session?.user?.name || "Admin Office"}
            </span>
            <span className="text-[10px] text-outline uppercase tracking-widest">
              Main Campus
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant/40 bg-secondary-container text-on-secondary-container font-semibold">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{(session?.user?.name?.[0] || "A").toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
