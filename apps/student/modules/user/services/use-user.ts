import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { authClient } from "@workspace/auth/client"
import type { ListUsersInput, RoleForSelectionInput } from "@workspace/api"

/**
 * Hook to get the currently authenticated user's session and assigned roles.
 */
export function useCurrentUser() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const meQuery = useQuery({
    ...trpc.user.me.queryOptions(),
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time for user role caching
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    refetchOnWindowFocus: false,
  })

  const user = (meQuery.data?.user ?? session?.user ?? null) as (typeof session extends { user: infer U } ? U : any) & {
    phoneNumber?: string | null
    phoneNumberVerified?: boolean
    emailVerified?: boolean
  }

  const isSuperAdmin =
    meQuery.data?.roles?.some((role) => role.name === "SUPER_ADMIN") ?? false

  const isPhoneRegistration = Boolean(
    user?.email?.endsWith("@phone.bec.local") || user?.phoneNumber
  )

  const phoneNumberVerified = Boolean(user?.phoneNumberVerified)
  const emailVerified = Boolean(user?.emailVerified)

  // Verification status logic
  const isVerified = isPhoneRegistration ? phoneNumberVerified : emailVerified
  const isPhoneUnverified = Boolean(user && isPhoneRegistration && !phoneNumberVerified)
  const isEmailUnverified = Boolean(user && !isPhoneRegistration && !emailVerified)

  return {
    session,
    isSessionPending,
    user,
    roles: meQuery.data?.roles ?? [],
    isSuperAdmin,
    isVerified,
    isPhoneRegistration,
    phoneNumberVerified,
    emailVerified,
    isPhoneUnverified,
    isEmailUnverified,
    isLoading: isSessionPending || (!!session && meQuery.isLoading),
    isError: meQuery.isError,
    refetch: meQuery.refetch,
  }
}

/**
 * Hook to list all users with cursor-based pagination.
 */
export function useUsersList(input: ListUsersInput = { limit: 20 }) {
  return useQuery(trpc.user.list.queryOptions(input))
}

/**
 * Hook to fetch a single user by ID.
 */
export function useUserById(id: string, enabled = true) {
  return useQuery({
    ...trpc.user.byId.queryOptions({ id }),
    enabled: Boolean(id) && enabled,
  })
}

/**
 * Hook to update a user's profile fields.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.user.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.pathFilter())
    },
  })
}

/**
 * Hook to update a user's assigned roles by role IDs.
 */
export function useUpdateUserRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.user.updateRoles.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.pathFilter())
    },
  })
}

/**
 * Hook to delete a user by ID.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.user.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.pathFilter())
    },
  })
}

/**
 * Hook to fetch roles for selection inputs (with optional name filter).
 */
export function useRolesForSelection(input?: RoleForSelectionInput) {
  return useQuery(trpc.role.forSelection.queryOptions(input))
}

/** Alias for useRolesForSelection */
export const useRoleForSelection = useRolesForSelection

/**
 * Hook for logged in user to update contact info (phone/email).
 */
export function useUpdateUserContact() {
  const queryClient = useQueryClient()

  return useMutation({
    ...trpc.user.updateContact.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.pathFilter())
    },
  })
}

