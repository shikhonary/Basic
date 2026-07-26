import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"

/**
 * Fetch current authenticated user's student profile.
 */
export function useStudentProfile() {
  return useQuery({
    ...trpc.student.getProfile.queryOptions(),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch list of academic classes for selection dropdowns.
 */
export function useAcademicClassesForSelection() {
  return useQuery({
    ...trpc.academicClass.forSelection.queryOptions({}),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Mutation hook to update student profile info.
 */
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.student.updateProfile.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.student.pathFilter())
      queryClient.invalidateQueries(trpc.user.pathFilter())
    },
  })
}
