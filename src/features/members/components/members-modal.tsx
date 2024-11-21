"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import MembersForm from "./members-form";

export default function MembersModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'members' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <MembersForm />
    </ResponsiveModel>
  )
}
