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
  const studentGroup = "Commerce" // Commerce student
  const targetClassId = "9f270921-2827-46ef-b921-8f553a29b3a0" // Let's search class 9

  console.log(`Running test query for student group: "${studentGroup}"`)

  const where = {
    status: "Published",
    AND: [
      {
        OR: [
          { examGroupItems: { none: {} } },
          { examGroupItems: { some: { examGroup: { group: null } } } },
          { examGroupItems: { some: { examGroup: { group: studentGroup } } } }
        ],
      }
    ]
  }

  const exams = await prisma.exam.findMany({
    where,
    select: {
      id: true,
      title: true,
      examGroupItems: {
        select: {
          examGroup: {
            select: {
              title: true,
              group: true
            }
          }
        }
      }
    }
  })

  console.log(`Found ${exams.length} exams:`)
  for (const e of exams) {
    const groupsInfo = e.examGroupItems.map(i => `[${i.examGroup.title} (${i.examGroup.group})]`).join(", ")
    console.log(`- "${e.title}" (Groups: ${groupsInfo || "None (Standalone)"})`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
