import { EditMcqPage } from "@/modules/mcq/pages/edit-mcq-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditMcqRoute({ params }: PageProps) {
  const { id } = await params
  return <EditMcqPage id={id} />
}
