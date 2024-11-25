import { format } from "date-fns"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment } from "react"

import { type MemberWithProfile } from "@/types"

import useChatQuery from "../hooks/use-chat-query"
import { type MessageWithMemberWithProfile } from "../types"
import ChatItem from "./chat-item"
import ChatWelcome from "./chat-welcome"

interface ChatMessageProps {
  name: string // 用户名
  member: MemberWithProfile // 成员
  chatId: string // 频道或对话ID
  apiUrl: string // 获取 message 的 API 地址
  socketUrl: string // WebSocket 连接地址
  socketQuery: Record<string, string> // Socket 连接查询参数
  paramKey: 'channelId' | 'conversationId' // 用于区分是频道还是私聊的参数键
  paramValue: string // Socket 连接参数值
  type: 'channel' | 'conversation' // 聊天类型：频道或私聊
}

const DATE_FORMAT = 'yyyy年MM月dd日 HH:mm'

export default function ChatMessage({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessageProps) {
  const queryKey = `chat:${chatId}`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })

  if (status === 'pending') {
    return (
      <div className="flex flex-1 h-full justify-center items-center overflow-y-auto">
        <div className="flex flex-col items-center gap-y-4">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
          <p className="text-md text-zinc-500 dark:text-zinc-400">
            Loading messages...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 h-full justify-center items-center overflow-y-auto">
        <div className="flex flex-col items-center gap-y-4">
          <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400" />
          <p className="text-md text-zinc-500 dark:text-zinc-400">
            Failed to load messages.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 h-full flex-col py-4 overflow-y-auto">
      <div className="flex-1">
      </div>
      <ChatWelcome name={name} type={type} />
      <div className="flex flex-col-reverse gap-y-4 p-4">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                member={message.member}
                currentMember={member}
                content={message.content}
                deleted={message.deleted}
                fileUrl={message.fileUrl ?? undefined}
                isUpdated={message.updatedAt !== message.createdAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                queryKey={queryKey}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
