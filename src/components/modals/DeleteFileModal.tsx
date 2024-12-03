"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"
import { useAppStore } from "@/store/store"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteFile } from "@/utils/supabase/requests/hooks"

const DeleteFileModal = () => {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { mutateAsync: deleteFile, isPending } = useDeleteFile()

  const isDeleteModalOpen = useAppStore((state) => state.isDeleteModalOpen)
  const setIsDeleteModalOpen = useAppStore(
    (state) => state.setIsDeleteModalOpen
  )
  const filename = useAppStore((state) => state.filename)
  const setFilename = useAppStore((state) => state.setFilename)

  const handleDeleteFile = async () => {
    if (!user || !filename.length) return

    const toastId = toast.loading("Deleting file...")

    try {
      const response = await deleteFile({ userId: user.id, filename })
      if (response.length) {
        toast.success("File deleted successfully!", { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["fetch-supabase-docs"] })
        setIsDeleteModalOpen(false)
        setFilename("")
      }
    } catch (error) {
      toast.error("Failed to delete file!", { id: toastId })
      setFilename("")
      setIsDeleteModalOpen(false)
      return error
    }
  }

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Are you sure you want to delete?
          </DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the file!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex space-x-2 py-3">
          <Button
            disabled={isPending}
            size="sm"
            className="px-3 flex-1"
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            disabled={isPending}
            type="submit"
            size="sm"
            variant="destructive"
            className="px-3 flex-1"
            onClick={handleDeleteFile}
          >
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteFileModal
