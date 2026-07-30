/**
 * Role domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 * Functions accept a typed Prisma client and return typed results.
 */
import type { PrismaClient } from "@workspace/db/main"
import { badRequest, notFound } from "../../utils/errors"
import type {
  RoleForSelectionInput,
  ListRolesInput,
  CreateRoleInput,
  UpdateRoleInput,
} from "./role.schema"

export async function getRolesForSelection(
  db: PrismaClient,
  input?: RoleForSelectionInput,
) {
  return db.role.findMany({
    where: input?.name
      ? {
          name: {
            contains: input.name,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function listRoles(
  db: PrismaClient,
  input: ListRolesInput,
) {
  const limit = input.limit ?? 50
  const skip = input.cursor ? 1 : 0

  const where: any = {}
  if (input.query) {
    where.OR = [
      { name: { contains: input.query, mode: "insensitive" } },
      { description: { contains: input.query, mode: "insensitive" } },
    ]
  }

  const roles = await db.role.findMany({
    take: limit,
    skip,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    where,
    orderBy: {
      name: "asc",
    },
  })

  const nextCursor =
    roles.length === limit ? roles[roles.length - 1]?.id : undefined

  return {
    roles,
    nextCursor,
  }
}

export async function getRoleById(
  db: PrismaClient,
  input: { id: string },
) {
  const role = await db.role.findUnique({
    where: { id: input.id },
  })

  if (!role) {
    throw notFound("Role not found.")
  }

  return role
}

export async function createRole(
  db: PrismaClient,
  input: CreateRoleInput,
) {
  const existing = await db.role.findUnique({
    where: { name: input.name },
  })

  if (existing) {
    throw badRequest("Role with this name already exists.")
  }

  return db.role.create({
    data: {
      name: input.name,
      description: input.description || null,
    },
  })
}

export async function updateRole(
  db: PrismaClient,
  input: UpdateRoleInput,
) {
  const existing = await db.role.findUnique({
    where: { id: input.id },
  })

  if (!existing) {
    throw notFound("Role not found.")
  }

  if (input.name !== existing.name) {
    const nameConflict = await db.role.findUnique({
      where: { name: input.name },
    })
    if (nameConflict) {
      throw badRequest("Role with this name already exists.")
    }
  }

  return db.role.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description || null,
    },
  })
}

export async function deleteRole(
  db: PrismaClient,
  input: { id: string },
) {
  const existing = await db.role.findUnique({
    where: { id: input.id },
  })

  if (!existing) {
    throw notFound("Role not found.")
  }

  const usersCount = await db.user.count({
    where: {
      roles: {
        some: {
          id: input.id,
        },
      },
    },
  })

  if (usersCount > 0) {
    throw badRequest("Cannot delete role as it is assigned to one or more users.")
  }

  return db.role.delete({
    where: { id: input.id },
  })
}
