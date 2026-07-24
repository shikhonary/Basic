"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export function AcademicClassListHeader() {
  return (
    <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <h2 className="mb-1 font-headline-md text-3xl font-extrabold text-primary md:text-4xl">
          Class Management
        </h2>
        <p className="max-w-2xl font-body-md text-base leading-relaxed text-on-surface-variant">
          Manage institutional academic levels, naming conventions, and display ordering
          across the entire portal ecosystem.
        </p>
      </div>
      <Button
        asChild
        className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-3 font-headline-md text-base font-bold text-on-primary-container shadow-xs transition-all active:scale-95 hover:bg-primary hover:text-white h-auto normal-case tracking-normal"
      >
        <Link href="/academic-classes/create">
          <span className="material-symbols-outlined">add</span>
          <span>Add New Class</span>
        </Link>
      </Button>
    </section>
  )
}
