"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@workspace/ui/components/sonner"
import { useCreateChapter } from "../services/use-chapter"
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
import { BookOpen } from "lucide-react"

const createChapterSchema = z.object({
  name: z.string().min(1, "English name is required"),
  nameBn: z.string().min(1, "Bengali name is required"),
  subjectId: z.string().min(1, "Please select a parent subject"),
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
})

type CreateChapterFormData = z.infer<typeof createChapterSchema>

export function CreateChapterView() {
  const router = useRouter()
  const createMutation = useCreateChapter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: subjects = [] } = useSubjectsForSelection()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CreateChapterFormData>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      subjectId: "",
      position: 0,
    },
  })

  const isSubmitting = createMutation.isPending || isFormSubmitting

  const onSubmit = async (data: CreateChapterFormData) => {
    setErrorMessage(null)

    try {
      await createMutation.mutateAsync({
        name: data.name.trim(),
        nameBn: data.nameBn.trim(),
        subjectId: data.subjectId,
        position: Number(data.position) || 0,
      })

      toast.success("Chapter created successfully.")
      setTimeout(() => {
        router.push("/chapters")
      }, 1000)
    } catch (err: any) {
      const msg = err.message || "Failed to create chapter"
      setErrorMessage(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header Section */}
      <div className="mb-6 sm:mb-10 flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div className="max-w-2xl">
          <nav className="mb-3 flex items-center space-x-2 text-on-surface-variant">
            <Link
              href="/chapters"
              className="font-label-sm text-xs hover:text-primary transition-colors cursor-pointer"
            >
              Chapters
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-label-sm text-xs font-bold text-primary">Create New</span>
          </nav>
          <h2 className="mb-1.5 font-headline-md text-2xl sm:text-3xl font-extrabold text-primary">
            New Academic Chapter
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Define new chapter unit under an academic subject, including English & Bengali titles and display ordering.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/30 bg-error-container/20 p-4 text-error">
          <span className="material-symbols-outlined text-lg">error</span>
          <span className="font-body-md text-xs sm:text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-outline-variant bg-white p-0 shadow-xs ring-0">
        <CardHeader className="border-b border-outline-variant/40 bg-surface-container-lowest p-4 sm:p-8 flex flex-row items-center gap-3 sm:gap-4">
          <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <CardTitle className="font-headline-md text-base sm:text-[20px] font-extrabold text-on-surface normal-case tracking-normal">
              Chapter Specifications
            </CardTitle>
            <p className="text-[11px] sm:text-xs font-body-md text-on-surface-variant mt-0.5">
              Define parent subject mapping, titles, and display ordering
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit, (invalidErrors) => {
              console.log("[CreateChapterView] Submit blocked by validation errors:", invalidErrors)
            })}
            className="space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
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
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 pointer-events-none text-base sm:text-lg">
                        book
                      </span>
                      <Select
                        disabled={isSubmitting}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 sm:py-3 pl-10 pr-10 font-body-md text-sm text-on-surface transition-all cursor-pointer focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto justify-between">
                          <SelectValue placeholder="Select parent subject..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg max-h-64">
                          {subjects.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name} ({sub.nameBn})
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
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    abc
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Motion and Force"
                    {...register("name")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
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
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    translate
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="উদাঃ বল ও গতি"
                    {...register("nameBn")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md font-bengali text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
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
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    format_list_numbered
                  </span>
                  <Input
                    type="number"
                    min="0"
                    disabled={isSubmitting}
                    {...register("position")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                <p className="text-[11px] text-outline italic">
                  Defines display order in chapter list
                </p>
                {errors.position && (
                  <p className="text-xs text-error">{errors.position.message}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t border-outline-variant pt-6 sm:pt-8">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => router.push("/chapters")}
                className="w-full sm:w-auto rounded-lg border border-outline-variant px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-primary transition-all active:scale-95 hover:bg-surface-container-low cursor-pointer h-auto normal-case tracking-normal disabled:opacity-50 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-lg bg-primary-container px-8 sm:px-10 py-2.5 sm:py-3 font-bold text-on-primary-container shadow-md transition-all active:scale-95 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer h-auto normal-case tracking-normal text-sm"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px] sm:text-[20px]">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">save</span>
                )}
                <span>{isSubmitting ? "Creating..." : "Create Chapter"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
