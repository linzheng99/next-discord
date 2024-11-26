import { redirect } from "next/navigation"

import { getOrCreateConversation } from "@/features/chat/queries"
import { getCurrentMember } from "@/features/members/queries"
import { getCurrentProfile } from "@/lib/current-profile"

import MemberIdClient from "./client"

interface MemberIdPageProps {
  params: Promise<{
    serverId: string
    memberId: string
  }>
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await getCurrentProfile()
  if (!profile) return redirect("/sign-in")

  const { serverId, memberId } = await params

  const currentMember = await getCurrentMember(serverId, profile.id)
  if (!currentMember) return redirect(`/`)

  const conversation = await getOrCreateConversation(currentMember.id, memberId)
  if (!conversation) return redirect(`/servers/${serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne


  return (
    <MemberIdClient
      profile={profile}
      conversation={conversation}
      otherMember={otherMember}
      currentMember={currentMember}
    />
  )
}
