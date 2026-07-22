import { config } from "dotenv"
import { resolve } from "node:path"
import { defineConfig } from "prisma/config"

// Explicitly load .env from the package root so this works under Turborepo
config({ path: resolve(import.meta.dirname, "../../.env") })

export default defineConfig({
  schema: resolve(import.meta.dirname, "schema.prisma"),
  migrations: {
    path: resolve(import.meta.dirname, "migrations"),
  },
  datasource: {
    url: process.env.MAIN_DATABASE_URL,
  },
})
