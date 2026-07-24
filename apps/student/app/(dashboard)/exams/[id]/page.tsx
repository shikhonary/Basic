import { TakeExamPage } from "@/modules/exam/pages/take-exam-page"

interface TakeExamRouteProps {
  params: Promise<{
    id: string
  }>
}

export default async function TakeExamRoute({ params }: TakeExamRouteProps) {
  const { id } = await params
  return <TakeExamPage examId={id} />
}
