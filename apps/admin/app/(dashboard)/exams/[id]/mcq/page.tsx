import { AssignMcqPage } from "@/modules/exam/pages/assign-mcq-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AssignMcqRoute({ params }: PageProps) {
  const { id } = await params
  return <AssignMcqPage examId={id} />
}
