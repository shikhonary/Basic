"use client"

import React from "react"
import {
  User,
  GraduationCap,
  BadgeCheck,
  AlertTriangle,
  Edit3,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useCurrentUser } from "@/modules/user/services/use-user"
import { ProfileImageUploader } from "./profile-image-uploader"

interface ProfileHeaderProps {
  studentProfile: any
  onEditClick: () => void
}

export function ProfileHeader({ studentProfile, onEditClick }: ProfileHeaderProps) {
  const { user, isVerified } = useCurrentUser()

  const displayName = studentProfile?.nameBn || studentProfile?.name || user?.name || "শিক্ষার্থী"
  const englishName = studentProfile?.name || user?.name || ""
  const studentId = studentProfile?.studentId ? `#${studentProfile.studentId}` : "নতুন শিক্ষার্থী"
  const className = studentProfile?.academicClass?.nameBn || "ক্লাস নির্ধারিত হয়নি"

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-white shadow-xl shadow-primary/15">
      {/* Background shapes & ambient glows */}
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar container with UploadThing uploader */}
            <div className="relative shrink-0 flex flex-col items-center">
              <ProfileImageUploader
                imageUrl={studentProfile?.imageUrl || user?.image}
                name={displayName}
                size="lg"
              />
              <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-400 text-primary font-bold px-2 py-0.5 text-xs shadow-md">
                {studentId}
              </span>
            </div>

            {/* Student Name & Academic Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                  {className}
                </span>

                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                    ভেরিফাইড অ্যাকাউন্ট
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    ভেরিফিকেশন প্রয়োজন
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  {displayName}
                </h1>
                {englishName && englishName !== displayName && (
                  <p className="text-sm text-white/80 font-medium">
                    {englishName}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/85 pt-1">
                {user?.phoneNumber && (
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    <Phone className="h-3.5 w-3.5 text-amber-300" />
                    {user.phoneNumber}
                  </span>
                )}
                {user?.email && !user.email.endsWith("@phone.bec.local") && (
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    <Mail className="h-3.5 w-3.5 text-sky-300" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex shrink-0 items-center">
            <Button
              onClick={onEditClick}
              variant="secondary"
              className="h-11 rounded-xl bg-white !text-primary hover:bg-amber-50 font-bold px-5 shadow-md active:scale-95 transition-all gap-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>তথ্য সম্পাদনা করুন</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
