import Image from "next/image"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  imageUrl?: string
  name: string
  className?: string
  fallbackClassName?: string
}

export default function UserAvatar({
  imageUrl,
  name,
  className,
  fallbackClassName
}: UserAvatarProps) {
  if (imageUrl) {
    return (
      <div className={cn("size-10 relative rounded-full overflow-hidden", className)}>
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>
    )
  }
  return (
    <Avatar className={cn("size-10 rounded-full", className)}>
      <AvatarFallback className={cn("bg-blue-600 text-white font-semibold text-sm uppercase rounded-full", fallbackClassName)}>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
