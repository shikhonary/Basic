"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Clock,
  HelpCircle,
  Award,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Shuffle,
  Dices,
  Users,
  Lock,
  CalendarX,
  Radio,
  Flame,
  Trophy,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

export interface StudentExamCardProps {
  exam: {
    id: string
    title: string
    total: number
    duration: number
    totalMcq: number
    startDate: Date
    endDate: Date
    type: string
    status?: string
    hasNegativeMark: boolean
    negativeMark: number
    hasSuffle?: boolean
    hasRandom?: boolean
    _count?: { examAttempts: number }
    academicClass?: {
      id: string
      nameEn: string
      nameBn: string
    }
    examSubjects?: Array<{
      subject: {
        id: string
        name: string
        nameBn: string
      }
    }>
    studentAttempt?: {
      id: string
      status: string
      score: number
    } | null
  }
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00"
  const totalSeconds = Math.floor(ms / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function StudentExamCard({ exam }: StudentExamCardProps) {
  const { studentAttempt } = exam
  const isCompleted =
    studentAttempt?.status === "Submitted" ||
    studentAttempt?.status === "Auto-Submitted"
  const isInProgress = studentAttempt?.status === "In Progress"

  // Ticking real-time timestamp
  const [nowTime, setNowTime] = useState<number>(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const startMs = new Date(exam.startDate).getTime()
  const endMs = new Date(exam.endDate).getTime()

  // Dynamic status checks
  const isPublished = !exam.status || exam.status === "Published"
  const isNotStarted = nowTime < startMs
  const isExpired = nowTime > endMs
  const isLiveExam = isPublished && !isCompleted && nowTime >= startMs && nowTime <= endMs

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("bn-BD", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  // Deadline urgency — highlight if ending within 24 h
  const remainingMs = endMs - nowTime
  const hoursLeft = remainingMs / (1000 * 60 * 60)
  const isEndingSoon = !isExpired && hoursLeft > 0 && hoursLeft <= 24

  const participantCount = exam._count?.examAttempts ?? 0

  /* ─────────────────────────────────────────────────────────────
     1. SPECIAL LIVE EXAM RUNNING INDICATOR CARD
     (Rendered when published, not completed, and within date range)
  ───────────────────────────────────────────────────────────── */
  if (isLiveExam) {
    return (
      <div
        className={`
          group relative flex flex-col justify-between overflow-hidden rounded-2xl
          border-2 border-red-500/60 bg-gradient-to-br from-red-500/10 via-surface-container-lowest to-amber-500/10
          shadow-md shadow-red-500/10 transition-all duration-300 active:scale-[0.98]
          hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 hover:-translate-y-0.5
        `}
      >
        {/* Pulsing red top stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 animate-pulse" />

        <div className="flex flex-col gap-3.5 p-4 md:p-5">
          {/* Top Row: LIVE badge + urgency pill + Type badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-sm shadow-red-600/30 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                🔴 লাইভ চলছে
              </span>
              {isEndingSoon && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <Flame className="h-3 w-3 text-amber-500 animate-bounce" />
                  দ্রুত শেষ করুন!
                </span>
              )}
            </div>

            <Badge
              variant="outline"
              className="shrink-0 border-red-500/30 bg-red-500/10 text-[11px] font-bold text-red-600 dark:text-red-400"
            >
              {exam.type}
            </Badge>
          </div>

          {/* Exam Title */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-base md:text-lg leading-snug text-on-surface group-hover:text-red-600 transition-colors line-clamp-2">
              {exam.title}
            </h3>

            {/* Subject Chips */}
            {exam.examSubjects && exam.examSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {exam.examSubjects.map((es) => (
                  <span
                    key={es.subject.id}
                    className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
                  >
                    <BookOpen className="h-3 w-3 text-red-500" />
                    {es.subject.nameBn || es.subject.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Live Monitor Counter Box */}
          <div className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-xs font-semibold">
              <Radio className="h-4 w-4 text-red-600 animate-pulse" />
              <span>সময় বাকি:</span>
            </div>
            <span className="font-mono text-base font-extrabold text-red-600 dark:text-red-400 tracking-wider">
              {formatCountdown(remainingMs)}
            </span>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container-low p-3 text-xs text-on-surface-variant">
            <MetaItem
              icon={<Clock className="h-3.5 w-3.5 text-red-500" />}
              label="সময়"
              value={`${exam.duration} মি.`}
            />
            <MetaItem
              icon={<HelpCircle className="h-3.5 w-3.5 text-red-500" />}
              label="প্রশ্ন"
              value={`${exam.totalMcq} টি`}
            />
            <MetaItem
              icon={<Award className="h-3.5 w-3.5 text-red-500" />}
              label="মোট নম্বর"
              value={String(exam.total)}
            />
            <MetaItem
              icon={
                <AlertCircle
                  className={`h-3.5 w-3.5 ${exam.hasNegativeMark ? "text-error" : "text-outline"}`}
                />
              }
              label="নেগেটিভ"
              value={exam.hasNegativeMark ? `-${exam.negativeMark}` : "নেই"}
            />
          </div>

          {/* Behaviour badges (hasSuffle / hasRandom) */}
          {(exam.hasSuffle || exam.hasRandom) && (
            <div className="flex flex-wrap gap-1.5">
              {exam.hasSuffle && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/30 px-2.5 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50">
                  <Shuffle className="h-3 w-3" />
                  প্রশ্ন শাফেল
                </span>
              )}
              {exam.hasRandom && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/30 px-2.5 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
                  <Dices className="h-3 w-3" />
                  র‍্যান্ডম প্রশ্ন
                </span>
              )}
            </div>
          )}

          {/* Date + participant count */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-outline">
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="truncate">
                {formatDate(exam.startDate)} – {formatDate(exam.endDate)}
              </span>
            </div>
            {participantCount > 0 && (
              <div className="flex shrink-0 items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                <Users className="h-3.5 w-3.5" />
                <span>{participantCount}</span>
              </div>
            )}
          </div>

          {/* Action Button Footer */}
          <div className="border-t border-red-500/20 pt-3">
            {isInProgress ? (
              <Button
                asChild
                size="sm"
                className="w-full gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 animate-pulse"
              >
                <Link href={`/exams/${exam.id}`}>
                  <RotateCcw className="h-4 w-4" />
                  চলমান লাইভ পরীক্ষা শুরু করুন
                  <ChevronRight className="ml-auto h-4 w-4 opacity-75" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white hover:opacity-95 shadow-md shadow-red-600/30"
              >
                <Link href={`/exams/${exam.id}`}>
                  <Play className="h-4 w-4 fill-current animate-pulse" />
                  এখনই লাইভ পরীক্ষায় অংশ নিন
                  <ChevronRight className="ml-auto h-4 w-4 opacity-80" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────────────────
     2. STANDARD EXAM CARD (For Completed, Upcoming, Expired, Unpublished)
  ───────────────────────────────────────────────────────────── */
  let statusConfig = {
    accentClass: "bg-primary",
    pillBg: "bg-primary/8",
    pillText: "text-primary",
    label: "নতুন",
  }

  if (isCompleted) {
    statusConfig = {
      accentClass: "bg-emerald-500",
      pillBg: "bg-emerald-50 dark:bg-emerald-950/30",
      pillText: "text-emerald-700 dark:text-emerald-400",
      label: "সম্পন্ন",
    }
  } else if (!isPublished) {
    statusConfig = {
      accentClass: "bg-slate-400",
      pillBg: "bg-slate-100 dark:bg-slate-900",
      pillText: "text-slate-600 dark:text-slate-400",
      label: "অপ্রকাশিত",
    }
  } else if (isNotStarted) {
    statusConfig = {
      accentClass: "bg-blue-500",
      pillBg: "bg-blue-50 dark:bg-blue-950/30",
      pillText: "text-blue-700 dark:text-blue-400",
      label: "আসন্ন",
    }
  } else if (isExpired) {
    statusConfig = {
      accentClass: "bg-gray-400",
      pillBg: "bg-gray-100 dark:bg-gray-900",
      pillText: "text-gray-500 dark:text-gray-400",
      label: "মেয়াদোত্তীর্ণ",
    }
  }

  return (
    <div
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border border-outline-variant/40
        bg-surface-container-lowest shadow-sm
        transition-all duration-300 active:scale-[0.98]
        hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5
      `}
    >
      {/* Colored accent stripe */}
      <div className={`h-1 w-full ${statusConfig.accentClass}`} />

      <div className="flex flex-col gap-3.5 p-4 md:p-5">
        {/* ── Status + Type row ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status pill */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusConfig.pillBg} ${statusConfig.pillText}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusConfig.accentClass}`}
              />
              {statusConfig.label}
            </span>
          </div>

          {/* Exam type */}
          <Badge
            variant="outline"
            className="shrink-0 rounded-full border-outline-variant/50 bg-surface-container px-2.5 py-0 text-[11px] font-medium text-on-surface-variant"
          >
            {exam.type}
          </Badge>
        </div>

        {/* ── Class badge ── */}
        {exam.academicClass && (
          <Badge
            variant="outline"
            className="self-start border-primary/30 bg-primary-container/20 text-[11px] font-semibold text-primary"
          >
            {exam.academicClass.nameBn}
          </Badge>
        )}

        {/* ── Title ── */}
        <div className="space-y-2">
          <h3 className="font-bold text-base leading-snug text-on-surface transition-colors group-hover:text-primary line-clamp-2">
            {exam.title}
          </h3>

          {/* Subject chips */}
          {exam.examSubjects && exam.examSubjects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {exam.examSubjects.map((es) => (
                <span
                  key={es.subject.id}
                  className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
                >
                  <BookOpen className="h-3 w-3 text-primary" />
                  {es.subject.nameBn || es.subject.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Metadata Grid ── */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container-low p-3 text-xs text-on-surface-variant">
          <MetaItem
            icon={<Clock className="h-3.5 w-3.5 text-primary" />}
            label="সময়"
            value={`${exam.duration} মি.`}
          />
          <MetaItem
            icon={<HelpCircle className="h-3.5 w-3.5 text-primary" />}
            label="প্রশ্ন"
            value={`${exam.totalMcq} টি`}
          />
          <MetaItem
            icon={<Award className="h-3.5 w-3.5 text-primary" />}
            label="মোট নম্বর"
            value={String(exam.total)}
          />
          <MetaItem
            icon={
              <AlertCircle
                className={`h-3.5 w-3.5 ${exam.hasNegativeMark ? "text-error" : "text-outline"}`}
              />
            }
            label="নেগেটিভ"
            value={exam.hasNegativeMark ? `-${exam.negativeMark}` : "নেই"}
          />
        </div>

        {/* ── Exam behaviour badges (hasSuffle / hasRandom) ── */}
        {(exam.hasSuffle || exam.hasRandom) && (
          <div className="flex flex-wrap gap-1.5">
            {exam.hasSuffle && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/30 px-2.5 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50">
                <Shuffle className="h-3 w-3" />
                প্রশ্ন শাফেল
              </span>
            )}
            {exam.hasRandom && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/30 px-2.5 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
                <Dices className="h-3 w-3" />
                র‍্যান্ডম প্রশ্ন
              </span>
            )}
          </div>
        )}

        {/* ── Score banner (completed) ── */}
        {isCompleted && studentAttempt && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 border border-emerald-200/50 dark:border-emerald-800/50">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              অর্জিত নম্বর
            </span>
            <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
              {studentAttempt.score}
              <span className="text-xs font-medium opacity-60">
                /{exam.total}
              </span>
            </span>
          </div>
        )}

        {/* ── Date + participant count ── */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-outline">
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {formatDate(exam.startDate)} – {formatDate(exam.endDate)}
            </span>
          </div>
          {participantCount > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{participantCount}</span>
            </div>
          )}
        </div>

        {/* ── Action Footer ── */}
        <div className="border-t border-outline-variant/30 pt-3">
          {isCompleted && studentAttempt ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full gap-1.5 rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30 text-xs font-semibold px-2"
              >
                <Link href={`/exams/${exam.id}/result/${studentAttempt.id}`}>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">ফলাফল দেখুন</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full gap-1.5 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30 text-xs font-semibold px-2"
              >
                <Link href={`/exams/${exam.id}/leaderboard`}>
                  <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span className="truncate">লিডারবোর্ড</span>
                </Link>
              </Button>
            </div>
          ) : !isPublished ? (
            <Button
              disabled
              size="sm"
              variant="secondary"
              className="w-full gap-2 rounded-xl opacity-70 cursor-not-allowed text-xs font-semibold"
            >
              <Lock className="h-4 w-4" />
              পরীক্ষা অপ্রকাশিত
            </Button>
          ) : isNotStarted ? (
            <Button
              disabled
              size="sm"
              variant="secondary"
              className="w-full gap-2 rounded-xl opacity-80 cursor-not-allowed text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
            >
              <Clock className="h-4 w-4 animate-pulse" />
              শুরু হতে বাকি: {formatCountdown(startMs - nowTime)}
            </Button>
          ) : isExpired ? (
            <Button
              disabled
              size="sm"
              variant="outline"
              className="w-full gap-2 rounded-xl border-outline-variant/60 text-outline cursor-not-allowed text-xs font-semibold"
            >
              <CalendarX className="h-4 w-4" />
              সময় শেষ হয়ে গেছে
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="w-full gap-2 rounded-xl shadow-sm bg-primary text-on-primary hover:bg-primary/90"
            >
              <Link href={`/exams/${exam.id}`}>
                <Play className="h-4 w-4 fill-current" />
                পরীক্ষা দিন
                <span className="ml-auto text-[11px] font-mono opacity-90">
                  {formatCountdown(remainingMs)}
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>
        {label}:{" "}
        <strong className="font-semibold text-on-surface">{value}</strong>
      </span>
    </div>
  )
}
