"use client"

import { toast } from "@workspace/ui/components/sonner"
import { useDeleteAcademicClass } from "../services/use-academic-class"
import { useDeleteAcademicClassModalStore } from "../store/use-delete-academic-class-modal-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

export function DeleteAcademicClassModal() {
  const { isOpen, classId, className, closeModal } =
    useDeleteAcademicClassModalStore()

  const deleteMutation = useDeleteAcademicClass()

  const handleConfirmDelete = async () => {
    if (!classId) return

    try {
      await deleteMutation.mutateAsync({ id: classId })
      toast.success(
        `Academic class "${className || "Class"}" deleted successfully.`
      )
      closeModal()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete academic class")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-2xl sm:max-w-md"
      >
        {/* Warning Icon Section */}
        <div className="mb-6 flex items-center justify-center sm:justify-start">
          <div className="flex size-12 items-center justify-center rounded-full bg-error-container text-on-error-container">
            <span
              className="material-symbols-outlined text-2xl text-error"
              style={{ fontVariationSettings: "'opsz' 32" }}
            >
              warning
            </span>
          </div>
        </div>

        {/* Textual Content */}
        <DialogHeader className="space-y-3 text-left">
          <DialogTitle className="font-headline-md text-2xl font-bold tracking-tight text-on-surface normal-case">
            Delete Academic Class?
          </DialogTitle>
          <DialogDescription className="font-body-md text-sm leading-relaxed text-on-surface-variant">
            This action cannot be undone. All curriculum data, student progress
            records, and resources associated with{" "}
            <span className="font-bold text-on-surface">
              &quot;{className || "selected class"}&quot;
            </span>{" "}
            will be permanently removed from the system.
          </DialogDescription>
        </DialogHeader>

        {/* Informational Alert */}
        <div className="mt-6 flex items-start gap-3 rounded-r-lg border-l-4 border-error bg-surface-container-low p-4">
          <span className="material-symbols-outlined text-[18px] text-error">
            info
          </span>
          <p className="font-label-sm text-xs text-on-surface-variant">
            Associated batches and student portal navigation links will be affected
            by this deletion.
          </p>
        </div>

        {/* Actions Footer */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={deleteMutation.isPending}
            onClick={closeModal}
            className="w-full rounded-lg border border-outline bg-transparent px-6 py-3 font-headline-md text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container-high sm:w-auto h-auto cursor-pointer normal-case tracking-normal"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleConfirmDelete}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-error px-6 py-3 font-headline-md text-sm font-bold text-on-error transition-all hover:bg-on-error-container sm:w-auto h-auto cursor-pointer normal-case tracking-normal disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Class"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
