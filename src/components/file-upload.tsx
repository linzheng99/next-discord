'use client'

import { X } from "lucide-react"
import Image from "next/image"

import { UploadDropzone } from "@/lib/uploadthing"

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile"
  value: string
  onChange: (url?: string) => void
}

export default function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split(".").pop()

  if(value && fileType !== "pdf") {
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

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}
