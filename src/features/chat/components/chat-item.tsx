import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod"
import { type Member, MemberRole } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import qs from 'query-string';
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import ActionTooltip from "@/components/action-tooltip"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MemberAvatar from "@/features/members/components/member-avatar"
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils"
import { type MemberWithProfile } from "@/types"

import { editChatContentSchema } from "../schemas"

interface ChatItemProps {
  id: string
  content: string
  fileUrl?: string
  deleted: boolean
  member: MemberWithProfile
  timestamp: string
  currentMember: Member
  isUpdated: boolean
  socketUrl: string // WebSocket 连接地址
  socketQuery: Record<string, string> // 用于 WebSocket 连接的查询参数
  queryKey: string // 查询的唯一键
}

const roleIconMap = {
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  GUEST: null
}

export default function ChatItem({
  id,
  content,
  fileUrl,
  deleted,
  isUpdated,
  member,
  timestamp,
  currentMember,
  socketUrl,
  socketQuery,
  queryKey
}: ChatItemProps) {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const isFile = fileUrl && (content === 'pdf' || content === 'image')

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = member.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isModerator)
  const canEditMessage = !deleted && isOwner && !isFile
  const isPDF = content === 'pdf' && isFile
  const isImage = content === 'image' && isFile

  const [isEditing, setIsEditing] = useState(false)
  const [MessageDeleteDialog, MessageDeleteConfirm] = useConfirm('Delete Message', 'Are you sure you want to delete this message?')


  const form = useForm<z.infer<typeof editChatContentSchema>>({
    resolver: zodResolver(editChatContentSchema),
    defaultValues: {
      content: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    form.reset({
      content
    })
  }, [content])

  async function onSubmit(values: z.infer<typeof editChatContentSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: {
          ...socketQuery,
        }
      })
      await axios.patch(url, {
        content: values.content,
        userId: user?.id
      })
      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteMessage() {
    const ok = await MessageDeleteConfirm()
    if (!ok) return
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: {
          ...socketQuery,
        }
      })
      await axios.delete(url, {
        data: {
          userId: user?.id
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 监听 esc 键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsEditing(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])


  return (
    <div className="relative group items-center flex w-full hover:bg-black/5 p-4 transition rounded-md">
      <MessageDeleteDialog />
      <div className="group flex gap-x-2 w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <MemberAvatar name={member.profile.name} imageUrl={member.profile.imageUrl} className="size-8" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2 items-start">
            <div className="flex items-center gap-x-2">
              <p className="text-sm font-semibold hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {
            isImage && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md overflow-hidden border bg-secondary size-48 flex flex-col">
                <Image src={fileUrl} alt="Image" fill className="object-cover" />
              </a>
            )
          }
          {
            isPDF && (
              <div className="relative flex items-center mt-2">
                <div className="flex items-center w-auto bg-muted p-2 rounded-md min-w-[200px]">
                  <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-indigo-500 hover:underline dark:text-indigo-400 whitespace-normal break-all">
                    PDF File
                  </a>
                </div>
              </div>
            )
          }
          {
            !isFile && !isEditing && (
              <p className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}>
                {content}
                {isUpdated && !deleted && (
                  <span className="mx-2 text-2.5 text-zinc-500 dark:text-zinc-400">
                    (edited)
                  </span>
                )}
              </p>
            )
          }
          {
            !fileUrl && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-x-2 pt-2 w-full">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              className="bg-zinc-200/90 dark:bg-zinc-700/75 border-0 focus-visible:ring-0 focus-visible:ring-offset-0  text-zinc-600 dark:text-zinc-200"
                              placeholder="Edit message..."
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    Save
                  </Button>
                </form>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Press Esc to cancel, Enter to save
                </span>
              </Form>
            )
          }
        </div>
      </div>
      {
        canDeleteMessage && (
          <div className="hidden group-hover:flex items-center gap-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 absolute top-2 right-2 bg-white dark:bg-zinc-800 p-1 rounded-md space-x-2">
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash
                onClick={handleDeleteMessage}
                className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          </div>
        )
      }
    </div>
  )
}
