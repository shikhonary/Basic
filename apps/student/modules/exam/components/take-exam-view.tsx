"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import "katex/dist/katex.min.css"
import {
  Clock,
  AlertTriangle,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Send,
  Loader2,
  Grid3X3,
  AlertCircle,
  SkipForward,
  Flame,
  Shield,
  FileText,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

// ---------------------------------------------------------------------------
// KaTeX Renderer — standard LaTeX delimiters
// ---------------------------------------------------------------------------

function RenderMath({ text, isMath }: { text: string; isMath?: boolean }) {
  if (!isMath || !text) return <span>{text}</span>

  // We dynamically import InlineMath / BlockMath to avoid SSR issues
  // But for simplicity, we use a regex-based approach with dangerouslySetInnerHTML
  // using katex.renderToString for standard delimiters: $...$ and $$...$$
  const parts = useMemo(() => {
    try {
      const katex = require("katex")
      // Replace $$...$$ (display) first, then $...$ (inline)
      let result = text.replace(
        /\$\$([\s\S]*?)\$\$/g,
        (_: string, expr: string) => {
          try {
            return katex.renderToString(expr.trim(), {
              displayMode: true,
              throwOnError: false,
            })
          } catch {
            return `$$${expr}$$`
          }
        },
      )
      result = result.replace(
        /\$([^$\n]+?)\$/g,
        (_: string, expr: string) => {
          try {
            return katex.renderToString(expr.trim(), {
              displayMode: false,
              throwOnError: false,
            })
          } catch {
            return `$${expr}$`
          }
        },
      )
      return result
    } catch {
      return text
    }
  }, [text])

  return (
    <span
      dangerouslySetInnerHTML={{ __html: parts }}
      className="katex-container"
    />
  )
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAB_SWITCH_LIMIT = 3
const HEARTBEAT_INTERVAL_MS = 60_000
const BENGALI_OPTION_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"]

// Web Audio API feedback sounds (zero external file dependencies)
function playAudioFeedback(isCorrect: boolean) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    if (isCorrect) {
      // High pleasant dual chime: E5 (659Hz) -> A5 (880Hz)
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = "sine"
      osc2.type = "sine"

      osc1.frequency.setValueAtTime(659.25, now)
      osc2.frequency.setValueAtTime(880, now + 0.08)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc1.stop(now + 0.1)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.35)
    } else {
      // Low thud / buzz: 180Hz -> 90Hz triangle wave
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.25)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)
    }
  } catch {
    // Graceful fallback if AudioContext is unsupported or blocked by browser policy
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TakeExamViewProps {
  examId: string
}

export function TakeExamView({ examId }: TakeExamViewProps) {
  const router = useRouter()

  // Refs for scrolling to questions
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const headerRef = useRef<HTMLDivElement>(null)
  const hasStartedCreationRef = useRef(false)

  // Queries & Mutations
  const { data, isLoading, isError, error } = useQuery(
    trpc.examAttempt.getForAttempt.queryOptions({ examId }),
  )

  const createAttemptMutation = useMutation(
    trpc.examAttempt.create.mutationOptions(),
  )
  const submitAnswerMutation = useMutation(
    trpc.examAttempt.submitAnswer.mutationOptions(),
  )
  const submitExamMutation = useMutation(
    trpc.examAttempt.submit.mutationOptions(),
  )
  const trackTabSwitchMutation = useMutation(
    trpc.examAttempt.trackTabSwitch.mutationOptions(),
  )
  const updateActivityMutation = useMutation(
    trpc.examAttempt.updateActivity.mutationOptions(),
  )

  // Local state
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [flaggedMcqs, setFlaggedMcqs] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [totalDuration, setTotalDuration] = useState<number>(0) // total exam duration in seconds
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTabWarningModal, setShowTabWarningModal] = useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)
  const [autoSubmitReason, setAutoSubmitReason] = useState<string>("")
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<string, boolean>>({})

  // Automatic submission handler
  const handleFinalSubmit = useCallback(
    (
      submissionType: "Manual" | "Auto-TimeUp" | "Auto-TabSwitch" = "Manual",
    ) => {
      if (!attemptId || isAutoSubmitting) return

      setIsAutoSubmitting(true)
      if (submissionType !== "Manual") {
        setAutoSubmitReason(
          submissionType === "Auto-TimeUp"
            ? "সময় শেষ! পরীক্ষা জমা দেওয়া হচ্ছে..."
            : "ট্যাব সুইচ সীমা অতিক্রম! পরীক্ষা জমা দেওয়া হচ্ছে...",
        )
      }

      submitExamMutation.mutate(
        { attemptId, submissionType },
        {
          onSuccess: (result) => {
            window.onbeforeunload = null
            router.push(`/exams/${examId}/result/${result.id}`)
          },
          onError: () => {
            setIsAutoSubmitting(false)
            setAutoSubmitReason("")
          },
        },
      )
    },
    [attemptId, examId, isAutoSubmitting],
  )

  // Initialize or resume attempt when data loads
  useEffect(() => {
    if (!data) return

    const { attempt, exam, answerHistory } = data

    // If existing attempt is already submitted, redirect to result page immediately
    if (
      attempt &&
      (attempt.status === "Submitted" || attempt.status === "Auto-Submitted")
    ) {
      window.onbeforeunload = null
      router.push(`/exams/${examId}/result/${attempt.id}`)
      return
    }

    // Restore existing answer history if resuming
    if (answerHistory && answerHistory.length > 0) {
      const answersMap: Record<string, string> = {}
      const correctnessMap: Record<string, boolean> = {}
      answerHistory.forEach((ah: any) => {
        answersMap[ah.mcqId] = ah.selectedOption
        correctnessMap[ah.mcqId] = ah.isCorrect
      })
      setUserAnswers(answersMap)
      setAnswerCorrectness(correctnessMap)
    }

    // Set total duration for timer progress
    const examTotalSeconds = exam.duration * 60
    setTotalDuration(examTotalSeconds)

    // Restore correct/wrong counts from existing attempt
    if (attempt) {
      setCorrectCount(attempt.correctAnswers ?? 0)
      setWrongCount(attempt.wrongAnswers ?? 0)
      setAttemptId(attempt.id)
      setTabSwitches(attempt.tabSwitches ?? 0)

      // Calculate remaining time
      if (attempt.startTime) {
        const elapsedSeconds = Math.floor(
          (Date.now() - new Date(attempt.startTime).getTime()) / 1000,
        )
        const remaining = Math.max(0, examTotalSeconds - elapsedSeconds)
        setTimeLeft(remaining)

        // If time already expired before loading page, auto-submit immediately
        if (remaining <= 0) {
          setTimeout(() => {
            handleFinalSubmit("Auto-TimeUp")
          }, 100)
        }
      } else {
        setTimeLeft(examTotalSeconds)
      }
    } else if (!hasStartedCreationRef.current) {
      hasStartedCreationRef.current = true
      // Auto-start attempt if not created yet
      createAttemptMutation.mutate(
        { examId },
        {
          onSuccess: (newAttempt) => {
            setAttemptId(newAttempt.id)
            setTimeLeft(examTotalSeconds)
          },
        },
      )
    }
  }, [data, examId])

  // Live Timer Effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isAutoSubmitting) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          handleFinalSubmit("Auto-TimeUp")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, isAutoSubmitting, handleFinalSubmit])

  // Anti-Cheat: Tab Switch Visibility Listener
  // TODO: Uncomment for production — commented out for dev mode
  useEffect(() => {
    if (!attemptId) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((prev) => {
          const nextCount = prev + 1
          trackTabSwitchMutation.mutate({ attemptId })

          // Auto-submit after reaching tab switch limit
          if (nextCount >= TAB_SWITCH_LIMIT) {
            setTimeout(() => {
              handleFinalSubmit("Auto-TabSwitch")
            }, 500)
          } else {
            setShowTabWarningModal(true)
          }
          return nextCount
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [attemptId, handleFinalSubmit, trackTabSwitchMutation])

  // beforeunload Warning (disabled during final submission/mutation)
  useEffect(() => {
    if (
      !attemptId ||
      isAutoSubmitting ||
      submitExamMutation.isPending ||
      submitExamMutation.isSuccess
    )
      return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [
    attemptId,
    isAutoSubmitting,
    submitExamMutation.isPending,
    submitExamMutation.isSuccess,
  ])

  // Activity Heartbeat every 60 seconds
  useEffect(() => {
    if (!attemptId || isAutoSubmitting) return

    const interval = setInterval(() => {
      updateActivityMutation.mutate({ attemptId })
    }, HEARTBEAT_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [attemptId, isAutoSubmitting])

  // ─── Loading State ──────────────────────────────────────────────
  if (isLoading || createAttemptMutation.isPending) {
    return (
      <div className="w-full space-y-4 animate-in fade-in duration-300">
        {/* Header skeleton */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-surface-container-high animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-40 rounded-lg bg-surface-container-high animate-pulse" />
                <div className="h-3 w-24 rounded-lg bg-surface-container animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-20 rounded-xl bg-surface-container-high animate-pulse" />
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-container-high animate-pulse" />
        </div>

        {/* Question card skeletons */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-6 w-28 rounded-lg bg-surface-container-high animate-pulse" />
              <div className="h-6 w-10 rounded-lg bg-surface-container-high animate-pulse" />
            </div>
            <div className="h-5 w-4/5 rounded-lg bg-surface-container-high animate-pulse" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="h-12 w-full rounded-xl bg-surface-container animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ─── Error State ──────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <AlertTriangle className="h-12 w-12 text-error mb-3" />
        <h3 className="font-bold text-lg text-on-surface">
          পরীক্ষায় প্রবেশ করা সম্ভব হয়নি
        </h3>
        <p className="text-on-surface-variant text-sm mt-1 max-w-md">
          {error?.message ||
            "এই পরীক্ষাটি এই মুহূর্তে উপলব্ধ নয় অথবা আপনি ইতিমধ্যে এটি সম্পন্ন করেছেন।"}
        </p>
        <Button
          className="mt-4 gap-2 rounded-xl"
          onClick={() => router.push("/exams")}
        >
          <ArrowLeft className="h-4 w-4" />
          পরীক্ষার তালিকায় ফিরে যান
        </Button>
      </div>
    )
  }

  const { exam, questions } = data
  const answeredCount = Object.keys(userAnswers).length
  const totalQuestions = questions.length
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  // Timer progress: percentage of time remaining
  const timerProgressPercent =
    totalDuration > 0 && timeLeft !== null
      ? (timeLeft / totalDuration) * 100
      : 100

  const formatTimer = (seconds: number | null) => {
    if (seconds === null) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isTimeCritical = (timeLeft ?? 0) < 300
  const isTimeVeryLow = (timeLeft ?? 0) < 60
  const tabSwitchesRemaining = TAB_SWITCH_LIMIT - tabSwitches

  const handleSelectOption = (mcqId: string, option: string, questionNumber: number) => {
    if (!attemptId || !!userAnswers[mcqId]) return

    const hadPreviousAnswer = !!userAnswers[mcqId]

    // Update local state immediately
    setUserAnswers((prev) => ({
      ...prev,
      [mcqId]: option,
    }))

    // Save answer via mutation and track correct/wrong
    submitAnswerMutation.mutate(
      {
        attemptId,
        mcqId,
        selectedOption: option,
        questionNumber,
      },
      {
        onSuccess: (result) => {
          setAnswerCorrectness((prev) => ({
            ...prev,
            [mcqId]: result.isCorrect,
          }))

          playAudioFeedback(result.isCorrect)

          if (!hadPreviousAnswer) {
            // First answer — increment the appropriate counter
            if (result.isCorrect) {
              setCorrectCount((prev) => prev + 1)
            } else {
              setWrongCount((prev) => prev + 1)
            }
          }
        },
      },
    )
  }

  const toggleFlag = (mcqId: string) => {
    setFlaggedMcqs((prev) => {
      const next = new Set(prev)
      if (next.has(mcqId)) next.delete(mcqId)
      else next.add(mcqId)
      return next
    })
  }

  const scrollToQuestion = (mcqId: string) => {
    const el = questionRefs.current.get(mcqId)
    if (el) {
      const headerHeight = headerRef.current?.offsetHeight ?? 80
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16
      window.scrollTo({ top, behavior: "smooth" })
    }
    setPaletteOpen(false)
  }

  // ─── Question Palette Content (shared between sheet and sidebar) ──
  const PaletteContent = () => (
    <div className="space-y-4">
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-[11px] text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-primary" />
          <span>উত্তর ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-amber-500" />
          <span>ফ্ল্যাগ ({flaggedMcqs.size})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-surface-container-high border border-outline-variant" />
          <span>বাকি ({totalQuestions - answeredCount})</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-0.5">
        {questions.map((q, idx) => {
          const isAnswered = !!userAnswers[q.id]
          const isFlagged = flaggedMcqs.has(q.id)

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => scrollToQuestion(q.id)}
              className={`flex h-10 w-full items-center justify-center rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95 ${isFlagged
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                : isAnswered
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="rounded-xl bg-surface-container-low p-3 space-y-1.5 text-xs text-on-surface-variant">
        <div className="flex justify-between">
          <span>মোট প্রশ্ন</span>
          <span className="font-bold text-on-surface">{totalQuestions}</span>
        </div>
        <div className="flex justify-between">
          <span>উত্তর দেওয়া হয়েছে</span>
          <span className="font-bold text-emerald-600">{answeredCount}</span>
        </div>
        <div className="flex justify-between">
          <span>বাকি আছে</span>
          <span className="font-bold text-error">
            {totalQuestions - answeredCount}
          </span>
        </div>
        <div className="flex justify-between">
          <span>ফ্ল্যাগড</span>
          <span className="font-bold text-amber-600">{flaggedMcqs.size}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full pb-4 md:pb-8">
      {/* ─── Auto-Submit Overlay ─── */}
      {isAutoSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-white font-bold text-lg text-center px-6">
            {autoSubmitReason || "জমা দেওয়া হচ্ছে, অপেক্ষা করুন..."}
          </p>
        </div>
      )}

      {/* ─── Sticky Header ─── */}
      <div
        ref={headerRef}
        className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs"
      >
        {/* Top row: Back + Title + Submit */}
        <div className="flex items-center justify-between gap-1.5 px-2 py-1 md:px-5 md:py-2.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg shrink-0 h-7 w-7 md:h-8 md:w-8"
              onClick={() => router.push("/exams")}
            >
              <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
            <h2 className="font-bold text-xs sm:text-sm md:text-base text-on-surface line-clamp-1">
              {exam.title}
            </h2>
          </div>

          <Button
            size="sm"
            className="gap-1 rounded-lg bg-primary text-on-primary font-semibold shadow-2xs h-7 text-[11px] sm:h-8 sm:text-xs px-2"
            onClick={() => setShowSubmitModal(true)}
          >
            <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>জমা দিন</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1 px-1.5 pb-1 md:gap-1.5 md:px-5 md:pb-2">
          {/* Total */}
          <div className="flex items-center gap-1 rounded-md bg-surface-container-low px-1.5 py-0.5 md:rounded-lg md:px-2.5 md:py-1.5">
            <FileText className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-on-surface-variant leading-none truncate">মোট</div>
              <div className="font-bold text-xs sm:text-sm text-on-surface leading-tight mt-0.5">{totalQuestions}</div>
            </div>
          </div>

          {/* Answered */}
          <div className="flex items-center gap-1 rounded-md bg-primary/5 px-1.5 py-0.5 md:rounded-lg md:px-2.5 md:py-1.5">
            <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-on-surface-variant leading-none truncate">উত্তর</div>
              <div className="font-bold text-xs sm:text-sm text-primary leading-tight mt-0.5">{answeredCount}</div>
            </div>
          </div>

          {/* Correct */}
          <div className="flex items-center gap-1 rounded-md bg-emerald-500/5 px-1.5 py-0.5 md:rounded-lg md:px-2.5 md:py-1.5">
            <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-on-surface-variant leading-none truncate">সঠিক</div>
              <div className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5">{correctCount}</div>
            </div>
          </div>

          {/* Incorrect */}
          <div className="flex items-center gap-1 rounded-md bg-error/5 px-1.5 py-0.5 md:rounded-lg md:px-2.5 md:py-1.5">
            <XCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-error shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-on-surface-variant leading-none truncate">ভুল</div>
              <div className="font-bold text-xs sm:text-sm text-error leading-tight mt-0.5">{wrongCount}</div>
            </div>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="px-1.5 pb-1 md:px-5 md:pb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`flex items-center gap-1 font-mono font-bold text-[11px] md:text-xs shrink-0 ${isTimeVeryLow
                ? "text-error animate-pulse"
                : isTimeCritical
                  ? "text-error"
                  : "text-primary"
                }`}
            >
              <Clock className="h-3 w-3" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
            <div className="flex-1 h-1.5 md:h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${isTimeVeryLow
                  ? "bg-error animate-pulse"
                  : isTimeCritical
                    ? "bg-error"
                    : timerProgressPercent > 50
                      ? "bg-primary"
                      : timerProgressPercent > 25
                        ? "bg-amber-500"
                        : "bg-error"
                  }`}
                style={{ width: `${Math.max(0, timerProgressPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Switch Mobile Warning Banner ─── */}
      {tabSwitches > 0 && (
        <div className="sm:hidden mx-3 mt-3 flex items-center gap-2 rounded-xl bg-error/10 border border-error/20 px-3 py-2 text-xs font-semibold text-error">
          <Shield className="h-4 w-4 shrink-0" />
          <span>
            ট্যাব সুইচ: {tabSwitches}/{TAB_SWITCH_LIMIT} —{" "}
            {tabSwitchesRemaining > 0
              ? `আরও ${tabSwitchesRemaining} বার সুযোগ আছে`
              : "সীমা অতিক্রম!"}
          </span>
        </div>
      )}

      {/* ─── Main Content Grid ─── */}
      <div className="mt-1.5 md:mt-4 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-2 md:gap-4 px-0 md:px-5">
        {/* ─── Questions List (all visible) ─── */}
        <div className="space-y-2 md:space-y-4">
          {questions.map((mcq, idx) => {
            const questionNumber = idx + 1
            const isAnswered = !!userAnswers[mcq.id]
            const isFlagged = flaggedMcqs.has(mcq.id)
            const selectedOption = userAnswers[mcq.id]
            const isCorrect = answerCorrectness[mcq.id]

            return (
              <div
                key={mcq.id}
                ref={(el) => {
                  if (el) questionRefs.current.set(mcq.id, el)
                }}
                id={`q-${mcq.id}`}
              >
                <Card
                  className={`rounded-xl md:rounded-2xl border p-2 md:p-5 shadow-2xs space-y-1 md:space-y-2.5 transition-all ${isFlagged
                    ? "border-amber-400/50 bg-amber-50/30 dark:bg-amber-950/10"
                    : isAnswered
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : "border-error bg-error/5"
                      : "border-outline-variant/40 bg-surface-container-lowest"
                    }`}
                >
                  {/* Question Header Row */}
                  <div className="flex items-center justify-between gap-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`rounded-md font-bold text-[11px] md:text-xs px-1.5 py-0.5 ${isAnswered
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-surface-container-high text-on-surface-variant"
                          }`}
                      >
                        প্রশ্ন {questionNumber}
                      </Badge>
                      {mcq.subject && (
                        <span className="text-[11px] text-outline font-medium">
                          {mcq.subject.nameBn || mcq.subject.name}
                        </span>
                      )}
                      {mcq.chapter && (
                        <span className="text-[11px] text-outline/60 truncate max-w-[140px] sm:max-w-none">
                          • {mcq.chapter.nameBn || mcq.chapter.name}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlag(mcq.id)}
                      className={`flex items-center justify-center h-6.5 w-6.5 md:h-8 md:w-8 rounded-md md:rounded-lg transition-all active:scale-90 ${isFlagged
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-amber-100 dark:hover:bg-amber-900/30"
                        }`}
                      aria-label={
                        isFlagged ? "ফ্ল্যাগ সরান" : "ফ্ল্যাগ করুন"
                      }
                    >
                      <Flag className="h-3 w-3 md:h-3.5 md:w-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Context block */}
                  {mcq.context && (
                    <div className="rounded-lg md:rounded-xl bg-surface-container-low border-l-3 border-primary/40 p-2 md:p-3 text-xs sm:text-sm text-on-surface-variant leading-snug md:leading-relaxed">
                      <RenderMath text={mcq.context} isMath={mcq.isMath} />
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="font-semibold text-sm sm:text-base text-on-surface leading-snug md:leading-relaxed">
                    <RenderMath text={mcq.question} isMath={mcq.isMath} />
                  </div>

                  {/* Statements (combined MCQ) */}
                  {mcq.statements && mcq.statements.length > 0 && (
                    <div className="space-y-0.5 md:space-y-1 rounded-lg md:rounded-xl bg-surface-container-low/60 p-2 md:p-3 text-xs sm:text-sm text-on-surface-variant">
                      {mcq.statements.map(
                        (stmt: string, stmtIdx: number) => (
                          <div
                            key={stmtIdx}
                            className="flex items-start gap-1 md:gap-2"
                          >
                            <span className="font-bold text-primary text-xs mt-0.5">
                              ({stmtIdx + 1})
                            </span>
                            <span className="leading-snug md:leading-relaxed">
                              <RenderMath text={stmt} isMath={mcq.isMath} />
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-1 md:gap-1.5">
                    {mcq.options.map(
                      (option: string, optIdx: number) => {
                        const optionLabel =
                          BENGALI_OPTION_LABELS[optIdx] ??
                          String.fromCharCode(65 + optIdx)
                        const isSelected = selectedOption === option

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={!!selectedOption}
                            onClick={() =>
                              handleSelectOption(
                                mcq.id,
                                option,
                                questionNumber,
                              )
                            }
                            className={`group flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl min-h-[32px] md:min-h-[44px] px-2 py-1 md:px-3 md:py-2 text-left transition-all duration-150 border active:scale-[0.98] ${isSelected
                              ? isCorrect
                                ? "border-emerald-500 bg-emerald-500/10 text-on-surface shadow-2xs font-medium cursor-not-allowed"
                                : "border-error bg-error/10 text-on-surface shadow-2xs font-medium cursor-not-allowed"
                              : selectedOption
                                ? "border-outline-variant/20 bg-surface-container-low/50 text-on-surface-variant/60 cursor-not-allowed opacity-60"
                                : "border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest cursor-pointer"
                              }`}
                          >
                            <div
                              className={`flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-md md:rounded-lg font-bold text-xs transition-colors ${isSelected
                                ? isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-error text-white"
                                : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary/15 group-hover:text-primary"
                                }`}
                            >
                              {optionLabel}
                            </div>
                            <span className="flex-1 text-xs sm:text-sm leading-snug">
                              <RenderMath
                                text={option}
                                isMath={mcq.isMath}
                              />
                            </span>
                            {isSelected && (
                              <CheckCircle2 className={`h-3.5 w-3.5 md:h-4.5 md:w-4.5 shrink-0 ${isCorrect ? "text-emerald-600" : "text-error"}`} />
                            )}
                          </button>
                        )
                      },
                    )}
                  </div>
                </Card>
              </div>
            )
          })}

          {/* End of Questions — Submit CTA */}
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="text-sm text-on-surface-variant text-center">
              {answeredCount < totalQuestions ? (
                <>
                  আপনি মোট {totalQuestions} টি প্রশ্নের মধ্যে{" "}
                  <strong className="text-on-surface">{answeredCount}</strong>{" "}
                  টির উত্তর দিয়েছেন। বাকি{" "}
                  <strong className="text-error">
                    {totalQuestions - answeredCount}
                  </strong>{" "}
                  টি প্রশ্নের উত্তর দিন অথবা জমা দিন।
                </>
              ) : (
                <>
                  🎉 সব প্রশ্নের উত্তর দেওয়া হয়ে গেছে! এখন জমা দিন।
                </>
              )}
            </p>
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-primary text-on-primary font-bold shadow-md px-8"
              onClick={() => setShowSubmitModal(true)}
            >
              <Send className="h-4 w-4" />
              পরীক্ষা জমা দিন
            </Button>
          </div>
        </div>

        {/* ─── Question Palette Sidebar (Desktop md+) ─── */}
        <div className="hidden md:block">
          <div className="sticky top-[72px] space-y-4">
            <Card className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-primary" />
                প্রশ্ন প্যালেট
              </h3>
              <PaletteContent />
            </Card>

            {/* Timer box on sidebar */}
            <Card
              className={`rounded-2xl border p-4 text-center space-y-1 ${isTimeCritical
                ? "border-error/30 bg-error/5"
                : "border-outline-variant/40 bg-surface-container-lowest"
                }`}
            >
              <div className="text-xs font-medium text-on-surface-variant">
                সময় বাকি
              </div>
              <div
                className={`font-mono font-extrabold text-2xl ${isTimeVeryLow
                  ? "text-error animate-pulse"
                  : isTimeCritical
                    ? "text-error"
                    : "text-primary"
                  }`}
              >
                {formatTimer(timeLeft)}
              </div>
              {isTimeCritical && (
                <div className="flex items-center justify-center gap-1 text-[11px] text-error font-semibold">
                  <Flame className="h-3 w-3" />
                  {isTimeVeryLow
                    ? "শেষ মুহূর্ত!"
                    : "সময় প্রায় শেষ!"}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* ─── Floating Palette Button (Mobile only) ─── */}
      <div className="md:hidden fixed bottom-[65px] right-4 z-30">
        <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-12 w-12 rounded-2xl bg-primary text-on-primary shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95"
            >
              <div className="relative">
                <Grid3X3 className="h-5 w-5" />
                {totalQuestions - answeredCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                    {totalQuestions - answeredCount}
                  </span>
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="rounded-t-3xl max-h-[75vh] overflow-y-auto"
          >
            <SheetHeader className="p-5 pb-3">
              <SheetTitle className="text-base font-bold normal-case tracking-normal text-on-surface flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-primary" />
                প্রশ্ন প্যালেট
              </SheetTitle>
            </SheetHeader>
            <div className="px-5 pb-8">
              <PaletteContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ─── Tab Switch Warning Modal ─── */}
      <Dialog open={showTabWarningModal} onOpenChange={setShowTabWarningModal}>
        <DialogContent className="rounded-3xl max-w-md mx-3 border-error/30">
          <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="font-bold text-xl text-error">
              ট্যাব পরিবর্তন সনাক্ত করা হয়েছে!
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant text-sm mt-1">
              পরীক্ষা চলাকালীন অন্য ট্যাবে বা অ্যাপে যাওয়া অনুচিত।
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl bg-error/5 border border-error/20 p-4 text-center space-y-1 my-1">
            <div className="text-xs font-semibold text-error">
              ট্যাব সুইচ: {tabSwitches}/{TAB_SWITCH_LIMIT}
            </div>
            <p className="text-xs text-on-surface-variant">
              {tabSwitchesRemaining > 0
                ? `আপনার আর মাত্র ${tabSwitchesRemaining} টি সুযোগ বাকি আছে। এরপর পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।`
                : "সীমা অতিক্রম হয়েছে! পরীক্ষা জমা দেওয়া হচ্ছে..."}
            </p>
          </div>

          <DialogFooter className="mt-2">
            <Button
              className="w-full rounded-xl bg-error text-white font-semibold hover:bg-error/90"
              onClick={() => setShowTabWarningModal(false)}
            >
              আমি বুঝতে পেরেছি
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Submit Confirmation Dialog ─── */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="rounded-3xl max-w-md mx-3">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl text-on-surface">
              পরীক্ষা জমা দিতে চান?
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant text-sm">
              জমা দেয়ার পর আপনি আর উত্তর পরিবর্তন করতে পারবেন না।
            </DialogDescription>
          </DialogHeader>

          {/* Summary Stats */}
          <div className="space-y-2.5 my-2">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2.5 border border-emerald-200/40 dark:border-emerald-800/40">
              <span className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                উত্তর দেওয়া
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {answeredCount}
              </span>
            </div>

            {totalQuestions - answeredCount > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-error/5 px-4 py-2.5 border border-error/20">
                <span className="flex items-center gap-2 text-sm text-error">
                  <SkipForward className="h-4 w-4" />
                  বাকি আছে
                </span>
                <span className="font-bold text-error">
                  {totalQuestions - answeredCount}
                </span>
              </div>
            )}

            {flaggedMcqs.size > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 border border-amber-200/40 dark:border-amber-800/40">
                <span className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <Flag className="h-4 w-4" />
                  ফ্ল্যাগড
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {flaggedMcqs.size}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-2.5 border border-primary/20">
              <span className="flex items-center gap-2 text-sm text-primary">
                <Clock className="h-4 w-4" />
                সময় বাকি
              </span>
              <span
                className={`font-bold font-mono ${isTimeCritical ? "text-error" : "text-primary"}`}
              >
                {formatTimer(timeLeft)}
              </span>
            </div>
          </div>

          {/* Warnings */}
          {totalQuestions - answeredCount > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-error/5 border border-error/20 p-3 text-xs text-error">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                আপনি {totalQuestions - answeredCount} টি প্রশ্নের উত্তর
                দেননি। এগুলো অনুত্তরিত হিসেবে গণ্য হবে।
              </span>
            </div>
          )}

          {flaggedMcqs.size > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-400/20 p-3 text-xs text-amber-700 dark:text-amber-400">
              <Flag className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                আপনি {flaggedMcqs.size} টি প্রশ্ন পরে দেখবেন বলে ফ্ল্যাগ
                করেছেন।
              </span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button
              variant="outline"
              className="rounded-xl border-outline-variant"
              onClick={() => setShowSubmitModal(false)}
            >
              ফিরে যান
            </Button>
            <Button
              className="gap-2 rounded-xl bg-primary text-on-primary font-semibold"
              disabled={submitExamMutation.isPending}
              onClick={() => handleFinalSubmit("Manual")}
            >
              {submitExamMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              হ্যাঁ, জমা দিন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
