"use client"

import { DeleteAcademicClassModal } from "@/modules/academic-class/components/delete-academic-class-modal"
import { DeleteSubjectModal } from "@/modules/subject/components/delete-subject-modal"

export function ModalProvider() {
  return (
    <>
      <DeleteAcademicClassModal />
      <DeleteSubjectModal />
    </>
  )
}
