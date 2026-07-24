import { EditChapterPage } from "@/modules/chapter/pages/edit-chapter-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditChapterRoute({ params }: PageProps) {
  const { id } = await params
  return <EditChapterPage id={id} />
}
