'use client'

import { FileIcon, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { UploadDropzone } from "@/lib/uploadthing"

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile"
  value: string
  onChange: (url?: string) => void
}

export default function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const [fileType, setFileType] = useState<string | null>(null)

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} alt="Upload" fill className="rounded-full" />
        <button
          type="button"
          className="absolute top-0 right-0 p-1 rounded-full bg-rose-500 text-white shadow-sm"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center justify-center p-2 mt-2 rounded-md bg-muted">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-indigo-500 hover:underline dark:text-indigo-400 whitespace-normal break-all">
          {value}
        </a>
        <button
          type="button"
          className="absolute top-[-10px] right-[-10px] p-1 rounded-full bg-rose-500 text-white shadow-sm"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const { name, url } = res[0]
        onChange(url)
        setFileType(name.split(".").pop() || "")
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}
