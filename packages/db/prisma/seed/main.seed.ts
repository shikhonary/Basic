import { PrismaClient } from "../../generated/main/client.js"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding main database...")

  await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Default standard user role",
    },
  })

  await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Super administrator role",
    },
  })

  console.log("Main database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
