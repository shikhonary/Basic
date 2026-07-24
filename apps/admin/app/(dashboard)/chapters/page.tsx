import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { ChapterListPage } from "@/modules/chapter/pages/chapter-list-page"

export default async function ChaptersRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.chapter.stats.queryOptions())

  return (
    <HydrateClient>
      <ChapterListPage />
    </HydrateClient>
  )
}
