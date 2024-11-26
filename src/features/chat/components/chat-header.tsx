import { Hash } from "lucide-react"

import MobileToggle from "@/components/mobile-toggle"
import MemberAvatar from "@/features/members/components/member-avatar"
import { SocketIndicator } from "@/features/socket/components/socket-indicator"

import ChatVideoButton from "./chat-video-button"

interface ChatHeaderProps {
  name: string
  type: 'channel' | 'conversation'
  profileId: string
  imageUrl?: string
}

export default function ChatHeader({ name, type, profileId, imageUrl }: ChatHeaderProps) {

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle profileId={profileId} />
      {type === 'channel' &&
        <Hash className="w-4 h-4 mr-2 text-neutral-500 dark:text-neutral-400" />
      }
      {type === 'conversation' &&
        <MemberAvatar
          name={name}
          imageUrl={imageUrl}
          className="h-8 w-8 md:h-8 md:w-8 mr-2"
        />
      }
      <p className="text-md font-semibold text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}
