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
import { StudentExamCard } from "./student-exam-card"

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
      {/* ── Hero Header – Solid Primary Color ── */}
      <div className="relative overflow-hidden bg-primary px-4 pt-7 pb-10 md:rounded-3xl">
        <div className="relative z-10 space-y-4">
          {/* Top row: class badge + portal label */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              অনলাইন এক্সাম পোর্টাল
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm md:text-4xl">
              আমার পরীক্ষাসমূহ
            </h1>
            <p className="mt-1.5 text-sm text-white/75 max-w-md">
              আপনার শ্রেণীর নির্ধারিত এমসিকিউ পরীক্ষাগুলো সম্পন্ন করুন ও সাথে সাথে ফলাফল দেখুন।
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2 pt-1">
            <HeroStat icon={<ClipboardList className="h-3.5 w-3.5" />} label={`${counts.all} মোট`} />
            <HeroStat icon={<TrendingUp className="h-3.5 w-3.5" />} label={`${counts.in_progress} চলমান`} />
            <HeroStat icon={<CheckCircle2 className="h-3.5 w-3.5" />} label={`${counts.completed} সম্পন্ন`} />
            <HeroStat icon={<BookOpen className="h-3.5 w-3.5" />} label={`${counts.available} নতুন`} />
          </div>
        </div>
      </div>

      {/* ── Sticky Controls ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-outline-variant/30 px-4 py-3 md:static md:bg-transparent md:border-none md:backdrop-blur-none md:px-0 md:pt-6 md:pb-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Full-width Search on Mobile (Placed before tab filters), fixed-width on desktop */}
          <div className="relative w-full md:w-72 md:order-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <Input
              type="text"
              placeholder="পরীক্ষার নাম দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 rounded-2xl bg-surface-container-lowest border-outline-variant/50 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs – horizontal scroll on mobile, comes after search on mobile */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar md:order-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all
                  ${activeTab === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    rounded-full px-1.5 py-0 text-[10px] font-bold leading-4
                    ${activeTab === tab.key ? "bg-white/25 text-white" : "bg-surface-container-high text-on-surface-variant"}
                  `}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
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

function HeroStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/15">
      {icon}
      {label}
    </span>
  )
}

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
