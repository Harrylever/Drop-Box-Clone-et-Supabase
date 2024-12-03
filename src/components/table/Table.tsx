"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import { FileType } from "@/typings"
import { Button } from "../ui/button"
import { useAppStore } from "../../store/store"
import { PencilIcon, TrashIcon } from "lucide-react"
import DeleteFileModal from "../modals/DeleteFileModal"
import RenameFileModal from "../modals/RenameFileModal"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const setIsDeleteModalOpen = useAppStore(
    (state) => state.setIsDeleteModalOpen
  )
  const setFilename = useAppStore((state) => state.setFilename)
  const setIsRenameModalOpen = useAppStore(
    (state) => state.setIsRenameModalOpen
  )

  const openRenameModal = (filename: string) => {
    setFilename(filename)
    setIsRenameModalOpen(true)
  }

  const openDeleteModal = (filename: string) => {
    setFilename(filename)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteFileModal />
                <RenameFileModal />
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "filename" ? (
                      <p
                        onClick={() => {
                          openRenameModal((row.original as FileType).filename)
                        }}
                        className="underline flex items-center text-blue-500 hover:cursor-pointer"
                      >
                        {cell.getValue() as string}{" "}
                        <PencilIcon size={15} className="ml-2" />
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      openDeleteModal((row.original as FileType).filename)
                    }}
                  >
                    <TrashIcon size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                You have No Files.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
