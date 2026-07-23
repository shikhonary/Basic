"use client"

import type { UserStats } from "../types"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress, ProgressIndicator, ProgressTrack } from "@workspace/ui/components/progress"

interface UserStatsCardsProps {
  stats: UserStats
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {/* Total Users */}
      <Card className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
        <CardContent className="p-0">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline mb-1 font-semibold">
            Total Users
          </p>
          <div className="flex items-end gap-2">
            <span className="font-headline text-[32px] font-bold text-on-surface leading-none">
              {stats.totalUsers.toLocaleString()}
            </span>
            <span className="font-body-md text-emerald-600 text-[14px] mb-1 flex items-center font-medium">
              {stats.totalUsersChange}{" "}
              <span
                className="material-symbols-outlined text-[16px] ml-0.5"
                data-icon="trending_up"
              >
                trending_up
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Verified Teachers */}
      <Card className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
        <CardContent className="p-0">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline mb-1 font-semibold">
            Verified Teachers
          </p>
          <div className="flex items-end gap-2">
            <span className="font-headline text-[32px] font-bold text-on-surface leading-none">
              {stats.verifiedTeachers}
            </span>
            <span className="font-body-md text-outline text-[14px] mb-1 font-medium">
              Faculty
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
        <CardContent className="p-0">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline mb-1 font-semibold">
            Pending Requests
          </p>
          <div className="flex items-end gap-2">
            <span className="font-headline text-[32px] font-bold text-amber-600 leading-none">
              {stats.pendingRequests}
            </span>
            <span className="font-body-md text-outline text-[14px] mb-1 font-medium">
              Action needed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
        <CardContent className="p-0">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline mb-1 font-semibold">
            System Health
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
              <Progress value={stats.systemHealth} className="h-full w-full bg-transparent gap-0">
                <ProgressTrack className="h-full w-full bg-surface-container-highest rounded-full">
                  <ProgressIndicator
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.systemHealth}%` }}
                  />
                </ProgressTrack>
              </Progress>
            </div>
            <span className="font-body-md text-on-surface font-semibold text-[14px]">
              {stats.systemHealth}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
