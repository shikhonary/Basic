"use client"

import React, { useState, useRef } from "react"
import { Camera, Loader2, User, Check, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useUploadThing } from "@/lib/uploadthing"
import { useUpdateUser } from "@/modules/user/services/use-user"
import { useCurrentUser } from "@/modules/user/services/use-user"

interface ProfileImageUploaderProps {
  imageUrl?: string | null
  name?: string | null
  size?: "sm" | "md" | "lg"
}

export function ProfileImageUploader({
  imageUrl,
  name,
  size = "lg",
}: ProfileImageUploaderProps) {
  const { user, refetch } = useCurrentUser()
  const updateUserMutation = useUpdateUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const { startUpload, isUploading } = useUploadThing("profileImage", {
    onClientUploadComplete: async (res: any) => {
      if (res && res[0]) {
        const uploadedUrl = res[0].ufsUrl || res[0].url
        try {
          if (!user?.id) throw new Error("User ID is missing")
          await updateUserMutation.mutateAsync({ id: user.id, image: uploadedUrl })
          await refetch()
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 3000)
        } catch (err: any) {
          setUploadError(err?.message ?? "ছবি সেভ করতে ব্যর্থ হয়েছে।")
        }
      }
    },
    onUploadError: (error: Error) => {
      setUploadError(error.message || "ছবি আপলোড ব্যর্থ হয়েছে।")
    },
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadError(null)
    setUploadSuccess(false)
    await startUpload(Array.from(files))
  }

  const currentImage = imageUrl || user?.image || ""
  const displayName = name || user?.name || "S"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const avatarSizeClasses =
    size === "lg"
      ? "h-24 w-24 sm:h-28 sm:w-28"
      : size === "md"
      ? "h-20 w-20"
      : "h-14 w-14"

  return (
    <div className="relative inline-block group">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Container */}
      <Avatar className={`${avatarSizeClasses} rounded-2xl border-4 border-white/20 shadow-lg shadow-black/20 bg-white/10 backdrop-blur-md`}>
        <AvatarImage src={currentImage} alt={displayName} className="object-cover" />
        <AvatarFallback className="text-2xl font-bold bg-amber-400 text-primary">
          {initials || <User className="h-10 w-10" />}
        </AvatarFallback>
      </Avatar>

      {/* Upload Overlay Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        title="প্রোফাইল ছবি পরিবর্তন করুন (UploadThing)"
        className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-primary shadow-lg ring-2 ring-white hover:bg-amber-300 active:scale-95 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : uploadSuccess ? (
          <Check className="h-4 w-4 text-emerald-800" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </button>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md flex items-center gap-1 z-30">
          <AlertCircle className="h-3 w-3" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  )
}
