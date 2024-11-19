"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import CreateServerForm from "./create-server-form";

export default function CreateServerModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'createServer' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <CreateServerForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
