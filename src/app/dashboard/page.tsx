import { auth } from "@clerk/nextjs/server"
import Dropzone from "@/components/Dropzone"
import TableWrapper from "@/components/table/TableWrapper"

const Dashboard = async () => {
  const { userId } = await auth()

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Dropzone />

      <section className="mt-24 max-w-6xl mx-auto">
        <h2>All Files</h2>

        <div>
          <TableWrapper userId={userId} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
