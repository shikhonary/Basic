import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import type {
  ListExamGroupsInput,
  ExamGroupStatsInput,
  ListExamGroupResultsInput,
  GetStudentExamGroupResultInput,
} from "@workspace/api"

/**
 * Hook to list exam groups with search, filtering & pagination.
 */
export function useExamGroupsList(input: ListExamGroupsInput = { limit: 20 }) {
  return useQuery(trpc.examGroup.list.queryOptions(input))
}

/**
 * Hook to fetch summary statistics for exam groups.
 */
export function useExamGroupStats(input?: ExamGroupStatsInput) {
  return useQuery(trpc.examGroup.stats.queryOptions(input))
}

/**
 * Hook to fetch a single exam group by ID with attached items and results count.
 */
export function useExamGroupById(id: string, enabled = true) {
  return useQuery({
    ...trpc.examGroup.byId.queryOptions({ id }),
    enabled: Boolean(id) && enabled,
  })
}

/**
 * Hook to create a new exam group.
 */
export function useCreateExamGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to update an existing exam group.
 */
export function useUpdateExamGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to delete an exam group.
 */
export function useDeleteExamGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to bulk delete exam groups.
 */
export function useBulkDeleteExamGroups() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.bulkDelete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to toggle publication status.
 */
export function useTogglePublishExamGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.togglePublish.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to add an exam item to an exam group.
 */
export function useAddExamGroupItem() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.addItem.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to update an exam item (weightage, position, requirement).
 */
export function useUpdateExamGroupItem() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.updateItem.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to remove an exam item from an exam group.
 */
export function useRemoveExamGroupItem() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.removeItem.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to trigger calculating group results / rankings for an exam group.
 */
export function useCalculateExamGroupResults() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.examGroup.calculateResults.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.examGroup.pathFilter())
    },
  })
}

/**
 * Hook to list calculated results / leaderboard for an exam group.
 */
export function useExamGroupResults(input: ListExamGroupResultsInput, enabled = true) {
  return useQuery({
    ...trpc.examGroup.listResults.queryOptions(input),
    enabled: Boolean(input.examGroupId) && enabled,
  })
}

/**
 * Hook to get detailed result for a single student in an exam group.
 */
export function useStudentExamGroupResult(input: GetStudentExamGroupResultInput, enabled = true) {
  return useQuery({
    ...trpc.examGroup.getStudentResult.queryOptions(input),
    enabled: Boolean(input.examGroupId) && enabled,
  })
}
