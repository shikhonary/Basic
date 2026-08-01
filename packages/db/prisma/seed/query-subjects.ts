import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/main/client.js"

const connectionString = process.env.MAIN_DATABASE_URL || process.env.DATABASE_URL
if (!connectionString) {
  console.error("ERROR: MAIN_DATABASE_URL or DATABASE_URL is not set in environment variables.")
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
      nameBn: true,
      group: true
    }
  })

  console.log(`Found ${subjects.length} subjects:`)
  for (const s of subjects) {
    console.log(`- Name: "${s.name}" (Bn: "${s.nameBn}"), Group: "${s.group}"`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
