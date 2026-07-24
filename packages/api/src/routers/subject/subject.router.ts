/**
 * Subject sub-router.
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `subject.service.ts`. No raw DB calls here.
 *
 * All procedures are protected (require an authenticated session).
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  assignAcademicClassesSchema,
  createSubjectSchema,
  deleteSubjectSchema,
  getSubjectSchema,
  listSubjectsSchema,
  subjectForSelectionSchema,
  updateSubjectSchema,
} from "./subject.schema"
import {
  assignAcademicClassesToSubject,
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjectsForSelection,
  getSubjectStats,
  listSubjects,
  updateSubject,
} from "./subject.service"

export const subjectRouter = createTRPCRouter({
  /**
   * Fetch summary statistics for subjects (total count, active levels count, active groups count).
   */
  stats: protectedProcedure.query(() => getSubjectStats(db)),

  /**
   * List subjects with pagination, level/group/academicClass filtering, and search query.
   */
  list: protectedProcedure
    .input(listSubjectsSchema)
    .query(({ input }) => listSubjects(db, input)),

  /**
   * Fetch a single subject by id (including academic class relationships and chapter counts).
   */
  byId: protectedProcedure
    .input(getSubjectSchema)
    .query(({ input }) => getSubjectById(db, input)),

  /**
   * Fetch subjects formatted for select inputs/dropdowns.
   */
  forSelection: protectedProcedure
    .input(subjectForSelectionSchema)
    .query(({ input }) => getSubjectsForSelection(db, input)),

  /**
   * Create a new subject record with optional academic class assignments.
   */
  create: protectedProcedure
    .input(createSubjectSchema)
    .mutation(({ input }) => createSubject(db, input)),

  /**
   * Update an existing subject record.
   */
  update: protectedProcedure
    .input(updateSubjectSchema)
    .mutation(({ input }) => updateSubject(db, input)),

  /**
   * Permanently delete a subject record and its academic class junction links.
   */
  delete: protectedProcedure
    .input(deleteSubjectSchema)
    .mutation(({ input }) => deleteSubject(db, input)),

  /**
   * Assign or update academic class relations for a subject.
   */
  assignAcademicClasses: protectedProcedure
    .input(assignAcademicClassesSchema)
    .mutation(({ input }) => assignAcademicClassesToSubject(db, input)),
})
