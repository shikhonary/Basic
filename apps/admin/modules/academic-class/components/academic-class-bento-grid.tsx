"use client"

import { Card, CardContent } from "@workspace/ui/components/card"

export function AcademicClassBentoGrid() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border-0 bg-surface-container p-0 shadow-none">
        <CardContent className="relative z-10 p-8">
          <h3 className="mb-2 font-headline-md text-xl font-bold text-primary">
            Display Hierarchy
          </h3>
          <p className="mb-6 max-w-sm font-body-md text-sm leading-relaxed text-on-surface-variant">
            Positioning dictates how classes appear in student portals and report cards.
            Ensure sequence consistency across levels.
          </p>
          <span className="inline-block border-b-2 border-primary font-label-sm text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary/70 cursor-pointer">
            Documentation
          </span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-2xl border-0 bg-primary-container p-0 shadow-none text-on-primary-container">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'opsz' 48" }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <h4 className="mb-1 font-headline-md text-lg font-bold">
                Batch Operations
              </h4>
              <p className="font-body-md text-sm opacity-80">
                Import or export entire academic frameworks via CSV or JSON formats for
                rapid deployment.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-outline-variant bg-surface-container-high p-0 shadow-none">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                history
              </span>
            </div>
            <div>
              <h4 className="mb-1 font-headline-md text-lg font-bold text-on-surface">
                Audit Logs
              </h4>
              <p className="font-body-md text-sm text-on-surface-variant">
                Track all modifications made to class structures, including naming changes
                and position updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
