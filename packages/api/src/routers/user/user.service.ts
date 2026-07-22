/**
 * User domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 * Functions accept a typed Prisma client + validated input and return
 * typed results — no tRPC dependencies, making them unit-testable.
 */
import type { PrismaClient } from "@workspace/db/main"
import { badRequest, notFound } from "../../utils/errors"
import type {
  DeleteUserInput,
  GetUserInput,
  ListUsersInput,
  UpdateUserInput,
  UpdateUserRolesInput,
} from "./user.schema"
import { safeUserSelect } from "./user.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listUsers(db: PrismaClient, input: ListUsersInput) {
  const users = await db.user.findMany({
    take: input.limit,
    skip: input.cursor ? 1 : 0,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    select: safeUserSelect,
    orderBy: { createdAt: "desc" },
  })

  const nextCursor =
    users.length === input.limit ? users[users.length - 1]?.id : undefined

  return { users, nextCursor }
}

export async function getUserById(db: PrismaClient, input: GetUserInput) {
  const user = await db.user.findUnique({
    where: { id: input.id },
    select: safeUserSelect,
  })

  if (!user) throw notFound("User")
  return user
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function updateUser(db: PrismaClient, input: UpdateUserInput) {
  const { id, ...data } = input

  const existing = await db.user.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw notFound("User")

  return db.user.update({
    where: { id },
    data,
    select: safeUserSelect,
  })
}

export async function deleteUser(db: PrismaClient, input: DeleteUserInput) {
  const existing = await db.user.findUnique({
    where: { id: input.id },
    select: { id: true },
  })
  if (!existing) throw notFound("User")

  await db.user.delete({ where: { id: input.id } })
  return { success: true }
}

export async function updateUserRoles(
  db: PrismaClient,
  input: UpdateUserRolesInput,
) {
  const existingUser = await db.user.findUnique({
    where: { id: input.userId },
    select: { id: true },
  })
  if (!existingUser) throw notFound("User")

  const existingRoles = await db.role.findMany({
    where: { id: { in: input.roleIds } },
    select: { id: true, name: true },
  })

  if (existingRoles.length !== input.roleIds.length) {
    const missing = input.roleIds.filter(
      (id) => !existingRoles.some((r) => r.id === id),
    )
    throw badRequest(`Role IDs not found: ${missing.join(", ")}`)
  }

  return db.user.update({
    where: { id: input.userId },
    data: {
      roles: {
        set: input.roleIds.map((id) => ({ id })),
      },
    },
    select: {
      ...safeUserSelect,
      roles: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  })
}
