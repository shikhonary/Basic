import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@workspace/auth/server"
import { db } from "@workspace/db/main"
import { OnboardingForm } from "@/modules/onboarding/components/onboarding-form"

export const metadata = {
  title: "Student Onboarding | শিক্ষার্থী অনবোর্ডিং",
  description: "Complete your student profile to access dashboard.",
}

export default async function OnboardingPage() {
  // Resolve session server-side
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/auth/sign-in")
  }

  // Check if student profile already exists
  const studentProfile = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (studentProfile) {
    redirect("/")
  }

  return <OnboardingForm />
}
