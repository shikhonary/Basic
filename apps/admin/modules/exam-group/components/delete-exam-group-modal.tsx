"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { useDeleteExamGroupModalStore } from "../store/use-delete-exam-group-modal-store"
import { useDeleteExamGroup } from "../services/use-exam-group"
import { AlertTriangle } from "lucide-react"

export function DeleteExamGroupModal() {
  const { isOpen, groupId, groupTitle, closeModal } = useDeleteExamGroupModalStore()
  const deleteMutation = useDeleteExamGroup()

  const handleDelete = async () => {
    if (!groupId) return

    try {
      await deleteMutation.mutateAsync({ id: groupId })
      toast.success(`Exam Group "${groupTitle}" deleted successfully`)
      closeModal()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete exam group")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white border border-outline-variant rounded-xl p-6 shadow-lg">
        <DialogHeader className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="font-bold text-xl text-on-surface">
            Delete Exam Group?
          </DialogTitle>
          <DialogDescription className="text-sm text-outline">
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">"{groupTitle}"</span>? This will remove all associated item assignments and calculated results. Individual standalone exams will NOT be deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={closeModal}
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-error text-on-error hover:bg-error/90 cursor-pointer"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Exam Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
