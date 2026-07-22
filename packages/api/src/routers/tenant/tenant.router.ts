/**
 * Tenant sub-router.
 *
 * Thin tRPC layer for platform-level tenant management.
 * Uses `tenantProcedure` so `ctx.tenantDb` (TenantPrismaClient) is available —
 * the Tenant model lives in the tenant database schema, not the main DB.
 * Business logic lives in `tenant.service.ts`.
 */
import { createTRPCRouter, tenantProcedure } from "../../trpc"
import {
  createTenantSchema,
  deleteTenantSchema,
  getTenantBySlugSchema,
  getTenantSchema,
  listTenantsSchema,
  updateTenantSchema,
} from "./tenant.schema"
import {
  createTenant,
  deleteTenant,
  getTenantById,
  getTenantBySlug,
  listTenants,
  updateTenant,
} from "./tenant.service"

export const tenantRouter = createTRPCRouter({
  /**
   * List all tenants with cursor-based pagination.
   */
  list: tenantProcedure
    .input(listTenantsSchema)
    .query(({ ctx, input }) => listTenants(ctx.tenantDb, input)),

  /**
   * Fetch a tenant by id.
   */
  byId: tenantProcedure
    .input(getTenantSchema)
    .query(({ ctx, input }) => getTenantById(ctx.tenantDb, input)),

  /**
   * Fetch a tenant by its URL slug.
   */
  bySlug: tenantProcedure
    .input(getTenantBySlugSchema)
    .query(({ ctx, input }) => getTenantBySlug(ctx.tenantDb, input)),

  /**
   * Create a new tenant.
   */
  create: tenantProcedure
    .input(createTenantSchema)
    .mutation(({ ctx, input }) => createTenant(ctx.tenantDb, input)),

  /**
   * Update a tenant's metadata.
   */
  update: tenantProcedure
    .input(updateTenantSchema)
    .mutation(({ ctx, input }) => updateTenant(ctx.tenantDb, input)),

  /**
   * Delete a tenant (irreversible).
   */
  delete: tenantProcedure
    .input(deleteTenantSchema)
    .mutation(({ ctx, input }) => deleteTenant(ctx.tenantDb, input)),
})
