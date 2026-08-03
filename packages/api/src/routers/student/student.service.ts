/**
 * Student domain — business logic service.
 *
 * All database queries for student onboarding, profile, and CRUD live here.
 */
import type { PrismaClient } from "@workspace/db/main"
import { TRPCError } from "@trpc/server"
import type {
  CompleteStudentOnboardingInput,
  ListStudentsInput,
  CreateStudentInput,
  UpdateStudentInput,
  GetStudentInput,
  DeleteStudentInput,
} from "./student.schema"
import { safeStudentSelect } from "./student.schema"
import { badRequest, notFound } from "../../utils/errors"

/**
 * Get student profile associated with the authenticated user ID.
 */
export async function getStudentByUserId(db: PrismaClient, userId: string) {
  const student = await db.student.findUnique({
    where: { userId },
    select: safeStudentSelect,
  })
  if (!student) return null
  return {
    ...student,
    imageUrl: student.user?.image ?? null,
  }
}

/**
 * Complete or update student onboarding profile.
 */
export async function completeStudentOnboarding(
  db: PrismaClient,
  userId: string,
  input: CompleteStudentOnboardingInput
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
          isProfileConfirmed: true,
        },
        select: safeStudentSelect,
      })
    } else {
      // Create new student profile linked to userId
      studentProfile = await db.student.create({
        data: {
          ...input,
          userId,
          isProfileConfirmed: true,
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
          connect: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })

    return {
      ...studentProfile,
      imageUrl: studentProfile.user?.image ?? null,
    }
  } catch (err: any) {
    if (err instanceof TRPCError) throw err
    console.error("[completeStudentOnboarding] Error:", err)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Failed to complete student onboarding",
    })
  }
}

/**
 * Update existing student profile and sync user fields (for self-update).
 */
export async function updateStudentProfile(
  db: PrismaClient,
  userId: string,
  input: Partial<CompleteStudentOnboardingInput>
) {
  const existingStudent = await db.student.findUnique({
    where: { userId },
  })

  if (!existingStudent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student profile not found for this user",
    })
  }

  if (input.academicClassId) {
    const classExists = await db.academicClass.findUnique({
      where: { id: input.academicClassId },
    })
    if (!classExists) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Selected academic class does not exist",
      })
    }
  }

  const updatedStudent = await db.student.update({
    where: { id: existingStudent.id },
    data: input,
    select: safeStudentSelect,
  })

  // Sync user name if updated
  if (input.name) {
    await db.user.update({
      where: { id: userId },
      data: { name: input.name },
    })
  }

  return {
    ...updatedStudent,
    imageUrl: updatedStudent.user?.image ?? null,
  }
}

// ---------------------------------------------------------------------------
// Student CRUD Operations (Admin-facing)
// ---------------------------------------------------------------------------

/**
 * List students with filtering and pagination.
 */
export async function listStudents(db: PrismaClient, input: ListStudentsInput) {
  const limit = input.limit ?? 20
  const page = input.page ?? 1
  const skip = (page - 1) * limit

  const where: any = {}

  if (input.query) {
    where.OR = [
      { name: { contains: input.query, mode: "insensitive" } },
      { phone: { contains: input.query, mode: "insensitive" } },
      { institute: { contains: input.query, mode: "insensitive" } },
    ]
  }

  if (input.academicClassId) {
    where.academicClassId = input.academicClassId
  }

  if (input.isOfflineStudent !== undefined) {
    where.isOfflineStudent = input.isOfflineStudent
  }

  if (input.isLinkedToUser !== undefined) {
    if (input.isLinkedToUser) {
      where.userId = { not: null }
    } else {
      where.userId = null
    }
  }

  let orderBy: any = { createdAt: "desc" }
  switch (input.sort) {
    case "name_asc":
      orderBy = { name: "asc" }
      break
    case "name_desc":
      orderBy = { name: "desc" }
      break
    case "roll_asc":
      orderBy = { roll: "asc" }
      break
    case "roll_desc":
      orderBy = { roll: "desc" }
      break
    case "newest":
      orderBy = { createdAt: "desc" }
      break
    case "oldest":
      orderBy = { createdAt: "asc" }
      break
    default:
      orderBy = { createdAt: "desc" }
  }

  const [items, totalItems] = await Promise.all([
    db.student.findMany({
      take: limit,
      skip,
      where,
      select: safeStudentSelect,
      orderBy,
    }),
    db.student.count({ where }),
  ])

  const mappedItems = items.map((item) => ({
    ...item,
    imageUrl: item.user?.image ?? null,
  }))

  return {
    items: mappedItems,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
    page,
    limit,
  }
}

/**
 * Fetch statistics summary for students.
 */
export async function getStudentStats(db: PrismaClient) {
  const [totalStudentsCount, offlineStudentsCount, onlineStudentsCount, linkedStudentsCount] = await Promise.all([
    db.student.count(),
    db.student.count({ where: { isOfflineStudent: true } }),
    db.student.count({ where: { isOfflineStudent: false } }),
    db.student.count({ where: { userId: { not: null } } }),
  ])

  return {
    totalStudentsCount,
    offlineStudentsCount,
    onlineStudentsCount,
    linkedStudentsCount,
  }
}

/**
 * Fetch a single student record by ID.
 */
export async function getStudentById(db: PrismaClient, input: GetStudentInput) {
  const student = await db.student.findUnique({
    where: { id: input.id },
    select: safeStudentSelect,
  })

  if (!student) throw notFound("Student")

  return {
    ...student,
    imageUrl: student.user?.image ?? null,
  }
}

/**
 * Create a new student record and optionally bind to a user profile.
 */
export async function createStudent(db: PrismaClient, input: CreateStudentInput) {
  const classExists = await db.academicClass.findUnique({
    where: { id: input.academicClassId },
  })

  if (!classExists) {
    throw badRequest("Selected academic class does not exist")
  }

  if (input.userId) {
    const userExists = await db.user.findUnique({
      where: { id: input.userId },
    })

    if (!userExists) {
      throw badRequest("Selected user profile does not exist")
    }

    const linkedStudent = await db.student.findUnique({
      where: { userId: input.userId },
    })

    if (linkedStudent) {
      throw badRequest("Selected user profile is already linked to another student")
    }
  }

  const student = await db.student.create({
    data: {
      name: input.name,
      phone: input.phone,
      institute: input.institute,
      roll: input.roll,
      isOfflineStudent: input.isOfflineStudent,
      academicClassId: input.academicClassId,
      userId: input.userId,
      isProfileConfirmed: true,
    },
    select: safeStudentSelect,
  })

  if (input.userId) {
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

    await db.user.update({
      where: { id: input.userId },
      data: {
        name: input.name,
        roles: {
          connect: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })
  }

  return {
    ...student,
    imageUrl: student.user?.image ?? null,
  }
}

/**
 * Update an existing student record and handle user linkage changes.
 */
export async function updateStudent(db: PrismaClient, input: UpdateStudentInput) {
  const existing = await db.student.findUnique({
    where: { id: input.id },
    select: { id: true, userId: true, name: true },
  })

  if (!existing) throw notFound("Student")

  if (input.academicClassId) {
    const classExists = await db.academicClass.findUnique({
      where: { id: input.academicClassId },
    })
    if (!classExists) {
      throw badRequest("Selected academic class does not exist")
    }
  }

  const oldUserId = existing.userId
  const newUserId = input.userId

  if (newUserId && newUserId !== oldUserId) {
    const userExists = await db.user.findUnique({
      where: { id: newUserId },
    })
    if (!userExists) {
      throw badRequest("Selected user profile does not exist")
    }

    const linkedStudent = await db.student.findUnique({
      where: { userId: newUserId },
    })
    if (linkedStudent) {
      throw badRequest("Selected user profile is already linked to another student")
    }
  }

  const updated = await db.student.update({
    where: { id: input.id },
    data: {
      name: input.name,
      phone: input.phone,
      institute: input.institute,
      roll: input.roll,
      isOfflineStudent: input.isOfflineStudent,
      academicClassId: input.academicClassId,
      userId: input.userId,
    },
    select: safeStudentSelect,
  })

  const [roleUpper, roleCapital] = await Promise.all([
    db.role.upsert({
      where: { name: "STUDENT" },
      update: {},
      create: { name: "STUDENT", description: "Enrolled student role" },
    }),
    db.role.upsert({
      where: { name: "Student" },
      update: {},
      create: { name: "Student", description: "Enrolled student role" },
    }),
  ])

  // Disconnect student roles from old user if they are being unlinked/changed
  if (oldUserId && oldUserId !== newUserId) {
    await db.user.update({
      where: { id: oldUserId },
      data: {
        roles: {
          disconnect: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })
  }

  // Connect student roles to new user if linked
  if (newUserId) {
    await db.user.update({
      where: { id: newUserId },
      data: {
        name: input.name ?? existing.name,
        roles: {
          connect: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })
  }

  return {
    ...updated,
    imageUrl: updated.user?.image ?? null,
  }
}

/**
 * Permanently delete a student record and clean up associated user roles.
 */
export async function deleteStudent(db: PrismaClient, input: DeleteStudentInput) {
  const existing = await db.student.findUnique({
    where: { id: input.id },
    select: { id: true, userId: true },
  })

  if (!existing) throw notFound("Student")

  if (existing.userId) {
    const [roleUpper, roleCapital] = await Promise.all([
      db.role.upsert({
        where: { name: "STUDENT" },
        update: {},
        create: { name: "STUDENT", description: "Enrolled student role" },
      }),
      db.role.upsert({
        where: { name: "Student" },
        update: {},
        create: { name: "Student", description: "Enrolled student role" },
      }),
    ])

    await db.user.update({
      where: { id: existing.userId },
      data: {
        roles: {
          disconnect: [{ id: roleUpper.id }, { id: roleCapital.id }],
        },
      },
    })
  }

  await db.student.delete({
    where: { id: input.id },
  })

  return { success: true }
}
