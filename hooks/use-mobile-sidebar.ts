import { create } from 'zustand'

type MobileSidevarStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useMobileSidebar = create<MobileSidevarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))