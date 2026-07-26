"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import "katex/dist/katex.min.css"
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  ArrowLeft,
  BookOpen,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

const BENGALI_OPTION_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"]

function RenderMath({ text, isMath }: { text: string; isMath?: boolean }) {
  if (!isMath || !text) return <span>{text}</span>

  const parts = useMemo(() => {
    try {
      const katex = require("katex")
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

interface ExamResultViewProps {
  attemptId: string
}

export function ExamResultView({ attemptId }: ExamResultViewProps) {
  const { data: attempt, isLoading, isError } = useQuery(
    trpc.examAttempt.result.queryOptions({ attemptId }),
  )

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-semibold text-on-surface-variant text-sm">
          ফলাফল প্রস্তুত করা হচ্ছে...
        </p>
      </div>
    )
  }

  if (isError || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-surface-container-low border border-outline-variant/30">
        <AlertCircle className="h-12 w-12 text-error mb-3" />
        <h3 className="font-bold text-lg text-on-surface">ফলাফল পাওয়া যায়নি</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          অনুরোধকৃত ফলাফলটি খুঁজে পাওয়া যায়নি বা আপনার এটি দেখার অনুমতি নেই।
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

  const exam = attempt.exam
  const totalQuestions = attempt.totalQuestions || 1
  const percentage = Math.round(((attempt.score ?? 0) / (exam.total || 1)) * 100)

  const formatDuration = (secs: number | null) => {
    if (!secs) return "0 মিনিট"
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins} মি. ${remainingSecs} সে.`
  }

  return (
    <div className="w-full space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="gap-2 rounded-xl text-on-surface-variant">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            পরীক্ষার তালিকায় ফিরে যান
          </Link>
        </Button>
        <Badge variant="outline" className="rounded-xl border-primary/30 text-primary px-3 py-1 font-semibold text-xs">
          পরীক্ষার ফলাফল
        </Badge>
      </div>

      {/* Main Score & Metrics Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/40 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
              {exam.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
              <span>জমা দেওয়ার সময়: {new Date(attempt.createdAt).toLocaleString("bn-BD")}</span>
              <span>•</span>
              <span>টাইপ: {attempt.submissionType || "Manual"}</span>
            </div>
          </div>

          {/* Big Score Pill */}
          <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/40 shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <div className="text-xs font-semibold text-outline uppercase tracking-wider">
                প্রাপ্ত নম্বর
              </div>
              <div className="font-extrabold text-2xl text-on-surface">
                {attempt.score} <span className="text-sm font-medium text-outline">/ {exam.total}</span>
              </div>
            </div>
            <div className="ml-2 rounded-xl bg-primary/10 px-3 py-1 font-extrabold text-sm text-primary">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-on-surface">{attempt.correctAnswers}</div>
              <div className="text-xs text-outline font-medium">সঠিক উত্তর</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-on-surface">{attempt.wrongAnswers}</div>
              <div className="text-xs text-outline font-medium">ভুল উত্তর</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-on-surface">{attempt.skippedQuestions}</div>
              <div className="text-xs text-outline font-medium">অনুত্তরিত</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-base text-on-surface">{formatDuration(attempt.duration)}</div>
              <div className="text-xs text-outline font-medium">মোট সময়</div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer History & Explanation Section */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-xl text-on-surface flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          প্রশ্ন ও উত্তর বিবরণী ({attempt.answerHistory?.length ?? 0} টি উত্তর পাওয়া গেছে)
        </h2>

        <div className="space-y-4">
          {attempt.answerHistory && attempt.answerHistory.length > 0 ? (
            attempt.answerHistory.map((ah) => {
              const { mcq } = ah
              const options = mcq.options ?? []

              return (
                <Card
                  key={ah.id}
                  className={`rounded-3xl border p-5 md:p-6 space-y-4 shadow-xs transition-all ${ah.isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                    : "border-error/30 bg-error/5 dark:bg-error-950/10"
                    }`}
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`rounded-lg font-bold text-xs ${ah.isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-error text-on-error"
                          }`}
                      >
                        প্রশ্ন {ah.questionNumber}
                      </Badge>
                      {mcq.subject && (
                        <span className="text-xs text-outline font-medium">
                          {mcq.subject.nameBn || mcq.subject.name}
                        </span>
                      )}
                      {mcq.chapter && (
                        <span className="text-xs text-outline/60">
                          • {mcq.chapter.nameBn || mcq.chapter.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {ah.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-4 w-4" /> সঠিক
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-error">
                          <X className="h-4 w-4" /> ভুল
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Context if available */}
                  {mcq.context && (
                    <div className="rounded-xl bg-surface-container-low border-l-4 border-primary/40 p-3 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      <RenderMath text={mcq.context} isMath={mcq.isMath} />
                    </div>
                  )}

                  {/* Question Title */}
                  <div className="font-semibold text-base md:text-lg text-on-surface leading-snug md:leading-relaxed">
                    <RenderMath text={mcq.question} isMath={mcq.isMath} />
                  </div>

                  {/* Statements if available */}
                  {mcq.statements && mcq.statements.length > 0 && (
                    <div className="space-y-1 rounded-xl bg-surface-container-low/60 p-3 text-xs md:text-sm text-on-surface-variant">
                      {mcq.statements.map((stmt: string, stmtIdx: number) => (
                        <div key={stmtIdx} className="flex items-start gap-2">
                          <span className="font-bold text-primary text-xs mt-0.5">
                            ({stmtIdx + 1})
                          </span>
                          <span className="leading-relaxed">
                            <RenderMath text={stmt} isMath={mcq.isMath} />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All Options List */}
                  <div className="grid grid-cols-1 gap-2 text-sm pt-1">
                    {options.map((option: string, optIdx: number) => {
                      const optionLabel =
                        BENGALI_OPTION_LABELS[optIdx] ??
                        String.fromCharCode(65 + optIdx)

                      const isStudentSelection = ah.selectedOption === option
                      const isCorrectAnswer =
                        ah.correctAnswer === option || mcq.answer === option

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center justify-between gap-3 rounded-xl p-3 border transition-all ${isStudentSelection && isCorrectAnswer
                            ? "border-emerald-500 bg-emerald-500/15 text-on-surface font-medium"
                            : isCorrectAnswer
                              ? "border-emerald-500/80 bg-emerald-500/10 text-on-surface font-medium"
                              : isStudentSelection
                                ? "border-error bg-error/10 text-on-surface font-medium"
                                : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant/80"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${isCorrectAnswer
                                ? "bg-emerald-600 text-white"
                                : isStudentSelection
                                  ? "bg-error text-white"
                                  : "bg-surface-container-high text-on-surface-variant"
                                }`}
                            >
                              {optionLabel}
                            </div>
                            <span className="text-xs md:text-sm leading-snug">
                              <RenderMath text={option} isMath={mcq.isMath} />
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {isStudentSelection && isCorrectAnswer && (
                              <Badge className="bg-emerald-600 text-white gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <CheckCircle2 className="h-3 w-3" />
                                সঠিক
                              </Badge>
                            )}
                            {isCorrectAnswer && !isStudentSelection && (
                              <Badge className="bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <Check className="h-3 w-3" />
                                সঠিক উত্তর
                              </Badge>
                            )}
                            {isStudentSelection && !isCorrectAnswer && (
                              <Badge className="bg-error text-white gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <XCircle className="h-3 w-3" />
                                ভুল
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation if available */}
                  {mcq.explanation && (
                    <div className="rounded-2xl bg-surface-container-low p-4 text-xs text-on-surface-variant space-y-1 mt-2">
                      <span className="font-bold text-primary block">ব্যাখ্যা:</span>
                      <div className="leading-relaxed">
                        <RenderMath text={mcq.explanation} isMath={mcq.isMath} />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          ) : (
            <Card className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant text-sm">
              এই পরীক্ষায় কোনো প্রশ্নের উত্তর দেওয়া হয়নি।
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
