/**
 * ExamGroup sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `exam-group.service.ts`.
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  addExamGroupItemSchema,
  bulkDeleteExamGroupsSchema,
  calculateExamGroupResultsSchema,
  createExamGroupSchema,
  deleteExamGroupSchema,
  examGroupStatsSchema,
  getExamGroupSchema,
  getStudentExamGroupResultSchema,
  listExamGroupResultsSchema,
  listExamGroupsSchema,
  removeExamGroupItemSchema,
  reorderExamGroupItemsSchema,
  togglePublishExamGroupSchema,
  updateExamGroupItemSchema,
  updateExamGroupSchema,
} from "./exam-group.schema"
import {
  addExamGroupItem,
  bulkDeleteExamGroups,
  calculateExamGroupResults,
  createExamGroup,
  deleteExamGroup,
  getExamGroupById,
  getExamGroupStats,
  getStudentExamGroupResult,
  listExamGroupResults,
  listExamGroups,
  removeExamGroupItem,
  reorderExamGroupItems,
  togglePublishExamGroup,
  updateExamGroup,
  updateExamGroupItem,
} from "./exam-group.service"

export const examGroupRouter = createTRPCRouter({
  /**
   * Fetch aggregate statistics for exam groups.
   */
  stats: protectedProcedure
    .input(examGroupStatsSchema.optional())
    .query(({ input }) => getExamGroupStats(db, input)),

  /**
   * List exam groups with search, filtering, and pagination.
   */
  list: protectedProcedure
    .input(listExamGroupsSchema)
    .query(({ input }) => listExamGroups(db, input)),

  /**
   * Get single exam group details by ID (including attached items and exams).
   */
  byId: protectedProcedure
    .input(getExamGroupSchema)
    .query(({ input }) => getExamGroupById(db, input)),

  /**
   * Create a new exam group.
   */
  create: protectedProcedure
    .input(createExamGroupSchema)
    .mutation(({ input }) => createExamGroup(db, input)),

  /**
   * Update an existing exam group metadata.
   */
  update: protectedProcedure
    .input(updateExamGroupSchema)
    .mutation(({ input }) => updateExamGroup(db, input)),

  /**
   * Delete an exam group by ID.
   */
  delete: protectedProcedure
    .input(deleteExamGroupSchema)
    .mutation(({ input }) => deleteExamGroup(db, input)),

  /**
   * Delete multiple exam groups by IDs.
   */
  bulkDelete: protectedProcedure
    .input(bulkDeleteExamGroupsSchema)
    .mutation(({ input }) => bulkDeleteExamGroups(db, input)),

  /**
   * Toggle publication status of an exam group.
   */
  togglePublish: protectedProcedure
    .input(togglePublishExamGroupSchema)
    .mutation(({ input }) => togglePublishExamGroup(db, input)),

  /**
   * Add an exam into an exam group.
   */
  addItem: protectedProcedure
    .input(addExamGroupItemSchema)
    .mutation(({ input }) => addExamGroupItem(db, input)),

  /**
   * Update an exam group item (position, weightage, requirement).
   */
  updateItem: protectedProcedure
    .input(updateExamGroupItemSchema)
    .mutation(({ input }) => updateExamGroupItem(db, input)),

  /**
   * Remove an exam from an exam group.
   */
  removeItem: protectedProcedure
    .input(removeExamGroupItemSchema)
    .mutation(({ input }) => removeExamGroupItem(db, input)),

  /**
   * Reorder exams in an exam group.
   */
  reorderItems: protectedProcedure
    .input(reorderExamGroupItemsSchema)
    .mutation(({ input }) => reorderExamGroupItems(db, input)),

  /**
   * Core Calculation Engine: Calculate combined marks, percentages, and merit ranks.
   */
  calculateResults: protectedProcedure
    .input(calculateExamGroupResultsSchema)
    .mutation(({ input }) => calculateExamGroupResults(db, input)),

  /**
   * Get calculated merit list / leaderboard results for an exam group.
   */
  listResults: protectedProcedure
    .input(listExamGroupResultsSchema)
    .query(({ input }) => listExamGroupResults(db, input)),

  /**
   * Get detailed combined performance and exam breakdown for a specific student.
   */
  getStudentResult: protectedProcedure
    .input(getStudentExamGroupResultSchema)
    .query(async ({ ctx, input }) => {
      // If studentId is not explicitly passed, infer it from session if available
      let targetStudentId = input.studentId
      if (!targetStudentId) {
        const student = await db.student.findFirst({
          where: { userId: ctx.session.user.id },
          select: { id: true },
        })
        if (!student) {
          throw new Error("Student profile not found for current user")
        }
        targetStudentId = student.id
      }
      return getStudentExamGroupResult(db, {
        examGroupId: input.examGroupId,
        studentId: targetStudentId,
      })
    }),
})
