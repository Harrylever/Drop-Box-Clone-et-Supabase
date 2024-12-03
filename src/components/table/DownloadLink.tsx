"use client"
import useSWR from "swr"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { fetchPublicUrl } from "@/utils/supabase/requests/actions"

const DownloadLink = ({ fileName }: { fileName: string }) => {
  const { userId } = useAuth()

  const {
    data: publicUrl,
    error,
    isLoading,
  } = useSWR(`publicUrl:${userId}:${fileName}`, fetchPublicUrl)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading link</div>
  if (!publicUrl) return <div>No link found</div>

  return (
    <Link
      href={publicUrl}
      target="_blank"
      className="underline text-blue-500 hover:text-blue-600"
    >
      Download
    </Link>
  )
}

export default DownloadLink
