/**
 * Question Bank domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 * The question bank is read-only — it only exposes active MCQs
 * for browsing, searching, and filtering purposes.
 */
import type { PrismaClient } from "@workspace/db/main"
import { notFound } from "../../utils/errors"
import type {
  GetQuestionBankMcqInput,
  ListQuestionBankInput,
  QuestionBankByChapterInput,
  QuestionBankStatsInput,
} from "./question-bank.schema"
import { safeQuestionBankMcqSelect } from "./question-bank.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * List active MCQs with pagination and optional filters.
 * Only returns MCQs where isActive = true.
 */
export async function listQuestionBankMcqs(
  db: PrismaClient,
  input: ListQuestionBankInput,
) {
  const where = {
    // Question bank always scopes to active MCQs only
    isActive: true,
    ...(input.subjectId ? { subjectId: input.subjectId } : {}),
    ...(input.chapterId ? { chapterId: input.chapterId } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.isMath !== undefined ? { isMath: input.isMath } : {}),
    ...(input.query
      ? {
          OR: [
            {
              question: {
                contains: input.query,
                mode: "insensitive" as const,
              },
            },
            {
              explanation: {
                contains: input.query,
                mode: "insensitive" as const,
              },
            },
            {
              context: {
                contains: input.query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  }

  let orderBy: any = [{ createdAt: "desc" }]
  switch (input.sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }]
      break
    case "question_asc":
      orderBy = [{ question: "asc" }]
      break
    case "question_desc":
      orderBy = [{ question: "desc" }]
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
    db.mcq.findMany({
      take: limit,
      skip,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      where,
      select: safeQuestionBankMcqSelect,
      orderBy,
    }),
    db.mcq.count({ where }),
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

/**
 * Get aggregate statistics for active MCQs in the question bank.
 * Optionally scoped to a subject or chapter.
 */
export async function getQuestionBankStats(
  db: PrismaClient,
  input?: QuestionBankStatsInput,
) {
  const baseWhere = {
    isActive: true,
    ...(input?.subjectId ? { subjectId: input.subjectId } : {}),
    ...(input?.chapterId ? { chapterId: input.chapterId } : {}),
  }

  const [totalCount, mathCount, typesGroup, subjectGroup] = await Promise.all([
    db.mcq.count({ where: baseWhere }),
    db.mcq.count({ where: { ...baseWhere, isMath: true } }),
    db.mcq.groupBy({
      by: ["type"],
      where: baseWhere,
      _count: { id: true },
    }),
    db.mcq.groupBy({
      by: ["subjectId"],
      where: baseWhere,
      _count: { id: true },
    }),
  ])

  const typeCounts = typesGroup.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = item._count.id
    return acc
  }, {})

  const subjectCounts = subjectGroup.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.subjectId] = item._count.id
      return acc
    },
    {},
  )

  return {
    totalCount,
    mathCount,
    nonMathCount: totalCount - mathCount,
    typeCounts,
    subjectCounts,
  }
}

/**
 * Get a single active MCQ by ID (full detail including subject + chapter).
 */
export async function getQuestionBankMcqById(
  db: PrismaClient,
  input: GetQuestionBankMcqInput,
) {
  const item = await db.mcq.findUnique({
    where: { id: input.id, isActive: true },
    select: safeQuestionBankMcqSelect,
  })

  if (!item) throw notFound("MCQ")
  return item
}

/**
 * Get MCQ counts grouped by chapter for a given subject.
 * Useful for the chapter drill-down sidebar in the question bank.
 */
export async function getQuestionBankByChapter(
  db: PrismaClient,
  input: QuestionBankByChapterInput,
) {
  const chapterCounts = await db.mcq.groupBy({
    by: ["chapterId"],
    where: {
      subjectId: input.subjectId,
      isActive: true,
    },
    _count: { id: true },
  })

  // Fetch chapter details for names
  const chapterIds = chapterCounts.map((c) => c.chapterId)

  const chapters = await db.chapter.findMany({
    where: { id: { in: chapterIds } },
    select: {
      id: true,
      name: true,
      nameBn: true,
      position: true,
    },
    orderBy: { position: "asc" },
  })

  const countMap = chapterCounts.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.chapterId] = item._count.id
      return acc
    },
    {},
  )

  return chapters.map((chapter) => ({
    ...chapter,
    mcqCount: countMap[chapter.id] ?? 0,
  }))
}
