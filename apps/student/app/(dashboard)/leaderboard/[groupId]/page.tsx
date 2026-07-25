import { ExamGroupLeaderboardPage } from "@/modules/exam/pages/exam-group-leaderboard-page"

interface LeaderboardGroupRouteProps {
  params: Promise<{
    groupId: string
  }>
}

export default async function LeaderboardGroupRoute({ params }: LeaderboardGroupRouteProps) {
  const { groupId } = await params
  return <ExamGroupLeaderboardPage groupId={groupId} />
}
