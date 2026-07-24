import { EditSubjectPage } from "@/modules/subject/pages/edit-subject-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSubjectRoute({ params }: PageProps) {
  const { id } = await params
  return <EditSubjectPage id={id} />
}
