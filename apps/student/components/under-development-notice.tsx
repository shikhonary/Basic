"use client"

import Link from "next/link"
import { Construction, ArrowLeft, BookOpen, Clock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface UnderDevelopmentNoticeProps {
  title?: string
  featureName?: string
  description?: string
}

export function UnderDevelopmentNotice({
  title = "ফিচারটি উন্নয়নাধীন রয়েছে",
  featureName,
  description = "আমরা এই ফিচারটির ওপর কাজ করছি। খুব শীঘ্রই আপনারা এই ফিচারটি সরাসরি ব্যবহার করতে পারবেন।",
}: UnderDevelopmentNoticeProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center">
      <div className="relative flex flex-col items-center justify-center gap-6 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 md:p-12 shadow-xl shadow-primary/5 w-full">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Icon Badge */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Construction className="h-10 w-10 text-primary animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
          </span>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <Clock className="h-3.5 w-3.5 text-amber-500 animate-spin" />
          <span>শীঘ্রই আসছে • Coming Soon</span>
        </div>

        {/* Titles */}
        <div className="space-y-2 max-w-lg">
          {featureName && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {featureName}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline" className="gap-2 rounded-xl border-outline-variant">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              ড্যাশবোর্ডে ফিরে যান
            </Link>
          </Button>

          <Button asChild className="gap-2 rounded-xl shadow-md">
            <Link href="/exams">
              <BookOpen className="h-4 w-4" />
              পরীক্ষাসমূহ দেখুন
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
