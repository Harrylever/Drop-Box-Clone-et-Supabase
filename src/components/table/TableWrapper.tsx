"use client"
import { useMemo, useState } from "react"
import { FileType } from "@/typings"
import { Button } from "../ui/button"
import { DataTable } from "./Table"
import { columns } from "./columns"
import { Skeleton } from "../ui/skeleton"
import { useSkeleton } from "@/hooks/useSkeleton"
import { useFetchDocs } from "@/utils/supabase/requests/hooks"

interface TableWrapperProps {
  userId: string
}

const TableWrapper = ({ userId }: TableWrapperProps) => {
  const { transformSkeleton } = useSkeleton()

  const [sort, setSort] = useState<"asc" | "desc">("asc")

  const {
    data: docsResults,
    isFetching,
    error,
    refetch,
  } = useFetchDocs(userId, { sort })

  const [initialFiles, setInitialFiles] = useState<FileType[]>([])

  const skeletonFiles = useMemo(() => {
    const result = transformSkeleton(userId, docsResults ?? [])
    setInitialFiles(result)
    return result
  }, [docsResults, transformSkeleton, userId])

  if (isFetching) {
    return (
      <div className="flex flex-col">
        <Button variant="outline" className="ml-auto w-36 h-10 mb-5">
          <Skeleton className="h-5 w-full" />
        </Button>

        <div className="border rounded-lg h-full">
          <div className="h-12 border-b"></div>

          {initialFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-4 p-5 w-full"
            >
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-5 flex flex-col items-center justify-center">
        <p className="text-center">Error: Error Occured</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <Button
        variant="outline"
        className="ml-auto w-fit"
        onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
      >
        Sort By {sort === "desc" ? "Newest" : "Oldest"}
      </Button>

      <DataTable columns={columns} data={skeletonFiles} />
    </div>
  )
}

export default TableWrapper
