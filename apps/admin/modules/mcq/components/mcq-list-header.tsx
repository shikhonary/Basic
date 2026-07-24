"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export function McqListHeader() {
  return (
    <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <h2 className="mb-1 font-headline-md text-3xl font-extrabold text-primary md:text-4xl">
          MCQ Question Bank
        </h2>
        <p className="max-w-2xl font-body-md text-base leading-relaxed text-on-surface-variant">
          Manage multiple-choice questions, answer keys, explanations, option choices, and LaTeX formulas across subjects and chapters.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="inline-flex items-center gap-2 rounded-xl border border-outline bg-white px-5 py-3 font-headline-md text-base font-bold text-primary shadow-xs transition-all active:scale-95 hover:bg-surface-container-low h-auto normal-case tracking-normal cursor-pointer"
        >
          <Link href="/mcqs/import">
            <span className="material-symbols-outlined">upload_file</span>
            <span>Import JSON</span>
          </Link>
        </Button>

        <Button
          asChild
          className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-3 font-headline-md text-base font-bold text-on-primary-container shadow-xs transition-all active:scale-95 hover:bg-primary hover:text-white h-auto normal-case tracking-normal cursor-pointer"
        >
          <Link href="/mcqs/create">
            <span className="material-symbols-outlined">add</span>
            <span>Add New MCQ</span>
          </Link>
        </Button>
      </div>
    </section>
  )
}
