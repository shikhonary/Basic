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
  console.log("Exploring all users in the database...")

  // Fetch all users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      phoneNumber: true,
      phoneNumberVerified: true,
    },
  })

  console.log(`Total users found: ${allUsers.length}`)

  // Filter users who didn't verify with either phone or email
  // i.e., both emailVerified and phoneNumberVerified are false
  const unverifiedUsers = allUsers.filter(
    (user) => !user.emailVerified && !user.phoneNumberVerified
  )

  // Also track partially verified users for complete visibility
  const partiallyVerifiedUsers = allUsers.filter(
    (user) =>
      (user.emailVerified && !user.phoneNumberVerified) ||
      (!user.emailVerified && user.phoneNumberVerified)
  )

  console.log(`\n--- Unverified Users (Neither Email nor Phone Verified): ${unverifiedUsers.length} ---`)
  for (const user of unverifiedUsers) {
    console.log(
      `- User ID: ${user.id} | Name: ${user.name || "N/A"} | Email: ${user.email} (Verified: ${user.emailVerified}) | Phone: ${user.phoneNumber || "N/A"} (Verified: ${user.phoneNumberVerified})`
    );
  }

  console.log(`\n--- Partially Verified Users (One of Email or Phone Verified): ${partiallyVerifiedUsers.length} ---`)
  for (const user of partiallyVerifiedUsers) {
    console.log(
      `- User ID: ${user.id} | Name: ${user.name || "N/A"} | Email: ${user.email} (Verified: ${user.emailVerified}) | Phone: ${user.phoneNumber || "N/A"} (Verified: ${user.phoneNumberVerified})`
    );
  }

  // Determine users to update: any user who is not fully verified (both email and phone verified)
  const usersToUpdate = allUsers.filter(
    (user) => !user.emailVerified || !user.phoneNumberVerified
  )

  if (usersToUpdate.length === 0) {
    console.log("\nAll users are already fully verified (both email and phone). No updates needed.")
    return
  }

  console.log(`\nUpdating ${usersToUpdate.length} users to set emailVerified = true and phoneNumberVerified = true...`)

  const updateResult = await prisma.user.updateMany({
    where: {
      OR: [
        { emailVerified: false },
        { phoneNumberVerified: false },
      ],
    },
    data: {
      emailVerified: true,
      phoneNumberVerified: true,
    },
  })

  console.log(`\nSuccessfully updated ${updateResult.count} user records to verified status!`)

  // Log summary of users after update
  const updatedUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      phoneNumberVerified: true,
    }
  })
  console.log(`\nVerification Status Summary after execution:`)
  console.log(`- Total users: ${updatedUsers.length}`)
  console.log(`- Fully verified users: ${updatedUsers.filter(u => u.emailVerified && u.phoneNumberVerified).length}`)
}

main()
  .catch((e) => {
    console.error("Error executing verification script:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
