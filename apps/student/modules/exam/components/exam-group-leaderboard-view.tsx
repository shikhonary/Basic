"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Users,
  Search,
  X,
  BookOpen,
  CheckCircle2,
  XCircle,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Input } from "@workspace/ui/components/input"

interface ExamGroupLeaderboardViewProps {
  groupId: string
}

const SORT_OPTIONS = [
  { value: "rank_asc", label: "মেধা ক্রম" },
  { value: "score_desc", label: "সর্বোচ্চ নম্বর" },
  { value: "name_asc", label: "নাম (অ-ক্রম)" },
] as const

type SortOption = "rank_asc" | "score_desc" | "name_asc"

const CALC_TYPE_LABELS: Record<string, string> = {
  SUM: "যোগফল",
  AVERAGE: "গড়",
  WEIGHTED_AVERAGE: "ভারযুক্ত গড়",
  BEST_OF_N: "সেরা পরীক্ষা",
}

const GROUP_TYPE_LABELS: Record<string, string> = {
  MODEL_TEST: "মডেল টেস্ট",
  TERM_EXAM: "টার্ম পরীক্ষা",
  WEEKLY_SERIES: "সাপ্তাহিক সিরিজ",
  SUBJECT_COMBO: "বিষয় কম্বো",
}

export function ExamGroupLeaderboardView({ groupId }: ExamGroupLeaderboardViewProps) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("rank_asc")
  const [showSearch, setShowSearch] = useState(false)

  const { data, isLoading, isError } = useQuery(
    trpc.examGroup.studentLeaderboard.queryOptions({
      examGroupId: groupId,
      query: search || undefined,
      sort,
      limit: 50,
    }),
  )

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-semibold text-on-surface-variant text-sm">
          মেধা তালিকা লোড হচ্ছে...
        </p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <AlertCircle className="h-12 w-12 text-error mb-3" />
        <h3 className="font-bold text-lg text-on-surface">মেধা তালিকা লোড করা সম্ভব হয়নি</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          তথ্য খুঁজে পাওয়া যায়নি বা কোনো সমস্যা হয়েছে।
        </p>
        <Button asChild className="mt-4 gap-2 rounded-xl">
          <Link href="/leaderboard">
            <ArrowLeft className="h-4 w-4" />
            মেধা তালিকায় ফিরে যান
          </Link>
        </Button>
      </div>
    )
  }

  const { examGroup, leaderboard, totalParticipants, currentUserEntry } = data
  const typeLabel = GROUP_TYPE_LABELS[examGroup.type] ?? examGroup.type
  const calcLabel = CALC_TYPE_LABELS[examGroup.calculationType] ?? examGroup.calculationType

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="gap-2 rounded-xl text-on-surface-variant">
          <Link href="/leaderboard">
            <ArrowLeft className="h-4 w-4" />
            মেধা তালিকায় ফিরে যান
          </Link>
        </Button>
        <Badge
          variant="outline"
          className="rounded-xl border-violet-300 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 px-3 py-1 font-semibold text-xs gap-1.5"
        >
          <Trophy className="h-3.5 w-3.5 text-violet-500" />
          {typeLabel}
        </Badge>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-snug">
                {examGroup.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {examGroup.code && (
                  <span className="text-xs font-mono bg-white/15 px-2 py-0.5 rounded-md text-white/90">
                    {examGroup.code}
                  </span>
                )}
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md text-white/80 flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {calcLabel}
                </span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md text-white/80 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {examGroup.items.length} টি পরীক্ষা
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-md border border-white/20">
              <Users className="h-4 w-4 text-violet-200" />
              <span>মোট অংশগ্রহণকারী: {totalParticipants} জন</span>
            </div>
          </div>

          {/* Current User Quick Rank Card */}
          {currentUserEntry && (
            <div className="mt-2 rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-yellow-950 font-black text-lg shadow-sm">
                  #{currentUserEntry.meritPosition ?? "—"}
                </div>
                <div>
                  <p className="text-xs font-medium text-violet-200">আপনার অবস্থান</p>
                  <p className="text-sm font-extrabold text-white">{currentUserEntry.student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs font-semibold">
                <div>
                  <span className="text-violet-200 text-[11px] block">প্রাপ্ত নম্বর</span>
                  <span className="font-bold text-base">
                    {currentUserEntry.totalObtainedMarks.toFixed(1)}
                    <span className="text-xs font-normal text-violet-200 ml-1">
                      / {currentUserEntry.totalMaxMarks.toFixed(0)}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-violet-200 text-[11px] block">শতকরা</span>
                  <span className="font-bold text-base">{currentUserEntry.percentage.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-violet-200 text-[11px] block">অবস্থা</span>
                  <span className={`font-bold text-sm ${currentUserEntry.status === "PASSED" ? "text-emerald-300" : "text-red-300"}`}>
                    {currentUserEntry.status === "PASSED" ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search & Sort bar */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিক্ষার্থীর নাম লিখুন..."
              className="pl-9 rounded-xl"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4" />
            খুঁজুন
          </Button>
        )}

        {/* Sort dropdown */}
        <div className="flex items-center gap-1 ml-auto">
          <SlidersHorizontal className="h-4 w-4 text-on-surface-variant shrink-0" />
          <div className="flex rounded-xl overflow-hidden border border-outline-variant/40">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sort === opt.value
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 px-1">
          <Trophy className="h-5 w-5 text-violet-500" />
          শীর্ষ মেধা তালিকা ({leaderboard.length})
        </h2>

        {leaderboard.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant p-8 text-center bg-surface-container-lowest">
            <Trophy className="h-10 w-10 text-outline mx-auto mb-3 opacity-40" />
            <p className="text-sm text-on-surface-variant">
              {search ? `"${search}" নামে কেউ খুঁজে পাওয়া যায়নি।` : "এখনো কোনো ফলাফল হিসাব করা হয়নি।"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((item) => {
              const rank = item.meritPosition ?? 0
              const isTop1 = rank === 1
              const isTop2 = rank === 2
              const isTop3 = rank === 3

              return (
                <Card
                  key={item.id}
                  className={`rounded-2xl p-4 transition-all flex flex-wrap items-center justify-between gap-4 ${
                    item.isCurrentUser
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : isTop1
                      ? "border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-950/20"
                      : isTop2
                      ? "border-slate-300 bg-slate-50/50 dark:bg-slate-900/20"
                      : isTop3
                      ? "border-amber-700/30 bg-amber-900/10"
                      : "border-outline-variant/30 bg-surface-container-lowest"
                  }`}
                >
                  {/* Left: Rank + Avatar + Name */}
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    {/* Rank badge */}
                    <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl font-extrabold text-sm shadow-xs">
                      {isTop1 ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-yellow-950 shadow-md">
                          <Trophy className="h-5 w-5 fill-current" />
                        </span>
                      ) : isTop2 ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-300 text-slate-900 shadow-sm">
                          <Medal className="h-5 w-5" />
                        </span>
                      ) : isTop3 ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-amber-50 shadow-sm">
                          <Award className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="text-on-surface-variant font-mono text-base">
                          #{rank}
                        </span>
                      )}
                    </div>

                    <Avatar className="h-10 w-10 border border-outline-variant/40">
                      <AvatarImage src={item.student.image || ""} alt={item.student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {item.student.name ? item.student.name.charAt(0) : "শ"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface truncate">
                          {item.student.name}
                        </span>
                        {item.isCurrentUser && (
                          <Badge className="rounded-md bg-primary text-on-primary text-[10px] py-0 px-1.5 shrink-0">
                            আপনি
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {item.student.roll
                          ? `রোল: ${item.student.roll}`
                          : `আইডি: ${item.student.studentId}`}
                        {item.student.section && ` · সেকশন: ${item.student.section}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: Scores */}
                  <div className="flex items-center gap-4 sm:gap-6 text-xs ml-auto">
                    {/* Obtained / Max */}
                    <div className="text-right">
                      <span className="text-[11px] text-on-surface-variant block font-medium">প্রাপ্ত নম্বর</span>
                      <span className="font-extrabold text-base text-primary">
                        {item.totalObtainedMarks.toFixed(1)}
                        <span className="text-xs font-normal text-on-surface-variant ml-0.5">
                          / {item.totalMaxMarks.toFixed(0)}
                        </span>
                      </span>
                    </div>

                    {/* Percentage */}
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-on-surface-variant block font-medium">শতকরা</span>
                      <span className="font-semibold text-on-surface">{item.percentage.toFixed(1)}%</span>
                    </div>

                    {/* Attempted / Total */}
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-on-surface-variant block font-medium">পরীক্ষা</span>
                      <span className="font-semibold text-on-surface">
                        {item.examsAttempted}/{item.totalExamsInGroup}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="text-right">
                      {item.status === "PASSED" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                      ) : item.status === "FAILED" ? (
                        <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                      ) : null}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
