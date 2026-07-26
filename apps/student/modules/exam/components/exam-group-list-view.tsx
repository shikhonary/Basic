"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import {
  Trophy,
  BookOpen,
  Calendar,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Users,
  ClipboardList,
  Sparkles,
} from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

const GROUP_TYPE_LABELS: Record<string, string> = {
  MODEL_TEST: "মডেল টেস্ট",
  TERM_EXAM: "টার্ম পরীক্ষা",
  WEEKLY_SERIES: "সাপ্তাহিক সিরিজ",
  SUBJECT_COMBO: "বিষয় কম্বো",
}

const GROUP_TYPE_COLORS: Record<string, string> = {
  MODEL_TEST: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  TERM_EXAM: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  WEEKLY_SERIES: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  SUBJECT_COMBO: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
}

const GROUP_TYPE_STRIPE: Record<string, string> = {
  MODEL_TEST: "bg-violet-500",
  TERM_EXAM: "bg-blue-500",
  WEEKLY_SERIES: "bg-emerald-500",
  SUBJECT_COMBO: "bg-amber-500",
}

const GROUP_TYPE_ICON_COLOR: Record<string, string> = {
  MODEL_TEST: "text-violet-500",
  TERM_EXAM: "text-blue-500",
  WEEKLY_SERIES: "text-emerald-500",
  SUBJECT_COMBO: "text-amber-500",
}

function formatDate(date: Date | string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function GroupCardSkeleton() {
  return (
    <Card className="rounded-2xl p-5 border-outline-variant/30 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </Card>
  )
}

export function ExamGroupListView() {
  const { data, isLoading, isError } = useQuery(
    trpc.examGroup.studentGroups.queryOptions({}),
  )

  if (isLoading) {
    return (
      <div className="w-full space-y-6 pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-xl" />
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <GroupCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/40">
        <AlertCircle className="h-10 w-10 text-error mb-3" />
        <h3 className="font-bold text-base text-on-surface">লিডারবোর্ড লোড হয়নি</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          তথ্য খুঁজে পাওয়া যায়নি বা কোনো সমস্যা হয়েছে।
        </p>
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Info Banner */}
      <header className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 right-0 p-6 opacity-[0.06] pointer-events-none text-violet-500">
          <Trophy className="w-36 h-36" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 dark:text-violet-300 text-[11px] font-semibold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  মেধা পোর্টাল
                </Badge>
              </div>
              <h1 className="font-extrabold text-xl md:text-2xl text-on-background leading-snug">
                পরীক্ষা গ্রুপ লিডারবোর্ড
              </h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                তোমার ক্লাসের সকল প্রকাশিত পরীক্ষা গ্রুপ ও মেধা তালিকা
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 shrink-0">
            <ClipboardList className="h-5 w-5 text-violet-500 shrink-0" />
            <div>
              <p className="text-xs text-on-surface-variant font-medium">মোট গ্রুপ</p>
              <p className="text-sm font-bold text-on-background">{items.length} টি গ্রুপ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Group list */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/60 p-12 text-center bg-surface-container-lowest">
          <Trophy className="h-12 w-12 text-on-surface-variant/30 mb-3" />
          <h3 className="font-bold text-base text-on-surface">কোনো প্রকাশিত পরীক্ষা গ্রুপ নেই</h3>
          <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
            তোমার ক্লাসে এখনো কোনো পরীক্ষা গ্রুপ প্রকাশ করা হয়নি।
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((group) => {
            const typeLabel = GROUP_TYPE_LABELS[group.type] ?? group.type
            const typeColor = GROUP_TYPE_COLORS[group.type] ?? "border-outline-variant/40 bg-surface-container text-on-surface-variant"
            const typeStripe = GROUP_TYPE_STRIPE[group.type] ?? "bg-outline-variant/30"
            const iconColor = GROUP_TYPE_ICON_COLOR[group.type] ?? "text-primary"
            const myResult = group.myResult

            return (
              <Card
                key={group.id}
                className="rounded-2xl border-outline-variant/40 bg-surface-container-lowest overflow-hidden transition-all hover:shadow-md hover:border-outline-variant/70"
              >
                {/* Flat type-color top stripe */}
                <div className={`h-1 w-full ${typeStripe}`} />

                <div className="p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-base text-on-surface leading-snug line-clamp-2">
                        {group.title}
                      </h2>
                      {group.code && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          কোড: <span className="font-mono font-semibold text-on-surface">{group.code}</span>
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold shrink-0 ${typeColor}`}
                    >
                      {typeLabel}
                    </Badge>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className={`h-3.5 w-3.5 ${iconColor}`} />
                      <span><strong className="text-on-surface">{group._count.items}</strong> টি পরীক্ষা</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className={`h-3.5 w-3.5 ${iconColor}`} />
                      <span><strong className="text-on-surface">{group._count.groupResults}</strong> জন অংশগ্রহণকারী</span>
                    </div>
                    {group.startDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-on-surface-variant/70" />
                        <span>{formatDate(group.startDate)}</span>
                        {group.endDate && <span>— {formatDate(group.endDate)}</span>}
                      </div>
                    )}
                  </div>

                  {/* Student's own result preview */}
                  {myResult ? (
                    <div className="flex items-center justify-between rounded-xl bg-surface-container-low border border-outline-variant/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-sm">
                          {myResult.meritPosition ? `#${myResult.meritPosition}` : "—"}
                        </div>
                        <div>
                          <p className="text-[11px] text-on-surface-variant font-medium">তোমার অবস্থান</p>
                          <p className="text-sm font-bold text-on-surface">
                            {myResult.percentage.toFixed(1)}%
                            <span className="ml-1.5 text-xs font-normal text-on-surface-variant">
                              ({myResult.totalObtainedMarks.toFixed(1)} / {myResult.totalMaxMarks.toFixed(0)})
                            </span>
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`rounded-md text-[11px] font-semibold px-2.5 py-1 ${
                          myResult.status === "PASSED"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                        variant="outline"
                      >
                        {myResult.status === "PASSED" ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-surface-container px-4 py-3 border border-outline-variant/20">
                      <BarChart3 className="h-4 w-4 text-on-surface-variant" />
                      <p className="text-xs text-on-surface-variant font-medium">
                        তোমার ফলাফল এখনো হিসাব করা হয়নি
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full rounded-xl gap-2 font-semibold shadow-xs"
                    variant={myResult ? "default" : "outline"}
                  >
                    <Link href={`/leaderboard/${group.id}`}>
                      <Trophy className="h-4 w-4" />
                      মেধা তালিকা দেখুন
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
