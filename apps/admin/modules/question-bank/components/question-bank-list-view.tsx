"use client"

import { useQuestionBankList, useQuestionBankStats } from "../services/use-question-bank"
import { useSubjectsForSelection } from "@/modules/subject/services/use-subject"
import { useChaptersForSelection } from "@/modules/chapter/services/use-chapter"
import { useQuestionBankSearchParams } from "../hooks/use-question-bank-search-params"
import { useMcqDetailModalStore } from "../store/use-mcq-detail-modal-store"
import { QuestionBankListHeader } from "./question-bank-list-header"
import { QuestionBankStatsCards } from "./question-bank-stats-cards"
import { QuestionBankFilters } from "./question-bank-filters"
import { QuestionBankTable } from "./question-bank-table"
import { QuestionBankMcqDetailModal } from "./question-bank-mcq-detail-modal"

export function QuestionBankListView() {
  const [
    {
      query: searchQuery,
      subjectId: selectedSubjectId,
      chapterId: selectedChapterId,
      type: selectedType,
      isMath: selectedIsMath,
      sort: selectedSort,
      page: currentPage,
      limit,
    },
    setSearchParams,
  ] = useQuestionBankSearchParams()

  const openDetailModal = useMcqDetailModalStore((state) => state.openModal)

  // MCQ list with active filters
  const { data: listData, isLoading, isError } = useQuestionBankList({
    limit,
    page: currentPage,
    query: searchQuery || undefined,
    subjectId: selectedSubjectId !== "All" ? selectedSubjectId : undefined,
    chapterId: selectedChapterId !== "All" ? selectedChapterId : undefined,
    type: selectedType !== "All" ? selectedType : undefined,
    isMath:
      selectedIsMath === "true"
        ? true
        : selectedIsMath === "false"
        ? false
        : undefined,
    sort: selectedSort as any,
  })

  // Stats — scoped to active filters
  const { data: statsData } = useQuestionBankStats(
    selectedSubjectId !== "All" || selectedChapterId !== "All"
      ? {
          subjectId: selectedSubjectId !== "All" ? selectedSubjectId : undefined,
          chapterId: selectedChapterId !== "All" ? selectedChapterId : undefined,
        }
      : undefined,
  )

  // Filter dropdowns
  const { data: subjects = [] } = useSubjectsForSelection()
  const { data: chapters = [] } = useChaptersForSelection(
    selectedSubjectId !== "All" ? { subjectId: selectedSubjectId } : undefined,
  )

  const items = listData?.items ?? []
  const totalItems = listData?.totalItems ?? 0
  const totalPages = listData?.totalPages ?? 1

  return (
    <div className="w-full">
      {/* Header */}
      <QuestionBankListHeader />

      {/* Stats Cards */}
      <QuestionBankStatsCards
        totalCount={statsData?.totalCount ?? 0}
        mathCount={statsData?.mathCount ?? 0}
        nonMathCount={statsData?.nonMathCount ?? 0}
        typeCounts={statsData?.typeCounts}
      />

      {/* Filters */}
      <QuestionBankFilters
        searchQuery={searchQuery}
        onSearchChange={(query) => setSearchParams({ query, page: 1 })}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(subjectId) =>
          setSearchParams({ subjectId, chapterId: "All", page: 1 })
        }
        subjects={subjects}
        selectedChapterId={selectedChapterId}
        onChapterChange={(chapterId) => setSearchParams({ chapterId, page: 1 })}
        chapters={chapters}
        selectedType={selectedType}
        onTypeChange={(type) => setSearchParams({ type, page: 1 })}
        selectedIsMath={selectedIsMath}
        onIsMathChange={(isMath) => setSearchParams({ isMath, page: 1 })}
        selectedSort={selectedSort}
        onSortChange={(sort) => setSearchParams({ sort: sort as any, page: 1 })}
        selectedLimit={limit}
        onLimitChange={(newLimit) => setSearchParams({ limit: newLimit, page: 1 })}
      />

      {/* MCQ Card Table */}
      <QuestionBankTable
        items={items as any}
        isLoading={isLoading}
        isError={isError}
        onViewDetail={(id) => openDetailModal(id)}
        currentPage={currentPage}
        itemsPerPage={limit}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={(page) => setSearchParams({ page })}
      />

      {/* Detail Modal */}
      <QuestionBankMcqDetailModal />
    </div>
  )
}
