"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Plus, Layers } from "lucide-react"

export function ExamGroupListHeader() {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl text-on-surface tracking-tight">
            Exam Groups & Model Tests
          </h1>
          <p className="mt-1 font-body-sm text-sm text-outline">
            Bundle individual exams, configure weightage & calculation modes, and generate merit leaderboards.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/exam-groups/create">
          <Button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-sm font-semibold text-on-primary shadow-sm hover:bg-primary/90 transition-all cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Create Exam Group</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
