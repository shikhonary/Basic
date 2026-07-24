import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { McqListPage } from "@/modules/mcq/pages/mcq-list-page"

export default async function McqsRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.mcq.stats.queryOptions())

  return (
    <HydrateClient>
      <McqListPage />
    </HydrateClient>
  )
}
