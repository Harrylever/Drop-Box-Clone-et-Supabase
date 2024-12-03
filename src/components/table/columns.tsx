"use client"
import { FileType } from "@/typings"
import prettyBytes from "pretty-bytes"
import DownloadLink from "./DownloadLink"
import { COLOR_EXTENSION_MAP } from "../../../constants"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { FileIcon, defaultStyles, DefaultExtensionType } from "react-file-icon"

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue }) => {
      const type = renderValue() as string
      const extension: string = type.split("/")[1]
      return (
        <div className="w-10">
          <FileIcon
            extension={extension}
            labelColor={COLOR_EXTENSION_MAP[extension]}
            {...defaultStyles[extension as DefaultExtensionType]}
          />
        </div>
      )
    },
  },
  { accessorKey: "filename", header: "Filename" },
  { accessorKey: "timestamp", header: "Date added" },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>
    },
  },
  {
    accessorKey: "downloadName",
    header: "Link",
    cell: ({ renderValue }: CellContext<FileType, unknown>) => (
      <DownloadLink fileName={renderValue() as string} />
    ),
  },
]
