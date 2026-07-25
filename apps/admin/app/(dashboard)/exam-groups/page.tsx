import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { ExamGroupListPage } from "@/modules/exam-group/pages/exam-group-list-page"

export default async function ExamGroupsRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.examGroup.stats.queryOptions())

  return (
    <HydrateClient>
      <ExamGroupListPage />
    </HydrateClient>
  )
}
