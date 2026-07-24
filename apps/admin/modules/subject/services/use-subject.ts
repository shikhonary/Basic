import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import type { ListSubjectsInput, SubjectForSelectionInput } from "@workspace/api"

/**
 * Hook to list subjects with filtering & pagination.
 */
export function useSubjectsList(
  input: ListSubjectsInput = { limit: 50 }
) {
  return useQuery(trpc.subject.list.queryOptions(input))
}

/**
 * Hook to fetch summary statistics for subjects using suspense.
 */
export function useSubjectStats() {
  return useSuspenseQuery(trpc.subject.stats.queryOptions())
}

/**
 * Hook to fetch a single subject by ID.
 */
export function useSubjectById(id: string, enabled = true) {
  return useQuery({
    ...trpc.subject.byId.queryOptions({ id }),
    enabled: Boolean(id) && enabled,
  })
}

/**
 * Hook to fetch subjects for dropdown selection.
 */
export function useSubjectsForSelection(params?: SubjectForSelectionInput) {
  return useQuery(trpc.subject.forSelection.queryOptions(params ?? {}))
}

/**
 * Hook to create a new subject record.
 */
export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.subject.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.subject.pathFilter())
    },
  })
}

/**
 * Hook to update an existing subject record.
 */
export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.subject.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.subject.pathFilter())
    },
  })
}

/**
 * Hook to delete a subject record.
 */
export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.subject.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.subject.pathFilter())
    },
  })
}

/**
 * Hook to assign or update academic classes for a subject.
 */
export function useAssignAcademicClassesToSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.subject.assignAcademicClasses.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.subject.pathFilter())
    },
  })
}
