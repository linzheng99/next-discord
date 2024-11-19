"use client"

import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

import PageLoader from "@/components/page-loader"
import { useGetServer } from "@/features/servers/api/use-get-server"

import { useServerId } from "../hooks/use-server-id"
import { type ServerWithMembersWithProfiles } from "../types"
import ServerHeader from "./server-header"

interface ServerSidebarProps {
  profileId: string
}

export default function ServerSidebar({ profileId }: ServerSidebarProps) {
  const serverId = useServerId()

  const { data: server, isLoading: isLoadingServer } = useGetServer(serverId)

  if (isLoadingServer) {
    return <PageLoader />
  }

  if (!server) redirect('/')

  const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO)
  const members = server.members.filter(member => member.profileId !== profileId)
  const role = server.members.find(member => member.profileId === profileId)?.role


  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2b37] bg-[#e5e5e5]">
      <ServerHeader server={server as unknown as ServerWithMembersWithProfiles} role={role} />
    </div>
  )
}
