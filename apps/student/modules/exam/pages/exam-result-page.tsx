import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { ExamResultView } from "../components/exam-result-view"

interface ExamResultPageProps {
  attemptId: string
}

export async function ExamResultPage({ attemptId }: ExamResultPageProps) {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.examAttempt.result.queryOptions({ attemptId }),
  )

  return (
    <HydrateClient>
      <ExamResultView attemptId={attemptId} />
    </HydrateClient>
  )
}
