"use client"

import { redirect } from "next/navigation"

import PageLoader from "@/components/page-loader"
import { useGetChannel } from "@/features/channels/api/use-get-channel"
import ChatHeader from "@/features/chat/components/chat-header"
import ChatInput from "@/features/chat/components/chat-input"
import { useGetMemberServer } from "@/features/members/api/use-get-member-server"
import { useChannelId } from "@/hooks/use-channel-id"
import { useServerId } from "@/hooks/use-server-id"

interface ChannelIdClientProps {
  profileId: string
}

export default function ChannelIdClient({ profileId }: ChannelIdClientProps) {
  const channelId = useChannelId()
  const serverId = useServerId()

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({ channelId })
  const { data: member, isLoading: isLoadingMember } = useGetMemberServer({ serverId })

  if (isLoadingChannel || isLoadingMember) return <PageLoader />

  if (!channel || !member) return redirect('/')

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#313338]">
      <ChatHeader name={channel.name} type="channel" profileId={profileId} />
      <div className="flex-1">
        messages
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

