"use client"

import React from "react"
import { GraduationCap, Hash, Layers, ShieldCheck, AlertCircle } from "lucide-react"
import { useCurrentUser } from "@/modules/user/services/use-user"

interface ProfileStatsProps {
  studentProfile: any
}

export function ProfileStats({ studentProfile }: ProfileStatsProps) {
  const { isVerified } = useCurrentUser()

  const className = studentProfile?.academicClass?.nameBn || "নির্ধারিত নয়"
  const group = studentProfile?.group ? ` (${studentProfile.group})` : ""
  const roll = studentProfile?.roll ? `#${studentProfile.roll}` : "নির্ধারিত নয়"
  const sectionShift = [
    studentProfile?.section ? `শাখা: ${studentProfile.section}` : null,
    studentProfile?.shift ? `শিফ্ট: ${studentProfile.shift}` : null,
  ].filter(Boolean).join(" • ") || "নির্ধারিত নয়"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Academic Class */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-on-surface-variant">শ্রেণী ও বিভাগ</span>
          <h4 className="font-bold text-base text-on-surface leading-snug">
            {className}{group}
          </h4>
        </div>
      </div>

      {/* Card 2: Roll Number */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Hash className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-on-surface-variant">রোল নম্বর</span>
          <h4 className="font-bold text-base text-on-surface leading-snug">
            {roll}
          </h4>
        </div>
      </div>

      {/* Card 3: Section & Shift */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-on-surface-variant">শাখা ও শিফ্ট</span>
          <h4 className="font-bold text-sm text-on-surface leading-snug">
            {sectionShift}
          </h4>
        </div>
      </div>

      {/* Card 4: Verification Status */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isVerified
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        }`}>
          {isVerified ? <ShieldCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>
        <div>
          <span className="text-xs font-medium text-on-surface-variant">ভেরিফিকেশন স্ট্যাটাস</span>
          <h4 className={`font-bold text-sm leading-snug ${
            isVerified ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
          }`}>
            {isVerified ? "সম্পূর্ণ ভেরিফাইড" : "ভেরিফিকেশন পেন্ডিং"}
          </h4>
        </div>
      </div>
    </div>
  )
}
