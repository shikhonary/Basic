"use client"

import React, { useState } from "react"
import { useStudentProfile } from "@/modules/profile/services/use-profile"
import { ProfileHeader } from "@/modules/profile/components/profile-header"
import { ProfileStats } from "@/modules/profile/components/profile-stats"
import { ProfileInfoTabs } from "@/modules/profile/components/profile-info-tabs"
import { ProfileEditForm } from "@/modules/profile/components/profile-edit-form"
import { ProfileEmptyState } from "@/modules/profile/components/profile-empty-state"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function ProfilePage() {
  const { data: studentProfile, isLoading } = useStudentProfile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4 px-2 sm:px-4">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4 px-2 sm:px-4">
      {!studentProfile ? (
        <ProfileEmptyState onCreateClick={() => setIsEditModalOpen(true)} />
      ) : (
        <>
          {/* Header Hero Section */}
          <ProfileHeader
            studentProfile={studentProfile}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          {/* Quick Metrics Grid */}
          <ProfileStats studentProfile={studentProfile} />

          {/* Detailed Info Tabs */}
          <ProfileInfoTabs studentProfile={studentProfile} />
        </>
      )}

      {/* Profile Edit Dialog */}
      <ProfileEditForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        studentProfile={studentProfile}
      />
    </div>
  )
}
