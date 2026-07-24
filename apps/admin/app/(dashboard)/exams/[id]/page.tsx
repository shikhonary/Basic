import { ExamDetailPage } from "@/modules/exam/pages/exam-detail-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExamDetailRoute({ params }: PageProps) {
  const { id } = await params
  return <ExamDetailPage examId={id} />
}
