import React from "react"
import { QuestionBankSubjectDetailPage } from "@/modules/question-bank"

interface PageProps {
  params: Promise<{
    subjectId: string
  }>
}

export default async function SubjectQuestionBankPage({ params }: PageProps) {
  const { subjectId } = await params
  return <QuestionBankSubjectDetailPage subjectId={subjectId} />
}
