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
  User,
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
          তথ্য খুঁজে পাওয়া যায়নি বা কোনো সমস্যা হয়েছে।
        </p>
        <Button asChild className="mt-4 gap-2 rounded-xl">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            পরীক্ষার তালিকায় ফিরে যান
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

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="gap-2 rounded-xl text-on-surface-variant">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            পরীক্ষার তালিকায় ফিরে যান
          </Link>
        </Button>
        <Badge variant="outline" className="rounded-xl border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-3 py-1 font-semibold text-xs gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          মেধা তালিকা / লিডারবোর্ড
        </Badge>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight">
                {exam.title}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                পরীক্ষার অফিসিয়াল ফলাফল ও মেধা তালিকা
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-md border border-white/20">
              <Users className="h-4 w-4 text-amber-200" />
              <span>মোট অংশগ্রহণকারী: {totalParticipants} জন</span>
            </div>
          </div>

          {/* Current User Quick Rank Card */}
          {currentUserEntry && (
            <div className="mt-4 rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-black text-lg shadow-sm">
                  #{currentUserEntry.rank}
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-100">আপনার অবস্থান</p>
                  <p className="text-sm font-extrabold text-white">{currentUserEntry.student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div>
                  <span className="text-amber-200 text-[11px] block">প্রাপ্ত নম্বর</span>
                  <span className="font-bold text-base">{currentUserEntry.score} / {exam.total}</span>
                </div>
                <div>
                  <span className="text-amber-200 text-[11px] block">সময় লেগেছে</span>
                  <span>{formatDuration(currentUserEntry.duration)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table / List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 px-1">
          <Trophy className="h-5 w-5 text-amber-500" />
          শীর্ষ মেধা তালিকা ({leaderboard.length})
        </h2>

        {leaderboard.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant p-8 text-center bg-surface-container-lowest">
            <p className="text-sm text-on-surface-variant">এখনো কেউ এই পরীক্ষা জমা দেয়নি।</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((item) => {
              const isTop1 = item.rank === 1
              const isTop2 = item.rank === 2
              const isTop3 = item.rank === 3

              return (
                <Card
                  key={item.id}
                  className={`rounded-2xl p-4 transition-all flex flex-wrap items-center justify-between gap-4 ${
                    item.isCurrentUser
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : isTop1
                      ? "border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20"
                      : isTop2
                      ? "border-slate-300 bg-slate-50/50 dark:bg-slate-900/20"
                      : isTop3
                      ? "border-amber-700/30 bg-amber-900/10"
                      : "border-outline-variant/30 bg-surface-container-lowest"
                  }`}
                >
                  {/* Left: Rank + Avatar + Name */}
                  <div className="flex items-center gap-3.5 min-w-[220px]">
                    <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl font-extrabold text-sm shadow-xs">
                      {isTop1 ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-md">
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
                          #{item.rank}
                        </span>
                      )}
                    </div>

                    <Avatar className="h-10 w-10 border border-outline-variant/40">
                      <AvatarImage src={item.student.image || ""} alt={item.student.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {item.student.name ? item.student.name.charAt(0) : "S"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">
                          {item.student.name}
                        </span>
                        {item.isCurrentUser && (
                          <Badge className="rounded-md bg-primary text-on-primary text-[10px] py-0 px-1.5">
                            আপনি
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant truncate max-w-[200px]">
                        {item.student.roll ? `রোল: ${item.student.roll}` : `আইডি: ${item.student.studentId}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: Scores & Time */}
                  <div className="flex items-center gap-4 sm:gap-6 text-xs ml-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-on-surface-variant block font-medium">প্রাপ্ত নম্বর</span>
                      <span className="font-extrabold text-base text-primary">
                        {item.score} <span className="text-xs font-normal text-on-surface-variant">/ {exam.total}</span>
                      </span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-on-surface-variant block font-medium">সঠিক / ভুল</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.correctAnswers}
                      </span>
                      <span className="text-outline"> / </span>
                      <span className="font-semibold text-error">
                        {item.wrongAnswers}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-on-surface-variant block font-medium">সময়</span>
                      <span className="font-semibold text-on-surface">
                        {formatDuration(item.duration)}
                      </span>
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
