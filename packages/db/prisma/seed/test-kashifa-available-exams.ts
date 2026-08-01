import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/main/client.js"
import { getEquivalentGroups } from "../../../api/src/routers/exam-attempt/exam-attempt.service.js"

const connectionString = process.env.MAIN_DATABASE_URL || process.env.DATABASE_URL
if (!connectionString) {
  console.error("ERROR: MAIN_DATABASE_URL or DATABASE_URL is not set in environment variables.")
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const userId = "8lfVnyfIKoSXYfcGOtxYtFG7waMpwlWE" // Kashifa
  
  // Resolve student
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, name: true, academicClassId: true, group: true },
  })

  if (!student) {
    console.error("Student Kashifa not found!")
    return
  }

  console.log(`Student: "${student.name}" (ID: ${student.id})`)
  console.log(`- Academic Class ID: ${student.academicClassId}`)
  console.log(`- Group: "${student.group}"`)

  const studentGroup = student.group?.trim()
  const allowedGroups = getEquivalentGroups(studentGroup)
  console.log(`- Allowed Normalized Groups: ${JSON.stringify(allowedGroups)}`)

  const targetClassId = student.academicClassId
  const now = new Date()

  const where: any = {
    ...(targetClassId ? { academicClassId: targetClassId } : {}),
    status: "Published",
    AND: [
      {
        OR: [
          { examGroupItems: { none: {} } },
          { examGroupItems: { some: { examGroup: { group: null } } } },
          ...(allowedGroups.length > 0
            ? [{ examGroupItems: { some: { examGroup: { group: { in: allowedGroups } } } } }]
            : []),
        ],
      },
      {
        examSubjects: {
          none: {
            subject: {
              group: {
                notIn: [
                  ...allowedGroups,
                  "null",
                  "General",
                  "general",
                ],
                not: null,
              }
            }
          }
        }
      }
    ],
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

  console.log(`\nAvailable Exams for Kashifa (${exams.length} items):`)
  for (const e of exams) {
    const groupsInfo = e.examGroupItems.map(i => `[${i.examGroup.title} (${i.examGroup.group})]`).join(", ")
    console.log(`- "${e.title}" (Groups: ${groupsInfo || "None (Standalone)"})`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
