import { type Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSocket } from "@/components/socket-provider";
import { type MemberWithProfile } from "@/types";

type MessageWithMemberWithProfile = Message & {
  member: MemberWithProfile
}

// 分页数据
type MessageData = {
  pages: {
    items: MessageWithMemberWithProfile[]
    nextCursor?: string | null
  }[]
}

interface UseChatSocketProps {
  queryKey: string // 查询 key
  addKey: string // 添加消息 key
  updateKey: string // 更新消息 key
}

export default function useChatSocket({ queryKey, addKey, updateKey }: UseChatSocketProps) {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    // 监听更新消息
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<MessageData>([queryKey], (oldData) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData

        // 遍历数据，更新修改后的消息
        const newData = oldData.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) return message
              return item
            })
          }
        })
        return { ...oldData, pages: newData }
      })
    })


    // 监听添加消息
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<MessageData>([queryKey], (oldData) => {
        // 如果数据为空，则创建新的数据
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message],
            }],
          }
        }

        // 将数据添加到第一页
        const newData = [...oldData.pages]
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items]
        }
        return { ...oldData, pages: newData }
      })
    })

    // 关闭监听
    return () => {
      socket.off(updateKey)
      socket.off(addKey)
    }
  }, [queryClient, queryKey, updateKey, addKey, socket])
}
