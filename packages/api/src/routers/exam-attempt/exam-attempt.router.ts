/**
 * Exam Attempt sub-router (student-facing).
 *
 * Thin tRPC layer — validates input with Zod schemas, then delegates
 * business logic to `exam-attempt.service.ts`. No raw DB calls here.
 *
 * All procedures are protected (require an authenticated session).
 * The student is resolved from `ctx.session.user.id` inside the service.
 */
import { createTRPCRouter, studentProcedure } from "../../trpc"
import {
  createAttemptSchema,
  getAttemptResultSchema,
  getExamForAttemptSchema,
  listAvailableExamsSchema,
  listMyAttemptsSchema,
  submitAnswerSchema,
  submitExamSchema,
  trackTabSwitchSchema,
  updateActivitySchema,
} from "./exam-attempt.schema"
import {
  createAttempt,
  getAttemptResult,
  getExamForAttempt,
  listAvailableExams,
  listMyAttempts,
  submitAnswer,
  submitExam,
  trackTabSwitch,
  updateActivity,
} from "./exam-attempt.service"

export const examAttemptRouter = createTRPCRouter({
  /**
   * List published exams available for the current student.
   */
  availableExams: studentProcedure
    .input(listAvailableExamsSchema)
    .query(({ ctx, input }) =>
      listAvailableExams(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Get exam details with MCQs for the exam-taking UI.
   * Returns existing attempt + answer history if resuming.
   */
  getForAttempt: studentProcedure
    .input(getExamForAttemptSchema)
    .query(({ ctx, input }) =>
      getExamForAttempt(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Start a new exam attempt (or resume an existing one).
   */
  create: studentProcedure
    .input(createAttemptSchema)
    .mutation(({ ctx, input }) =>
      createAttempt(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Submit or update a single answer during the exam.
   */
  submitAnswer: studentProcedure
    .input(submitAnswerSchema)
    .mutation(({ ctx, input }) =>
      submitAnswer(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Final submission of the exam attempt with score calculation.
   */
  submit: studentProcedure
    .input(submitExamSchema)
    .mutation(({ ctx, input }) =>
      submitExam(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * View full attempt result with all answers and MCQ details.
   */
  result: studentProcedure
    .input(getAttemptResultSchema)
    .query(({ ctx, input }) =>
      getAttemptResult(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * List the current student's past exam attempts.
   */
  myAttempts: studentProcedure
    .input(listMyAttemptsSchema)
    .query(({ ctx, input }) =>
      listMyAttempts(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Track a tab switch event (anti-cheat).
   */
  trackTabSwitch: studentProcedure
    .input(trackTabSwitchSchema)
    .mutation(({ ctx, input }) =>
      trackTabSwitch(ctx.db, ctx.session.user.id, input),
    ),

  /**
   * Update last activity timestamp (heartbeat).
   */
  updateActivity: studentProcedure
    .input(updateActivitySchema)
    .mutation(({ ctx, input }) =>
      updateActivity(ctx.db, ctx.session.user.id, input),
    ),
})
