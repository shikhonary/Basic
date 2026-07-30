"use client"

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
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Crown,
} from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"

interface ExamLeaderboardViewProps {
  examId: string
}

export function ExamLeaderboardView({ examId }: ExamLeaderboardViewProps) {
  const { data, isLoading, isError } = useQuery(
    trpc.examAttempt.leaderboard.queryOptions({ examId }),
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
          তথ্য খুঁজে পাওয়া যায়নি বা কোনো সমস্যা হয়েছে।
        </p>
        <Button asChild variant="outline" className="gap-2 rounded-xl font-semibold">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            পরীক্ষার তালিকায় ফিরে যান
          </Link>
        </Button>
      </div>
    )
  }

  const { exam, leaderboard, totalParticipants, currentUserEntry } = data

  const formatDuration = (secs: number | null) => {
    if (!secs) return "০ মিনিট"
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins} মি. ${remainingSecs} সে.`
  }

  const top1 = leaderboard.find((item) => item.rank === 1)
  const top2 = leaderboard.find((item) => item.rank === 2)
  const top3 = leaderboard.find((item) => item.rank === 3)

  const remainingLeaderboard = leaderboard.filter((item) => item.rank > 3)

  return (
    <div className="w-full space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 rounded-xl text-on-surface-variant hover:text-on-surface -ml-2 font-medium">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            পরীক্ষার তালিকা
          </Link>
        </Button>
        <Badge
          variant="outline"
          className="rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 font-semibold text-xs gap-1.5"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          মেধা তালিকা
        </Badge>
      </div>

      {/* Header Info Banner */}
      <header className="relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 right-0 p-6 opacity-[0.04] pointer-events-none text-amber-500">
          <Trophy className="w-44 h-44" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                <Sparkles className="h-3 w-3 mr-1" />
                অফিসিয়াল ফলাফল
              </Badge>
            </div>
            <h1 className="font-extrabold text-2xl md:text-3xl text-on-background tracking-tight leading-snug">
              {exam.title}
            </h1>
            <p className="text-sm text-on-surface-variant">
              পরীক্ষার সর্বমোট প্রাপ্ত নম্বর ও মেধা স্থান
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 shrink-0 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">মোট অংশগ্রহণকারী</p>
              <p className="text-base font-extrabold text-on-background">{totalParticipants} জন</p>
            </div>
          </div>
        </div>

        {/* Current User Personal Performance Strip */}
        {currentUserEntry && (
          <div className="relative z-10 mt-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-amber-950 font-black text-base shadow-sm">
                #{currentUserEntry.rank}
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">আপনার মেধা অবস্থান</p>
                <p className="text-base font-extrabold text-on-surface">{currentUserEntry.student.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant block font-medium">প্রাপ্ত নম্বর</span>
                <span className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                  {currentUserEntry.score}
                  <span className="text-xs font-normal text-on-surface-variant ml-0.5">/ {exam.total}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant block font-medium">সময় লেগেছে</span>
                <span className="font-bold text-base text-on-surface">
                  {formatDuration(currentUserEntry.duration)}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 🏆 TOP 3 PODIUM SHOWCASE */}
      {(top1 || top2 || top3) && (
        <section className="pt-4 pb-2">
          <div className="text-center mb-6">
            <h2 className="text-xs font-extrabold tracking-widest text-amber-600 dark:text-amber-400 uppercase inline-flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              সেরা ৩ মেধা অধিকারী
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end max-w-4xl mx-auto">
            {/* 🥈 2nd Place */}
            <div className="order-2 sm:order-1">
              {top2 ? (
                <PodiumCard
                  item={top2}
                  examTotal={exam.total}
                  rank={2}
                  badgeColor="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                  borderColor="border-slate-300 dark:border-slate-700"
                  bgColor="bg-slate-500/10 dark:bg-slate-900/30"
                  scoreBgColor="bg-slate-500/10 border-slate-300/40 text-slate-900 dark:text-slate-100"
                  icon={<Medal className="h-5 w-5 text-slate-500" />}
                  formatDuration={formatDuration}
                />
              ) : <div className="hidden sm:block" />}
            </div>

            {/* 🥇 1st Place */}
            <div className="order-1 sm:order-2">
              {top1 ? (
                <PodiumCard
                  item={top1}
                  examTotal={exam.total}
                  rank={1}
                  isFirst
                  badgeColor="bg-amber-400 text-amber-950 font-black"
                  borderColor="border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/40 shadow-md"
                  bgColor="bg-amber-500/15 dark:bg-amber-950/40"
                  scoreBgColor="bg-amber-500/20 border-amber-400/50 text-amber-950 dark:text-amber-200"
                  icon={<Crown className="h-6 w-6 text-amber-500 animate-bounce" />}
                  formatDuration={formatDuration}
                />
              ) : <div className="hidden sm:block" />}
            </div>

            {/* 🥉 3rd Place */}
            <div className="order-3 sm:order-3">
              {top3 ? (
                <PodiumCard
                  item={top3}
                  examTotal={exam.total}
                  rank={3}
                  badgeColor="bg-amber-700 text-amber-50"
                  borderColor="border-amber-700/40 dark:border-amber-800/50"
                  bgColor="bg-amber-800/10 dark:bg-amber-950/20"
                  scoreBgColor="bg-amber-800/15 border-amber-700/30 text-amber-900 dark:text-amber-200"
                  icon={<Award className="h-5 w-5 text-amber-700" />}
                  formatDuration={formatDuration}
                />
              ) : <div className="hidden sm:block" />}
            </div>
          </div>
        </section>
      )}

      {/* Remaining List (Rank 4+) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            অন্যান্য মেধানুক্রম
          </h3>
          <span className="text-xs font-semibold text-on-surface-variant">
            {remainingLeaderboard.length} জন
          </span>
        </div>

        {remainingLeaderboard.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/60 p-8 text-center bg-surface-container-lowest">
            <p className="text-sm font-medium text-on-surface-variant">কোনো অতিরিক্ত পরীক্ষার্থী নেই।</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {remainingLeaderboard.map((item) => {
              const isCurrentUser = item.isCurrentUser

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
                      #{item.rank < 10 ? `0${item.rank}` : item.rank}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-11 w-11 border border-outline-variant/40 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {item.student.name ? item.student.name.charAt(0) : "S"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Student Info */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm md:text-base text-on-surface truncate">
                          {item.student.name}
                        </span>
                        {isCurrentUser && (
                          <Badge className="rounded-md bg-primary text-on-primary text-[10px] py-0.5 px-2 shrink-0 font-bold">
                            আপনি
                          </Badge>
                        )}
                      </div>

                      {item.student.roll !== undefined && item.student.roll !== null ? (
                        <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/20">
                          রোল: {item.student.roll}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Right: Scores & Details */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                    {/* Obtained Score Badge Container */}
                    <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-2 text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-primary/80 block leading-tight">
                        প্রাপ্ত নম্বর
                      </span>
                      <span className="font-black text-base md:text-lg text-primary leading-none">
                        {item.score}
                        <span className="text-xs font-semibold text-on-surface-variant/70 ml-0.5">
                          / {exam.total}
                        </span>
                      </span>
                    </div>

                    {/* Correct / Wrong Answers */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-[11px] text-on-surface-variant block font-medium">সঠিক / ভুল</span>
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {item.correctAnswers}
                      </span>
                      <span className="text-outline mx-0.5">/</span>
                      <span className="font-bold text-xs text-error">
                        {item.wrongAnswers}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-on-surface-variant block font-medium">সময়</span>
                      <span className="font-semibold text-xs text-on-surface">{formatDuration(item.duration)}</span>
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
   🏆 PODIUM CARD SUB-COMPONENT
───────────────────────────────────────────────────────────── */

interface PodiumCardProps {
  item: {
    id: string
    rank: number
    score: number
    duration: number | null
    student: {
      name: string
      image?: string | null
      roll?: string | number | null
      studentId?: string | number
    }
  }
  examTotal: number
  rank: number
  isFirst?: boolean
  badgeColor: string
  borderColor: string
  bgColor: string
  scoreBgColor: string
  icon: React.ReactNode
  formatDuration: (secs: number | null) => string
}

function PodiumCard({
  item,
  examTotal,
  rank,
  isFirst = false,
  badgeColor,
  borderColor,
  bgColor,
  scoreBgColor,
  icon,
  formatDuration,
}: PodiumCardProps) {
  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border ${borderColor} ${bgColor} p-5 flex flex-col items-center text-center shadow-xs transition-all hover:shadow-md hover:-translate-y-1`}
    >
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

      <div className={`w-full mt-4 p-3 rounded-2xl border ${scoreBgColor} flex flex-col items-center justify-center`}>
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block mb-0.5">
          প্রাপ্ত নম্বর
        </span>
        <div className="text-xl md:text-2xl font-black leading-tight tracking-tight">
          {item.score}
          <span className="text-xs font-semibold opacity-70 ml-1">
            / {examTotal}
          </span>
        </div>
        <div className="text-[11px] font-bold mt-1 opacity-90">
          সময়: {formatDuration(item.duration)}
        </div>
      </div>
    </Card>
  )
}
