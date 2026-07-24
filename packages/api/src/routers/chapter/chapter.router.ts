/**
 * Chapter sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `chapter.service.ts`. No raw DB calls here.
 *
 * All procedures are protected (require an authenticated session).
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  chapterForSelectionSchema,
  chapterStatsSchema,
  createChapterSchema,
  deleteChapterSchema,
  getChapterSchema,
  listChaptersSchema,
  reorderChaptersSchema,
  updateChapterSchema,
} from "./chapter.schema"
import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChaptersForSelection,
  getChapterStats,
  listChapters,
  reorderChapters,
  updateChapter,
} from "./chapter.service"

export const chapterRouter = createTRPCRouter({
  /**
   * Fetch summary statistics for chapters (total count, active subjects count).
   */
  stats: protectedProcedure
    .input(chapterStatsSchema)
    .query(({ input }) => getChapterStats(db, input)),

  /**
   * List chapters with pagination, subject filtering, and search query.
   */
  list: protectedProcedure
    .input(listChaptersSchema)
    .query(({ input }) => listChapters(db, input)),

  /**
   * Fetch a single chapter by id (including subject details).
   */
  byId: protectedProcedure
    .input(getChapterSchema)
    .query(({ input }) => getChapterById(db, input)),

  /**
   * Fetch chapters formatted for select inputs/dropdowns.
   */
  forSelection: protectedProcedure
    .input(chapterForSelectionSchema)
    .query(({ input }) => getChaptersForSelection(db, input)),

  /**
   * Create a new chapter record for a subject.
   */
  create: protectedProcedure
    .input(createChapterSchema)
    .mutation(({ input }) => createChapter(db, input)),

  /**
   * Update an existing chapter record.
   */
  update: protectedProcedure
    .input(updateChapterSchema)
    .mutation(({ input }) => updateChapter(db, input)),

  /**
   * Permanently delete a chapter record.
   */
  delete: protectedProcedure
    .input(deleteChapterSchema)
    .mutation(({ input }) => deleteChapter(db, input)),

  /**
   * Reorder chapters within a subject.
   */
  reorder: protectedProcedure
    .input(reorderChaptersSchema)
    .mutation(({ input }) => reorderChapters(db, input)),
})
