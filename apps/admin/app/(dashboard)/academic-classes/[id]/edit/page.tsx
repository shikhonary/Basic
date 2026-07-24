import { EditAcademicClassPage } from "@/modules/academic-class/pages/edit-academic-class-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAcademicClassRoute({ params }: PageProps) {
  const { id } = await params
  return <EditAcademicClassPage classId={id} />
}
