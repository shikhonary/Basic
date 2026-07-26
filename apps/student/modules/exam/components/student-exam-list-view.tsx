"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import {
  Search,
  ClipboardList,
  BookOpen,
  SlidersHorizontal,
  X,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"
import { StudentExamCard } from "./student-exam-card"

function toBengaliNumerals(numStr: string | number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
}

type FilterTab = "all" | "available" | "in_progress" | "completed"

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "সব" },
  { key: "available", label: "নতুন" },
  { key: "in_progress", label: "চলমান" },
  { key: "completed", label: "সম্পন্ন" },
]

export function StudentExamListView() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [showSearch, setShowSearch] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery(
    trpc.examAttempt.availableExams.queryOptions({
      query: search || undefined,
    }),
  )

  const items = data?.items ?? []

  const counts = useMemo(
    () => ({
      all: items.length,
      available: items.filter((e) => !e.studentAttempt).length,
      in_progress: items.filter(
        (e) => e.studentAttempt?.status === "In Progress",
      ).length,
      completed: items.filter(
        (e) =>
          e.studentAttempt?.status === "Submitted" ||
          e.studentAttempt?.status === "Auto-Submitted",
      ).length,
    }),
    [items],
  )

  const filteredExams = useMemo(() => {
    return items.filter((exam) => {
      const status = exam.studentAttempt?.status
      if (activeTab === "available") return !status
      if (activeTab === "in_progress") return status === "In Progress"
      if (activeTab === "completed")
        return status === "Submitted" || status === "Auto-Submitted"
      return true
    })
  }, [items, activeTab])

  return (
    <div className="w-full min-h-screen pb-20">
      {/* ── Header Info Banner (Question Bank design concept) ── */}
      <header className="mb-8 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-primary">
          <ClipboardList className="w-36 h-36" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <ClipboardList className="h-7 w-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-semibold">
                  <Zap className="h-3 w-3 mr-1" />
                  অনলাইন এক্সাম পোর্টাল
                </Badge>
              </div>

              <h1 className="font-headline-md text-2xl md:text-3xl font-extrabold text-on-background">
                আমার পরীক্ষাসমূহ
              </h1>

              <p className="text-sm text-on-surface-variant max-w-md mt-1">
                আপনার শ্রেণীর নির্ধারিত এমসিকিউ পরীক্ষাগুলো সম্পন্ন করুন ও সাথে সাথে ফলাফল দেখুন।
              </p>
            </div>
          </div>

          {/* Stats Summary Card */}
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/30 shrink-0">
            <ClipboardList className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-on-surface-variant font-medium">মোট নির্ধারিত পরীক্ষা</p>
              <p className="text-sm font-bold text-on-background">
                {toBengaliNumerals(counts.all)} টি পরীক্ষা
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sticky Filter & Search Controls (Question Bank sticky concept) ── */}
      <div className="sticky top-16 z-30 mb-6 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/40 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer
                ${activeTab === tab.key
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-3
                  ${activeTab === tab.key ? "bg-white/25 text-white" : "bg-surface-container-high text-on-surface-variant"}
                `}
              >
                {toBengaliNumerals(counts[tab.key])}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            type="text"
            placeholder="পরীক্ষার নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 h-10 rounded-lg bg-surface-container-low/50 border-outline-variant/40 text-sm placeholder:text-on-surface-variant/60 focus-visible:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="px-0 pt-4 md:pt-6">
        {isLoading ? (
          <LoadingGrid />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredExams.length === 0 ? (
          <EmptyState
            tab={activeTab}
            hasSearch={!!search}
            onClear={() => {
              setSearch("")
              setActiveTab("all")
            }}
          />
        ) : (
          <>
            <p className="mb-3 text-xs text-on-surface-variant px-0.5">
              {filteredExams.length} টি পরীক্ষা দেখানো হচ্ছে
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredExams.map((exam) => (
                <StudentExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Helpers ── */

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl border border-outline-variant/30 p-5 bg-surface-container-lowest"
        >
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-error/40 bg-error-container/10 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <BookOpen className="h-8 w-8 text-error" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-lg text-on-surface">তালিকা লোড করা সম্ভব হয়নি</h3>
        <p className="text-sm text-on-surface-variant">
          ইন্টারনেট কানেকশন পরীক্ষা করুন বা পুনরায় চেষ্টা করুন।
        </p>
      </div>
      <Button onClick={onRetry} size="sm" className="gap-2 rounded-xl">
        <Loader2 className="h-4 w-4" />
        পুনরায় চেষ্টা করুন
      </Button>
    </div>
  )
}

type FilterTab2 = FilterTab
function EmptyState({
  tab,
  hasSearch,
  onClear,
}: {
  tab: FilterTab2
  hasSearch: boolean
  onClear: () => void
}) {
  const message = hasSearch
    ? "এই নামে কোনো পরীক্ষা পাওয়া যায়নি।"
    : tab === "available"
      ? "এই মুহূর্তে কোনো নতুন পরীক্ষা নেই।"
      : tab === "in_progress"
        ? "বর্তমানে কোনো চলমান পরীক্ষা নেই।"
        : tab === "completed"
          ? "আপনি এখনো কোনো পরীক্ষা সম্পন্ন করেননি।"
          : "আপনার শ্রেণীর জন্য কোনো পরীক্ষা নির্ধারিত হয়নি।"

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-outline-variant bg-surface-container-lowest p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <SlidersHorizontal className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-xl text-on-surface">কোনো পরীক্ষা নেই</h3>
        <p className="text-sm text-on-surface-variant max-w-xs">{message}</p>
      </div>
      {(hasSearch || tab !== "all") && (
        <Button onClick={onClear} variant="outline" size="sm" className="gap-2 rounded-xl">
          <X className="h-4 w-4" />
          ফিল্টার সরান
        </Button>
      )}
    </div>
  )
}
