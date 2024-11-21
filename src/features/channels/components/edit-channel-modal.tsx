"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import EditChannelForm from "./edit-channel-form";

export default function EditChannelModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'editChannel' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <EditChannelForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
