"use client"

import { redirect } from "next/navigation"

import { useGetChannel } from "@/features/channels/api/use-get-channel"
import ChatHeader from "@/features/chat/components/chat-header"
import ChatInput from "@/features/chat/components/chat-input"
import ChatMessage from "@/features/chat/components/chat-message"
import { useGetMemberServer } from "@/features/members/api/use-get-member-server"
import { useChannelId } from "@/hooks/use-channel-id"
import { useServerId } from "@/hooks/use-server-id"
import { type MemberWithProfile } from "@/types"

interface ChannelIdClientProps {
  profileId: string
}

export default function ChannelIdClient({ profileId }: ChannelIdClientProps) {
  const channelId = useChannelId()
  const serverId = useServerId()

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({ channelId })
  const { data: member, isLoading: isLoadingMember } = useGetMemberServer({ serverId })

  if (isLoadingChannel || isLoadingMember) return null

  if (!channel || !member) return redirect('/')

  return (
    <div className="flex flex-1 h-full flex-col bg-white dark:bg-[#313338] overflow-hidden">
      <ChatHeader name={channel.name} type="channel" profileId={profileId} />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <ChatMessage
          name={channel.name}
          member={member as unknown as MemberWithProfile}
          chatId={channelId}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId, serverId }}
          paramKey="channelId"
          paramValue={channelId}
          type="channel"
        />
      </div>
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ channelId, serverId }}
      />
    </div>
  )
}

