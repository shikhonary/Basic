"use client"

import { useState, useMemo } from "react"
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
  Sparkles,
  Crown,
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

  const { data, isLoading, isError } = useQuery(
    trpc.examGroup.studentLeaderboard.queryOptions({
      examGroupId: groupId,
      query: search || undefined,
      sort,
      limit: 100,
    }),
  )

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
        <p className="text-sm font-semibold text-on-surface-variant">মেধা তালিকা লোড হচ্ছে...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
        <AlertCircle className="h-10 w-10 text-error mb-3" />
        <h3 className="font-bold text-lg text-on-surface">মেধা তালিকা লোড করা সম্ভব হয়নি</h3>
        <p className="text-on-surface-variant text-sm mt-1 mb-5 max-w-sm">
          তথ্য খুঁজে পাওয়া যায়নি অথবা আপনি এই পরীক্ষার অন্তর্ভুক্ত নন।
        </p>
        <Button asChild variant="outline" className="gap-2 rounded-xl font-semibold">
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

  // Separate Top 3 for Podium display (only when sorting by rank_asc and no search query)
  const isDefaultView = !search && sort === "rank_asc"
  const top1 = isDefaultView ? leaderboard.find((item) => item.meritPosition === 1) : null
  const top2 = isDefaultView ? leaderboard.find((item) => item.meritPosition === 2) : null
  const top3 = isDefaultView ? leaderboard.find((item) => item.meritPosition === 3) : null

  // Remaining list items (rank 4+ or all items if searched/sorted differently)
  const remainingLeaderboard = isDefaultView
    ? leaderboard.filter((item) => (item.meritPosition ?? 0) > 3)
    : leaderboard

  return (
    <div className="w-full space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Back Button & Header Pills */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 rounded-xl text-on-surface-variant hover:text-on-surface -ml-2 font-medium">
          <Link href="/leaderboard">
            <ArrowLeft className="h-4 w-4" />
            সকল মেধা তালিকা
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-lg border-primary/20 bg-primary/10 text-primary px-3 py-1 font-semibold text-xs gap-1.5"
          >
            <Trophy className="h-3.5 w-3.5" />
            {typeLabel}
          </Badge>
        </div>
      </div>

      {/* Header Info Banner */}
      <header className="relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8 shadow-xs">
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.04] pointer-events-none text-primary">
          <Trophy className="w-44 h-44" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-primary/20">
                <Sparkles className="h-3 w-3" />
                অফিসিয়াল মেধা তালিকা
              </span>
              {examGroup.code && (
                <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-mono font-semibold text-on-surface-variant border border-outline-variant/30">
                  {examGroup.code}
                </span>
              )}
            </div>

            <h1 className="font-extrabold text-2xl md:text-3xl text-on-background tracking-tight leading-snug">
              {examGroup.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant pt-1">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-primary" />
                গণনা পদ্ধতি: <strong className="text-on-surface">{calcLabel}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                মোট পরীক্ষা: <strong className="text-on-surface">{examGroup.items.length} টি</strong>
              </span>
            </div>
          </div>

          {/* Stat Pill */}
          <div className="flex items-center gap-3.5 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 shrink-0 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">মোট পরীক্ষার্থী</p>
              <p className="text-base font-extrabold text-on-background">{totalParticipants} জন</p>
            </div>
          </div>
        </div>

        {/* Current User Personal Performance Strip */}
        {currentUserEntry && (
          <div className="relative z-10 mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-black text-base shadow-sm">
                #{currentUserEntry.meritPosition ?? "—"}
              </div>
              <div>
                <p className="text-xs font-semibold text-primary">আপনার বর্তমান অবস্থান</p>
                <p className="text-base font-extrabold text-on-surface">{currentUserEntry.student.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant block font-medium">প্রাপ্ত নম্বর</span>
                <span className="font-extrabold text-lg text-primary">
                  {(currentUserEntry.totalObtainedMarks ?? 0).toFixed(1)}
                  <span className="text-xs font-normal text-on-surface-variant ml-0.5">
                    / {(currentUserEntry.totalMaxMarks ?? 0).toFixed(0)}
                  </span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant block font-medium">শতকরা হার</span>
                <span className="font-extrabold text-base text-on-surface">
                  {(currentUserEntry.percentage ?? 0).toFixed(1)}%
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant block font-medium">ফলাফল</span>
                <span className={`font-bold text-sm ${currentUserEntry.status === "PASSED" ? "text-emerald-600 dark:text-emerald-400" : "text-error"}`}>
                  {currentUserEntry.status === "PASSED" ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 🏆 TOP 3 PODIUM SHOWCASE */}
      {isDefaultView && (top1 || top2 || top3) && (
        <section className="pt-4 pb-2">
          <div className="text-center mb-6">
            <h2 className="text-xs font-extrabold tracking-widest text-primary uppercase inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Crown className="h-3.5 w-3.5" />
              সেরা ৩ মেধা অধিকারী
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end max-w-4xl mx-auto">
            {/* 🥈 2nd Place (Left) */}
            <div className="order-2 sm:order-1">
              {top2 ? (
                <PodiumCard
                  item={top2}
                  rank={2}
                  badgeColor="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                  borderColor="border-slate-300 dark:border-slate-700"
                  bgColor="bg-slate-500/10 dark:bg-slate-900/30"
                  scoreBgColor="bg-slate-500/10 border-slate-300/40 text-slate-900 dark:text-slate-100"
                  icon={<Medal className="h-5 w-5 text-slate-500" />}
                />
              ) : <div className="hidden sm:block" />}
            </div>

            {/* 🥇 1st Place (Center - Main Champion) */}
            <div className="order-1 sm:order-2">
              {top1 ? (
                <PodiumCard
                  item={top1}
                  rank={1}
                  isFirst
                  badgeColor="bg-amber-400 text-amber-950 font-black"
                  borderColor="border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/40 shadow-md"
                  bgColor="bg-amber-500/15 dark:bg-amber-950/40"
                  scoreBgColor="bg-amber-500/20 border-amber-400/50 text-amber-950 dark:text-amber-200"
                  icon={<Crown className="h-6 w-6 text-amber-500 animate-bounce" />}
                />
              ) : <div className="hidden sm:block" />}
            </div>

            {/* 🥉 3rd Place (Right) */}
            <div className="order-3 sm:order-3">
              {top3 ? (
                <PodiumCard
                  item={top3}
                  rank={3}
                  badgeColor="bg-amber-700 text-amber-50"
                  borderColor="border-amber-700/40 dark:border-amber-800/50"
                  bgColor="bg-amber-800/10 dark:bg-amber-950/20"
                  scoreBgColor="bg-amber-800/15 border-amber-700/30 text-amber-900 dark:text-amber-200"
                  icon={<Award className="h-5 w-5 text-amber-700" />}
                />
              ) : <div className="hidden sm:block" />}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Filter & Search Control Bar */}
      <div className="sticky top-16 z-30 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/40 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="শিক্ষার্থীর নাম দিয়ে খুঁজুন..."
            className="pl-9 pr-8 h-10 rounded-xl bg-surface-container-low/60 border-outline-variant/30 text-sm focus-visible:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-on-surface-variant shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            ক্রমবিন্যাস:
          </span>
          <div className="flex rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low p-0.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sort === opt.value
                    ? "bg-primary text-white shadow-2xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List (Rank 4+ or all when searched/sorted) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            {isDefaultView ? "অন্যান্য মেধানুক্রম" : "মেধা তালিকা"}
          </h3>
          <span className="text-xs font-semibold text-on-surface-variant">
            {remainingLeaderboard.length} জন দেখানো হচ্ছে
          </span>
        </div>

        {remainingLeaderboard.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/60 p-10 text-center bg-surface-container-lowest">
            <Trophy className="h-10 w-10 text-on-surface-variant/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-on-surface-variant">
              {search ? `"${search}" নামে কোনো পরীক্ষার্থী পাওয়া যায়নি।` : "এখনো কোনো অতিরিক্ত ফলাফল নেই।"}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {remainingLeaderboard.map((item) => {
              const rank = item.meritPosition ?? 0
              const isCurrentUser = item.isCurrentUser
              const obtained = item.totalObtainedMarks ?? 0
              const max = item.totalMaxMarks ?? 0
              const pct = item.percentage ?? 0
              const isPassed = item.status === "PASSED"

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrentUser
                      ? "border-primary/50 bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                      : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline-variant/80 hover:shadow-xs"
                  }`}
                >
                  {/* Left rank accent line */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${
                      isCurrentUser
                        ? "bg-primary"
                        : "bg-surface-container-high group-hover:bg-primary/50"
                    }`}
                  />

                  {/* Left: Rank Badge + Avatar + Student Details */}
                  <div className="flex items-center gap-4 min-w-0 pl-1.5">
                    {/* Rank Pill */}
                    <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/30 font-mono text-sm font-bold text-on-surface">
                      #{rank < 10 ? `0${rank}` : rank}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-11 w-11 border border-outline-variant/40 shrink-0">
                      <AvatarImage src={item.student.image || ""} alt={item.student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {item.student.name ? item.student.name.charAt(0) : "শ"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Student Info */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm md:text-base text-on-surface truncate">
                          {item.student.name}
                        </span>
                        {isCurrentUser && (
                          <Badge className="rounded-md bg-primary text-white text-[10px] py-0.5 px-2 shrink-0 font-bold">
                            আপনি
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                        {item.student.roll && (
                          <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/20">
                            রোল: {item.student.roll}
                          </span>
                        )}
                        {!item.student.roll && item.student.studentId && (
                          <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-mono text-on-surface-variant border border-outline-variant/20">
                            ID: {item.student.studentId}
                          </span>
                        )}
                        {item.student.section && (
                          <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] text-on-surface-variant border border-outline-variant/20">
                            সেকশন: {item.student.section}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores, Percentage & Pass/Fail Status */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                    {/* Obtained Score Badge Container */}
                    <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-2 text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-primary/80 block leading-tight">
                        প্রাপ্ত নম্বর
                      </span>
                      <span className="font-black text-base md:text-lg text-primary leading-none">
                        {obtained.toFixed(1)}
                        <span className="text-xs font-semibold text-on-surface-variant/70 ml-0.5">
                          / {max.toFixed(0)}
                        </span>
                      </span>
                    </div>

                    {/* Percentage */}
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-on-surface-variant block font-medium">শতকরা</span>
                      <span className="font-extrabold text-sm text-on-surface">{pct.toFixed(1)}%</span>
                    </div>

                    {/* Exams Attempted Count */}
                    <div className="text-right shrink-0 hidden md:block">
                      <span className="text-[11px] text-on-surface-variant block font-medium">পরীক্ষা</span>
                      <span className="font-semibold text-xs text-on-surface">
                        {item.examsAttempted}/{item.totalExamsInGroup}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold gap-1 ${
                          isPassed
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-error/10 text-error border-error/30"
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            উত্তীর্ণ
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-error" />
                            অনুত্তীর্ণ
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   🏆 PODIUM CARD SUB-COMPONENT (Top 1, 2, 3 Visual Showcase)
───────────────────────────────────────────────────────────── */

interface PodiumCardProps {
  item: {
    id: string
    meritPosition: number | null
    totalObtainedMarks?: number | null
    totalMaxMarks?: number | null
    percentage?: number | null
    student: {
      name: string
      image?: string | null
      roll?: string | number | null
      studentId?: string | number
    }
  }
  rank: number
  isFirst?: boolean
  badgeColor: string
  borderColor: string
  bgColor: string
  scoreBgColor: string
  icon: React.ReactNode
}

function PodiumCard({
  item,
  rank,
  isFirst = false,
  badgeColor,
  borderColor,
  bgColor,
  scoreBgColor,
  icon,
}: PodiumCardProps) {
  const obtained = item.totalObtainedMarks ?? 0
  const max = item.totalMaxMarks ?? 0
  const pct = item.percentage ?? 0

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border ${borderColor} ${bgColor} p-5 flex flex-col items-center text-center shadow-xs transition-all hover:shadow-md hover:-translate-y-1`}
    >
      {/* Top Rank Badge Icon */}
      <div className="flex flex-col items-center gap-2 pt-1 w-full">
        <div className="relative">
          <Avatar className={`h-16 w-16 ${isFirst ? "h-20 w-20 ring-4 ring-amber-400" : "ring-2 ring-outline-variant/40"} shadow-sm`}>
            <AvatarImage src={item.student.image || ""} alt={item.student.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {item.student.name ? item.student.name.charAt(0) : "S"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            {icon}
          </div>
        </div>

        <div className="space-y-1 mt-2 w-full">
          <span className={`inline-block px-3.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase ${badgeColor}`}>
            #{rank} স্থান
          </span>
          <h3 className="font-extrabold text-sm md:text-base text-on-surface line-clamp-1 max-w-[200px] mx-auto">
            {item.student.name}
          </h3>
          <p className="text-[11px] font-medium text-on-surface-variant">
            {item.student.roll ? `রোল: ${item.student.roll}` : `আইডি: ${item.student.studentId}`}
          </p>
        </div>
      </div>

      {/* High-Visibility Score Box */}
      <div className={`w-full mt-4 p-3 rounded-2xl border ${scoreBgColor} flex flex-col items-center justify-center`}>
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block mb-0.5">
          প্রাপ্ত নম্বর
        </span>
        <div className="text-xl md:text-2xl font-black leading-tight tracking-tight">
          {obtained.toFixed(1)}
          <span className="text-xs font-semibold opacity-70 ml-1">
            / {max.toFixed(0)}
          </span>
        </div>
        <div className="text-[11px] font-bold mt-1 opacity-90">
          শতকরা: {pct.toFixed(1)}%
        </div>
      </div>
    </Card>
  )
}
