import { create } from "zustand"

interface McqDetailModalStore {
  isOpen: boolean
  selectedMcqId: string | null
  openModal: (mcqId: string) => void
  closeModal: () => void
}

export const useMcqDetailModalStore = create<McqDetailModalStore>((set) => ({
  isOpen: false,
  selectedMcqId: null,
  openModal: (mcqId: string) => set({ isOpen: true, selectedMcqId: mcqId }),
  closeModal: () => set({ isOpen: false, selectedMcqId: null }),
}))
