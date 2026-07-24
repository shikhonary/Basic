"use client"

import { EditSubjectView } from "../components/edit-subject-view"

interface EditSubjectPageProps {
  id: string
}

export function EditSubjectPage({ id }: EditSubjectPageProps) {
  return <EditSubjectView id={id} />
}
