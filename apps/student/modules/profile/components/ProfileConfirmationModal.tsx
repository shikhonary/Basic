"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { toast } from "@workspace/ui/components/sonner"
import { useStudentProfile, useUpdateStudentProfile } from "../services/use-profile"
import { useCurrentUser } from "@/modules/user/services/use-user"
import { AlertCircle, Loader2, Sparkles } from "lucide-react"

export function ProfileConfirmationModal() {
  const { isVerified } = useCurrentUser()
  const { data: studentProfile, refetch: refetchProfile } = useStudentProfile()
  const updateProfileMutation = useUpdateStudentProfile()

  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    group: "",
    institute: "",
    isOfflineStudent: "false",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show modal only if verified, profile loaded, and not yet confirmed
  useEffect(() => {
    if (isVerified && studentProfile && !studentProfile.isProfileConfirmed) {
      setIsOpen(true)
      setFormData({
        group: studentProfile.group || "Science",
        institute: studentProfile.institute || "",
        isOfflineStudent: studentProfile.isOfflineStudent ? "true" : "false",
      })
    } else {
      setIsOpen(false)
    }
  }, [isVerified, studentProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!formData.institute.trim()) {
      setError("শিক্ষা প্রতিষ্ঠানের নাম প্রদান করা আবশ্যক।")
      setIsSubmitting(false)
      return
    }

    try {
      await updateProfileMutation.mutateAsync({
        group: formData.group,
        institute: formData.institute.trim(),
        isOfflineStudent: formData.isOfflineStudent === "true",
        isProfileConfirmed: true,
      })
      toast.success("প্রোফাইল তথ্য সফলভাবে নিশ্চিত করা হয়েছে!")
      setTimeout(() => {
        window.location.reload()
      }, 800)
    } catch (err: any) {
      setError(err?.message ?? "তথ্য আপডেট করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md p-4 sm:p-6 bg-surface text-on-surface border-outline-variant rounded-2xl shadow-xl max-w-[calc(100%-1.5rem)] md:max-w-md mx-auto"
      >
        <DialogHeader className="space-y-2">
          <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <Sparkles className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
          </div>
          <DialogTitle className="text-center font-bold text-base sm:text-lg md:text-xl">
            প্রোফাইল তথ্য নিশ্চিতকরণ
          </DialogTitle>
          <DialogDescription className="text-center text-[11px] sm:text-xs md:text-sm text-on-surface-variant leading-relaxed">
            ড্যাশবোর্ডে যাওয়ার আগে অনুগ্রহ করে আপনার নিচের প্রয়োজনীয় তথ্যগুলো নিশ্চিত করুন। এই তথ্যগুলো শুধুমাত্র একবারই গ্রহণ করা হবে।
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-xs sm:text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Group Selection */}
          <div className="space-y-1.5">
            <Label className="block font-label-sm text-[11px] sm:text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              আপনার গ্রুপ <span className="text-error">*</span>
            </Label>
            <div className="group relative">
              <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg pointer-events-none">
                category
              </span>
              <Select
                disabled={isSubmitting}
                value={formData.group}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, group: val }))}
              >
                <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2 sm:py-2.5 pl-9 sm:pl-10 pr-9 sm:pr-10 font-body-md text-xs sm:text-sm text-on-surface transition-all cursor-pointer focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-9 sm:h-11 justify-between">
                  <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
                  <SelectItem value="Science">বিজ্ঞান (Science)</SelectItem>
                  <SelectItem value="Commerce">ব্যবসায় শিক্ষা (Commerce)</SelectItem>
                  <SelectItem value="Humanities">মানবিক (Humanities)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 2. Institute Input */}
          <div className="space-y-1.5">
            <Label className="block font-label-sm text-[11px] sm:text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              শিক্ষা প্রতিষ্ঠান (স্কুল/কলেজ) <span className="text-error">*</span>
            </Label>
            <div className="group relative">
              <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg pointer-events-none">
                domain
              </span>
              <Input
                type="text"
                disabled={isSubmitting}
                placeholder="যেমন: মতিঝিল আইডিয়াল স্কুল এন্ড কলেজ"
                value={formData.institute}
                onChange={(e) => setFormData((prev) => ({ ...prev, institute: e.target.value }))}
                className="w-full rounded-lg border border-outline-variant py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 font-body-md text-xs sm:text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-9 sm:h-11"
                required
              />
            </div>
          </div>

          {/* 3. isOfflineStudent Radio Group */}
          <div className="space-y-2">
            <Label className="block font-label-sm text-[11px] sm:text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              আপনি কি অফলাইন ব্যাচ এ ক্লাস করেন? <span className="text-error">*</span>
            </Label>
            <RadioGroup
              disabled={isSubmitting}
              value={formData.isOfflineStudent}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, isOfflineStudent: val }))}
              className="flex items-center gap-6 mt-1 bg-white border border-outline-variant/60 rounded-lg p-2.5 px-4 h-9 sm:h-11"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="true"
                  id="offline-yes"
                  className="cursor-pointer border-outline-variant text-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="offline-yes" className="text-xs sm:text-sm font-medium cursor-pointer text-on-surface">
                  হ্যাঁ
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="false"
                  id="offline-no"
                  className="cursor-pointer border-outline-variant text-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="offline-no" className="text-xs sm:text-sm font-medium cursor-pointer text-on-surface">
                  না
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white h-10 sm:h-11 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                  নিশ্চিত করা হচ্ছে...
                </>
              ) : (
                "তথ্য নিশ্চিত করুন"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
