"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import CreateChannelForm from "./create-channel-form";

export default function CreateChannelModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'createChannel' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <CreateChannelForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
