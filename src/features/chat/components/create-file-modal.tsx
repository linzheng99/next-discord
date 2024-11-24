"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import CreateFileForm from "./create-file-form";

export default function CreateFileModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'messageFile' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <CreateFileForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
