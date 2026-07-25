import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { ExamGroupDetailPage } from "@/modules/exam-group/pages/exam-group-detail-page"

interface ExamGroupDetailRouteProps {
  params: Promise<{
    id: string
  }>
}

export default async function ExamGroupDetailRoute({ params }: ExamGroupDetailRouteProps) {
  const { id } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.examGroup.byId.queryOptions({ id }))

  return (
    <HydrateClient>
      <ExamGroupDetailPage id={id} />
    </HydrateClient>
  )
}
