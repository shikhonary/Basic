/**
 * Student sub-router.
 *
 * Validates input with Zod schemas and delegates business logic to `student.service.ts`.
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import {
  completeStudentOnboardingSchema,
  updateStudentProfileSchema,
  listStudentsSchema,
  createStudentSchema,
  updateStudentSchema,
  getStudentSchema,
  deleteStudentSchema,
} from "./student.schema"
import {
  completeStudentOnboarding,
  getStudentByUserId,
  updateStudentProfile,
  listStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./student.service"

export const studentRouter = createTRPCRouter({
  /**
   * Fetch current authenticated user's student profile (if onboarded).
   */
  getProfile: protectedProcedure.query(({ ctx }) => {
    return getStudentByUserId(db, ctx.session.user.id)
  }),

  /**
   * Complete student onboarding / save profile info.
   */
  completeOnboarding: protectedProcedure
    .input(completeStudentOnboardingSchema)
    .mutation(({ ctx, input }) => {
      return completeStudentOnboarding(db, ctx.session.user.id, input)
    }),

  /**
   * Update student profile.
   */
  updateProfile: protectedProcedure
    .input(updateStudentProfileSchema)
    .mutation(({ ctx, input }) => {
      return updateStudentProfile(db, ctx.session.user.id, input)
    }),

  /**
   * List all student records (Admin-facing).
   */
  list: protectedProcedure
    .input(listStudentsSchema)
    .query(({ input }) => {
      return listStudents(db, input)
    }),

  /**
   * Fetch summary statistics for student records.
   */
  stats: protectedProcedure.query(() => {
    return getStudentStats(db)
  }),

  /**
   * Fetch a single student record by ID.
   */
  byId: protectedProcedure
    .input(getStudentSchema)
    .query(({ input }) => {
      return getStudentById(db, input)
    }),

  /**
   * Create a new student profile (Admin-facing).
   */
  create: protectedProcedure
    .input(createStudentSchema)
    .mutation(({ input }) => {
      return createStudent(db, input)
    }),

  /**
   * Update an existing student profile (Admin-facing).
   */
  update: protectedProcedure
    .input(updateStudentSchema)
    .mutation(({ input }) => {
      return updateStudent(db, input)
    }),

  /**
   * Permanently delete a student profile (Admin-facing).
   */
  delete: protectedProcedure
    .input(deleteStudentSchema)
    .mutation(({ input }) => {
      return deleteStudent(db, input)
    }),
})
