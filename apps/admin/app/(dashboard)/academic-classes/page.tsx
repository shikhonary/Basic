import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { AcademicClassListPage } from "@/modules/academic-class/pages/academic-class-list-page"

export default async function AcademicClassesRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.academicClass.stats.queryOptions())

  return (
    <HydrateClient>
      <AcademicClassListPage />
    </HydrateClient>
  )
}
