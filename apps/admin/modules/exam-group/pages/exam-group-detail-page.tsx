"use client"

import { ExamGroupDetailView } from "../components/exam-group-detail-view"

export function ExamGroupDetailPage({ id }: { id: string }) {
  return <ExamGroupDetailView id={id} />
}
