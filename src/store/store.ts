"use client"
import { create } from "zustand"

interface AppState {
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void

  isRenameModalOpen: boolean
  setIsRenameModalOpen: (open: boolean) => void

  filename: string
  setFilename: (filename: string) => void
}

export const useAppStore = create<AppState>()((set) => ({
  filename: "",
  setFilename: (filename: string) => set(() => ({ filename })),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (open: boolean) =>
    set(() => ({ isDeleteModalOpen: open })),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (open: boolean) =>
    set(() => ({ isRenameModalOpen: open })),
}))
