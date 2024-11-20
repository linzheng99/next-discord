import { MemberRole } from "@prisma/client"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModalStore } from "@/hooks/use-modal-store"

import { type ServerWithMembersWithProfiles } from "../types"

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  const { onOpen } = useModalStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="ml-auto w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-sm text-black dark:text-neutral-400 space-y-[2px]">
        {
          isModerator && (
            <DropdownMenuItem className="text-indigo-500 dark:text-indigo-400 px-3 py-2 flex items-center hover:!text-indigo-500" onClick={() => onOpen('invite', { server })}>
              Invite People
              <UserPlus className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
        {
          isAdmin && (
            <DropdownMenuItem className="px-3 py-2 flex items-center" onClick={() => onOpen('editServer', { server })}>
              Server Settings
              <Settings className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
        {
          isModerator && (
            <DropdownMenuItem className="px-3 py-2 flex items-center" onClick={() => onOpen('members', { server })}>
              Members Settings
              <Users className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
        {
          isModerator && (
            <DropdownMenuItem className="px-3 py-2 flex items-center">
              Create Channel
              <PlusCircle className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
        {
          isModerator && (
            <DropdownMenuSeparator />
          )
        }
        {
          isAdmin && (
            <DropdownMenuItem className="px-3 py-2 flex items-center text-red-500 dark:text-red-400 hover:!text-red-500">
              Delete Server
              <Trash className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
        {
          !isAdmin && (
            <DropdownMenuItem className="px-3 py-2 flex items-center text-red-500 dark:text-red-400">
              Leave Server
              <LogOut className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

