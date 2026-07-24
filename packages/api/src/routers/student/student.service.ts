/**
 * Student domain — business logic service.
 *
 * All database queries for student onboarding and profile live here.
 */
import type { PrismaClient } from "@workspace/db/main"
import { TRPCError } from "@trpc/server"
import type { CompleteStudentOnboardingInput } from "./student.schema"
import { safeStudentSelect } from "./student.schema"

/**
 * Get student profile associated with the authenticated user ID.
 */
export async function getStudentByUserId(db: PrismaClient, userId: string) {
  return db.student.findUnique({
    where: { userId },
    select: safeStudentSelect,
  })
}

/**
 * Complete or update student onboarding profile.
 */
export async function completeStudentOnboarding(
  db: PrismaClient,
  userId: string,
  input: CompleteStudentOnboardingInput,
) {
  try {
    // Check if class exists
    const classExists = await db.academicClass.findUnique({
      where: { id: input.academicClassId },
    })

    if (!classExists) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Selected academic class does not exist",
      })
    }

    // Check if student profile already exists for this user
    const existingStudent = await db.student.findUnique({
      where: { userId },
    })

    let studentProfile

    if (existingStudent) {
      // Update existing student profile
      studentProfile = await db.student.update({
        where: { id: existingStudent.id },
        data: {
          ...input,
          userId,
        },
        select: safeStudentSelect,
      })
    } else {
      // Create new student profile linked to userId
      studentProfile = await db.student.create({
        data: {
          ...input,
          userId,
        },
        select: safeStudentSelect,
      })
    }

    // Ensure both "STUDENT" and "Student" roles exist and are associated with the user
    const [roleUpper, roleCapital] = await Promise.all([
      db.role.upsert({
        where: { name: "STUDENT" },
        update: {},
        create: {
          name: "STUDENT",
          description: "Enrolled student role",
        },
      }),
      db.role.upsert({
        where: { name: "Student" },
        update: {},
        create: {
          name: "Student",
          description: "Enrolled student role",
        },
      }),
    ])

    // Assign student roles to the user
    await db.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })

    return studentProfile
  } catch (err: any) {
    if (err instanceof TRPCError) throw err
    console.error("[completeStudentOnboarding] Error:", err)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Failed to complete student onboarding",
    })
  }
}
