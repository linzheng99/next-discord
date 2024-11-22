import { Hash } from "lucide-react"

import MobileToggle from "@/components/mobile-toggle"

interface ChatHeaderProps {
  name: string
  type: 'channel' | 'conversation'
  profileId: string
}

export default function ChatHeader({ name, type, profileId }: ChatHeaderProps) {

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle profileId={profileId} />
      {type === 'channel' &&
        <Hash className="w-4 h-4 mr-2 text-neutral-500 dark:text-neutral-400" />
      }
      <p className="text-md font-semibold text-black dark:text-white">
        {name}
      </p>
    </div>
  )
}
