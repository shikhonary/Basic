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
  console.log("Starting Exam.group to ExamGroup migration script...")

  // Fetch all exams with group value set
  const examsWithGroups = await prisma.exam.findMany({
    where: {
      group: {
        not: null,
      },
    },
    include: {
      academicClass: true,
      examGroupItems: true,
    },
  })

  console.log(`Found ${examsWithGroups.length} exams with a specified group.`)

  let skippedCount = 0
  let linkedCount = 0
  let groupsCreatedCount = 0

  for (const exam of examsWithGroups) {
    if (!exam.group) continue

    // 1. Check if the exam is already associated with any exam group
    if (exam.examGroupItems.length > 0) {
      console.log(`[SKIPPED] Exam "${exam.title}" (${exam.id}) is already in ${exam.examGroupItems.length} exam groups.`)
      skippedCount++
      continue
    }

    // 2. Try to find an existing exam group with the same academicClassId and group value
    let examGroup = await prisma.examGroup.findFirst({
      where: {
        group: exam.group,
        academicClassId: exam.academicClassId,
        type: "MODEL_TEST",
      },
    })

    if (!examGroup) {
      // 3. Create a new ExamGroup if it doesn't exist yet
      const className = exam.academicClass?.nameEn || "Global"
      const groupTitle = `${exam.group} Group Exam Series - ${className}`
      
      console.log(`[CREATING GROUP] Creating new ExamGroup "${groupTitle}" for class ${className} and group ${exam.group}`)
      
      examGroup = await prisma.examGroup.create({
        data: {
          title: groupTitle,
          type: "MODEL_TEST",
          group: exam.group,
          academicClassId: exam.academicClassId,
          isPublished: false,
          description: `Automatically created during database migration to group-based exams for the ${exam.group} group.`,
        },
      })
      groupsCreatedCount++
    }

    // 4. Link the exam to the exam group
    console.log(`[LINKING] Linking Exam "${exam.title}" (${exam.id}) to ExamGroup "${examGroup.title}" (${examGroup.id})`)
    await prisma.examGroupItem.create({
      data: {
        examGroupId: examGroup.id,
        examId: exam.id,
        position: 0,
        weightage: 100.0,
        isRequired: true,
      },
    })
    linkedCount++
  }

  console.log("\nMigration completed summary:")
  console.log(`- Total exams inspected: ${examsWithGroups.length}`)
  console.log(`- Exams skipped (already linked): ${skippedCount}`)
  console.log(`- New ExamGroups created: ${groupsCreatedCount}`)
  console.log(`- Exams linked to groups: ${linkedCount}`)
}

main()
  .catch((e) => {
    console.error("Error running migration script:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
