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
  console.log("--- Users and Students ---")
  const students = await prisma.student.findMany({
    include: {
      user: true,
    },
  })
  
  for (const s of students) {
    console.log(`Student: "${s.name}" (ID: ${s.id})`)
    console.log(`- Group: "${s.group}"`)
    console.log(`- User ID: ${s.userId}`)
    console.log(`- User Email: ${s.user?.email}`)
  }

  console.log("\n--- Exam Groups and Exams ---")
  const groups = await prisma.examGroup.findMany({
    include: {
      items: {
        include: {
          exam: true,
        },
      },
    },
  })

  for (const g of groups) {
    console.log(`ExamGroup: "${g.title}" (ID: ${g.id})`)
    console.log(`- Group targeting: "${g.group}"`)
    console.log(`- Exams inside:`)
    for (const item of g.items) {
      console.log(`  * Exam: "${item.exam.title}" (ID: ${item.exam.id})`)
    }
  }

  console.log("\n--- Standalone Exams (Not in any ExamGroup) ---")
  const standaloneExams = await prisma.exam.findMany({
    where: {
      examGroupItems: {
        none: {},
      },
    },
  })
  for (const e of standaloneExams) {
    console.log(`Standalone Exam: "${e.title}" (ID: ${e.id})`)
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
