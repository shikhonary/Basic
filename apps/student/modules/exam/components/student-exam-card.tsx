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
  onRequireVerification?: () => void
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

export function StudentExamCard({ exam, onRequireVerification }: StudentExamCardProps) {
  const { studentAttempt } = exam
  const isCompleted =
    studentAttempt?.status === "Submitted" ||
    studentAttempt?.status === "Auto-Submitted"
  const isInProgress = studentAttempt?.status === "In Progress"

  const [nowTime, setNowTime] = useState<number>(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const startMs = new Date(exam.startDate).getTime()
  const endMs = new Date(exam.endDate).getTime()

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

  const remainingMs = endMs - nowTime
  const hoursLeft = remainingMs / (1000 * 60 * 60)
  const isEndingSoon = !isExpired && hoursLeft > 0 && hoursLeft <= 24

  const participantCount = exam._count?.examAttempts ?? 0

  /* ─────────────────────────────────────────────────────────────
     1. LIVE EXAM CARD
  ───────────────────────────────────────────────────────────── */
  if (isLiveExam) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-red-500/40 bg-surface-container-lowest shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]">
        {/* Top accent stripe */}
        <div className="h-1 w-full bg-red-500" />

        <div className="flex flex-col gap-4 p-4 md:p-5">
          {/* Status row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                🔴 লাইভ চলছে
              </span>
              {isEndingSoon && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Flame className="h-3 w-3 text-amber-500" />
                  শেষ হচ্ছে!
                </span>
              )}
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-red-500/30 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-500/10"
            >
              {exam.type}
            </Badge>
          </div>

          {/* Title & Subjects */}
          <div className="space-y-2">
            <h3 className="font-bold text-base leading-snug text-on-surface line-clamp-2 group-hover:text-red-600 transition-colors">
              {exam.title}
            </h3>
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

          {/* Countdown box */}
          <div className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-300">
              <Radio className="h-3.5 w-3.5 text-red-600 animate-pulse" />
              সময় বাকি
            </div>
            <span className="font-mono text-sm font-extrabold text-red-600 dark:text-red-400 tracking-widest">
              {formatCountdown(remainingMs)}
            </span>
          </div>

          {/* Meta grid */}
          <MetaGrid exam={exam} />

          {/* Behaviour badges */}
          <BehaviourBadges exam={exam} />

          {/* Date + participants */}
          <DateRow
            startDate={exam.startDate}
            endDate={exam.endDate}
            formatDate={formatDate}
            participantCount={participantCount}
          />

          {/* Action */}
          <div className="border-t border-outline-variant/30 pt-3">
            {isInProgress ? (
              <Button
                asChild
                size="sm"
                className="w-full gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
              >
                <Link href={`/exams/${exam.id}`}>
                  <RotateCcw className="h-4 w-4" />
                  চলমান পরীক্ষা চালিয়ে যান
                  <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="w-full gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                <Link href={`/exams/${exam.id}`}>
                  <Play className="h-4 w-4 fill-current" />
                  লাইভ পরীক্ষায় অংশ নিন
                  <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────────────────
     2. STANDARD CARD (Completed, Upcoming, Expired, Unpublished)
  ───────────────────────────────────────────────────────────── */

  type StatusCfg = {
    dot: string
    pillClass: string
    label: string
    leftBar: string
  }

  let statusCfg: StatusCfg = {
    dot: "bg-primary",
    pillClass: "bg-primary/10 text-primary border border-primary/20",
    label: "নতুন",
    leftBar: "bg-primary",
  }

  if (isCompleted) {
    statusCfg = {
      dot: "bg-emerald-500",
      pillClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
      label: "সম্পন্ন",
      leftBar: "bg-emerald-500",
    }
  } else if (!isPublished) {
    statusCfg = {
      dot: "bg-outline",
      pillClass: "bg-surface-container text-on-surface-variant border border-outline-variant/40",
      label: "অপ্রকাশিত",
      leftBar: "bg-outline-variant",
    }
  } else if (isNotStarted) {
    statusCfg = {
      dot: "bg-blue-500",
      pillClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20",
      label: "আসন্ন",
      leftBar: "bg-blue-500",
    }
  } else if (isExpired) {
    statusCfg = {
      dot: "bg-outline-variant",
      pillClass: "bg-surface-container text-on-surface-variant/70 border border-outline-variant/30",
      label: "মেয়াদোত্তীর্ণ",
      leftBar: "bg-outline-variant/60",
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm transition-all duration-200 hover:border-outline-variant/70 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]">
      {/* Left color bar */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${statusCfg.leftBar}`} />

      <div className="flex flex-col gap-3.5 pl-5 pr-4 pt-4 pb-4 md:pl-6 md:pr-5 md:pt-5 md:pb-5">
        {/* Status + Type row */}
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusCfg.pillClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
          <Badge
            variant="outline"
            className="shrink-0 border-outline-variant/40 bg-surface-container text-[11px] font-semibold text-on-surface-variant rounded-md"
          >
            {exam.type}
          </Badge>
        </div>

        {/* Class badge */}
        {exam.academicClass && (
          <span className="self-start inline-flex items-center rounded-md bg-surface-container px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
            {exam.academicClass.nameBn}
          </span>
        )}

        {/* Title + Subjects */}
        <div className="space-y-2">
          <h3 className="font-bold text-base leading-snug text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
            {exam.title}
          </h3>
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

        {/* Metadata grid */}
        <MetaGrid exam={exam} />

        {/* Behaviour badges */}
        <BehaviourBadges exam={exam} />

        {/* Score banner (completed) */}
        {isCompleted && studentAttempt && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              অর্জিত নম্বর
            </span>
            <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-200">
              {studentAttempt.score}
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 ml-0.5">
                /{exam.total}
              </span>
            </span>
          </div>
        )}

        {/* Date + participants */}
        <DateRow
          startDate={exam.startDate}
          endDate={exam.endDate}
          formatDate={formatDate}
          participantCount={participantCount}
        />

        {/* Action footer */}
        <div className="border-t border-outline-variant/30 pt-3">
          {isCompleted && studentAttempt ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full gap-1.5 rounded-xl border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:border-emerald-700/40 dark:text-emerald-400 text-xs font-semibold px-2"
              >
                <Link href={`/exams/${exam.id}/result/${studentAttempt.id}`}>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">ফলাফল দেখুন</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full gap-1.5 rounded-xl border-amber-500/30 text-amber-700 hover:bg-amber-500/10 dark:border-amber-700/40 dark:text-amber-400 text-xs font-semibold px-2"
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
              variant="outline"
              className="w-full gap-2 rounded-xl border-outline-variant/40 text-on-surface-variant/50 opacity-70 cursor-not-allowed text-xs"
            >
              <Lock className="h-3.5 w-3.5" />
              পরীক্ষা অপ্রকাশিত
            </Button>
          ) : isNotStarted ? (
            <Button
              disabled
              size="sm"
              variant="outline"
              className="w-full gap-2 rounded-xl border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 cursor-not-allowed text-xs font-semibold"
            >
              <Clock className="h-3.5 w-3.5" />
              শুরু হতে বাকি: {formatCountdown(startMs - nowTime)}
            </Button>
          ) : isExpired ? (
            <Button
              disabled
              size="sm"
              variant="outline"
              className="w-full gap-2 rounded-xl border-outline-variant/40 text-on-surface-variant/50 cursor-not-allowed text-xs"
            >
              <CalendarX className="h-3.5 w-3.5" />
              সময় শেষ হয়ে গেছে
            </Button>
          ) : onRequireVerification ? (
            <Button
              size="sm"
              onClick={onRequireVerification}
              className="w-full gap-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 shadow-xs"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>পরীক্ষা দিন</span>
              <span className="ml-auto font-mono text-[11px] opacity-80">
                {formatCountdown(remainingMs)}
              </span>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="w-full gap-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 shadow-xs"
            >
              <Link href={`/exams/${exam.id}`}>
                <Play className="h-4 w-4 fill-current" />
                পরীক্ষা দিন
                <span className="ml-auto font-mono text-[11px] opacity-80">
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

/* ── Shared Sub-components ── */

function MetaGrid({
  exam,
}: {
  exam: {
    duration: number
    totalMcq: number
    total: number
    hasNegativeMark: boolean
    negativeMark: number
  }
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-surface-container-low border border-outline-variant/20 p-3 text-xs text-on-surface-variant">
      <MetaItem
        icon={<Clock className="h-3.5 w-3.5 text-blue-500" />}
        label="সময়"
        value={`${exam.duration} মি.`}
      />
      <MetaItem
        icon={<HelpCircle className="h-3.5 w-3.5 text-amber-500" />}
        label="প্রশ্ন"
        value={`${exam.totalMcq} টি`}
      />
      <MetaItem
        icon={<Award className="h-3.5 w-3.5 text-purple-500" />}
        label="মোট নম্বর"
        value={String(exam.total)}
      />
      <MetaItem
        icon={
          <AlertCircle
            className={`h-3.5 w-3.5 ${exam.hasNegativeMark ? "text-error" : "text-on-surface-variant/40"}`}
          />
        }
        label="নেগেটিভ"
        value={exam.hasNegativeMark ? `-${exam.negativeMark}` : "নেই"}
      />
    </div>
  )
}

function BehaviourBadges({
  exam,
}: {
  exam: { hasSuffle?: boolean; hasRandom?: boolean }
}) {
  if (!exam.hasSuffle && !exam.hasRandom) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {exam.hasSuffle && (
        <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 px-2 py-0.5 text-[11px] font-semibold">
          <Shuffle className="h-3 w-3 text-violet-500" />
          প্রশ্ন শাফেল
        </span>
      )}
      {exam.hasRandom && (
        <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 px-2 py-0.5 text-[11px] font-semibold">
          <Dices className="h-3 w-3 text-sky-500" />
          র‍্যান্ডম প্রশ্ন
        </span>
      )}
    </div>
  )
}

function DateRow({
  startDate,
  endDate,
  formatDate,
  participantCount,
}: {
  startDate: Date
  endDate: Date
  formatDate: (d: Date) => string
  participantCount: number
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] text-on-surface-variant/70">
      <div className="flex items-center gap-1.5 min-w-0">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/60" />
        <span className="truncate">
          {formatDate(startDate)} – {formatDate(endDate)}
        </span>
      </div>
      {participantCount > 0 && (
        <div className="flex shrink-0 items-center gap-1 text-primary font-semibold">
          <Users className="h-3.5 w-3.5" />
          <span>{participantCount}</span>
        </div>
      )}
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
