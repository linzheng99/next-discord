"use client"


import { MemberRole } from "@prisma/client"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useModalStore } from "@/hooks/use-modal-store"

import { useMemberRoleServer } from "../api/use-member-role-server"
import { useServerId } from "../hooks/use-server-id"
import { type ServerWithMembersWithProfiles } from "../types"
import UserAvatar from "./user-avatar"

const roleIconMap = {
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  GUEST: null
}

export default function MembersServerForm() {
  const { data } = useModalStore()
  const serverId = useServerId()
  const { onOpen } = useModalStore()

  const { server } = data as { server: ServerWithMembersWithProfiles }

  const { mutate: updateMemberRole } = useMemberRoleServer()
  const [loadingId, setLoadingId] = useState('')

  function handleMemberRole(memberId: string, role: MemberRole) {
    setLoadingId(memberId)
    updateMemberRole(
      { json: { role }, param: { serverId, memberId } },
      {
        onSuccess: ({ data }) => {
          onOpen('members', { server: data as unknown as ServerWithMembersWithProfiles })
          setLoadingId('')
        },
        onError: () => {
          setLoadingId('')
        }
      }
    )
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Manage Members</CardTitle>
        <CardDescription className="text-center text-zinc-500">
          {server?.members?.length} members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[420px]">
          {server?.members?.map(member => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar name={member.profile.name} imageUrl={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-sm font-semibold text-primary flex items-center gap-x-2">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member.profile.email}
                </p>
              </div>
              {
                member.profileId !== server.profileId && loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="w-4 h-4 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleMemberRole(member.id, MemberRole.MODERATOR)}>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Moderator
                                {member.role === MemberRole.MODERATOR && <Check className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMemberRole(member.id, MemberRole.GUEST)}>
                                <Shield className="w-4 h-4 mr-2" />
                                Guest
                                {member.role === MemberRole.GUEST && <Check className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-500">
                          <Gavel className="w-4 h-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }
              {
                loadingId === member.id && (
                  <Loader2 className="w-4 h-4 ml-auto animate-spin text-primary" />
                )
              }
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
