/**
 * MCQ sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `mcq.service.ts`. No raw DB calls here.
 *
 * All procedures are protected (require an authenticated session).
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  bulkDeleteMcqsSchema,
  createMcqSchema,
  deleteMcqSchema,
  getMcqSchema,
  importMcqsSchema,
  listMcqsSchema,
  mcqStatsSchema,
  toggleMcqActiveSchema,
  updateMcqSchema,
} from "./mcq.schema"
import {
  bulkDeleteMcqs,
  createMcq,
  deleteMcq,
  getMcqById,
  getMcqStats,
  importMcqs,
  listMcqs,
  toggleMcqActive,
  updateMcq,
} from "./mcq.service"

export const mcqRouter = createTRPCRouter({
  /**
   * Fetch summary statistics for MCQs (total count, active, math, type counts).
   */
  stats: protectedProcedure
    .input(mcqStatsSchema.optional())
    .query(({ input }) => getMcqStats(db, input)),

  /**
   * List MCQs with pagination, subject/chapter/type/isMath/isActive filtering, and search query.
   */
  list: protectedProcedure
    .input(listMcqsSchema)
    .query(({ input }) => listMcqs(db, input)),

  /**
   * Fetch a single MCQ by id (including subject and chapter relations).
   */
  byId: protectedProcedure
    .input(getMcqSchema)
    .query(({ input }) => getMcqById(db, input)),

  /**
   * Create a new MCQ record.
   */
  create: protectedProcedure
    .input(createMcqSchema)
    .mutation(({ input }) => createMcq(db, input)),

  /**
   * Bulk import MCQ records from JSON array.
   */
  import: protectedProcedure
    .input(importMcqsSchema)
    .mutation(({ input }) => importMcqs(db, input)),

  /**
   * Update an existing MCQ record.
   */
  update: protectedProcedure
    .input(updateMcqSchema)
    .mutation(({ input }) => updateMcq(db, input)),

  /**
   * Permanently delete a single MCQ record.
   */
  delete: protectedProcedure
    .input(deleteMcqSchema)
    .mutation(({ input }) => deleteMcq(db, input)),

  /**
   * Permanently delete multiple MCQ records by IDs.
   */
  bulkDelete: protectedProcedure
    .input(bulkDeleteMcqsSchema)
    .mutation(({ input }) => bulkDeleteMcqs(db, input)),

  /**
   * Toggle active state for an MCQ record.
   */
  toggleActive: protectedProcedure
    .input(toggleMcqActiveSchema)
    .mutation(({ input }) => toggleMcqActive(db, input)),
})
