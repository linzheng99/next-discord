import { MemberRole } from "@prisma/client"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConfirm } from "@/hooks/use-confirm"
import { useModalStore } from "@/hooks/use-modal-store"

import { useDeleteServer } from "../api/use-delete-server"
import { useLeaveServer } from "../api/use-leave-server"
import { useServerId } from "../hooks/use-server-id"
import { type ServerWithMembersWithProfiles } from "../types"

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const serverId = useServerId()
  const router = useRouter()
  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  const { onOpen } = useModalStore()

  const [LeaveServerDialog, confirmLeaveServer] = useConfirm(`Leave ${server.name}`, `Are you sure you want to leave this server? This action cannot be undone.`, 'destructive')
  const [DeleteServerDialog, confirmDeleteServer] = useConfirm(`Delete ${server.name}`, `Are you sure you want to delete this server? This action cannot be undone.`, 'destructive')


  const { mutate: leaveServer } = useLeaveServer()
  const { mutate: deleteServer } = useDeleteServer()

  async function handleLeaveServer() {
    const ok = await confirmLeaveServer()
    if (!ok) return

    leaveServer({ param: { serverId } }, {
      onSuccess: () => {
        router.push('/')
      }
    })
  }

  async function handleDeleteServer() {
    const ok = await confirmDeleteServer()
    if (!ok) return

    deleteServer({ param: { serverId } }, {
      onSuccess: () => {
        router.push('/')
      }
    })
  }

  return (
    <>
      <LeaveServerDialog />
      <DeleteServerDialog />
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
              <DropdownMenuItem className="px-3 py-2 flex items-center" onClick={() => onOpen('createChannel', { server })}>
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
              <DropdownMenuItem className="px-3 py-2 flex items-center text-red-500 dark:text-red-400 hover:!text-red-500" onClick={() => handleDeleteServer()}>
                Delete Server
                <Trash className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
            )
          }
          {
            !isAdmin && (
              <DropdownMenuItem className="px-3 py-2 flex items-center text-red-500 dark:text-red-400" onClick={() => handleLeaveServer()}>
                Leave Server
                <LogOut className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

