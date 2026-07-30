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
  console.log("Running update-students-group script...")
  
  // Find count of students before update
  const totalStudents = await prisma.student.count()
  console.log(`Total student records in database: ${totalStudents}`)

  if (totalStudents === 0) {
    console.log("No student records found to update.")
    return
  }

  // Update all students' group value to Science
  console.log("Updating group value to 'Science' for all students...")
  const result = await prisma.student.updateMany({
    data: {
      group: "Science",
    },
  })

  console.log(`Successfully updated ${result.count} students group value to 'Science'.`)
}

main()
  .catch((e) => {
    console.error("Error running update-students-group script:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
