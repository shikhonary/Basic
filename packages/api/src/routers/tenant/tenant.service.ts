/**
 * Tenant domain — business logic service.
 *
 * The Tenant model lives in the TENANT database schema (not main).
 * All queries here use TenantPrismaClient.
 *
 * Functions accept a typed Prisma client + validated input and return
 * typed results — no tRPC dependencies, making them unit-testable.
 */
import type { TenantPrismaClient } from "@workspace/db/tenant"
import { conflict, notFound } from "../../utils/errors"
import type {
  CreateTenantInput,
  DeleteTenantInput,
  GetTenantBySlugInput,
  GetTenantInput,
  ListTenantsInput,
  UpdateTenantInput,
} from "./tenant.schema"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listTenants(
  db: TenantPrismaClient,
  input: ListTenantsInput,
) {
  const tenants = await db.tenant.findMany({
    take: input.limit,
    skip: input.cursor ? 1 : 0,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { createdAt: "desc" },
  })

  const nextCursor =
    tenants.length === input.limit
      ? tenants[tenants.length - 1]?.id
      : undefined

  return { tenants, nextCursor }
}

export async function getTenantById(
  db: TenantPrismaClient,
  input: GetTenantInput,
) {
  const tenant = await db.tenant.findUnique({ where: { id: input.id } })
  if (!tenant) throw notFound("Tenant")
  return tenant
}

export async function getTenantBySlug(
  db: TenantPrismaClient,
  input: GetTenantBySlugInput,
) {
  const tenant = await db.tenant.findUnique({ where: { slug: input.slug } })
  if (!tenant) throw notFound("Tenant")
  return tenant
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createTenant(
  db: TenantPrismaClient,
  input: CreateTenantInput,
) {
  const existing = await db.tenant.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  })
  if (existing)
    throw conflict(`Tenant with slug "${input.slug}" already exists.`)

  return db.tenant.create({ data: input })
}

export async function updateTenant(
  db: TenantPrismaClient,
  input: UpdateTenantInput,
) {
  const { id, ...data } = input
  const existing = await db.tenant.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) throw notFound("Tenant")

  return db.tenant.update({ where: { id }, data })
}

export async function deleteTenant(
  db: TenantPrismaClient,
  input: DeleteTenantInput,
) {
  const existing = await db.tenant.findUnique({
    where: { id: input.id },
    select: { id: true },
  })
  if (!existing) throw notFound("Tenant")

  await db.tenant.delete({ where: { id: input.id } })
  return { success: true }
}
