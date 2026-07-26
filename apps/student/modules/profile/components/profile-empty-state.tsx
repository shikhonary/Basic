"use client"

import React from "react"
import { GraduationCap, UserPlus, Sparkles } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface ProfileEmptyStateProps {
  onCreateClick: () => void
}

export function ProfileEmptyState({ onCreateClick }: ProfileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-outline-variant/60 bg-surface-container-lowest p-8 sm:p-14 text-center shadow-sm max-w-2xl mx-auto my-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
        <GraduationCap className="h-10 w-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-extrabold text-on-surface">
          শিক্ষার্থী প্রোফাইল তৈরি করুন
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          আপনার অ্যাকাউন্টে এখনও শিক্ষার্থী তথ্য যুক্ত করা হয়নি। পরীক্ষা ও অন্যান্য শিক্ষা সেবা পেতে এখনই প্রোফাইল তৈরি করুন।
        </p>
      </div>

      <Button
        onClick={onCreateClick}
        className="h-12 rounded-2xl bg-primary text-white font-bold px-8 shadow-md hover:bg-primary/90 gap-2 text-base active:scale-95 transition-all"
      >
        <UserPlus className="h-5 w-5" />
        <span>প্রোফাইল তথ্য যুক্ত করুন</span>
      </Button>
    </div>
  )
}
