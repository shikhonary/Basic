"use client"

import { useChaptersList, useChapterStats } from "../services/use-chapter"
import { useSubjectsForSelection } from "@/modules/subject/services/use-subject"
import { useDeleteChapterModalStore } from "../store/use-delete-chapter-modal-store"
import { ChapterListHeader } from "./chapter-list-header"
import { ChapterStatsCards } from "./chapter-stats-cards"
import { ChapterFilters } from "./chapter-filters"
import { ChapterTable } from "./chapter-table"
import { DeleteChapterModal } from "./delete-chapter-modal"
import { useChapterSearchParams } from "../hooks/use-chapter-search-params"

export function ChapterListView() {
  const [
    {
      query: searchQuery,
      subjectId: selectedSubjectId,
      sort: selectedSort,
      page: currentPage,
      limit,
    },
    setSearchParams,
  ] = useChapterSearchParams()

  const openDeleteModal = useDeleteChapterModalStore((state) => state.openModal)

  // Query chapters list with search & filters
  const { data: chaptersData, isLoading, isError } = useChaptersList({
    limit,
    page: currentPage,
    query: searchQuery || undefined,
    subjectId: selectedSubjectId !== "All" ? selectedSubjectId : undefined,
    sort: selectedSort,
  })

  // Query chapter stats
  const { data: statsData } = useChapterStats(
    selectedSubjectId !== "All" ? { subjectId: selectedSubjectId } : undefined
  )

  // Query subjects list for dropdown filter
  const { data: subjects = [] } = useSubjectsForSelection()

  const items = chaptersData?.items ?? []
  const totalItems = chaptersData?.totalItems ?? items.length
  const totalPages = chaptersData?.totalPages ?? 1

  return (
    <div className="w-full">
      {/* Header */}
      <ChapterListHeader />

      {/* Stats Cards */}
      <ChapterStatsCards
        totalChaptersCount={statsData.totalChaptersCount}
        activeSubjectsCount={statsData.activeSubjectsCount}
      />

      {/* Filters */}
      <ChapterFilters
        searchQuery={searchQuery}
        onSearchChange={(query) => setSearchParams({ query, page: 1 })}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(subjectId) => setSearchParams({ subjectId, page: 1 })}
        subjects={subjects}
        selectedSort={selectedSort}
        onSortChange={(sort) => setSearchParams({ sort: sort as any, page: 1 })}
        selectedLimit={limit}
        onLimitChange={(newLimit) => setSearchParams({ limit: newLimit, page: 1 })}
      />

      {/* Data Table */}
      <ChapterTable
        items={items}
        isLoading={isLoading}
        isError={isError}
        onDelete={(id, name) => openDeleteModal(id, name)}
        currentPage={currentPage}
        itemsPerPage={limit}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={(page) => setSearchParams({ page })}
      />

      {/* Confirm Delete Modal */}
      <DeleteChapterModal />
    </div>
  )
}
