"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { authClient } from "@workspace/auth/client"
import { StudentExamCard } from "@/modules/exam/components/student-exam-card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Radio,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
} from "lucide-react"
import { useCurrentUser } from "@/modules/user/services/use-user"

export default function DashboardPage() {
  const router = useRouter()
  const { session } = useCurrentUser()
  // Ticking real-time timestamp for exam status calculation
  const [nowTime, setNowTime] = useState<number>(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch student available exams
  const { data: examData, isLoading: isLoadingExams } = useQuery(
    trpc.examAttempt.availableExams.queryOptions({})
  )

  const items = examData?.items ?? []

  // Categorize exams by real-time status
  const { liveExams, upcomingExams, completedExams } = useMemo(() => {
    const live: typeof items = []
    const upcoming: typeof items = []
    const completed: typeof items = []

    for (const exam of items) {
      const startMs = new Date(exam.startDate).getTime()
      const endMs = new Date(exam.endDate).getTime()
      const isPublished = !exam.status || exam.status === "Published"
      const isCompleted =
        exam.studentAttempt?.status === "Submitted" ||
        exam.studentAttempt?.status === "Auto-Submitted"

      if (isCompleted) {
        completed.push(exam)
      }
      if (isPublished && nowTime >= startMs && nowTime <= endMs) {
        live.push(exam)
      } else if (isPublished && nowTime < startMs) {
        upcoming.push(exam)
      }
    }

    // Sort upcoming exams by earliest start date
    upcoming.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )

    return {
      liveExams: live,
      upcomingExams: upcoming,
      completedExams: completed,
    }
  }, [items, nowTime])

  const studentName = session?.user?.name || "শিক্ষার্থী"

  // Time-of-day greeting generator
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "শুভ সকাল"
    if (hour >= 12 && hour < 17) return "শুভ দুপুর"
    if (hour >= 17 && hour < 21) return "শুভ সন্ধ্যা"
    return "শুভ রাত্রি"
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4 px-2 sm:px-4">
      {/* ─────────────────────────────────────────────────────────────
         1. WELCOME HERO BANNER AT THE TOP
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 p-6 md:p-8 text-white shadow-xl shadow-primary/15">
        {/* Decorative background glow & shapes */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 max-w-2xl">
            {/* Top Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                {greeting}
              </span>
              {liveExams.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white shadow-md shadow-red-600/30 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  🔴 {liveExams.length} টি পরীক্ষা লাইভ চলছে!
                </span>
              )}
            </div>

            {/* Student Welcome Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                স্বাগতম, <span className="text-amber-300">{studentName}</span>! 👋
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/85 leading-relaxed">
                আজকের পড়াশোনা ও পরীক্ষার প্রস্তুতি কেমন চলছে? আপনার নির্ধারিত লাইভ ও আসন্ন পরীক্ষাগুলো নিচে দেখুন।
              </p>
            </div>

            {/* Stat Counters */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold border border-white/15 backdrop-blur-sm">
                <Radio className="h-3.5 w-3.5 text-red-300 animate-pulse" />
                লাইভ: <strong className="font-mono text-amber-300">{liveExams.length}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold border border-white/15 backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5 text-sky-300" />
                আসন্ন: <strong className="font-mono">{upcomingExams.length}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold border border-white/15 backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                সম্পন্ন: <strong className="font-mono">{completedExams.length}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex shrink-0 items-center">
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-2xl bg-white !text-primary hover:bg-amber-50 font-bold px-6 shadow-lg shadow-black/10 active:scale-95 transition-all"
            >
              <Link href="/exams" className="flex items-center gap-2 !text-primary">
                <span className="!text-primary font-bold">সকল পরীক্ষা দেখুন</span>
                <ArrowRight className="h-4 w-4 !text-primary" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         2. LIVE EXAMS & UPCOMING EXAMS SECTION
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1 pt-2">
          <div className="flex items-center gap-2">
            {liveExams.length > 0 ? (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            ) : (
              <Calendar className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
              {liveExams.length > 0 ? "লাইভ পরীক্ষা চলছে" : "আসন্ন ও চলমান পরীক্ষা"}
            </h2>
          </div>

          <Link
            href="/exams"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>সব দেখুন ({items.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Exam Cards Grid */}
        {isLoadingExams ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border border-outline-variant/30 p-5 bg-surface-container-lowest"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : liveExams.length > 0 ? (
          /* Live Exams take priority */
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liveExams.map((exam) => (
                <StudentExamCard key={exam.id} exam={exam} />
              ))}
            </div>

            {upcomingExams.length > 0 && (
              <div className="pt-4 space-y-3">
                <h3 className="text-base font-bold text-on-surface-variant flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  পরবর্তী আসন্ন পরীক্ষা ({upcomingExams.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingExams.slice(0, 3).map((exam) => (
                    <StudentExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : upcomingExams.length > 0 ? (
          /* No Live Exam currently, but Upcoming Exams exist */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingExams.map((exam) => (
              <StudentExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : items.length > 0 ? (
          /* Render available/completed exams */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((exam) => (
              <StudentExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          /* Empty state if no live or upcoming exam */
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-outline-variant/50 bg-surface-container-lowest p-8 md:p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-bold text-lg text-on-surface">এই মুহূর্তে কোনো নতুন পরীক্ষা নেই</h3>
              <p className="text-sm text-on-surface-variant">
                বর্তমানে আপনার জন্য নির্ধারিত কোনো লাইভ বা আসন্ন পরীক্ষা নেই। সকল পরীক্ষা ও ফলাফল দেখতে পরীক্ষা পেজ ভিজিট করুন।
              </p>
            </div>
            <Button asChild size="sm" className="gap-2 rounded-xl">
              <Link href="/exams">
                <BookOpen className="h-4 w-4" />
                পরীক্ষাসমূহ দেখুন
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

