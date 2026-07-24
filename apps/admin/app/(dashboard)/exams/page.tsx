import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { ExamListPage } from "@/modules/exam/pages/exam-list-page"

export default async function ExamsRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.exam.stats.queryOptions())

  return (
    <HydrateClient>
      <ExamListPage />
    </HydrateClient>
  )
}
