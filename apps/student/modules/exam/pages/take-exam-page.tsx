import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { TakeExamView } from "../components/take-exam-view"

interface TakeExamPageProps {
  examId: string
}

export async function TakeExamPage({ examId }: TakeExamPageProps) {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.examAttempt.getForAttempt.queryOptions({ examId }),
  )

  return (
    <HydrateClient>
      <TakeExamView examId={examId} />
    </HydrateClient>
  )
}
