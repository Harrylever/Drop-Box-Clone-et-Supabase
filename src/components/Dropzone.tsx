"use client"

import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import prettyBytes from "pretty-bytes"
import { useUser } from "@clerk/nextjs"
import DropzoneComponent from "react-dropzone"
import { useQueryClient } from "@tanstack/react-query"
import { useUploadFile } from "@/utils/supabase/requests/hooks"

const Dropzone = () => {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { mutateAsync: uploadFile, isPending } = useUploadFile()

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")

      reader.onload = async () => {
        await uploadPost(file)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  const uploadPost = async (selectedFile: File) => {
    if (isPending) return
    if (!user) return

    const toastId = toast.loading("Uploading file...")

    try {
      const { success } = await uploadFile({ userId: user.id, selectedFile })
      if (success) {
        toast.success("File uploaded successfully", { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["fetch-supabase-docs"] })
      }
    } catch (error) {
      toast.error("Error uploading file", { id: toastId })
      return error
    }
  }

  // max file size is 1MB
  const maxSize = 1258291.2

  return (
    <DropzoneComponent
      minSize={0}
      maxSize={maxSize}
      maxFiles={1}
      onDrop={onDrop}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize

        return (
          <section className="m-4">
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-36 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                isDragActive
                  ? "bg-[#035FFE] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              {!isDragActive && (
                <span>Click here to drop a file to upload!</span>
              )}
              {isPending && <span className="ml-2">Uploading...</span>}
              {isDragActive && !isDragReject && (
                <span className="ml-2">Drop to upload this file!</span>
              )}
              {isDragReject && (
                <span className="ml-2">File type not accepted, sorry!</span>
              )}
              {isFileTooLarge && (
                <span className="text-red-500 ml-2">File is too large</span>
              )}
            </div>

            <p className="text-gray-500 text-sm font-normal mt-2">
              Max File Size: {prettyBytes(maxSize)}
            </p>
          </section>
        )
      }}
    </DropzoneComponent>
  )
}

export default Dropzone
