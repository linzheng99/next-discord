"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import CreateChannelServerForm from "./create-channel-server-form";

export default function CreateChannelServerModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'createChannel' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <CreateChannelServerForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
