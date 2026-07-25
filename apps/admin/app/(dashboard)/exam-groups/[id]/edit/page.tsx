import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { EditExamGroupPage } from "@/modules/exam-group/pages/edit-exam-group-page"

interface EditExamGroupRouteProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditExamGroupRoute({ params }: EditExamGroupRouteProps) {
  const { id } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.examGroup.byId.queryOptions({ id }))

  return (
    <HydrateClient>
      <EditExamGroupPage id={id} />
    </HydrateClient>
  )
}
