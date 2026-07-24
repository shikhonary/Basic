import { ExamResultPage } from "@/modules/exam/pages/exam-result-page"

interface ExamResultRouteProps {
  params: Promise<{
    id: string
    attemptId: string
  }>
}

export default async function ExamResultRoute({ params }: ExamResultRouteProps) {
  const { attemptId } = await params
  return <ExamResultPage attemptId={attemptId} />
}
