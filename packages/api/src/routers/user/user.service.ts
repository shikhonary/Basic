/**
 * User domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 * Functions accept a typed Prisma client + validated input and return
 * typed results — no tRPC dependencies, making them unit-testable.
 */
import type { PrismaClient } from "@workspace/db/main"
import { badRequest, notFound } from "../../utils/errors"
import { auth } from "@workspace/auth"
import type {
  DeleteUserInput,
  GetUserInput,
  ListUsersInput,
  UpdateUserInput,
  UpdateUserRolesInput,
  CreateUserInput,
} from "./user.schema"
import { safeUserSelect } from "./user.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listUsers(db: PrismaClient, input: ListUsersInput) {
  const limit = input.limit ?? 20
  const page = input.page ?? 1
  const skip = (page - 1) * limit

  const where: any = {}

  if (input.query) {
    where.OR = [
      { name: { contains: input.query, mode: "insensitive" } },
      { email: { contains: input.query, mode: "insensitive" } },
      { phoneNumber: { contains: input.query } },
    ]
  }

  if (input.role && input.role !== "All") {
    where.roles = {
      some: {
        name: {
          equals: input.role.toUpperCase(),
        },
      },
    }
  }

  if (input.status && input.status !== "All") {
    if (input.status === "Verified") {
      where.OR = [
        { emailVerified: true },
        { phoneNumberVerified: true },
      ]
    } else if (input.status === "Pending") {
      where.emailVerified = false
      where.phoneNumberVerified = false
    }
  }

  const [items, totalItems] = await Promise.all([
    db.user.findMany({
      take: limit,
      skip,
      where,
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
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where }),
  ])

  return {
    users: items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
    page,
    limit,
  }
}

export async function getUserById(db: PrismaClient, input: GetUserInput) {
  const user = await db.user.findUnique({
    where: { id: input.id },
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

export async function updateUserContact(
  db: PrismaClient,
  userId: string,
  input: { phoneNumber?: string; email?: string }
) {
  const existing = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!existing) throw notFound("User")

  const dataToUpdate: any = {}
  if (input.phoneNumber !== undefined) {
    dataToUpdate.phoneNumber = input.phoneNumber
    dataToUpdate.phoneNumberVerified = false
    // Clear any existing verification OTPs for this phone number
    await db.verification.deleteMany({
      where: { identifier: input.phoneNumber },
    })
  }
  if (input.email !== undefined) {
    dataToUpdate.email = input.email
    dataToUpdate.emailVerified = false
    // Clear any existing verification links for this email
    await db.verification.deleteMany({
      where: { identifier: input.email },
    })
  }

  return db.user.update({
    where: { id: userId },
    data: dataToUpdate,
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

export async function createUser(
  db: PrismaClient,
  input: CreateUserInput,
) {
  const existing = await db.user.findUnique({
    where: { email: input.email },
  })

  if (existing) {
    throw badRequest("User with this email already exists.")
  }

  const roles = await db.role.findMany({
    where: { id: { in: input.roleIds } },
    select: { id: true },
  })

  if (roles.length !== input.roleIds.length) {
    const missing = input.roleIds.filter(
      (id) => !roles.some((r) => r.id === id),
    )
    throw badRequest(`Role IDs not found: ${missing.join(", ")}`)
  }

  const created = await auth.api.signUpEmail({
    body: {
      email: input.email,
      password: input.password,
      name: input.name || "",
      phoneNumber: input.phoneNumber || "",
      phoneNumberVerified: false,
    },
  })

  if (!created || !created.user) {
    throw badRequest("Failed to register user credentials.")
  }

  await db.user.update({
    where: { id: created.user.id },
    data: {
      roles: {
        connect: input.roleIds.map((id) => ({ id })),
      },
    },
  })

  return db.user.findUnique({
    where: { id: created.user.id },
    select: safeUserSelect,
  })
}

export async function getUserStats(db: PrismaClient) {
  const [totalUsers, verifiedTeachers, pendingRequests] = await Promise.all([
    db.user.count(),
    db.user.count({
      where: {
        roles: {
          some: {
            name: "TEACHER",
          },
        },
      },
    }),
    db.user.count({
      where: {
        emailVerified: false,
        phoneNumberVerified: false,
      },
    }),
  ])

  return {
    totalUsers,
    totalUsersChange: "+12%",
    verifiedTeachers,
    pendingRequests,
    systemHealth: 98,
  }
}
