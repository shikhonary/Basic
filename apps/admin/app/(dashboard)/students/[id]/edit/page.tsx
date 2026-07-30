import { EditStudentPage } from "@/modules/student/pages/edit-student-page"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentEditRoutePage({ params }: PageProps) {
  const { id } = await params
  return <EditStudentPage studentId={id} />
}
