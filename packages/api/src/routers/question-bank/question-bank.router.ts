/**
 * Question Bank sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `question-bank.service.ts`. No raw DB calls here.
 *
 * All procedures are protected (require an authenticated session).
 * The question bank is read-only: no mutations are exposed here.
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  getQuestionBankMcqSchema,
  listQuestionBankSchema,
  questionBankByChapterSchema,
  questionBankStatsSchema,
} from "./question-bank.schema"
import {
  getQuestionBankByChapter,
  getQuestionBankMcqById,
  getQuestionBankStats,
  listQuestionBankMcqs,
} from "./question-bank.service"

export const questionBankRouter = createTRPCRouter({
  /**
   * Fetch aggregate statistics for the question bank
   * (total active MCQs, type breakdown, subject breakdown).
   * Optionally scoped to a subject or chapter.
   */
  stats: protectedProcedure
    .input(questionBankStatsSchema.optional())
    .query(({ input }) => getQuestionBankStats(db, input)),

  /**
   * List active MCQs with pagination, subject/chapter/type/isMath
   * filtering, and full-text search across question/explanation/context.
   */
  list: protectedProcedure
    .input(listQuestionBankSchema)
    .query(({ input }) => listQuestionBankMcqs(db, input)),

  /**
   * Fetch a single active MCQ by ID (including subject and chapter relations).
   */
  byId: protectedProcedure
    .input(getQuestionBankMcqSchema)
    .query(({ input }) => getQuestionBankMcqById(db, input)),

  /**
   * Get MCQ counts grouped by chapter for a given subject.
   * Powers the chapter drill-down sidebar in the question bank UI.
   */
  byChapter: protectedProcedure
    .input(questionBankByChapterSchema)
    .query(({ input }) => getQuestionBankByChapter(db, input)),
})
