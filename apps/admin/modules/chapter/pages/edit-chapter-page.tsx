"use client"

import { EditChapterView } from "../components/edit-chapter-view"

interface EditChapterPageProps {
  id: string
}

export function EditChapterPage({ id }: EditChapterPageProps) {
  return <EditChapterView id={id} />
}
