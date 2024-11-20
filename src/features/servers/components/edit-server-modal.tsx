"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import EditServerForm from "./edit-server-form";

export default function EditServerModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'editServer' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <EditServerForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
