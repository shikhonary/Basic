import { Prisma } from "../../generated/tenant/client"

export const withTenant = (tenantId: string) =>
  Prisma.defineExtension((client) => {
    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // The Tenant model itself doesn't have a tenantId, it IS the tenant.
            // Other models in the tenant schema will have a tenantId.
            if (model === "Tenant") {
              return query(args)
            }

            // For all other operations on tenant models, enforce the tenantId.
            if (
              operation === "findUnique" ||
              operation === "findFirst" ||
              operation === "findMany" ||
              operation === "count" ||
              operation === "update" ||
              operation === "updateMany" ||
              operation === "delete" ||
              operation === "deleteMany"
            ) {
              const anyArgs = args as any
              anyArgs.where = { ...anyArgs.where, tenantId }
            } else if (
              operation === "create" ||
              operation === "createMany" ||
              operation === "upsert"
            ) {
              const anyArgs = args as any
              if (operation === "create") {
                anyArgs.data = { ...anyArgs.data, tenantId }
              } else if (operation === "createMany") {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((d: any) => ({
                    ...d,
                    tenantId,
                  }))
                } else {
                  anyArgs.data = { ...anyArgs.data, tenantId }
                }
              } else if (operation === "upsert") {
                anyArgs.where = { ...anyArgs.where, tenantId }
                anyArgs.create = { ...anyArgs.create, tenantId }
              }
            }

            return query(args)
          },
        },
      },
    })
  })
