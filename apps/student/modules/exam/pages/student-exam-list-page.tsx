import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { StudentExamListView } from "../components/student-exam-list-view"

export async function StudentExamListPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.examAttempt.availableExams.queryOptions({}),
  )

  return (
    <HydrateClient>
      <StudentExamListView />
    </HydrateClient>
  )
}
