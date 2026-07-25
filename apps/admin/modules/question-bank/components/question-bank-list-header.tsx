"use client"

import Link from "next/link"
import { Library } from "lucide-react"

export function QuestionBankListHeader() {
  return (
    <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-outline">
          <Library className="h-4 w-4" />
          <span className="font-label-sm text-xs uppercase tracking-wider">
            Browse
          </span>
        </div>
        <h2 className="mb-1 font-headline-md text-3xl font-extrabold text-primary md:text-4xl">
          Question Bank
        </h2>
        <p className="max-w-2xl font-body-md text-base leading-relaxed text-on-surface-variant">
          Browse, search, and filter all active MCQs across subjects and
          chapters. Use the filters to find questions by topic, type, or keyword.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/mcqs"
          className="inline-flex items-center gap-2 rounded-xl border border-outline bg-white px-5 py-3 font-headline-md text-sm font-bold text-primary shadow-xs transition-all hover:bg-surface-container-low active:scale-95"
        >
          <span className="material-symbols-outlined text-base">
            edit_square
          </span>
          <span>Manage MCQs</span>
        </Link>
      </div>
    </section>
  )
}
