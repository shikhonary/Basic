/**
 * Academic Class domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 */
import type { PrismaClient } from "@workspace/db/main"
import { notFound } from "../../utils/errors"
import type {
  AcademicClassForSelectionInput,
  CreateAcademicClassInput,
  DeleteAcademicClassInput,
  GetAcademicClassInput,
  ListAcademicClassesInput,
  UpdateAcademicClassInput,
} from "./academic-class.schema"
import { safeAcademicClassSelect } from "./academic-class.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listAcademicClasses(
  db: PrismaClient,
  input: ListAcademicClassesInput,
) {
  const where = {
    ...(input.level ? { level: input.level } : {}),
    ...(input.query
      ? {
          OR: [
            { nameEn: { contains: input.query, mode: "insensitive" as const } },
            { nameBn: { contains: input.query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  let orderBy: any = [{ position: "asc" }, { createdAt: "desc" }]
  switch (input.sort) {
    case "position_desc":
      orderBy = [{ position: "desc" }, { createdAt: "desc" }]
      break
    case "name_asc":
      orderBy = [{ nameEn: "asc" }]
      break
    case "name_desc":
      orderBy = [{ nameEn: "desc" }]
      break
    case "newest":
      orderBy = [{ createdAt: "desc" }]
      break
    case "oldest":
      orderBy = [{ createdAt: "asc" }]
      break
    case "position_asc":
    case "All":
    default:
      orderBy = [{ position: "asc" }, { createdAt: "desc" }]
      break
  }

  const page = input.page ?? 1
  const limit = input.limit ?? 10
  const skip = input.cursor ? 1 : (page - 1) * limit

  const [items, totalItems] = await Promise.all([
    db.academicClass.findMany({
      take: limit,
      skip,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      where,
      select: safeAcademicClassSelect,
      orderBy,
    }),
    db.academicClass.count({ where }),
  ])

  const nextCursor =
    items.length === limit ? items[items.length - 1]?.id : undefined

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
    page,
    limit,
    nextCursor,
  }
}

export async function getAcademicClassStats(db: PrismaClient) {
  const [totalClassesCount, levelsGroup] = await Promise.all([
    db.academicClass.count(),
    db.academicClass.groupBy({
      by: ["level"],
    }),
  ])

  return {
    totalClassesCount,
    activeLevelsCount: levelsGroup.length,
  }
}

export async function getAcademicClassById(
  db: PrismaClient,
  input: GetAcademicClassInput,
) {
  const item = await db.academicClass.findUnique({
    where: { id: input.id },
    select: safeAcademicClassSelect,
  })

  if (!item) throw notFound("AcademicClass")
  return item
}

export async function getAcademicClassesForSelection(
  db: PrismaClient,
  input: AcademicClassForSelectionInput,
) {
  return db.academicClass.findMany({
    where: input.level ? { level: input.level } : undefined,
    select: {
      id: true,
      nameBn: true,
      nameEn: true,
      level: true,
      position: true,
    },
    orderBy: { position: "asc" },
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

import { TRPCError } from "@trpc/server"

export async function createAcademicClass(
  db: PrismaClient,
  input: CreateAcademicClassInput,
) {
  try {
    return await db.academicClass.create({
      data: input,
      select: safeAcademicClassSelect,
    })
  } catch (err: any) {
    console.error("[createAcademicClass] Error:", err)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Failed to create academic class",
    })
  }
}

export async function updateAcademicClass(
  db: PrismaClient,
  input: UpdateAcademicClassInput,
) {
  const { id, ...data } = input

  const existing = await db.academicClass.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) throw notFound("AcademicClass")

  return db.academicClass.update({
    where: { id },
    data,
    select: safeAcademicClassSelect,
  })
}

export async function deleteAcademicClass(
  db: PrismaClient,
  input: DeleteAcademicClassInput,
) {
  const existing = await db.academicClass.findUnique({
    where: { id: input.id },
    select: { id: true },
  })
  if (!existing) throw notFound("AcademicClass")

  await db.academicClass.delete({ where: { id: input.id } })
  return { success: true }
}
