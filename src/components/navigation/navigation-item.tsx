'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"

import ActionTooltip from "@/components/action-tooltip"
import { useServerId } from "@/features/servers/hooks/use-server-id"
import { cn } from "@/lib/utils"

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export default function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {
  const serverId = useServerId()
  const router = useRouter()

  const onClick = (id: string) => {
    router.push(`/servers/${id}`)
  }

  return (
    <div className="mb-4">
      <ActionTooltip label={name} side="right" align="center">
        <button className="group relative flex items-center" onClick={() => onClick(id)}>
          <div className={cn(`absolute left-0 bg-primary rounded-r-full transition-all w-[4px]`, id === serverId ? "h-[36px]" : "h-[8px]", id !== serverId && "group-hover:h-[20px]")}>
          </div>
          <div className={cn('relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center', id === serverId && "bg-primary/10 text-primary rounded-[16px]")}>
            <Image src={imageUrl} alt="Channel" fill />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
