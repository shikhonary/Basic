"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, SlidersHorizontal, BookOpen, X, RotateCcw, ChevronLeft, ChevronRight, HelpCircle, Award, ArrowUpDown } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { MCQ_TYPE } from "@workspace/utils/constants"
import { trpc } from "@/trpc/client"
import { QuestionBankMcqCard, QuestionBankMcqItem } from "./question-bank-mcq-card"

function toBengaliNumerals(numStr: string | number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
}

interface QuestionBankMcqListViewProps {
  subjectId: string
}

export function QuestionBankMcqListView({ subjectId }: QuestionBankMcqListViewProps) {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChapterId, setSelectedChapterId] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedBoardYear, setSelectedBoardYear] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("oldest")

  const limit = 10

  // Combine manual search query with board year filter
  const effectiveQuery = searchQuery || (selectedBoardYear !== "all" ? selectedBoardYear : undefined)

  // Calculate active filter count for mobile badge
  const activeFilterCount =
    (selectedChapterId !== "all" ? 1 : 0) +
    (selectedBoardYear !== "all" ? 1 : 0) +
    (selectedType !== "all" ? 1 : 0) +
    (sortOrder !== "oldest" ? 1 : 0)

  // Fetch MCQ list with filters
  const mcqsQuery = useQuery(
    trpc.questionBank.list.queryOptions({
      subjectId,
      chapterId: selectedChapterId !== "all" ? selectedChapterId : undefined,
      type: selectedType !== "all" ? selectedType : undefined,
      query: effectiveQuery,
      sort: sortOrder,
      page,
      limit,
    })
  )

  // Fetch Chapter MCQ counts breakdown
  const chaptersQuery = useQuery(
    trpc.questionBank.byChapter.queryOptions({
      subjectId,
    })
  )

  // Fetch Board + Year combinations for this subject / chapter
  const boardYearsQuery = useQuery(
    trpc.questionBank.boardYears.queryOptions({
      subjectId,
      chapterId: selectedChapterId !== "all" ? selectedChapterId : undefined,
    })
  )

  const mcqData = mcqsQuery.data
  const chapters = chaptersQuery.data || []
  const boardYears = boardYearsQuery.data || []
  const isLoading = mcqsQuery.isLoading

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedChapterId("all")
    setSelectedType("all")
    setSelectedBoardYear("all")
    setSortOrder("oldest")
    setPage(1)
  }

  // Reusable Select Filter controls render helper
  const renderFilterControls = (isMobile: boolean = false) => (
    <>
      {/* Chapter Filter Dropdown */}
      <div className={isMobile ? "space-y-1.5" : "flex items-center gap-2 flex-1 sm:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            অধ্যায়
          </label>
        )}
        <div className={isMobile ? "" : "flex items-center gap-2"}>
          {!isMobile && <BookOpen className="h-4 w-4 text-on-surface-variant shrink-0" />}
          <Select
            value={selectedChapterId}
            onValueChange={(val) => {
              setSelectedChapterId(val)
              setSelectedBoardYear("all")
              setPage(1)
            }}
          >
            <SelectTrigger className={isMobile ? "w-full h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3" : "w-full sm:w-[190px] h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3"}>
              <SelectValue placeholder="সকল অধ্যায়" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-md max-h-[300px]">
              <SelectItem value="all">সকল অধ্যায়</SelectItem>
              {chapters.map((chap) => (
                <SelectItem key={chap.id} value={chap.id}>
                  {typeof chap.position === "number" && chap.position > 0
                    ? `${toBengaliNumerals(chap.position)}. `
                    : ""}
                  {chap.nameBn || chap.name} ({toBengaliNumerals(chap.mcqCount)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Board + Year Filter Dropdown */}
      <div className={isMobile ? "space-y-1.5" : "flex items-center gap-2 flex-1 sm:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary" />
            বোর্ড প্রশ্ন
          </label>
        )}
        <div className={isMobile ? "" : "flex items-center gap-2"}>
          {!isMobile && <Award className="h-4 w-4 text-on-surface-variant shrink-0" />}
          <Select
            value={selectedBoardYear}
            onValueChange={(val) => {
              setSelectedBoardYear(val)
              setPage(1)
            }}
          >
            <SelectTrigger className={isMobile ? "w-full h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3" : "w-full sm:w-[200px] h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3"}>
              <SelectValue placeholder="সকল বোর্ড প্রশ্ন" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-md max-h-[300px]">
              <SelectItem value="all">সকল বোর্ড প্রশ্ন</SelectItem>
              {boardYears.map((item) => (
                <SelectItem key={item.rawRef} value={item.rawRef}>
                  🎓 {item.boardName} ২০{item.year} ({toBengaliNumerals(item.count)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MCQ Type Filter Dropdown */}
      <div className={isMobile ? "space-y-1.5" : "flex items-center gap-2 flex-1 sm:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            প্রশ্নের ধরন
          </label>
        )}
        <div className={isMobile ? "" : "flex items-center gap-2"}>
          {!isMobile && <SlidersHorizontal className="h-4 w-4 text-on-surface-variant shrink-0" />}
          <Select
            value={selectedType}
            onValueChange={(val) => {
              setSelectedType(val)
              setPage(1)
            }}
          >
            <SelectTrigger className={isMobile ? "w-full h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3" : "w-full sm:w-[150px] h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3"}>
              <SelectValue placeholder="প্রশ্নের ধরন" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-md">
              <SelectItem value="all">সকল ধরন</SelectItem>
              <SelectItem value={MCQ_TYPE.SINGLE}>জ্ঞানমূলক</SelectItem>
              <SelectItem value={MCQ_TYPE.MULTIPLE}>বহুপদী</SelectItem>
              <SelectItem value={MCQ_TYPE.CONTEXTUAL}>অভিন্ন</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort Order Dropdown (CreatedAt Asc / Desc) */}
      <div className={isMobile ? "space-y-1.5" : "flex items-center gap-2 flex-1 sm:flex-none"}>
        {isMobile && (
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            সাজান
          </label>
        )}
        <div className={isMobile ? "" : "flex items-center gap-2"}>
          {!isMobile && <ArrowUpDown className="h-4 w-4 text-on-surface-variant shrink-0" />}
          <Select
            value={sortOrder}
            onValueChange={(val: "newest" | "oldest") => {
              setSortOrder(val)
              setPage(1)
            }}
          >
            <SelectTrigger className={isMobile ? "w-full h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3" : "w-full sm:w-[150px] h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm px-3"}>
              <SelectValue placeholder="সাজান" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-md">
              <SelectItem value="oldest">পুরানো (Oldest)</SelectItem>
              <SelectItem value="newest">সর্বশেষ (Newest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Toolbar */}
      <div className="sticky top-16 z-30 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/40 rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3 justify-between">
        {/* Search Input Filter */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            type="text"
            placeholder="প্রশ্ন খুঁজুন (যেমন: গতি, বল, নিউটন)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="pl-10 pr-9 h-10 bg-surface-container-low/50 border-outline-variant/40 rounded-lg text-sm placeholder:text-on-surface-variant/60 focus-visible:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("")
                setPage(1)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Drawer Button (Visible ONLY on mobile: md:hidden) */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2 h-10 px-3.5 bg-surface-container-low/50 border-outline-variant/40 text-sm font-medium shrink-0 rounded-lg"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>ফিল্টার</span>
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-on-primary text-[11px] font-bold">
                  {toBengaliNumerals(activeFilterCount)}
                </span>
              )}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-6 space-y-5 bg-surface-container-lowest border-t border-outline-variant/40">
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle className="text-base font-bold text-on-background flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                প্রশ্ন ফিল্টার করুন
              </DrawerTitle>
              <DrawerDescription className="text-xs text-on-surface-variant">
                অধ্যায়, বোর্ড এবং প্রশ্নের ধরন অনুযায়ী ফিল্টার নির্বাচন করুন।
              </DrawerDescription>
            </DrawerHeader>

            {/* Stacked Filters in Mobile Drawer */}
            <div className="space-y-4 pt-1">
              {renderFilterControls(true)}
            </div>

            <DrawerFooter className="p-0 pt-3 flex flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 h-10 text-xs font-bold border-outline-variant/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                ফিল্টার রিসেট
              </Button>
              <DrawerClose asChild>
                <Button className="flex-1 h-10 text-xs font-bold bg-primary text-on-primary cursor-pointer">
                  প্রয়োগ করুন
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Desktop Filters Group (Visible ONLY on desktop: hidden md:flex) */}
        <div className="hidden md:flex flex-wrap items-center gap-3">
          {renderFilterControls(false)}
        </div>
      </div>

      {/* Results Meta Info Bar */}
      {mcqData && (
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span>
              মোট <strong className="text-on-background font-bold">{toBengaliNumerals(mcqData.totalItems)}</strong> টি বহুনির্বাচনী প্রশ্ন পাওয়া গেছে
            </span>
          </div>
          {mcqData.totalPages > 1 && (
            <span>
              পৃষ্ঠা <strong className="text-on-background font-bold">{toBengaliNumerals(mcqData.page)}</strong> / {toBengaliNumerals(mcqData.totalPages)}
            </span>
          )}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-6 space-y-4 rounded-xl border border-outline-variant/40">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : mcqData?.items && mcqData.items.length > 0 ? (
        /* MCQ Question Cards List */
        <div className="space-y-5">
          {mcqData.items.map((item, idx) => {
            const cardIndex = (page - 1) * limit + idx
            return (
              <QuestionBankMcqCard
                key={item.id}
                item={item as unknown as QuestionBankMcqItem}
                index={cardIndex}
              />
            )
          })}

          {/* Pagination Controls */}
          {mcqData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 pb-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 text-xs h-9 px-4 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                পূর্ববর্তী
              </Button>
              <div className="text-xs font-medium text-on-surface px-3 py-1.5 bg-surface-container-low rounded-md border border-outline-variant/30">
                {toBengaliNumerals(page)} / {toBengaliNumerals(mcqData.totalPages)}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= mcqData.totalPages}
                onClick={() => setPage((p) => Math.min(mcqData.totalPages, p + 1))}
                className="flex items-center gap-1 text-xs h-9 px-4 rounded-lg cursor-pointer"
              >
                পরবর্তী
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[260px]">
          <Search className="h-12 w-12 text-on-surface-variant/40 mb-4" />
          <h3 className="text-lg font-bold text-on-background mb-1">
            কোন প্রশ্ন পাওয়া যায়নি
          </h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
            আপনার নির্বাচিত ফিল্টার বা অনুসন্ধানের জন্য কোনো প্রশ্ন যুক্ত নেই।
          </p>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex items-center gap-2 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ফিল্টার রিসেট করুন
          </Button>
        </div>
      )}
    </div>
  )
}
