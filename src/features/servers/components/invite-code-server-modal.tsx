"use client"

import ResponsiveModel from "@/components/responsive-modal";
import { useModalStore } from "@/hooks/use-modal-store";

import InviteCodeServerForm from "./invite-code-server-form";

export default function InviteCodeServerModal() {
  const { type, onClose, isOpen } = useModalStore()

  const isModalOpen = type === 'invite' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <InviteCodeServerForm />
    </ResponsiveModel>
  )
}
