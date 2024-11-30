"use client"
import Dropzone from "@/components/Dropzone"
// import { useAuth } from "@clerk/nextjs"

const Dashboard = () => {
  // const { userId } = useAuth()

  return (
    <div>
      <Dropzone />
    </div>
  )
}

export default Dashboard
