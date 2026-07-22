import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/main/client.js"

const connectionString = process.env.MAIN_DATABASE_URL
if (!connectionString) {
  console.error("ERROR: MAIN_DATABASE_URL is not set in environment variables.")
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Ensuring SUPER_ADMIN role exists...")
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Super administrator role",
    },
  })

  console.log("Fetching all users...")
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  })

  console.log(`Found ${users.length} users. Associating with SUPER_ADMIN role...`)

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: { id: superAdminRole.id },
        },
      },
    })
    console.log(`Assigned SUPER_ADMIN role to user: ${user.email} (${user.id})`)
  }

  console.log("Successfully associated all user accounts with SUPER_ADMIN role.")
}

main()
  .catch((e) => {
    console.error("Error associating users with SUPER_ADMIN role:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
