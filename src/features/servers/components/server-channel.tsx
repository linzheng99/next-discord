import { type Channel, ChannelType, MemberRole } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useRouter } from "next/navigation"

import ActionTooltip from "@/components/action-tooltip"
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel"
import { useChannelId } from "@/hooks/use-channel-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useModalStore } from "@/hooks/use-modal-store"
import { useServerId } from "@/hooks/use-server-id"
import { cn } from "@/lib/utils"

interface ServerChannelProps {
  channel: Channel
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

export default function ServerChannel({ channel, role }: ServerChannelProps) {
  const Icon = iconMap[channel.type]
  const channelId = useChannelId()
  const serverId = useServerId()
  const router = useRouter()

  const [DeleteChannelDialog, confirmDeleteChannel] = useConfirm(`Delete ${channel.name}`, `Are you sure you want to delete this channel? This action cannot be undone.`, 'destructive')
  const { mutate: deleteChannel } = useDeleteChannel()
  const { onOpen } = useModalStore()

  async function handleDeleteChannel() {
    const ok = await confirmDeleteChannel()
    if (!ok) return

    deleteChannel(
      { param: { serverId, channelId: channel.id } },
      {
        onSuccess: () => {
          router.push(`/servers/${serverId}`)
        }
      }
    )
  }

  async function channelAction({ e, action }: { e: React.MouseEvent, action: 'edit' | 'delete' }) {
    e.stopPropagation()
    if (action === 'edit') {
      onOpen('editChannel', { channel })
    } else if (action === 'delete') {
      await handleDeleteChannel()
    }
  }

  function clickChannel() {
    console.log('clickChannel', channel)
  }

  return (
    <>
      <DeleteChannelDialog />
      <div
        onClick={clickChannel}
        className={cn(
          "group flex items-center p-2 gap-x-2 cursor-pointer justify-between hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition w-full rounded-md",
          channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}>
        <div className="flex items-center gap-x-2 max-w-[150px]">
          <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition flex-shrink-0" />
          <p className={cn(
            "text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition truncate",
            channelId === channel.id && "text-primary dark:text-zinc-200"
          )}>
            {channel.name}
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          {
            role !== MemberRole.GUEST && channel.name !== 'general' && (
              <div className="flex items-center gap-x-2">
                <ActionTooltip label="Edit">
                  <Edit onClick={(e) => channelAction({ e, action: 'edit' })} className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                </ActionTooltip>
                <ActionTooltip label="Delete">
                  <Trash onClick={(e) => channelAction({ e, action: 'delete' })} className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                </ActionTooltip>
              </div>
            )
          }
          {
            channel.name === 'general' && (
              <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )
          }
        </div>
      </div>
    </>
  )
}
