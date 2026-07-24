/**
 * Student sub-router.
 *
 * Validates input with Zod schemas and delegates business logic to `student.service.ts`.
 */
import { db } from "@workspace/db/main"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { completeStudentOnboardingSchema } from "./student.schema"
import {
  completeStudentOnboarding,
  getStudentByUserId,
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
})
