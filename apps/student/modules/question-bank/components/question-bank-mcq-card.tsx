"use client"

import React, { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { RenderMath } from "@workspace/ui/components/render-math"
import "katex/dist/katex.min.css"

export interface QuestionBankMcqItem {
  id: string
  question: string
  answer: string
  options: string[]
  statements?: string[] | null
  type?: string
  isMath?: boolean
  reference?: string[] | string | null
  explanation?: string | null
  context?: string | null
  contextUrl?: string | null
  chapter?: {
    id: string
    name: string
    nameBn?: string
    position?: number
  } | null
  subject?: {
    id: string
    name: string
    nameBn?: string
    level?: string
    group?: string | null
  } | null
}

interface QuestionBankMcqCardProps {
  item: QuestionBankMcqItem
  index: number
}

function toBengaliNumerals(numStr: string | number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
}

const optionPrefixesBn = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"]
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"]
const MCQ_TYPE_LABELS_BN: Record<string, string> = {
  SINGLE: "জ্ঞানমূলক",
  MULTIPLE: "বহুপদী",
  CONTEXTUAL: "অভিন্ন",
}

export function QuestionBankMcqCard({ item, index }: QuestionBankMcqCardProps) {
  const [showExplanation, setShowExplanation] = useState<boolean>(false)

  // Robust answer checking logic matching exact text, letter (A/B/C/D, ক/খ/গ/ঘ), or index (0/1/2/3)
  const isOptionCorrect = (opt: string, optIdx: number): boolean => {
    if (!item.answer) return false
    const trimmedAns = item.answer.trim()
    const trimmedOpt = opt.trim()

    // 1. Exact or case-insensitive string match
    if (trimmedAns.toLowerCase() === trimmedOpt.toLowerCase()) return true

    // 2. Letter match: A, B, C, D or ক, খ, গ, ঘ
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }
    const bnLetterMap: Record<string, number> = { ক: 0, খ: 1, গ: 2, ঘ: 3, ঙ: 4 }
    if (letterMap[trimmedAns.toUpperCase()] === optIdx) return true
    if (bnLetterMap[trimmedAns] === optIdx) return true

    // 3. Number Index match: 0, 1, 2, 3
    if (!isNaN(Number(trimmedAns)) && Number(trimmedAns) === optIdx) return true

    return false
  }

  // Determine correct option index & Bengali indicator prefix
  const getCorrectOptionIndex = (): number => {
    if (!item.options || item.options.length === 0) return -1
    for (let i = 0; i < item.options.length; i++) {
      const opt = item.options[i]
      if (opt && isOptionCorrect(opt, i)) {
        return i
      }
    }
    return -1
  }

  const correctOptionIdx = getCorrectOptionIndex()
  const correctOptionPrefix = correctOptionIdx !== -1 ? optionPrefixesBn[correctOptionIdx] : null
  const correctOptionText = correctOptionIdx !== -1 ? item.options[correctOptionIdx] : item.answer

  const referencesList: string[] = Array.isArray(item.reference)
    ? item.reference
    : typeof item.reference === "string" && item.reference
      ? [item.reference]
      : []

  return (
    <div
      className={cn(
        "bg-surface-container-lowest border rounded-2xl p-6 transition-all hover:border-primary/40 hover:shadow-md relative group border-outline-variant/60"
      )}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1 space-y-4 min-w-0 w-full">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Index Badge */}
            <span className="px-2 py-0.5 bg-surface-container-high font-mono text-[11px] font-bold text-on-surface-variant rounded">
              #{toBengaliNumerals(index + 1)}
            </span>

            {/* Subject Badge */}
            {item.subject && (
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded font-label-sm text-xs font-bold border border-primary/20">
                {item.subject.nameBn || item.subject.name}
              </span>
            )}

            {/* Chapter Badge */}
            {item.chapter && (
              <span className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-label-sm text-xs font-semibold">
                {item.chapter.nameBn || item.chapter.name}
              </span>
            )}

            {/* Type Badge */}
            {item.type && (
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded font-label-sm text-[11px] font-bold border border-blue-100">
                {MCQ_TYPE_LABELS_BN[item.type] || item.type}
              </span>
            )}

            {/* Math Badge */}
            {item.isMath && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded font-label-sm text-[11px] font-bold border border-amber-200">
                <span className="material-symbols-outlined text-[14px]">functions</span>
                <span>গাণিতিক</span>
              </div>
            )}
          </div>

          {/* Context / Comprehension Passage (If Present) */}
          {item.context && (
            <div className="rounded-xl border border-secondary/20 bg-secondary-container/10 p-3.5 text-xs text-on-surface-variant leading-relaxed">
              <div className="font-bold text-secondary flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">article</span>
                উদ্দীপক:
              </div>
              <div className="whitespace-pre-wrap">
                <RenderMath text={item.context} isMath={item.isMath} />
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="font-headline-md text-lg font-bold text-on-surface leading-snug">
            <RenderMath text={item.question} isMath={item.isMath} />
          </div>

          {/* Statements / Sub-questions (If Present) */}
          {Array.isArray(item.statements) && item.statements.length > 0 && (
            <div className="space-y-1.5 pl-3 border-l-2 border-primary/40 py-1 bg-surface-container-low/40 rounded-r-lg p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                বিবৃতিসমূহ:
              </span>
              {item.statements.map((stmt, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-xs text-on-surface-variant font-medium">
                  <span className="font-mono font-bold text-secondary shrink-0">
                    {romanNumerals[sIdx] || `${sIdx + 1}.`}
                  </span>
                  <span>
                    <RenderMath text={stmt} isMath={item.isMath} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Option Choices Grid (Read-only options list) */}
          {Array.isArray(item.options) && item.options.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                অপশনসমূহ ({toBengaliNumerals(item.options.length)}):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map((opt, optIdx) => {
                  const letter = optionPrefixesBn[optIdx] || String(optIdx + 1)

                  return (
                    <div
                      key={optIdx}
                      className="flex items-center gap-2.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface p-2.5 text-xs text-left"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold bg-surface-container-high text-on-surface-variant">
                        {letter}
                      </span>
                      <span className="flex-1 min-w-0 whitespace-normal break-words">
                        <RenderMath text={opt} isMath={item.isMath} />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Correct Answer & Solution Box BELOW Options */}
          {item.answer && (
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-3.5 space-y-2 mt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-on-surface">সঠিক উত্তর:</span>
                  <span className="inline-flex items-center gap-1.5 font-label-sm text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-3 py-1 rounded-md">
                    <span>✓</span>
                    {correctOptionPrefix && (
                      <span className="bg-emerald-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">
                        {correctOptionPrefix}
                      </span>
                    )}
                    <RenderMath text={correctOptionText || item.answer} isMath={item.isMath} />
                  </span>
                </div>

                {item.explanation && (
                  <button
                    type="button"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showExplanation ? "expand_less" : "help"}
                    </span>
                    <span>{showExplanation ? "ব্যাখ্যা লুকান" : "ব্যাখ্যা ও সমাধান দেখুন"}</span>
                  </button>
                )}
              </div>

              {/* Collapsible Explanation Text */}
              {showExplanation && item.explanation && (
                <div className="pt-2.5 border-t border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="font-bold text-on-surface block mb-1">ব্যাখ্যা:</span>
                  <div className="whitespace-pre-wrap">
                    <RenderMath text={item.explanation} isMath={item.isMath} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reference Tags Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/30 pt-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {referencesList.length > 0 ? (
                referencesList.map((ref, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded text-[11px] font-medium"
                  >
                    🏷️ {ref}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-muted-foreground italic">কোনো রেফারেন্স ট্যাগ নেই</span>
              )}
            </div>

            <span className="text-[11px] font-mono text-outline/60">
              আইডি: {item.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
