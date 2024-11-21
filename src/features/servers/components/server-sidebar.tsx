"use client"

import { type Channel, ChannelType, MemberRole } from "@prisma/client"
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { redirect } from "next/navigation"

import PageLoader from "@/components/page-loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGetServer } from "@/features/servers/api/use-get-server"
import { useServerId } from "@/hooks/use-server-id";
import { type MemberWithProfile, type ServerWithMembersWithProfiles } from "@/types"

import ServerChannel from "./server-channel"
import ServerHeader from "./server-header"
import ServerMember from "./server-member"
import ServerSearch from "./server-search"
import ServerSection from "./server-section"

interface ServerSidebarProps {
  profileId: string
}

const ChannelIconMap = {
  [ChannelType.TEXT]: <Hash className="mrh-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4" />,
}

const MemberIconMap = {
  [MemberRole.GUEST]: <Shield className="h-4 w-4" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
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
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2b37] bg-[#F2F3F5]">
      <ServerHeader server={server as unknown as ServerWithMembersWithProfiles} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch server={server as unknown as ServerWithMembersWithProfiles} data={[
            {
              label: 'Text Channels',
              type: 'channel',
              data: textChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: ChannelIconMap[channel.type],
              })),
            },
            {
              label: 'Audio Channels',
              type: 'channel',
              data: audioChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: ChannelIconMap[channel.type],
              })),
            },
            {
              label: 'Video Channels',
              type: 'channel',
              data: videoChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: ChannelIconMap[channel.type],
              })),
            },
            {
              label: 'Members',
              type: 'member',
              data: members?.map(member => ({
                id: member.id,
                name: member.profile.name,
                icon: MemberIconMap[member.role],
              })),
            }
          ]} />
        </div>
        <Separator className="my-2 bg-zinc-300 dark:bg-zinc-700" />
        {
          !!textChannels.length && (
            <div className="mb-2">
              <ServerSection
                label="Text Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.TEXT}
                server={server as unknown as ServerWithMembersWithProfiles}
              />
              <div className="space-y-2">
                {textChannels?.map(channel => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel as unknown as Channel}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )
        }
        {
          !!audioChannels.length && (
            <div className="mb-2">
              <ServerSection
                label="Audio Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.AUDIO}
                server={server as unknown as ServerWithMembersWithProfiles}
              />
              <div className="space-y-2">
                {audioChannels?.map(channel => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel as unknown as Channel}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )
        }
        {
          !!videoChannels.length && (
            <div className="mb-2">
              <ServerSection
                label="Video Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.VIDEO}
                server={server as unknown as ServerWithMembersWithProfiles}
              />
              <div className="space-y-2">
                {videoChannels?.map(channel => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel as unknown as Channel}
                    role={role}
                  />
                ))}

              </div>
            </div>
          )
        }
        {
          !!members.length && (
            <div className="mb-2">
              <ServerSection
                label="Members"
                role={role}
                sectionType="members"
                server={server as unknown as ServerWithMembersWithProfiles}
              />
              <div className="space-y-2">
                {members?.map(member => (
                  <ServerMember
                    key={member.id}
                    member={member as unknown as MemberWithProfile}
                  />
                ))}

              </div>
            </div>
          )
        }
      </ScrollArea>
    </div>
  )
}
