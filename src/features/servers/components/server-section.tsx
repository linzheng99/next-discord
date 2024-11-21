'use client'

import { type ChannelType,MemberRole } from "@prisma/client"
import { Plus, Settings } from "lucide-react"

import ActionTooltip from "@/components/action-tooltip"
import { useModalStore } from "@/hooks/use-modal-store"
import { type ServerWithMembersWithProfiles } from "@/types"

interface ServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithProfiles
}

export default function ServerSection({ label, role, sectionType, channelType, server }: ServerSectionProps) {
  const { onOpen } = useModalStore()

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {
        role !== MemberRole.GUEST && sectionType === 'channels' && (
          <ActionTooltip label={`Create ${channelType} Channel`} side="top">
            <Plus
              onClick={() => onOpen('createChannel', { channelType })}
              className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer" />
          </ActionTooltip>
        )
      }
      {
        role === MemberRole.ADMIN && sectionType === 'members' && (
          <ActionTooltip label="Manage Members" side="top">
            <Settings
              onClick={() => onOpen('members', { server })}
              className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer" />
          </ActionTooltip>
        )
      }
    </div>
  )
}
