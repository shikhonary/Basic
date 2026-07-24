import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { SubjectListPage } from "@/modules/subject/pages/subject-list-page"

export default async function SubjectsRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.subject.stats.queryOptions())

  return (
    <HydrateClient>
      <SubjectListPage />
    </HydrateClient>
  )
}
