"use client"

import React from "react"
import { QuestionBankSubjectDetailView } from "../components/question-bank-subject-detail-view"

interface QuestionBankSubjectDetailPageProps {
  subjectId: string
}

export function QuestionBankSubjectDetailPage({ subjectId }: QuestionBankSubjectDetailPageProps) {
  return <QuestionBankSubjectDetailView subjectId={subjectId} />
}
