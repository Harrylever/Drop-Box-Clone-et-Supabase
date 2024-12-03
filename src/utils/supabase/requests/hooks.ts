"use client"

import { deleteFile, fetchDocs, renameFile, uploadFile } from "./actions"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FileObject } from "@supabase/storage-js/src/lib/types"

export const useFetchDocs = (
  userId: string,
  options?: { sort: "asc" | "desc" }
) => {
  return useQuery<FileObject[], { error: unknown }>({
    queryKey: ["fetch-supabase-docs", userId, options],
    queryFn: () => fetchDocs(userId, options),
  })
}

export const useUploadFile = () => {
  return useMutation<
    { success: boolean },
    { error: unknown },
    { userId: string; selectedFile: File }
  >({
    mutationFn: (options) => uploadFile(options.userId, options.selectedFile),
  })
}

export const useDeleteFile = () => {
  return useMutation<
    FileObject[],
    { error: unknown },
    { userId: string; filename: string }
  >({
    mutationFn: (options) => deleteFile(options.userId, options.filename),
  })
}

export const useRenameFile = () => {
  return useMutation<
    { message: string },
    { error: unknown },
    { userId: string; filename: string; newFilename: string }
  >({
    mutationFn: (options) =>
      renameFile(options.userId, options.filename, options.newFilename),
  })
}
