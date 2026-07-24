import { EditExamPage } from "@/modules/exam/pages/edit-exam-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditExamRoute({ params }: PageProps) {
  const { id } = await params
  return <EditExamPage examId={id} />
}
