"use client"

import { EditAcademicClassView } from "../components/edit-academic-class-view"

interface EditAcademicClassPageProps {
  classId: string
}

export function EditAcademicClassPage({ classId }: EditAcademicClassPageProps) {
  return <EditAcademicClassView classId={classId} />
}
