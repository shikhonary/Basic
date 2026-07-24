"use client"

import { toast } from "@workspace/ui/components/sonner"
import { useDeleteMcq, useBulkDeleteMcqs } from "../services/use-mcq"
import { useDeleteMcqModalStore } from "../store/use-delete-mcq-modal-store"
import { Button } from "@workspace/ui/components/button"

interface DeleteMcqModalProps {
  onSuccess?: () => void
}

export function DeleteMcqModal({ onSuccess }: DeleteMcqModalProps) {
  const { isOpen, mcqId, mcqQuestion, selectedIds, closeModal } =
    useDeleteMcqModalStore()

  const deleteMutation = useDeleteMcq()
  const bulkDeleteMutation = useBulkDeleteMcqs()

  const isBulk = selectedIds.length > 0
  const isDeleting = deleteMutation.isPending || bulkDeleteMutation.isPending

  if (!isOpen) return null

  const handleDelete = async () => {
    try {
      if (isBulk) {
        const res = await bulkDeleteMutation.mutateAsync({ ids: selectedIds })
        toast.success(`Successfully deleted ${res.deletedCount} MCQs.`)
      } else if (mcqId) {
        await deleteMutation.mutateAsync({ id: mcqId })
        toast.success("MCQ question deleted successfully.")
      }
      closeModal()
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete MCQ")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 text-error">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container/30 text-error">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h3 className="font-headline-md text-xl font-bold">
            {isBulk ? `Delete ${selectedIds.length} MCQs?` : "Delete MCQ Question?"}
          </h3>
        </div>

        <p className="mt-4 font-body-md text-sm text-on-surface-variant leading-relaxed">
          {isBulk ? (
            <>
              Are you sure you want to permanently delete{" "}
              <strong className="text-on-surface font-semibold">
                {selectedIds.length} selected MCQ questions
              </strong>
              ? This action cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to delete question{" "}
              <strong className="text-on-surface font-semibold">
                &quot;{mcqQuestion}&quot;
              </strong>
              ? This action cannot be undone.
            </>
          )}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={closeModal}
            className="rounded-lg border border-outline px-5 py-2 font-medium text-primary hover:bg-surface-container-low cursor-pointer h-auto text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg bg-error px-5 py-2 font-medium text-white shadow-xs hover:bg-error/90 disabled:opacity-50 cursor-pointer h-auto text-sm"
          >
            {isDeleting ? (
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-lg">delete</span>
            )}
            <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
