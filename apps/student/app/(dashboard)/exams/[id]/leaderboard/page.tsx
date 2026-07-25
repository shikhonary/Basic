import { ExamLeaderboardView } from "@/modules/exam/components/exam-leaderboard-view"

interface ExamLeaderboardPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ExamLeaderboardPage({ params }: ExamLeaderboardPageProps) {
  const { id } = await params
  return <ExamLeaderboardView examId={id} />
}
