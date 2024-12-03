import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export const fetchPublicUrl = async (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, userId, fileName] = key.split(":")

  const { data } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_BUCKET_NAME!)
    .getPublicUrl(`users/${userId}/files/${fileName}`)
  return data.publicUrl
}

export const fetchDocs = async (
  userId: string,
  options?: { sort: "asc" | "desc" }
) => {
  const { data: docsResults, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_BUCKET_NAME!)
    .list(`users/${userId}/files`, {
      sortBy: { column: "created_at", order: options?.sort ?? "desc" },
    })

  if (error) throw error

  return docsResults
}

export const deleteFile = async (userId: string, filename: string) => {
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_BUCKET_NAME!)
    .remove([`users/${userId}/files/${filename}`])

  if (error) throw error

  return data
}

export const uploadFile = async (userId: string, selectedFile: File) => {
  const randomUID = Math.random().toString().substring(0, 15)

  const fileExt = selectedFile.name.split(".").pop()
  const filePath = `users/${userId}/files/${randomUID}-${
    selectedFile.name.split(".")[0]
  }.${fileExt}`

  const { error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_BUCKET_NAME!)
    .upload(filePath, selectedFile)

  if (error) throw error

  return { success: true }
}

export const renameFile = async (
  userId: string,
  filename: string,
  newFilename: string
) => {
  const oldFilePath = `users/${userId}/files/${filename}`
  const newFilePath = `users/${userId}/files/${newFilename}`

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_BUCKET_NAME!)
    .move(oldFilePath, newFilePath)

  if (error) throw error

  return data
}
