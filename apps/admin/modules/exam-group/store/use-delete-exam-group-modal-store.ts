import { create } from "zustand"

interface DeleteExamGroupModalState {
  isOpen: boolean
  groupId: string | null
  groupTitle: string | null
  openModal: (id: string, title: string) => void
  closeModal: () => void
}

export const useDeleteExamGroupModalStore = create<DeleteExamGroupModalState>((set) => ({
  isOpen: false,
  groupId: null,
  groupTitle: null,
  openModal: (id: string, title: string) =>
    set({ isOpen: true, groupId: id, groupTitle: title }),
  closeModal: () => set({ isOpen: false, groupId: null, groupTitle: null }),
}))
