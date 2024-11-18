"use client"

import ResponsiveModel from "@/components/responsive-model";
import { useModelStore } from "~/hooks/use-model-store";

import CreateServerForm from "./create-server-form";

export default function CreateServerModal() {
  const { type, onClose, isOpen } = useModelStore()

  const isModalOpen = type === 'createServer' && isOpen

  return (
    <ResponsiveModel open={isModalOpen} onOpenChange={onClose}>
      <CreateServerForm onCancel={onClose} />
    </ResponsiveModel>
  )
}
