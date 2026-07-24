"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@workspace/ui/components/sonner"
import { useChapterById, useUpdateChapter } from "../services/use-chapter"
import { useSubjectsForSelection } from "@/modules/subject/services/use-subject"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
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

const editChapterSchema = z.object({
  name: z.string().min(1, "English name is required"),
  nameBn: z.string().min(1, "Bengali name is required"),
  subjectId: z.string().min(1, "Please select a parent subject"),
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
})

type EditChapterFormData = z.infer<typeof editChapterSchema>

interface EditChapterViewProps {
  id: string
}

export function EditChapterView({ id }: EditChapterViewProps) {
  const router = useRouter()
  const { data: chapter, isLoading, isError } = useChapterById(id)
  const updateMutation = useUpdateChapter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: subjects = [] } = useSubjectsForSelection()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<EditChapterFormData>({
    resolver: zodResolver(editChapterSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      subjectId: "",
      position: 0,
    },
  })

  useEffect(() => {
    if (chapter) {
      reset({
        name: chapter.name,
        nameBn: chapter.nameBn,
        subjectId: chapter.subjectId,
        position: chapter.position,
      })
    }
  }, [chapter, reset])

  const isSubmitting = updateMutation.isPending || isFormSubmitting

  const onSubmit = async (data: EditChapterFormData) => {
    setErrorMessage(null)

    try {
      await updateMutation.mutateAsync({
        id,
        name: data.name.trim(),
        nameBn: data.nameBn.trim(),
        subjectId: data.subjectId,
        position: Number(data.position) || 0,
      })

      toast.success("Chapter updated successfully.")
      setTimeout(() => {
        router.push("/chapters")
      }, 1000)
    } catch (err: any) {
      const msg = err.message || "Failed to update chapter"
      setErrorMessage(msg)
      toast.error(msg)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">
          progress_activity
        </span>
        <span className="ml-3 font-body-md">Loading chapter details...</span>
      </div>
    )
  }

  if (isError || !chapter) {
    return (
      <div className="p-8 text-center text-error">
        <span className="material-symbols-outlined text-4xl">error</span>
        <p className="mt-2 font-body-md font-medium">Failed to load chapter details.</p>
        <Button
          onClick={() => router.push("/chapters")}
          className="mt-4 rounded-lg bg-primary px-4 py-2 font-bold text-white cursor-pointer"
        >
          Return to Chapters
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end justify-between">
        <div className="max-w-2xl">
          <nav className="mb-4 flex items-center space-x-2 text-on-surface-variant">
            <Link
              href="/chapters"
              className="font-label-sm hover:text-primary transition-colors cursor-pointer"
            >
              Chapters
            </Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-label-sm font-bold text-primary">Edit Chapter</span>
          </nav>
          <h2 className="mb-2 font-headline-md text-3xl font-extrabold text-primary">
            Edit Chapter: {chapter.name}
          </h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Modify chapter names, parent subject association, or position ordering.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/30 bg-error-container/20 p-4 text-error">
          <span className="material-symbols-outlined">error</span>
          <span className="font-body-md text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-outline-variant bg-white p-0 shadow-xs ring-0">
        <CardHeader className="border-b border-outline-variant bg-surface-container-lowest p-8">
          <CardTitle className="font-headline-md text-[20px] font-semibold text-on-surface normal-case tracking-normal">
            Chapter Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Parent Subject */}
              <div className="space-y-2 md:col-span-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Parent Subject
                </Label>
                <Controller
                  name="subjectId"
                  control={control}
                  render={({ field }) => (
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                        book
                      </span>
                      <Select
                        disabled={isSubmitting}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-3 pl-10 pr-10 font-body-md text-on-surface transition-all cursor-pointer focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto justify-between">
                          <SelectValue placeholder="Select parent subject..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
                          {subjects.map((sub) => (
                            <SelectItem
                              key={sub.id}
                              value={sub.id}
                              label={`${sub.name} (${sub.nameBn}) — ${sub.level}`}
                            >
                              {sub.name} ({sub.nameBn}) — {sub.level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.subjectId && (
                  <p className="text-xs text-error">{errors.subjectId.message}</p>
                )}
              </div>

              {/* Chapter Name (English) */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Chapter Name (English)
                </Label>
                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                    abc
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Motion and Force"
                    {...register("name")}
                    className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-error">{errors.name.message}</p>
                )}
              </div>

              {/* Chapter Name (Bengali) */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Chapter Name (Bengali)
                </Label>
                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                    translate
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="উদাঃ বল ও গতি"
                    {...register("nameBn")}
                    className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md font-bengali text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                {errors.nameBn && (
                  <p className="text-xs text-error">{errors.nameBn.message}</p>
                )}
              </div>

              {/* Display Position */}
              <div className="space-y-2 md:col-span-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Display Position
                </Label>
                <div className="group relative max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                    format_list_numbered
                  </span>
                  <Input
                    type="number"
                    min="0"
                    disabled={isSubmitting}
                    {...register("position")}
                    className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                <p className="text-[12px] italic text-outline">
                  Defines display order in chapter list
                </p>
                {errors.position && (
                  <p className="text-xs text-error">{errors.position.message}</p>
                )}
              </div>
            </div>

            {/* Meta & Actions */}
            <div className="mt-4 flex flex-col items-center justify-between gap-6 border-t border-outline-variant pt-8 sm:flex-row">
              <div className="flex items-center space-x-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="text-[12px]">Last edited: Just now by Admin</span>
              </div>
              <div className="flex w-full items-center space-x-4 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push("/chapters")}
                  className="flex-1 rounded-lg border border-outline px-8 py-3 font-bold text-primary transition-all active:scale-95 hover:bg-surface-container-low sm:flex-none cursor-pointer h-auto normal-case tracking-normal disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-primary-container px-10 py-3 font-bold text-on-primary-container shadow-md transition-all active:scale-95 hover:bg-primary hover:text-white disabled:opacity-50 sm:flex-none cursor-pointer h-auto normal-case tracking-normal"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">save</span>
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Chapter"}</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
