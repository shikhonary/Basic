import { ExamGroupLeaderboardView } from "@/modules/exam/components/exam-group-leaderboard-view"

interface ExamGroupLeaderboardPageProps {
  groupId: string
}

export function ExamGroupLeaderboardPage({ groupId }: ExamGroupLeaderboardPageProps) {
  return <ExamGroupLeaderboardView groupId={groupId} />
}
