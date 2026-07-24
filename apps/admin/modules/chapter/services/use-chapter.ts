import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import type {
  ChapterForSelectionInput,
  ChapterStatsInput,
  ListChaptersInput,
} from "@workspace/api"

/**
 * Hook to list chapters with filtering & pagination.
 */
export function useChaptersList(input: ListChaptersInput = { limit: 50 }) {
  return useQuery(trpc.chapter.list.queryOptions(input))
}

/**
 * Hook to fetch summary statistics for chapters using suspense.
 */
export function useChapterStats(input?: ChapterStatsInput) {
  return useSuspenseQuery(trpc.chapter.stats.queryOptions(input))
}

/**
 * Hook to fetch a single chapter by ID.
 */
export function useChapterById(id: string, enabled = true) {
  return useQuery({
    ...trpc.chapter.byId.queryOptions({ id }),
    enabled: Boolean(id) && enabled,
  })
}

/**
 * Hook to fetch chapters for dropdown selection.
 */
export function useChaptersForSelection(params?: ChapterForSelectionInput) {
  return useQuery(trpc.chapter.forSelection.queryOptions(params ?? {}))
}

/**
 * Hook to create a new chapter record.
 */
export function useCreateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.chapter.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.chapter.pathFilter())
    },
  })
}

/**
 * Hook to update an existing chapter record.
 */
export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.chapter.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.chapter.pathFilter())
    },
  })
}

/**
 * Hook to delete a chapter record.
 */
export function useDeleteChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.chapter.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.chapter.pathFilter())
    },
  })
}

/**
 * Hook to reorder chapters within a subject.
 */
export function useReorderChapters() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.chapter.reorder.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.chapter.pathFilter())
    },
  })
}
