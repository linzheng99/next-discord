import { MemberRole } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

import MemberAvatar from "@/features/members/components/member-avatar"
import { useMemberId } from "@/hooks/use-member-id"
import { useServerId } from "@/hooks/use-server-id"
import { cn } from "@/lib/utils"
import { type MemberWithProfile } from "@/types"

interface ServerMemberProps {
  member: MemberWithProfile
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500" />,
}

export default function ServerMember({ member }: ServerMemberProps) {
  const icon = roleIconMap[member.role]
  const memberId = useMemberId()
  const router = useRouter()
  const serverId = useServerId()

  return (
    <div
      onClick={() => router.push(`/servers/${serverId}/conversations/${member.id}`)}
      className={cn(
        "group flex items-center justify-between p-2 gap-x-2 cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition w-full rounded-md",
        memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}>
      <div className="flex items-center gap-x-2 max-w-[170px]">
        <MemberAvatar
          name={member.profile.name}
          imageUrl={member.profile.imageUrl}
          className="w-6 h-6 flex-shrink-0"
        />
        <p className={cn(
          "text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition truncate",
          memberId === member.id && "text-primary dark:text-zinc-200"
        )}>
          {member.profile.name}
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        {icon}
      </div>
    </div>
  )
}
