"use client"

import React, { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useUser } from "@clerk/nextjs"
import { useAppStore } from "@/store/store"
import { useQueryClient } from "@tanstack/react-query"
import { useRenameFile } from "@/utils/supabase/requests/hooks"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import toast from "react-hot-toast"

const RenameFileModal = () => {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { mutateAsync: renameFile, isPending } = useRenameFile()

  const [input, setInput] = useState("")

  const isRenameModalOpen = useAppStore((state) => state.isRenameModalOpen)
  const setIsRenameModalOpen = useAppStore(
    (state) => state.setIsRenameModalOpen
  )
  const filename = useAppStore((state) => state.filename)

  const handleRenameFile = async () => {
    if (!user || !filename.length) return

    const toastId = toast.loading("Renaming file...")

    try {
      const response = await renameFile({
        userId: user.id,
        filename,
        newFilename: input,
      })

      if (response.message === "Successfully moved") {
        toast.success("File renamed successfully", { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["fetch-supabase-docs"] })
        setIsRenameModalOpen(false)
      }
    } catch (error) {
      toast.error("Failed to rename file", { id: toastId })
      setIsRenameModalOpen(false)
    }
  }

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => setIsRenameModalOpen(isOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Rename the File</DialogTitle>

          <Input
            id="link"
            defaultValue={filename}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                handleRenameFile()
              }
            }}
          />

          <div className="flex justify-end space-x-2 py-3">
            <Button
              disabled={isPending}
              size="sm"
              className="px-3"
              variant="ghost"
              onClick={() => setIsRenameModalOpen(false)}
            >
              <span className="sr-only">Cancel</span>
              <span>Cancel</span>
            </Button>

            <Button
              disabled={isPending}
              type="submit"
              size="sm"
              className="px-3"
              onClick={handleRenameFile}
            >
              <span className="sr-only">Rename</span>
              <span>Rename</span>
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default RenameFileModal
