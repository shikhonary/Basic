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
  MODEL_TEST: "border-violet-300 bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
  TERM_EXAM: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  WEEKLY_SERIES: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  SUBJECT_COMBO: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
}

function formatDate(date: Date | string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getStatusColor(status: string | undefined) {
  if (status === "PASSED") return "text-emerald-600 dark:text-emerald-400"
  if (status === "FAILED") return "text-red-500 dark:text-red-400"
  return "text-on-surface-variant"
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 shadow-xl">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-white/20 rounded-xl" />
            <Skeleton className="h-4 w-64 bg-white/20 rounded-xl" />
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
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <AlertCircle className="h-12 w-12 text-error mb-3" />
        <h3 className="font-bold text-lg text-on-surface">লিডারবোর্ড লোড হয়নি</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          তথ্য খুঁজে পাওয়া যায়নি বা কোনো সমস্যা হয়েছে।
        </p>
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-4 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-300" />
              <span className="text-sm font-bold text-white/80 uppercase tracking-wider">মেধা তালিকা</span>
            </div>
            <h1 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              পরীক্ষা গ্রুপ লিডারবোর্ড
            </h1>
            <p className="mt-1 text-sm text-white/75">
              তোমার ক্লাসের সকল প্রকাশিত পরীক্ষা গ্রুপ ও মেধা তালিকা
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur-md border border-white/20">
            <ClipboardList className="h-4 w-4 text-violet-200" />
            <span>{items.length} টি গ্রুপ</span>
          </div>
        </div>
      </div>

      {/* Group list */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant p-12 text-center bg-surface-container-lowest">
          <Trophy className="h-14 w-14 text-outline mb-4 opacity-40" />
          <h3 className="font-bold text-base text-on-surface">কোনো প্রকাশিত পরীক্ষা গ্রুপ নেই</h3>
          <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
            তোমার ক্লাসে এখনো কোনো পরীক্ষা গ্রুপ প্রকাশ করা হয়নি।
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((group) => {
            const typeLabel = GROUP_TYPE_LABELS[group.type] ?? group.type
            const typeColor = GROUP_TYPE_COLORS[group.type] ?? "border-outline-variant bg-surface-container text-on-surface-variant"
            const myResult = group.myResult

            return (
              <Card
                key={group.id}
                className="rounded-2xl border-outline-variant/30 bg-surface-container-lowest overflow-hidden transition-all hover:shadow-md hover:border-outline-variant/60"
              >
                {/* Top accent bar based on type */}
                <div
                  className={`h-1 w-full ${
                    group.type === "MODEL_TEST" ? "bg-gradient-to-r from-violet-500 to-purple-500" :
                    group.type === "TERM_EXAM" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                    group.type === "WEEKLY_SERIES" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                    "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}
                />

                <div className="p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-base text-on-surface leading-snug line-clamp-2">
                        {group.title}
                      </h2>
                      {group.code && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          কোড: <span className="font-mono font-semibold">{group.code}</span>
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${typeColor}`}
                    >
                      {typeLabel}
                    </Badge>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span><strong className="text-on-surface">{group._count.items}</strong> টি পরীক্ষা</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span><strong className="text-on-surface">{group._count.groupResults}</strong> জন অংশগ্রহণকারী</span>
                    </div>
                    {group.startDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(group.startDate)}</span>
                        {group.endDate && <span>— {formatDate(group.endDate)}</span>}
                      </div>
                    )}
                  </div>

                  {/* Student's own result preview */}
                  {myResult ? (
                    <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-sm">
                          {myResult.meritPosition ? `#${myResult.meritPosition}` : "—"}
                        </div>
                        <div>
                          <p className="text-[11px] text-on-surface-variant font-medium">তোমার অবস্থান</p>
                          <p className={`text-sm font-bold ${getStatusColor(myResult.status)}`}>
                            {myResult.percentage.toFixed(1)}%
                            <span className="ml-1.5 text-xs font-normal text-on-surface-variant">
                              ({myResult.totalObtainedMarks.toFixed(1)} / {myResult.totalMaxMarks.toFixed(0)})
                            </span>
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`rounded-lg text-[11px] font-semibold px-2.5 py-1 ${
                          myResult.status === "PASSED"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300"
                        }`}
                        variant="outline"
                      >
                        {myResult.status === "PASSED" ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-surface-container px-4 py-3 border border-outline-variant/20">
                      <BarChart3 className="h-4 w-4 text-on-surface-variant" />
                      <p className="text-xs text-on-surface-variant">
                        তোমার ফলাফল এখনো হিসাব করা হয়নি
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full rounded-xl gap-2 font-semibold"
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
