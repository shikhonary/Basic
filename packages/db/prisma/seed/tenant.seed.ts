import { PrismaClient } from "../../generated/tenant/client.js"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding tenant database...")
  // Add seed logic here
  console.log("Tenant database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
