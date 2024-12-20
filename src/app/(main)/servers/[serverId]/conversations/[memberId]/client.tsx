"use client"

import { type Conversation, type Profile } from "@prisma/client"
import { useSearchParams } from "next/navigation"

import MediaRoom from "@/components/media-room"
import ChatHeader from "@/features/chat/components/chat-header"
import ChatInput from "@/features/chat/components/chat-input"
import ChatMessage from "@/features/chat/components/chat-message"
import { type MemberWithProfile } from "@/types"

interface MemberIdClientProps {
  profile: Profile
  otherMember: MemberWithProfile
  currentMember: MemberWithProfile
  conversation: Conversation

}

export default function MemberIdClient({ profile, otherMember, currentMember, conversation }: MemberIdClientProps) {

  const searchParams = useSearchParams()
  const isVideo = searchParams?.get('video')

  return (
    <div className="flex flex-1 h-full flex-col bg-white dark:bg-[#313338] overflow-hidden">
      <ChatHeader
        name={otherMember.profile.name}
        type="conversation"
        profileId={profile.id}
        imageUrl={otherMember.profile.imageUrl}
      />
      {
        !isVideo && (
          <>
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
              <ChatMessage
                type="conversation"
                name={otherMember.profile.name}
                member={currentMember}
                chatId={conversation.id}
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketQuery={{ conversationId: conversation.id }}
                socketUrl="/api/socket/direct-messages"
              />
            </div>
            <ChatInput
              type="conversation"
              name={otherMember.profile.name}
              apiUrl="/api/socket/direct-messages"
              query={{ conversationId: conversation.id }}
            />
          </>
        )
      }
      {
        isVideo && (
          <MediaRoom
            chatId={conversation.id}
            video={true}
            audio={true}
          />
        )
      }
    </div>
  )
}
