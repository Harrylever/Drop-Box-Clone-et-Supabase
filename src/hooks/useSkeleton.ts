import { useCallback } from "react"
import moment from "moment"
import { FileType } from "@/typings"
import { FileObject } from "@supabase/storage-js/src/lib/types"

export const useSkeleton = () => {
  const transformSkeleton = useCallback(
    (userId: string, docsResults: FileObject[]): FileType[] => {
      return docsResults?.map((doc) => ({
        id: doc.id,
        filename: doc.name,
        timestamp: moment(doc.created_at).calendar(),
        fullname: userId,
        type: doc.metadata.mimetype ?? undefined,
        size: doc.metadata.size ?? undefined,
        downloadName: doc.name,
      }))
    },
    []
  )

  return { transformSkeleton }
}
