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
  const exams = await prisma.exam.findMany({
    where: {
      OR: [
        { title: { contains: "Math", mode: "insensitive" } },
        { title: { contains: "গণিত", mode: "insensitive" } }
      ]
    },
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
      },
      examSubjects: {
        select: {
          subject: {
            select: {
              name: true,
              group: true
            }
          }
        }
      }
    }
  })

  console.log(`Found ${exams.length} math/গণিত exams:`)
  for (const e of exams) {
    const groups = e.examGroupItems.map(i => `[${i.examGroup.title} (${i.examGroup.group})]`).join(", ")
    const subjects = e.examSubjects.map(s => `[${s.subject.name} (${s.subject.group})]`).join(", ")
    console.log(`- "${e.title}" (ID: ${e.id})`)
    console.log(`  Groups: ${groups || "None"}`)
    console.log(`  Subjects: ${subjects || "None"}`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
