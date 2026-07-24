"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Plus, ClipboardList } from "lucide-react"

export function ExamListHeader() {
  return (
    <section className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div className="flex items-center gap-2 text-sm text-outline mb-1">
          <ClipboardList className="h-4 w-4 text-primary" />
          <span>Academic Portal</span>
          <span>/</span>
          <span className="font-semibold text-on-surface">Exams</span>
        </div>
        <h1 className="font-headline-md text-3xl font-extrabold text-primary md:text-4xl">
          Exam Management
        </h1>
        <p className="mt-1 max-w-2xl font-body-md text-base leading-relaxed text-on-surface-variant">
          Create, schedule, configure, and monitor online examinations, MCQ assessments, and model tests across academic subjects.
        </p>
      </div>
      <Button
        asChild
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-headline-md text-sm font-bold text-on-primary shadow-sm transition-all hover:bg-primary/90 hover:shadow-md h-auto normal-case tracking-normal cursor-pointer"
      >
        <Link href="/exams/create">
          <Plus className="h-4 w-4" />
          <span>Create New Exam</span>
        </Link>
      </Button>
    </section>
  )
}
