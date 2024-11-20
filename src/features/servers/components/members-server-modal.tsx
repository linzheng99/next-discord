"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import MembersServerForm from "./members-server-form";

export default function MembersServerModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'members' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <MembersServerForm />
    </ResponsiveModel>
  )
}
