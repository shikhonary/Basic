/**
 * Exam domain — business logic service.
 *
 * All database queries and core calculations live here.
 */
import type { PrismaClient } from "@workspace/db/main"
import { TRPCError } from "@trpc/server"
import { badRequest, notFound } from "../../utils/errors"
import type {
  AddExamSubjectsInput,
  BulkDeleteExamsInput,
  CreateExamInput,
  DeleteExamInput,
  ExamStatsInput,
  GetExamInput,
  ListExamsInput,
  RemoveExamSubjectInput,
  ToggleExamStatusInput,
  UpdateExamInput,
  UpdateExamSubjectMcqsInput,
} from "./exam.schema"
import { safeExamSelect } from "./exam.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listExams(db: PrismaClient, input: ListExamsInput) {
  const where = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.academicClassId ? { academicClassId: input.academicClassId } : {}),
    ...(input.examGroupId
      ? { examGroupItems: { some: { examGroupId: input.examGroupId } } }
      : {}),
    ...(input.query
      ? {
          OR: [
            { title: { contains: input.query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  let orderBy: any = [{ createdAt: "desc" }]
  switch (input.sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }]
      break
    case "title_asc":
      orderBy = [{ title: "asc" }]
      break
    case "title_desc":
      orderBy = [{ title: "desc" }]
      break
    case "newest":
    case "All":
    default:
      orderBy = [{ createdAt: "desc" }]
      break
  }

  const page = input.page ?? 1
  const limit = input.limit ?? 20
  const skip = input.cursor ? 1 : (page - 1) * limit

  const [items, totalItems] = await Promise.all([
    db.exam.findMany({
      take: limit,
      skip,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      where,
      select: safeExamSelect,
      orderBy,
    }),
    db.exam.count({ where }),
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

export async function getExamById(db: PrismaClient, input: GetExamInput) {
  const item = await db.exam.findUnique({
    where: { id: input.id },
    select: safeExamSelect,
  })

  if (!item) throw notFound("Exam")
  return item
}

export async function getExamStats(db: PrismaClient, input?: ExamStatsInput) {
  const where = {
    ...(input?.status ? { status: input?.status } : {}),
    ...(input?.type ? { type: input?.type } : {}),
    ...(input?.academicClassId ? { academicClassId: input?.academicClassId } : {}),
  }

  const [totalCount, statusGroup, typeGroup] = await Promise.all([
    db.exam.count({ where }),
    db.exam.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
    }),
    db.exam.groupBy({
      by: ["type"],
      where,
      _count: { id: true },
    }),
  ])

  const statusCounts = statusGroup.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = item._count.id
    return acc
  }, {})

  const typeCounts = typeGroup.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = item._count.id
    return acc
  }, {})

  return {
    totalCount,
    statusCounts,
    typeCounts,
  }
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createExam(db: PrismaClient, input: CreateExamInput) {
  try {
    const { subjectIds, academicClassId, examGroupId, ...examData } = input

    // Validate date range
    if (examData.endDate <= examData.startDate) {
      throw badRequest("End date must be after start date")
    }

    // Validate academic class exists
    const academicClass = await db.academicClass.findUnique({
      where: { id: academicClassId },
      select: { id: true },
    })
    if (!academicClass) {
      throw badRequest("Academic class ID is invalid")
    }

    // Validate all subjects exist
    const subjects = await db.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true },
    })

    if (subjects.length !== subjectIds.length) {
      throw badRequest("One or more subject IDs are invalid")
    }

    // If examGroupId is provided, validate it exists
    if (examGroupId) {
      const examGroup = await db.examGroup.findUnique({
        where: { id: examGroupId },
        select: { id: true },
      })
      if (!examGroup) {
        throw badRequest("Exam Group ID is invalid")
      }
    }

    // Create exam + subject links + examGroup link in a transaction
    const exam = await db.$transaction(async (tx) => {
      const created = await tx.exam.create({
        data: {
          ...examData,
          academicClassId,
        },
        select: { id: true },
      })

      await tx.examSubject.createMany({
        data: subjectIds.map((subjectId) => ({
          examId: created.id,
          subjectId,
        })),
      })

      if (examGroupId) {
        await tx.examGroupItem.create({
          data: {
            examGroupId,
            examId: created.id,
            position: 0,
            weightage: 100.0,
            isRequired: true,
          },
        })
      }

      return tx.exam.findUniqueOrThrow({
        where: { id: created.id },
        select: safeExamSelect,
      })
    })

    return exam
  } catch (err: any) {
    if (err instanceof TRPCError) throw err
    console.error("[createExam] Error:", err)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Failed to create exam",
    })
  }
}

export async function updateExam(db: PrismaClient, input: UpdateExamInput) {
  const { id, academicClassId, examGroupId, ...data } = input

  const existing = await db.exam.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) throw notFound("Exam")

  if (academicClassId) {
    const academicClass = await db.academicClass.findUnique({
      where: { id: academicClassId },
      select: { id: true },
    })
    if (!academicClass) throw badRequest("Academic class ID is invalid")
  }

  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    throw badRequest("End date must be after start date")
  }

  if (examGroupId !== undefined) {
    // If examGroupId is provided, link or update
    if (examGroupId === null || examGroupId === "none" || examGroupId === "") {
      // Remove all group items for this exam
      await db.examGroupItem.deleteMany({
        where: { examId: id },
      })
    } else {
      const groupExists = await db.examGroup.findUnique({
        where: { id: examGroupId },
        select: { id: true },
      })
      if (!groupExists) throw badRequest("Exam Group ID is invalid")

      // Upsert the exam group item link
      await db.examGroupItem.upsert({
        where: {
          examGroupId_examId: {
            examGroupId,
            examId: id,
          },
        },
        create: {
          examGroupId,
          examId: id,
          position: 0,
          weightage: 100.0,
          isRequired: true,
        },
        update: {},
      })
    }
  }

  return db.exam.update({
    where: { id },
    data: {
      ...data,
      ...(academicClassId ? { academicClassId } : {}),
    },
    select: safeExamSelect,
  })
}

export async function deleteExam(db: PrismaClient, input: DeleteExamInput) {
  const existing = await db.exam.findUnique({
    where: { id: input.id },
    select: { id: true },
  })
  if (!existing) throw notFound("Exam")

  await db.exam.delete({
    where: { id: input.id },
  })

  return { success: true }
}

export async function bulkDeleteExams(
  db: PrismaClient,
  input: BulkDeleteExamsInput,
) {
  await db.exam.deleteMany({
    where: {
      id: { in: input.ids },
    },
  })

  return { success: true, count: input.ids.length }
}

export async function toggleExamStatus(
  db: PrismaClient,
  input: ToggleExamStatusInput,
) {
  const existing = await db.exam.findUnique({
    where: { id: input.id },
    select: { id: true },
  })
  if (!existing) throw notFound("Exam")

  return db.exam.update({
    where: { id: input.id },
    data: { status: input.status },
    select: safeExamSelect,
  })
}

export async function addExamSubjects(
  db: PrismaClient,
  input: AddExamSubjectsInput,
) {
  const { examId, subjectIds } = input

  const exam = await db.exam.findUnique({
    where: { id: examId },
    select: { id: true },
  })
  if (!exam) throw notFound("Exam")

  const subjects = await db.subject.findMany({
    where: { id: { in: subjectIds } },
    select: { id: true },
  })
  if (subjects.length !== subjectIds.length) {
    throw badRequest("One or more subject IDs are invalid")
  }

  await db.examSubject.createMany({
    data: subjectIds.map((subjectId) => ({
      examId,
      subjectId,
    })),
    skipDuplicates: true,
  })

  return db.exam.findUniqueOrThrow({
    where: { id: examId },
    select: safeExamSelect,
  })
}

export async function removeExamSubject(
  db: PrismaClient,
  input: RemoveExamSubjectInput,
) {
  const { examId, subjectId } = input

  await db.examSubject.deleteMany({
    where: {
      examId,
      subjectId,
    },
  })

  return db.exam.findUniqueOrThrow({
    where: { id: examId },
    select: safeExamSelect,
  })
}

export async function updateExamSubjectMcqs(
  db: PrismaClient,
  input: UpdateExamSubjectMcqsInput,
) {
  const { examId, examSubjectId, mcqIds } = input

  const examSubject = await db.examSubject.findFirst({
    where: { id: examSubjectId, examId },
  })
  if (!examSubject) throw notFound("Exam Subject")

  await db.examSubject.update({
    where: { id: examSubjectId },
    data: { mcqIds },
  })

  return db.exam.findUniqueOrThrow({
    where: { id: examId },
    select: safeExamSelect,
  })
}
