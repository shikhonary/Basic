import { trpc, HydrateClient } from "@/trpc/server"
import { getQueryClient } from "@/trpc/query-client"
import { QuestionBankListPage } from "@/modules/question-bank/pages/question-bank-list-page"

export const metadata = {
  title: "Question Bank | Admin",
  description:
    "Browse, search, and filter active MCQ questions across all subjects and chapters.",
}

export default async function QuestionBankRoute() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.questionBank.stats.queryOptions())

  return (
    <HydrateClient>
      <QuestionBankListPage />
    </HydrateClient>
  )
}
