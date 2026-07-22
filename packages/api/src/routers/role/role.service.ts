/**
 * Role domain — business logic service.
 *
 * All database queries live here, decoupled from tRPC plumbing.
 * Functions accept a typed Prisma client and return typed results.
 */
import type { PrismaClient } from "@workspace/db/main"
import type { RoleForSelectionInput } from "./role.schema"

export async function getRolesForSelection(
  db: PrismaClient,
  input?: RoleForSelectionInput,
) {
  return db.role.findMany({
    where: input?.name
      ? {
          name: {
            contains: input.name,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
