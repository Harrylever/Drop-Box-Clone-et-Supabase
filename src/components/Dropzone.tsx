"use client"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import DropzoneComponent from "react-dropzone"

const Dropzone = () => {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()

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
    if (loading) return
    if (!user) return

    setLoading(true)

    const fileExt = selectedFile.name.split(".").pop()
    const filePath = `users/${user.id}/${Math.random()}-${
      selectedFile.name.split(".")[0]
    }.${fileExt}`

    const { data, error: uploadError } = await supabase.storage
      .from("dropbox-clone-bucket")
      .upload(filePath, selectedFile)

    if (uploadError) {
      throw uploadError
    }

    console.log({ filePath, data })
    setLoading(false)
  }

  // max file size is 20MB
  const maxSize = 20971520

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
              {!isDragActive && "Click here to drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <div className="text-danger mt-2">File is too large</div>
              )}
            </div>
          </section>
        )
      }}
    </DropzoneComponent>
  )
}

export default Dropzone
