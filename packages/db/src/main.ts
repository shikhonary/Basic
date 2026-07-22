import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/main/client"

export type { PrismaClient, Role, User } from "../generated/main/client"

const globalForPrisma = globalThis as unknown as {
  mainDb: PrismaClient | undefined
}

function createMainDb() {
  if (!process.env.MAIN_DATABASE_URL) {
    throw new Error("MAIN_DATABASE_URL is not set in the environment")
  }
  const adapter = new PrismaPg({
    connectionString: process.env.MAIN_DATABASE_URL,
  })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.mainDb ?? createMainDb()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.mainDb = db
}
